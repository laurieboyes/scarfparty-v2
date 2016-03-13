import debounce from 'lodash/function/debounce';

export default function init() {

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

	const debouncedUpdatePatternUrl =  debounce(() => {
		updatePatternUrl(patternUrlEl.value);
	}, 500);

	patternUrlEl.addEventListener('input', () => {
		debouncedUpdatePatternUrl();
	})
}


//todo  consider moving into different file:

const patternPreviewImageContainer = document.querySelector('.js-pattern-preview-image-container');
const patternPreviewError = document.querySelector('.js-pattern-preview-error');

function updatePatternUrl(patternUrl) {
	console.log('beep', patternUrl);

	// todo DRY up
	const img = new Image();
	img.crossOrigin = 'Anonymous';
	img.src = patternUrl;

	img.onload = function () {
		patternPreviewError.classList.remove('is-showing');
		patternPreviewImageContainer.classList.add('is-showing');

		img.classList.add('pattern-preview__image');
		patternPreviewImageContainer.innerHTML = '';
		patternPreviewImageContainer.appendChild(img);
	};

	img.onerror = function() {
		patternPreviewImageContainer.classList.remove('is-showing');
		patternPreviewError.classList.add('is-showing');
		patternPreviewError.innerHTML = 'Couldn\'t get image';
	}

}
