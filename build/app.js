var Carousel = React.createClass({displayName: 'Carousel',
	componentWillMount: function() {
		this.touch = 'ontouchstart' in window;
		if (this.touch) {
			React.initializeTouchEvents(true);			
		}
	},
	componentDidMount: function() {
		this.containerWidth = this.refs.container.getDOMNode().offsetWidth;
	},
	getInitialState: function() {
		var firstPage = 2;
		return {
			down: false,
			startX: 0,
			currentPage: firstPage,
			position: this.getPagePosition(firstPage),
			animate: false
		};
	},
	getPagePosition: function(page) {
		return {1: 0, 2: -100, 3: -200}[page];
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
		var x = this.touch ? e.touches[0].clientX : e.clientX;
		// console.log('start', x);
		this.setState({down: true, startX: x, animate: false});
	},
	end: function(e) {
		// console.log('end', e);
		if (this.state.down) {

			var x = this.touch ? this.state.lastX : e.clientX;
			var threshold = 30;
			var page = this.state.currentPage;
			if (this.getOffsetPercent(x) < -threshold && page < 3) {
				page++;
			} else if (this.getOffsetPercent(x) > threshold && page > 1) {
				page--;
			}
			var position = this.getCurrentPosition(page, false, 0);
			this.setState({down: false, startX: 0, currentPage: page, position: position, animate: true});
		}
	},
	move: function(e) {
		// console.log('move', e);
		if (this.state.down) {
			var x = this.touch ? e.touches[0].clientX : e.clientX;
			var offsetX = x - this.state.startX;
			var position = this.getCurrentPosition(this.state.currentPage, true, x);
			position = this.bounded(position, this.getPagePosition(3), this.getPagePosition(1));
			this.setState({position: position, animate: false, lastX: x});
		}
	},
	getPageClasses: function(baseClass, pageNumber) {
		var classes = [baseClass];
		if (pageNumber === this.state.currentPage) {
			classes.push('current');
		}
		return classes.join(' ');
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
	render: function() {
		var events = {};
		events[this.touch ? 'onTouchStart' : 'onMouseDown'] = this.start;
		events[this.touch ? 'onTouchEnd' : 'onMouseUp'] = this.end;
		events[this.touch ? 'onTouchCancel' : 'onMouseOut'] = this.end;
		events[this.touch ? 'onTouchMove' : 'onMouseMove'] = this.move;

		var style = {left: this.state.position + '%'};
		return (
			React.createElement("div", {className: "container-small", ref: "container"}, 
				React.createElement("ul", {className: "headers"}, 
					React.createElement("li", {className: this.getPageClasses('bleu', 1), onClick: this.selectPage(1)}, "one"), 
					React.createElement("li", {className: this.getPageClasses('blanc', 2), onClick: this.selectPage(2)}, "two"), 
					React.createElement("li", {className: this.getPageClasses('rouge', 3), onClick: this.selectPage(3)}, "three")
				), 
				React.createElement("ul", React.__spread({className: this.getPanesClasses('panes'), style: style},  events), 
					React.createElement("li", {className: this.getPageClasses('bleu', 1)}), 
					React.createElement("li", {className: this.getPageClasses('blanc', 2)}), 
					React.createElement("li", {className: this.getPageClasses('rouge', 3)})
				)
			)
		);
	}
});

React.render(React.createElement(Carousel, null), document.getElementById('mountPoint'));