import model from './model'
import p from 'pubsub'

export default function init() {

	const stitchCountInputEl = document.querySelector('.js-stitch-count-input');
	const rowCountEl = document.querySelector('.js-row');
	const rowStitchEl = document.querySelector('.js-row-stitch');
	const sideEl = document.querySelector('.js-side');
	const doStitchEl = document.querySelector('.js-do-stitch');
	const doUnpickEl = document.querySelector('.js-do-unpick');


	// event firing

	stitchCountInputEl.addEventListener('input', () => {
		let intVal = parseInt(stitchCountInputEl.value);

		if(!isNaN(intVal) && intVal >= 0 && intVal <= model.getTotalStitches() && intVal !== model.stitch) {
			p.publish('/stitch', parseInt(stitchCountInputEl.value));
		}
	});

	stitchCountInputEl.addEventListener('focusout', () => {
		if(+stitchCountInputEl.value !== model.stitch) {
			stitchCountInputEl.value = model.stitch;
		}
	});

	doStitchEl.addEventListener('click', () => p.publish('/stitch/do'));
	doUnpickEl.addEventListener('click', () => p.publish('/stitch/unpick'));


	// event reacting

	p.subscribe("/stitch", stitch => {
		stitchCountInputEl.value = stitch;
		rowCountEl.innerHTML = model.getRowsDone();
		rowStitchEl.innerHTML = model.getRowStitchesDone();
		sideEl.innerHTML = model.isRightSide() ? 'RS' : 'WS';

	});

	p.subscribe("/increment", increment => {
		doStitchEl.value = 'Stitch ' + increment;
		doUnpickEl.value = 'Unpick ' + increment;
	});

}

