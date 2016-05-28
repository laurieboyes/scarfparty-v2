import p from 'pubsub';
import settingsModel from './settings-model'
import initPatternPreview from './pattern-preview'
import parseStitchMarkers from '../util/parse-stitch-markers'

export default function init() {

	initPatternPreview();

	const settingsEl = document.querySelector('.js-settings');
	const openEl = document.querySelector('.js-settings-open');
	const saveAndCloseEl = document.querySelector('.js-settings-save-and-close');
	const closeEl = document.querySelector('.js-settings-close');
	const patternUrlEl = document.querySelector('.js-pattern-url');
	const colourAInputEl = document.querySelector('.js-colour-a-input');
	const colourASwatchEl = document.querySelector('.js-colour-a-swatch');
	const colourBInputEl = document.querySelector('.js-colour-b-input');
	const colourBSwatchEl = document.querySelector('.js-colour-b-swatch');
	const incrementEl = document.querySelector('.js-increment');
	const stitchMarkersEl = document.querySelector('.js-stitch-markers-input');

	// control event listeners

	openEl.addEventListener('click', () => {
		p.publish('/settings/open');
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

	colourAInputEl.addEventListener('input', () => {
		p.publish('/settings/ui/colours/a', colourAInputEl.value);
	});

	colourBInputEl.addEventListener('input', () => {
		p.publish('/settings/ui/colours/b', colourBInputEl.value);
	});

	incrementEl.addEventListener('input', () => {
		if(!isNaN(+incrementEl.value) && +incrementEl.value > 0) {
			p.publish('/settings/ui/increment', +incrementEl.value);
		}
	});

	stitchMarkersEl.addEventListener('input', () => {
		const newStitchMarkers = parseStitchMarkers(stitchMarkersEl.value);
		p.publish('/settings/ui/stitchMarkers', newStitchMarkers);
	});


	// other event handling

	p.subscribe('/settings/open', () => {
		settingsEl.classList.add('is-open');
	});

	p.subscribe('/settings/patternImg', newImg => {
		if(newImg.src !== patternUrlEl.value) {
			patternUrlEl.value = newImg.src
		}
	});

	p.subscribe('/settings/colours/a', newColour => {
		colourASwatchEl.style.backgroundColor = newColour;

		if(colourAInputEl !== document.activeElement) {
			colourAInputEl.value = newColour;
		}
	});

	p.subscribe('/settings/colours/b', newColour => {
		colourBSwatchEl.style.backgroundColor = newColour;

		if(colourBInputEl !== document.activeElement) {
			colourBInputEl.value = newColour;
		}
	});

	p.subscribe('/settings/ui/increment', newInc => {
		if(incrementEl !== document.activeElement) {
			incrementEl.value = newInc;
		}
	});

	p.subscribe('/settings/ui/stitchMarkers', newSm => {
		if(stitchMarkersEl !== document.activeElement) {
			stitchMarkersEl.value = newSm.reduce((str, thisSm, i) => {
				return str + thisSm + (i + 1 !== newSm.length ? ',' : '')
			}, '');
		}
	});
}
