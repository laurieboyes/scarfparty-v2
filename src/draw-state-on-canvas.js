export default function (context, drawingState, stitchWidth, stitchHeight, colours) {

	drawingState.forEach((row, rowI) => {
		row.forEach((rowStitch, rowStitchI) => {

			if(!rowStitch) {
				return;
			}

			context.fillStyle = '#FFF';
			context.fillRect(
				rowStitchI * stitchWidth,
				rowI * stitchHeight,
				stitchWidth,
				stitchHeight
			);

			const stitchDone = rowStitch.length > 1;

			const stitchBlackOrWhite = stitchDone ? rowStitch[1]: rowStitch;
			const margin = stitchDone ? 0 : 1;
			const left = rowStitchI * stitchWidth + margin;
			const top = rowI * stitchHeight + margin;
			const width = stitchWidth - (margin * 2);
			const height = stitchHeight - (margin * 2);

			switch(stitchBlackOrWhite) {
				case 'b':
					context.fillStyle = colours[stitchDone ? 'done' : 'notDone']['b'];
					break;
				case 'w':
					context.fillStyle = colours[stitchDone ? 'done' : 'notDone']['a'];
			}
			context.fillRect(left, top, width, height);
		})
	})
}
