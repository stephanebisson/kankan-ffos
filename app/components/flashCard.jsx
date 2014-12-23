var React = require('react');

var BuildingBlocks = require('./buildingBlocks.js');
var AppArea = BuildingBlocks.AppArea;
var Header = BuildingBlocks.Header;
var Section = BuildingBlocks.Section;
var Footer = BuildingBlocks.Footer;

module.exports = React.createClass({
	displayName: 'FlashCard', 
	render: function() {
		return (
			<Section id="flashCard">
				<h1>{this.props.character}</h1>
			</Section>
		);
	}
});