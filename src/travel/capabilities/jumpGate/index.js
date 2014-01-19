"use strict";

var JumpGateTravelCapability = require("./JumpGateTravelCapability");

/**
 * This namespace contains helper regarding the jump gate travel capability.
 *
 * @namespace jumpGate
 * @memberof everoute.travel.capabilities
 */

/**
 * The type identification for the jumps: "jumpGate".
 *
 * @type {String}
 * @const
 * @memberof everoute.travel.capabilities.jumpGate
 */
var JUMP_TYPE = JumpGateTravelCapability.JUMP_TYPE;

module.exports = {
  JUMP_TYPE: JUMP_TYPE,

  JumpGateTravelCapability: JumpGateTravelCapability
};
