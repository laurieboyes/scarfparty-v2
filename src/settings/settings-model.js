import p from 'pubsub';

const hexColourPattern = /^#?(?:[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const settingsModel = {
	patternImg: null,
	colours: {
		a:null,
		b:null
	},
	increment: null
};

p.subscribe('/settings/patternImg', newImg => settingsModel.patternImg = newImg);

p.subscribe('/settings/ui/colours/a', newColour => {
	if(hexColourPattern.test(newColour)) {
		if(!newColour.startsWith('#')) {
			newColour = '#' + newColour;
		}

		settingsModel.colours.a = newColour;
		p.publish('/settings/colours/a', newColour);
	}
});


export default settingsModel;
