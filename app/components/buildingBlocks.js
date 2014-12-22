var React = require('react');

var AppArea = React.createClass({
	render: function() {
		return (
			<div className="vbox fit">{this.props.children}</div>
		);
	}
});

var Header = React.createClass({
	propTypes: {
		title: React.PropTypes.string.isRequired
	},
	render: function() {
		return (
			<section role="region">
			  <header>
			    <h1>{this.props.title}</h1>
			  </header>
			</section>
		);
	}
});

var Section = React.createClass({
	render: function() {
		return (
			<div className="scroll fit sticky" {...this.props}>{this.props.children}</div>
		);
	}
});

var Footer = React.createClass({
	render: function() {
		return (
			<footer className="gaia-footer">
				{this.props.children}
			</footer>
		);
	}
});


module.exports = {
	AppArea: AppArea,
	Header: Header,
	Section: Section,
	Footer: Footer
};

