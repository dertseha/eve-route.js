/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("DestinationSystemSearchCriterion", function() {
  var DestinationSystemSearchCriterion = everoute.travel.search.DestinationSystemSearchCriterion;
  var AnyLocation = everoute.travel.AnyLocation;
  var Path = everoute.travel.Path;
  var Step = everoute.travel.Step;

  describe("isDesired()", function() {
    it("should return true for a path with the requested system ID", function() {
      var criterion = new DestinationSystemSearchCriterion(0);

      var result = criterion.isDesired(createPathTo(0));

      expect(result).to.be.equal(true);
    });

    it("should return false for a path with a system ID different than requested", function() {
      var criterion = new DestinationSystemSearchCriterion(10);

      var result = criterion.isDesired(createPathTo(20));

      expect(result).to.be.equal(false);
    });
  });

  describe("shouldSearchContinueWith()", function() {
    it("should return false for a path with the requested system ID", function() {
      var criterion = new DestinationSystemSearchCriterion(30);

      var result = criterion.shouldSearchContinueWith(createPathTo(30));

      expect(result).to.be.equal(false);
    });

    it("should return true for a path with a system ID different than requested", function() {
      var criterion = new DestinationSystemSearchCriterion(10);

      var result = criterion.shouldSearchContinueWith(createPathTo(20));

      expect(result).to.be.equal(true);
    });
  });

  function createPathTo(systemId) {
    return new Path(new Step(systemId, new AnyLocation(), []));
  }

});
