import p from 'pubsub'
import model from './model.js'

export default class PatternDisplay {
	constructor (pattern) {

		this.pattern = pattern;
		this.patternRows = pattern.rows;
		this.patternRowsReversed = pattern.rows.map(row => row.slice().reverse());

		this.containerEl = document.querySelector('.js-pattern-container');

		const screenHeight = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight;
		this.containerEl.style.height = `${screenHeight / 4}px`;

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

	scrollToRow (row) {
		this.containerEl.scrollTop = (this.canvasHeight - (this.stitchHeight * row)) - (this.stitchHeight * 6);
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
