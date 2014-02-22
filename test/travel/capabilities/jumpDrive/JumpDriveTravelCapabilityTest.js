/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("JumpDriveTravelCapability", function() {
  var SpecificLocation = everoute.travel.SpecificLocation;
  var jumpDrive = everoute.travel.capabilities.jumpDrive;
  var util = everoute.util;

  var builder;
  var universe;
  var nextPaths;

  beforeEach(function() {
    builder = everoute.newUniverseBuilder();
    nextPaths = null;
  });

  it("should return jump drive jumps", function() {
    var oneLightYear = util.constants.METERS_PER_LY;

    givenASolarSystemInNewEden(1, 0.4, [0.0, 0.0, 0.0]);
    givenASolarSystemInNewEden(2, 0.0, [oneLightYear, 0.0, 0.0]);

    whenRetrievingNextPathsFrom(1);

    thenTheNextPathsShouldHaveASizeOf(1);
  });

  it("should add only jumps that are within limit", function() {
    var oneLightYear = util.constants.METERS_PER_LY;

    givenASolarSystemInNewEden(1, 0.4, [0.0, 0.0, 0.0]);
    givenASolarSystemInNewEden(2, 0.0, [oneLightYear, 0.0, 0.0]);
    givenASolarSystemInNewEden(3, 0.0, [oneLightYear * 3, 0.0, 0.0]);

    whenRetrievingNextPathsFrom(1, 2);

    thenTheNextPathsShouldHaveASizeOf(1);
  });

  function givenASolarSystemInNewEden(id, trueSec, position) {
    createSolarSystem(9, id, trueSec, position);
  }

  function createSolarSystem(galaxyId, id, trueSec, position) {
    var location = new SpecificLocation(position[0], position[1], position[2]);
    var contextIds = {
      galaxyId: galaxyId,
      regionId: 0,
      constellationId: 0
    };

    builder.addSolarSystem(id, contextIds, location, trueSec);
  }

  function whenRetrievingNextPathsFrom(id, distanceLimit) {
    jumpDrive.extendUniverse(builder);
    universe = builder.build();

    var solarSystem = universe.getSolarSystem(id);
    var capability = new jumpDrive.JumpDriveTravelCapability(universe, distanceLimit || jumpDrive.DISTANCE_LIMIT_LY);
    nextPaths = capability.getNextPaths(solarSystem.startPath());
  }

  function thenTheSolarSystemShouldHaveAJumpDriveJump(id) {
    var solarSystem = universe.getSolarSystem(id);
    var jumps = solarSystem.getJumps(jumpDrive.JUMP_TYPE);

    expect(jumps.length).to.be.equal(1);
  }

  function thenTheSolarSystemShouldNotHaveAJumpDriveJump(id) {
    var solarSystem = universe.getSolarSystem(id);
    var jumps = solarSystem.getJumps(jumpDrive.JUMP_TYPE);

    expect(jumps.length).to.be.equal(0);
  }

  function thenTheJumpFromSystemShouldHaveDistanceCost(id, expected) {
    var solarSystem = universe.getSolarSystem(id);
    var jumps = solarSystem.getJumps(jumpDrive.JUMP_TYPE);
    var cost = jumps[0].getCosts()[0];
    var result = cost.getType() + "=" + cost.getValue();

    expect(result).to.be.equal("jumpDistance=" + expected);
  }

  function thenTheNextPathsShouldHaveASizeOf(expected) {
    expect(nextPaths.length).to.be.equal(expected);
  }
});
