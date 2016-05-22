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

function handleUiColourUpdate (aOrB, newColour) {
	if(hexColourPattern.test(newColour)) {
		if(!newColour.startsWith('#')) {
			newColour = '#' + newColour;
		}

		settingsModel.colours[aOrB] = newColour;
		p.publish('/settings/colours/' + aOrB, newColour);
	}
}

p.subscribe('/settings/ui/colours/a', newColour => handleUiColourUpdate('a', newColour));
p.subscribe('/settings/ui/colours/b', newColour => handleUiColourUpdate('b', newColour));

p.subscribe('/settings/ui/increment', inc => settingsModel.increment = inc);

p.subscribe('/settings/updateFromModel', model => {
	p.publish('/settings/patternImg', model.patternImg);
	p.publish('/settings/ui/colours/a', model.colours.a);
	p.publish('/settings/ui/colours/b', model.colours.b);
	p.publish('/settings/ui/increment', model.increment);
});

export default settingsModel;
