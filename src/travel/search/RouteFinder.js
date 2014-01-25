"use strict";

var RouteChromosomeSplicer = require("./RouteChromosomeSplicer");
var RouteIncubator = require("./RouteIncubator");
var RouteList = require("./RouteList");

/**
 * A finder of a route, consisting of a start path, a list of waypoints and an
 * optional destination. The order of the waypoints will be optimized during
 * the search.
 *
 * @constructor
 * @param {everoute.travel.search.RouteFinderBuilder} builder the builder with all parameters
 * @memberof everoute.travel.search
 */
function RouteFinder(builder) {
  var self = this;

  function onRouteFound(route) {
    self.onRouteFound(route);
  }

  this.rand = builder.getRandomizer();
  this.rule = builder.getRule();

  this.splicer = new RouteChromosomeSplicer(this.rand);
  this.population = new RouteList(this.rule);
  this.incubator = new RouteIncubator(onRouteFound, builder.getCapability(), this.rule,
    builder.getWaypoints(), builder.getDestination(), this.rand);

  this.startPaths = builder.getStartPaths().slice(0);
  this.waypoints = builder.getWaypoints().slice(0);
  this.collector = builder.getCollector();

  this.populationLimit = builder.getPopulationLimit();
  this.generationLimit = builder.getGenerationLimit();
  this.mutationPercentage = builder.getMutationPercentage();
  this.uncontestedLimit = this.generationLimit / 4;

  this.generationCount = 0;
  this.uncontestedCount = 0;

  this.bestRoute = null;
}

/**
 * Continues the search. This method should be called until it returned false.
 *
 * @return {Boolean} false if the search is completed
 * @memberof! everoute.travel.search.RouteFinder.prototype
 */
RouteFinder.prototype.continueSearch = function() {
  var result = false;

  if ((this.generationCount < this.generationLimit) && (this.uncontestedCount < this.uncontestedLimit)) {
    result = true;
    if (!this.incubator.continueGrowth()) {
      this.generationCount++;
      this.uncontestedCount++;

      this.ensurePopulationSize();
      this.createOffsprings();
    }
  }

  return result;
};

/**
 * Called when a route was found.
 *
 * @private
 * @param {everoute.travel.search.Route} route The found route
 * @memberof! everoute.travel.search.RouteFinder.prototype
 */
RouteFinder.prototype.onRouteFound = function(route) {
  var isBest = this.population.add(route);

  if (isBest) {
    this.uncontestedCount = 0;
    this.collector.collect(route);
  }
};

/**
 * Ensures a properly sized population.
 *
 * @private
 * @memberof! everoute.travel.search.RouteFinder.prototype
 */
RouteFinder.prototype.ensurePopulationSize = function() {
  var missing;

  this.population.limit(this.populationLimit);

  missing = this.populationLimit - this.population.getSize();
  while (missing > 0) {
    this.incubator.request(this.createRandomChromosome());
    missing--;
  }
};

/**
 * @private
 * @return {{}} A new, random chromosome
 * @memberof! everoute.travel.search.RouteFinder.prototype
 */
RouteFinder.prototype.createRandomChromosome = function() {
  return this.splicer.createRandom(this.startPaths, this.waypoints.length);
};

/**
 * Creates offsprings from the current population.
 *
 * @private
 * @memberof! everoute.travel.search.RouteFinder.prototype
 */
RouteFinder.prototype.createOffsprings = function() {
  var size = this.population.getSize();
  var crossoverIndex = this.rand.getIndex(this.waypoints.length + 1);
  var shouldMutate = this.rand.getIndex(100) < this.mutationPercentage;
  var parent1;
  var parent2;

  if (size >= 2) {
    parent1 = this.population.get(this.rand.getIndex(size)).getChromosome();
    parent2 = this.population.get(this.rand.getIndex(size)).getChromosome();

    if (shouldMutate) {
      this.createMutatedOffsprings(parent1, parent2, crossoverIndex);
    } else {
      this.incubator.request(this.splicer.createOffspring(parent1, parent2, crossoverIndex));
      this.incubator.request(this.splicer.createOffspring(parent2, parent1, crossoverIndex));
    }
  }
};

/**
 * Creates mutated offsprings using given parameters. The parents are spliced with
 * a new, random chromosome at the given crossover index.
 *
 * @private
 * @param {{}} parent1 The first chromosome
 * @param {{}} parent2 The second chromosome
 * @param {Number} crossoverIndex The waypoint index at which to splice
 * @memberof! everoute.travel.search.RouteFinder.prototype
 */
RouteFinder.prototype.createMutatedOffsprings = function(parent1, parent2, crossoverIndex) {
  var randomChromosome = this.createRandomChromosome();

  this.incubator.request(this.splicer.createOffspring(parent1, randomChromosome, crossoverIndex));
  this.incubator.request(this.splicer.createOffspring(randomChromosome, parent1, crossoverIndex));
  this.incubator.request(this.splicer.createOffspring(parent2, randomChromosome, crossoverIndex));
  this.incubator.request(this.splicer.createOffspring(randomChromosome, parent2, crossoverIndex));
};

module.exports = RouteFinder;
