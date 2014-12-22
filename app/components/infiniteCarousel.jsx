var React = require('react');

var InfiniteCarousel = React.createClass({
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
		this.events.onDragStart = this.noDrag;

		this.minPosition = this.getPagePosition(this.childrenCount() - 1);
		this.maxPosition = this.getPagePosition(0);

		this.getX = this.touch
			? function(e) { return e.touches[0].clientX; }
			: function(e) { return e.clientX; };
	},
	componentDidMount: function() {
		this.containerWidth = this.refs.container.getDOMNode().offsetWidth;
	},
	getInitialState: function() {
		return {
			down: false,
			startX: 0,
			position: this.getPagePosition(1),
			animate: false,
			info: '',
			currentPage: 1
		};
	},
	childrenCount: function() {
		var count = 1;
		if (this.props.iterator.hasNext()) {
			count++;
		}
		if (this.props.iterator.hasPrevious()) {
			count++;
		}
		return count;
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
		if (this.state.down) {
			// console.log('end', this.state);
			var x = this.touch ? this.state.lastX : e.clientX;
			var threshold = 30;
			var page = this.state.currentPage;
			var direction = null;
			if (page < (this.childrenCount() - 1) && this.getOffsetPercent(x) < -threshold) {
				page++;
				direction = '+';
			} else if (page > 0 && this.getOffsetPercent(x) > threshold) {
				page--;
				direction = '-';
			}
			var position = this.getCurrentPosition(page, false, 0);
			this.setState({down: false, startX: 0, currentPage: page, position: position, animate: true, direction: direction});
		}
	},
	move: function(e) {
		if (this.state.down) {
			// console.log('move');
			var x = this.getX(e);
			var position = this.getCurrentPosition(this.state.currentPage, true, x);
			position = this.bounded(position, this.minPosition, this.maxPosition);
			this.setState({position: position, animate: false, lastX: x, info: 'offset: ' + this.getOffsetPercent(x) + '%'});
		}
	},
	getPanesClasses: function(baseClass) {
		var classes = [baseClass];
		if (this.state.animate) {
			var mover = this.refs.mover.getDOMNode();
			var afterAnimate = function() {
				mover.removeEventListener('webkitTransitionEnd', afterAnimate);
				// if (this.state.direction === '+') {
				// 	this.props.iterator.moveNext();
				// } else if (this.state.direction === '-') {
				// 	this.props.iterator.movePrevious();
				// }
				this.setState({animate: false, direction: null});
			}.bind(this);
			mover.addEventListener('webkitTransitionEnd', afterAnimate);
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
	renderItem: function(page, index) {
		var width = (100 / this.childrenCount()) + '%';
		return <CarouselItem width={width} key={index}>{page}</CarouselItem>;
	},
	noDrag: function(e) {
		e.preventDefault();
		e.stopPropagation();
	},
	render: function() {
		var style = {
			left: this.state.position + '%',
			width: (this.childrenCount() * 100) + '%',
			height: '100%'
		};
		return (
			<div ref="container" {...this.props}>
				<div className="info-bar">{this.state.info}</div>
				<ul ref="mover" className={this.getPanesClasses('panes')} style={style} {...this.events}>
					{this.props.iterator.hasPrevious() ? this.renderItem(this.props.iterator.previous()) : null}
					{this.renderItem(this.props.iterator.current())}
					{this.props.iterator.hasNext() ? this.renderItem(this.props.iterator.next()) : null}
				</ul>
			</div>
		);
	}
});

var CarouselItem = React.createClass({
	shouldComponentUpdate: function() {
		return true;
	},
	render: function() {
		var style = {width: this.props.width};
		return <li style={style}>{this.props.children}</li>;
	}
});


module.exports = InfiniteCarousel;


