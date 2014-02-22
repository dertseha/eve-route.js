/**
 * This namespace contains rules for travelling.
 *
 * @namespace rules
 * @memberof everoute.travel
 */
module.exports = {
  jumpDistance: require("./jumpDistance"),
  security: require("./security"),
  transitCount: require("./transitCount"),

  NaturalOrderTravelRule: require("./NaturalOrderTravelRule"),
  TravelRuleset: require("./TravelRuleset")
};
