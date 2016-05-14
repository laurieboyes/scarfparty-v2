import p from 'pubsub';
import Pattern from './pattern'
import PatternDisplay from './pattern-display'
import deepCopyObject from './util/deep-copy-object';
import tweakColourLuminance from './util/tweak-colour-luminance';
import isStitchRightSide from './util/is-stitch-right-side';

const model = {
	stitch: 0,
	increment: 3,
	pattern: null,
	patternDisplay: null,
	colours: null,

	getTotalStitches,
	getRowsDone,
	getRowStitchesDone,
	getRowNumberOfStitch,
	isRightSide,
	isStitchDoneYet,
	getColoursReversed
};

function getTotalStitches() {
	return model.pattern.width * model.pattern.height;
}

function getRowsDone() {
	return model.getRowNumberOfStitch(model.stitch);
}

function getRowStitchesDone () {
	return model.stitch % model.pattern.width;
}

function getRowNumberOfStitch(stitch) {
	return Math.floor(stitch / model.pattern.width);
}

function isRightSide() {
	return isStitchRightSide(model.stitch, model.pattern.width);
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

function getColoursReversed() {
	return {
		done: {
			a: model.colours.done.b,
			b: model.colours.done.a
		},
		notDone: {
			a: model.colours.notDone.b,
			b: model.colours.notDone.a
		}
	}
}


// event handling

p.subscribe('/stitch', stitch => {
	model.stitch = stitch;
	localStorage.stitch = stitch;
});

p.subscribe('/stitch/do', () => p.publish('/stitch', Math.min(model.stitch + model.increment, getTotalStitches())));
p.subscribe('/stitch/unpick', () => p.publish('/stitch', Math.max(model.stitch - model.increment, 0)));

p.subscribe('/settings/open', () => {
	if(model.pattern) {
		p.publish('/settings/updateFromModel', {
			patternImg: model.pattern.img,
			colours: deepCopyObject(model.colours.notDone)
		});
	}
});

p.subscribe('/save-settings', settingsModel => {

	model.pattern = new Pattern(settingsModel.patternImg);

	if(model.patternDisplay) {
		model.patternDisplay.tearDown();
	}
	model.patternDisplay = new PatternDisplay(model.pattern);

	model.colours = {
		notDone: deepCopyObject(settingsModel.colours),
		done: {
			a: tweakColourLuminance(settingsModel.colours.a, -0.4),
			b: tweakColourLuminance(settingsModel.colours.b, -0.4)
		}
	};

	p.publish('/stitch', model.stitch);

	localStorage.patternUrl = settingsModel.patternImg.src;
	localStorage.colours = JSON.stringify(settingsModel.colours);
});

export default model;

