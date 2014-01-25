/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("RouteChromosomeSplicer", function() {
  var RouteChromosomeSplicer = everoute.travel.search.RouteChromosomeSplicer;

  var rand;
  var splicer;

  beforeEach(function() {
    var randResult = 0;

    rand = {
      getIndex: function(limit) {
        if (randResult >= limit) {
          randResult = 0;
        }

        return randResult++;
      }
    };

    splicer = new RouteChromosomeSplicer(rand);
  });

  describe("createRandom()", function() {
    it("should create a random route chromosome", function() {
      var result = splicer.createRandom([10, 20], 3);

      expect(result).to.be.eql({
        startPath: 10,
        waypoints: [{
          index: 1,
          destinationKey: null
        }, {
          index: 2,
          destinationKey: null
        }, {
          index: 0,
          destinationKey: null
        }],
        destinationKey: null
      });
    });
  });

  describe("findUnusedWaypointIndex()", function() {
    it("should return 0 if only one to create", function() {
      var result = splicer.findUnusedWaypointIndex([], 1);

      expect(result).to.be.equal(0);
    });

    it("should return 2 when 1 and 0 have already been taken", function() {
      var input = [createWaypoint(1, null), createWaypoint(0, null)];
      var result = splicer.findUnusedWaypointIndex(input, 3);

      expect(result).to.be.equal(2);
    });
  });

  describe("createOffspring()", function() {
    it("should take start from parent1 and destination from parent2", function() {
      var parent1 = createChromosome(10, [], "a");
      var parent2 = createChromosome(20, [], "b");
      var result = splicer.createOffspring(parent1, parent2, 0);

      expect(result).to.be.eql(createChromosome(10, [], "b"));
    });

    it("should use all of parent1's waypoints when cutover is at limit", function() {
      var parent1 = createChromosome(10, [createWaypoint(1, "a"), createWaypoint(0, "b")], "a");
      var parent2 = createChromosome(20, [createWaypoint(0, "c"), createWaypoint(1, "d")], "b");
      var result = splicer.createOffspring(parent1, parent2, 2);

      expect(result).to.be.eql(createChromosome(10, [createWaypoint(1, "a"), createWaypoint(0, "b")], "b"));
    });

    it("should cut over to second parent immediately when 0", function() {
      var parent1 = createChromosome(10, [createWaypoint(1, "a"), createWaypoint(0, "b")], "a");
      var parent2 = createChromosome(20, [createWaypoint(0, "c"), createWaypoint(1, "d")], "b");
      var result = splicer.createOffspring(parent1, parent2, 0);

      expect(result).to.be.eql(createChromosome(10, [createWaypoint(0, "c"), createWaypoint(1, "d")], "b"));
    });

    it("should revert to finding available indices when cutover creates doubles", function() {
      var parent1 = createChromosome(10, [createWaypoint(1, "a"), createWaypoint(0, "b"), createWaypoint(2, "c")], "a");
      var parent2 = createChromosome(20, [createWaypoint(0, "d"), createWaypoint(1, "e"), createWaypoint(2, "f")], "b");
      var result = splicer.createOffspring(parent1, parent2, 1);

      expect(result).to.be.eql(createChromosome(10, [createWaypoint(1, "a"), createWaypoint(0, null), createWaypoint(2, "f")], "b"));
    });
  });

  function createWaypoint(index, destinationKey) {
    var result = {
      index: index,
      destinationKey: destinationKey || null
    };

    return result;
  }

  function createChromosome(startPath, waypoints, destinationKey) {
    var result = {
      startPath: startPath,
      waypoints: waypoints,
      destinationKey: destinationKey || null
    };

    return result;
  }

});
