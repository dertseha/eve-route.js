## EVE-Route.js Usage Documentation

These pages cover the basics in using and extending EVE-Route.js .

For a detailed description on the API, please run grunt task ```document``` and read the files under ```bulid/doc/```.

### High-Level Design
For the purpose of path-finding, EVE-Route.js knows a ```Universe``` that consists of ```SolarSystems``` which are connected through ```Jumps```. A ```Jump``` has a type that specifies how the transition from one system to another is performed.
```TravelCapabilities``` determine which types of jumps can be used to get from one system to another.

Any form of travel may be associated with ```TravelCosts```. Crossing the universe accumulates costs which are compared using ```TravelRules```.

A ```Path``` consists of a sequence of ```Steps``` which are transitions from one point in the universe to another.
The ```PathFinder``` uses a ```TravelCapability``` to get from a starting system to a destination as determined by the ```SearchCriterion```. It furthermore uses a ```TravelRule``` to determine the shortest path to a destination.

A ```Route``` is a sequence of paths that connect a starting system to a destination via a list of waypoints. While the destination is fixed, the order of the waypoints can change. The ```RouteFinder``` uses a genetic algorithm to 'solve' the travelling-salesman-problem (TSP) in a reasonably short time by sacrificing accuracy.

### Initialization
In any case a universe will be necessary for searching paths and routes. Instances of the Universe class are built using the UniverseBuilder. A UniverseBuilder needs another universe as a basis. See "Extensions" below for the idea behind this.

To get out of this loop, the library provides an EmptyUniverse, which contains nothing. Start building your universe with one of the following options:
```JavaScript
var newBuilder1 = everoute.newUniverseBuilder(); // convenience function
var newBuilder2 = new everoute.universe.UniverseBuilder(new everoute.universe.EmptyUniverse());
var newBuilder3 = (new everoute.universe.EmptyUniverse()).extend();
```

Use then the builder to add or extend solar systems. The ID of a solar system can exist only once in the universe, but one solar system can be extended in many ways.

#### Creating a very simple universe
The following example adds the systems of Rens and Frarn and adds a unidirectional jump from Rens to Frarn. Finally, common costs are added to the universe.
```
var builder = everoute.newUniverseBuilder();

function addSolarSystem(systemId, galaxyId, regionId, constellationId, x, y, z, security) {
  var contextIds = {
    galaxyId: galaxyId,
    regionId: regionId,
    constellationId: constellationId
  };
  var location = new everoute.travel.SpecificLocation(x, y, z);

  builder.addSolarSystem(systemId, contextIds, location, security);

  return builder.extendSolarSystem(systemId);
}

var rens = addSolarSystem(30002510, 9, ...);
var frarn = addSolarSystem(30002526, 9, ...);

rens.addJump(everoute.travel.capabilities.jumpGate.JUMP_TYPE, 30002526);

everoute.travel.rules.transitCount.extendUniverse(builder);
everoute.travel.rules.security.extendUniverse(builder);
```
#### Sealing the extensions
When done building your universe, call
```
var universe = builder.build();
```
The returned universe is an immutable, read-only object and can be used for path finding or further extensions.

### Running path finding
#### Setup
To search a path, a ```PathFinder``` must be created with instances of
* A start path (Typically the result of universe.getSolarSytem(xxx).startPath() )
* A travel capability - which should be an instance of everoute.travel.capabilities.OptimizingTravelCapability
* An instance of a ```SearchCriterion``` and
* An instance of a ```PathSearchResultCollector```.

The work of the optimized path finding has been split up between the PathFinder and the OptimizingTravelCapability for easier testing. The OptimizingTravelCapability contains the actual travel capability, as well as the logic that considers the travel rule.

At best, see the ```NewEdenGateTravelTest``` (under ```test/integration/```) for an example setup using jump gate travel and simple rules (transit count, security)
#### Running the search
Since searching the universe will take time, the search is run in iterations under the control of the user. Call ```PathFinder.continueSearch()``` until this function returned false.

During each of these calls, a result could have been notified to the collector. When the search is completed, the latest results are the best as per the rule.

### Running route finding
#### Setup
Setting up the search for a route using the ```RouteFinder``` is similar to that of the ```PathFinder```. But since the finder has several parameters, with a few of them optional, a dedicated ```RouteFinderBuilder``` exists.

For an example, see again the ```NewEdenGateTravelTest```.

### Extensions
The concept of an immutable Universe and an extending UniverseBuilder was introduced to allow easy reuse of basic universe data. Creating the universe with its thousands of solar systems, their standard costs as well as jumps (gates, ...) takes time.

This way, seldom changed universe data can be built and reused for more regular changes, as well as different uses in parallel. Imagine using the library in a server based setup where multiple users want to have their specific universe data taken into account - data such as jump bridges and standings.

Life data from the cluster could also be introduced.

Typically, a chain could look like this:
BaseUniverse (containing the static cluster map information) ->
UserUniverse (containing user specific data, such as jump bridges) ->
LifeUniverse (containing life cluster data)

(This under the assumption that user data changes less frequent than the life data.)
