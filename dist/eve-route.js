!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.everoute=e():"undefined"!=typeof global?global.everoute=e():"undefined"!=typeof self&&(self.everoute=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * This is the root namespace for everything in this library.
 *
 * @namespace everoute
 */

var universe = require("./universe");


/**
 * @return {everoute.universe.UniverseBuilder} a fresh universe builder based on an empty universe.
 * @memberof everoute
 */
var newUniverseBuilder = function() {
  return new universe.UniverseBuilder();
};

module.exports = {
  travel: require("./travel"),
  universe: universe,
  util: require("./util"),

  newUniverseBuilder: newUniverseBuilder
};

},{"./travel":6,"./universe":15,"./util":16}],2:[function(require,module,exports){
"use strict";

/**
 * This location is 'any' location. Compared to others, it will always refer
 * to the other location.
 *
 * @constructor
 * @implements everoute.travel.Location
 * @extends everoute.travel.Location
 * @memberof everoute.travel
 */
function AnyLocation() {

}

AnyLocation.prototype.getPositionRelativeTo = function(origin) {
  return [0, 0, 0];
};

AnyLocation.prototype.distanceTo = function(other) {
  return 0;
};

module.exports = AnyLocation;

},{}],3:[function(require,module,exports){
"use strict";

/**
 * This interface represents the read-only access to a jump across the universe.
 *
 * @constructor
 * @memberof everoute.travel
 * @param {String} ofType jump type specification
 * @param {everoute.travel.Location} fromLocation Source location
 * @param {Number} toSystemId Identifying the destination solar system
 * @param {everoute.travel.Location} toLocation location within destination system
 * @param {Array.<everoute.travel.TravelCost>} costs Array of costs involved with this jump
 */
function Jump(ofType, fromLocation, toSystemId, toLocation, costs) {

  var jumpCosts = costs.slice(0);

  /**
   * @return {String} Type identifying how the jump is performed.
   */
  this.getType = function() {
    return ofType;
  };

  /**
   * @return {Number} Identifying the destination solar system.
   */
  this.getDestinationId = function() {
    return toSystemId;
  };

  /**
   * @param {everoute.travel.Location} Location within the source system.
   */
  this.getSourceLocation = function() {
    return fromLocation;
  };

  /**
   * @param {everoute.travel.Location} toLocation location within destination system.
   */
  this.getDestinationLocation = function() {
    return toLocation;
  };

  /**
   * @param {Array.<everoute.travel.TravelCost>} Array of costs involved with this jump
   */
  this.getCosts = function() {
    return jumpCosts.slice(0);
  };
}

module.exports = Jump;

},{}],4:[function(require,module,exports){
"use strict";

var AnyLocation = require("./AnyLocation");
var Jump = require("./Jump");

/**
 * This builder is for creating a jump description.
 *
 * @constructor
 * @memberof everoute.travel
 * @param {String} jumpType Type of jump
 * @param {Number} destinationId ID of the destination solar system
 */
function JumpBuilder(jumpType, destinationId) {

  var from = new AnyLocation();
  var to = new AnyLocation();
  var costs = [];

  /**
   * Builds a new jump instance, based on the current configured members.
   *
   * @return {everoute.travel.Jump} the built jump instance
   */
  this.build = function() {
    return new Jump(jumpType, from, destinationId, to, costs);
  };

  /**
   * The location in the source solar system where this jump is started.
   * Defaults to AnyLocation.
   *
   * @param  {everoute.travel.Location} location the source location
   * @return {everoute.travel.JumpBuilder} this instance
   */
  this.from = function(location) {
    from = location;

    return this;
  };

  /**
   * The location in the destination solar system where this jump is landing.
   * Defaults to AnyLocation.
   *
   * @param  {everoute.travel.Location} location the destination location
   * @return {everoute.travel.JumpBuilder} this instance
   */
  this.to = function(location) {
    to = location;

    return this;
  };

  /**
   * Adds another cost involved in this jump.
   *
   * @param  {everoute.travel.TravelCost} cost the extra cost
   * @return {everoute.travel.JumpBuilder} this instance
   */
  this.addCost = function(cost) {
    costs.push(cost);

    return this;
  };
}

module.exports = JumpBuilder;

},{"./AnyLocation":2,"./Jump":3}],5:[function(require,module,exports){
"use strict";

/**
 * This location has a specific position in space. It can provide results
 * when compared to other specific locations.
 *
 * @constructor
 * @implements everoute.travel.Location
 * @extends everoute.travel.Location
 * @param {Number} x The X coordinate.
 * @param {Number} y The Y coordinate.
 * @param {Number} z The Z coordinate.
 * @memberof everoute.travel
 */
function SpecificLocation(x, y, z) {
  var position = [x, y, z];

  this.getPositionRelativeTo = function(origin) {
    return [position[0] - origin[0], position[1] - origin[1], position[2] - origin[2]];
  };

  this.distanceTo = function(other) {
    var pos = other.getPositionRelativeTo(position.slice(0));

    return Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1] + pos[2] * pos[2]);
  };
}

module.exports = SpecificLocation;

},{}],6:[function(require,module,exports){
/**
 * This namespace contains entries regarding travel.
 *
 * @namespace travel
 * @memberof everoute
 */
module.exports = {
  AnyLocation: require("./AnyLocation"),
  Jump: require("./Jump"),
  JumpBuilder: require("./JumpBuilder"),
  SpecificLocation: require("./SpecificLocation")
};

},{"./AnyLocation":2,"./Jump":3,"./JumpBuilder":4,"./SpecificLocation":5}],7:[function(require,module,exports){
"use strict";

/**
 * This is an empty solar system. It doesn't contain anything and provides only
 * the basic information.
 *
 * @constructor
 * @implements {everoute.universe.SolarSystem}
 * @extends {everoute.universe.SolarSystem}
 * @param {Number} id The unique key for the solar system.
 * @param {{galaxyId: Number, regionId: Number, constellationId: Number}} contextIds ID values of container.
 * @param {everoute.travel.Location} location The location this solar system is at in the universe.
 * @param {Number} trueSecurity The true security value [-1.0 .. 1.0]
 * @memberof everoute.universe
 */
function EmptySolarSystem(id, contextIds, location, trueSecurity) {
  function verifyDefined(value, errorText) {
    if (typeof value === "undefined") {
      throw new Error(errorText);
    }

    return value;
  }

  /**
   * @type {Number}
   * @private
   */
  this.id = verifyDefined(id, "No id specified");

  this.galaxyId = verifyDefined(contextIds.galaxyId, "No contextIds.galaxyId specified");
  this.regionId = verifyDefined(contextIds.regionId, "No contextIds.regionId specified");
  this.constellationId = verifyDefined(contextIds.constellationId, "No contextIds.constellationId specified");

  this.location = verifyDefined(location, "No location specified");

  this.trueSecurity = verifyDefined(trueSecurity, "No trueSecurity specified");
  if (this.trueSecurity < 0.0) {
    this.security = 0.0;
  } else {
    this.security = parseFloat((Math.floor(trueSecurity * 10) / 10.0).toFixed(1));
  }
}

EmptySolarSystem.prototype.getId = function() {
  return this.id;
};

EmptySolarSystem.prototype.getGalaxyId = function() {
  return this.galaxyId;
};

EmptySolarSystem.prototype.getRegionId = function() {
  return this.regionId;
};

EmptySolarSystem.prototype.getConstellationId = function() {
  return this.constellationId;
};

EmptySolarSystem.prototype.getLocation = function() {
  return this.location;
};

EmptySolarSystem.prototype.getSecurityValue = function() {
  return this.security;
};

EmptySolarSystem.prototype.getJumps = function(jumpType) {
  return [];
};

module.exports = EmptySolarSystem;

},{}],8:[function(require,module,exports){
"use strict";

var UniverseBuilder = require("./UniverseBuilder");

/**
 * This is the simplest Universe implementation that is completely empty.
 * It can be used as a basis for extension - i.e., creating a filled universe.
 *
 * @constructor
 * @implements {everoute.universe.Universe}
 * @extends {everoute.universe.Universe}
 * @memberof everoute.universe
 */
function EmptyUniverse() {

}

EmptyUniverse.prototype.extend = function() {
  return new UniverseBuilder(this);
};

EmptyUniverse.prototype.hasSolarSystem = function(id) {
  return false;
};

EmptyUniverse.prototype.getSolarSystem = function(id) {
  throw new Error("SolarSystem with ID <" + id + "> not found");
};

EmptyUniverse.prototype.getSolarSystemIds = function() {
  return [];
};

module.exports = EmptyUniverse;

},{"./UniverseBuilder":13}],9:[function(require,module,exports){
"use strict";

/**
 * An extended solar system that is based on another, but has its own extensions.
 * Queries that can not be handled within this system will be delegated to
 * the base.
 *
 * @constructor
 * @implements everoute.universe.SolarSystem
 * @extends {everoute.universe.SolarSystem}
 * @param {everoute.universe.SolarSystemExtensionData} data the data this extension is based on.
 * @memberof everoute.universe
 */
function ExtendedSolarSystem(data) {

  /**
   * @type {everoute.universe.SolarSystem}
   * @private
   */
  var base = data.base;

  /**
   * @type {Object.<String,Array.<everoute.travel.Jump>>}
   * @private
   */
  var jumps = {};

  data.jumpBuilders.forEach(function(builder) {
    var jump = builder.build();
    var jumpType = jump.getType();
    var list = jumps[jumpType] || [];

    jumps[jumpType] = list.concat([jump]);
  });

  this.getId = function() {
    return base.getId();
  };

  this.getId = function() {
    return base.getId();
  };

  this.getGalaxyId = function() {
    return base.getGalaxyId();
  };

  this.getRegionId = function() {
    return base.getRegionId();
  };

  this.getConstellationId = function() {
    return base.getConstellationId();
  };

  this.getLocation = function() {
    return base.getLocation();
  };

  this.getSecurityValue = function() {
    return base.getSecurityValue();
  };

  this.getJumps = function(jumpType) {
    var result = base.getJumps(jumpType);

    if (jumps.hasOwnProperty(jumpType)) {
      result = result.concat(jumps[jumpType]);
    }

    return result;
  };

}

module.exports = ExtendedSolarSystem;

},{}],10:[function(require,module,exports){
"use strict";

/**
 * An extended universe that is based on another, but has its own extensions.
 * Queries that can not be handled within this universe will be delegated to
 * the base universe.
 *
 * @constructor
 * @implements everoute.universe.Universe
 * @extends {everoute.universe.Universe}
 * @param {everoute.universe.UniverseExtensionData} data the data this extension is based on.
 * @memberof everoute.universe
 */
function ExtendedUniverse(data) {

  /**
   * @type {everoute.universe.Universe}
   * @private
   */
  var base = data.base;

  /**
   * @type {Object.<Number, everoute.universe.SolarSystem>}
   * @private
   */
  var solarSystems = {};

  /**
   * Constructor
   * @private
   */
  function constructor() {
    data.solarSystems.forEach(function(system) {
      solarSystems[system.getId()] = system;
    });
  }

  this.hasSolarSystem = function(id) {
    var result = solarSystems.hasOwnProperty(id) || base.hasSolarSystem(id);

    return result;
  };

  this.getSolarSystem = function(id) {
    var result = solarSystems[id] || base.getSolarSystem(id);

    return result;
  };

  this.getSolarSystemIds = function() {
    var result = base.getSolarSystemIds();
    var key;
    var addId = function(id) {
      var index = result.indexOf(id);

      if (index < 0) {
        result.push(id);
      }
    };

    for (key in solarSystems) {
      addId(solarSystems[key].getId());
    }

    return result.sort();
  };

  constructor();
}

ExtendedUniverse.prototype.extend = function() {
  var UniverseBuilder = require("./UniverseBuilder");

  return new UniverseBuilder(this);
};

module.exports = ExtendedUniverse;

},{"./UniverseBuilder":13}],11:[function(require,module,exports){
"use strict";

var JumpBuilder = require("../travel/JumpBuilder");

/**
 * An extension helper for solar systems.
 *
 * @class
 * @constructor
 * @memberof everoute.universe
 */
function SolarSystemExtension(data) {

  /**
   * Requests to add a jump from this solar system to another. The returned
   * builder can be used to refine the jump properties.
   *
   * @param {String} jumpType Type of jump
   * @param {Number} destinationId ID of the destination solar system
   * @return {everoute.travel.JumpBuilder} a builder instance for details
   */
  this.addJump = function(jumpType, destinationId) {
    var builder = new JumpBuilder(jumpType, destinationId);

    data.jumpBuilders.push(builder);

    return builder;
  };

  /**
   * Adds a cost to the solar system.
   * @param {everoute.travel.TravelCost} cost The extra cost to add.
   */
  this.addCost = function(cost) {
    data.costs.push(cost);
  };
}

module.exports = SolarSystemExtension;

},{"../travel/JumpBuilder":4}],12:[function(require,module,exports){
"use strict";

/**
 * The extension data is used as a initialization data for an
 * ExtendedSolarSystem.
 *
 * @constructor
 * @param {everoute.universe.SolarSystem} baseSystem the base solar system.
 * @memberof everoute.universe
 */
function SolarSystemExtensionData(baseSystem) {
  /**
   * @type {everoute.universe.SolarSystem}
   */
  this.base = baseSystem;

  /**
   * @type {Array.<everoute.universe.JumpBuilder>}
   */
  this.jumpBuilders = [];

  /**
   * @type {Array.<everoute.travel.TravelCost>}
   */
  this.costs = [];
}

module.exports = SolarSystemExtensionData;

},{}],13:[function(require,module,exports){
"use strict";

var EmptySolarSystem = require("./EmptySolarSystem");
var ExtendedSolarSystem = require("./ExtendedSolarSystem");
var ExtendedUniverse = require("./ExtendedUniverse");
var UniverseExtensionData = require("./UniverseExtensionData");
var SolarSystemExtension = require("./SolarSystemExtension");
var SolarSystemExtensionData = require("./SolarSystemExtensionData");

/**
 * A builder that is used to create (or extend) a universe.
 *
 * @constructor
 * @param {everoute.universe.Universe} base the base universe that should be extended.
 * @memberof everoute.universe
 */
function UniverseBuilder(base) {

  var extensionData = new UniverseExtensionData(base);

  var solarSystemExtensionData = {};

  /**
   * Builds the universe as per current data. The returned instance is a read-only
   * universe that was created according to the settings from the builder.
   *
   * @return {everoute.universe.Universe}
   */
  this.build = function() {
    var key;

    for (key in solarSystemExtensionData) {
      extensionData.solarSystems.push(new ExtendedSolarSystem(solarSystemExtensionData[key]));
    }

    return new ExtendedUniverse(extensionData);
  };

  /**
   * Adds a new solar system to the universe. The given ID must be unique and
   * not refer to an already existing solar system.
   *
   * @param {Number} id The unique key for the new solar system.
   * @param {{galaxyId: Number, regionId: Number, constellationId: Number}} contextIds ID values of container.
   * @param {everoute.travel.Location} location The location this solar system is at in the universe.
   * @param {Number} trueSecurity The true security value [-1.0 .. 1.0]
   * @throws {Error} When the solar system already exists.
   */
  this.addSolarSystem = function(id, contextIds, location, trueSecurity) {
    if (!solarSystemExtensionData.hasOwnProperty(id) && !base.hasSolarSystem(id)) {
      var baseSystem = new EmptySolarSystem(id, contextIds, location, trueSecurity);
      var data = new SolarSystemExtensionData(baseSystem);

      solarSystemExtensionData[id] = data;
    } else {
      throw new Error("Solar System " + id + " already exists.");
    }
  };

  /**
   * Requests to extend an existing solar system.
   *
   * @param  {Number} id The unique key of the solar system.
   * @return {everoute.universe.SolarSystemExtension} the extension via which to add new things.
   * @throws {Error} When the solar system doesn't exist.
   */
  this.extendSolarSystem = function(id) {
    var result;
    var data = solarSystemExtensionData[id];

    if (!data && base.hasSolarSystem(id)) {
      data = new SolarSystemExtensionData(base.getSolarSystem(id));
      solarSystemExtensionData[id] = data;
    }

    if (data) {
      result = new SolarSystemExtension(solarSystemExtensionData[id]);
    } else {
      throw new Error("Solar System " + id + " doesn't exist.");
    }

    return result;
  };
}

module.exports = UniverseBuilder;

},{"./EmptySolarSystem":7,"./ExtendedSolarSystem":9,"./ExtendedUniverse":10,"./SolarSystemExtension":11,"./SolarSystemExtensionData":12,"./UniverseExtensionData":14}],14:[function(require,module,exports){
"use strict";

/**
 * The extension data is used as a initialization data for an
 * ExtendedUniverse.
 *
 * @constructor
 * @param {everoute.universe.Universe} base the base universe.
 * @memberof everoute.universe
 */
function UniverseExtensionData(base) {
  /**
   * @type {everoute.universe.Universe}
   */
  this.base = base;

  /**
   * @type {Array.<everoute.universe.SolarSystem>}
   */
  this.solarSystems = [];
}

module.exports = UniverseExtensionData;

},{}],15:[function(require,module,exports){
/**
 * This namespace contains objects regarding the respresentation of things
 * in the universe.
 *
 * @namespace universe
 * @memberof everoute
 */

module.exports = {
  EmptySolarSystem: require("./EmptySolarSystem"),
  EmptyUniverse: require("./EmptyUniverse"),
  ExtendedSolarSystem: require("./ExtendedSolarSystem"),
  ExtendedUniverse: require("./ExtendedUniverse"),
  UniverseBuilder: require("./UniverseBuilder"),
  UniverseExtensionData: require("./UniverseExtensionData"),
  SolarSystemExtension: require("./SolarSystemExtension"),
  SolarSystemExtensionData: require("./SolarSystemExtensionData")
};

},{"./EmptySolarSystem":7,"./EmptyUniverse":8,"./ExtendedSolarSystem":9,"./ExtendedUniverse":10,"./SolarSystemExtension":11,"./SolarSystemExtensionData":12,"./UniverseBuilder":13,"./UniverseExtensionData":14}],16:[function(require,module,exports){
"use strict";

/**
 * This namespace contains utility helper for the library.
 *
 * @namespace util
 * @memberof everoute
 */

/**
 * A null function (no operation)
 * @memberof everoute.util
 */
var noop = function() {

};

module.exports = {
  noop: noop
};

},{}]},{},[1])
(1)
});
;