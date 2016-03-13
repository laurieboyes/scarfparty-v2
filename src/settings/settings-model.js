import p from 'pubsub';

const settingsModel = {
	patternUrl: null,
	colours: {
		a:null,
		b:null
	},
	increment: null
};

p.subscribe('/settings/patternUrl', newUrl => settingsModel.patternUrl = newUrl);

export default settingsModel;
