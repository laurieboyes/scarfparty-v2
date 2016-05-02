import model from '../../src/settings/settings-model.js'
import p from 'pubsub'

describe('Settings Model', function() {


	describe('Colour settings', function() {

		function expectColourUpdate(done, colour) {
			const colourUpdateEvent = '/settings/colours/a';
			p.subscribe(colourUpdateEvent, function handler(newColour) {
				p.unsubscribe(colourUpdateEvent, handler);
				done(newColour === colour ? null : new Error(`expected ${colour} but got ${newColour}`));
			});
		}

		it('should publish a colour a update when it receives a /settings/ui/colours/a event with a valid hex code with the format e.g. #000', function(done) {
			expectColourUpdate(done, '#FAF');
			p.publish('/settings/ui/colours/a', '#FAF');
		});

		it('should publish a colour a update when it receives a /settings/ui/colours/a event with a valid hex code with the format e.g. 000', function(done) {
			expectColourUpdate(done, '#000');
			p.publish('/settings/ui/colours/a', '000');
		});

		it('should publish a colour a update when it receives a /settings/ui/colours/a event with a valid hex code with the format e.g. 000000', function(done) {
			expectColourUpdate(done, '#090789');
			p.publish('/settings/ui/colours/a', '090789');
		});

		it('should publish a colour a update when it receives a /settings/ui/colours/a event with a valid hex code with the format e.g. #000000', function(done) {
			expectColourUpdate(done, '#090789');
			p.publish('/settings/ui/colours/a', '#090789');
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
			this.timeout(2000);
			setTimeout(done, 1000);

		});
	});


});
