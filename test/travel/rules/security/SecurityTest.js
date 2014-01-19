/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("everoute.travel.rules.security namespace", function() {
  var security = everoute.travel.rules.security;

  describe("Static getTravelCostType()", function() {
    it("should return a 'security00' for value 0.0", function() {
      verifyType("security00", 0.0);
    });

    it("should return a 'security04' for value 0.4", function() {
      verifyType("security04", 0.4);
    });

    it("should return a 'security10' for value 1.0", function() {
      verifyType("security10", 1.0);
    });

    function verifyType(expected, value) {
      var result = security.getTravelCostType(value);

      expect(result).to.be.equal(expected);
    }
  });

  describe("Static getTravelCost()", function() {
    it("should return an instance of AddingTravelCost", function() {
      var result = security.getTravelCost(0.3, 0);

      expect(result).to.be.a(everoute.travel.AddingTravelCost);
    });
  });

});
