/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("UniverseBuilder", function() {
  var EmptyUniverse = everoute.universe.EmptyUniverse;
  var UniverseBuilder = everoute.universe.UniverseBuilder;

  var universe;
  var builder;
  var built;

  beforeEach(function() {
    universe = new EmptyUniverse();
    builder = null;
    built = null;
  });

  describe("build()", function() {
    it("should return a universe instance for build()", function() {
      givenABuilder();

      whenAUniverseIsBuilt();

      thenTheBuiltObjectShouldBeAUniverse();
    });

    function thenTheBuiltObjectShouldBeAUniverse() {
      expect(built.extend).to.be.a(Function);
      expect(built.getSolarSystem).to.be.a(Function);
    }
  });

  describe("addSolarSystem()", function() {
    it("should cause the built universe to have the solar system", function() {
      givenABuilder();

      whenASolarSystemIsAdded(1234);

      thenTheBuiltUniverseShouldContainSolarSystem(1234);
    });

    it("should throw Error when ID already added", function() {
      givenABuilder();

      whenASolarSystemIsAdded(1234);

      thenAddingASolarSystemThrowsError(1234);
    });

    it("should throw Error when ID already existing in base", function() {
      givenBaseUniverseHasSolarSystem(4234);

      whenABuilderIsCreated();

      thenAddingASolarSystemThrowsError(4234);
    });

    function thenTheBuiltUniverseShouldContainSolarSystem(id) {
      built = builder.build();

      var result = built.hasSolarSystem(id);
      expect(result).to.be.equal(true);
    }

    function thenAddingASolarSystemThrowsError(id) {
      function fn() {
        builder.addSolarSystem(id);
      }

      expect(fn).to.throwError();
    }
  });

  describe("extendSolarSystem()", function() {
    it("should throw an Error if the solar system isn't in the universe", function() {
      whenABuilderIsCreated();

      thenExtendSolarSystemShouldThrowError();
    });

    it("should return an instance of SolarSystemExtension when the solar system was added", function() {
      givenABuilder();

      whenASolarSystemIsAdded(5678);

      thenExtendSolarSystemShouldReturnAnExtension(5678);
    });

    it("should return an instance of SolarSystemExtension when the solar system exists in base", function() {
      givenBaseUniverseHasSolarSystem(4444);

      whenABuilderIsCreated();

      thenExtendSolarSystemShouldReturnAnExtension(4444);
    });

    function thenExtendSolarSystemShouldThrowError(id) {
      var fn = function() {
        builder.extendSolarSystem(id);
      };

      expect(fn).to.throwError();
    }

    function thenExtendSolarSystemShouldReturnAnExtension(id) {
      var result = builder.extendSolarSystem(id);

      expect(result).to.be.a(everoute.universe.SolarSystemExtension);
    }
  });

  describe("getSolarSystemIds()", function() {
    it("should return an empty array if universe is empty", function() {
      whenABuilderIsCreated();

      thenGetSolarSystemIdsShouldReturn([]);
    });

    it("should return all IDs from base universe and extension", function() {
      givenBaseUniverseHasSolarSystem(1900);
      givenABuilder();

      whenASolarSystemIsAdded(2000);

      thenGetSolarSystemIdsShouldReturn([1900, 2000]);
    });

    function thenGetSolarSystemIdsShouldReturn(expected) {
      var result = builder.getSolarSystemIds();

      expect(result).to.be.eql(expected);
    }
  });

  function givenBaseUniverseHasSolarSystem(id) {
    var baseExtension = universe.extend();

    addSolarSystemIn(baseExtension, id);
    universe = baseExtension.build();
  }

  function givenABuilder() {
    builder = new UniverseBuilder(universe);
  }

  function whenABuilderIsCreated() {
    givenABuilder();
  }

  function whenASolarSystemIsAdded(id) {
    addSolarSystemIn(builder, id);
  }

  function addSolarSystemIn(specificBuilder, id) {
    var contextIds = {
      galaxyId: -1,
      regionId: -1,
      constellationId: -1
    };
    var location = new everoute.travel.AnyLocation();
    var trueSecurity = 1.0;

    specificBuilder.addSolarSystem(id, contextIds, location, trueSecurity);
  }

  function givenAnAddedSolarSystem(id) {
    whenASolarSystemIsAdded(id);
  }

  function whenAUniverseIsBuilt() {
    built = builder.build();
  }
});
