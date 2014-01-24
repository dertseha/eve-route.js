/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("DefaultRandomizer", function() {
  var DefaultRandomizer = everoute.util.DefaultRandomizer;

  var rand = new DefaultRandomizer();

  describe("getIndex()", function() {
    it("should return 0 for limit 0", function() {
      var result = rand.getIndex(0);

      expect(result).to.be.equal(0);
    });

    it("should return random values when called several times", function() {
      var limit = 100;
      var tries = 1000;
      var first = rand.getIndex(limit);
      var unique = true;
      var temp;
      var i;

      for (i = 0; i < tries; i++) {
        temp = rand.getIndex(limit);
        if (temp !== first) {
          unique = false;
        }
      }

      expect(unique).to.be.equal(false);
    });

  });
});
