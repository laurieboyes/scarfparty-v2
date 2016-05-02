import settingsModel from '../../src/settings/settings-model.js'
import p from 'pubsub'

describe('Settings Model', function() {


	describe('Colour settings', function() {

		function expectColourUpdate(aOrB, colour) {
			const colourUpdateEvent = '/settings/colours/' + aOrB;

			return new Promise((resolve, reject) => {
				p.subscribe(colourUpdateEvent, function handler(newColour) {
					p.unsubscribe(colourUpdateEvent, handler);
					expect(settingsModel.colours[aOrB]).to.equal(newColour);
					if(newColour === colour) {
						resolve();
					} else {
						reject(new Error(`expected ${colour} but got ${newColour}`));
					}
				});
			})

		}

		beforeEach(() => {
			settingsModel.colours = {a: null, b: null}
		});

		it('should publish a colour update for A or B where appropriate when it receives a /settings/ui/colours/??? event with a valid hex code', function(done) {

			const testPassPromises = [];

			['a','b'].forEach(aOrB => {
				testPassPromises.push(expectColourUpdate(aOrB, '#FAF'));
				p.publish('/settings/ui/colours/' + aOrB, '#FAF');

				testPassPromises.push(expectColourUpdate(aOrB, '#FAD'));
				p.publish('/settings/ui/colours/' + aOrB, 'FAD');

				testPassPromises.push(expectColourUpdate(aOrB, '#000010'));
				p.publish('/settings/ui/colours/' + aOrB, '#000010');

				testPassPromises.push(expectColourUpdate(aOrB, '#000011'));
				p.publish('/settings/ui/colours/' + aOrB, '000011');
			});

			Promise.all(testPassPromises)
				.then(() => done())
				.catch(done)
		});

		it('should not publish a colour a update when it receives a /settings/ui/colours/a event with an invalid hex code', function(done) {

			const colourUpdateEvent = '/settings/colours/a';
			p.subscribe(colourUpdateEvent, function handler() {
				p.unsubscribe(colourUpdateEvent, handler);
				done(new Error('Shouldn\'t have published a colour update'));
			});

			p.publish('/settings/ui/colours/a', '#0907890');
			p.publish('/settings/ui/colours/a', '#09078');
			p.publish('/settings/ui/colours/a', '#09078G');
			p.publish('/settings/ui/colours/a', '');
			p.publish('/settings/ui/colours/a');

			// pass if no events handled
			setTimeout(done, 300);

		});
	});


});
