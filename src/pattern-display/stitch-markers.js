import p from 'pubsub'
import model from './../model.js'
import isStitchRightSide from './../util/is-stitch-right-side';
import getPatternDrawState from './get-pattern-draw-state';
import drawStateOnCanvas from './draw-state-on-canvas.js';

export default class StitchMarkers {
	constructor (patternHeightInStitches, patternWidthInStitches) {

		this.containerEl = document.querySelector('.js-pattern-container');
		this.canvasWidth = this.containerEl.offsetWidth;
		this.canvasHeight = (patternHeightInStitches / patternWidthInStitches) * this.canvasWidth;

		this.canvasEl = document.querySelector('.js-stitch-markers');
		this.canvasEl.width = this.canvasWidth;
		this.canvasEl.height = this.canvasHeight;

		this.ctx = this.canvasEl.getContext("2d");

		this.stitchWidth = this.canvasWidth / patternWidthInStitches;

		// event handling

		this.subscriptions = [];

		let currentlyShowingRightSide = null;

		const flipCanvasIfWrongSide = () => {
			if(currentlyShowingRightSide !== model.isRightSide()) {
				currentlyShowingRightSide = model.isRightSide();
				if(model.isRightSide()) {
					this.canvasEl.style.transform = '';
					this.canvasEl.style.webkitTransform = '';
					this.canvasEl.style.msTransform = '';
				} else {
					this.canvasEl.style.transform = 'scaleX(-1)';
					this.canvasEl.style.webkitTransform = 'scaleX(-1)';
					this.canvasEl.style.msTransform = 'scaleX(-1)';
				}
			}
		};

		const redrawStitchMarkers = stitchMarkers => this.draw(stitchMarkers);

		p.subscribe('/stitch', flipCanvasIfWrongSide);
		p.subscribe('/stitchMarkers', redrawStitchMarkers);

		this.subscriptions.push(flipCanvasIfWrongSide);
		this.subscriptions.push(redrawStitchMarkers);
	}

	draw(stitchMarkers) {

		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		stitchMarkers.forEach(stitchMarker => {
			this.ctx.fillStyle = 'red';
			const markerX = (this.canvasWidth - (stitchMarker * this.stitchWidth)) - 0.5;
			this.ctx.fillRect(markerX, 0, 1, this.canvasHeight);
		});
	}


	tearDown () {
		this.subscriptions.forEach(subscription => p.unsubscribe(subscription));
	}
}
