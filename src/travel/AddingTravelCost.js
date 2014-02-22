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
  this.type = type;
  this.value = value;
}

AddingTravelCost.prototype.getType = function() {
  return this.type;
};

AddingTravelCost.prototype.getValue = function() {
  return this.value;
};

AddingTravelCost.prototype.join = function(other) {
  return new AddingTravelCost(this.type, this.value + other.getValue());
};

module.exports = AddingTravelCost;
