import p from 'pubsub'

const model = {
	stitch: 0,
	increment: 6,
	width: null,

	getRowsDone,
	getRowStitchesDone,
	isRightSide
};

function getRowsDone() {
	return Math.floor(model.stitch / model.width);
}

function getRowStitchesDone () {
	return model.stitch % model.width;
}

function isRightSide() {
	return Math.floor(model.stitch / model.width) % 2 === 0;
}


// event handling

p.subscribe("/stitch", function(stitch){
	model.stitch = stitch;
});

p.subscribe("/stitch/do", () => p.publish('/stitch', model.stitch + model.increment));
p.subscribe("/stitch/unpick", () => p.publish('/stitch', Math.max(model.stitch - model.increment, 0)));

export default model;

