!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.everoute=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

/**
 * This is the root namespace for everything in this library.
 *
 * @namespace everoute
 */

var universe = _dereq_("./universe");


/**
 * @return {everoute.universe.UniverseBuilder} a fresh universe builder based on an empty universe.
 * @memberof everoute
 */
var newUniverseBuilder = function() {
  return new universe.UniverseBuilder(new universe.EmptyUniverse());
};

module.exports = {
  travel: _dereq_("./travel"),
  universe: universe,
  util: _dereq_("./util"),

  newUniverseBuilder: newUniverseBuilder
};

},{"./travel":20,"./universe":52,"./util":54}],2:[function(_dereq_,module,exports){
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
  this.type = type;
  this.value = value;
}

AddingTravelCost.prototype.getType = function() {
  return this.type;
};

AddingTravelCost.prototype.getValue = function() {
  return this.value;
};

AddingTravelCost.prototype.join = function(other) {
  return new AddingTravelCost(this.type, this.value + other.getValue());
};

module.exports = AddingTravelCost;

},{}],3:[function(_dereq_,module,exports){
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

AnyLocation.prototype.toString = function() {
  return "*";
};

AnyLocation.prototype.getPositionRelativeTo = function(origin) {
  return [0, 0, 0];
};

AnyLocation.prototype.distanceTo = function(other) {
  return 0;
};

/**
 * Singleton instance
 *
 * @const
 * @type {everoute.travel.Location}
 * @memberof! everoute.travel.AnyLocation
 */
AnyLocation.INSTANCE = new AnyLocation();

module.exports = AnyLocation;

},{}],4:[function(_dereq_,module,exports){
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

  this.ofType = ofType;
  this.fromLocation = fromLocation;
  this.toSystemId = toSystemId;
  this.toLocation = toLocation;
  this.jumpCosts = costs.slice(0);
}

/**
 * @return {String} Type identifying how the jump is performed.
 * @memberof! everoute.travel.Jump.prototype
 */
Jump.prototype.getType = function() {
  return this.ofType;
};

/**
 * @return {Number} Identifying the destination solar system.
 * @memberof! everoute.travel.Jump.prototype
 */
Jump.prototype.getDestinationId = function() {
  return this.toSystemId;
};

/**
 * @param {everoute.travel.Location} Location within the source system.
 * @memberof! everoute.travel.Jump.prototype
 */
Jump.prototype.getSourceLocation = function() {
  return this.fromLocation;
};

/**
 * @param {everoute.travel.Location} toLocation location within destination system.
 * @memberof! everoute.travel.Jump.prototype
 */
Jump.prototype.getDestinationLocation = function() {
  return this.toLocation;
};

/**
 * @param {Array.<everoute.travel.TravelCost>} Array of costs involved with this jump
 * @memberof! everoute.travel.Jump.prototype
 */
Jump.prototype.getCosts = function() {
  return this.jumpCosts.slice(0);
};

module.exports = Jump;

},{}],5:[function(_dereq_,module,exports){
"use strict";

var AnyLocation = _dereq_("./AnyLocation");
var Jump = _dereq_("./Jump");

/**
 * This builder is for creating a jump description.
 *
 * @constructor
 * @memberof everoute.travel
 * @param {String} jumpType Type of jump
 * @param {Number} destinationId ID of the destination solar system
 */
function JumpBuilder(jumpType, destinationId) {
  this.jumpType = jumpType;
  this.destinationId = destinationId;
  this.fromLocation = AnyLocation.INSTANCE;
  this.toLocation = AnyLocation.INSTANCE;
  this.costs = [];
}

/**
 * Builds a new jump instance, based on the current configured members.
 *
 * @return {everoute.travel.Jump} the built jump instance
 * @memberof! everoute.travel.JumpBuilder.prototype
 */
JumpBuilder.prototype.build = function() {
  return new Jump(this.jumpType, this.fromLocation, this.destinationId, this.toLocation, this.costs);
};

/**
 * The location in the source solar system where this jump is started.
 * Defaults to AnyLocation.
 *
 * @param  {everoute.travel.Location} location the source location
 * @return {everoute.travel.JumpBuilder} this instance
 * @memberof! everoute.travel.JumpBuilder.prototype
 */
JumpBuilder.prototype.from = function(location) {
  this.fromLocation = location;

  return this;
};

/**
 * The location in the destination solar system where this jump is landing.
 * Defaults to AnyLocation.
 *
 * @param  {everoute.travel.Location} location the destination location
 * @return {everoute.travel.JumpBuilder} this instance
 * @memberof! everoute.travel.JumpBuilder.prototype
 */
JumpBuilder.prototype.to = function(location) {
  this.toLocation = location;

  return this;
};

/**
 * Adds another cost involved in this jump.
 *
 * @param  {everoute.travel.TravelCost} cost the extra cost
 * @return {everoute.travel.JumpBuilder} this instance
 * @memberof! everoute.travel.JumpBuilder.prototype
 */
JumpBuilder.prototype.addCost = function(cost) {
  this.costs.push(cost);

  return this;
};


module.exports = JumpBuilder;

},{"./AnyLocation":3,"./Jump":4}],6:[function(_dereq_,module,exports){
"use strict";

var TravelCostSum = _dereq_("./TravelCostSum");

/**
 * A path is a sequence of steps and a running total of costs.
 * The sequence of steps is realized using back references to the previous
 * path.
 *
 * @constructor
 * @param {everoute.travel.Step} step the step that made this path
 * @param {everoute.travel.Path} [previous] the previous path this one extends. Internal parameter.
 * @param {everoute.travel.TravelCostSum} [costSum] the new cost sum. Internal parameter.
 * @memberof everoute.travel
 */
function Path(step, previous, costSum) {
  this.step = step;
  this.previous = previous;
  this.costSum = costSum ? costSum : new TravelCostSum(step.getEnterCosts());
}

/**
 * @return {String} A key that identifies the current end location
 */
Path.prototype.getDestinationKey = function() {
  return this.step.getKey();
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
  var costs = this.step.getContinueCosts().concat(step.getEnterCosts());

  return new Path(step, this, this.costSum.add(costs));
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

},{"./TravelCostSum":12}],7:[function(_dereq_,module,exports){
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

},{}],8:[function(_dereq_,module,exports){
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

  this.toString = function() {
    return "[" + x + ", " + y + ", " + z + "]";
  };

  this.getPositionRelativeTo = function(origin) {
    return [position[0] - origin[0], position[1] - origin[1], position[2] - origin[2]];
  };

  this.distanceTo = function(other) {
    var pos = other.getPositionRelativeTo(position.slice(0));

    return Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1] + pos[2] * pos[2]);
  };
}

module.exports = SpecificLocation;

},{}],9:[function(_dereq_,module,exports){
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

},{}],10:[function(_dereq_,module,exports){
"use strict";

/**
 * A step is one entry in a travel path. It only contains information about
 * the completed step - i.e., the destination information.
 *
 * 'Continue' costs are those that are necessary if this step is only an
 * intermediary step in a journey. For example, the security status of a system
 * does not contribute to the cost of the path if the system is the last one
 * (the destination).
 *
 * The user does not need to create an instance directly and should use the
 * StepBuilder instead.
 *
 * @constructor
 * @param {Number} solarSystemId The ID of the solar system in which this step ends
 * @param {everoute.travel.Location} location the location where the step ends
 * @param {Array.<everoute.travel.TravelCost>} enterCosts costs necessary to do this step
 * @param {Array.<everoute.travel.TravelCost>} continueCosts costs necessary to continue the journey
 * @memberof everoute.travel
 */
function Step(solarSystemId, location, enterCosts, continueCosts) {
  this.solarSystemId = solarSystemId;
  this.location = location;
  this.enterCosts = enterCosts.slice(0);
  this.continueCosts = continueCosts.slice(0);

  this.key = this.solarSystemId.toString() + "@" + this.location.toString();
}

/**
 * @return {everoute.travel.Step} A step that is a copy of this, without costs
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.asFirstStep = function() {
  return new Step(this.solarSystemId, this.location, [], []);
};

/**
 * @return {String} A key that identifies this destination location
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getKey = function() {
  return this.key;
};

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
 * @return {Array.<everoute.travel.TravelCost>} The costs involved in reaching this step.
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getEnterCosts = function() {
  return this.enterCosts.slice(0);
};

/**
 * @return {Array.<everoute.travel.TravelCost>} The costs necessary to continue the journey.
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getContinueCosts = function() {
  return this.continueCosts.slice(0);
};

module.exports = Step;

},{}],11:[function(_dereq_,module,exports){
"use strict";

var AnyLocation = _dereq_("./AnyLocation");
var Step = _dereq_("./Step");

/**
 * This builder helps creating steps, using common defaults where possible.
 *
 * @constructor
 * @param {Number} solarSystemId The ID of the solar system in which this step ends
 * @memberof everoute.travel
 */
function StepBuilder(solarSystemId) {

  var to = new AnyLocation();
  var enterCosts = [];
  var continueCosts = [];

  /**
   * Builds a step instance with the current contained data.
   * @return {everoute.travel.Step} The built step instance.
   */
  this.build = function() {
    return new Step(solarSystemId, to, enterCosts, continueCosts);
  };

  /**
   * The location in the solar system where the step is completing.
   * Defaults to AnyLocation.
   *
   * @param  {everoute.travel.Location} location the destination location
   * @return {everoute.travel.StepBuilder} this instance
   */
  this.to = function(location) {
    to = location;

    return this;
  };

  /**
   * Sets the enter costs for this step. Defaults to empty array.
   *
   * @param {Array.<everoute.travel.TravelCost>} costs the enter costs.
   * @return {everoute.travel.StepBuilder} this instance
   */
  this.withEnterCosts = function(costs) {
    enterCosts = costs.slice(0);

    return this;
  };

  /**
   * Sets the continue costs for this step. Defaults to empty array.
   *
   * @param {Array.<everoute.travel.TravelCost>} costs the continue costs.
   * @return {everoute.travel.StepBuilder} this instance
   */
  this.withContinueCosts = function(costs) {
    continueCosts = costs.slice(0);

    return this;
  };
}

module.exports = StepBuilder;

},{"./AnyLocation":3,"./Step":10}],12:[function(_dereq_,module,exports){
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

},{}],13:[function(_dereq_,module,exports){
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

},{}],14:[function(_dereq_,module,exports){
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
        var destinationKey = path.getDestinationKey();

        if ((origin.isStart() || (origin.getPrevious().getDestinationKey() !== destinationKey)) && contest.enter(path)) {
          best[destinationKey] = path;
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

},{}],15:[function(_dereq_,module,exports){
/**
 * This namespace contains everything about travel capabilities.
 *
 * @namespace capabilities
 * @memberof everoute.travel
 */
module.exports = {
  jumpDrive: _dereq_("./jumpDrive"),
  jumpGate: _dereq_("./jumpGate"),

  CombiningTravelCapability: _dereq_("./CombiningTravelCapability"),
  OptimizingTravelCapability: _dereq_("./OptimizingTravelCapability")
};

},{"./CombiningTravelCapability":13,"./OptimizingTravelCapability":14,"./jumpDrive":17,"./jumpGate":19}],16:[function(_dereq_,module,exports){
"use strict";

var StepBuilder = _dereq_("../../StepBuilder");
var jumpDistance = _dereq_("../../rules/jumpDistance");

/**
 * This capability uses jump drive jumps to get out of a system
 *
 * @constructor
 * @implements {everoute.travel.capabilities.TravelCapability}
 * @extends {everoute.travel.capabilities.TravelCapability}
 * @param {everoute.universe.Universe} universe the universe to query
 * @param {Number} distanceLimit amount of light years the capability can jump
 * @memberof everoute.travel.capabilities.jumpDrive
 */
function JumpDriveTravelCapability(universe, distanceLimit) {

  this.getNextPaths = function(path) {
    var solarSystem = universe.getSolarSystem(path.getStep().getSolarSystemId());
    var jumps = solarSystem.getJumps(JumpDriveTravelCapability.JUMP_TYPE);
    var result = [];

    jumps = jumps.filter(function(jump) {
      var costs = jump.getCosts();

      return costs.reduce(function(result, cost) {
        return result && ((cost.getType() !== jumpDistance.COST_TYPE) || (cost.getValue() <= distanceLimit));
      }, true);
    });
    jumps.forEach(function(jump) {
      var destination = universe.getSolarSystem(jump.getDestinationId());
      var builder = new StepBuilder(destination.getId()).withEnterCosts(jump.getCosts()).withContinueCosts(destination.getCosts());

      result.push(path.extend(builder.build()));
    });

    return result;
  };
}

JumpDriveTravelCapability.JUMP_TYPE = "jumpDrive";

module.exports = JumpDriveTravelCapability;

},{"../../StepBuilder":11,"../../rules/jumpDistance":24}],17:[function(_dereq_,module,exports){
"use strict";

var util = _dereq_("../../../util");
var jumpDistance = _dereq_("../../rules/jumpDistance");

var JumpDriveTravelCapability = _dereq_("./JumpDriveTravelCapability");

/**
 * This namespace contains helper regarding the jump drive travel capability.
 *
 * @namespace jumpDrive
 * @memberof everoute.travel.capabilities
 */

/**
 * The type identification for the jumps: "jumpDrive".
 *
 * @type {String}
 * @const
 * @memberof everoute.travel.capabilities.jumpDrive
 */
var JUMP_TYPE = JumpDriveTravelCapability.JUMP_TYPE;

/**
 * The maximum distance one can jump with a jump drive. As per http://wiki.eveonline.com/en/wiki/Jump_drive, this is
 * based on a carrier (6.5) times 2.5 at maximum skill level - rounded up for paranoia.
 *
 * @type {Number}
 * @const
 * @memberof everoute.travel.capabilities.jumpDrive
 */
var DISTANCE_LIMIT_LY = 17.0;

/**
 * @param {everoute.universe.SolarSystemExtension} extension the solar system extension to check
 * @return {Boolean} true if the given system is from the New Eden galaxy
 */
var isNewEdenSystem = function(extension) {
  return extension.getGalaxyId() === util.constants.GALAXY_ID_NEW_EDEN;
};

/**
 * @param {everoute.universe.SolarSystemExtension} extension the solar system extension to check
 * @return {Boolean} true if the given system is a high sec system
 */
var isHighSecSystem = function(extension) {
  return extension.getSecurityValue() >= 0.5;
};

/**
 * Extends the given universe builder with jump drive jumps according to game rules.
 * Jumps will only be possible in New Eden (Galaxy ID 9) and only be into non-high-sec systems.
 *
 * @param {everoute.universe.UniverseBuilder} builder The builder for extension.
 * @param {Number} [limitLy] Optional limit of jumps, in light years
 * @memberof everoute.travel.capabilities.jumpDrive
 */
var extendUniverse = function(builder, limitLy) {
  var usedLimit = limitLy || DISTANCE_LIMIT_LY;
  var solarSystemIds = builder.getSolarSystemIds();
  var highSecSystems = [];
  var nonHighSecSystems = [];

  solarSystemIds.forEach(function(id) {
    var extension = builder.extendSolarSystem(id);

    if (isNewEdenSystem(extension)) {
      if (isHighSecSystem(extension)) {
        highSecSystems.push(extension);
      } else {
        nonHighSecSystems.push(extension);
      }
    }
  });

  function createJumpsFromHighSec(source) {
    nonHighSecSystems.forEach(function(destination) {
      var distance = source.getLocation().distanceTo(destination.getLocation()) / util.constants.METERS_PER_LY;

      if (distance <= usedLimit) {
        source.addJump(JUMP_TYPE, destination.getId()).addCost(jumpDistance.getCost(distance));
      }
    });
  }

  function createJumpsBetween(source, startIndex) {
    var limit = nonHighSecSystems.length;
    var destination;
    var distance;
    var cost;
    var i;

    for (i = startIndex; i < limit; i++) {
      destination = nonHighSecSystems[i];
      distance = source.getLocation().distanceTo(destination.getLocation()) / util.constants.METERS_PER_LY;
      if (distance <= usedLimit) {
        cost = jumpDistance.getCost(distance);
        destination.addJump(JUMP_TYPE, source.getId()).addCost(cost);
        source.addJump(JUMP_TYPE, destination.getId()).addCost(cost);
      }
    }
  }

  highSecSystems.forEach(function(source) {
    createJumpsFromHighSec(source);
  });
  nonHighSecSystems.forEach(function(source, index) {
    createJumpsBetween(source, index + 1);
  });
};

module.exports = {
  JUMP_TYPE: JUMP_TYPE,
  DISTANCE_LIMIT_LY: DISTANCE_LIMIT_LY,

  JumpDriveTravelCapability: JumpDriveTravelCapability,

  extendUniverse: extendUniverse
};

},{"../../../util":54,"../../rules/jumpDistance":24,"./JumpDriveTravelCapability":16}],18:[function(_dereq_,module,exports){
"use strict";

var StepBuilder = _dereq_("../../StepBuilder");

/**
 * This capability uses jump gates to get out of a system
 *
 * @constructor
 * @implements {everoute.travel.capabilities.TravelCapability}
 * @extends {everoute.travel.capabilities.TravelCapability}
 * @param {everoute.universe.Universe} universe the universe to query
 * @memberof everoute.travel.capabilities.jumpGate
 */
function JumpGateTravelCapability(universe) {

  this.getNextPaths = function(path) {
    var solarSystem = universe.getSolarSystem(path.getStep().getSolarSystemId());
    var jumps = solarSystem.getJumps(JumpGateTravelCapability.JUMP_TYPE);
    var result = [];

    jumps.forEach(function(jump) {
      var destination = universe.getSolarSystem(jump.getDestinationId());
      var builder = new StepBuilder(destination.getId()).withEnterCosts(jump.getCosts()).withContinueCosts(destination.getCosts());

      result.push(path.extend(builder.build()));
    });

    return result;
  };
}

JumpGateTravelCapability.JUMP_TYPE = "jumpGate";

module.exports = JumpGateTravelCapability;

},{"../../StepBuilder":11}],19:[function(_dereq_,module,exports){
"use strict";

var JumpGateTravelCapability = _dereq_("./JumpGateTravelCapability");

/**
 * This namespace contains helper regarding the jump gate travel capability.
 *
 * @namespace jumpGate
 * @memberof everoute.travel.capabilities
 */

/**
 * The type identification for the jumps: "jumpGate".
 *
 * @type {String}
 * @const
 * @memberof everoute.travel.capabilities.jumpGate
 */
var JUMP_TYPE = JumpGateTravelCapability.JUMP_TYPE;

module.exports = {
  JUMP_TYPE: JUMP_TYPE,

  JumpGateTravelCapability: JumpGateTravelCapability
};

},{"./JumpGateTravelCapability":18}],20:[function(_dereq_,module,exports){
/**
 * This namespace contains entries regarding travel.
 *
 * @namespace travel
 * @memberof everoute
 */
module.exports = {
  capabilities: _dereq_("./capabilities"),
  rules: _dereq_("./rules"),
  search: _dereq_("./search"),

  AddingTravelCost: _dereq_("./AddingTravelCost"),
  AnyLocation: _dereq_("./AnyLocation"),
  Jump: _dereq_("./Jump"),
  JumpBuilder: _dereq_("./JumpBuilder"),
  Path: _dereq_("./Path"),
  PathContest: _dereq_("./PathContest"),
  SpecificLocation: _dereq_("./SpecificLocation"),
  StaticPathContestProvider: _dereq_("./StaticPathContestProvider"),
  Step: _dereq_("./Step"),
  StepBuilder: _dereq_("./StepBuilder"),
  TravelCostSum: _dereq_("./TravelCostSum")
};

},{"./AddingTravelCost":2,"./AnyLocation":3,"./Jump":4,"./JumpBuilder":5,"./Path":6,"./PathContest":7,"./SpecificLocation":8,"./StaticPathContestProvider":9,"./Step":10,"./StepBuilder":11,"./TravelCostSum":12,"./capabilities":15,"./rules":23,"./search":43}],21:[function(_dereq_,module,exports){
"use strict";

/**
 * The rule compares costs according to their natural order. Lower values
 * are considered better than higher values.
 *
 * @constructor
 * @implements {everoute.travel.rules.TravelRule}
 * @extends {everoute.travel.rules.TravelRule}
 * @param {everoute.travel.TravelCost} nullCost the default cost value.
 * @memberof everoute.travel.rules
 */
function NaturalOrderTravelRule(nullCost) {

  this.compare = function(sumA, sumB) {
    return sumA.getCost(nullCost).getValue() - sumB.getCost(nullCost).getValue();
  };
}

module.exports = NaturalOrderTravelRule;

},{}],22:[function(_dereq_,module,exports){
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

},{}],23:[function(_dereq_,module,exports){
/**
 * This namespace contains rules for travelling.
 *
 * @namespace rules
 * @memberof everoute.travel
 */
module.exports = {
  jumpDistance: _dereq_("./jumpDistance"),
  security: _dereq_("./security"),
  transitCount: _dereq_("./transitCount"),

  NaturalOrderTravelRule: _dereq_("./NaturalOrderTravelRule"),
  TravelRuleset: _dereq_("./TravelRuleset")
};

},{"./NaturalOrderTravelRule":21,"./TravelRuleset":22,"./jumpDistance":24,"./security":27,"./transitCount":29}],24:[function(_dereq_,module,exports){
"use strict";

var AddingTravelCost = _dereq_("../../AddingTravelCost");
var NaturalOrderTravelRule = _dereq_("../NaturalOrderTravelRule");

/**
 * This namespace contains helper regarding the jump distance rule. This
 * rule is used to determine the distance of jump drive jumps.
 *
 * @namespace jumpDistance
 * @memberof everoute.travel.rules
 */

/**
 * The type identification used for cost: "jumpDistance".
 *
 * @type {String}
 * @const
 * @memberof everoute.travel.rules.jumpDistance
 */
var COST_TYPE = "jumpDistance";

/**
 * @param {Number} lightYears The distance in light years
 * @return {everoute.travel.TravelCost} the cost representing the distance
 * @memberof everoute.travel.rules.jumpDistance
 */
var getCost = function(lightYears) {
  return new AddingTravelCost(COST_TYPE, lightYears);
};

/**
 * Returns a rule that will search for the lowest jump distance - in effect,
 * the path between a source and a destination that requires the least amount
 * of jump fuel.
 *
 * @return {everoute.travel.rules.TravelRule} The rule intance.
 * @memberof everoute.travel.rules.jumpDistance
 */
var getRule = function() {
  return new NaturalOrderTravelRule(getCost(0));
};

module.exports = {
  COST_TYPE: COST_TYPE,
  getCost: getCost,
  getRule: getRule
};

},{"../../AddingTravelCost":2,"../NaturalOrderTravelRule":21}],25:[function(_dereq_,module,exports){
"use strict";

var statics = _dereq_("./statics");

/**
 * The rule considers all security value costs that are from a security value
 * below the limit to be equal. The sum of all costs above or equal the limit
 * value is compared.
 *
 * @constructor
 * @implements {everoute.travel.rules.TravelRule}
 * @extends {everoute.travel.rules.TravelRule}
 * @param {Number} limit the inclusive limit
 * @memberof everoute.travel.rules
 */
function MaxSecurityTravelRule(limit) {
  var integerLimit = limit * 10;

  this.compare = function(sumA, sumB) {
    var valueA = statics.sumSecurityCosts(sumA, integerLimit, 10);
    var valueB = statics.sumSecurityCosts(sumB, integerLimit, 10);

    return valueA - valueB;
  };
}

module.exports = MaxSecurityTravelRule;

},{"./statics":28}],26:[function(_dereq_,module,exports){
"use strict";

var statics = _dereq_("./statics");

/**
 * The rule considers all security value costs that are from a security value
 * equal or above the limit to be equal. The sum of all costs below the limit
 * value is compared.
 *
 * @constructor
 * @implements {everoute.travel.rules.TravelRule}
 * @extends {everoute.travel.rules.TravelRule}
 * @param {Number} limit the inclusive limit
 * @memberof everoute.travel.rules
 */
function MinSecurityTravelRule(limit) {
  var integerLimit = (limit * 10) - 1;

  this.compare = function(sumA, sumB) {
    var valueA = statics.sumSecurityCosts(sumA, 0, integerLimit);
    var valueB = statics.sumSecurityCosts(sumB, 0, integerLimit);

    return valueA - valueB;
  };
}

module.exports = MinSecurityTravelRule;

},{"./statics":28}],27:[function(_dereq_,module,exports){
"use strict";

var statics = _dereq_("./statics");
var MaxSecurityTravelRule = _dereq_("./MaxSecurityTravelRule");
var MinSecurityTravelRule = _dereq_("./MinSecurityTravelRule");

/**
 * This namespace contains helper regarding the rules about security.
 *
 * @namespace security
 * @memberof everoute.travel.rules
 */

/**
 * Extends the universe by adding security cost to all solar systems.
 * This method should be called only once per universe as it would add the same
 * cost another time to existing ones.
 *
 * @param {everoute.universe.UniverseBuilder} builder The builder for extension.
 * @memberof everoute.travel.rules.security
 */
var extendUniverse = function(builder) {
  var solarSystemIds = builder.getSolarSystemIds();

  solarSystemIds.forEach(function(id) {
    var extension = builder.extendSolarSystem(id);
    var security = extension.getSecurityValue();

    extension.addCost(statics.getTravelCost(security, 1));
  });
};

/**
 * Returns a rule that prefers a path that has at least the given limit as the
 * minimum security value. Reasonable values for limit are [0.1 .. 0.5]
 *
 * @param {Number} limit the inclusive minimum value a path should have.
 * @return {everoute.travel.rules.TravelRule} The rule intance.
 * @memberof everoute.travel.rules.security
 */
var getMinRule = function(limit) {
  return new MinSecurityTravelRule(limit);
};

/**
 * Returns a rule that prefers a path that has a maximum security value below
 * the given limit. Reasonable values for limit are [0.5 .. 1.0]
 *
 * @param {Number} limit the exclusive maximum value a path should have.
 * @return {everoute.travel.rules.TravelRule} The rule intance.
 * @memberof everoute.travel.rules.security
 */
var getMaxRule = function(limit) {
  return new MaxSecurityTravelRule(limit);
};

module.exports = {
  extendUniverse: extendUniverse,
  getMaxRule: getMaxRule,
  getMinRule: getMinRule,
  getTravelCost: statics.getTravelCost,
  getTravelCostType: statics.getTravelCostType
};

},{"./MaxSecurityTravelRule":25,"./MinSecurityTravelRule":26,"./statics":28}],28:[function(_dereq_,module,exports){
"use strict";

var AddingTravelCost = _dereq_("../../AddingTravelCost");

/**
 * Returns the travel cost type identifier for given security value. This
 * method is meant for the 'visible' security value in the range of 0.0 .. 1.0
 * with 0.1 increments. For example, a value of 0.3 will return "security03".
 *
 * @param {Number} security the security value
 * @return {String} the travel cost type identifier for given security value.
 * @memberof! everoute.travel.rules.security
 */
var getTravelCostType = function(security) {
  return "security" + security.toFixed(1).replace(".", "");
};

/**
 * Returns a travel cost representing given security, having the given value.
 *
 * @param {Number} security The security value.
 * @param {Number} value The initial value.
 * @return {everoute.travel.TravelCost} The travel cost representing the security value.
 * @memberof! everoute.travel.rules.security
 */
var getTravelCost = function(security, value) {
  return new AddingTravelCost(getTravelCostType(security), value);
};

var nullCosts = {};

(function initNullCosts() {
  var security;
  var cost;

  for (security = 0; security <= 10; security++) {
    cost = getTravelCost(security / 10, 0);
    nullCosts[cost.getType()] = cost;
  }
})();

/**
 * Returns the sum of all security costs between the two given security limits.
 * The limits are integer values (0..10) to avoid rounding errors.
 *
 * @param {everoute.travel.TravelCostSum} costSum The cost sum from which to extract costs.
 * @param {Number} from Security value, from which to check (inclusive).
 * @param {Number} to Security value, to which to check (inclusive).
 * @return {Number} Amount of all costs in the range.
 * @private
 */
var sumSecurityCosts = function(costSum, from, to) {
  var result = 0;
  var security;
  var nullCost;

  for (security = from; security <= to; security++) {
    nullCost = nullCosts[getTravelCostType(security / 10)];
    result += costSum.getCost(nullCost).getValue();
  }

  return result;
};

module.exports = {
  getTravelCost: getTravelCost,
  getTravelCostType: getTravelCostType,

  sumSecurityCosts: sumSecurityCosts
};

},{"../../AddingTravelCost":2}],29:[function(_dereq_,module,exports){
"use strict";

var AddingTravelCost = _dereq_("../../AddingTravelCost");
var NaturalOrderTravelRule = _dereq_("../NaturalOrderTravelRule");

/**
 * This namespace contains helper regarding the transit count rule. This
 * rule is used to determine the length of a path.
 * The term "transit count" is technically more correct as the corresponding
 * cost is only added for systems that are neither source nor destination
 * systems.
 *
 * @namespace transitCount
 * @memberof everoute.travel.rules
 */

/**
 * The type identification used for cost: "transitCount".
 *
 * @type {String}
 * @const
 * @memberof everoute.travel.rules.transitCount
 */
var COST_TYPE = "transitCount";

/**
 * Extends the universe by adding a transit count cost to all solar systems.
 * This method should be called only once per universe as it would add the same
 * cost another time to existing ones.
 *
 * @param {everoute.universe.UniverseBuilder} builder The builder for extension.
 * @memberof everoute.travel.rules.transitCount
 */
var extendUniverse = function(builder) {
  var solarSystemIds = builder.getSolarSystemIds();

  solarSystemIds.forEach(function(id) {
    var extension = builder.extendSolarSystem(id);

    extension.addCost(new AddingTravelCost(COST_TYPE, 1));
  });
};

/**
 * Returns a rule that will search for the lowest transit count - in effect,
 * the shortest path between a source and a destination.
 *
 * @return {everoute.travel.rules.TravelRule} The rule intance.
 * @memberof everoute.travel.rules.transitCount
 */
var getRule = function() {
  var nullCost = new AddingTravelCost(COST_TYPE, 0);

  return new NaturalOrderTravelRule(nullCost);
};

module.exports = {
  COST_TYPE: COST_TYPE,
  extendUniverse: extendUniverse,
  getRule: getRule
};

},{"../../AddingTravelCost":2,"../NaturalOrderTravelRule":21}],30:[function(_dereq_,module,exports){
"use strict";

/**
 * A search criterion that combines a list of other criteria.
 * It desires only paths that all criteria desire and lets the search continue
 * only with paths on which all criteria agree.
 *
 * @constructor
 * @implements everoute.travel.search.SearchCriterion
 * @extends everoute.travel.search.SearchCriterion
 * @param {Array.<everoute.travel.search.SearchCriterion>} criteria A list of criteria to combine
 * @memberof everoute.travel.search
 */
function CombiningSearchCriterion(criteria) {

  this.isDesired = function(path) {
    var result = false;

    if (criteria.length > 0) {
      result = criteria.reduce(function(desired, criterion) {
        return desired && criterion.isDesired(path);
      }, true);
    }

    return result;
  };

  this.shouldSearchContinueWith = function(path, results) {
    var result = false;

    if (criteria.length > 0) {
      result = criteria.reduce(function(desired, criterion) {
        return desired && criterion.shouldSearchContinueWith(path, results);
      }, true);
    }

    return result;
  };
}

module.exports = CombiningSearchCriterion;

},{}],31:[function(_dereq_,module,exports){
"use strict";

/**
 * A search criterion that continues searches only if the given path is cheaper
 * than the current results.
 *
 * @constructor
 * @implements everoute.travel.search.SearchCriterion
 * @extends everoute.travel.search.SearchCriterion
 * @param {everoute.travel.rules.TravelRule} rule the rule by which to compare costs
 * @memberof everoute.travel.search
 */
function CostAwareSearchCriterion(rule) {

  this.isDesired = function(path) {
    return true;
  };

  this.shouldSearchContinueWith = function(path, results) {
    var costSum = path.getCostSum();

    return results.reduce(function(isCheaper, result) {
      return isCheaper && (rule.compare(costSum, result.getCostSum()) < 0);
    }, true);
  };
}

module.exports = CostAwareSearchCriterion;

},{}],32:[function(_dereq_,module,exports){
"use strict";

/**
 * A search criterion that looks for a specific system and stops searches
 * when this system has been reached.
 *
 * @constructor
 * @implements everoute.travel.search.SearchCriterion
 * @extends everoute.travel.search.SearchCriterion
 * @param {Number} systemId The ID of the solar system to look for
 * @memberof everoute.travel.search
 */
function DestinationSystemSearchCriterion(systemId) {

  this.isDesired = function(path) {
    return path.getStep().getSolarSystemId() === systemId;
  };

  this.shouldSearchContinueWith = function(path) {
    return path.getStep().getSolarSystemId() !== systemId;
  };
}

module.exports = DestinationSystemSearchCriterion;

},{}],33:[function(_dereq_,module,exports){
"use strict";

/**
 * A path finder uses a travel capability to search from a starting path one or
 * more paths to other destinations.
 * A search criterion determines whether a found path should be reported to a
 * collector and whether the search should continue with a found path.
 *
 * Since the search might take longer time, it is realized with a queue that
 * is processed one candidate at a time. The user is in control when and how
 * often to continue the search.
 *
 * Note that as long as the travel capability returns new results for any of
 * the found paths, this finder will continue to search. The search criterion
 * only governs whether a specific path is worth continuing.
 * The finder is used best in combination with the OptimizingTravelCapability.
 *
 * The start will also be notified to the criterion and the collector, to enable
 * 'blind' searches that also match the start system.
 *
 * @constructor
 * @param {everoute.travel.Path} start The start for the search.
 * @param {everoute.travel.capabilities.TravelCapability} capability the capability to use for advancing.
 * @param {everoute.travel.search.SearchCriterion} criterion The criterion by which to determine results.
 * @param {everoute.travel.search.PathSearchResultCollector} collector The collector for any found paths.
 * @memberof everoute.travel.search
 */
function PathFinder(start, capability, criterion, collector) {

  var candidates = [];

  function continueWithStart() {
    continueFunction = continueWithCandidate;
    processNewCandidate(start);
    continueFunction();
  }

  var continueFunction = continueWithStart;

  /**
   * Continues the search. This method should be called until it returned false.
   *
   * @return {Boolean} false if the search has completed and no more possibilities exist.
   */
  this.continueSearch = function() {
    continueFunction();

    return candidates.length !== 0;
  };

  function continueWithCandidate() {
    var nextPaths;

    if (candidates.length > 0) {
      nextPaths = capability.getNextPaths(candidates.shift());
      nextPaths.forEach(processNewCandidate);
    }
  }

  function processNewCandidate(path) {
    if (criterion.isDesired(path)) {
      collector.collect(path);
    }
    if (criterion.shouldSearchContinueWith(path, collector.getResults())) {
      candidates.push(path);
    }
  }
}

module.exports = PathFinder;

},{}],34:[function(_dereq_,module,exports){
"use strict";

var PathFinder = _dereq_("./PathFinder");
var PathContest = _dereq_("../PathContest");
var StaticPathContestProvider = _dereq_("../StaticPathContestProvider");
var OptimizingTravelCapability = _dereq_("../capabilities/OptimizingTravelCapability");

/**
 * An agent that provides paths from a certain start. It first searches for
 * possible destinations and then keeps them for later referral.
 *
 * @constructor
 * @private
 * @param {everoute.travel.Path} start The originating path
 * @param {everoute.travel.capabilties.TravelCapability} capability The capability for searches.
 * @param {everoute.travel.rules.TravelRule} rule The rule to determine optimal paths.
 * @param {everoute.travel.search.SearchCriterion} criterion The search criterion
 * @memberof everoute.travel.search
 */
function PathSearchAgent(start, capability, rule, criterion) {
  var self = this;

  this.rule = rule;
  this.queries = [];
  this.shortest = null;
  this.results = {};
  this.resultsAsList = [];

  var contest = new PathContest(rule);
  var finderCapability = new OptimizingTravelCapability(capability, new StaticPathContestProvider(contest));

  this.finder = new PathFinder(start, finderCapability, criterion, {
    collect: function(path) {
      self.onFinderResult(path);
    },
    getResults: function() {
      return self.resultsAsList;
    }
  });
}

/**
 * Runs the agent (performs the search if still pending)
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.run = function() {
  if (this.finder && !this.finder.continueSearch()) {
    delete this.finder;
    this.onFinderCompleted();
  }
};

/**
 * @return {everoute.travel.Path} The shortest path found
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.getShortestPath = function() {
  return this.shortest;
};

/**
 * Returns a random path from the results.
 *
 * @param {everoute.util.Randomizer} rand The randomizer to use for the selection.
 * @return {everoute.trave.Path} A path instance from the results.
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.getRandomPath = function(rand) {
  var keys = [];
  var key;

  for (key in this.results) {
    if (this.results.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  key = keys[rand.getIndex(keys.length)];

  return this.results[key];
};

/**
 * Requests a path to given destination key. Will call given listener, either
 * immediately or when a pending search has completed.
 *
 * @param {everoute.travel.search.PathSearchAgentListener} listener Listener to call when search completed.
 * @param {String} destinationKey The destination key to look out for.
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.request = function(listener, destinationKey) {
  if (this.finder) {
    this.queueQuery(listener, destinationKey);
  } else {
    this.completeQuery(listener, destinationKey);
  }
};

/**
 * Called when the PathFinder found a result.
 *
 * @param {everoute.travel.Path} path The found path.
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.onFinderResult = function(path) {
  var key;

  this.results[path.getDestinationKey()] = path;
  this.resultsAsList = [];
  for (key in this.results) {
    if (this.results.hasOwnProperty(key)) {
      this.resultsAsList.push(this.results[key]);
    }
  }
  if (!this.shortest || this.rule.compare(path.getCostSum(), this.shortest.getCostSum()) < 0) {
    this.shortest = path;
  }
};

/**
 * Called when the PathFinder has completed. Will notify any pending listeners.
 *
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.onFinderCompleted = function() {
  var self = this;

  this.queries.forEach(function(query) {
    self.completeQuery(query.listener, query.destinationKey);
  });
  delete this.queries;
};

/**
 * Queues a pending request for later completion.
 *
 * @param {everoute.travel.search.PathSearchAgentListener} listener Listener to call.
 * @param {String} destinationKey The destination key to look for.
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.queueQuery = function(listener, destinationKey) {
  var query = {
    listener: listener,
    destinationKey: destinationKey
  };

  this.queries.push(query);
};

/**
 * Analyzes the available results and notifies the listener of given query.
 *
 * @param {everoute.travel.search.PathSearchAgentListener} listener Listener to call.
 * @param {String} destinationKey The destination key to look for.
 * @memberof! everoute.travel.search.PathSearchAgent.prototype
 */
PathSearchAgent.prototype.completeQuery = function(listener, destinationKey) {
  if (!this.shortest) {
    listener.searchFailed();
  } else if (!destinationKey || !this.results.hasOwnProperty(destinationKey)) {
    listener.searchCompleted();
  } else {
    listener.pathFound(this.results[destinationKey]);
  }
};

module.exports = PathSearchAgent;

},{"../PathContest":7,"../StaticPathContestProvider":9,"../capabilities/OptimizingTravelCapability":14,"./PathFinder":33}],35:[function(_dereq_,module,exports){
"use strict";

/**
 * A final route.
 *
 * @constructor
 * @param {everoute.travel.Path} startPath The originating path.
 * @param {Array.<{}>} waypoints The waypoints (originating index and path)
 * @param {everoute.travel.Path} [destinationPath] The destination path.
 * @memberof everoute.travel.search
 */
function Route(startPath, waypoints, destinationPath) {
  var costSum = startPath.getCostSum();

  waypoints.forEach(function(entry) {
    costSum = costSum.add(entry.path.getCostSum().getTotal());
  });
  if (destinationPath) {
    costSum = costSum.add(destinationPath.getCostSum().getTotal());
  }

  /**
   * @return {Array.<everoute.travel.Step>} The list of steps of this route
   */
  this.getSteps = function() {
    var result = startPath.getSteps();

    waypoints.forEach(function(entry) {
      result = result.concat(entry.path.getSteps().slice(1));
    });
    if (destinationPath) {
      result = result.concat(destinationPath.getSteps().slice(1));
    }

    return result;
  };

  /**
   * @return {{}} The chromosome that describes this route
   */
  this.getChromosome = function() {
    var result = {
      startPath: startPath,
      waypoints: waypoints.map(function(entry) {
        var info = {
          index: entry.index,
          destinationKey: entry.path.getDestinationKey()
        };

        return info;
      }),
      destinationKey: destinationPath && destinationPath.getDestinationKey()
    };

    return result;
  };

  /**
   * @return {everoute.travel.TravelCostSum} The total cost of this route
   */
  this.getCostSum = function() {
    return costSum;
  };

  /**
   * @return {String} A string presentation
   */
  this.toString = function() {
    var result = "[" + startPath.getDestinationKey() + "]";

    waypoints.forEach(function(entry) {
      result += "-" + entry.index + "[" + entry.path.getDestinationKey() + "]";
    });
    if (destinationPath) {
      result += "-[" + destinationPath.getDestinationKey() + "]";
    }

    return result;
  };
}


module.exports = Route;

},{}],36:[function(_dereq_,module,exports){
"use strict";

/**
 * A splicer to create new route chromosomes.
 *
 * @constructor
 * @private
 * @param {everoute.util.Randomizer} rand A randomizer for creating new things.
 * @memberof everoute.travel.search
 */
function RouteChromosomeSplicer(rand) {
  this.rand = rand;
}

/**
 * Creates a random route chromosome.
 *
 * @param {Array.<everoute.travel.Path>} startPaths Available paths for the start system.
 * @param {Number} waypointCount Amount of waypoints to consider.
 * @return {{}} An initial chromosome with random start and waypoints.
 * @memberof! everoute.travel.search.RouteChromosomeSplicer.prototype
 */
RouteChromosomeSplicer.prototype.createRandom = function(startPaths, waypointCount) {
  var result = {
    startPath: startPaths[this.rand.getIndex(startPaths.length)],
    waypoints: [],
    destinationKey: null
  };
  var waypoint;
  var i;

  for (i = 0; i < waypointCount; i++) {
    result.waypoints.push({
      index: this.findUnusedWaypointIndex(result.waypoints, waypointCount),
      destinationKey: null
    });
  }

  return result;
};

/**
 * Creates an offspring from given parents. The start is taken from parent1, the
 * destination from parent2. waypoints up to crossoverIndex are taken from
 * parent1, the rest from parent2.
 * If parent2's waypoints are already included in the previous list of
 * waypoints, a random index is searched.
 *
 * @param {{}} parent1 first parent chromosome
 * @param {{}} parent2 second parent chromosome
 * @param {Number} crossoverIndex [description]
 * @return {{}} a created chromosome offspring
 * @memberof! everoute.travel.search.RouteChromosomeSplicer.prototype
 */
RouteChromosomeSplicer.prototype.createOffspring = function(parent1, parent2, crossoverIndex) {
  var result = {
    startPath: parent1.startPath,
    waypoints: [],
    destinationKey: parent2.destinationKey
  };
  var temp;
  var index = 0;

  while (index < crossoverIndex) {
    temp = parent1.waypoints[index];
    result.waypoints.push(temp);
    index++;
  }
  while (index < parent2.waypoints.length) {
    temp = parent2.waypoints[index];
    if (this.isWaypointIndexUsed(result.waypoints, temp.index)) {
      result.waypoints.push({
        index: this.findUnusedWaypointIndex(result.waypoints, parent2.waypoints.length),
        destinationKey: null
      });
    } else {
      result.waypoints.push(temp);
    }
    index++;
  }

  return result;
};

/**
 * Finds an index that hasn't been used in the list of given waypoints.
 *
 * @param {{index:Number}} waypoints existing waypoints
 * @param {Number} limit upper limit for index
 * @return {Number} An available index
 * @memberof! everoute.travel.search.RouteChromosomeSplicer.prototype
 */
RouteChromosomeSplicer.prototype.findUnusedWaypointIndex = function(waypoints, limit) {
  var result = this.rand.getIndex(limit);
  var isUnique;

  while (this.isWaypointIndexUsed(waypoints, result)) {
    result = this.rand.getIndex(limit);
  }

  return result;
};

/**
 * Checks whether a waypoint index is used already in a list of waypoints.
 *
 * @param {Array.<{}>} waypoints The waypoints to check.
 * @param {Number} index The index to check.
 * @return {Boolean} True if the given index has already been used.
 * @memberof! everoute.travel.search.RouteChromosomeSplicer.prototype
 */
RouteChromosomeSplicer.prototype.isWaypointIndexUsed = function(waypoints, index) {
  var result = false;
  var amount = waypoints.length;
  var i;

  for (i = 0; !result && (i < amount); i++) {
    if (waypoints[i].index === index) {
      result = true;
    }
  }

  return result;
};

module.exports = RouteChromosomeSplicer;

},{}],37:[function(_dereq_,module,exports){
"use strict";

var RouteChromosomeSplicer = _dereq_("./RouteChromosomeSplicer");
var RouteIncubator = _dereq_("./RouteIncubator");
var RouteList = _dereq_("./RouteList");

/**
 * A finder of a route, consisting of a start path, a list of waypoints and an
 * optional destination. The order of the waypoints will be optimized during
 * the search.
 *
 * @constructor
 * @param {everoute.travel.search.RouteFinderBuilder} builder the builder with all parameters
 * @memberof everoute.travel.search
 */
function RouteFinder(builder) {
  var self = this;

  function onRouteFound(route) {
    self.onRouteFound(route);
  }

  this.rand = builder.getRandomizer();
  this.rule = builder.getRule();

  this.splicer = new RouteChromosomeSplicer(this.rand);
  this.population = new RouteList(this.rule);
  this.incubator = new RouteIncubator(onRouteFound, builder.getCapability(), this.rule,
    builder.getWaypoints(), builder.getDestination(), this.rand);

  this.startPaths = builder.getStartPaths().slice(0);
  this.waypoints = builder.getWaypoints().slice(0);
  this.collector = builder.getCollector();

  this.populationLimit = builder.getPopulationLimit();
  this.generationLimit = builder.getGenerationLimit();
  this.mutationPercentage = builder.getMutationPercentage();
  this.uncontestedLimit = this.generationLimit / 4;

  this.generationCount = 0;
  this.uncontestedCount = 0;

  this.bestRoute = null;
}

/**
 * Continues the search. This method should be called until it returned false.
 *
 * @return {Boolean} false if the search is completed
 * @memberof! everoute.travel.search.RouteFinder.prototype
 */
RouteFinder.prototype.continueSearch = function() {
  var result = false;

  if ((this.generationCount < this.generationLimit) && (this.uncontestedCount < this.uncontestedLimit)) {
    result = true;
    if (!this.incubator.continueGrowth()) {
      this.generationCount++;
      this.uncontestedCount++;

      this.ensurePopulationSize();
      this.createOffsprings();
    }
  }

  return result;
};

/**
 * Called when a route was found.
 *
 * @private
 * @param {everoute.travel.search.Route} route The found route
 * @memberof! everoute.travel.search.RouteFinder.prototype
 */
RouteFinder.prototype.onRouteFound = function(route) {
  var isBest = this.population.add(route);

  if (isBest) {
    this.uncontestedCount = 0;
    this.collector.collect(route);
  }
};

/**
 * Ensures a properly sized population.
 *
 * @private
 * @memberof! everoute.travel.search.RouteFinder.prototype
 */
RouteFinder.prototype.ensurePopulationSize = function() {
  var missing;

  this.population.limit(this.populationLimit);

  missing = this.populationLimit - this.population.getSize();
  while (missing > 0) {
    this.incubator.request(this.createRandomChromosome());
    missing--;
  }
};

/**
 * @private
 * @return {{}} A new, random chromosome
 * @memberof! everoute.travel.search.RouteFinder.prototype
 */
RouteFinder.prototype.createRandomChromosome = function() {
  return this.splicer.createRandom(this.startPaths, this.waypoints.length);
};

/**
 * Creates offsprings from the current population.
 *
 * @private
 * @memberof! everoute.travel.search.RouteFinder.prototype
 */
RouteFinder.prototype.createOffsprings = function() {
  var size = this.population.getSize();
  var crossoverIndex = this.rand.getIndex(this.waypoints.length + 1);
  var shouldMutate = this.rand.getIndex(100) < this.mutationPercentage;
  var parent1;
  var parent2;

  if (size >= 2) {
    parent1 = this.population.get(this.rand.getIndex(size)).getChromosome();
    parent2 = this.population.get(this.rand.getIndex(size)).getChromosome();

    if (shouldMutate) {
      this.createMutatedOffsprings(parent1, parent2, crossoverIndex);
    } else {
      this.incubator.request(this.splicer.createOffspring(parent1, parent2, crossoverIndex));
      this.incubator.request(this.splicer.createOffspring(parent2, parent1, crossoverIndex));
    }
  }
};

/**
 * Creates mutated offsprings using given parameters. The parents are spliced with
 * a new, random chromosome at the given crossover index.
 *
 * @private
 * @param {{}} parent1 The first chromosome
 * @param {{}} parent2 The second chromosome
 * @param {Number} crossoverIndex The waypoint index at which to splice
 * @memberof! everoute.travel.search.RouteFinder.prototype
 */
RouteFinder.prototype.createMutatedOffsprings = function(parent1, parent2, crossoverIndex) {
  var randomChromosome = this.createRandomChromosome();

  this.incubator.request(this.splicer.createOffspring(parent1, randomChromosome, crossoverIndex));
  this.incubator.request(this.splicer.createOffspring(randomChromosome, parent1, crossoverIndex));
  this.incubator.request(this.splicer.createOffspring(parent2, randomChromosome, crossoverIndex));
  this.incubator.request(this.splicer.createOffspring(randomChromosome, parent2, crossoverIndex));
};

module.exports = RouteFinder;

},{"./RouteChromosomeSplicer":36,"./RouteIncubator":39,"./RouteList":41}],38:[function(_dereq_,module,exports){
"use strict";

var DefaultRandomizer = _dereq_("../../util/DefaultRandomizer");
var RouteFinder = _dereq_("./RouteFinder");

/**
 * A builder for a route finder.
 *
 * @constructor
 * @param {everoute.travel.capabilities.TravelCapability} capability The capability for travel.
 * @param {everoute.travel.rules.TravelRule} rule The rule for searches.
 * @param {Array.<everoute.travel.Path>} startPaths An array of possible start paths.
 * @param {everoute.travel.search.PathSearchResultCollector} collector The collector for results.
 * @memberof everoute.travel.search
 */
function RouteFinderBuilder(capability, rule, startPaths, collector) {

  var waypoints = [];
  var destination = null;
  var randomizer = null;

  var populationLimit = 25;
  var generationLimit = 40000;
  var mutationPercentage = 10;


  this.getCapability = function() {
    return capability;
  };

  this.getRule = function() {
    return rule;
  };

  this.getStartPaths = function() {
    return startPaths;
  };

  /**
   * Sets the criteria for the waypoints. Each waypoint has one criterion.
   *
   * @param {Array.<everoute.travel.search.SearchCriterion>} criteria The criteria for the waypoints.
   */
  this.setWaypoints = function(criteria) {
    waypoints = criteria;
  };

  this.getWaypoints = function() {
    return waypoints;
  };

  /**
   * Sets the destination criterion. If none specified, no fixed destination is
   * used.
   *
   * @param {everoute.travel.search.SearchCriterion} criterion The criterion for the destination.
   */
  this.setDestination = function(criterion) {
    destination = criterion;
  };

  this.getDestination = function() {
    return destination;
  };

  this.getCollector = function() {
    return collector;
  };

  this.getRandomizer = function() {
    return randomizer || new DefaultRandomizer();
  };

  this.getPopulationLimit = function() {
    return populationLimit;
  };

  this.getGenerationLimit = function() {
    return generationLimit;
  };

  this.getMutationPercentage = function() {
    return mutationPercentage;
  };

  /**
   * @return {everoute.travel.search.RouteFinder} The resulting route finder
   */
  this.build = function() {
    return new RouteFinder(this);
  };
}

module.exports = RouteFinderBuilder;

},{"../../util/DefaultRandomizer":53,"./RouteFinder":37}],39:[function(_dereq_,module,exports){
/* jshint maxparams:6 */
"use strict";

var Path = _dereq_("../Path");
var PathFinder = _dereq_("./PathFinder");
var RouteIncubatorCulture = _dereq_("./RouteIncubatorCulture");
var PathSearchAgent = _dereq_("./PathSearchAgent");

/**
 * This incubator receives route chromosomes to create the corresponding routes.
 *
 * @constructor
 * @private
 * @param {Function} callback the function that receives new Route instances
 * @param {everoute.travel.capabilities.TravelCapability} capability The travelling capability for searches
 * @param {everoute.travel.rules.TravelRule} rule The rule for searching shortest paths
 * @param {Array.<everoute.travel.search.SearchCriterion>} waypoints The criteria for the waypoints
 * @param {everoute.travel.search.SearchCriterion} [destination] The criterion for the optional destination
 * @param {everoute.util.Randomizer} rand The randomizer for selecting unspecified destinations
 * @memberof everoute.travel.search
 */
function RouteIncubator(callback, capability, rule, waypoints, destination, rand) {
  this.callback = callback;
  this.capability = capability;
  this.rule = rule;
  this.waypoints = waypoints;
  this.destination = destination;
  this.rand = rand;

  this.agents = [];
  this.waypointsAgentsBySource = waypoints.map(function(entry) {
    return {};
  });
  this.destinationAgentsBySource = {};

  this.cultures = [];
}

/**
 * Continues any pending searches to finish routes.
 *
 * @return {Boolean} false if there is nothing to grow currently.
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.continueGrowth = function() {
  var result = true;

  this.agents.forEach(function(agent) {
    agent.run();
  });
  if (this.cultures.length === 0) {
    this.agents = [];
    result = false;
  }

  return result;
};

/**
 * Requests a route to be incubated according to given chromosome
 * @param {{}} chromosome The chromosome as route description
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.request = function(chromosome) {
  var culture = new RouteIncubatorCulture(chromosome);

  this.cultures.push(culture);
  this.continueCulture(culture, 0, chromosome.startPath);
};

/**
 * Continues processing a culture; Will cause the callback to be called if a
 * complete route could be created.
 *
 * @param {everoute.travel.search.RouteIncubatorCulture} culture The culture to process.
 * @param {Number} finishedWaypoints how many waypoints have been calculated.
 * @param {everoute.travel.Path} lastPath the previous path.
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.continueCulture = function(culture, finishedWaypoints, lastPath) {
  var startPath = new Path(lastPath.getStep().asFirstStep());
  var chromosome = culture.getChromosome();
  var self = this;
  var nextWaypoint;
  var agent;

  function onSearchFailed() {
    self.onCultureFailed(culture);
  }

  if (finishedWaypoints < this.waypoints.length) {
    nextWaypoint = chromosome.waypoints[finishedWaypoints].index;
    agent = this.getPathSearchAgent(this.waypointsAgentsBySource[nextWaypoint], startPath, this.waypoints[nextWaypoint]);
    agent.request({
      searchFailed: onSearchFailed,
      searchCompleted: function() {
        var path = agent.getRandomPath(self.rand);

        culture.addWaypointPath(nextWaypoint, path);
        self.continueCulture(culture, finishedWaypoints + 1, path);
      },
      pathFound: function(path) {
        culture.addWaypointPath(nextWaypoint, path);
        self.continueCulture(culture, finishedWaypoints + 1, path);
      }
    }, chromosome.waypoints[nextWaypoint].destinationKey);
  } else if (this.destination) {
    agent = this.getPathSearchAgent(this.destinationAgentsBySource, startPath, this.destination);
    agent.request({
      searchFailed: onSearchFailed,
      searchCompleted: function() {
        culture.setDestinationPath(agent.getShortestPath());
        self.onCultureCompleted(culture);
      },
      pathFound: function(path) {
        culture.setDestinationPath(path);
        self.onCultureCompleted(culture);
      }
    }, chromosome.destinationKey);
  } else {
    this.onCultureCompleted(culture);
  }
};

/**
 * Returns an agent that is assigned to given start path in the specified
 * container. It will create a new agent if missing.
 *
 * @param {Object.<String, everoute.travel.search.PathSearchAgent>} agentsByKey Map of agenst by start key.
 * @param {everoute.travel.Path} startPath The path acting as the origin for the agent
 * @param {everoute.travel.search.SearchCriterion} criterion The criterion to use for a new finder.
 * @return {everoute.travel.search.PathSearchAgent} The resulting agent
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.getPathSearchAgent = function(agentsByKey, startPath, criterion) {
  var startKey = startPath.getDestinationKey();
  var agent = agentsByKey[startKey];

  if (!agent) {
    agent = new PathSearchAgent(startPath, this.capability, this.rule, criterion);
    agentsByKey[startKey] = agent;
    this.agents.push(agent);
  }

  return agent;
};

/**
 * Called when a culture was completed and a route can be reported.
 *
 * @param {everoute.travel.search.RouteIncubatorCulture} culture The completed culture
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.onCultureCompleted = function(culture) {
  this.dropCulture(culture);
  this.callback(culture.toRoute());
};

/**
 * Called when a culture failed to be completed. It will simply be dropped.
 *
 * @param {everoute.travel.search.RouteIncubatorCulture} culture The failed culture
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.onCultureFailed = function(culture) {
  this.dropCulture(culture);
};

/**
 * Removes given culture from the incubator.
 *
 * @param {everoute.travel.search.RouteIncubatorCulture} culture The culture that shall be removed.
 * @memberof! everoute.travel.search.RouteIncubator.prototype
 */
RouteIncubator.prototype.dropCulture = function(culture) {
  var index = this.cultures.indexOf(culture);

  this.cultures.splice(index, 1);
};

module.exports = RouteIncubator;

},{"../Path":6,"./PathFinder":33,"./PathSearchAgent":34,"./RouteIncubatorCulture":40}],40:[function(_dereq_,module,exports){
"use strict";

var Route = _dereq_("./Route");

/**
 * A route culture, which is grown into a complete route.
 *
 * @constructor
 * @private
 * @param {{}} chromosome The chromosome describing the culture.
 * @memberof everoute.travel.search
 */
function RouteIncubatorCulture(chromosome) {
  this.chromosome = chromosome;
  this.waypoints = [];
  this.destinationPath = null;
}

/**
 * @return {{}} The chromosome of this culture
 *
 * @memberof! everoute.travel.search.RouteIncubatorCulture.prototype
 */
RouteIncubatorCulture.prototype.getChromosome = function() {
  return this.chromosome;
};

/**
 * Adds given path as a waypoint
 * @param {Number} index The index of the originating waypoint.
 * @param {everoute.travel.Path} path the found path.
 * @memberof! everoute.travel.search.RouteIncubatorCulture.prototype
 */
RouteIncubatorCulture.prototype.addWaypointPath = function(index, path) {
  var entry = {
    index: index,
    path: path
  };

  this.waypoints.push(entry);
};

/**
 * @param {everoute.travel.Path} path The destination path.
 * @memberof! everoute.travel.search.RouteIncubatorCulture.prototype
 */
RouteIncubatorCulture.prototype.setDestinationPath = function(path) {
  this.destinationPath = path;
};

/**
 * @return {everoute.travel.Route} The final route instance.
 * @memberof! everoute.travel.search.RouteIncubatorCulture.prototype
 */
RouteIncubatorCulture.prototype.toRoute = function() {
  return new Route(this.chromosome.startPath, this.waypoints, this.destinationPath);
};

module.exports = RouteIncubatorCulture;

},{"./Route":35}],41:[function(_dereq_,module,exports){
"use strict";

/**
 * An ordered list of routes. The order is determined by a travel rule that
 * compares the total cost of a route.
 *
 * @constructor
 * @private
 * @param {everoute.travel.rules.TravelRule} rule The rule to determine optimal routes.
 * @memberof everoute.travel.search
 */
function RouteList(rule) {

  this.rule = rule;
  this.routes = [];
}

/**
 * @return {Number} Size of the list
 * @memberof! everoute.travel.search.RouteList.prototype
 */
RouteList.prototype.getSize = function() {
  return this.routes.length;
};

/**
 * @param {Number} index The index to retrieve.
 * @return {everoute.travel.search.Route} The route at given position.
 * @memberof! everoute.travel.search.RouteList.prototype
 */
RouteList.prototype.get = function(index) {
  return this.routes[index];
};

/**
 * Adds given route to the list. The given route is inserted at its sorted
 * position.
 *
 * @param {everoute.travel.search.Route} route The route that shall be added.
 * @return {Boolean} true if the new route was inserted at the first position.
 * @memberof! everoute.travel.search.RouteList.prototype
 */
RouteList.prototype.add = function(route) {
  var size = this.getSize();
  var costSum = route.getCostSum();
  var position = size - 1;
  var isBetter = true;

  // This loop assumes that the new route will most likely be worse than
  // the rest, so it starts at the end.
  while (isBetter && (position >= 0)) {
    isBetter = this.rule.compare(costSum, this.routes[position].getCostSum()) < 0;
    if (isBetter) {
      position--;
    }
  }

  this.routes.splice(position + 1, 0, route);

  return position === -1;
};

/**
 * Limits the list to the given amount.
 *
 * @param {Number} limit The size limit. Routes beyond this limit will be dropped.
 * @memberof! everoute.travel.search.RouteList.prototype
 */
RouteList.prototype.limit = function(limit) {
  var size = this.getSize();

  if (size > limit) {
    this.routes.splice(limit, size - limit);
  }
};

module.exports = RouteList;

},{}],42:[function(_dereq_,module,exports){
"use strict";

/**
 * A search criterion that aborts searches if they run across a specified
 * solar system.
 *
 * @constructor
 * @implements everoute.travel.search.SearchCriterion
 * @extends everoute.travel.search.SearchCriterion
 * @param {Array.<Integer>} ignored the list of ignored solar systems
 * @memberof everoute.travel.search
 */
function SystemAvoidingSearchCriterion(ignored) {

  var ignoredIds = ignored.slice(0);

  this.isDesired = function(path) {
    return true;
  };

  this.shouldSearchContinueWith = function(path, results) {
    return path.isStart() || (ignoredIds.indexOf(path.getStep().getSolarSystemId()) < 0);
  };
}

module.exports = SystemAvoidingSearchCriterion;

},{}],43:[function(_dereq_,module,exports){
/**
 * This namespace contains logic for searching paths.
 *
 * @namespace search
 * @memberof everoute.travel
 */
module.exports = {
  CombiningSearchCriterion: _dereq_("./CombiningSearchCriterion"),
  CostAwareSearchCriterion: _dereq_("./CostAwareSearchCriterion"),
  DestinationSystemSearchCriterion: _dereq_("./DestinationSystemSearchCriterion"),
  SystemAvoidingSearchCriterion: _dereq_("./SystemAvoidingSearchCriterion"),
  PathFinder: _dereq_("./PathFinder"),

  Route: _dereq_("./Route"),
  RouteChromosomeSplicer: _dereq_("./RouteChromosomeSplicer"),
  RouteIncubator: _dereq_("./RouteIncubator"),
  RouteFinderBuilder: _dereq_("./RouteFinderBuilder")
};

},{"./CombiningSearchCriterion":30,"./CostAwareSearchCriterion":31,"./DestinationSystemSearchCriterion":32,"./PathFinder":33,"./Route":35,"./RouteChromosomeSplicer":36,"./RouteFinderBuilder":38,"./RouteIncubator":39,"./SystemAvoidingSearchCriterion":42}],44:[function(_dereq_,module,exports){
"use strict";

var Path = _dereq_("../travel/Path");
var StepBuilder = _dereq_("../travel/StepBuilder");

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
    this.security = parseFloat((Math.floor((trueSecurity + 0.05) * 10) / 10.0).toFixed(1));
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

EmptySolarSystem.prototype.startPath = function() {
  return new Path(new StepBuilder(this.id).build());
};

module.exports = EmptySolarSystem;

},{"../travel/Path":6,"../travel/StepBuilder":11}],45:[function(_dereq_,module,exports){
"use strict";

var UniverseBuilder = _dereq_("./UniverseBuilder");

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

},{"./UniverseBuilder":50}],46:[function(_dereq_,module,exports){
"use strict";

var StepBuilder = _dereq_("../travel/StepBuilder");

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

  this.startPath = function() {
    return base.startPath();
  };
}

module.exports = ExtendedSolarSystem;

},{"../travel/StepBuilder":11}],47:[function(_dereq_,module,exports){
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
  var UniverseBuilder = _dereq_("./UniverseBuilder");

  return new UniverseBuilder(this);
};

module.exports = ExtendedUniverse;

},{"./UniverseBuilder":50}],48:[function(_dereq_,module,exports){
"use strict";

var JumpBuilder = _dereq_("../travel/JumpBuilder");

/**
 * An extension helper for solar systems.
 *
 * @class
 * @constructor
 * @param {everoute.universe.SolarSystemExtensionData} data the extension data.
 * @memberof everoute.universe
 */
function SolarSystemExtension(data) {

  /**
   * @return {Number} The unique ID for the solar system.
   */
  this.getId = function() {
    return data.base.getId();
  };

  /**
   * @return {Number} The galaxy ID of the solar system
   */
  this.getGalaxyId = function() {
    return data.base.getGalaxyId();
  };

  /**
   * @return {everoute.travel.Location} The location of the solar system in the universe.
   */
  this.getLocation = function() {
    return data.base.getLocation();
  };

  /**
   * @return {Number} The security value of the solar system.
   */
  this.getSecurityValue = function() {
    return data.base.getSecurityValue();
  };

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

},{"../travel/JumpBuilder":5}],49:[function(_dereq_,module,exports){
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

},{}],50:[function(_dereq_,module,exports){
"use strict";

var EmptySolarSystem = _dereq_("./EmptySolarSystem");
var ExtendedSolarSystem = _dereq_("./ExtendedSolarSystem");
var ExtendedUniverse = _dereq_("./ExtendedUniverse");
var UniverseExtensionData = _dereq_("./UniverseExtensionData");
var SolarSystemExtension = _dereq_("./SolarSystemExtension");
var SolarSystemExtensionData = _dereq_("./SolarSystemExtensionData");

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
   * @return {Array.<Number>} All IDs from the base universe and the extension so far.
   */
  this.getSolarSystemIds = function() {
    var result = base.getSolarSystemIds();
    var key;
    var addId = function(id) {
      var index = result.indexOf(id);

      if (index < 0) {
        result.push(id);
      }
    };

    for (key in solarSystemExtensionData) {
      if (solarSystemExtensionData.hasOwnProperty(key)) {
        addId(solarSystemExtensionData[key].base.getId());
      }
    }

    return result.sort();
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

},{"./EmptySolarSystem":44,"./ExtendedSolarSystem":46,"./ExtendedUniverse":47,"./SolarSystemExtension":48,"./SolarSystemExtensionData":49,"./UniverseExtensionData":51}],51:[function(_dereq_,module,exports){
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

},{}],52:[function(_dereq_,module,exports){
/**
 * This namespace contains objects regarding the respresentation of things
 * in the universe.
 *
 * @namespace universe
 * @memberof everoute
 */

module.exports = {
  EmptySolarSystem: _dereq_("./EmptySolarSystem"),
  EmptyUniverse: _dereq_("./EmptyUniverse"),
  ExtendedSolarSystem: _dereq_("./ExtendedSolarSystem"),
  ExtendedUniverse: _dereq_("./ExtendedUniverse"),
  UniverseBuilder: _dereq_("./UniverseBuilder"),
  UniverseExtensionData: _dereq_("./UniverseExtensionData"),
  SolarSystemExtension: _dereq_("./SolarSystemExtension"),
  SolarSystemExtensionData: _dereq_("./SolarSystemExtensionData")
};

},{"./EmptySolarSystem":44,"./EmptyUniverse":45,"./ExtendedSolarSystem":46,"./ExtendedUniverse":47,"./SolarSystemExtension":48,"./SolarSystemExtensionData":49,"./UniverseBuilder":50,"./UniverseExtensionData":51}],53:[function(_dereq_,module,exports){
"use strict";

/**
 * This randomizer uses Math.rand()
 *
 * @constructor
 * @implements everoute.util.Randomizer
 * @extends everoute.util.Randomizer
 * @memberof everoute.util
 */
function DefaultRandomizer() {

}

DefaultRandomizer.prototype.getIndex = function(limit) {
  var result = Math.floor(Math.random() * limit);

  /*
   * As per documentation on https://developer.mozilla.org , there is a rare
   * case where Math.random() returns 1.0 .
   */
  if ((result >= limit) && (limit > 0)) {
    result = limit - 1;
  }

  return result;
};

module.exports = DefaultRandomizer;

},{}],54:[function(_dereq_,module,exports){
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

var METERS_PER_AU = 149597870700;

var constants = {
  GALAXY_ID_NEW_EDEN: 9,
  GALAXY_ID_W_SPACE: 9000001,
  METERS_PER_AU: METERS_PER_AU,
  METERS_PER_LY: METERS_PER_AU * 63241
};

module.exports = {
  DefaultRandomizer: _dereq_("./DefaultRandomizer"),

  constants: constants,

  noop: noop
};

},{"./DefaultRandomizer":53}]},{},[1])
(1)
});