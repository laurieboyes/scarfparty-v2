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

		const canvasEl = this.containerEl.querySelector('canvas');
		canvasEl.width = this.canvasWidth;
		canvasEl.height = this.canvasHeight;

		this.ctx = canvasEl.getContext("2d");

		// event handling

		this.subscriptions = [];

		const stitchHandler = () => {
			this.draw();
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

		const scrollTopAtBottom = this.canvasHeight -  this.containerEl.offsetHeight;
		const offsetForCurrentRow = (row * this.stitchHeight);
		const rowsDisplayed = this.containerEl.offsetHeight / this.stitchHeight;
		const offsetForShowingPrevious = (rowsDisplayed / 3) * this.stitchHeight;

		this.containerEl.scrollTop = scrollTopAtBottom - (offsetForCurrentRow - offsetForShowingPrevious);
	}

	draw () {

		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

		this.patternRows.forEach((row, rowI) => {
			row.forEach((_, rowStitchI) => {

				const thisStitchDone = model.isStitchDoneYet(rowI, rowStitchI);
				const margin = thisStitchDone ? 0 : 1;
				const stitch = model.isRightSide() ? this.patternRows[rowI][rowStitchI] : this.patternRowsReversed[rowI][rowStitchI];
				const left = rowStitchI * this.stitchWidth + margin;
				const top = rowI * this.stitchHeight + margin;
				const width = this.stitchWidth - (margin * 2);
				const height = this.stitchHeight - (margin * 2);

				// mad logic here
				this.ctx.fillStyle = model.colours[thisStitchDone ? 'done' : 'notDone'][!!stitch !== model.isRightSide() ? 'a' : 'b'];
				this.ctx.fillRect(left, top, width, height);
			})
		});
	}

	tearDown () {
		this.subscriptions.forEach(subscription => p.unsubscribe(subscription));
	}
}
