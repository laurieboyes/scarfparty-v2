import p from 'pubsub'
import model from './model.js'

export default class PatternDisplay {
    constructor(pattern) {

        this.pattern = pattern;

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

	    p.subscribe('/stitch', stitch => {
		    this.draw(stitch);
		    this.scrollToRow(model.getRowsDone())
	    })
    }

    scrollToRow(row) {
        this.containerEl.scrollTop = (this.canvasHeight - (this.stitchHeight * row)) - (this.stitchHeight * 6);
    }

    draw(stitch) {

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.pattern.rows.forEach((row, rowI) => {
            row.forEach((stitchValue, rowStitchI) => {

                const margin = model.isStitchDoneYet(rowI, rowStitchI) ? 0 : 1;
                //var stitch = scope.ctrl.getRowFlippedOrWhatever(i)[j];
                //
                const left = rowStitchI * this.stitchWidth + margin;
                const top = rowI * this.stitchHeight + margin;
                const width = this.stitchWidth - (margin * 2);
                const height = this.stitchHeight - (margin * 2);

                this.ctx.fillStyle = stitchValue ? '#B20000' : '#CECECE';
                this.ctx.fillRect(left, top, width, height);
            })
        });
    }
}
