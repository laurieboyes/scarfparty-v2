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
		expect(getPatternDrawState(patternRows, 5)).to.deep.equal({
			startStitch: 98,
			endStitch: 0,
			rows: [
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
			]
		});
	});


});
