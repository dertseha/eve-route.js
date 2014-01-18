/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("PathContest", function() {
  var AddingTravelCost = everoute.travel.AddingTravelCost;
  var AnyLocation = everoute.travel.AnyLocation;
  var PathContest = everoute.travel.PathContest;
  var Path = everoute.travel.Path;
  var StepBuilder = everoute.travel.StepBuilder;
  var NaturalOrderTravelRule = everoute.travel.rules.NaturalOrderTravelRule;

  var nullCost = new AddingTravelCost("test", 0);
  var rule = new NaturalOrderTravelRule(nullCost);

  var contest;
  var result;

  beforeEach(function() {
    contest = new PathContest(rule);
    result = null;
  });

  it("should return true for the first path to enter", function() {
    var path = new Path(createStep(0, 0));

    whenAPathEnters(path);

    thenTheResultShouldBe(true);
  });

  it("should return false if the new path is not better than the previous", function() {
    var path1 = new Path(createStep(0, 0));
    var path2 = new Path(createStep(0, 0));

    givenAnEnteredPath(path1);

    whenAPathEnters(path2);

    thenTheResultShouldBe(false);
  });

  it("should return true if the new path is better than the previous", function() {
    var path1 = new Path(createStep(0, 10));
    var path2 = new Path(createStep(0, 0));

    givenAnEnteredPath(path1);

    whenAPathEnters(path2);

    thenTheResultShouldBe(true);
  });

  it("should return true if the identical path enters", function() {
    var path = new Path(createStep(0, 0));

    givenAnEnteredPath(path);

    whenAPathEnters(path);

    thenTheResultShouldBe(true);
  });

  it("should return false for new end if an earlier part of the path was contested", function() {
    var pathA1 = new Path(createStep(0, 100));
    givenAnEnteredPath(pathA1);
    var pathA2 = pathA1.extend(createStep(1, 20));
    givenAnEnteredPath(pathA2);
    givenAnEnteredPath(new Path(createStep(0, 50)));

    whenAPathEnters(pathA2.extend(createStep(2, 20)));

    thenTheResultShouldBe(false);
  });

  it("should return false for better end if an earlier part of the path was contested", function() {
    var pathA1 = new Path(createStep(0, 100));
    givenAnEnteredPath(pathA1);
    var pathA2 = pathA1.extend(createStep(1, 20));
    givenAnEnteredPath(pathA2);
    givenAnEnteredPath(new Path(createStep(0, 50)));

    whenAPathEnters(pathA1.extend(createStep(1, 10)));

    thenTheResultShouldBe(false);
  });

  it("should return false for same end if an earlier part of the path was contested", function() {
    var pathA1 = new Path(createStep(0, 100));
    givenAnEnteredPath(pathA1);
    var pathA2 = pathA1.extend(createStep(1, 20));
    givenAnEnteredPath(pathA2);
    givenAnEnteredPath(new Path(createStep(0, 50)));

    whenAPathEnters(pathA2);

    thenTheResultShouldBe(false);
  });

  function createStep(systemId, costValue) {
    var cost = new AddingTravelCost("test", costValue);

    return new StepBuilder(systemId).withEnterCosts([cost]).build();
  }

  function givenAnEnteredPath(path) {
    contest.enter(path);
  }

  function whenAPathEnters(path) {
    result = contest.enter(path);
  }

  function thenTheResultShouldBe(expected) {
    expect(result).to.be.equal(expected);
  }

});
