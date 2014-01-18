/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("TravelRuleset", function() {
  var TravelCostSum = everoute.travel.TravelCostSum;
  var TravelRuleset = everoute.travel.rules.TravelRuleset;

  var rules;
  var result;

  beforeEach(function() {
    rules = [];
    result = null;
  });

  it("should return 0 if empty", function() {
    var sumA = new TravelCostSum([]);
    var sumB = new TravelCostSum([]);

    whenTheSumsAreCompared(sumA, sumB);

    thenTheComparisonResultShouldBe(0);
  });

  it("should return the first result not 0 from the contained rules", function() {
    var sumA = new TravelCostSum([]);
    var sumB = new TravelCostSum([]);

    givenARuleReturning(0);
    givenARuleReturning(1);
    givenARuleReturning(-1);

    whenTheSumsAreCompared(sumA, sumB);

    thenTheComparisonResultShouldBe(1);
  });

  function givenARuleReturning(value) {
    var rule = {
      compare: function() {
        return value;
      }
    };

    rules.push(rule);

    return rule;
  }

  function whenTheSumsAreCompared(sumA, sumB) {
    var ruleset = new TravelRuleset(rules);

    result = ruleset.compare(sumA, sumB);
  }

  function thenTheComparisonResultShouldBe(expected) {
    expect(result).to.be.equal(expected);
  }

});
