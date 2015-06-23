[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

**This project is discontinued. It has been superseded by [everoute](https://github.com/dertseha/everoute), an implementation in Go. Should someone find reuse of this library, I'd be happy about a reference.**

## EVE-Route.js

This JavaScript library provides a route calculator and optimizer for ship travel in [EVE Online](https://www.eveonline.com/).
The calculator can use and combine travel capabilities of any kind (jump gates, jump drive, wormholes, ...) and restricts the path finding by rules (length, security ratings, jump distances, ...). The waypoint optimizer is using a genetic algorithm to provide decent routes within short time.

An interface based design allows extensions to be made regarding rules and search criteria; For example, a rule could be written, combining live API data, to avoid systems with certain SOV.

The library is built to be used either in the browser *), or as a service (running Node.js). It has no library dependencies, other than a modern JavaScript VM.

*) Compatibility with the In-Game-Browser (IGB) of EVE Online is not focus of this library, although tests are performed occasionally.

### Documentation
How to use and extend EVE-Route.js is described in separate pages in the ```doc/``` subdirectory.

The direct API documentation (extract from the source JSDoc comments) can be generated by running ```grunt documentation```, which will store the files under ```build/doc/```.

### Installation
Note: The library does not provide any EVE related resources, especially the necessary map data. If the library is being used in a mapping application, most of the required information will be there already anyway.

#### Node.js (NPM)
```npm install eve-route --save```

In code, call ```var everoute = require("eve-route");```

#### Raw Library
The ```dist/``` subdirectory contains the browserified files, both in raw and minified. Copy the files you need.

## Development
### grunt tasks
* The ```default``` task performs lint and test; Typically used during development.
* The ```package``` task runs all tasks to prepare the library for release.
* ```coverage``` runs code coverage analysis. Reports are saved under ```build/reports/coverage/```.

### Contribution
Please adhere to the styleguides of JSHint and JSBeautify as specified in the respective .rc files (The ```package``` task also runs jsbeautify on the sources). An .editorconfig is also provided.

Keep the JSDoc annotations up to date. Note that the used annotations are a mixture of those for JSDoc and those understood by the google-closure compiler. So far this compiler hasn't been used on the library, so it's not clear whether all currently fit.

## License

The project is available under the terms of the **New BSD License** (see LICENSE file).

[npm-url]: https://npmjs.org/package/eve-route
[npm-image]: https://badge.fury.io/js/eve-route.png
[travis-url]: https://travis-ci.org/dertseha/eve-route.js
[travis-image]: https://travis-ci.org/dertseha/eve-route.js.png?branch=master
[coveralls-url]: https://coveralls.io/r/dertseha/eve-route.js
[coveralls-image]: https://coveralls.io/repos/dertseha/eve-route.js/badge.png
[depstat-url]: https://david-dm.org/dertseha/eve-route.js
[depstat-image]: https://david-dm.org/dertseha/eve-route.js.png?theme=shields.io
