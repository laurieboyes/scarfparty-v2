import p from 'pubsub'

const model = {
	stitch: 0,
	increment: 6
};

p.subscribe("/stitch", function(stitch){
	model.stitch = stitch;
});

p.subscribe("/stitch/do", function(){
	p.publish('/stitch', model.stitch += model.increment);
});

export default model;

