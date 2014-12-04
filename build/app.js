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

		this.minPosition = this.getPagePosition(this.childrenCount - 1);
		this.maxPosition = this.getPagePosition(0);

		this.getX = this.touch
			? function(e) { return e.touches[0].clientX; }
			: function(e) { return e.clientX };
	},
	componentDidMount: function() {
		this.containerWidth = this.refs.container.getDOMNode().getBoundingClientRect().width;
		// this.setState({info: 'width: ' + this.containerWidth});
	},
	getInitialState: function() {
		var firstPage = 0;
		return {
			down: false,
			startX: 0,
			currentPage: firstPage,
			position: this.getPagePosition(firstPage),
			animate: false,
			info: ''
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
			if (page < (this.childrenCount - 1) && this.getOffsetPercent(x) < -threshold) {
				page++;
			} else if (page > 0 && this.getOffsetPercent(x) > threshold) {
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
			var position = this.getCurrentPosition(this.state.currentPage, true, x);
			position = this.bounded(position, this.minPosition, this.maxPosition);
			this.setState({position: position, animate: false, lastX: x, info: 'offset: ' + this.getOffsetPercent(x)});
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
		return function() {
			if (pageNumber !== this.state.currentPage) {
				this.setState({currentPage: pageNumber, position: this.getPagePosition(pageNumber), animate: true});
			}
		}.bind(this);
	},
	renderHeader: function(page, index) {
		var width = (100/this.childrenCount) + '%';
		var attributes = {
			style: {width: width},
			onClick: this.selectPage(index)
		};
		if (index === this.state.currentPage) {
			attributes.className = 'active';
		}
		return React.createElement("li", React.__spread({},  attributes), index);
	},
	renderHeaders: function() {
		return (
			React.createElement("ul", {className: "headers"}, 
				this.props.children.map(this.renderHeader)
			)
		);
	},
	renderItem: function(page, index) {
		var width = (100/this.childrenCount) + '%';
		return React.createElement(CarouselItem, {width: width, key: index}, page);
	},
	noDrag: function(e) {
		e.preventDefault();
		e.stopPropagation();
	},
	render: function() {
		var style = {
			left: this.state.position + '%',
			width: (this.childrenCount * 100) + '%',
			height: this.props.header ? '80%' : '100%'
		};
		if (this.props.header) {
			var headerContent = (
				React.createElement("ul", {className: "headers"}, 
					this.props.children.map(this.renderHeader)
				)
			);
		}
		return (
			React.createElement("div", React.__spread({ref: "container"},  this.props), 
				this.props.header ? this.renderHeaders() : '', 
				React.createElement("div", {className: "info-bar"}, this.state.info), 
				React.createElement("ul", React.__spread({className: this.getPanesClasses('panes'), style: style},  this.events, {onDragStart: this.noDrag}), 
					this.props.children.map(this.renderItem)
				)
			)
		);
	}
});

var CarouselItem = React.createClass({displayName: 'CarouselItem',
	shouldComponentUpdate: function() {
		return false;
	},
	render: function() {
		var style = {width: this.props.width};
		return React.createElement("li", {style: style}, this.props.children);
	}
});


var MyApp = React.createClass({displayName: 'MyApp',
	render: function() {
		return (
			React.createElement(Carousel, {className: "container-fullscreen", header: false}, 
				React.createElement("img", {src: "http://lorempixel.com/600/300/cats"}), 
				React.createElement("img", {src: "http://lorempixel.com/600/300/abstract"}), 
				React.createElement("img", {src: "http://lorempixel.com/600/300/city"}), 
				React.createElement("img", {src: "http://lorempixel.com/600/300/food"})
			)
		);
	}
});

React.render(React.createElement(MyApp, null), document.getElementById('mountPoint'));

