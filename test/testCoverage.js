/* global global */
"use strict";

global.everoute = require("../build/instrumented/src");

// explicitly extend object prototype to have all foreach loops safeguard with hasOwnProperty()
Object.prototype.forLoopShouldCheckProperties = true;
