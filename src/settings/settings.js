import p from 'pubsub';
import initPatternPreview from './pattern-preview'

export default function init() {

	initPatternPreview();

	const settingsEl = document.querySelector('.js-settings');
	const openEl = document.querySelector('.js-settings-open');
	const saveAndCloseEl = document.querySelector('.js-settings-save-and-close');
	const closeEl = document.querySelector('.js-settings-close');
	const patternUrlEl = document.querySelector('.js-pattern-url');

	openEl.addEventListener('click', () => {
		settingsEl.classList.add('is-open');
	});

	closeEl.addEventListener('click', () => {
		settingsEl.classList.remove('is-open');
	});

	saveAndCloseEl.addEventListener('click', () => {

		// todo save changes

		settingsEl.classList.remove('is-open');
	});

	patternUrlEl.addEventListener('input', () => {
		p.publish('/settings/patternUrl', patternUrlEl.value);
	})
}
