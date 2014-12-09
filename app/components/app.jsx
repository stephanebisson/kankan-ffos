
var React = require('react');
var InfiniteCarousel = require('./infiniteCarousel.jsx');

var App = React.createClass({
	nextPage: function() {

	},
	render: function() {
		return (
			<InfiniteCarousel className="container-small" onNextPage={this.nextPage}>
				<InfiniteCarousel.Previous>the previous page</InfiniteCarousel.Previous>
				<InfiniteCarousel.Current>the current page</InfiniteCarousel.Current>
				<InfiniteCarousel.Next>the next page</InfiniteCarousel.Next>
			</InfiniteCarousel>	
		);
	}
});

module.exports = App;
