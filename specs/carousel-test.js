
describe('carousel', function() {
	var carousel, 
		React,
		TestUtils;
	
	beforeEach(function() {
		carousel = require('../app/components/carousel.jsx');
		React = require('react/addons');
		TestUtils = React.addons.TestUtils;
	});

	it('works', function() {
		expect(carousel).toBeDefined();
		// expect(carousel).toBe(2);
	});
});