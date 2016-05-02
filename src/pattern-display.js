import p from 'pubsub'
import model from './model.js'

export default class PatternDisplay {
	constructor (pattern) {

		this.pattern = pattern;
		this.patternRows = pattern.rows;
		this.patternRowsReversed = pattern.rows.map(row => row.slice().reverse());

		this.containerEl = document.querySelector('.js-pattern-container');
		this.canvasWidth = this.containerEl.offsetWidth;
		this.canvasHeight = (pattern.height / pattern.width) * this.canvasWidth;

		this.stitchWidth = this.canvasWidth / pattern.width;
		this.stitchHeight = this.canvasHeight / pattern.height;

		this.canvasEl = document.querySelector('.js-pattern');
		this.canvasEl.width = this.canvasWidth;
		this.canvasEl.height = this.canvasHeight;

		this.canvasReversedEl = document.querySelector('.js-pattern-reversed');
		this.canvasReversedEl.width = this.canvasWidth;
		this.canvasReversedEl.height = this.canvasHeight;

		this.ctx = this.canvasEl.getContext("2d");
		this.ctxReversed = this.canvasReversedEl.getContext("2d");

		// event handling

		this.subscriptions = [];

		const stitchHandler = () => {
			if (this.hasDrawnThisSession) {
				this.draw();
			}

			if (model.isRightSide()) {
				this.canvasEl.classList.add('is-showing');
				this.canvasReversedEl.classList.remove('is-showing');
			} else {
				this.canvasEl.classList.remove('is-showing');
				this.canvasReversedEl.classList.add('is-showing');
			}

			this.scrollToRow(model.getRowsDone())
		};
		p.subscribe('/stitch', stitchHandler);

		this.subscriptions.push(stitchHandler);
	}

	/**
	 * Scroll the display so that the given row is roughly 2 thirds from the top
	 * @param row
	 */
	scrollToRow (row) {

		const scrollTopAtBottom = this.canvasHeight - this.containerEl.offsetHeight;
		const offsetForCurrentRow = (row * this.stitchHeight);
		const rowsDisplayed = this.containerEl.offsetHeight / this.stitchHeight;
		const offsetForShowingPrevious = (rowsDisplayed / 3) * this.stitchHeight;

		this.containerEl.scrollTop = scrollTopAtBottom - (offsetForCurrentRow - offsetForShowingPrevious);
	}

	tearDown () {
		this.subscriptions.forEach(subscription => p.unsubscribe(subscription));
	}

	draw (fromFresh) {

		this.hasDrawnThisSession = true;

		if (fromFresh) {
			this._drawRows(0, this.ctx, model.colours, this.patternRows);
			this._drawRows(0, this.ctxReversed, model.getColoursReversed(), this.patternRows);
			return;
		}

		let currentCtx;
		let colours;
		let previousStitch;

		if (model.isRightSide()) {
			currentCtx = this.ctx;
			colours = model.colours;
			previousStitch = this.previousStitch || model.stitch;
			this.previousStitch = model.stitch;
		} else {
			currentCtx = this.ctxReversed;
			colours = model.getColoursReversed();
			previousStitch = this.previousStitchReversed || model.stitch;
			this.previousStitchReversed = model.stitch;
		}

		let firstRow;
		let lastRow;

		if (previousStitch < model.stitch) {
			firstRow = model.getRowNumberOfStitch(previousStitch);
			lastRow = model.getRowNumberOfStitch(model.stitch);
		} else {
			firstRow = model.getRowNumberOfStitch(model.stitch);
			lastRow = model.getRowNumberOfStitch(previousStitch);
		}

		console.log('firstRow', firstRow);
		console.log('lastRow + 1', lastRow + 1);
		console.log('this.patternRows.slice(firstRow, lastRow + 1)', this.patternRows.slice(firstRow, lastRow + 1));

		this._drawRows(firstRow, currentCtx, colours, this.patternRows.slice(firstRow, lastRow + 1));
	}

	_drawRows (firstRow, context, colours, patternRows) {

		//console.log('firstRow, context, colours, patternRows', firstRow, context, colours, patternRows);

		patternRows.forEach((row, theseRowsI) => {

			const rowI = firstRow + theseRowsI;

			// todo put something like this back in
			//currentCtx.fillStyle = "white";
			//currentCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

			row.forEach((_, rowStitchI) => {

				console.log('rowI', rowI);
				console.log('rowStitchI', rowStitchI);

				const thisStitchDone = model.isStitchDoneYet(rowI, rowStitchI);
				const margin = thisStitchDone ? 0 : 1;


				//console.log('rowI', rowI);
				//console.log('rowStitchI', rowStitchI);
				//console.log('patternRows[rowI][rowStitchI]', patternRows[rowI][rowStitchI]);

				const stitchValue = patternRows[theseRowsI][rowStitchI];
				const left = rowStitchI * this.stitchWidth + margin;
				const top = rowI * this.stitchHeight + margin;
				const width = this.stitchWidth - (margin * 2);
				const height = this.stitchHeight - (margin * 2);


				// TODO BRB thisStitchDone is always 0 for some reason????
				//console.log('thisStitchDone', thisStitchDone);

				context.fillStyle = colours[thisStitchDone ? 'done' : 'notDone'][stitchValue ? 'a' : 'b'];
				context.fillRect(left, top, width, height);
			})
		});
	}
}
