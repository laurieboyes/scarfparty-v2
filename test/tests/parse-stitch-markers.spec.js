import parseStitchMarkers from '../../src/util/parse-stitch-markers.js';

describe.only('parseStitchMarkers', function () {

	it('should return an empty array given nothing', function () {
		expect(parseStitchMarkers()).to.deep.equal([]);
		expect(parseStitchMarkers('')).to.deep.equal([]);
	});

	it('should return an array containing a single number if given a single number', function () {
		expect(parseStitchMarkers('3')).to.deep.equal([3]);
	});

	it('should return an array containing a the number if given some comma separated numbers', function () {
		expect(parseStitchMarkers('3,66,23')).to.deep.equal([3, 66, 23]);
		expect(parseStitchMarkers('544,2')).to.deep.equal([544, 2]);
	});

	it('should be forgiving of spaces in-between and around the comma separated numbers', function () {
		expect(parseStitchMarkers('3, 66,23')).to.deep.equal([3, 66, 23]);
		expect(parseStitchMarkers('544,  2')).to.deep.equal([544, 2]);
		expect(parseStitchMarkers(' 9 ')).to.deep.equal([9]);
	});

	it('should be forgiving extra commas', function () {
		expect(parseStitchMarkers('3,,66,23')).to.deep.equal([3, 66, 23]);
		expect(parseStitchMarkers('3,66,23,')).to.deep.equal([3, 66, 23]);
	});
});

