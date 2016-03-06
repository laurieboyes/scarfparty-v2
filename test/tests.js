import Pattern from '../src/pattern.js'

// Run this first:
//  obt build --js=test/tests.js --buildJs=tests-compiled.js
// todo automate

describe('Extracting the pattern from an image', function() {
    it('Should get a sweet sweet pattern from the test image', function(done) {

        var img = new Image();
        img.src = 'pattern-image.png';
        img.onload = function () {
            const pattern = new Pattern(img);
            console.log('pattern', pattern);
            done();
        };

    });
});
