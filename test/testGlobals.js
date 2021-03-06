/* global global */
"use strict";

// This file sets up some globals for the tests; More specifically, the
// assertion libraries required for the tests.
// These could also be require()'d by the tests, but having them prepared as
// globals allows the tests to be easily reused in a browser context.
//
// Note: This of course would also require the tested components to be available,
// these are also pulled in with require() .
//
// If all fails, the lines here are to avoid too much copy/paste code.

// Assertions: https://github.com/LearnBoost/expect.js/
// Spy/Mock:   http://sinonjs.org/
//             https://github.com/lightsofapollo/sinon-expect

if (!global.sinon) {
  global.sinon = require("sinon");
}

if (!global.expect) {
  global.expect = require("expect.js");
}

if (!global.SinonExpect) {
  global.SinonExpect = require("sinon-expect");
}
global.expect = global.SinonExpect.enhance(global.expect, global.sinon, "was");
