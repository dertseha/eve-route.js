/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("SpecificLocation", function() {
  var SpecificLocation = everoute.travel.SpecificLocation;
  var AnyLocation = everoute.travel.AnyLocation;

  describe("getPositionRelativeTo()", function() {
    it("should return its own position compared to [0,0,0]", function() {
      var location = new SpecificLocation(10, 20, 30);
      var result = location.getPositionRelativeTo([0, 0, 0]);

      expect(result).to.be.eql([10, 20, 30]);
    });

    it("should return the relative vector to another position", function() {
      var location = new SpecificLocation(10, -20, 30);
      var result = location.getPositionRelativeTo([-5, 5, 5]);

      expect(result).to.be.eql([15, -25, 25]);
    });
  });

  describe("distanceTo()", function() {
    it("should return 0 when measured against itself", function() {
      var location = new SpecificLocation(100, 200, 300);
      var result = location.distanceTo(location);

      expect(result).to.be.equal(0);
    });

    it("should return 0 when measured against the AnyLocation", function() {
      var location = new SpecificLocation(100, 200, 300);
      var result = location.distanceTo(new AnyLocation());

      expect(result).to.be.equal(0);
    });

    it("should return calculated distance (1)", function() {
      var location1 = new SpecificLocation(10, 20, 30);
      var location2 = new SpecificLocation(40, 80, -30);
      var result = location1.distanceTo(location2);

      expect(result).to.be.equal(90);
    });

    it("should return calculated distance (2)", function() {
      var location1 = new SpecificLocation(15, 49, 140);
      var location2 = new SpecificLocation(120.5, -33, -9);
      var result = location1.distanceTo(location2);

      expect(result.toFixed(3)).to.be.equal("200.138");
    });
  });
});
