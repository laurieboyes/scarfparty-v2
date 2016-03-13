import p from 'pubsub';

const settingsModel = {
	patternImg: null,
	colours: {
		a:null,
		b:null
	},
	increment: null
};

p.subscribe('/settings/patternImg', newImg => settingsModel.patternImg = newImg);

export default settingsModel;
