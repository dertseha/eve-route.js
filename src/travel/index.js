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
  TravelCostSum: require("./TravelCostSum")
};
