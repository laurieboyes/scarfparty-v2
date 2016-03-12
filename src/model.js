import p from 'pubsub'

const model = {
	stitch: 0,
	increment: 6,
	pattern: null,
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

	getRowsDone,
	getRowStitchesDone,
	isRightSide,
	isStitchDoneYet
};

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

p.subscribe('/stitch', stitch => model.stitch = stitch);
p.subscribe('/stitch/do', () => p.publish('/stitch', model.stitch + model.increment));
p.subscribe('/stitch/unpick', () => p.publish('/stitch', Math.max(model.stitch - model.increment, 0)));

export default model;

