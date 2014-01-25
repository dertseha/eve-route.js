"use strict";

/**
 * An ordered list of routes. The order is determined by a travel rule that
 * compares the total cost of a route.
 *
 * @constructor
 * @private
 * @param {everoute.travel.rules.TravelRule} rule The rule to determine optimal routes.
 * @memberof everoute.travel.search
 */
function RouteList(rule) {

  this.rule = rule;
  this.routes = [];
}

/**
 * @return {Number} Size of the list
 * @memberof! everoute.travel.search.RouteList.prototype
 */
RouteList.prototype.getSize = function() {
  return this.routes.length;
};

/**
 * @param {Number} index The index to retrieve.
 * @return {everoute.travel.search.Route} The route at given position.
 * @memberof! everoute.travel.search.RouteList.prototype
 */
RouteList.prototype.get = function(index) {
  return this.routes[index];
};

/**
 * Adds given route to the list. The given route is inserted at its sorted
 * position.
 *
 * @param {everoute.travel.search.Route} route The route that shall be added.
 * @return {Boolean} true if the new route was inserted at the first position.
 * @memberof! everoute.travel.search.RouteList.prototype
 */
RouteList.prototype.add = function(route) {
  var size = this.getSize();
  var costSum = route.getCostSum();
  var position = size - 1;
  var isBetter = true;

  // This loop assumes that the new route will most likely be worse than
  // the rest, so it starts at the end.
  while (isBetter && (position >= 0)) {
    isBetter = this.rule.compare(costSum, this.routes[position].getCostSum()) < 0;
    if (isBetter) {
      position--;
    }
  }

  this.routes.splice(position + 1, 0, route);

  return position === -1;
};

/**
 * Limits the list to the given amount.
 *
 * @param {Number} limit The size limit. Routes beyond this limit will be dropped.
 * @memberof! everoute.travel.search.RouteList.prototype
 */
RouteList.prototype.limit = function(limit) {
  var size = this.getSize();

  if (size > limit) {
    this.routes.splice(limit, size - limit);
  }
};

module.exports = RouteList;
