/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("CombiningSearchCriterion", function() {
  var CombiningSearchCriterion = everoute.travel.search.CombiningSearchCriterion;
  var Path = everoute.travel.Path;
  var StepBuilder = everoute.travel.StepBuilder;

  var positiveCriterion = {
    isDesired: function() {
      return true;
    },
    shouldSearchContinueWith: function() {
      return true;
    }
  };

  var negativeCriterion = {
    isDesired: function() {
      return false;
    },
    shouldSearchContinueWith: function() {
      return false;
    }
  };

  describe("isDesired()", function() {
    it("should return false if no criteria stored", function() {
      var criteria = [];

      verifyIsDesiredShouldReturn(false, criteria);
    });

    it("should return true if all criteria return true", function() {
      var criteria = [positiveCriterion, positiveCriterion];

      verifyIsDesiredShouldReturn(true, criteria);
    });

    it("should return false if at least one returns false", function() {
      var criteria = [positiveCriterion, negativeCriterion, positiveCriterion];

      verifyIsDesiredShouldReturn(false, criteria);
    });

    function verifyIsDesiredShouldReturn(expected, criteria) {
      var criterion = new CombiningSearchCriterion(criteria);

      var result = criterion.isDesired(createPathTo(0));

      expect(result).to.be.equal(expected);
    }
  });

  describe("shouldSearchContinueWith()", function() {
    it("should return false if no criteria stored", function() {
      var criteria = [];

      verifyShouldSearchContinueWithShouldReturn(false, criteria);
    });

    it("should return true if all criteria return true", function() {
      var criteria = [positiveCriterion, positiveCriterion];

      verifyShouldSearchContinueWithShouldReturn(true, criteria);
    });

    it("should return false if at least one returns false", function() {
      var criteria = [positiveCriterion, negativeCriterion, positiveCriterion];

      verifyShouldSearchContinueWithShouldReturn(false, criteria);
    });

    function verifyShouldSearchContinueWithShouldReturn(expected, criteria) {
      var criterion = new CombiningSearchCriterion(criteria);

      var result = criterion.shouldSearchContinueWith(createPathTo(0));

      expect(result).to.be.equal(expected);
    }
  });

  function createPathTo(systemId) {
    return new Path(new StepBuilder(systemId).build());
  }

});
