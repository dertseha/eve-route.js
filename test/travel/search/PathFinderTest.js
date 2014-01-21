/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("PathFinder", function() {
  var PathFinder = everoute.travel.search.PathFinder;
  var AnyLocation = everoute.travel.AnyLocation;
  var Path = everoute.travel.Path;
  var StepBuilder = everoute.travel.StepBuilder;

  var nextSteps;
  var capability;

  var collector;
  var collected;

  var criterion;

  var start;
  var finder;

  beforeEach(function() {
    nextSteps = {};

    capability = {
      getNextPaths: function(path) {
        var result = [];
        var systemId = path.getStep().getSolarSystemId();
        var list = nextSteps[systemId] || [];

        list.forEach(function(step) {
          result.push(path.extend(step));
        });

        return result;
      }
    };

    collected = [];
    collector = {
      collect: function(path) {
        collected.push(path);
      }
    };

    criterion = {
      isDesired: function(path) {
        return false;
      },
      shouldSearchContinueWith: function(path) {
        return true;
      }
    };

    start = new Path(createStep(0));

    finder = new PathFinder(start, capability, criterion, collector);
  });

  it("should run only once when capability returns nothing", function() {
    verifyContinueSearchCount(1);
  });

  it("should not do anything when done but still being called", function() {
    runSearchSomeTime();

    var spy = sinon.spy(capability, "getNextPaths");

    runSearchSomeTime();

    expect(spy).was.notCalled();
  });

  it("should run three times when two dead ends reported", function() {
    givenNextStepsAre(0, [createStep(1)]);
    givenNextStepsAre(1, [createStep(2)]);

    verifyContinueSearchCount(3);
  });

  it("should notify a result to collector only if desired", function() {
    givenNextStepsAre(0, [createStep(1), createStep(2)]);

    criterion.isDesired = function(path) {
      return path.getStep().getSolarSystemId() === 1;
    };

    runSearchSomeTime();

    expect(collected.length).to.be.equal(1);
  });

  it("should continue search only if criterion specifies it", function() {
    givenNextStepsAre(0, [createStep(1)]);
    givenNextStepsAre(1, [createStep(2)]);

    criterion.shouldSearchContinueWith = function(path) {
      return path.getStep().getSolarSystemId() !== 2;
    };

    verifyContinueSearchCount(2);
  });

  it("should notify the start as well", function() {
    givenNextStepsAre(0, [createStep(1), createStep(2)]);

    criterion.isDesired = function(path) {
      return path.getStep().getSolarSystemId() === 0;
    };

    runSearchSomeTime();

    expect(collected[0].getStep().getSolarSystemId()).to.be.equal(0);
  });

  function verifyContinueSearchCount(expected) {
    var count = runSearchSomeTime();

    expect(count).to.be.equal(expected);
  }

  function runSearchSomeTime() {
    var count = 0;
    var shouldContinue = true;

    while (shouldContinue && (count < 1000)) {
      count++;
      shouldContinue = finder.continueSearch();
    }

    return count;
  }

  function createStep(systemId) {
    return new StepBuilder(systemId).build();
  }

  function givenNextStepsAre(forId, list) {
    nextSteps[forId] = list;
  }

});
