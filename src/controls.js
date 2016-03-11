import model from './model'
import p from 'pubsub'

export default function init() {

	const stitchCountInput = document.querySelector('.js-stitch-count-input');
	const rowCount = document.querySelector('.js-row');
	const rowStitch = document.querySelector('.js-row-stitch');
	const side = document.querySelector('.js-side');


	// event firing

	stitchCountInput.addEventListener('input', () => {
		if(stitchCountInput.value.length && parseInt(stitchCountInput.value) !== model.stitch) {
			p.publish('/stitch', parseInt(stitchCountInput.value));
		}
	});

	document.querySelector('.js-do-stitch').addEventListener('click', () => p.publish('/stitch/do'));
	document.querySelector('.js-do-unpick').addEventListener('click', () => p.publish('/stitch/unpick'));


	// event reacting

	p.subscribe("/stitch", (stitch) => {
		stitchCountInput.value = stitch;
		rowCount.innerHTML = model.getRowsDone();
		rowStitch.innerHTML = model.getRowStitchesDone();
		side.innerHTML = model.isRightSide() ? 'RS' : 'WS';

	});

}

