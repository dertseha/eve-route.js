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
  return new universe.UniverseBuilder(new universe.EmptyUniverse());
};

module.exports = {
  travel: require("./travel"),
  universe: universe,
  util: require("./util"),

  newUniverseBuilder: newUniverseBuilder
};

},{"./travel":18,"./universe":39,"./util":41}],2:[function(require,module,exports){
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

},{"./TravelCostSum":12}],7:[function(require,module,exports){
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
}

/**
 * @return {String} A key that identifies this destination location
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getKey = function() {
  return this.solarSystemId.toString();
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

},{}],11:[function(require,module,exports){
"use strict";

var AnyLocation = require("./AnyLocation");
var Step = require("./Step");

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

},{"./AnyLocation":3,"./Step":10}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
/**
 * This namespace contains everything about travel capabilities.
 *
 * @namespace capabilities
 * @memberof everoute.travel
 */
module.exports = {
  jumpGate: require("./jumpGate"),

  CombiningTravelCapability: require("./CombiningTravelCapability"),
  OptimizingTravelCapability: require("./OptimizingTravelCapability")
};

},{"./CombiningTravelCapability":13,"./OptimizingTravelCapability":14,"./jumpGate":17}],16:[function(require,module,exports){
"use strict";

var StepBuilder = require("../../StepBuilder");

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

},{"../../StepBuilder":11}],17:[function(require,module,exports){
"use strict";

var JumpGateTravelCapability = require("./JumpGateTravelCapability");

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

},{"./JumpGateTravelCapability":16}],18:[function(require,module,exports){
/**
 * This namespace contains entries regarding travel.
 *
 * @namespace travel
 * @memberof everoute
 */
module.exports = {
  capabilities: require("./capabilities"),
  rules: require("./rules"),
  search: require("./search"),

  AddingTravelCost: require("./AddingTravelCost"),
  AnyLocation: require("./AnyLocation"),
  Jump: require("./Jump"),
  JumpBuilder: require("./JumpBuilder"),
  Path: require("./Path"),
  PathContest: require("./PathContest"),
  SpecificLocation: require("./SpecificLocation"),
  StaticPathContestProvider: require("./StaticPathContestProvider"),
  Step: require("./Step"),
  StepBuilder: require("./StepBuilder"),
  TravelCostSum: require("./TravelCostSum")
};

},{"./AddingTravelCost":2,"./AnyLocation":3,"./Jump":4,"./JumpBuilder":5,"./Path":6,"./PathContest":7,"./SpecificLocation":8,"./StaticPathContestProvider":9,"./Step":10,"./StepBuilder":11,"./TravelCostSum":12,"./capabilities":15,"./rules":21,"./search":30}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
/**
 * This namespace contains rules for travelling.
 *
 * @namespace rules
 * @memberof everoute.travel
 */
module.exports = {
  security: require("./security"),
  transitCount: require("./transitCount"),

  NaturalOrderTravelRule: require("./NaturalOrderTravelRule"),
  TravelRuleset: require("./TravelRuleset")
};

},{"./NaturalOrderTravelRule":19,"./TravelRuleset":20,"./security":24,"./transitCount":26}],22:[function(require,module,exports){
"use strict";

var statics = require("./statics");

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

  this.compare = function(sumA, sumB) {
    var valueA = statics.sumSecurityCosts(sumA, limit, 1.0);
    var valueB = statics.sumSecurityCosts(sumB, limit, 1.0);

    return valueA - valueB;
  };
}

module.exports = MaxSecurityTravelRule;

},{"./statics":25}],23:[function(require,module,exports){
"use strict";

var statics = require("./statics");

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

  this.compare = function(sumA, sumB) {
    var valueA = statics.sumSecurityCosts(sumA, 0.0, limit - 0.1);
    var valueB = statics.sumSecurityCosts(sumB, 0.0, limit - 0.1);

    return valueA - valueB;
  };
}

module.exports = MinSecurityTravelRule;

},{"./statics":25}],24:[function(require,module,exports){
"use strict";

var statics = require("./statics");
var MaxSecurityTravelRule = require("./MaxSecurityTravelRule");
var MinSecurityTravelRule = require("./MinSecurityTravelRule");

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

},{"./MaxSecurityTravelRule":22,"./MinSecurityTravelRule":23,"./statics":25}],25:[function(require,module,exports){
"use strict";

var AddingTravelCost = require("../../AddingTravelCost");

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

  for (security = 0.0; security <= 1.0; security += 0.1) {
    cost = getTravelCost(security, 0);
    nullCosts[cost.getType()] = cost;
  }
})();

/**
 * Returns the sum of all security costs between the two given security limits.
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

  for (security = from; security <= to; security += 0.1) {
    nullCost = nullCosts[getTravelCostType(security)];
    result += costSum.getCost(nullCost).getValue();
  }

  return result;
};

module.exports = {
  getTravelCost: getTravelCost,
  getTravelCostType: getTravelCostType,

  sumSecurityCosts: sumSecurityCosts
};

},{"../../AddingTravelCost":2}],26:[function(require,module,exports){
"use strict";

var AddingTravelCost = require("../../AddingTravelCost");
var NaturalOrderTravelRule = require("../NaturalOrderTravelRule");

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

},{"../../AddingTravelCost":2,"../NaturalOrderTravelRule":19}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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
 * @param {everoute.travel.search.SearchResultCollector} collector The collector for any found paths.
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
      nextPaths = capability.getNextPaths(candidates.pop());
      nextPaths.forEach(processNewCandidate);
    }
  }

  function processNewCandidate(path) {
    if (criterion.isDesired(path)) {
      collector.collect(path);
    }
    if (criterion.shouldSearchContinueWith(path)) {
      candidates.push(path);
    }
  }
}

module.exports = PathFinder;

},{}],29:[function(require,module,exports){
"use strict";

/**
 * A splicer to create new route chromosomes.
 *
 * @param {everoute.util.Randomizer} rand A randomizer for creating new things.
 * @memberof everoute.travel.search
 */
function RouteChromosomeSplicer(rand) {
  this.rand = rand;
}

/**
 * Creates a random route chromosome.
 *
 * @param {Array.<Number>} startIds Available IDs for the start system.
 * @param {Number} waypointCount Amount of waypoints to consider.
 * @return {{}} An initial chromosome with random start and waypoints.
 */
RouteChromosomeSplicer.prototype.createRandom = function(startIds, waypointCount) {
  var result = {
    startSystemId: startIds[this.rand.getIndex(startIds.length)],
    waypoints: [],
    destination: null
  };
  var waypoint;
  var i;

  for (i = 0; i < waypointCount; i++) {
    result.waypoints.push({
      index: this.findUnusedWaypointIndex(result.waypoints, waypointCount),
      path: null
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
 */
RouteChromosomeSplicer.prototype.createOffspring = function(parent1, parent2, crossoverIndex) {
  var result = {
    startSystemId: parent1.startSystemId,
    waypoints: [],
    destination: parent2.destination
  };
  var temp;
  var index = 0;

  while ((index < crossoverIndex) && (index < parent1.waypoints.length)) {
    temp = parent1.waypoints[index];
    result.waypoints.push(temp);
    index++;
  }
  while (index < parent2.waypoints.length) {
    temp = parent2.waypoints[index];
    if (this.isWaypointIndexUsed(result.waypoints, temp.index)) {
      result.waypoints.push({
        index: this.findUnusedWaypointIndex(result.waypoints, parent2.waypoints.length),
        path: null
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
 */
RouteChromosomeSplicer.prototype.isWaypointIndexUsed = function(waypoints, index) {
  var result = false;

  function check(entry) {
    if (entry.index === index) {
      result = true;
    }
  }

  waypoints.forEach(check);

  return result;
};

module.exports = RouteChromosomeSplicer;

},{}],30:[function(require,module,exports){
/**
 * This namespace contains logic for searching paths.
 *
 * @namespace search
 * @memberof everoute.travel
 */
module.exports = {
  DestinationSystemSearchCriterion: require("./DestinationSystemSearchCriterion"),
  PathFinder: require("./PathFinder"),

  RouteChromosomeSplicer: require("./RouteChromosomeSplicer")
};

},{"./DestinationSystemSearchCriterion":27,"./PathFinder":28,"./RouteChromosomeSplicer":29}],31:[function(require,module,exports){
"use strict";

var Path = require("../travel/Path");
var StepBuilder = require("../travel/StepBuilder");

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

},{"../travel/Path":6,"../travel/StepBuilder":11}],32:[function(require,module,exports){
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

},{"./UniverseBuilder":37}],33:[function(require,module,exports){
"use strict";

var StepBuilder = require("../travel/StepBuilder");

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

},{"../travel/StepBuilder":11}],34:[function(require,module,exports){
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

},{"./UniverseBuilder":37}],35:[function(require,module,exports){
"use strict";

var JumpBuilder = require("../travel/JumpBuilder");

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

},{"../travel/JumpBuilder":5}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{"./EmptySolarSystem":31,"./ExtendedSolarSystem":33,"./ExtendedUniverse":34,"./SolarSystemExtension":35,"./SolarSystemExtensionData":36,"./UniverseExtensionData":38}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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

},{"./EmptySolarSystem":31,"./EmptyUniverse":32,"./ExtendedSolarSystem":33,"./ExtendedUniverse":34,"./SolarSystemExtension":35,"./SolarSystemExtensionData":36,"./UniverseBuilder":37,"./UniverseExtensionData":38}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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
  DefaultRandomizer: require("./DefaultRandomizer"),

  noop: noop
};

},{"./DefaultRandomizer":40}]},{},[1])
(1)
});
;