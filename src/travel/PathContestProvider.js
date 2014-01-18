"use strict";

/**
 * A provider for path contests.
 *
 * @class
 * @interface
 * @memberof everoute.travel
 */
function PathContestProvider() {

}

/**
 * @return {everoute.travel.PathContest} A contest instance.
 * @memberof! everoute.travel.PathContestProvider.prototype
 */
PathContestProvider.prototype.getContest = function() {
  throw new Error("Interface Implementation");
};
