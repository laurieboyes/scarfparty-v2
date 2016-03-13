import initControls from './src/controls'
import initSettings from './src/settings/settings'
import model from './src/model'
import p from 'pubsub'
import ready from './src/util/ready'
import loadImage from './src/util/loadImage'

ready(() => {

	initControls();
	initSettings();

	if(localStorage.getItem('patternUrl')) {
		loadImage(localStorage.getItem('patternUrl'))
			.then(img => {

				p.publish('/save-settings', {
					patternImg: img
				});
				p.publish('/stitch', +localStorage.getItem('stitch') || 0);
			})
	} else {
		p.publish('/settings/open');
	}


});


