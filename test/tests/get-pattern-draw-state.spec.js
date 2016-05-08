import getPatternDrawState from '../../src/get-pattern-draw-state.js'

describe('getPatternDrawState', function () {

	const patternRows = [
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
	];

	it('When only the start stitch is given, the whole thing should be redrawn', function () {
		expect(getPatternDrawState(patternRows, 5)).to.deep.equal([
			['w', 'b', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
			['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
			['w', 'w', 'b', 'w', 'w', 'w', 'b', 'w', 'w'],
			['w', 'b', 'b', 'b', 'w', 'b', 'b', 'b', 'w'],
			['w', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'w'],
			['w', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'w'],
			['w', 'w', 'b', 'b', 'b', 'b', 'b', 'w', 'w'],
			['w', 'w', 'w', 'b', 'b', 'b', 'w', 'w', 'w'],
			['w', 'w', 'w', 'w', 'b', 'w', 'w', 'w', 'w'],
			['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
			['w', 'w', 'w', 'dw', 'dw', 'dw', 'dw', 'dw', 'dw']
		]);
	});

	it('When the start stitch and previous stitch are given, just the affected stitches should be redrawn', function () {
		expect(getPatternDrawState(patternRows, 5, 0)).to.deep.equal([
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[null, null, null, 'dw', 'dw', 'dw', 'dw', 'dw', 'dw']
		]);
	});

	it('When the current stitch is before the previous stitch, it should still work', function () {
		expect(getPatternDrawState(patternRows, 2, 5)).to.deep.equal([
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[null, null, null, 'w', 'w', 'w', null, null, null]
		]);
	});

	it('When the current stitch and the previous stitch are equal, don\'t draw anything', function () {
		expect(getPatternDrawState(patternRows, 2, 2)).to.deep.equal([]);
	});

	// todo
	//  wrong side colours reversed
	//  affecting multiple rows

});
