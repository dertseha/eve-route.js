!function(a){"object"==typeof exports?module.exports=a():"function"==typeof define&&define.amd?define(a):"undefined"!=typeof window?window.everoute=a():"undefined"!=typeof global?global.everoute=a():"undefined"!=typeof self&&(self.everoute=a())}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){"use strict";var c=a("./universe"),d=function(){return new c.UniverseBuilder(new c.EmptyUniverse)};b.exports={travel:a("./travel"),universe:c,util:a("./util"),newUniverseBuilder:d}},{"./travel":18,"./universe":38,"./util":39}],2:[function(a,b){"use strict";function c(a,b){this.getType=function(){return a},this.getValue=function(){return b},this.join=function(d){return new c(a,b+d.getValue())}}b.exports=c},{}],3:[function(a,b){"use strict";function c(){}c.prototype.getPositionRelativeTo=function(){return[0,0,0]},c.prototype.distanceTo=function(){return 0},b.exports=c},{}],4:[function(a,b){"use strict";function c(a,b,c,d,e){var f=e.slice(0);this.getType=function(){return a},this.getDestinationId=function(){return c},this.getSourceLocation=function(){return b},this.getDestinationLocation=function(){return d},this.getCosts=function(){return f.slice(0)}}b.exports=c},{}],5:[function(a,b){"use strict";function c(a,b){var c=new d,f=new d,g=[];this.build=function(){return new e(a,c,b,f,g)},this.from=function(a){return c=a,this},this.to=function(a){return f=a,this},this.addCost=function(a){return g.push(a),this}}var d=a("./AnyLocation"),e=a("./Jump");b.exports=c},{"./AnyLocation":3,"./Jump":4}],6:[function(a,b){"use strict";function c(a,b,c){this.step=a,this.previous=b,this.costSum=c?c:new d(a.getEnterCosts())}var d=a("./TravelCostSum");c.prototype.getDestinationKey=function(){return this.step.getKey()},c.prototype.isStart=function(){return!this.previous},c.prototype.getPrevious=function(){if(this.isStart())throw new Error("Start of a path has no predecessor");return this.previous},c.prototype.extend=function(a){var b=this.step.getContinueCosts().concat(a.getEnterCosts());return new c(a,this,this.costSum.add(b))},c.prototype.getStep=function(){return this.step},c.prototype.getSteps=function(){var a=[this.step];return this.isStart()?a:this.previous.getSteps().concat(a)},c.prototype.getCostSum=function(){return this.costSum},b.exports=c},{"./TravelCostSum":12}],7:[function(a,b){"use strict";function c(a){function b(a){function b(){var a=e.getDestinationKey();return c[a]===e}var d,e=a;for(d=b();d&&!e.isStart();)e=e.getPrevious(),d=b();return d}var c={};this.enter=function(d){var e=!0,f=d.getDestinationKey(),g=c[f];return g&&g!==d&&a.compare(d.getCostSum(),g.getCostSum())>=0?e=!1:d.isStart()||b(d.getPrevious())?c[f]=d:e=!1,e}}b.exports=c},{}],8:[function(a,b){"use strict";function c(a,b,c){var d=[a,b,c];this.getPositionRelativeTo=function(a){return[d[0]-a[0],d[1]-a[1],d[2]-a[2]]},this.distanceTo=function(a){var b=a.getPositionRelativeTo(d.slice(0));return Math.sqrt(b[0]*b[0]+b[1]*b[1]+b[2]*b[2])}}b.exports=c},{}],9:[function(a,b){"use strict";function c(a){this.getContest=function(){return a}}b.exports=c},{}],10:[function(a,b){"use strict";function c(a,b,c,d){this.solarSystemId=a,this.location=b,this.enterCosts=c.slice(0),this.continueCosts=d.slice(0)}c.prototype.getKey=function(){return this.solarSystemId.toString()},c.prototype.getSolarSystemId=function(){return this.solarSystemId},c.prototype.getLocation=function(){return this.location},c.prototype.getEnterCosts=function(){return this.enterCosts.slice(0)},c.prototype.getContinueCosts=function(){return this.continueCosts.slice(0)},b.exports=c},{}],11:[function(a,b){"use strict";function c(a){var b=new d,c=[],f=[];this.build=function(){return new e(a,b,c,f)},this.to=function(a){return b=a,this},this.withEnterCosts=function(a){return c=a.slice(0),this},this.withContinueCosts=function(a){return f=a.slice(0),this}}var d=a("./AnyLocation"),e=a("./Step");b.exports=c},{"./AnyLocation":3,"./Step":10}],12:[function(a,b){"use strict";function c(a){var b={};a.forEach(function(a){var c=a.getType();b[c]=b.hasOwnProperty(c)?a.join(b[c]):a}),this.costs=b}c.prototype.getCost=function(a){return this.costs[a.getType()]||a},c.prototype.getTotal=function(){var a,b=[];for(a in this.costs)this.costs.hasOwnProperty(a)&&b.push(this.costs[a]);return b},c.prototype.add=function(a){return new c(this.getTotal().concat(a))},b.exports=c},{}],13:[function(a,b){"use strict";function c(a){this.getNextPaths=function(b){var c=[];return a.forEach(function(a){c=c.concat(a.getNextPaths(b))}),c}}b.exports=c},{}],14:[function(a,b){"use strict";function c(a,b){this.getNextPaths=function(c){var d,e=b.getContest(),f=[],g={};e.enter(c)&&(d=a.getNextPaths(c),d.forEach(function(a){var b=a.getDestinationKey();(c.isStart()||c.getPrevious().getDestinationKey()!==b)&&e.enter(a)&&(g[b]=a)}));for(d in g)g.hasOwnProperty(d)&&f.push(g[d]);return f}}b.exports=c},{}],15:[function(a,b){b.exports={jumpGate:a("./jumpGate"),CombiningTravelCapability:a("./CombiningTravelCapability"),OptimizingTravelCapability:a("./OptimizingTravelCapability")}},{"./CombiningTravelCapability":13,"./OptimizingTravelCapability":14,"./jumpGate":17}],16:[function(a,b){"use strict";function c(a){this.getNextPaths=function(b){var e=a.getSolarSystem(b.getStep().getSolarSystemId()),f=e.getJumps(c.JUMP_TYPE),g=[];return f.forEach(function(c){var e=a.getSolarSystem(c.getDestinationId()),f=new d(e.getId()).withEnterCosts(c.getCosts()).withContinueCosts(e.getCosts());g.push(b.extend(f.build()))}),g}}var d=a("../../StepBuilder");c.JUMP_TYPE="jumpGate",b.exports=c},{"../../StepBuilder":11}],17:[function(a,b){"use strict";var c=a("./JumpGateTravelCapability"),d=c.JUMP_TYPE;b.exports={JUMP_TYPE:d,JumpGateTravelCapability:c}},{"./JumpGateTravelCapability":16}],18:[function(a,b){b.exports={capabilities:a("./capabilities"),rules:a("./rules"),search:a("./search"),AddingTravelCost:a("./AddingTravelCost"),AnyLocation:a("./AnyLocation"),Jump:a("./Jump"),JumpBuilder:a("./JumpBuilder"),Path:a("./Path"),PathContest:a("./PathContest"),SpecificLocation:a("./SpecificLocation"),StaticPathContestProvider:a("./StaticPathContestProvider"),Step:a("./Step"),StepBuilder:a("./StepBuilder"),TravelCostSum:a("./TravelCostSum")}},{"./AddingTravelCost":2,"./AnyLocation":3,"./Jump":4,"./JumpBuilder":5,"./Path":6,"./PathContest":7,"./SpecificLocation":8,"./StaticPathContestProvider":9,"./Step":10,"./StepBuilder":11,"./TravelCostSum":12,"./capabilities":15,"./rules":21,"./search":29}],19:[function(a,b){"use strict";function c(a){this.compare=function(b,c){return b.getCost(a).getValue()-c.getCost(a).getValue()}}b.exports=c},{}],20:[function(a,b){"use strict";function c(a){this.rules=a.slice(0)}c.prototype.compare=function(a,b){var c,d=this.rules.length,e=0;for(c=0;0===e&&d>c;c++)e=this.rules[c].compare(a,b);return e},b.exports=c},{}],21:[function(a,b){b.exports={security:a("./security"),transitCount:a("./transitCount"),NaturalOrderTravelRule:a("./NaturalOrderTravelRule"),TravelRuleset:a("./TravelRuleset")}},{"./NaturalOrderTravelRule":19,"./TravelRuleset":20,"./security":24,"./transitCount":26}],22:[function(a,b){"use strict";function c(a){this.compare=function(b,c){var e=d.sumSecurityCosts(b,a,1),f=d.sumSecurityCosts(c,a,1);return e-f}}var d=a("./statics");b.exports=c},{"./statics":25}],23:[function(a,b){"use strict";function c(a){this.compare=function(b,c){var e=d.sumSecurityCosts(b,0,a-.1),f=d.sumSecurityCosts(c,0,a-.1);return e-f}}var d=a("./statics");b.exports=c},{"./statics":25}],24:[function(a,b){"use strict";var c=a("./statics"),d=a("./MaxSecurityTravelRule"),e=a("./MinSecurityTravelRule"),f=function(a){var b=a.getSolarSystemIds();b.forEach(function(b){var d=a.extendSolarSystem(b),e=d.getSecurityValue();d.addCost(c.getTravelCost(e,1))})},g=function(a){return new e(a)},h=function(a){return new d(a)};b.exports={extendUniverse:f,getMaxRule:h,getMinRule:g,getTravelCost:c.getTravelCost,getTravelCostType:c.getTravelCostType}},{"./MaxSecurityTravelRule":22,"./MinSecurityTravelRule":23,"./statics":25}],25:[function(a,b){"use strict";var c=a("../../AddingTravelCost"),d=function(a){return"security"+a.toFixed(1).replace(".","")},e=function(a,b){return new c(d(a),b)},f={};!function(){var a,b;for(a=0;1>=a;a+=.1)b=e(a,0),f[b.getType()]=b}();var g=function(a,b,c){var e,g,h=0;for(e=b;c>=e;e+=.1)g=f[d(e)],h+=a.getCost(g).getValue();return h};b.exports={getTravelCost:e,getTravelCostType:d,sumSecurityCosts:g}},{"../../AddingTravelCost":2}],26:[function(a,b){"use strict";var c=a("../../AddingTravelCost"),d=a("../NaturalOrderTravelRule"),e="transitCount",f=function(a){var b=a.getSolarSystemIds();b.forEach(function(b){var d=a.extendSolarSystem(b);d.addCost(new c(e,1))})},g=function(){var a=new c(e,0);return new d(a)};b.exports={COST_TYPE:e,extendUniverse:f,getRule:g}},{"../../AddingTravelCost":2,"../NaturalOrderTravelRule":19}],27:[function(a,b){"use strict";function c(a){this.isDesired=function(b){return b.getStep().getSolarSystemId()===a},this.shouldSearchContinueWith=function(b){return b.getStep().getSolarSystemId()!==a}}b.exports=c},{}],28:[function(a,b){"use strict";function c(a,b,c,d){function e(){i=f,g(a),i()}function f(){var a;h.length>0&&(a=b.getNextPaths(h.pop()),a.forEach(g))}function g(a){c.isDesired(a)&&d.collect(a),c.shouldSearchContinueWith(a)&&h.push(a)}var h=[],i=e;this.continueSearch=function(){return i(),0!==h.length}}b.exports=c},{}],29:[function(a,b){b.exports={DestinationSystemSearchCriterion:a("./DestinationSystemSearchCriterion"),PathFinder:a("./PathFinder")}},{"./DestinationSystemSearchCriterion":27,"./PathFinder":28}],30:[function(a,b){"use strict";function c(a,b,c,d){function e(a,b){if("undefined"==typeof a)throw new Error(b);return a}this.id=e(a,"No id specified"),this.galaxyId=e(b.galaxyId,"No contextIds.galaxyId specified"),this.regionId=e(b.regionId,"No contextIds.regionId specified"),this.constellationId=e(b.constellationId,"No contextIds.constellationId specified"),this.location=e(c,"No location specified"),this.trueSecurity=e(d,"No trueSecurity specified"),this.security=this.trueSecurity<0?0:parseFloat((Math.floor(10*(d+.05))/10).toFixed(1))}var d=a("../travel/Path"),e=a("../travel/StepBuilder");c.prototype.getId=function(){return this.id},c.prototype.getGalaxyId=function(){return this.galaxyId},c.prototype.getRegionId=function(){return this.regionId},c.prototype.getConstellationId=function(){return this.constellationId},c.prototype.getLocation=function(){return this.location},c.prototype.getSecurityValue=function(){return this.security},c.prototype.getJumps=function(){return[]},c.prototype.getCosts=function(){return[]},c.prototype.startPath=function(){return new d(new e(this.id).build())},b.exports=c},{"../travel/Path":6,"../travel/StepBuilder":11}],31:[function(a,b){"use strict";function c(){}var d=a("./UniverseBuilder");c.prototype.extend=function(){return new d(this)},c.prototype.hasSolarSystem=function(){return!1},c.prototype.getSolarSystem=function(a){throw new Error("SolarSystem with ID <"+a+"> not found")},c.prototype.getSolarSystemIds=function(){return[]},b.exports=c},{"./UniverseBuilder":36}],32:[function(a,b){"use strict";function c(a){var b=a.base,c={},d=a.costs.slice(0);a.jumpBuilders.forEach(function(a){var b=a.build(),d=b.getType(),e=c[d]||[];c[d]=e.concat([b])}),this.getId=function(){return b.getId()},this.getGalaxyId=function(){return b.getGalaxyId()},this.getRegionId=function(){return b.getRegionId()},this.getConstellationId=function(){return b.getConstellationId()},this.getLocation=function(){return b.getLocation()},this.getSecurityValue=function(){return b.getSecurityValue()},this.getJumps=function(a){var d=b.getJumps(a);return c.hasOwnProperty(a)&&(d=d.concat(c[a])),d},this.getCosts=function(){var a=b.getCosts();return a.concat(d)},this.startPath=function(){return b.startPath()}}a("../travel/StepBuilder");b.exports=c},{"../travel/StepBuilder":11}],33:[function(a,b){"use strict";function c(a){function b(){a.solarSystems.forEach(function(a){d[a.getId()]=a})}var c=a.base,d={};this.hasSolarSystem=function(a){var b=d.hasOwnProperty(a)||c.hasSolarSystem(a);return b},this.getSolarSystem=function(a){var b=d[a]||c.getSolarSystem(a);return b},this.getSolarSystemIds=function(){var a,b=c.getSolarSystemIds(),e=function(a){var c=b.indexOf(a);0>c&&b.push(a)};for(a in d)d.hasOwnProperty(a)&&e(d[a].getId());return b.sort()},b()}c.prototype.extend=function(){var b=a("./UniverseBuilder");return new b(this)},b.exports=c},{"./UniverseBuilder":36}],34:[function(a,b){"use strict";function c(a){this.getSecurityValue=function(){return a.base.getSecurityValue()},this.addJump=function(b,c){var e=new d(b,c);return a.jumpBuilders.push(e),e},this.addCost=function(b){a.costs.push(b)}}var d=a("../travel/JumpBuilder");b.exports=c},{"../travel/JumpBuilder":5}],35:[function(a,b){"use strict";function c(a){this.base=a,this.jumpBuilders=[],this.costs=[]}b.exports=c},{}],36:[function(a,b){"use strict";function c(a){var b=new g(a),c={};this.build=function(){var a;for(a in c)c.hasOwnProperty(a)&&b.solarSystems.push(new e(c[a]));return new f(b)},this.addSolarSystem=function(b,e,f,g){if(c.hasOwnProperty(b)||a.hasSolarSystem(b))throw new Error("Solar System "+b+" already exists.");var h=new d(b,e,f,g),j=new i(h);c[b]=j},this.getSolarSystemIds=function(){var b,d=a.getSolarSystemIds(),e=function(a){var b=d.indexOf(a);0>b&&d.push(a)};for(b in c)c.hasOwnProperty(b)&&e(c[b].base.getId());return d.sort()},this.extendSolarSystem=function(b){var d,e=c[b];if(!e&&a.hasSolarSystem(b)&&(e=new i(a.getSolarSystem(b)),c[b]=e),!e)throw new Error("Solar System "+b+" doesn't exist.");return d=new h(c[b])}}var d=a("./EmptySolarSystem"),e=a("./ExtendedSolarSystem"),f=a("./ExtendedUniverse"),g=a("./UniverseExtensionData"),h=a("./SolarSystemExtension"),i=a("./SolarSystemExtensionData");b.exports=c},{"./EmptySolarSystem":30,"./ExtendedSolarSystem":32,"./ExtendedUniverse":33,"./SolarSystemExtension":34,"./SolarSystemExtensionData":35,"./UniverseExtensionData":37}],37:[function(a,b){"use strict";function c(a){this.base=a,this.solarSystems=[]}b.exports=c},{}],38:[function(a,b){b.exports={EmptySolarSystem:a("./EmptySolarSystem"),EmptyUniverse:a("./EmptyUniverse"),ExtendedSolarSystem:a("./ExtendedSolarSystem"),ExtendedUniverse:a("./ExtendedUniverse"),UniverseBuilder:a("./UniverseBuilder"),UniverseExtensionData:a("./UniverseExtensionData"),SolarSystemExtension:a("./SolarSystemExtension"),SolarSystemExtensionData:a("./SolarSystemExtensionData")}},{"./EmptySolarSystem":30,"./EmptyUniverse":31,"./ExtendedSolarSystem":32,"./ExtendedUniverse":33,"./SolarSystemExtension":34,"./SolarSystemExtensionData":35,"./UniverseBuilder":36,"./UniverseExtensionData":37}],39:[function(a,b){"use strict";var c=function(){};b.exports={noop:c}},{}]},{},[1])(1)});