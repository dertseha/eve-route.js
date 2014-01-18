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
