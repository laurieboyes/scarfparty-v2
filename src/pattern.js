/**
 *
 * @param img
 * @returns {Array} array of integers representing the image, wherein each pixel is represented by 4 elements (rgba)
 */
function getImageData(img) {
    //Create a canvas in memory that we can use to get the pattern image data
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return Array.from(ctx.getImageData(0, 0, img.width, img.height).data);
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

        // if the value is greater than 127 it's light, else it's dark
        .map(pixel => pixel > 127 ? 0 : 1);
}

export default class Pattern {
    constructor(img) {

        this.height = img.height;
        this.width = img.width;

        this.rows = [];
        this.rowsReversed = [];

        // populate rows and rowsRevered arrays
        let currentRow = [];
        getPixelsOnOff(getImageData(img)).forEach(pixel => {

            currentRow.push(pixel);

            if (currentRow.length >= img.width) {
                this.rows.push(currentRow);
                this.rowsReversed.push(currentRow.slice().reverse());
                currentRow = [];
            }
        });
    }
}
