import initControls from './src/controls'
import initSettingsUi from './src/settings/settings-ui'
import model from './src/model'
import p from 'pubsub'
import ready from './src/util/ready'
import loadImage from './src/util/load-image'

function setup (patternUrl, colours, increment, stitchMarkers, stitch) {

	const settingsModel = {
		patternImg: null,
		colours: colours,
		increment: increment,
		stitchMarkers: stitchMarkers
	};

	return loadImage(patternUrl)
		.then(img => {

			document.querySelector('.js-pattern-container-loading-spinner').classList.remove('is-showing');
			document.querySelector('.js-pattern').classList.add('is-showing');

			settingsModel.patternImg = img;

			model.stitch = stitch || 0;
			p.publish('/save-settings', settingsModel);
			p.publish('/settings/updateFromModel', settingsModel)
		})

}

ready(() => {

	initControls();
	initSettingsUi();

	// todo put this somewhere better
	const patternContainerEl = document.querySelector('.js-pattern-container');
	const screenHeight = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;
	const controlsHeight = document.querySelector('.controls').offsetHeight;
	const marginCompensation = 55;
	patternContainerEl.style.height = `${screenHeight - (controlsHeight + marginCompensation)}px`;


	const defaultColours = {
		a: '#CECECE',
		b: '#B20000'
	};

	let patternUrl;
	let colours;
	let increment;
	let stitchMarkers;
	let stitch;
	if (localStorage.getItem('patternUrl')) {

		patternUrl = localStorage.getItem('patternUrl');
		colours = JSON.parse((localStorage.getItem('colours') || JSON.stringify(defaultColours)));
		stitch = +(localStorage.getItem('stitch') || 0);
		increment = +(localStorage.getItem('increment') || 6);
		stitchMarkers = JSON.parse(localStorage.getItem('stitchMarkers') || '[]');

	} else {

		patternUrl = 'default-pattern.png';
		colours = {
			a: '#CECECE',
			b: '#B20000'
		};
		stitch = 0;
		increment = 6;
		stitchMarkers = [];

		p.publish('/settings/open');
	}

	setup(
		patternUrl,
		colours,
		increment,
		stitchMarkers,
		stitch
	).catch(console.err);

});


