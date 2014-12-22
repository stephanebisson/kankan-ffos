
var React = require('react');
var InfiniteCarousel = require('./infiniteCarousel.jsx');
var BuildingBlocks = require('./buildingBlocks.js');
var AppArea = BuildingBlocks.AppArea;
var Header = BuildingBlocks.Header;
var Section = BuildingBlocks.Section;
var Footer = BuildingBlocks.Footer;

var createArrayIterator = function(elements) {
	var index = 0,
		first = 0,
		size = elements.length,
		last = size - 1;

	return {
		hasPrevious: function() {
			return index > first;
		},
		hasNext: function() {
			return index < last;
		},
		current: function() {
			return elements[index];
		},
		next: function() {
			return elements[index+1];
		},
		previous: function() {
			return elements[index-1];
		},
		moveNext: function() {
			if (this.hasNext()) {
				index++;
			}
		},
		movePrevious: function() {
			if (this.hasPrevious()) {
				index--;
			}
		}
	};
};

var data = [
		<h1>ONE</h1>,
		<h1>TWO</h1>,
		<h1>THREE</h1>,
		<h1>FOUR</h1>,
		<h1>FIVE</h1>
		];


var Splash = React.createClass({
	render: function() {
		return (
			<Section id="splash">
				<h1>看看</h1>
				<h2>Your Mandarin Flashcards</h2>
			</Section>
		);
	}
});


var App = React.createClass({
	startLearning: function() {
		// navigate here
	},
	render: function() {
		return (
			<AppArea>
				<Header title="Kan Kan" />
				<Splash />
				<Footer>
					<button className="recommend" onClick={this.startLearning}>Start Learning</button>
				</Footer>
			</AppArea>
		);
	}
});

module.exports = App;
