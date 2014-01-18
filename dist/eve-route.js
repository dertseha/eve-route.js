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

},{"./travel":15,"./universe":26,"./util":27}],2:[function(require,module,exports){
"use strict";

/**
 * This class is a travel cost that adds up.
 *
 * @constructor
 * @implements {everoute.travel.TravelCost}
 * @extends {everoute.travel.TravelCost}
 * @memberof everoute.travel
 * @param {String} type cost type
 * @param {Number} value the value
 */
function AddingTravelCost(type, value) {
  this.getType = function() {
    return type;
  };

  this.getValue = function() {
    return value;
  };

  this.join = function(other) {
    return new AddingTravelCost(type, value + other.getValue());
  };
}

module.exports = AddingTravelCost;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";

/**
 * This class represents a jump across the universe.
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

},{}],5:[function(require,module,exports){
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

},{"./AnyLocation":3,"./Jump":4}],6:[function(require,module,exports){
"use strict";

var TravelCostSum = require("./TravelCostSum");

/**
 * A path is a sequence of steps and a running total of costs.
 * The sequence of steps is realized using back references to the previous
 * path.
 *
 * @constructor
 * @memberof everoute.travel
 */
function Path(step, previous) {
  var stepCosts = step.getCosts();

  this.step = step;
  this.previous = previous;
  this.costSum = previous ? previous.getCostSum().add(stepCosts) : new TravelCostSum(stepCosts);
}

/**
 * @return {String} A key that identifies the current end location
 */
Path.prototype.getDestinationKey = function() {
  return this.step.getSolarSystemId().toString();
};

/**
 * @return {Boolean} true if this is the first step of the path
 * @memberof! everoute.travel.Path.prototype
 */
Path.prototype.isStart = function() {
  return !this.previous;
};

/**
 * @return {everoute.travel.Path} the path preceeding this one
 * @throws {Error} When this path is the start
 * @memberof! everoute.travel.Path.prototype
 */
Path.prototype.getPrevious = function() {
  if (this.isStart()) {
    throw new Error("Start of a path has no predecessor");
  }

  return this.previous;
};

/**
 * Extends this path with another step, returning a new path.
 *
 * @param {everoute.travel.Step} step the new step
 * @return {everoute.travel.Path} the resulting new path
 * @memberof! everoute.travel.Path.prototype
 */
Path.prototype.extend = function(step) {
  return new Path(step, this);
};

/**
 * @return {everoute.travel.Step} The step of this path
 * @memberof! everoute.travel.Path.prototype
 */
Path.prototype.getStep = function() {
  return this.step;
};

/**
 * @return {Array.<everoute.travel.Step>} The list of steps of this path
 * @memberof! everoute.travel.Path.prototype
 */
Path.prototype.getSteps = function() {
  var result = [this.step];

  return this.isStart() ? result : this.previous.getSteps().concat(result);
};

/**
 * @return {everoute.travel.TravelCostSum} The current sum of costs
 * @memberof! everoute.travel.Path.prototype
 */
Path.prototype.getCostSum = function() {
  return this.costSum;
};

module.exports = Path;

},{"./TravelCostSum":11}],7:[function(require,module,exports){
"use strict";

/**
 * A contest to provide the best paths to a given destination. A path may enter
 * (and stay in) the contest as long as:
 * Its previous steps are still the current best for their respective destination,
 * No other contestant exists for the destination,
 * Its cost is better than the previous destination (if different)
 *
 * @constructor
 * @param {everoute.travel.TraveRule} rule the rule by which this contest is held.
 * @memberof everoute.travel
 */
function PathContest(rule) {

  var pathsByDestinationKey = {};

  /**
   * Requests to enter the given path into the contest. All predecessors of given
   * path must have been entered previously.
   *
   * @param  {everoute.travel.Path} path The contesting path.
   * @return {Boolean} true if the given path is (still) a valid contestant.
   */
  this.enter = function(path) {
    var result = true;
    var destinationKey = path.getDestinationKey();
    var oldPath = pathsByDestinationKey[destinationKey];

    if (oldPath && (oldPath !== path) && rule.compare(path.getCostSum(), oldPath.getCostSum()) >= 0) {
      result = false;
    } else if (!path.isStart() && !isPathStillCurrent(path.getPrevious())) {
      result = false;
    } else {
      pathsByDestinationKey[destinationKey] = path;
    }

    return result;
  };

  function isPathStillCurrent(path) {
    var entry = path;
    var result;

    function isEntryCurrent() {
      var destinationKey = entry.getDestinationKey();

      return pathsByDestinationKey[destinationKey] === entry;
    }

    result = isEntryCurrent();
    while (result && !entry.isStart()) {
      entry = entry.getPrevious();
      result = isEntryCurrent();
    }

    return result;
  }
}

module.exports = PathContest;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";

/**
 * A provider that returns a predetermined contest.
 *
 * @constructor
 * @implements {everoute.travel.PathContestProvider}
 * @extends {everoute.travel.PathContestProvider}
 * @param {everoute.travel.PathContest} contest The contest to provide.
 * @memberof everoute.travel
 */
function StaticPathContestProvider(contest) {

  this.getContest = function() {
    return contest;
  };
}

module.exports = StaticPathContestProvider;

},{}],10:[function(require,module,exports){
"use strict";

/**
 * A step is one entry in a travel path. It only contains information about
 * the completed step - i.e., the destination information.
 *
 * @constructor
 * @memberof everoute.travel
 */
function Step(solarSystemId, location, costs) {
  this.solarSystemId = solarSystemId;
  this.location = location;
  this.costs = costs.slice(0);
}

/**
 * @return {Number} The ID of the solar system this step ended.
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getSolarSystemId = function() {
  return this.solarSystemId;
};

/**
 * @return {everoute.travel.Location} The location within the solar system.
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getLocation = function() {
  return this.location;
};

/**
 * @return {Array.<everoute.travel.TravelCost>} The costs involved in this step.
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getCosts = function() {
  return this.costs.slice(0);
};

module.exports = Step;

},{}],11:[function(require,module,exports){
"use strict";

/**
 * This class collects travel costs and can add costs up to new sums.
 *
 * @constructor
 * @memberof everoute.travel
 * @param {Array.<everoute.travel.TravelCost>} initCosts initial costs
 */
function TravelCostSum(initCosts) {
  var costs = {};

  initCosts.forEach(function(cost) {
    var type = cost.getType();

    if (costs.hasOwnProperty(type)) {
      costs[type] = cost.join(costs[type]);
    } else {
      costs[type] = cost;
    }
  });

  this.costs = costs;
}

/**
 * Returns a contained cost of the same type as given cost or the given cost
 * if this type is unknown.
 *
 * @param {everoute.travel.TravelCost} nullCost The cost to default to
 * @return {everoute.travel.TravelCost} The corresponing cost
 * @memberof! everoute.travel.TravelCostSum.prototype
 */
TravelCostSum.prototype.getCost = function(nullCost) {
  return this.costs[nullCost.getType()] || nullCost;
};

/**
 * @return {Array.<everoute.travel.TravelCost>} Array of all costs in this sum.
 * @memberof! everoute.travel.TravelCostSum.prototype
 */
TravelCostSum.prototype.getTotal = function() {
  var result = [];
  var key;

  for (key in this.costs) {
    if (this.costs.hasOwnProperty(key)) {
      result.push(this.costs[key]);
    }
  }

  return result;
};

/**
 * Adds an array of costs to the current sum, returning a new sum.
 *
 * @param {Array.<everoute.travel.TravelCost>} costs Array of costs to add.
 * @memberof! everoute.travel.TravelCostSum.prototype
 */
TravelCostSum.prototype.add = function(costs) {
  return new TravelCostSum(this.getTotal().concat(costs));
};

module.exports = TravelCostSum;

},{}],12:[function(require,module,exports){
"use strict";

/**
 * This capability combines a set of other capabilities. The result is the
 * combination of all contained capabilities.
 *
 * @constructor
 * @implements everoute.travel.capabilities.TravelCapability
 * @extends everoute.travel.capabilities.TravelCapability
 * @param {Array.<everoute.travel.capabilies.TravelCapability>} capabilities The capabilities to combine.
 * @memberof everoute.travel.capabilities
 */
function CombiningTravelCapability(capabilities) {

  this.getNextPaths = function(origin) {
    var result = [];

    capabilities.forEach(function(capability) {
      result = result.concat(capability.getNextPaths(origin));
    });

    return result;
  };
}

module.exports = CombiningTravelCapability;

},{}],13:[function(require,module,exports){
"use strict";

/**
 * This capability puts the result of another capability into a contest and
 * provides only the best for each destination.
 *
 * @constructor
 * @implements everoute.travel.capabilities.TravelCapability
 * @extends everoute.travel.capabilities.TravelCapability
 * @param {everoute.travel.capabilities.TravelCapability} capability The base capability.
 * @param {everoute.travel.PathContestProvider} contestProvider provider for the contests.
 * @memberof everoute.travel.capabilities
 */
function OptimizingTravelCapability(capability, contestProvider) {

  this.getNextPaths = function(origin) {
    var contest = contestProvider.getContest();
    var result = [];
    var best = {};
    var temp;

    if (contest.enter(origin)) {
      temp = capability.getNextPaths(origin);
      temp.forEach(function(path) {
        if (contest.enter(path)) {
          best[path.getDestinationKey()] = path;
        }
      });
    }
    for (temp in best) {
      if (best.hasOwnProperty(temp)) {
        result.push(best[temp]);
      }
    }

    return result;
  };
}

module.exports = OptimizingTravelCapability;

},{}],14:[function(require,module,exports){
/**
 * This namespace contains everything about travel capabilities.
 *
 * @namespace capabilities
 * @memberof everoute.travel
 */
module.exports = {
  CombiningTravelCapability: require("./CombiningTravelCapability"),
  OptimizingTravelCapability: require("./OptimizingTravelCapability")
};

},{"./CombiningTravelCapability":12,"./OptimizingTravelCapability":13}],15:[function(require,module,exports){
/**
 * This namespace contains entries regarding travel.
 *
 * @namespace travel
 * @memberof everoute
 */
module.exports = {
  capabilities: require("./capabilities"),
  rules: require("./rules"),

  AddingTravelCost: require("./AddingTravelCost"),
  AnyLocation: require("./AnyLocation"),
  Jump: require("./Jump"),
  JumpBuilder: require("./JumpBuilder"),
  Path: require("./Path"),
  PathContest: require("./PathContest"),
  SpecificLocation: require("./SpecificLocation"),
  StaticPathContestProvider: require("./StaticPathContestProvider"),
  Step: require("./Step"),
  TravelCostSum: require("./TravelCostSum")
};

},{"./AddingTravelCost":2,"./AnyLocation":3,"./Jump":4,"./JumpBuilder":5,"./Path":6,"./PathContest":7,"./SpecificLocation":8,"./StaticPathContestProvider":9,"./Step":10,"./TravelCostSum":11,"./capabilities":14,"./rules":17}],16:[function(require,module,exports){
"use strict";

/**
 * The ruleset is a list of TravelRules and provides a combined comparison
 * result. The contained rules are used for comparison until one rule returns
 * a difference.
 *
 * @constructor
 * @implements {everoute.travel.rules.TravelRule}
 * @extends {everoute.travel.rules.TravelRule}
 * @param {Array.<everoute.travel.rules.TravelRule>} rules the rules to use
 * @memberof everoute.travel.rules
 */
function TravelRuleset(rules) {
  this.rules = rules.slice(0);
}

TravelRuleset.prototype.compare = function(sumA, sumB) {
  var amount = this.rules.length;
  var result = 0;
  var i;

  for (i = 0; result === 0 && (i < amount); i++) {
    result = this.rules[i].compare(sumA, sumB);
  }

  return result;
};

module.exports = TravelRuleset;

},{}],17:[function(require,module,exports){
/**
 * This namespace contains rules for travelling.
 *
 * @namespace rules
 * @memberof everoute.travel
 */
module.exports = {
  TravelRuleset: require("./TravelRuleset")
};

},{"./TravelRuleset":16}],18:[function(require,module,exports){
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

EmptySolarSystem.prototype.getCosts = function() {
  return [];
};

module.exports = EmptySolarSystem;

},{}],19:[function(require,module,exports){
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

},{"./UniverseBuilder":24}],20:[function(require,module,exports){
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

  /**
   * @type {Array.<everoute.travel.TravelCost>}
   * @private
   */
  var costs = data.costs.slice(0);

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

  this.getCosts = function() {
    var result = base.getCosts();

    return result.concat(costs);
  };

}

module.exports = ExtendedSolarSystem;

},{}],21:[function(require,module,exports){
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
      if (solarSystems.hasOwnProperty(key)) {
        addId(solarSystems[key].getId());
      }
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

},{"./UniverseBuilder":24}],22:[function(require,module,exports){
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

},{"../travel/JumpBuilder":5}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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
      if (solarSystemExtensionData.hasOwnProperty(key)) {
        extensionData.solarSystems.push(new ExtendedSolarSystem(solarSystemExtensionData[key]));
      }
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

},{"./EmptySolarSystem":18,"./ExtendedSolarSystem":20,"./ExtendedUniverse":21,"./SolarSystemExtension":22,"./SolarSystemExtensionData":23,"./UniverseExtensionData":25}],25:[function(require,module,exports){
"use strict";

/**
 * The extension data is used as a initialization data for an
 * ExtendedUniverse.
 *
 * @constructor
 * @private
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

},{}],26:[function(require,module,exports){
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

},{"./EmptySolarSystem":18,"./EmptyUniverse":19,"./ExtendedSolarSystem":20,"./ExtendedUniverse":21,"./SolarSystemExtension":22,"./SolarSystemExtensionData":23,"./UniverseBuilder":24,"./UniverseExtensionData":25}],27:[function(require,module,exports){
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