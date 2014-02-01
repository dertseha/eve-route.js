/**
 * This namespace contains logic for searching paths.
 *
 * @namespace search
 * @memberof everoute.travel
 */
module.exports = {
  CombiningSearchCriterion: require("./CombiningSearchCriterion"),
  CostAwareSearchCriterion: require("./CostAwareSearchCriterion"),
  DestinationSystemSearchCriterion: require("./DestinationSystemSearchCriterion"),
  PathFinder: require("./PathFinder"),

  Route: require("./Route"),
  RouteChromosomeSplicer: require("./RouteChromosomeSplicer"),
  RouteIncubator: require("./RouteIncubator"),
  RouteFinderBuilder: require("./RouteFinderBuilder")
};
