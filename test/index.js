var __ = require('@carbon-io/fibers').__(module)
var _o = require('@carbon-io/bond')._o(module)
var o = require('@carbon-io/atom').o(module)
var testtube = require('@carbon-io/test-tube')

__(function() {
  module.exports = o.main({
    _type: testtube.Test,
    name: 'CarbonLogTestSuite',
    tests: [
      _o('./createLoggerTests'),
      _o('./getLoggerTests'),
      _o('./configureTests'),
      _o('./basicConfigTests'),
      _o('./LoggerTests'),
      _o('./streams')
    ]
  })
})

