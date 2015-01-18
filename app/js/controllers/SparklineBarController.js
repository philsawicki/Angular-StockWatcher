'use strict';

/**
 * Sparkline Bar Controller.
 */
angular.module('stockWatcher.Controllers')
	.controller('SparklineBarController', ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
		var margin = { top: 15, right: 10, bottom: 0, left: 10 },
		    width = 120 - margin.left - margin.right,
		    height = 27 - margin.top  - margin.bottom;

		var x = d3.scale.linear()
			.range([0, width]);

		var y = d3.scale.ordinal()
			.rangeRoundBands([0, height], 0);
		
		var formatValue = d3.format('$.2f');

		// Draw the Sparkline:
		drawChart();


		/**
		 * Draws the Sparkline Bar using d3js.
		 * @return {void}
		 */
		function drawChart() {
			// Variables:
			var max = parseFloat($scope.max, 10);
			var min = parseFloat($scope.min, 10);
			var current = parseFloat($scope.current, 10);
			//var middlePoint = min + (max - min) / 2;

			// Prevent unnecessary redraw if data is not available:
			if (max === 0 && min === 0) {
				return;
			}


			// Setup X-Axis:
			var xAxis = d3.svg.axis()
				.scale(x)
				.orient('top')
				.tickSize(2)
				.tickValues([min, max])
				.tickFormat(function(d) { return formatValue(d); });

			// Setup/update SVG Graphics:
			var svg = d3.select($element[0])
				.select('svg')
				.remove();

			svg = d3.select($element[0])
				.append('svg')
					.attr('width', width + margin.left + margin.right)
					.attr('height', height + margin.top + margin.bottom)
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			// Format data for display:
			var data = [{
				name: 'A',
				value: current
			}];


			x.domain([min, max]);
			y.domain(data.map(function(d) { return d.name; }));

			svg.selectAll('.bar')
					.data(data)
				.enter().append('rect')
					.attr('class', 'bar positive')
					.attr('x', function(d) { return x(min) })
					.attr('y', function(d) { return y(d.name); })
					.attr('width', function(d) { return x(current); })
					.attr('height', y.rangeBand());

			svg.append('g')
				.attr('class', 'x axis')
				.call(xAxis);

			// Align x-Axis text labels:
			svg.selectAll('.x.axis .tick text').each(function (labelText, childIndex) {
				if (childIndex === 0) {
					// First Label
					d3.select(this)
						.attr('style', 'text-anchor: start;');
				} else if (childIndex === 1) {
					// Last Label
					d3.select(this)
						.attr('style', 'text-anchor: end;');
				}
			});

			svg.append('g')
					.attr('class', 'y axis')
				.append('line')
					.attr('x1', x(0))
					.attr('x2', x(0))
					.attr('y2', height);
		};


		/**
		 * Redraws the Sparkline Bar when watched variables are updated.
		 * @param  {Array<int>} newValues News values of watched variables.
		 * @param  {Array<int>} oldValues Old values of watched variables.
		 * @return {void}
		 */
		$scope.$watchCollection('[current,min,max]', function (newValues, oldValues) {
			if (   newValues[0] !== oldValues[0]
				|| newValues[1] !== oldValues[1]
				|| newValues[2] !== oldValues[2]) {
				drawChart();
			}
		});
	}]);


/**
 * Sparkline Bar Controller.
 */
//angular.module('stockWatcher.Controllers')
//	.controller('SparklineBarController', ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
//		var margin = { top: 15, right: 10, bottom: 0, left: 10 },
//		    width = 120 - margin.left - margin.right,
//		    height = 27 - margin.top  - margin.bottom;
//
//		var x = d3.scale.linear()
//			.range([0, width]);
//
//		var y = d3.scale.ordinal()
//			.rangeRoundBands([0, height], 0);
//		
//		var formatValue = d3.format('$.2f');
//
//		console.log('width', $element.width());
//		console.log('height', $element.height());
//
//		// Draw the Sparkline:
//		drawChart();
//
//
//		/**
//		 * Draws the Sparkline Bar using d3js.
//		 * @return {void}
//		 */
//		function drawChart() {
//			// Variables:
//			var max = parseFloat($scope.max, 10);
//			var min = parseFloat($scope.min, 10);
//			var current = parseFloat($scope.current, 10);
//			var middlePoint = min + (max - min) / 2;
//
//			// Prevent unnecessary redraw if data is not available:
//			if (max === 0 && min === 0) {
//				return;
//			}
//
//
//			// Setup X-Axis:
//			var xAxis = d3.svg.axis()
//				.scale(x)
//				.orient('top')
//				.tickSize(2)
//				.tickValues([min, middlePoint, max])
//				.tickFormat(function(d) { return formatValue(d); });
//
//			// Setup/update SVG Graphics:
//			var svg = d3.select($element[0])
//				.select('svg')
//				.remove();
//
//			svg = d3.select($element[0])
//				.append('svg')
//					.attr('width', width + margin.left + margin.right)
//					.attr('height', height + margin.top + margin.bottom)
//				.append('g')
//					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
//
//			// Format data for display:
//			var data = [{
//				name: 'A',
//				value: current
//			}];
//
//
//			x.domain([min, max]);
//			y.domain(data.map(function(d) { return d.name; }));
//
//			svg.selectAll('.bar')
//					.data(data)
//				.enter().append('rect')
//					.attr('class', function(d) { return d.value < middlePoint ? 'bar negative' : 'bar positive'; })
//					.attr('x', function(d) { return x(Math.min(middlePoint, current)) })
//					.attr('y', function(d) { return y(d.name); })
//					.attr('width', function(d) { return Math.abs(x(current) - x(middlePoint)); })
//					.attr('height', y.rangeBand());
//
//			svg.append('g')
//				.attr('class', 'x axis')
//				.call(xAxis);
//
//			// Align x-Axis text labels:
//			svg.selectAll('.x.axis .tick text').each(function (labelText, childIndex) {
//				if (childIndex === 0) {
//					// First Label
//					d3.select(this)
//						.attr('style', 'text-anchor: start;');
//				} else if (childIndex === 2) {
//					// Last Label
//					d3.select(this)
//						.attr('style', 'text-anchor: end;');
//				}
//			});
//
//			svg.append('g')
//					.attr('class', 'y axis')
//				.append('line')
//					.attr('x1', x(0))
//					.attr('x2', x(0))
//					.attr('y2', height);
//		};
//
//
//		/**
//		 * Redraws the Sparkline Bar when watched variables are updated.
//		 * @param  {Array<int>} newValues News values of watched variables.
//		 * @param  {Array<int>} oldValues Old values of watched variables.
//		 * @return {void}
//		 */
//		$scope.$watchCollection('[current,min,max]', function (newValues, oldValues) {
//			if (   newValues[0] !== oldValues[0]
//				|| newValues[1] !== oldValues[1]
//				|| newValues[2] !== oldValues[2]) {
//				drawChart();
//			}
//		});
//	}]);
