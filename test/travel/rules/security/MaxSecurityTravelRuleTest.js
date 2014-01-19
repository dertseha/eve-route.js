/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("MaxSecurityTravelRule", function() {
  var security = everoute.travel.rules.security;

  var TravelCostSum = everoute.travel.TravelCostSum;

  var rule = security.getMaxRule(0.5);

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

  it("should return 0 if both have only lowsec entries", function() {
    sumA = sumA.add([security.getTravelCost(0.2, 1), security.getTravelCost(0.3, 1)]);
    sumB = sumB.add([security.getTravelCost(0.3, 1)]);

    var result = rule.compare(sumA, sumB);

    expect(result).to.be.equal(0);
  });

  it("should return negative if sumB has one highsec entry", function() {
    sumA = sumA.add([security.getTravelCost(0.2, 1)]);
    sumB = sumB.add([security.getTravelCost(1.0, 1)]);

    var result = rule.compare(sumA, sumB);

    expect(result < 0).to.be.equal(true);
  });

  it("should return positive if sumA has one highsec entry", function() {
    sumA = sumA.add([security.getTravelCost(0.6, 1)]);
    sumB = sumB.add([security.getTravelCost(0.2, 1)]);

    var result = rule.compare(sumA, sumB);

    expect(result > 0).to.be.equal(true);
  });

  it("should return 0 if both have equal amount of highsec entries", function() {
    sumA = sumA.add([security.getTravelCost(0.8, 1)]);
    sumB = sumB.add([security.getTravelCost(0.7, 1)]);

    var result = rule.compare(sumA, sumB);

    expect(result).to.be.equal(0);
  });

  it("should return negative if both are highsec but sumA has a lesser cost", function() {
    sumA = sumA.add([security.getTravelCost(0.7, 1)]);
    sumB = sumB.add([security.getTravelCost(0.8, 2)]);

    var result = rule.compare(sumA, sumB);

    expect(result < 0).to.be.equal(true);
  });

  it("should treat the limit as exclusive", function() {
    sumA = sumA.add([security.getTravelCost(0.5, 1)]);
    sumB = sumB.add([security.getTravelCost(0.3, 1)]);

    var result = rule.compare(sumA, sumB);

    expect(result > 0).to.be.equal(true);
  });
});
