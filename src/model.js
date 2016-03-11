import p from 'pubsub'

const model = {
	stitch: 0,
	increment: 6,
	pattern: null,

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

/**
 * @param thisRow row in question (0 being the topmost and last)
 * @param thisRowStitch
 * @returns {boolean}
 */
function isStitchDoneYet(thisRow, thisRowStitch) {

	const thisStitch = (thisRow * model.pattern.width) + thisRowStitch;
	const totalStitches = model.pattern.width * model.pattern.height;
	const remainingStitches = totalStitches - model.stitch;

	return thisStitch >= remainingStitches;
}


// event handling

p.subscribe('/stitch', stitch => model.stitch = stitch);
p.subscribe('/stitch/do', () => p.publish('/stitch', model.stitch + model.increment));
p.subscribe('/stitch/unpick', () => p.publish('/stitch', Math.max(model.stitch - model.increment, 0)));

export default model;

