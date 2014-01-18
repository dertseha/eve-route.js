/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("OptimizingTravelCapability", function() {
  var OptimizingTravelCapability = everoute.travel.capabilities.OptimizingTravelCapability;
  var StaticPathContestProvider = everoute.travel.StaticPathContestProvider;
  var PathContest = everoute.travel.PathContest;
  var AddingTravelCost = everoute.travel.AddingTravelCost;
  var AnyLocation = everoute.travel.AnyLocation;
  var Path = everoute.travel.Path;
  var Step = everoute.travel.Step;

  var baseCap;
  var capability;

  var rule;
  var contest;
  var nullCost = new AddingTravelCost("test", 0);

  var nextSteps;

  beforeEach(function() {
    nextSteps = {};

    baseCap = {
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
    rule = {
      compare: function(sumA, sumB) {
        return sumA.getCost(nullCost).getValue() - sumB.getCost(nullCost).getValue();
      }
    };
    contest = new PathContest(rule);
    capability = new OptimizingTravelCapability(baseCap, new StaticPathContestProvider(contest));
  });

  it("should return result from base capability if all OK", function() {
    var path = new Path(createStep(0, 100));

    givenNextStepsAre(0, [
      createStep(1, 10),
      createStep(2, 20)
    ]);

    var result = capability.getNextPaths(path);

    expect(result.length).to.be.equal(2);
  });

  it("should return empty array if origin is rejected by contest", function() {
    contest.enter(new Path(createStep(0, 0)));
    var path = new Path(createStep(0, 100));

    givenNextStepsAre(0, [
      createStep(1, 10),
      createStep(2, 20)
    ]);

    var result = capability.getNextPaths(path);

    expect(result.length).to.be.equal(0);
  });

  it("should return optimized array if base capability provides duplicates", function() {
    var path = new Path(createStep(0, 100));

    givenNextStepsAre(0, [
      createStep(1, 10),
      createStep(2, 20),
      createStep(1, 5)
    ]);

    var result = capability.getNextPaths(path);

    expect(result.length).to.be.equal(2);
  });

  function createStep(systemId, costValue) {
    var cost = new AddingTravelCost("test", costValue);

    return new Step(systemId, new AnyLocation(), [cost]);
  }

  function givenNextStepsAre(forId, list) {
    nextSteps[forId] = list;
  }
});
