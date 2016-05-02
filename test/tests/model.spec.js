import model from '../../src/model.js'
import p from 'pubsub'


describe('Model', function() {

	describe('getRowsDone', function() {

		it('should report zero when nothing\'s been done yet', function() {
			model.stitch = 0;
			model.pattern = {width: 20};
			expect(model.getRowsDone()).to.equal(0);
		});

		it('should get it right when you\'ve just done a row', function() {
			model.stitch = 40;
			model.pattern = {width: 20};
			expect(model.getRowsDone()).to.equal(2);
		});

		it('should get it right mid row', function() {
			model.stitch = 45;
			model.pattern = {width: 20};
			expect(model.getRowsDone()).to.equal(2);
		});

	});

	describe('getRowStitchesDone', function() {

		it('should report zero when nothing\'s been done yet', function() {
			model.stitch = 0;
			model.pattern = {width: 20};
			expect(model.getRowStitchesDone()).to.equal(0);
		});

		it('should get it right when you\'ve just done a row', function() {
			model.stitch = 40;
			model.pattern = {width: 20};
			expect(model.getRowStitchesDone()).to.equal(0);
		});

		it('should get it right mid row', function() {
			model.stitch = 45;
			model.pattern = {width: 20};
			expect(model.getRowStitchesDone()).to.equal(5);
		});

	});

	describe('getRowNumberOfStitch', function() {

		it('should return the right row number for the given stitch', function() {
			model.pattern = {width: 30};
			expect(model.getRowNumberOfStitch(6)).to.equal(0);
			expect(model.getRowNumberOfStitch(0)).to.equal(0);
			expect(model.getRowNumberOfStitch(29)).to.equal(0);
			expect(model.getRowNumberOfStitch(30)).to.equal(1);
			expect(model.getRowNumberOfStitch(66)).to.equal(2);
		})

	});


	describe('isRightSide', function() {

		it('should report RS when nothing\'s been done yet', function() {
			model.stitch = 0;
			model.pattern = {width: 20};
			expect(model.isRightSide()).to.equal(true);
		});

		it('should report WS as soon as you get on the second row', function() {
			model.stitch = 20;
			model.pattern = {width: 20};
			expect(model.isRightSide()).to.equal(false);
		});

		it('should report WS mid-way through the second row', function() {
			model.stitch = 25;
			model.pattern = {width: 20};
			expect(model.isRightSide()).to.equal(false);
		});

		it('should report RS again as soon as you get to the third row', function() {
			model.stitch = 40;
			model.pattern = {width: 20};
			expect(model.isRightSide()).to.equal(true);
		});

	});

	describe('isStitchDoneYet', function() {

		it('should identify the top rows as not being done and the bottom as being done when the scarf is half done', function() {
			model.stitch = 1000;
			model.pattern = {width: 20, height: 100};
			expect(model.isStitchDoneYet(25, 0)).to.equal(false);
			expect(model.isStitchDoneYet(49, 19)).to.equal(false); // the last not-done stitch
			expect(model.isStitchDoneYet(50, 0)).to.equal(true); // the first done stitch
			expect(model.isStitchDoneYet(75, 0)).to.equal(true); // the first done stitch
		});

		it('should error when an out-of-range rowStitch is given', function() {
			model.stitch = 1000;
			model.pattern = {width: 20, height: 100};

			expect(function(){
				model.isStitchDoneYet(10, 20);
			}).to.throw('Row stitch 20 out of range, must be between 0 and 19');
		});

	});

	describe('event handling', function() {

		it('should update the stitch when it gets a /stitch event', function() {

			model.stitch = 20;
			expect(model.stitch).to.equal(20);

			p.publish('/stitch', 25);
			expect(model.stitch).to.equal(25);

		});

		it('should publish a stitch update increasing the stitch by the increment when it gets a /stitch/do event', function(done) {

			model.stitch = 20;
			expect(model.stitch).to.equal(20);

			model.increment = 5;

			function handler(stitch) {
				p.unsubscribe('/stitch', handler);
				if(stitch === 25) {
					done();
				} else {
					done(new Error('Wrong stitch ' + stitch));
				}
			}
			p.subscribe('/stitch', handler);

			p.publish('/stitch/do');
		});

		it('should publish a stitch update decreasing the stitch by the increment when it gets a /stitch/unpick event', function(done) {

			model.stitch = 20;
			expect(model.stitch).to.equal(20);

			model.increment = 5;

			function handler (stitch) {
				p.unsubscribe('/stitch', handler);
				if(stitch === 15) {
					done();
				} else {
					done(new Error('Wrong stitch ' + stitch));
				}
			}
			p.subscribe('/stitch', handler);

			p.publish('/stitch/unpick');
		});

	});


});
