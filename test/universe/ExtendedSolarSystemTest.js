/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("ExtendedSolarSystem", function() {
  var AnyLocation = everoute.travel.AnyLocation;
  var JumpBuilder = everoute.travel.JumpBuilder;
  var EmptySolarSystem = everoute.universe.EmptySolarSystem;
  var ExtendedSolarSystem = everoute.universe.ExtendedSolarSystem;
  var SolarSystemExtensionData = everoute.universe.SolarSystemExtensionData;

  var system;
  var data;

  beforeEach(function() {
    system = null;
    data = null;
  });

  describe("getJumps()", function() {
    var result;

    beforeEach(function() {
      result = null;
    });

    it("should return an empty array if none known", function() {
      givenTheBaseIsEmpty();

      whenJumpsAreRetrieved("warp");

      thenResultShouldBeAnEmptyArray();
    });

    it("should return an empty array when queried for unknown type", function() {
      givenTheBaseIsEmpty();
      givenExtensionHasJump("warp");

      whenJumpsAreRetrieved("spice");

      thenResultShouldBeAnEmptyArray();
    });

    it("should return the known jump when provided via extension", function() {
      givenTheBaseIsEmpty();
      givenExtensionHasJump("warp", 1002);

      whenJumpsAreRetrieved("warp");

      thenResultShouldContainOneEntry();
    });

    it("should return the combined jumps from base and extension", function() {
      givenTheBaseHasJump("warp", 1001);
      givenExtensionHasJump("warp", 2000);

      whenJumpsAreRetrieved("warp");

      thenResultShouldContainEntriesTo([1001, 2000]);
    });

    function givenTheBaseIsEmpty() {
      var base = new EmptySolarSystem(0, {
        galaxyId: 0,
        regionId: 0,
        constellationId: 0
      }, new AnyLocation(), 0.0);

      data = new SolarSystemExtensionData(base);
    }

    function givenTheBaseHasJump(jumpType, destinationId) {
      var base = new EmptySolarSystem(0, {
        galaxyId: 0,
        regionId: 0,
        constellationId: 0
      }, new AnyLocation(), 0.0);
      var baseExtension = new SolarSystemExtensionData(base);
      var builder = new JumpBuilder(jumpType, destinationId);

      baseExtension.jumpBuilders.push(builder);
      var extendedBase = new ExtendedSolarSystem(baseExtension);

      data = new SolarSystemExtensionData(extendedBase);
    }

    function givenExtensionHasJump(jumpType, destinationId) {
      var builder = new JumpBuilder(jumpType, destinationId);

      data.jumpBuilders.push(builder);
    }

    function whenJumpsAreRetrieved(jumpType) {
      var system = new ExtendedSolarSystem(data);

      result = system.getJumps(jumpType);
    }

    function thenResultShouldBeAnEmptyArray() {
      expect(result).to.be.eql([]);
    }

    function thenResultShouldContainOneEntry() {
      expect(result.length).to.be.equal(1);
    }

    function thenResultShouldContainEntriesTo(destinationIds) {
      destinationIds.forEach(function(expected, index) {
        var entry = result[index];

        expect(entry.getDestinationId()).to.be.equal(expected);
      });
    }
  });


});
