"use strict";

/**
 * This class is a travel cost that adds up.
 *
 * @constructor
 * @implements {everoute.travel.TravelCost}
 * @extends {everoute.travel.TravelCost}
 * @memberof everoute.travel
 * @param {String} type cost type
 * @param {Number} value the value
 */
function AddingTravelCost(type, value) {
  this.getType = function() {
    return type;
  };

  this.getValue = function() {
    return value;
  };

  this.join = function(other) {
    return new AddingTravelCost(type, value + other.getValue());
  };
}

module.exports = AddingTravelCost;
