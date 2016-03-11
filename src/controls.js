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

	document.querySelector('.js-do-stitch').addEventListener('click', () => p.publish('/stitch/do'));
	document.querySelector('.js-do-unpick').addEventListener('click', () => p.publish('/stitch/unpick'));


	// event reacting

	p.subscribe("/stitch", (stitch) => stitchCountInput.value = stitch);

}

