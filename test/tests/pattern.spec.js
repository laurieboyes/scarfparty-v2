import Pattern from '../../src/pattern.js'
import loadImage from '../../src/util/loadImage'

function expectPatternToBeHeart (pattern) {
	expect(pattern.width).to.equal(9);
	expect(pattern.height).to.equal(11);

	// if you squint you can almost see it
	expect(pattern.rows).to.deep.equal([
		[0, 1, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0, 0, 1, 0, 0],
		[0, 1, 1, 1, 0, 1, 1, 1, 0],
		[0, 1, 1, 1, 1, 1, 1, 1, 0],
		[0, 1, 1, 1, 1, 1, 1, 1, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 1, 1, 1, 0, 0, 0],
		[0, 0, 0, 0, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0]
	]);
}

describe('Extracting the pattern from an image', function () {

	it('Should get a sweet sweet pattern from the test image', function () {

		return loadImage('pattern-image.png')
			.then(img => {
				expectPatternToBeHeart(new Pattern(img))
			})
	});

	// note that this test reports false positives on phantomJS
	it('Should get the natural image dimensions regardless of whether the image has been stretched (e.g. for the preview)', function () {

		return loadImage('pattern-image.png')
			.then(img => {
				document.body.appendChild(img);
				img.style.width='50px';
				expectPatternToBeHeart(new Pattern(img))
			})
	});

});
