import model from './model'
import p from 'pubsub'

export default function init() {

	// event firing

	const stitchCountInput = document.querySelector('.js-stitch-count-input');
	stitchCountInput.addEventListener('input', () => {
		if(stitchCountInput.value.length && parseInt(stitchCountInput.value) !== model.stitch) {
			p.publish('/stitch', parseInt(stitchCountInput.value));
		}
	});

	const doStitchButton = document.querySelector('.js-do-stitch');
	doStitchButton.addEventListener('click', () => p.publish('/stitch/do'));


	// event reacting

	p.subscribe("/stitch", (stitch) => stitchCountInput.value = stitch);

}

