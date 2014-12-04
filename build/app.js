var Carousel = React.createClass({displayName: 'Carousel',
	componentWillMount: function() {
		this.touch = 'ontouchstart' in window;
		if (this.touch) {
			React.initializeTouchEvents(true);			
		}
		this.events = {};
		this.events[this.touch ? 'onTouchStart' : 'onMouseDown'] = this.start;
		this.events[this.touch ? 'onTouchEnd' : 'onMouseUp'] = this.end;
		this.events[this.touch ? 'onTouchCancel' : 'onMouseOut'] = this.end;
		this.events[this.touch ? 'onTouchMove' : 'onMouseMove'] = this.move;

		this.childrenCount = this.props.children.length;
	},
	componentDidMount: function() {
		this.containerWidth = this.refs.container.getDOMNode().offsetWidth;
	},
	getInitialState: function() {
		var firstPage = 0;
		return {
			down: false,
			startX: 0,
			currentPage: firstPage,
			position: this.getPagePosition(firstPage),
			animate: false
		};
	},
	getPagePosition: function(pageNumber) {
		return pageNumber * -100;
	},
	getOffsetPercent: function(currentX) {
		var offset = currentX - this.state.startX;
		return offset / this.containerWidth * 100;
	},
	getCurrentPosition: function(page, down, currentX) {
		var position = this.getPagePosition(page);
		if (down) {
			position += this.getOffsetPercent(currentX);
		}
		return position;
	},
	bounded: function(current, min, max) {
		if (current < min) {
			return min;
		} else if (current > max) {
			return max;
		} else {
			return current;
		}
	},
	getX: function(e) {
		return this.touch ? e.touches[0].clientX : e.clientX;
	},
	start: function(e) {
		var x = this.getX(e);
		// console.log('start', x);
		this.setState({down: true, startX: x, animate: false});
	},
	end: function(e) {
		// console.log('end');
		if (this.state.down) {

			var x = this.touch ? this.state.lastX : e.clientX;
			var threshold = 30;
			var page = this.state.currentPage;
			if (this.getOffsetPercent(x) < -threshold && page < (this.childrenCount - 1)) {
				page++;
			} else if (this.getOffsetPercent(x) > threshold && page > 0) {
				page--;
			}
			var position = this.getCurrentPosition(page, false, 0);
			this.setState({down: false, startX: 0, currentPage: page, position: position, animate: true});
		}
	},
	move: function(e) {
		if (this.state.down) {
			// console.log('move');
			var x = this.getX(e);
			var offsetX = x - this.state.startX;
			var position = this.getCurrentPosition(this.state.currentPage, true, x);
			position = this.bounded(position, this.getPagePosition(this.childrenCount - 1), this.getPagePosition(0));
			this.setState({position: position, animate: false, lastX: x});
		}
	},
	getPanesClasses: function(baseClass) {
		var classes = [baseClass];
		if (this.state.animate) {
			classes.push('animate');
		}
		return classes.join(' ');
	},
	selectPage: function(pageNumber) {
		return function(evt) {
			// console.log('on click', pageNumber, arguments);
			if (pageNumber !== this.state.currentPage) {
				this.setState({currentPage: pageNumber, position: this.getPagePosition(pageNumber), animate: true});
			}
		}.bind(this);
	},
	renderHeader: function(page, index) {
		return React.createElement("li", {onClick: this.selectPage(index)}, page.name);
	},
	renderItem: function(page, index) {
		var style = {width: (100/this.childrenCount) + '%'};
		return React.createElement("li", {className: this.getPanesClasses(), style: style}, page);
	},
	noDrag: function(e) {
		e.preventDefault();
		e.stopPropagation();
	},
	render: function() {
		var style = {left: this.state.position + '%', width: (this.childrenCount * 100) + '%'};
		return (
			React.createElement("div", {className: "container-fullscreen", ref: "container"}, 
				React.createElement("ul", React.__spread({className: this.getPanesClasses('panes'), style: style},  this.events, {onDragStart: this.noDrag}), 
					this.props.children.map(this.renderItem)
				)
			)
		);
	}
});


var MyApp = React.createClass({displayName: 'MyApp',
	render: function() {
		return (
			React.createElement(Carousel, null, 
				React.createElement("img", {src: "http://lorempixel.com/600/300/cats"}), 
				React.createElement("img", {src: "http://lorempixel.com/600/300/abstract"}), 
				React.createElement("img", {src: "http://lorempixel.com/600/300/city"}), 
				React.createElement("img", {src: "http://lorempixel.com/600/300/food"})
			)
		);
	}
});

React.render(React.createElement(MyApp, null), document.getElementById('mountPoint'));

