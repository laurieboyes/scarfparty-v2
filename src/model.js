import p from 'pubsub'

const model = {
	stitch: 0,
	increment: 6
};

p.subscribe("/stitch", function(stitch){
	model.stitch = stitch;
});

p.subscribe("/stitch/do", () => p.publish('/stitch', model.stitch + model.increment));
p.subscribe("/stitch/unpick", () => p.publish('/stitch', Math.max(model.stitch - model.increment, 0)));

export default model;

