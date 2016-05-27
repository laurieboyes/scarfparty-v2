import isStitchRightSide from './../util/is-stitch-right-side';

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
		endRowNumber = Math.floor((previousStitchTl - 1) / rowLength);

		startRowStitchNumber = (currentStitchTl % rowLength) + 1;
		endRowStitchNumber = (previousStitchTl - 1) % rowLength;

	} else if (previousStitchBr > currentStitchBr) {
		startRowNumber = Math.floor(previousStitchTl / rowLength);
		endRowNumber = Math.floor(currentStitchTl / rowLength);

		startRowStitchNumber = previousStitchTl % rowLength;
		endRowStitchNumber = currentStitchTl % rowLength;

	} else { // previousStitchBr === currentStitchBr
		return [];
	}

	patternRowsTl.forEach((row, rowI) => {
		const rowDrawing = [];
		drawStateRowsTl.push(rowDrawing);

		if (rowI >= startRowNumber && rowI <= endRowNumber) {

			const possiblyFlippedRow = onRightSide ? row : row.slice().reverse();

			possiblyFlippedRow.forEach((rowStitch, rowStitchI) => {
				const thisRowStitchFromTopLeft = (rowI * possiblyFlippedRow.length) + rowStitchI;
				const donePrefix = currentStitchTl < thisRowStitchFromTopLeft ? 'd' : '';

				if((rowI === startRowNumber) && (startRowStitchNumber > rowStitchI)) {
					rowDrawing.push(null);
				} else if((rowI === endRowNumber) && (endRowStitchNumber < rowStitchI)) {
					// don't push anything
				} else {
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
