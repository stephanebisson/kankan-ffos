
var React = require('react');
var Carousel = require('./carousel.jsx');

var App = React.createClass({
	render: function() {
		return (
			<Carousel className="container-fullscreen" header={false}>
				<img src="http://lorempixel.com/600/300/cats"/>
				<img src="http://lorempixel.com/600/300/abstract"/>
				<img src="http://lorempixel.com/600/300/city"/>
				<img src="http://lorempixel.com/600/300/food"/>
			</Carousel>
		);
	}
});

module.exports = App;
