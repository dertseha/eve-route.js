/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("EmptyUniverse", function() {
  var EmptyUniverse = everoute.universe.EmptyUniverse;

  var universe;

  beforeEach(function() {
    universe = new EmptyUniverse();
  });

  it("should throw Error for getSolarSystem()", function() {
    var fn = function() {
      universe.getSolarSystem(0);
    };

    expect(fn).to.throwError();
  });

  it("should return false for hasSolarSystem()", function() {
    var result = universe.hasSolarSystem(1234);

    expect(result).to.be.equal(false);
  });

  it("should return a builder for extend()", function() {
    var result = universe.extend();

    expect(result).to.be.a(everoute.universe.UniverseBuilder);
  });
});
