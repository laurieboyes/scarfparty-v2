import p from 'pubsub';
import debounce from '../../node_modules/lodash/function/debounce';

let patternPreviewImageContainer;
let patternPreviewError;
let patternPreviewLoadingSpinner;

function showLoadingSpinner() {
	patternPreviewLoadingSpinner.classList.add('is-showing');
	patternPreviewError.classList.remove('is-showing');
	patternPreviewImageContainer.classList.remove('is-showing');
}

function showError(errorMessage) {
	patternPreviewError.classList.add('is-showing');
	patternPreviewImageContainer.classList.remove('is-showing');
	patternPreviewLoadingSpinner.classList.remove('is-showing');
	patternPreviewError.innerHTML = errorMessage;
}

function showImage(img) {
	patternPreviewImageContainer.classList.add('is-showing');
	patternPreviewError.classList.remove('is-showing');
	patternPreviewLoadingSpinner.classList.remove('is-showing');

	img.classList.add('pattern-preview__image');
	patternPreviewImageContainer.innerHTML = '';
	patternPreviewImageContainer.appendChild(img);
}

function updatePatternUrl(newUrl) {
	const img = new Image();
	img.crossOrigin = 'Anonymous';
	img.src = newUrl;

	img.onload = function () {
		showImage(img);
	};

	img.onerror = function() {
		showError('Couldn\'t get image');
	}
}

export default function init() {

	patternPreviewImageContainer = document.querySelector('.js-pattern-preview-image-container');
	patternPreviewError = document.querySelector('.js-pattern-preview-error');
	patternPreviewLoadingSpinner = document.querySelector('.js-pattern-preview-loading-spinner');

	const updatePatternUrlDebounced = debounce(newUrl => {
		updatePatternUrl(newUrl);
	}, 500);

	p.subscribe('/settings/patternUrl', newUrl => {
		showLoadingSpinner();
		updatePatternUrlDebounced(newUrl);
	});
}
