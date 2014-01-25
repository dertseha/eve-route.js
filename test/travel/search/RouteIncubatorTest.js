/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("RouteIncubator", function() {
  var AddingTravelCost = everoute.travel.AddingTravelCost;
  var Route = everoute.travel.search.Route;
  var RouteIncubator = everoute.travel.search.RouteIncubator;
  var Path = everoute.travel.Path;
  var StepBuilder = everoute.travel.StepBuilder;

  var incubator;
  var callback;
  var capCalled;
  var capability;
  var rand = {
    getIndex: function() {
      return 0;
    }
  };
  var rule = {
    compare: function() {
      return 0;
    }
  };
  var waypoints;
  var destination;

  var routes;

  var simpleCriterion = {
    isDesired: function(path) {
      return !path.isStart();
    },
    shouldSearchContinueWith: function(path) {
      return path.isStart();
    }
  };

  beforeEach(function() {
    var capCalled = 1;
    capability = {
      getNextPaths: function(path) {
        var builder = new StepBuilder((path.getStep().getSolarSystemId() % 10) + (10 * capCalled++) + 1);

        builder.withEnterCosts([new AddingTravelCost("length", 1)]);

        return [path.extend(builder.build())];
      }
    };

    routes = [];
    callback = function(route) {
      routes.push(route);
    };

    waypoints = [];
    destination = null;

    incubator = null;
  });

  it("should return false for continueGrowth() if empty", function() {
    givenAnIncubator();

    var result = incubator.continueGrowth();

    expect(result).to.be.equal(false);
  });

  it("should create immediate result if nothing to search", function() {
    var chromosome = createChromosome(0, [], null);

    givenAnIncubator();

    whenRequesting(chromosome);

    expect(routes.length).to.be.equal(1);
  });

  it("should provide a result of type Route", function() {
    var chromosome = createChromosome(0, [], null);

    givenAnIncubator();

    whenRequesting(chromosome);

    expect(routes[0]).to.be.a(Route);
  });

  it("should search for result if only destination requested", function() {
    var chromosome = createChromosome(0, [], null);

    givenDestinationIsRequested();
    givenAnIncubator();
    givenARequestedChromosome(chromosome);

    whenGrowingUntilDone();

    thenLengthOfLastFoundRouteShouldBe(1);
  });

  it("should search including waypoints", function() {
    var chromosome = createChromosome(0, [createWaypoint(0), createWaypoint(1)], null);

    givenWaypointsAreRequested(2);
    givenDestinationIsRequested();
    givenAnIncubator();
    givenARequestedChromosome(chromosome);

    whenGrowingUntilDone();

    thenLengthOfLastFoundRouteShouldBe(3);
  });

  it("should create dedicated path segments per waypoint", function() {
    var chromosome = createChromosome(0, [createWaypoint(0), createWaypoint(1)], null);

    givenWaypointsAreRequested(2);
    givenDestinationIsRequested();
    givenAnIncubator();
    givenARequestedChromosome(chromosome);

    whenGrowingUntilDone();

    thenTheLastRouteShouldBe("[0@*]-0[11@*]-1[22@*]-[33@*]");
  });

  it("should drop culture if waypoint can't be reached", function() {
    var chromosome = createChromosome(0, [createWaypoint(0), createWaypoint(1)], null);

    givenWaypointsAreRequested(2);
    givenDestinationIsRequested();
    givenAFailingCapability();
    givenAnIncubator();
    givenARequestedChromosome(chromosome);

    whenGrowingUntilDone();

    expect(routes.length).to.be.equal(0);
  });

  it("should support searching two chromosomes in parallel", function() {
    var chromosome = createChromosome(0, [createWaypoint(0), createWaypoint(1)], null);

    givenWaypointsAreRequested(2);
    givenDestinationIsRequested();
    givenAnIncubator();
    givenARequestedChromosome(chromosome);
    givenARequestedChromosome(chromosome);

    whenGrowingUntilDone();

    expect(routes.length).to.be.equal(2);
  });

  it("should keep intermediate results for quicker retrieval for later requests", function() {
    var chromosome = createChromosome(0, [createWaypoint(0), createWaypoint(1)], null);

    givenWaypointsAreRequested(2);
    givenDestinationIsRequested();
    givenAnIncubator();
    givenAnIncubatedChromosome(chromosome);

    whenRequesting(chromosome);

    expect(routes.length).to.be.equal(2);
  });

  it("should respect chromosome hints in destination", function() {
    var chromosome1 = createChromosome(0, [], null);
    var chromosome2 = createChromosome(0, [], "100@*");

    givenDestinationIsRequested();
    givenACapabilityReturning([10, 100]);
    givenAnIncubator();
    givenAnIncubatedChromosome(chromosome1);

    whenRequesting(chromosome2);

    thenTheLastRouteShouldBe("[0@*]-[100@*]");
  });

  it("should respect chromosome hints for waypoint", function() {
    var chromosome1 = createChromosome(0, [createWaypoint(0), createWaypoint(1)], null);
    var chromosome2 = createChromosome(0, [createWaypoint(0, "100@*"), createWaypoint(1)], null);

    givenWaypointsAreRequested(2);
    givenACapabilityReturning([10, 100]);
    givenAnIncubator();
    givenAnIncubatedChromosome(chromosome1);
    givenARequestedChromosome(chromosome2);

    whenGrowingUntilDone();

    thenTheLastRouteShouldBe("[0@*]-0[100@*]-1[10@*]");
  });

  function givenWaypointsAreRequested(amount) {
    for (var i = 0; i < amount; i++) {
      waypoints.push(simpleCriterion);
    }
  }

  function givenDestinationIsRequested() {
    destination = simpleCriterion;
  }

  function givenAFailingCapability() {
    capability = {
      getNextPaths: function() {
        return [];
      }
    };
  }

  function givenACapabilityReturning(destinations) {
    capability = {
      getNextPaths: function(path) {
        var result = [];

        destinations.forEach(function(dest) {
          var builder = new StepBuilder(dest);

          builder.withEnterCosts([new AddingTravelCost("length", 1)]);

          result.push(path.extend(builder.build()));
        });

        return result;
      }
    };

  }

  function givenAnIncubator() {
    incubator = new RouteIncubator(callback, capability, rule, waypoints, destination, rand);
  }

  function whenRequesting(chromosome) {
    incubator.request(chromosome);
  }

  function givenARequestedChromosome(chromosome) {
    whenRequesting(chromosome);
  }

  function givenAnIncubatedChromosome(chromosome) {
    givenARequestedChromosome(chromosome);
    whenGrowingUntilDone();
  }

  function whenGrowingUntilDone() {
    var count = 0;
    var limit = 1000;
    var shouldContinue = true;

    while (shouldContinue && (count < limit)) {
      count++;
      shouldContinue = incubator.continueGrowth();
    }
    if (count >= limit) {
      expect().fail("Incubator didn't finish");
    }
  }

  function thenLengthOfLastFoundRouteShouldBe(expected) {
    expect(routes[routes.length - 1].getCostSum().getTotal()[0].getValue()).to.be.equal(expected);
  }

  function thenTheLastRouteShouldBe(expected) {
    var result = routes[routes.length - 1].toString();

    expect(result).to.be.equal(expected);
  }

  function createWaypoint(index, destinationKey) {
    var result = {
      index: index,
      destinationKey: destinationKey || null
    };

    return result;
  }

  function createChromosome(startSystemId, waypoints, destinationKey) {
    var startPath = new Path(new StepBuilder(startSystemId).withEnterCosts([new AddingTravelCost("length", 0)]).build());
    var result = {
      startPath: startPath,
      waypoints: waypoints,
      destinationKey: destinationKey || null
    };

    return result;
  }

});
