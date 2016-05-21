import initControls from './src/controls'
import initSettingsUi from './src/settings/settings-ui'
import model from './src/model'
import p from 'pubsub'
import ready from './src/util/ready'
import loadImage from './src/util/loadImage'

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


	if(localStorage.getItem('patternUrl')) {

		const settingsModel = {
			patternImg: null,
			colours: null
		};

		const savedColours = localStorage.getItem('colours');
		if(savedColours) {
			settingsModel.colours = JSON.parse(savedColours);
		} else {
			settingsModel.colours = {
				a: '#CECECE',
				b: '#B20000'
			}
		}

		loadImage(localStorage.getItem('patternUrl'))
			.then(img => {

				document.querySelector('.js-pattern-container-loading-spinner').classList.remove('is-showing');
				document.querySelector('.js-pattern').classList.add('is-showing');

				settingsModel.patternImg = img;

				model.stitch =  +localStorage.getItem('stitch') || 0;
				p.publish('/save-settings', settingsModel);
			})
	} else {
		p.publish('/settings/useDefaults');
		p.publish('/settings/open');
	}


});


