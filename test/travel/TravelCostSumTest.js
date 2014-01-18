/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("TravelCostSum", function() {
  var TravelCostSum = everoute.travel.TravelCostSum;
  var AddingTravelCost = everoute.travel.AddingTravelCost;

  var sum;

  beforeEach(function() {
    sum = new TravelCostSum([]);
  });

  it("should return an empty total when no costs involved", function() {
    var result = sum.getTotal();

    expect(result).to.be.eql([]);
  });

  it("should produce a new sum when adding costs", function() {
    var result = sum.add([]);

    expect(result).to.be.a(TravelCostSum);
  });

  it("should add new costs if previously unknown", function() {
    var cost = new AddingTravelCost("money", 100);
    var result = sum.add([cost]);

    expect(result.getTotal()[0].getValue()).to.be.equal(100);
  });

  it("should be immutable", function() {
    var cost = new AddingTravelCost("money", 100);

    sum.add([cost]);

    expect(sum.getTotal()).to.be.eql([]);
  });

  it("should keep original costs when summing if they haven't been changed", function() {
    sum = sum.add([new AddingTravelCost("time", 10)]);
    sum = sum.add([new AddingTravelCost("money", 200)]);
    var result = sum.getTotal();

    expect(result.length).to.be.equal(2);
  });

  it("should join costs if same type is already existing", function() {
    sum = sum.add([new AddingTravelCost("time", 10)]);
    sum = sum.add([new AddingTravelCost("time", 10)]);
    var result = sum.getTotal();

    expect(result[0].getValue()).to.be.equal(20);
  });

  it("should return null cost if unknown", function() {
    var result = sum.getCost(new AddingTravelCost("time", 1000));

    expect(result.getValue()).to.be.equal(1000);
  });

  it("should return specific cost if known", function() {
    sum = sum.add([new AddingTravelCost("time", 10)]);
    var result = sum.getCost(new AddingTravelCost("time", 0));

    expect(result.getValue()).to.be.equal(10);
  });

  it("should adding several costs of the same type", function() {
    sum = sum.add([new AddingTravelCost("time", 10), new AddingTravelCost("time", 10)]);
    var result = sum.getTotal();

    expect(result[0].getValue()).to.be.equal(20);
  });
});
