/**
 * This namespace contains rules for travelling.
 *
 * @namespace rules
 * @memberof everoute.travel
 */
module.exports = {
  transitCount: require("./transitCount"),

  NaturalOrderTravelRule: require("./NaturalOrderTravelRule"),
  TravelRuleset: require("./TravelRuleset")
};
