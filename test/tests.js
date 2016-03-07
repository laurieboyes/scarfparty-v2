import Pattern from '../src/pattern.js'

describe('Extracting the pattern from an image', function() {
    it('Should get a sweet sweet pattern from the test image', function(done) {

        var img = new Image();
        img.src = 'pattern-image.png';
        img.onload = function () {
            const pattern = new Pattern(img);

            expect(pattern.height).to.equal(11);
            expect(pattern.width).to.equal(9);

            // if you squint you can almost see the heart
            expect(pattern.rows).to.deep.equal([
                [0,1,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,1,0,0],
                [0,1,1,1,0,1,1,1,0],
                [0,1,1,1,1,1,1,1,0],
                [0,1,1,1,1,1,1,1,0],
                [0,0,1,1,1,1,1,0,0],
                [0,0,0,1,1,1,0,0,0],
                [0,0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0]
            ]);

            done();
        };

    });
});
