import p from 'pubsub';
import model from '../model'
import settingsModel from './settings-model'
import initPatternPreview from './pattern-preview'

export default function init() {

	initPatternPreview();

	const settingsEl = document.querySelector('.js-settings');
	const openEl = document.querySelector('.js-settings-open');
	const saveAndCloseEl = document.querySelector('.js-settings-save-and-close');
	const closeEl = document.querySelector('.js-settings-close');
	const patternUrlEl = document.querySelector('.js-pattern-url');


	// control event listeners

	openEl.addEventListener('click', () => {
		settingsEl.classList.add('is-open');
		p.publish('/settings/patternImg', model.pattern.img);
	});

	closeEl.addEventListener('click', () => {
		settingsEl.classList.remove('is-open');
	});

	saveAndCloseEl.addEventListener('click', () => {
		p.publish('/save-settings', settingsModel);
		settingsEl.classList.remove('is-open');
	});

	patternUrlEl.addEventListener('input', () => {
		p.publish('/settings/patternUrl', patternUrlEl.value);
	});


	// other event handling

	p.subscribe('/settings/patternImg', newImg => {
		if(newImg.src !== patternUrlEl.value) {
			patternUrlEl.value = newImg.src
		}
	});
}
