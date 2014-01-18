/* global everoute, describe, it, beforeEach, expect, sinon */
"use strict";

describe("Path", function() {
  var AddingTravelCost = everoute.travel.AddingTravelCost;
  var AnyLocation = everoute.travel.AnyLocation;
  var Path = everoute.travel.Path;
  var StepBuilder = everoute.travel.StepBuilder;

  describe("sequence", function() {
    var firstStep;
    var path;

    beforeEach(function() {
      firstStep = createStep();

      path = new Path(firstStep);
    });

    it("should be the start if no previous provided", function() {
      var result = path.isStart();

      expect(result).to.be.equal(true);
    });

    it("should allow extending the path with another step", function() {
      var newPath = path.extend(createStep());

      expect(newPath).to.be.a(Path);
    });

    it("should not be the first anymore when extended", function() {
      var newPath = path.extend(createStep());
      var result = newPath.isStart();

      expect(result).to.be.equal(false);
    });

    it("should provide the previous path", function() {
      var newPath = path.extend(createStep());
      var result = newPath.getPrevious();

      expect(result).to.be.equal(path);
    });

    it("should throw an error when asked for the preceeding path if first", function() {
      var fn = function() {
        path.getPrevious();
      };

      expect(fn).to.throwError();
    });

    it("should provide all steps of the path up to this point", function() {
      var nextStep = createStep();
      var newPath = path.extend(nextStep);
      var result = newPath.getSteps();

      expect(result).to.be.eql([firstStep, nextStep]);
    });

    function createStep() {
      return new StepBuilder(0).build();
    }
  });

  describe("costs", function() {
    it("should start with the costs from the first step", function() {
      var costs = [createCost("time", 100), createCost("money", 10)];
      var step = createStep(costs);
      var path = new Path(step);
      var costSum = path.getCostSum();

      expect(costSum.getTotal()).to.be.eql(costs);
    });

    it("should accumulate costs with new steps", function() {
      var path = new Path(createStep([createCost("money", 10)]));
      path = path.extend(createStep([createCost("money", 20)]));
      var costSum = path.getCostSum();

      expect(costSum.getTotal()[0].getValue()).to.be.equal(30);
    });

    function createCost(type, value) {
      return new AddingTravelCost(type, value);
    }

    function createStep(costs) {
      return new StepBuilder(0).withEnterCosts(costs).build();
    }
  });
});
