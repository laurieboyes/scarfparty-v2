import p from 'pubsub';
import Pattern from './pattern'
import PatternDisplay from './pattern-display'
import deepCopyObject from './util/deepCopyObject';

const model = {
	stitch: 0,
	increment: 6,
	pattern: null,
	patternDisplay: null,
	colours: {
		notDone: {
			a: '#CECECE',
			b: '#B20000'
		},
		done: {
			a: '#808080',
			b: '#660000'
		}
	},

	getTotalStitches,
	getRowsDone,
	getRowStitchesDone,
	isRightSide,
	isStitchDoneYet
};

function getTotalStitches() {
	return model.pattern.width * model.pattern.height;
}

function getRowsDone() {
	return Math.floor(model.stitch / model.pattern.width);
}

function getRowStitchesDone () {
	return model.stitch % model.pattern.width;
}

function isRightSide() {
	return Math.floor(model.stitch / model.pattern.width) % 2 === 0;
}

function isStitchDoneYet(rowIndexFromTop, rowStitch) {

	if(rowStitch > (model.pattern.width - 1)) {
		throw new Error(`Row stitch ${rowStitch} out of range, must be between 0 and ${model.pattern.width - 1}`);
	}

	const thisStitch = (rowIndexFromTop * model.pattern.width) + rowStitch;
	const totalStitches = model.pattern.width * model.pattern.height;
	const remainingStitches = totalStitches - model.stitch;

	return thisStitch >= remainingStitches;
}


// event handling

p.subscribe('/stitch', stitch => {
	model.stitch = stitch;
	localStorage.stitch = stitch;
});

p.subscribe('/stitch/do', () => p.publish('/stitch', Math.min(model.stitch + model.increment, getTotalStitches())));
p.subscribe('/stitch/unpick', () => p.publish('/stitch', Math.max(model.stitch - model.increment, 0)));

p.subscribe('/settings/open', () => {

	p.publish('/settings/updateFromModel', {
		patternImg: model.pattern.img,
		colours: deepCopyObject(model.colours.notDone)
	});
});

p.subscribe('/save-settings', settingsModel => {

	model.pattern = new Pattern(settingsModel.patternImg);

	if(model.patternDisplay) {
		model.patternDisplay.tearDown();
	}
	model.patternDisplay = new PatternDisplay(model.pattern);
	p.publish('/stitch', model.stitch);

	localStorage.patternUrl = settingsModel.patternImg.src;
});

export default model;

