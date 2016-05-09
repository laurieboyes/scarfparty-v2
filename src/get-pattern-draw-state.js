import isStitchRightSide from './util/is-stitch-right-side';

// Br = from bottom right
// Tl = from top left

export default function (patternRowsTl, currentStitchBr, previousStitchBr) {

	const rowLength = patternRowsTl[0].length;
	const totalStitches = patternRowsTl.length * rowLength;
	const currentStitchTl = (totalStitches - currentStitchBr) - 1;
	const previousStitchTl = (totalStitches - previousStitchBr);

	const drawStateRowsTl = [];

	let startRowNumber;
	let endRowNumber;
	let startRowStitchNumber;
	let endRowStitchNumber;

	if (previousStitchBr === undefined) {

		startRowNumber = 0;
		endRowNumber = patternRowsTl.length - 1;

		startRowStitchNumber = 0;
		endRowStitchNumber = rowLength - 1;

	} else if (previousStitchBr < currentStitchBr) {

		startRowNumber = Math.floor(currentStitchTl / rowLength);
		endRowNumber = Math.floor(previousStitchTl / rowLength);

		startRowStitchNumber = currentStitchTl % rowLength;
		endRowStitchNumber = (previousStitchTl - 1) % rowLength - 1;

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

				if((rowI === startRowNumber) && (startRowStitchNumber > rowStitchI)) {
					rowDrawing.push(null);
				} else if((rowI === endRowNumber) && (endRowStitchNumber < rowStitchI)) {
					// don't push anything
				} else {
					if (rowStitch) {
						rowDrawing.push(donePrefix + 'b');
					} else {
						rowDrawing.push(donePrefix + 'w');
					}
				}
			})
		}
	});


	return drawStateRowsTl;
}
