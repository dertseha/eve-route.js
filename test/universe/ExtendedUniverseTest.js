/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("ExtendedUniverse", function() {
  var EmptyUniverse = everoute.universe.EmptyUniverse;
  var EmptySolarSystem = everoute.universe.EmptySolarSystem;
  var UniverseExtensionData = everoute.universe.UniverseExtensionData;
  var ExtendedUniverse = everoute.universe.ExtendedUniverse;

  var base;
  var data;
  var universe;

  var solarSystems;

  beforeEach(function() {
    base = new EmptyUniverse();
    base.getSolarSystem = everoute.util.noop; // avoid Error
    data = null;
    universe = null;

    solarSystems = [];
  });

  it("should return a new builder for extend()", function() {
    whenExtendedUniverseIsCreated();

    expect(universe.extend()).to.be.a(everoute.universe.UniverseBuilder);
  });

  describe("hasSolarSystem()", function() {
    it("should delegate call to base if unknown", function() {
      var spy = sinon.spy(base, "hasSolarSystem");

      givenAnExtendedUniverse();

      whenHasSolarSystemIsCalled(1000);

      expect(spy).was.calledWith(1000);
    });

    it("should return true if extension data provided the system", function() {
      givenExtensionDataProvidesSolarSystem(createEmptySolarSystem(2000));

      whenExtendedUniverseIsCreated();

      thenSolarSystemShouldBeKnown(2000);
    });

  });

  describe("getSolarSystem()", function() {
    it("should delegate call to base if unknown", function() {
      var spy = sinon.spy(base, "getSolarSystem");

      givenAnExtendedUniverse();

      whenGetSolarSystemIsCalled(3000);

      expect(spy).was.calledWith(3000);
    });

    it("should return object if extension data provided the system", function() {
      var system = createEmptySolarSystem(2000);
      givenExtensionDataProvidesSolarSystem(system);

      whenExtendedUniverseIsCreated();

      thenSolarSystemShouldBe(2000, system);
    });
  });

  describe("getSolarSystemIds()", function() {
    it("should return an empty array if universe is empty", function() {
      whenExtendedUniverseIsCreated();

      thenGetSolarSystemIdsShouldReturn([]);
    });

    it("should return all IDs from both universes", function() {
      givenBaseHasSolarSystem(1900);
      givenExtensionDataProvidesSolarSystem(createEmptySolarSystem(2000));

      whenExtendedUniverseIsCreated();

      thenGetSolarSystemIdsShouldReturn([1900, 2000]);
    });

    it("should provide IDs from extended solar systems only once", function() {
      givenBaseHasSolarSystem(2100);
      givenExtensionDataProvidesSolarSystem(createEmptySolarSystem(2100));

      whenExtendedUniverseIsCreated();

      thenGetSolarSystemIdsShouldReturn([2100]);
    });
  });

  function createEmptySolarSystem(id) {
    var contextIds = {
      galaxyId: -1,
      regionId: -1,
      constellationId: -1
    };
    var location = new everoute.travel.AnyLocation();
    var trueSecurity = 1.0;

    return new EmptySolarSystem(id, contextIds, location, trueSecurity);
  }

  function givenBaseHasSolarSystem(id) {
    var builder = base.extend();
    var contextIds = {
      galaxyId: -1,
      regionId: -1,
      constellationId: -1
    };
    var location = new everoute.travel.AnyLocation();
    var trueSecurity = 1.0;

    builder.addSolarSystem(id, contextIds, location, trueSecurity);
    base = builder.build();
  }

  function givenExtensionDataProvidesSolarSystem(system) {
    solarSystems.push(system);
  }

  function whenExtendedUniverseIsCreated() {
    data = new UniverseExtensionData(base);
    data.solarSystems = solarSystems;

    universe = new ExtendedUniverse(data);
  }

  function givenAnExtendedUniverse() {
    whenExtendedUniverseIsCreated();
  }

  function whenHasSolarSystemIsCalled(id) {
    universe.hasSolarSystem(id);
  }

  function thenSolarSystemShouldBeKnown(id) {
    var result = universe.hasSolarSystem(id);

    expect(result).to.be.equal(true);
  }

  function whenGetSolarSystemIsCalled(id) {
    universe.getSolarSystem(id);
  }

  function thenSolarSystemShouldBe(id, expected) {
    var result = universe.getSolarSystem(id);

    expect(result).to.be.equal(expected);
  }

  function thenGetSolarSystemIdsShouldReturn(expected) {
    var result = universe.getSolarSystemIds();

    expect(result).to.eql(expected);
  }
});
