"use strict";

/**
 * This interface represents the effort or expense required to travel a
 * certain distance.
 *
 * @class
 * @interface
 * @memberof everoute.travel
 */
function TravelCost() {

}

/**
 * @return {String} Type identifying what kind of cost this represents.
 * @memberof! everoute.universe.TravelCost.prototype
 */
TravelCost.prototype.getType = function() {
  throw new Error("Interface Implementation");
};

/**
 * @return {Number} The value or amount this cost has. Unit is type dependent.
 * @memberof! everoute.universe.TravelCost.prototype
 */
TravelCost.prototype.getValue = function() {
  throw new Error("Interface Implementation");
};

/**
 * @return {everoute.travel.TravelCost} The resulting cost from this and other.
 * @memberof! everoute.universe.TravelCost.prototype
 */
TravelCost.prototype.join = function(other) {
  throw new Error("Interface Implementation");
};
