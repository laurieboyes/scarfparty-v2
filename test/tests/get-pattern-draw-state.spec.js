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

	it('should redraw the whole thing when only the start stitch is given', function () {
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

		expect(getPatternDrawState(patternRows, 5, null)).to.deep.equal([
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

	it('should just draw the affected stitches when the start stitch and previous stitch are given', function () {
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

	it('should not put changes in the drawstate for unaffected rows after some other changes', function () {
		expect(getPatternDrawState(patternRows, 5, 2)).to.deep.equal([
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
			[null, null, null, 'dw', 'dw', 'dw']
		]);
	});

	it('should still work when the current stitch is before the previous stitch', function () {
		expect(getPatternDrawState(patternRows, 3, 5)).to.deep.equal([
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
			[null, null, null, 'w', 'w', 'w']
		]);
	});

	it('should not draw anything when the current stitch and the previous stitch are equal', function () {
		expect(getPatternDrawState(patternRows, 2, 2)).to.deep.equal([]);
	});

	it('should draw all of them when more than one row has changed', function () {
		expect(getPatternDrawState(patternRows, 23, 5)).to.deep.equal([
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[null, null, null, null, 'db', 'dw', 'dw', 'dw', 'dw'],
			['dw', 'dw', 'dw', 'dw', 'dw', 'dw', 'dw', 'dw', 'dw'],
			['dw', 'dw', 'dw']
		]);
	});

	it('should reverse the colours when we\'re on a wrongside row', function () {
		expect(getPatternDrawState(patternRows, 32, 5)).to.deep.equal([
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[null, null, null, null, 'dw', 'dw', 'db', 'db', 'db'],
			['db', 'db', 'db', 'db', 'dw', 'db', 'db', 'db', 'db'],
			['db', 'db', 'db', 'db', 'db', 'db', 'db', 'db', 'db'],
			['db', 'db', 'db']
		]);
	});

	it.only('should deal with it when we go back to stitch 0', function () {
		expect(getPatternDrawState(patternRows, 0, 5)).to.deep.equal([
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
			[null, null, null, null, 'w', 'w', 'w', 'w', 'w']
		]);
	});

});
