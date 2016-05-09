import p from 'pubsub'
import model from './model.js'
import isStitchRightSide from './util/is-stitch-right-side';
import getPatternDrawState from './get-pattern-draw-state';
import drawStateOnCanvas from './draw-state-on-canvas.js';

export default class PatternDisplay {
	constructor (pattern) {

		this.pattern = pattern;
		this.patternRows = pattern.rows;

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

		this.previousStitches = {
			rs: null,
			ws: null
		};

		// event handling

		this.subscriptions = [];

		const stitchHandler = newStitch => {

			let thisSideCtx;
			let sideKey;

			if(isStitchRightSide(newStitch, this.pattern.width)) {
				this.canvasEl.classList.add('is-showing');
				this.canvasReversedEl.classList.remove('is-showing');
				thisSideCtx = this.ctx;
				sideKey = 'rs'
			} else {
				this.canvasEl.classList.remove('is-showing');
				this.canvasReversedEl.classList.add('is-showing');
				thisSideCtx = this.ctxReversed;
				sideKey = 'ws'
			}

			const drawingState = getPatternDrawState(this.patternRows, newStitch, this.previousStitches[sideKey]);

			console.log('drawingState', drawingState);

			drawStateOnCanvas(thisSideCtx, drawingState, this.stitchHeight, this.stitchWidth, model.colours);

			this.previousStitches[sideKey] = newStitch;
			this.scrollToRow(model.getRowNumberOfStitch(newStitch));
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
}
