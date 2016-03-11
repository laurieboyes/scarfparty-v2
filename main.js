import Pattern from './src/pattern'
import PatternDisplay from './src/pattern-display'
import initControls from './src/controls'
import model from './src/model'
import p from 'pubsub'
import {ready} from './src/util'

ready(() =>{

	initControls();

    const img = new Image();

    // if image isn't on static.lrnk.co.uk (e.g. if I'm running it locally), we need an Access-Control-Allow-Origin: *
    // header on the image
    img.crossOrigin = 'Anonymous';

    img.src = 'http://static.lrnk.co.uk/scarf/finalharoltheocubertlauren.png';
    img.onload = function () {

        const pattern = new Pattern(img);
	    model.pattern = pattern;

        const patternDisplay = new PatternDisplay(pattern);

        patternDisplay.draw();

	    //temp
	    p.publish('/stitch', 0);
    };
});


