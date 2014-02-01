!function(a){if("object"==typeof exports)module.exports=a();else if("function"==typeof define&&define.amd)define(a);else{var b;"undefined"!=typeof window?b=window:"undefined"!=typeof global?b=global:"undefined"!=typeof self&&(b=self),b.everoute=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){"use strict";var c=a("./universe"),d=function(){return new c.UniverseBuilder(new c.EmptyUniverse)};b.exports={travel:a("./travel"),universe:c,util:a("./util"),newUniverseBuilder:d}},{"./travel":18,"./universe":48,"./util":50}],2:[function(a,b){"use strict";function c(a,b){this.getType=function(){return a},this.getValue=function(){return b},this.join=function(d){return new c(a,b+d.getValue())}}b.exports=c},{}],3:[function(a,b){"use strict";function c(){}c.prototype.toString=function(){return"*"},c.prototype.getPositionRelativeTo=function(){return[0,0,0]},c.prototype.distanceTo=function(){return 0},b.exports=c},{}],4:[function(a,b){"use strict";function c(a,b,c,d,e){var f=e.slice(0);this.getType=function(){return a},this.getDestinationId=function(){return c},this.getSourceLocation=function(){return b},this.getDestinationLocation=function(){return d},this.getCosts=function(){return f.slice(0)}}b.exports=c},{}],5:[function(a,b){"use strict";function c(a,b){var c=new d,f=new d,g=[];this.build=function(){return new e(a,c,b,f,g)},this.from=function(a){return c=a,this},this.to=function(a){return f=a,this},this.addCost=function(a){return g.push(a),this}}var d=a("./AnyLocation"),e=a("./Jump");b.exports=c},{"./AnyLocation":3,"./Jump":4}],6:[function(a,b){"use strict";function c(a,b,c){this.step=a,this.previous=b,this.costSum=c?c:new d(a.getEnterCosts())}var d=a("./TravelCostSum");c.prototype.getDestinationKey=function(){return this.step.getKey()},c.prototype.isStart=function(){return!this.previous},c.prototype.getPrevious=function(){if(this.isStart())throw new Error("Start of a path has no predecessor");return this.previous},c.prototype.extend=function(a){var b=this.step.getContinueCosts().concat(a.getEnterCosts());return new c(a,this,this.costSum.add(b))},c.prototype.getStep=function(){return this.step},c.prototype.getSteps=function(){var a=[this.step];return this.isStart()?a:this.previous.getSteps().concat(a)},c.prototype.getCostSum=function(){return this.costSum},b.exports=c},{"./TravelCostSum":12}],7:[function(a,b){"use strict";function c(a){function b(a){function b(){var a=e.getDestinationKey();return c[a]===e}var d,e=a;for(d=b();d&&!e.isStart();)e=e.getPrevious(),d=b();return d}var c={};this.enter=function(d){var e=!0,f=d.getDestinationKey(),g=c[f];return g&&g!==d&&a.compare(d.getCostSum(),g.getCostSum())>=0?e=!1:d.isStart()||b(d.getPrevious())?c[f]=d:e=!1,e}}b.exports=c},{}],8:[function(a,b){"use strict";function c(a,b,c){var d=[a,b,c];this.toString=function(){return"["+a+", "+b+", "+c+"]"},this.getPositionRelativeTo=function(a){return[d[0]-a[0],d[1]-a[1],d[2]-a[2]]},this.distanceTo=function(a){var b=a.getPositionRelativeTo(d.slice(0));return Math.sqrt(b[0]*b[0]+b[1]*b[1]+b[2]*b[2])}}b.exports=c},{}],9:[function(a,b){"use strict";function c(a){this.getContest=function(){return a}}b.exports=c},{}],10:[function(a,b){"use strict";function c(a,b,c,d){this.solarSystemId=a,this.location=b,this.enterCosts=c.slice(0),this.continueCosts=d.slice(0)}c.prototype.asFirstStep=function(){return new c(this.solarSystemId,this.location,[],[])},c.prototype.getKey=function(){return this.solarSystemId.toString()+"@"+this.location.toString()},c.prototype.getSolarSystemId=function(){return this.solarSystemId},c.prototype.getLocation=function(){return this.location},c.prototype.getEnterCosts=function(){return this.enterCosts.slice(0)},c.prototype.getContinueCosts=function(){return this.continueCosts.slice(0)},b.exports=c},{}],11:[function(a,b){"use strict";function c(a){var b=new d,c=[],f=[];this.build=function(){return new e(a,b,c,f)},this.to=function(a){return b=a,this},this.withEnterCosts=function(a){return c=a.slice(0),this},this.withContinueCosts=function(a){return f=a.slice(0),this}}var d=a("./AnyLocation"),e=a("./Step");b.exports=c},{"./AnyLocation":3,"./Step":10}],12:[function(a,b){"use strict";function c(a){var b={};a.forEach(function(a){var c=a.getType();b[c]=b.hasOwnProperty(c)?a.join(b[c]):a}),this.costs=b}c.prototype.getCost=function(a){return this.costs[a.getType()]||a},c.prototype.getTotal=function(){var a,b=[];for(a in this.costs)this.costs.hasOwnProperty(a)&&b.push(this.costs[a]);return b},c.prototype.add=function(a){return new c(this.getTotal().concat(a))},b.exports=c},{}],13:[function(a,b){"use strict";function c(a){this.getNextPaths=function(b){var c=[];return a.forEach(function(a){c=c.concat(a.getNextPaths(b))}),c}}b.exports=c},{}],14:[function(a,b){"use strict";function c(a,b){this.getNextPaths=function(c){var d,e=b.getContest(),f=[],g={};e.enter(c)&&(d=a.getNextPaths(c),d.forEach(function(a){var b=a.getDestinationKey();(c.isStart()||c.getPrevious().getDestinationKey()!==b)&&e.enter(a)&&(g[b]=a)}));for(d in g)g.hasOwnProperty(d)&&f.push(g[d]);return f}}b.exports=c},{}],15:[function(a,b){b.exports={jumpGate:a("./jumpGate"),CombiningTravelCapability:a("./CombiningTravelCapability"),OptimizingTravelCapability:a("./OptimizingTravelCapability")}},{"./CombiningTravelCapability":13,"./OptimizingTravelCapability":14,"./jumpGate":17}],16:[function(a,b){"use strict";function c(a){this.getNextPaths=function(b){var e=a.getSolarSystem(b.getStep().getSolarSystemId()),f=e.getJumps(c.JUMP_TYPE),g=[];return f.forEach(function(c){var e=a.getSolarSystem(c.getDestinationId()),f=new d(e.getId()).withEnterCosts(c.getCosts()).withContinueCosts(e.getCosts());g.push(b.extend(f.build()))}),g}}var d=a("../../StepBuilder");c.JUMP_TYPE="jumpGate",b.exports=c},{"../../StepBuilder":11}],17:[function(a,b){"use strict";var c=a("./JumpGateTravelCapability"),d=c.JUMP_TYPE;b.exports={JUMP_TYPE:d,JumpGateTravelCapability:c}},{"./JumpGateTravelCapability":16}],18:[function(a,b){b.exports={capabilities:a("./capabilities"),rules:a("./rules"),search:a("./search"),AddingTravelCost:a("./AddingTravelCost"),AnyLocation:a("./AnyLocation"),Jump:a("./Jump"),JumpBuilder:a("./JumpBuilder"),Path:a("./Path"),PathContest:a("./PathContest"),SpecificLocation:a("./SpecificLocation"),StaticPathContestProvider:a("./StaticPathContestProvider"),Step:a("./Step"),StepBuilder:a("./StepBuilder"),TravelCostSum:a("./TravelCostSum")}},{"./AddingTravelCost":2,"./AnyLocation":3,"./Jump":4,"./JumpBuilder":5,"./Path":6,"./PathContest":7,"./SpecificLocation":8,"./StaticPathContestProvider":9,"./Step":10,"./StepBuilder":11,"./TravelCostSum":12,"./capabilities":15,"./rules":21,"./search":39}],19:[function(a,b){"use strict";function c(a){this.compare=function(b,c){return b.getCost(a).getValue()-c.getCost(a).getValue()}}b.exports=c},{}],20:[function(a,b){"use strict";function c(a){this.rules=a.slice(0)}c.prototype.compare=function(a,b){var c,d=this.rules.length,e=0;for(c=0;0===e&&d>c;c++)e=this.rules[c].compare(a,b);return e},b.exports=c},{}],21:[function(a,b){b.exports={security:a("./security"),transitCount:a("./transitCount"),NaturalOrderTravelRule:a("./NaturalOrderTravelRule"),TravelRuleset:a("./TravelRuleset")}},{"./NaturalOrderTravelRule":19,"./TravelRuleset":20,"./security":24,"./transitCount":26}],22:[function(a,b){"use strict";function c(a){var b=10*a;this.compare=function(a,c){var e=d.sumSecurityCosts(a,b,10),f=d.sumSecurityCosts(c,b,10);return e-f}}var d=a("./statics");b.exports=c},{"./statics":25}],23:[function(a,b){"use strict";function c(a){var b=10*a-1;this.compare=function(a,c){var e=d.sumSecurityCosts(a,0,b),f=d.sumSecurityCosts(c,0,b);return e-f}}var d=a("./statics");b.exports=c},{"./statics":25}],24:[function(a,b){"use strict";var c=a("./statics"),d=a("./MaxSecurityTravelRule"),e=a("./MinSecurityTravelRule"),f=function(a){var b=a.getSolarSystemIds();b.forEach(function(b){var d=a.extendSolarSystem(b),e=d.getSecurityValue();d.addCost(c.getTravelCost(e,1))})},g=function(a){return new e(a)},h=function(a){return new d(a)};b.exports={extendUniverse:f,getMaxRule:h,getMinRule:g,getTravelCost:c.getTravelCost,getTravelCostType:c.getTravelCostType}},{"./MaxSecurityTravelRule":22,"./MinSecurityTravelRule":23,"./statics":25}],25:[function(a,b){"use strict";var c=a("../../AddingTravelCost"),d=function(a){return"security"+a.toFixed(1).replace(".","")},e=function(a,b){return new c(d(a),b)},f={};!function(){var a,b;for(a=0;10>=a;a++)b=e(a/10,0),f[b.getType()]=b}();var g=function(a,b,c){var e,g,h=0;for(e=b;c>=e;e++)g=f[d(e/10)],h+=a.getCost(g).getValue();return h};b.exports={getTravelCost:e,getTravelCostType:d,sumSecurityCosts:g}},{"../../AddingTravelCost":2}],26:[function(a,b){"use strict";var c=a("../../AddingTravelCost"),d=a("../NaturalOrderTravelRule"),e="transitCount",f=function(a){var b=a.getSolarSystemIds();b.forEach(function(b){var d=a.extendSolarSystem(b);d.addCost(new c(e,1))})},g=function(){var a=new c(e,0);return new d(a)};b.exports={COST_TYPE:e,extendUniverse:f,getRule:g}},{"../../AddingTravelCost":2,"../NaturalOrderTravelRule":19}],27:[function(a,b){"use strict";function c(a){this.isDesired=function(b){var c=!1;return a.length>0&&(c=a.reduce(function(a,c){return a&&c.isDesired(b)},!0)),c},this.shouldSearchContinueWith=function(b,c){var d=!1;return a.length>0&&(d=a.reduce(function(a,d){return a&&d.shouldSearchContinueWith(b,c)},!0)),d}}b.exports=c},{}],28:[function(a,b){"use strict";function c(a){this.isDesired=function(){return!0},this.shouldSearchContinueWith=function(b,c){var d=b.getCostSum();return c.reduce(function(b,c){return b&&a.compare(d,c.getCostSum())<0},!0)}}b.exports=c},{}],29:[function(a,b){"use strict";function c(a){this.isDesired=function(b){return b.getStep().getSolarSystemId()===a},this.shouldSearchContinueWith=function(b){return b.getStep().getSolarSystemId()!==a}}b.exports=c},{}],30:[function(a,b){"use strict";function c(a,b,c,d){function e(){i=f,g(a),i()}function f(){var a;h.length>0&&(a=b.getNextPaths(h.shift()),a.forEach(g))}function g(a){c.isDesired(a)&&d.collect(a),c.shouldSearchContinueWith(a,d.getResults())&&h.push(a)}var h=[],i=e;this.continueSearch=function(){return i(),0!==h.length}}b.exports=c},{}],31:[function(a,b){"use strict";function c(a,b,c,h){var i=this;this.rule=c,this.queries=[],this.shortest=null,this.results={},this.resultsAsList=[];var j=new e(c),k=new g(b,new f(j));this.finder=new d(a,k,h,{collect:function(a){i.onFinderResult(a)},getResults:function(){return i.resultsAsList}})}var d=a("./PathFinder"),e=a("../PathContest"),f=a("../StaticPathContestProvider"),g=a("../capabilities/OptimizingTravelCapability");c.prototype.run=function(){this.finder&&!this.finder.continueSearch()&&(delete this.finder,this.onFinderCompleted())},c.prototype.getShortestPath=function(){return this.shortest},c.prototype.getRandomPath=function(a){var b,c=[];for(b in this.results)this.results.hasOwnProperty(b)&&c.push(b);return b=c[a.getIndex(c.length)],this.results[b]},c.prototype.request=function(a,b){this.finder?this.queueQuery(a,b):this.completeQuery(a,b)},c.prototype.onFinderResult=function(a){var b;this.results[a.getDestinationKey()]=a,this.resultsAsList=[];for(b in this.results)this.results.hasOwnProperty(b)&&this.resultsAsList.push(this.results[b]);(!this.shortest||this.rule.compare(a.getCostSum(),this.shortest.getCostSum())<0)&&(this.shortest=a)},c.prototype.onFinderCompleted=function(){var a=this;this.queries.forEach(function(b){a.completeQuery(b.listener,b.destinationKey)}),delete this.queries},c.prototype.queueQuery=function(a,b){var c={listener:a,destinationKey:b};this.queries.push(c)},c.prototype.completeQuery=function(a,b){this.shortest?b&&this.results.hasOwnProperty(b)?a.pathFound(this.results[b]):a.searchCompleted():a.searchFailed()},b.exports=c},{"../PathContest":7,"../StaticPathContestProvider":9,"../capabilities/OptimizingTravelCapability":14,"./PathFinder":30}],32:[function(a,b){"use strict";function c(a,b,c){var d=a.getCostSum();b.forEach(function(a){d=d.add(a.path.getCostSum().getTotal())}),c&&(d=d.add(c.getCostSum().getTotal())),this.getSteps=function(){var d=a.getSteps();return b.forEach(function(a){d=d.concat(a.path.getSteps().slice(1))}),c&&(d=d.concat(c.getSteps().slice(1))),d},this.getChromosome=function(){var d={startPath:a,waypoints:b.map(function(a){var b={index:a.index,destinationKey:a.path.getDestinationKey()};return b}),destinationKey:c&&c.getDestinationKey()};return d},this.getCostSum=function(){return d},this.toString=function(){var d="["+a.getDestinationKey()+"]";return b.forEach(function(a){d+="-"+a.index+"["+a.path.getDestinationKey()+"]"}),c&&(d+="-["+c.getDestinationKey()+"]"),d}}b.exports=c},{}],33:[function(a,b){"use strict";function c(a){this.rand=a}c.prototype.createRandom=function(a,b){var c,d={startPath:a[this.rand.getIndex(a.length)],waypoints:[],destinationKey:null};for(c=0;b>c;c++)d.waypoints.push({index:this.findUnusedWaypointIndex(d.waypoints,b),destinationKey:null});return d},c.prototype.createOffspring=function(a,b,c){for(var d,e={startPath:a.startPath,waypoints:[],destinationKey:b.destinationKey},f=0;c>f;)d=a.waypoints[f],e.waypoints.push(d),f++;for(;f<b.waypoints.length;)d=b.waypoints[f],e.waypoints.push(this.isWaypointIndexUsed(e.waypoints,d.index)?{index:this.findUnusedWaypointIndex(e.waypoints,b.waypoints.length),destinationKey:null}:d),f++;return e},c.prototype.findUnusedWaypointIndex=function(a,b){for(var c=this.rand.getIndex(b);this.isWaypointIndexUsed(a,c);)c=this.rand.getIndex(b);return c},c.prototype.isWaypointIndexUsed=function(a,b){var c,d=!1,e=a.length;for(c=0;!d&&e>c;c++)a[c].index===b&&(d=!0);return d},b.exports=c},{}],34:[function(a,b){"use strict";function c(a){function b(a){c.onRouteFound(a)}var c=this;this.rand=a.getRandomizer(),this.rule=a.getRule(),this.splicer=new d(this.rand),this.population=new f(this.rule),this.incubator=new e(b,a.getCapability(),this.rule,a.getWaypoints(),a.getDestination(),this.rand),this.startPaths=a.getStartPaths().slice(0),this.waypoints=a.getWaypoints().slice(0),this.collector=a.getCollector(),this.populationLimit=a.getPopulationLimit(),this.generationLimit=a.getGenerationLimit(),this.mutationPercentage=a.getMutationPercentage(),this.uncontestedLimit=this.generationLimit/4,this.generationCount=0,this.uncontestedCount=0,this.bestRoute=null}var d=a("./RouteChromosomeSplicer"),e=a("./RouteIncubator"),f=a("./RouteList");c.prototype.continueSearch=function(){var a=!1;return this.generationCount<this.generationLimit&&this.uncontestedCount<this.uncontestedLimit&&(a=!0,this.incubator.continueGrowth()||(this.generationCount++,this.uncontestedCount++,this.ensurePopulationSize(),this.createOffsprings())),a},c.prototype.onRouteFound=function(a){var b=this.population.add(a);b&&(this.uncontestedCount=0,this.collector.collect(a))},c.prototype.ensurePopulationSize=function(){var a;for(this.population.limit(this.populationLimit),a=this.populationLimit-this.population.getSize();a>0;)this.incubator.request(this.createRandomChromosome()),a--},c.prototype.createRandomChromosome=function(){return this.splicer.createRandom(this.startPaths,this.waypoints.length)},c.prototype.createOffsprings=function(){var a,b,c=this.population.getSize(),d=this.rand.getIndex(this.waypoints.length+1),e=this.rand.getIndex(100)<this.mutationPercentage;c>=2&&(a=this.population.get(this.rand.getIndex(c)).getChromosome(),b=this.population.get(this.rand.getIndex(c)).getChromosome(),e?this.createMutatedOffsprings(a,b,d):(this.incubator.request(this.splicer.createOffspring(a,b,d)),this.incubator.request(this.splicer.createOffspring(b,a,d))))},c.prototype.createMutatedOffsprings=function(a,b,c){var d=this.createRandomChromosome();this.incubator.request(this.splicer.createOffspring(a,d,c)),this.incubator.request(this.splicer.createOffspring(d,a,c)),this.incubator.request(this.splicer.createOffspring(b,d,c)),this.incubator.request(this.splicer.createOffspring(d,b,c))},b.exports=c},{"./RouteChromosomeSplicer":33,"./RouteIncubator":36,"./RouteList":38}],35:[function(a,b){"use strict";function c(a,b,c,f){var g=[],h=null,i=null,j=25,k=4e4,l=10;this.getCapability=function(){return a},this.getRule=function(){return b},this.getStartPaths=function(){return c},this.setWaypoints=function(a){g=a},this.getWaypoints=function(){return g},this.setDestination=function(a){h=a},this.getDestination=function(){return h},this.getCollector=function(){return f},this.getRandomizer=function(){return i||new d},this.getPopulationLimit=function(){return j},this.getGenerationLimit=function(){return k},this.getMutationPercentage=function(){return l},this.build=function(){return new e(this)}}var d=a("../../util/DefaultRandomizer"),e=a("./RouteFinder");b.exports=c},{"../../util/DefaultRandomizer":49,"./RouteFinder":34}],36:[function(a,b){"use strict";function c(a,b,c,d,e,f){this.callback=a,this.capability=b,this.rule=c,this.waypoints=d,this.destination=e,this.rand=f,this.agents=[],this.waypointsAgentsBySource=d.map(function(){return{}}),this.destinationAgentsBySource={},this.cultures=[]}var d=a("../Path"),e=(a("./PathFinder"),a("./RouteIncubatorCulture")),f=a("./PathSearchAgent");c.prototype.continueGrowth=function(){var a=!0;return this.agents.forEach(function(a){a.run()}),0===this.cultures.length&&(this.agents=[],a=!1),a},c.prototype.request=function(a){var b=new e(a);this.cultures.push(b),this.continueCulture(b,0,a.startPath)},c.prototype.continueCulture=function(a,b,c){function e(){j.onCultureFailed(a)}var f,g,h=new d(c.getStep().asFirstStep()),i=a.getChromosome(),j=this;b<this.waypoints.length?(f=i.waypoints[b].index,g=this.getPathSearchAgent(this.waypointsAgentsBySource[f],h,this.waypoints[f]),g.request({searchFailed:e,searchCompleted:function(){var c=g.getRandomPath(j.rand);a.addWaypointPath(f,c),j.continueCulture(a,b+1,c)},pathFound:function(c){a.addWaypointPath(f,c),j.continueCulture(a,b+1,c)}},i.waypoints[f].destinationKey)):this.destination?(g=this.getPathSearchAgent(this.destinationAgentsBySource,h,this.destination),g.request({searchFailed:e,searchCompleted:function(){a.setDestinationPath(g.getShortestPath()),j.onCultureCompleted(a)},pathFound:function(b){a.setDestinationPath(b),j.onCultureCompleted(a)}},i.destinationKey)):this.onCultureCompleted(a)},c.prototype.getPathSearchAgent=function(a,b,c){var d=b.getDestinationKey(),e=a[d];return e||(e=new f(b,this.capability,this.rule,c),a[d]=e,this.agents.push(e)),e},c.prototype.onCultureCompleted=function(a){this.dropCulture(a),this.callback(a.toRoute())},c.prototype.onCultureFailed=function(a){this.dropCulture(a)},c.prototype.dropCulture=function(a){var b=this.cultures.indexOf(a);this.cultures.splice(b,1)},b.exports=c},{"../Path":6,"./PathFinder":30,"./PathSearchAgent":31,"./RouteIncubatorCulture":37}],37:[function(a,b){"use strict";function c(a){this.chromosome=a,this.waypoints=[],this.destinationPath=null}var d=a("./Route");c.prototype.getChromosome=function(){return this.chromosome},c.prototype.addWaypointPath=function(a,b){var c={index:a,path:b};this.waypoints.push(c)},c.prototype.setDestinationPath=function(a){this.destinationPath=a},c.prototype.toRoute=function(){return new d(this.chromosome.startPath,this.waypoints,this.destinationPath)},b.exports=c},{"./Route":32}],38:[function(a,b){"use strict";function c(a){this.rule=a,this.routes=[]}c.prototype.getSize=function(){return this.routes.length},c.prototype.get=function(a){return this.routes[a]},c.prototype.add=function(a){for(var b=this.getSize(),c=a.getCostSum(),d=b-1,e=!0;e&&d>=0;)e=this.rule.compare(c,this.routes[d].getCostSum())<0,e&&d--;return this.routes.splice(d+1,0,a),-1===d},c.prototype.limit=function(a){var b=this.getSize();b>a&&this.routes.splice(a,b-a)},b.exports=c},{}],39:[function(a,b){b.exports={CombiningSearchCriterion:a("./CombiningSearchCriterion"),CostAwareSearchCriterion:a("./CostAwareSearchCriterion"),DestinationSystemSearchCriterion:a("./DestinationSystemSearchCriterion"),PathFinder:a("./PathFinder"),Route:a("./Route"),RouteChromosomeSplicer:a("./RouteChromosomeSplicer"),RouteIncubator:a("./RouteIncubator"),RouteFinderBuilder:a("./RouteFinderBuilder")}},{"./CombiningSearchCriterion":27,"./CostAwareSearchCriterion":28,"./DestinationSystemSearchCriterion":29,"./PathFinder":30,"./Route":32,"./RouteChromosomeSplicer":33,"./RouteFinderBuilder":35,"./RouteIncubator":36}],40:[function(a,b){"use strict";function c(a,b,c,d){function e(a,b){if("undefined"==typeof a)throw new Error(b);return a}this.id=e(a,"No id specified"),this.galaxyId=e(b.galaxyId,"No contextIds.galaxyId specified"),this.regionId=e(b.regionId,"No contextIds.regionId specified"),this.constellationId=e(b.constellationId,"No contextIds.constellationId specified"),this.location=e(c,"No location specified"),this.trueSecurity=e(d,"No trueSecurity specified"),this.security=this.trueSecurity<0?0:parseFloat((Math.floor(10*(d+.05))/10).toFixed(1))}var d=a("../travel/Path"),e=a("../travel/StepBuilder");c.prototype.getId=function(){return this.id},c.prototype.getGalaxyId=function(){return this.galaxyId},c.prototype.getRegionId=function(){return this.regionId},c.prototype.getConstellationId=function(){return this.constellationId},c.prototype.getLocation=function(){return this.location},c.prototype.getSecurityValue=function(){return this.security},c.prototype.getJumps=function(){return[]},c.prototype.getCosts=function(){return[]},c.prototype.startPath=function(){return new d(new e(this.id).build())},b.exports=c},{"../travel/Path":6,"../travel/StepBuilder":11}],41:[function(a,b){"use strict";function c(){}var d=a("./UniverseBuilder");c.prototype.extend=function(){return new d(this)},c.prototype.hasSolarSystem=function(){return!1},c.prototype.getSolarSystem=function(a){throw new Error("SolarSystem with ID <"+a+"> not found")},c.prototype.getSolarSystemIds=function(){return[]},b.exports=c},{"./UniverseBuilder":46}],42:[function(a,b){"use strict";function c(a){var b=a.base,c={},d=a.costs.slice(0);a.jumpBuilders.forEach(function(a){var b=a.build(),d=b.getType(),e=c[d]||[];c[d]=e.concat([b])}),this.getId=function(){return b.getId()},this.getGalaxyId=function(){return b.getGalaxyId()},this.getRegionId=function(){return b.getRegionId()},this.getConstellationId=function(){return b.getConstellationId()},this.getLocation=function(){return b.getLocation()},this.getSecurityValue=function(){return b.getSecurityValue()},this.getJumps=function(a){var d=b.getJumps(a);return c.hasOwnProperty(a)&&(d=d.concat(c[a])),d},this.getCosts=function(){var a=b.getCosts();return a.concat(d)},this.startPath=function(){return b.startPath()}}a("../travel/StepBuilder");b.exports=c},{"../travel/StepBuilder":11}],43:[function(a,b){"use strict";function c(a){function b(){a.solarSystems.forEach(function(a){d[a.getId()]=a})}var c=a.base,d={};this.hasSolarSystem=function(a){var b=d.hasOwnProperty(a)||c.hasSolarSystem(a);return b},this.getSolarSystem=function(a){var b=d[a]||c.getSolarSystem(a);return b},this.getSolarSystemIds=function(){var a,b=c.getSolarSystemIds(),e=function(a){var c=b.indexOf(a);0>c&&b.push(a)};for(a in d)d.hasOwnProperty(a)&&e(d[a].getId());return b.sort()},b()}c.prototype.extend=function(){var b=a("./UniverseBuilder");return new b(this)},b.exports=c},{"./UniverseBuilder":46}],44:[function(a,b){"use strict";function c(a){this.getSecurityValue=function(){return a.base.getSecurityValue()},this.addJump=function(b,c){var e=new d(b,c);return a.jumpBuilders.push(e),e},this.addCost=function(b){a.costs.push(b)}}var d=a("../travel/JumpBuilder");b.exports=c},{"../travel/JumpBuilder":5}],45:[function(a,b){"use strict";function c(a){this.base=a,this.jumpBuilders=[],this.costs=[]}b.exports=c},{}],46:[function(a,b){"use strict";function c(a){var b=new g(a),c={};this.build=function(){var a;for(a in c)c.hasOwnProperty(a)&&b.solarSystems.push(new e(c[a]));return new f(b)},this.addSolarSystem=function(b,e,f,g){if(c.hasOwnProperty(b)||a.hasSolarSystem(b))throw new Error("Solar System "+b+" already exists.");var h=new d(b,e,f,g),j=new i(h);c[b]=j},this.getSolarSystemIds=function(){var b,d=a.getSolarSystemIds(),e=function(a){var b=d.indexOf(a);0>b&&d.push(a)};for(b in c)c.hasOwnProperty(b)&&e(c[b].base.getId());return d.sort()},this.extendSolarSystem=function(b){var d,e=c[b];if(!e&&a.hasSolarSystem(b)&&(e=new i(a.getSolarSystem(b)),c[b]=e),!e)throw new Error("Solar System "+b+" doesn't exist.");return d=new h(c[b])}}var d=a("./EmptySolarSystem"),e=a("./ExtendedSolarSystem"),f=a("./ExtendedUniverse"),g=a("./UniverseExtensionData"),h=a("./SolarSystemExtension"),i=a("./SolarSystemExtensionData");b.exports=c},{"./EmptySolarSystem":40,"./ExtendedSolarSystem":42,"./ExtendedUniverse":43,"./SolarSystemExtension":44,"./SolarSystemExtensionData":45,"./UniverseExtensionData":47}],47:[function(a,b){"use strict";function c(a){this.base=a,this.solarSystems=[]}b.exports=c},{}],48:[function(a,b){b.exports={EmptySolarSystem:a("./EmptySolarSystem"),EmptyUniverse:a("./EmptyUniverse"),ExtendedSolarSystem:a("./ExtendedSolarSystem"),ExtendedUniverse:a("./ExtendedUniverse"),UniverseBuilder:a("./UniverseBuilder"),UniverseExtensionData:a("./UniverseExtensionData"),SolarSystemExtension:a("./SolarSystemExtension"),SolarSystemExtensionData:a("./SolarSystemExtensionData")}},{"./EmptySolarSystem":40,"./EmptyUniverse":41,"./ExtendedSolarSystem":42,"./ExtendedUniverse":43,"./SolarSystemExtension":44,"./SolarSystemExtensionData":45,"./UniverseBuilder":46,"./UniverseExtensionData":47}],49:[function(a,b){"use strict";function c(){}c.prototype.getIndex=function(a){var b=Math.floor(Math.random()*a);return b>=a&&a>0&&(b=a-1),b},b.exports=c},{}],50:[function(a,b){"use strict";var c=function(){},d=149597870700,e={GALAXY_ID_NEW_EDEN:9,GALAXY_ID_W_SPACE:9000001,METERS_PER_AU:d,METERS_PER_LY:63241*d};b.exports={DefaultRandomizer:a("./DefaultRandomizer"),constants:e,noop:c}},{"./DefaultRandomizer":49}]},{},[1])(1)});