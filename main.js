import initControls from './src/controls'
import initSettingsUi from './src/settings/settings-ui'
import model from './src/model'
import p from 'pubsub'
import ready from './src/util/ready'
import loadImage from './src/util/loadImage'

function setup (patternUrl, colours, increment, stitch) {

	const settingsModel = {
		patternImg: null,
		colours: colours,
		increment: increment
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


	let patternUrl;
	let colours;
	let increment;
	let stitch;
	if (localStorage.getItem('patternUrl')) {

		patternUrl = localStorage.getItem('patternUrl');
		colours = JSON.parse(localStorage.getItem('colours'));
		stitch = +localStorage.getItem('stitch');
		increment = +localStorage.getItem('increment');

	} else {

		patternUrl = 'default-pattern.png';
		colours = {
			a: '#CECECE',
			b: '#B20000'
		};
		stitch = 0;
		increment = 6;

		p.publish('/settings/open');
	}

	setup(
		patternUrl,
		colours,
		increment,
		stitch
	).catch(console.err);

});


