/**
 *
 * @param img
 * @returns {Array} array of integers representing the image, wherein each pixel is represented by a group of 4 numbers
 * between 0 and 255 corresponding to its rgba values
 */
function getImageData(img) {
    //Create a canvas in memory that we can use to get the pattern image data
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return Array.from(ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight).data);
}


/**
 *
 * @param imageData
 * @returns {Array} array of 1s and 0s, one element for each pixel in the pattern, read one row at a time from left to
 * right. A value of 1 represents that the pixel is the dark colour and 0 that it is light
 */
function getPixelsOnOff(imageData) {
    return imageData

        // only have to look at one colour channel to know if it's black or white, so just look at the red of each
        // pixel, filtering the rest out
        .filter((_, i) => i % 4 === 0)

        // if the value is greater than 127 (~half of the maximum of 255) it's light, else it's dark
        .map(pixel => pixel > 127 ? 0 : 1);
}

function getRows(img) {

	const rows = [];
	let currentRow = [];

	getPixelsOnOff(getImageData(img)).forEach(pixel => {
		currentRow.push(pixel);
		if (currentRow.length >= img.naturalWidth) {
			rows.push(currentRow);
			currentRow = [];
		}
	});

	return rows;
}

export default class Pattern {
    constructor(img) {
        this.height = img.naturalHeight;
        this.width = img.naturalWidth;

	    this.rows = getRows(img);
	    this.img = img;

    }
}
