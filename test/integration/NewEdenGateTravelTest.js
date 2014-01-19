/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("New Eden Gate Travel", function() {
  var SpecificLocation = everoute.travel.SpecificLocation;
  var AddingTravelCost = everoute.travel.AddingTravelCost;
  var PathFinder = everoute.travel.search.PathFinder;
  var AnyLocation = everoute.travel.AnyLocation;
  var Path = everoute.travel.Path;
  var PathContest = everoute.travel.PathContest;
  var StaticPathContestProvider = everoute.travel.StaticPathContestProvider;
  var StepBuilder = everoute.travel.StepBuilder;
  var OptimizingTravelCapability = everoute.travel.capabilities.OptimizingTravelCapability;
  var DestinationSystemSearchCriterion = everoute.travel.search.DestinationSystemSearchCriterion;
  var TravelRuleset = everoute.travel.rules.TravelRuleset;
  var NaturalOrderTravelRule = everoute.travel.rules.NaturalOrderTravelRule;
  var JumpGateTravelCapability = everoute.travel.capabilities.jumpGate.JumpGateTravelCapability;

  var solarSystemNamesById = {};
  var solarSystemIdsByName = {};
  var universe;


  it("should find a route from Rens to Pator", function() {
    verifyRoute("Rens", "Pator", ["Rens", "Frarn", "Gyng", "Onga", "Pator"]);
  });

  it("should find a route from Rens to Ivar", function() {
    // second route exists, this one is found with test-data; is order dependent.
    verifyRoute("Rens", "Ivar", ["Rens", "Frarn", "Meirakulf", "Ivar"]);
  });

  function verifyRoute(from, to, expected) {
    var result;
    var start = universe.getSolarSystem(getIdByName(from)).startPath();
    var rules = [everoute.travel.rules.transitCount.getRule()];
    var contest = new PathContest(new TravelRuleset(rules));
    var gateCapability = new JumpGateTravelCapability(universe);
    var capability = new OptimizingTravelCapability(gateCapability, new StaticPathContestProvider(contest));
    var criterion = new DestinationSystemSearchCriterion(getIdByName(to));
    var collector = {
      collect: function(path) {
        var steps = path.getSteps();

        result = [];
        steps.forEach(function(step) {
          result.push(solarSystemNamesById[step.getSolarSystemId()]);
        });
      }
    };
    var finder = new PathFinder(start, capability, criterion, collector);

    var count = 0;
    var shouldContinue = true;

    while (shouldContinue && count < 1000) {
      count++;
      shouldContinue = finder.continueSearch();
    }

    expect(result).to.be.eql(expected);
  }

  function getIdByName(name) {
    return solarSystemIdsByName[name];
  }

  var solarSystemData = [
    // [solarSystemId,regionId,constellationId,solarSystemName,x,y,z,security],
    [30002505, 10000030, 20000367, "Hulm", -86842, 37503, -3050, 1],
    [30002506, 10000030, 20000367, "Osoggur", -119198, 43271, 184, 0.532],
    [30002507, 10000030, 20000367, "Abudban", -107535, 48044, -584, 0.732],
    [30002508, 10000030, 20000367, "Trytedald", -94291, 41056, 10846, 0.88],
    [30002509, 10000030, 20000367, "Odatrik", -98872, 42721, 14036, 0.816],
    [30002510, 10000030, 20000367, "Rens", -99122, 40335, 2868, 0.895],
    [30002511, 10000030, 20000367, "Ameinaka", -85688, 35891, -7478, 0.987],
    [30002512, 10000030, 20000368, "Alakgur", -116055, 50922, 5166, 0.559],
    [30002513, 10000030, 20000368, "Dammalin", -118154, 56822, 2655, 0.479],
    [30002514, 10000030, 20000368, "Bosboger", -125234, 63042, -1847, 0.325],
    [30002515, 10000030, 20000368, "Olfeim", -122707, 51195, -3417, 0.439],
    [30002516, 10000030, 20000368, "Lulm", -120046, 67341, -2421, 0.344],
    [30002517, 10000030, 20000368, "Gulmorogod", -120834, 62359, -7850, 0.377],
    [30002518, 10000030, 20000369, "Edmalbrurdus", -85393, 34989, 122, 0.989],
    [30002519, 10000030, 20000369, "Kronsur", -88283, 24999, 3072, 0.882],
    [30002520, 10000030, 20000369, "Dumkirinur", -81418, 15689, -1693, 0.707],
    [30002521, 10000030, 20000369, "Sist", -86493, 19592, -3696, 0.808],
    [30002522, 10000030, 20000369, "Obrolber", -79481, 10152, -6744, 0.567],
    [30002523, 10000030, 20000369, "Austraka", -73392, 20965, -13057, 0.756],
    [30002524, 10000030, 20000370, "Ivar", -92445, 41314, -9220, 0.956],
    [30002525, 10000030, 20000370, "Meirakulf", -94607, 42891, -17284, 0.882],
    [30002526, 10000030, 20000370, "Frarn", -96357, 40717, -24433, 0.839],
    [30002527, 10000030, 20000370, "Illinfrik", -93809, 45357, -29101, 0.846],
    [30002528, 10000030, 20000370, "Balginia", -96097, 50612, -31360, 0.818],
    [30002529, 10000030, 20000370, "Gyng", -100859, 42096, -24837, 0.798],
    [30002530, 10000030, 20000370, "Avesber", -105003, 39806, -24278, 0.753],
    [30002531, 10000030, 20000371, "Gerek", -72828, 20270, -21602, 0.732],
    [30002532, 10000030, 20000371, "Tongofur", -71416, 13469, -18639, 0.583],
    [30002533, 10000030, 20000371, "Gerbold", -67259, 25611, -29803, 0.823],
    [30002534, 10000030, 20000371, "Rokofur", -77821, 14240, -24992, 0.618],
    [30002535, 10000030, 20000371, "Ebasgerdur", -75787, 22347, -23240, 0.774],
    [30002536, 10000030, 20000371, "Ebodold", -71452, 7348, -14167, 0.445],
    [30002537, 10000030, 20000372, "Amamake", -124292, 44194, -6110, 0.439],
    [30002538, 10000030, 20000372, "Vard", -128361, 37338, -5423, 0.379],
    [30002539, 10000030, 20000372, "Siseide", -132246, 40995, -5455, 0.338],
    [30002540, 10000030, 20000372, "Lantorn", -130875, 32231, -8113, 0.339],
    [30002541, 10000030, 20000372, "Dal", -125768, 34454, -9690, 0.411],
    [30002542, 10000030, 20000372, "Auga", -128082, 42733, -6569, 0.385],
    [30002543, 10000030, 20000373, "Eystur", -98294, 48222, -64110, 0.949],
    [30002544, 10000030, 20000373, "Pator", -93579, 43781, -56562, 1],
    [30002545, 10000030, 20000373, "Lustrevik", -97109, 34275, -54822, 0.946],
    [30002546, 10000030, 20000373, "Isendeldik", -90395, 21513, -49071, 0.809],
    [30002547, 10000030, 20000373, "Ammold", -85349, 18749, -45430, 1],
    [30002548, 10000030, 20000373, "Emolgranlan", -88317, 10307, -39043, 0.53],
    [30002549, 10000030, 20000374, "Offugen", -68199, 17322, -32842, 0.65],
    [30002550, 10000030, 20000374, "Roniko", -61064, 16690, -31438, 0.594],
    [30002551, 10000030, 20000374, "Aralgrund", -59185, 5943, -26168, 0.322],
    [30002552, 10000030, 20000374, "Eddar", -68872, 15029, -38080, 0.587],
    [30002553, 10000030, 20000374, "Bogelek", -70364, 4402, -24614, 0.366],
    [30002554, 10000030, 20000374, "Wiskeber", -55692, 11404, -25186, 0.404],
    [30002555, 10000030, 20000375, "Eifer", -85147, 6553, -38370, 0.445],
    [30002556, 10000030, 20000375, "Gusandall", -78639, 3969, -41445, 0.377],
    [30002557, 10000030, 20000375, "Atgur", -82094, 8405, -33005, 0.483],
    [30002558, 10000030, 20000375, "Endrulf", -78991, 14655, -33847, 0.615],
    [30002559, 10000030, 20000375, "Ingunn", -84032, -2039, -34775, 0.277],
    [30002560, 10000030, 20000375, "Gultratren", -88994, -450, -26557, 0.309],
    [30002561, 10000030, 20000375, "Auren", -73354, 7038, -42357, 0.418],
    [30002562, 10000030, 20000376, "Trer", -63236, 21988, -39567, 0.713],
    [30002563, 10000030, 20000376, "Egmur", -63657, 20957, -44902, 0.656],
    [30002564, 10000030, 20000376, "Javrendei", -57296, 33381, -40392, 0.879],
    [30002565, 10000030, 20000376, "Appen", -57178, 34533, -45745, 0.821],
    [30002566, 10000030, 20000376, "Klir", -51824, 34294, -45095, 0.757],
    [30002567, 10000030, 20000376, "Jorus", -51522, 39688, -48931, 0.727],
    [30002568, 10000030, 20000377, "Onga", -98103, 42557, -47692, 0.954],
    [30002569, 10000030, 20000377, "Osaumuni", -94491, 41521, -41514, 0.915],
    [30002570, 10000030, 20000377, "Magiko", -94565, 35821, -47891, 0.938],
    [30002571, 10000030, 20000377, "Oremmulf", -92990, 45950, -38921, 0.897],
    [30002572, 10000030, 20000377, "Hurjafren", -90467, 52049, -39137, 0.877],
    [30002573, 10000030, 20000377, "Vullat", -88986, 41749, -50058, 0.971],
    [30002574, 10000030, 20000378, "Hrondedir", -64919, 4088, -37276, 0.317],
    [30002575, 10000030, 20000378, "Sotrenzur", -72205, -189, -36626, 0.276],
    [30002576, 10000030, 20000378, "Hrondmund", -59005, 8809, -41834, 0.359],
    [30002577, 10000030, 20000378, "Bundindus", -59713, 13093, -47523, 0.429],
    [30002578, 10000030, 20000378, "Otraren", -58260, 17647, -51463, 0.475],
    [30002579, 10000030, 20000378, "Hedgiviter", -52452, 16814, -48100, 0.416],
    [30002580, 10000030, 20000378, "Katugumur", -73519, -7412, -32351, 0.171],
    [30012505, 10000030, 20000367, "Malukker", -82688, 35891, -4478, 0.988],
    [30012547, 10000030, 20000373, "Hadaugago", -101294, 48222, -61110, 0.949],
    [30022547, 10000030, 20000377, "Krilmokenur", -101103, 42557, -44692, 0.912],
    [30032505, 10000030, 20000369, "Todeko", -84393, 34989, -1878, 0.992],
    [30032547, 10000030, 20000377, "Larkugei", -93491, 41521, -43514, 0.933],
    [30042505, 10000030, 20000370, "Usteli", -89445, 41314, -12220, 0.951],
    [30042547, 10000030, 20000377, "Loguttur", -89986, 41749, -47058, 0.957]
  ];

  var jumpData = [
    [30002505, 30002511],
    [30002505, 30002518],
    [30002506, 30002507],
    [30002506, 30002537],
    [30002507, 30002509],
    [30002507, 30002510],
    [30002507, 30002512],
    [30002507, 30002530],
    [30002508, 30002509],
    [30002508, 30002524],
    [30002509, 30002510],
    [30002510, 30002526],
    [30002511, 30002524],
    [30002511, 30012505],
    [30002512, 30002513],
    [30002513, 30002514],
    [30002513, 30002515],
    [30002514, 30002516],
    [30002514, 30002517],
    [30002516, 30002517],
    [30002517, 30002537],
    [30002518, 30002519],
    [30002518, 30032505],
    [30002519, 30002520],
    [30002519, 30002521],
    [30002520, 30002521],
    [30002520, 30002522],
    [30002522, 30002523],
    [30002523, 30002531],
    [30002524, 30002525],
    [30002524, 30042505],
    [30002525, 30002526],
    [30002526, 30002527],
    [30002526, 30002529],
    [30002526, 30002530],
    [30002527, 30002528],
    [30002527, 30002569],
    [30002528, 30002572],
    [30002529, 30002530],
    [30002529, 30002568],
    [30002531, 30002532],
    [30002531, 30002533],
    [30002531, 30002534],
    [30002531, 30002535],
    [30002532, 30002536],
    [30002533, 30002549],
    [30002534, 30002535],
    [30002534, 30002560],
    [30002537, 30002538],
    [30002537, 30002539],
    [30002537, 30002541],
    [30002537, 30002542],
    [30002538, 30002539],
    [30002538, 30002540],
    [30002538, 30002541],
    [30002539, 30002540],
    [30002539, 30002541],
    [30002539, 30002542],
    [30002540, 30002541],
    [30002541, 30002542],
    [30002543, 30002544],
    [30002543, 30002545],
    [30002543, 30002573],
    [30002543, 30012547],
    [30002544, 30002545],
    [30002544, 30002547],
    [30002544, 30002568],
    [30002545, 30002546],
    [30002545, 30002568],
    [30002546, 30002547],
    [30002547, 30002548],
    [30002548, 30002555],
    [30002549, 30002550],
    [30002549, 30002552],
    [30002550, 30002551],
    [30002550, 30002574],
    [30002551, 30002553],
    [30002551, 30002554],
    [30002552, 30002561],
    [30002552, 30002562],
    [30002553, 30002580],
    [30002555, 30002556],
    [30002555, 30002557],
    [30002555, 30002558],
    [30002556, 30002559],
    [30002556, 30002561],
    [30002556, 30002574],
    [30002556, 30002575],
    [30002557, 30002558],
    [30002559, 30002560],
    [30002559, 30002575],
    [30002562, 30002563],
    [30002562, 30002564],
    [30002564, 30002565],
    [30002565, 30002566],
    [30002566, 30002567],
    [30002568, 30002569],
    [30002568, 30002570],
    [30002568, 30022547],
    [30002569, 30002571],
    [30002569, 30032547],
    [30002570, 30002573],
    [30002571, 30002572],
    [30002573, 30042547],
    [30002574, 30002575],
    [30002574, 30002576],
    [30002575, 30002580],
    [30002576, 30002577],
    [30002577, 30002578],
    [30002578, 30002579]
  ];

  function buildUniverse() {
    var builder = everoute.newUniverseBuilder();

    solarSystemData.forEach(function(solarSystemData) {
      var location = new SpecificLocation(solarSystemData[4], solarSystemData[5], solarSystemData[6]);
      var id = solarSystemData[0];
      var contextIds = {
        galaxyId: 9,
        regionId: solarSystemData[1],
        constellationId: solarSystemData[2]
      };
      var trueSec = solarSystemData[7];
      var name = solarSystemData[3];

      builder.addSolarSystem(id, contextIds, location, trueSec);

      solarSystemNamesById[id] = name;
      solarSystemIdsByName[name] = id;
    });

    everoute.travel.rules.transitCount.extendUniverse(builder);

    function addGateJump(fromId, toId) {
      var extension = builder.extendSolarSystem(fromId);

      extension.addJump(everoute.travel.capabilities.jumpGate.JUMP_TYPE, toId);
    }

    jumpData.forEach(function(entry) {
      addGateJump(entry[0], entry[1]);
      addGateJump(entry[1], entry[0]);
    });

    universe = builder.build();
  }

  buildUniverse();

});
