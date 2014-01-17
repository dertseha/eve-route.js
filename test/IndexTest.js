/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("everoute", function() {
  it("should be the exported global", function() {
    expect(typeof everoute).to.be.equal("object");
  });

  it("should provide a 'newUniverseBuilder()' method returning a UniverseBuilder instance", function() {
    var result = everoute.newUniverseBuilder();

    expect(result).to.be.a(everoute.universe.UniverseBuilder);
  });


});
