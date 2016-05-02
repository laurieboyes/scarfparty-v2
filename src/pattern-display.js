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

		let currentCtx;
		let colours;

		if(model.isRightSide()) {
			currentCtx = this.ctx;
			this.canvasEl.classList.add('is-showing');
			this.canvasReversedEl.classList.remove('is-showing');
			colours = model.colours;
		} else {
			currentCtx = this.ctxReversed;
			this.canvasEl.classList.remove('is-showing');
			this.canvasReversedEl.classList.add('is-showing');
			colours = model.getColoursReversed();
		}

		currentCtx.fillStyle = "white";
		currentCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

		this.patternRows.forEach((row, rowI) => {
			row.forEach((_, rowStitchI) => {

				const thisStitchDone = model.isStitchDoneYet(rowI, rowStitchI);
				const margin = thisStitchDone ? 0 : 1;
				const stitchValue = model.isRightSide() ? this.patternRows[rowI][rowStitchI] : this.patternRowsReversed[rowI][rowStitchI];
				const left = rowStitchI * this.stitchWidth + margin;
				const top = rowI * this.stitchHeight + margin;
				const width = this.stitchWidth - (margin * 2);
				const height = this.stitchHeight - (margin * 2);

				currentCtx.fillStyle = colours[thisStitchDone ? 'done' : 'notDone'][stitchValue ? 'a' : 'b'];
				currentCtx.fillRect(left, top, width, height);
			})
		});
	}

	tearDown () {
		this.subscriptions.forEach(subscription => p.unsubscribe(subscription));
	}
}
