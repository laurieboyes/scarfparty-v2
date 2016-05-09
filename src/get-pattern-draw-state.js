import isStitchRightSide from './util/is-stitch-right-side';

// Br = from bottom right
// Tl = from top left

export default function (patternRowsTl, currentStitchBr, previousStitchBr) {

	const rowLength = patternRowsTl[0].length;
	const totalStitches = patternRowsTl.length * rowLength;
	const currentStitchTl = (totalStitches - currentStitchBr) - 1;
	const previousStitchTl = (totalStitches - previousStitchBr);

	const onRightSide = isStitchRightSide(currentStitchBr, rowLength);

	const drawStateRowsTl = [];

	let startRowNumber;
	let endRowNumber;
	let startRowStitchNumber;
	let endRowStitchNumber;

	if (typeof previousStitchBr !== 'number') {

		startRowNumber = 0;
		endRowNumber = patternRowsTl.length - 1;

		startRowStitchNumber = 0;
		endRowStitchNumber = rowLength - 1;

	} else if (previousStitchBr < currentStitchBr) {

		startRowNumber = Math.floor(currentStitchTl / rowLength);
		endRowNumber = Math.floor(previousStitchTl / rowLength);

		startRowStitchNumber = currentStitchTl % rowLength;
		endRowStitchNumber = (previousStitchTl - 1) % rowLength;

	} else if (previousStitchBr > currentStitchBr) {
		startRowNumber = Math.floor(previousStitchTl / rowLength);
		endRowNumber = Math.floor(currentStitchTl / rowLength);

		startRowStitchNumber = (previousStitchTl % rowLength) - 1;
		endRowStitchNumber = (currentStitchTl -1) % rowLength;

	} else { // previousStitchBr === currentStitchBr
		return [];
	}

	patternRowsTl.forEach((row, rowI) => {
		const rowDrawing = [];
		drawStateRowsTl.push(rowDrawing);

		if (rowI >= startRowNumber && rowI <= endRowNumber) {
			row.forEach((rowStitch, rowStitchI) => {
				const thisRowStitchFromTopLeft = (rowI * row.length) + rowStitchI;
				const donePrefix = currentStitchTl <= thisRowStitchFromTopLeft ? 'd' : '';

				if((rowI === startRowNumber)) {
					console.log('startRowStitchNumber', startRowStitchNumber);
					console.log('rowStitchI', rowStitchI);
				}
				if((rowI === endRowNumber)) {
					console.log('endRowStitchNumber', endRowStitchNumber);
					console.log('rowStitchI', rowStitchI);
				}

				if((rowI === startRowNumber) && (startRowStitchNumber >= rowStitchI)) {
					rowDrawing.push(null);
					console.log('null');
				} else if((rowI === endRowNumber) && (endRowStitchNumber < rowStitchI)) {
					// don't push anything
					console.log('nothing');
				} else {
					console.log('a colour thing');
					if (rowStitch) {
						rowDrawing.push(donePrefix + (onRightSide ? 'b' : 'w'));
					} else {
						rowDrawing.push(donePrefix + (onRightSide ? 'w' : 'b'));
					}
				}
			})
		}
	});


	return drawStateRowsTl;
}
