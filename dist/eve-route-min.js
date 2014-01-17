!function(a){"object"==typeof exports?module.exports=a():"function"==typeof define&&define.amd?define(a):"undefined"!=typeof window?window.everoute=a():"undefined"!=typeof global?global.everoute=a():"undefined"!=typeof self&&(self.everoute=a())}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){"use strict";var c=a("./universe"),d=function(){return new c.UniverseBuilder};b.exports={travel:a("./travel"),universe:c,util:a("./util"),newUniverseBuilder:d}},{"./travel":6,"./universe":15,"./util":16}],2:[function(a,b){"use strict";function c(){}c.prototype.getPositionRelativeTo=function(){return[0,0,0]},c.prototype.distanceTo=function(){return 0},b.exports=c},{}],3:[function(a,b){"use strict";function c(a,b,c,d,e){var f=e.slice(0);this.getType=function(){return a},this.getDestinationId=function(){return c},this.getSourceLocation=function(){return b},this.getDestinationLocation=function(){return d},this.getCosts=function(){return f.slice(0)}}b.exports=c},{}],4:[function(a,b){"use strict";function c(a,b){var c=new d,f=new d,g=[];this.build=function(){return new e(a,c,b,f,g)},this.from=function(a){return c=a,this},this.to=function(a){return f=a,this},this.addCost=function(a){return g.push(a),this}}var d=a("./AnyLocation"),e=a("./Jump");b.exports=c},{"./AnyLocation":2,"./Jump":3}],5:[function(a,b){"use strict";function c(a,b,c){var d=[a,b,c];this.getPositionRelativeTo=function(a){return[d[0]-a[0],d[1]-a[1],d[2]-a[2]]},this.distanceTo=function(a){var b=a.getPositionRelativeTo(d.slice(0));return Math.sqrt(b[0]*b[0]+b[1]*b[1]+b[2]*b[2])}}b.exports=c},{}],6:[function(a,b){b.exports={AnyLocation:a("./AnyLocation"),Jump:a("./Jump"),JumpBuilder:a("./JumpBuilder"),SpecificLocation:a("./SpecificLocation")}},{"./AnyLocation":2,"./Jump":3,"./JumpBuilder":4,"./SpecificLocation":5}],7:[function(a,b){"use strict";function c(a,b,c,d){function e(a,b){if("undefined"==typeof a)throw new Error(b);return a}this.id=e(a,"No id specified"),this.galaxyId=e(b.galaxyId,"No contextIds.galaxyId specified"),this.regionId=e(b.regionId,"No contextIds.regionId specified"),this.constellationId=e(b.constellationId,"No contextIds.constellationId specified"),this.location=e(c,"No location specified"),this.trueSecurity=e(d,"No trueSecurity specified"),this.security=this.trueSecurity<0?0:parseFloat((Math.floor(10*d)/10).toFixed(1))}c.prototype.getId=function(){return this.id},c.prototype.getGalaxyId=function(){return this.galaxyId},c.prototype.getRegionId=function(){return this.regionId},c.prototype.getConstellationId=function(){return this.constellationId},c.prototype.getLocation=function(){return this.location},c.prototype.getSecurityValue=function(){return this.security},c.prototype.getJumps=function(){return[]},b.exports=c},{}],8:[function(a,b){"use strict";function c(){}var d=a("./UniverseBuilder");c.prototype.extend=function(){return new d(this)},c.prototype.hasSolarSystem=function(){return!1},c.prototype.getSolarSystem=function(a){throw new Error("SolarSystem with ID <"+a+"> not found")},c.prototype.getSolarSystemIds=function(){return[]},b.exports=c},{"./UniverseBuilder":13}],9:[function(a,b){"use strict";function c(a){var b=a.base,c={};a.jumpBuilders.forEach(function(a){var b=a.build(),d=b.getType(),e=c[d]||[];c[d]=e.concat([b])}),this.getId=function(){return b.getId()},this.getId=function(){return b.getId()},this.getGalaxyId=function(){return b.getGalaxyId()},this.getRegionId=function(){return b.getRegionId()},this.getConstellationId=function(){return b.getConstellationId()},this.getLocation=function(){return b.getLocation()},this.getSecurityValue=function(){return b.getSecurityValue()},this.getJumps=function(a){var d=b.getJumps(a);return c.hasOwnProperty(a)&&(d=d.concat(c[a])),d}}b.exports=c},{}],10:[function(a,b){"use strict";function c(a){function b(){a.solarSystems.forEach(function(a){d[a.getId()]=a})}var c=a.base,d={};this.hasSolarSystem=function(a){var b=d.hasOwnProperty(a)||c.hasSolarSystem(a);return b},this.getSolarSystem=function(a){var b=d[a]||c.getSolarSystem(a);return b},this.getSolarSystemIds=function(){var a,b=c.getSolarSystemIds(),e=function(a){var c=b.indexOf(a);0>c&&b.push(a)};for(a in d)e(d[a].getId());return b.sort()},b()}c.prototype.extend=function(){var b=a("./UniverseBuilder");return new b(this)},b.exports=c},{"./UniverseBuilder":13}],11:[function(a,b){"use strict";function c(a){this.addJump=function(b,c){var e=new d(b,c);return a.jumpBuilders.push(e),e},this.addCost=function(b){a.costs.push(b)}}var d=a("../travel/JumpBuilder");b.exports=c},{"../travel/JumpBuilder":4}],12:[function(a,b){"use strict";function c(a){this.base=a,this.jumpBuilders=[],this.costs=[]}b.exports=c},{}],13:[function(a,b){"use strict";function c(a){var b=new g(a),c={};this.build=function(){var a;for(a in c)b.solarSystems.push(new e(c[a]));return new f(b)},this.addSolarSystem=function(b,e,f,g){if(c.hasOwnProperty(b)||a.hasSolarSystem(b))throw new Error("Solar System "+b+" already exists.");var h=new d(b,e,f,g),j=new i(h);c[b]=j},this.extendSolarSystem=function(b){var d,e=c[b];if(!e&&a.hasSolarSystem(b)&&(e=new i(a.getSolarSystem(b)),c[b]=e),!e)throw new Error("Solar System "+b+" doesn't exist.");return d=new h(c[b])}}var d=a("./EmptySolarSystem"),e=a("./ExtendedSolarSystem"),f=a("./ExtendedUniverse"),g=a("./UniverseExtensionData"),h=a("./SolarSystemExtension"),i=a("./SolarSystemExtensionData");b.exports=c},{"./EmptySolarSystem":7,"./ExtendedSolarSystem":9,"./ExtendedUniverse":10,"./SolarSystemExtension":11,"./SolarSystemExtensionData":12,"./UniverseExtensionData":14}],14:[function(a,b){"use strict";function c(a){this.base=a,this.solarSystems=[]}b.exports=c},{}],15:[function(a,b){b.exports={EmptySolarSystem:a("./EmptySolarSystem"),EmptyUniverse:a("./EmptyUniverse"),ExtendedSolarSystem:a("./ExtendedSolarSystem"),ExtendedUniverse:a("./ExtendedUniverse"),UniverseBuilder:a("./UniverseBuilder"),UniverseExtensionData:a("./UniverseExtensionData"),SolarSystemExtension:a("./SolarSystemExtension"),SolarSystemExtensionData:a("./SolarSystemExtensionData")}},{"./EmptySolarSystem":7,"./EmptyUniverse":8,"./ExtendedSolarSystem":9,"./ExtendedUniverse":10,"./SolarSystemExtension":11,"./SolarSystemExtensionData":12,"./UniverseBuilder":13,"./UniverseExtensionData":14}],16:[function(a,b){"use strict";var c=function(){};b.exports={noop:c}},{}]},{},[1])(1)});