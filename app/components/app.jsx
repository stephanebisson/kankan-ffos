
var React = require('react');
var InfiniteCarousel = require('./infiniteCarousel.jsx');
var FlashCard = require('./flashCard.jsx');
var BuildingBlocks = require('./buildingBlocks.js');
var AppArea = BuildingBlocks.AppArea;
var Header = BuildingBlocks.Header;
var Section = BuildingBlocks.Section;
var Footer = BuildingBlocks.Footer;

var page = require('page');

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
	startLearning: function() {
		page('/card');
	},
	render: function() {
		return (
			<AppArea>
				<Header title="Kan Kan" />
				<Section id="splash">
					<h1>看看</h1>
					<h2>Your Mandarin Flashcards</h2>
				</Section>
				<Footer>
					<button className="recommend" onClick={this.startLearning}>Start Learning</button>
				</Footer>
			</AppArea>
		);
	}
});



var Card = React.createClass({
	reveal: function() {
		this.setState({revealed: true});
	},
	answerYes: function() {
		page('/splash');
	},
	answerNo: function() {
		page('/splash');
	},
	getInitialState: function() {
		return {
			revealed: false
		};
	},
	footerButtons: function(revealed) {
		if (revealed) {
			return [
				<button className="recommend" onClick={this.answerYes}>YES</button>,
				<button className="" onClick={this.answerNo}>NO</button>
			];
		} else {
			return [<button className="" onClick={this.reveal}>REVEAL</button>];
		}
	},
	render: function() {
		return (
			<AppArea>
				<Header title="Kan Kan" />
				<FlashCard character="看" />
				<Footer>
					{this.footerButtons(this.state.revealed)}
				</Footer>
			</AppArea>
		);
	}
});



var Router = React.createClass({
	componentWillMount: function() {
		var me = this;

		var render = function(page) {
			return function() {
				me.setState({page: page});
			};
		};

		page('/splash', render(<Splash />));
		page('/card', render(<Card />));

		page({hashbang: true});
	},
	componentDidMount: function() {
		page('/splash');
	},
	getInitialState: function() {
		return { 
			page: <div />
		};
	},
	render: function() {
		return this.state.page;
	}
});

module.exports = Router;



