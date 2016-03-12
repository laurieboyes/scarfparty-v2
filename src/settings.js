export default function init() {

	const settingsEl = document.querySelector('.js-settings');
	const openEl = document.querySelector('.js-settings-open');
	const closeEl = document.querySelector('.js-settings-close');

	openEl.addEventListener('click', () => {
		settingsEl.classList.add('is-open');
	});

	closeEl.addEventListener('click', () => {
		settingsEl.classList.remove('is-open');
	});
}

