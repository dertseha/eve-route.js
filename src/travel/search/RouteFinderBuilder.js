"use strict";

var DefaultRandomizer = require("../../util/DefaultRandomizer");
var RouteFinder = require("./RouteFinder");

/**
 * A builder for a route finder.
 *
 * @constructor
 * @param {everoute.travel.capabilities.TravelCapability} capability The capability for travel.
 * @param {everoute.travel.rules.TravelRule} rule The rule for searches.
 * @param {Array.<everoute.travel.Path>} startPaths An array of possible start paths.
 * @param {everoute.travel.search.SearchResultCollector.<everoute.travel.search.Route>} collector The collector for results.
 * @memberof everoute.travel.search
 */
function RouteFinderBuilder(capability, rule, startPaths, collector) {

  var waypoints = [];
  var destination = null;
  var randomizer = null;

  var populationLimit = 25;
  var generationLimit = 40000;
  var mutationPercentage = 10;


  this.getCapability = function() {
    return capability;
  };

  this.getRule = function() {
    return rule;
  };

  this.getStartPaths = function() {
    return startPaths;
  };

  /**
   * Sets the criteria for the waypoints. Each waypoint has one criterion.
   *
   * @param {Array.<everoute.travel.search.SearchCriterion>} criteria The criteria for the waypoints.
   */
  this.setWaypoints = function(criteria) {
    waypoints = criteria;
  };

  this.getWaypoints = function() {
    return waypoints;
  };

  /**
   * Sets the destination criterion. If none specified, no fixed destination is
   * used.
   *
   * @param {everoute.travel.search.SearchCriterion} criterion The criterion for the destination.
   */
  this.setDestination = function(criterion) {
    destination = criterion;
  };

  this.getDestination = function() {
    return destination;
  };

  this.getCollector = function() {
    return collector;
  };

  this.getRandomizer = function() {
    return randomizer || new DefaultRandomizer();
  };

  this.getPopulationLimit = function() {
    return populationLimit;
  };

  this.getGenerationLimit = function() {
    return generationLimit;
  };

  this.getMutationPercentage = function() {
    return mutationPercentage;
  };

  /**
   * @return {everoute.travel.search.RouteFinder} The resulting route finder
   */
  this.build = function() {
    return new RouteFinder(this);
  };
}

module.exports = RouteFinderBuilder;
