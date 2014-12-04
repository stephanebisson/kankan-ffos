var Carousel = React.createClass({
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
		return function() {
			if (pageNumber !== this.state.currentPage) {
				this.setState({currentPage: pageNumber, position: this.getPagePosition(pageNumber), animate: true});
			}
		}.bind(this);
	},
	renderHeader: function(page, index) {
		return <li onClick={this.selectPage(index)}>{page.name}</li>;
	},
	renderItem: function(page, index) {
		var width = (100/this.childrenCount) + '%';
		return <CarouselItem width={width} key={index}>{page}</CarouselItem>;
	},
	noDrag: function(e) {
		e.preventDefault();
		e.stopPropagation();
	},
	render: function() {
		var style = {left: this.state.position + '%', width: (this.childrenCount * 100) + '%'};
		return (
			<div ref="container" {...this.props}>
				<ul className={this.getPanesClasses('panes')} style={style} {...this.events} onDragStart={this.noDrag}>
					{this.props.children.map(this.renderItem)}
				</ul>
			</div>
		);
	}
});

var CarouselItem = React.createClass({
	shouldComponentUpdate: function() {
		return false;
	},
	render: function() {
		var style = {width: this.props.width};
		return <li style={style}>{this.props.children}</li>;
	}
});


var MyApp = React.createClass({
	render: function() {
		return (
			<Carousel className="container-small">
				<img src="http://lorempixel.com/600/300/cats"/>
				<img src="http://lorempixel.com/600/300/abstract"/>
				<img src="http://lorempixel.com/600/300/city"/>
				<img src="http://lorempixel.com/600/300/food"/>
			</Carousel>
		);
	}
});

React.render(<MyApp />, document.getElementById('mountPoint'));

