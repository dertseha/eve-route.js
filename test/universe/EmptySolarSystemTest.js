/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("EmptySolarSystem", function() {
  var EmptySolarSystem = everoute.universe.EmptySolarSystem;

  var contextIds = {
    galaxyId: 0,
    regionId: 0,
    constellationId: 0
  };

  describe("getSecurityValue()", function() {
    var examples = [
      [1.0, 1.0],
      [0.99, 0.9],
      [0.7, 0.7],
      [0.59, 0.5],
      [0.44, 0.4],
      [0.044, 0.0],
      [-0.0001, 0.0],
      [-1.0, 0.0]
    ];

    examples.forEach(function(example) {
      var trueSec = example[0];
      var expected = example[1];

      it("should return " + expected + " for trueSec " + trueSec, function() {
        var system = new EmptySolarSystem(0, contextIds, new everoute.travel.AnyLocation(), trueSec);
        var result = system.getSecurityValue();

        expect(result).to.be.equal(expected);
      });
    });
  });

});
