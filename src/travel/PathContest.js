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
