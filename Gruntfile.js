"use strict";
var path = require("path");

module.exports = function(grunt) {
  var jsFiles = ["Gruntfile.js", "src/**/*.js", "test/**/*.js"];

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    clean: {
      jsdoc: ["build/doc"],
      coverage: ["build/instrumented", "build/reports/coverage"],
      package: ["dist"]
    },

    // Run JSHint on all sources
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      all: jsFiles
    },

    // JSBeautifier on all sources
    jsbeautifier: {
      standard: {
        src: jsFiles,
        options: {
          js: grunt.file.readJSON(".jsbeautifyrc")
        }
      }
    },

    // browserify for packing all commonjs files
    browserify: {
      client: {
        src: ["src/index.js"],
        dest: "dist/eve-route.js",
        options: {
          standalone: "everoute"
        }
      }
    },

    // uglify for compression
    uglify: {
      lib: {
        files: {
          "dist/eve-route-min.js": ["dist/eve-route.js"]
        },
        options: {
          mangle: {
            except: []
          }
        }
      }
    },

    // Run tests using mocha
    mochaTest: {
      libRaw: {
        options: {
          require: ["./test/testGlobals.js", "./test/testStandard.js"],
          reporter: "spec"
        },
        src: ["test/**/*Test.js"]
      },
      libMinified: {
        options: {
          require: ["./test/testGlobals.js", "./test/testMinified.js"],
          reporter: "spec"
        },
        src: ["test/**/*Test.js"]
      },
      coverage: {
        options: {
          require: ["./test/testGlobals.js", "./test/testCoverage.js"],
          reporter: "min"
        },
        src: ["test/**/*Test.js"]
      }
    },

    karma: {
      live: {
        options: {
          files: ["dist/eve-route.js",
            "node_modules/expect.js/expect.js",
            "node_modules/sinon/pkg/sinon.js",
            "node_modules/sinon-expect/lib/sinon-expect.js",
            "test/testGlobals.js",
            "test/**/*Test.js"
          ],
          frameworks: ["mocha"],
          client: {
            mocha: {
              ui: "bdd"
            }
          },
          reporters: ["dots"],
          autoWatch: true,
          browsers: ["PhantomJS"]
        }
      }
    },

    // tasks for coverage analysis (istanbul)
    instrument: {
      files: ["src/**/*.js"],
      options: {
        basePath: "build/instrumented/"
      }
    },
    storeCoverage: {
      options: {
        dir: "build/reports/coverage/"
      }
    },
    makeReport: {
      src: "build/reports/coverage/**/*.json",
      options: {
        type: "lcov",
        dir: "build/reports/coverage/",
        print: "text-summary" // detail, none
      }
    },

    // documentation
    jsdoc: {
      lib: {
        src: ["src/**/*.js"],
        options: {
          destination: "build/doc",
          private: false
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-istanbul");
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks("grunt-jsdoc");
  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-mocha-test");

  grunt.registerTask("lint", ["jshint"]);
  grunt.registerTask("format", ["jsbeautifier"]);
  grunt.registerTask("test", ["mochaTest:libRaw"]);
  grunt.registerTask("test-min", ["mochaTest:libMinified"]);
  grunt.registerTask("compile", ["browserify", "uglify"]);

  grunt.registerTask("document", ["clean:jsdoc", "jsdoc:lib"]);
  grunt.registerTask("coverage", ["clean:coverage", "instrument", "mochaTest:coverage", "storeCoverage", "makeReport"]);

  grunt.registerTask("package", ["clean:package", "lint", "format", "compile", "test-min", "document"]);

  grunt.registerTask("default", ["lint", "test"]);
};
