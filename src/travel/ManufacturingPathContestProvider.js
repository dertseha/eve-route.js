"use strict";

var PathContest = require("./PathContest");

/**
 * A provider that creates new instances of path contests.
 *
 * @constructor
 * @implements {everoute.travel.PathContestProvider}
 * @extends {everoute.travel.PathContestProvider}
 * @param {everoute.travel.rules.TravelRule} rule the rule for new contests.
 * @memberof everoute.travel
 */
function ManufacturingPathContestProvider(rule) {

  this.getContest = function() {
    return new PathContest(rule);
  };
}

module.exports = ManufacturingPathContestProvider;
