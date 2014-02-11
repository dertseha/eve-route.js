/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("JumpDrive Index", function() {
  var SpecificLocation = everoute.travel.SpecificLocation;
  var jumpDrive = everoute.travel.capabilities.jumpDrive;
  var util = everoute.util;

  var builder;
  var universe;

  beforeEach(function() {
    builder = everoute.newUniverseBuilder();
  });

  describe("extendUniverse()", function() {

    it("should create a jump from high sec to low sec", function() {
      givenASolarSystemInNewEden(1, 1.0, [0.0, 0.0, 0.0]);
      givenASolarSystemInNewEden(2, 0.1, [1.0, 1.0, 1.0]);

      whenExtendingTheUniverse();

      thenTheSolarSystemShouldHaveAJumpDriveJump(1);
    });

    it("should create a jump from low sec to low sec, forward", function() {
      givenASolarSystemInNewEden(1, 0.4, [0.0, 0.0, 0.0]);
      givenASolarSystemInNewEden(2, 0.1, [1.0, 1.0, 1.0]);

      whenExtendingTheUniverse();

      thenTheSolarSystemShouldHaveAJumpDriveJump(1);
    });

    it("should create a jump from low sec to low sec, backward", function() {
      givenASolarSystemInNewEden(1, 0.4, [0.0, 0.0, 0.0]);
      givenASolarSystemInNewEden(2, 0.1, [1.0, 1.0, 1.0]);

      whenExtendingTheUniverse();

      thenTheSolarSystemShouldHaveAJumpDriveJump(2);
    });

    it("should not create jumps into high-sec", function() {
      givenASolarSystemInNewEden(1, 1.0, [0.0, 0.0, 0.0]);
      givenASolarSystemInNewEden(2, 0.1, [1.0, 1.0, 1.0]);

      whenExtendingTheUniverse();

      thenTheSolarSystemShouldNotHaveAJumpDriveJump(2);
    });

    it("should not create jumps into w-space", function() {
      givenASolarSystemInNewEden(1, 0.0, [0.0, 0.0, 0.0]);
      givenASolarSystemInWSpace(2, 0.0, [1.0, 1.0, 1.0]);

      whenExtendingTheUniverse();

      thenTheSolarSystemShouldNotHaveAJumpDriveJump(1);
    });

    it("should not create jumps from w-space", function() {
      givenASolarSystemInWSpace(1, 0.0, [0.0, 0.0, 0.0]);
      givenASolarSystemInNewEden(2, 0.0, [1.0, 1.0, 1.0]);

      whenExtendingTheUniverse();

      thenTheSolarSystemShouldNotHaveAJumpDriveJump(1);
    });

    it("should not create jumps beyond maximum possible jump distance", function() {
      var veryFar = util.constants.METERS_PER_LY * (jumpDrive.DISTANCE_LIMIT_LY + 0.1);
      givenASolarSystemInNewEden(1, 0.0, [0.0, 0.0, 0.0]);
      givenASolarSystemInNewEden(2, 0.0, [veryFar, 0.0, 0.0]);

      whenExtendingTheUniverse();

      thenTheSolarSystemShouldNotHaveAJumpDriveJump(1);
    });
  });

  function givenASolarSystemInNewEden(id, trueSec, position) {
    createSolarSystem(9, id, trueSec, position);
  }

  function givenASolarSystemInWSpace(id, trueSec, position) {
    createSolarSystem(9000001, id, trueSec, position);
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

  function whenExtendingTheUniverse() {
    jumpDrive.extendUniverse(builder);
    universe = builder.build();
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
});
