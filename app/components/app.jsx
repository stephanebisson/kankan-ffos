
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

var data = require('../data.json');

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

console.log('data size:', data.length);

var getRandomCard = function() {
	// return {
	// 	character: '看',
	// 	pinyin: 'Kàn',
	// 	wordType: 'Verb',
	// 	definitions: [
	// 		'to see',
	// 		'to watch',
	// 		'to read'
	// 	]
	// };

	var index = getRandomInt(0, data.length - 1);
	return data[index];
};

var pinyin = require('prettify-pinyin');

var Card = React.createClass({
	reveal: function() {
		this.setState({revealed: true});
	},
	answerYes: function() {
		// page('/splash');
		this.reset();
	},
	answerNo: function() {
		page('/splash');
	},
	componentWillMount: function() {
		this.setState({character: getRandomCard()});
	},
	reset: function() {
		this.setState({character: getRandomCard(), revealed: false});	
	},
	getInitialState: function() {
		return { revealed: false };
	},
	footerButtons: function(revealed) {
		if (revealed) {
			return [
				<button className="" onClick={this.answerNo}>No clue</button>,
				<button className="recommend" onClick={this.answerYes}>I knew it!</button>
			];
		} else {
			return [<button className="" onClick={this.reveal}>REVEAL</button>];
		}
	},
	details: function() {
		return [
			<p>{pinyin.prettify(this.state.character.pinyin)}</p>,
			<p>{this.state.character.definitions.join(', ')}</p>
		];
	},
	render: function() {
		return (
			<AppArea>
				<Header title="Kan Kan" />
				<Section id="flashCard">
					<h1>{this.state.character.character}</h1>
					{this.state.revealed ? this.details() : false}
				</Section>
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



