/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("MinSecurityTravelRule", function() {
  var security = everoute.travel.rules.security;

  var TravelCostSum = everoute.travel.TravelCostSum;

  var rule = security.getMinRule(0.5);

  var sumA;
  var sumB;

  beforeEach(function() {
    sumA = new TravelCostSum([]);
    sumB = new TravelCostSum([]);
  });

  it("should return 0 if sums don't contain any costs", function() {
    var result = rule.compare(sumA, sumB);

    expect(result).to.be.equal(0);
  });

  it("should return negative if sumB has one lowsec entry", function() {
    sumA = sumA.add([security.getTravelCost(0.7, 1)]);
    sumB = sumB.add([security.getTravelCost(0.3, 1)]);

    var result = rule.compare(sumA, sumB);

    expect(result < 0).to.be.equal(true);
  });

  it("should return positive if sumA has one lowsec entry", function() {
    sumA = sumA.add([security.getTravelCost(0.4, 1)]);
    sumB = sumB.add([security.getTravelCost(0.8, 1)]);

    var result = rule.compare(sumA, sumB);

    expect(result > 0).to.be.equal(true);
  });

  it("should return 0 if both have equal amount of lowsec entries", function() {
    sumA = sumA.add([security.getTravelCost(0.4, 1)]);
    sumB = sumB.add([security.getTravelCost(0.3, 1)]);

    var result = rule.compare(sumA, sumB);

    expect(result).to.be.equal(0);
  });

  it("should return negative if both are lowsec but sumA has a lesser cost", function() {
    sumA = sumA.add([security.getTravelCost(0.4, 1)]);
    sumB = sumB.add([security.getTravelCost(0.3, 2)]);

    var result = rule.compare(sumA, sumB);

    expect(result < 0).to.be.equal(true);
  });

  it("should treat the limit as inclusive", function() {
    sumA = sumA.add([security.getTravelCost(0.3, 1)]);
    sumB = sumB.add([security.getTravelCost(0.5, 1)]);

    var result = rule.compare(sumA, sumB);

    expect(result > 0).to.be.equal(true);
  });
});
