var React = require('react');

module.exports = React.createClass({
	displayName: 'FlashCard', 
	render: function() {
		return (
			<div>
				<div>{this.props.character}</div>
			</div>
		);
	}
});