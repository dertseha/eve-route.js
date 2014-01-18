"use strict";

var TravelCostSum = require("./TravelCostSum");

/**
 * A path is a sequence of steps and a running total of costs.
 * The sequence of steps is realized using back references to the previous
 * path.
 *
 * @constructor
 * @memberof everoute.travel
 */
function Path(step, previous) {
  var stepCosts = step.getCosts();

  this.step = step;
  this.previous = previous;
  this.costSum = previous ? previous.getCostSum().add(stepCosts) : new TravelCostSum(stepCosts);
}

/**
 * @return {Boolean} true if this is the first step of the path
 * @memberof! everoute.travel.Path.prototype
 */
Path.prototype.isStart = function() {
  return !this.previous;
};

/**
 * @return {everoute.travel.Path} the path preceeding this one
 * @throws {Error} When this path is the start
 * @memberof! everoute.travel.Path.prototype
 */
Path.prototype.getPrevious = function() {
  if (this.isStart()) {
    throw new Error("Start of a path has no predecessor");
  }

  return this.previous;
};

/**
 * Extends this path with another step, returning a new path.
 *
 * @param {everoute.travel.Step} step the new step
 * @return {everoute.travel.Path} the resulting new path
 * @memberof! everoute.travel.Path.prototype
 */
Path.prototype.extend = function(step) {
  return new Path(step, this);
};

/**
 * @return {everoute.travel.Step} The step of this path
 * @memberof! everoute.travel.Path.prototype
 */
Path.prototype.getStep = function() {
  return this.step;
};

/**
 * @return {Array.<everoute.travel.Step>} The list of steps of this path
 * @memberof! everoute.travel.Path.prototype
 */
Path.prototype.getSteps = function() {
  var result = [this.step];

  return this.isStart() ? result : this.previous.getSteps().concat(result);
};

/**
 * @return {everoute.travel.TravelCostSum} The current sum of costs
 * @memberof! everoute.travel.Path.prototype
 */
Path.prototype.getCostSum = function() {
  return this.costSum;
};

module.exports = Path;
