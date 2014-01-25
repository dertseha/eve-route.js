"use strict";

var PathFinder = require("./PathFinder");
var PathContest = require("../PathContest");
var StaticPathContestProvider = require("../StaticPathContestProvider");
var OptimizingTravelCapability = require("../capabilities/OptimizingTravelCapability");

/**
 * An agent that provides paths from a certain start. It first searches for
 * possible destinations and then keeps them for later referral.
 *
 * @constructor
 * @private
 * @param {everoute.travel.Path} start The originating path
 * @param {everoute.travel.capabilties.TravelCapability} capability The capability for searches.
 * @param {everoute.travel.rules.TravelRule} rule The rule to determine optimal paths.
 * @param {everoute.travel.search.SearchCriterion} criterion The search criterion
 * @memberof everoute.travel.search
 */
function PathSearchAgent(start, capability, rule, criterion) {
  var self = this;

  this.rule = rule;
  this.queries = [];
  this.shortest = null;
  this.results = {};

  var contest = new PathContest(rule);
  var finderCapability = new OptimizingTravelCapability(capability, new StaticPathContestProvider(contest));

  this.finder = new PathFinder(start, finderCapability, criterion, {
    collect: function(path) {
      self.onFinderResult(path);
    }
  });
}

/**
 * Runs the agent (performs the search if still pending)
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.run = function() {
  if (this.finder && !this.finder.continueSearch()) {
    delete this.finder;
    this.onFinderCompleted();
  }
};

/**
 * @return {everoute.travel.Path} The shortest path found
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.getShortestPath = function() {
  return this.shortest;
};

/**
 * Returns a random path from the results.
 *
 * @param {everoute.util.Randomizer} rand The randomizer to use for the selection.
 * @return {everoute.trave.Path} A path instance from the results.
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.getRandomPath = function(rand) {
  var keys = [];
  var key;

  for (key in this.results) {
    if (this.results.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  key = keys[rand.getIndex(keys.length)];

  return this.results[key];
};

/**
 * Requests a path to given destination key. Will call given listener, either
 * immediately or when a pending search has completed.
 *
 * @param {everoute.travel.search.PathSearchAgentListener} listener Listener to call when search completed.
 * @param {String} destinationKey The destination key to look out for.
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.request = function(listener, destinationKey) {
  var query = {
    listener: listener,
    destinationKey: destinationKey
  };

  if (this.finder) {
    this.queries.push(query);
  } else {
    this.completeQuery(query);
  }
};

/**
 * Called when the PathFinder found a result.
 *
 * @param {everoute.travel.Path} path The found path.
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.onFinderResult = function(path) {
  this.results[path.getDestinationKey()] = path;
  if (!this.shortest || this.rule.compare(path.getCostSum(), this.shortest.getCostSum()) < 0) {
    this.shortest = path;
  }
};

/**
 * Called when the PathFinder has completed. Will notify any pending listeners.
 *
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.onFinderCompleted = function() {
  var self = this;

  this.queries.forEach(function(query) {
    self.completeQuery(query);
  });
  delete this.queries;
};

/**
 * Analyzes the available results and notifies the listener of given query.
 *
 * @param {{}} query A pending query
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.completeQuery = function(query) {
  var hasResults = !! this.shortest;

  if (!hasResults) {
    query.listener.searchFailed();
  } else if (!query.destinationKey || !this.results.hasOwnProperty(query.destinationKey)) {
    query.listener.searchCompleted();
  } else {
    query.listener.pathFound(this.results[query.destinationKey]);
  }
};

module.exports = PathSearchAgent;
