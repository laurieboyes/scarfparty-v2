export default (stitch, patternWidth) => {
	if(stitch === undefined || patternWidth === undefined) {
		throw new Error('usage isStitchRightSide(stitch, patternWidth)');
	}
	return Math.floor(stitch / patternWidth) % 2 === 0;
}
