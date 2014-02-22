/**
 * This namespace contains everything about travel capabilities.
 *
 * @namespace capabilities
 * @memberof everoute.travel
 */
module.exports = {
  jumpDrive: require("./jumpDrive"),
  jumpGate: require("./jumpGate"),

  CombiningTravelCapability: require("./CombiningTravelCapability"),
  OptimizingTravelCapability: require("./OptimizingTravelCapability")
};
