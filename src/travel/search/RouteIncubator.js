/* jshint maxparams:6 */
"use strict";

var Path = require("../Path");
var PathFinder = require("./PathFinder");
var RouteIncubatorCulture = require("./RouteIncubatorCulture");
var PathSearchAgent = require("./PathSearchAgent");

/**
 * This incubator receives route chromosomes to create the corresponding routes.
 *
 * @constructor
 * @param {Function} callback the function that receives new Route instances
 * @param {everoute.travel.capabilities.TravelCapability} capability The travelling capability for searches
 * @param {everoute.travel.rules.TravelRule} rule The rule for searching shortest paths
 * @param {Array.<everoute.travel.search.SearchCriterion>} waypoints The criteria for the waypoints
 * @param {everoute.travel.search.SearchCriterion} [destination] The criterion for the optional destination
 * @param {everoute.util.Randomizer} rand The randomizer for selecting unspecified destinations
 * @memberof everoute.travel.search
 */
function RouteIncubator(callback, capability, rule, waypoints, destination, rand) {
  this.callback = callback;
  this.capability = capability;
  this.rule = rule;
  this.waypoints = waypoints;
  this.destination = destination;
  this.rand = rand;

  this.agents = [];
  this.waypointsAgentsBySource = waypoints.map(function(entry) {
    return {};
  });
  this.destinationAgentsBySource = {};

  this.cultures = [];
}

/**
 * Continues any pending searches to finish routes.
 *
 * @return {Boolean} false if there is nothing to grow currently.
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.continueGrowth = function() {
  this.agents.forEach(function(agent) {
    agent.run();
  });

  return this.cultures.length > 0;
};

/**
 * Requests a route to be incubated according to given chromosome
 * @param {{}} chromosome The chromosome as route description
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.request = function(chromosome) {
  var culture = new RouteIncubatorCulture(chromosome);

  this.cultures.push(culture);
  this.continueCulture(culture);
};

/**
 * Continues processing a culture; Will cause the callback to be called if a
 * complete route could be created.
 *
 * @param {everoute.travel.search.RouteIncubatorCulture} culture The culture to process
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.continueCulture = function(culture) {
  var nextWaypoint = culture.getWaypointAmount();
  var lastPath = new Path(culture.getLastPath().getStep().asFirstStep());
  var chromosome = culture.getChromosome();
  var self = this;
  var agent;

  function onSearchFailed() {
    self.onCultureFailed(culture);
  }

  if (nextWaypoint < this.waypoints.length) {
    agent = this.getPathSearchAgent(this.waypointsAgentsBySource[nextWaypoint], lastPath, this.waypoints[nextWaypoint]);
    agent.request({
      searchFailed: onSearchFailed,
      searchCompleted: function() {
        culture.addWaypointPath(nextWaypoint, agent.getRandomPath(self.rand));
        self.continueCulture(culture);
      },
      pathFound: function(path) {
        culture.addWaypointPath(nextWaypoint, path);
        self.continueCulture(culture);
      }
    }, chromosome.waypoints[nextWaypoint].destinationKey);
  } else if (this.destination) {
    agent = this.getPathSearchAgent(this.destinationAgentsBySource, lastPath, this.destination);
    agent.request({
      searchFailed: onSearchFailed,
      searchCompleted: function() {
        culture.setDestinationPath(agent.getShortestPath());
        self.onCultureCompleted(culture);
      },
      pathFound: function(path) {
        culture.setDestinationPath(path);
        self.onCultureCompleted(culture);
      }
    }, chromosome.destinationKey);
  } else {
    this.onCultureCompleted(culture);
  }
};

/**
 * Returns an agent that is assigned to given start path in the specified
 * container. It will create a new agent if missing.
 *
 * @param {Object.<String, everoute.travel.search.PathSearchAgent>} agentsByKey Map of agenst by start key.
 * @param {everoute.travel.Path} startPath The path acting as the origin for the agent
 * @param {everoute.travel.search.SearchCriterion} criterion The criterion to use for a new finder.
 * @return {everoute.travel.search.PathSearchAgent} The resulting agent
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.getPathSearchAgent = function(agentsByKey, startPath, criterion) {
  var startKey = startPath.getDestinationKey();
  var agent = agentsByKey[startKey];

  if (!agent) {
    agentsByKey[startKey] = agent = new PathSearchAgent(startPath, this.capability, this.rule, criterion);
    this.agents.push(agent);
  }

  return agent;
};

/**
 * Called when a culture was completed and a route can be reported.
 *
 * @param {everoute.travel.search.RouteIncubatorCulture} culture The completed culture
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.onCultureCompleted = function(culture) {
  this.dropCulture(culture);
  this.callback(culture.toRoute());
};

/**
 * Called when a culture failed to be completed. It will simply be dropped.
 *
 * @param {everoute.travel.search.RouteIncubatorCulture} culture The failed culture
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.onCultureFailed = function(culture) {
  this.dropCulture(culture);
};

/**
 * Removes given culture from the incubator.
 *
 * @param {everoute.travel.search.RouteIncubatorCulture} culture The culture that shall be removed.
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.dropCulture = function(culture) {
  var index = this.cultures.indexOf(culture);

  this.cultures.splice(index, 1);
};

module.exports = RouteIncubator;
