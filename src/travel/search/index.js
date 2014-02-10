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
  SystemAvoidingSearchCriterion: require("./SystemAvoidingSearchCriterion"),
  PathFinder: require("./PathFinder"),

  Route: require("./Route"),
  RouteChromosomeSplicer: require("./RouteChromosomeSplicer"),
  RouteIncubator: require("./RouteIncubator"),
  RouteFinderBuilder: require("./RouteFinderBuilder")
};
