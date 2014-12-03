var Carousel = React.createClass({
	componentWillMount: function() {
		var touch = 'ontouchstart' in window;
		if (touch) {
			React.initializeTouchEvents(true);			
		}
		this.events = {};
		this.events[touch ? 'onTouchStart' : 'onMouseDown'] = this.start;
		this.events[touch ? 'onTouchEnd' : 'onMouseUp'] = this.end;
		this.events[touch ? 'onTouchCancel' : 'onMouseOut'] = this.end;
		this.events[touch ? 'onTouchMove' : 'onMouseMove'] = this.move;

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
		// console.log('start', x);
		this.setState({down: true, startX: this.getX(e), animate: false});
	},
	end: function(e) {
		// console.log('end', e);
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
		// console.log('move', e);
		if (this.state.down) {
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
		return <li onClick={this.selectPage(index)}>{page.name}</li>;
	},
	renderItem: function(page, index) {
		var style = {width: (100/this.childrenCount) + '%'};
		return <li className={this.getPanesClasses()} style={style}>{page}</li>;
	},
	render: function() {
		var style = {left: this.state.position + '%', width: (this.childrenCount * 100) + '%'};
		return (
			<div className="container-small" ref="container">
				<ul className={this.getPanesClasses('panes')} style={style} {...this.events}>
					{this.props.children.map(this.renderItem)}
				</ul>
			</div>
		);
	}
});


var MyApp = React.createClass({
	render: function() {
		return (
			<Carousel>
				<img src="http://lorempixel.com/600/300/abstract"/>
				<img src="http://lorempixel.com/600/300/city"/>
				<img src="http://lorempixel.com/600/300/food"/>
				<img src="http://lorempixel.com/600/300/cats"/>
			</Carousel>
		);
	}
});

React.render(<MyApp />, document.getElementById('mountPoint'));

