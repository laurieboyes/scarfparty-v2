import isStitchRightSide from './util/is-stitch-right-side';

export default function(patternRowsFromTopLeft, currentStitchFromBottomRight, previousStitch) {

	const totalStitches = patternRowsFromTopLeft.length * patternRowsFromTopLeft[0].length;
	const currentStitchFromTopLeft = (totalStitches - currentStitchFromBottomRight) - 1;

	const rows = [];

	let startStitch;
	let endStitch;


	if(previousStitch === undefined) {
		startStitch = (patternRowsFromTopLeft.length * patternRowsFromTopLeft[0].length) - 1;
		endStitch = 0;

		patternRowsFromTopLeft.forEach((row, rowI) => {
			const rowDrawing = [];
			rows.push(rowDrawing);
			row.forEach((rowStitch, rowStitchI) => {
				const thisRowStitchFromTopLeft = (rowI * row.length) + rowStitchI;
				const donePrefix = currentStitchFromTopLeft <= thisRowStitchFromTopLeft ? 'd' : '';
				if(rowStitch) {
					rowDrawing.push(donePrefix + 'b');
				} else {
					rowDrawing.push(donePrefix + 'w');
				}
			})
		});
	}

	return {
		startStitch,
		endStitch,
		rows
	};
}
