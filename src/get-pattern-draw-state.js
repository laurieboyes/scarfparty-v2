import isStitchRightSide from './util/is-stitch-right-side';

// Br = from bottom right
// Tl = from top left

export default function (patternRowsTl, currentStitchBr, previousStitchBrt) {

	const totalStitches = patternRowsTl.length * patternRowsTl[0].length;
	const currentStitchTl = (totalStitches - currentStitchBr) - 1;
	const previousStitchTl = (totalStitches - previousStitchBrt);

	const drawStateRowsTl = [];

	if (previousStitchBrt === undefined) {

		patternRowsTl.forEach((row, rowI) => {
			const rowDrawing = [];
			drawStateRowsTl.push(rowDrawing);
			row.forEach((rowStitch, rowStitchI) => {
				const thisRowStitchFromTopLeft = (rowI * row.length) + rowStitchI;
				const donePrefix = currentStitchTl <= thisRowStitchFromTopLeft ? 'd' : '';
				if (rowStitch) {
					rowDrawing.push(donePrefix + 'b');
				} else {
					rowDrawing.push(donePrefix + 'w');
				}
			})
		});
	} else if (previousStitchBrt < currentStitchBr) {

		const startRowNumber = Math.floor(currentStitchTl / patternRowsTl[0].length);
		const endRowNumber = Math.floor(previousStitchTl / patternRowsTl[0].length);

		patternRowsTl.forEach((row, rowI) => {
			const rowDrawing = [];
			drawStateRowsTl.push(rowDrawing);

			if (rowI >= startRowNumber && rowI <= endRowNumber) {
				row.forEach((rowStitch, rowStitchI) => {
					const thisRowStitchFromTopLeft = (rowI * row.length) + rowStitchI;
					const donePrefix = currentStitchTl <= thisRowStitchFromTopLeft ? 'd' : '';

					if ((currentStitchTl % row.length) <= rowStitchI) {
						if (rowStitch) {
							rowDrawing.push(donePrefix + 'b');
						} else {
							rowDrawing.push(donePrefix + 'w');
						}
					} else {
						rowDrawing.push(null);
					}

				})
			}
		});

	} else {
		const startRowNumber = Math.floor(previousStitchTl / patternRowsTl[0].length);
		const endRowNumber = Math.floor(currentStitchTl / patternRowsTl[0].length);

		patternRowsTl.forEach((row, rowI) => {
			const rowDrawing = [];
			drawStateRowsTl.push(rowDrawing);

			if (rowI >= startRowNumber && rowI <= endRowNumber) {
				row.forEach((rowStitch, rowStitchI) => {
					const thisRowStitchFromTopLeft = (rowI * row.length) + rowStitchI;
					const donePrefix = currentStitchTl <= thisRowStitchFromTopLeft ? 'd' : '';

					if (((previousStitchTl % row.length) - 1) <= rowStitchI && (currentStitchTl % row.length) > rowStitchI) {

						if (rowStitch) {
							rowDrawing.push(donePrefix + 'b');
						} else {
							rowDrawing.push(donePrefix + 'w');
						}
					} else {
						rowDrawing.push(null);
					}

				})
			}
		});
	}

	return drawStateRowsTl;
}
