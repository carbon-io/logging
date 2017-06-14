var assert = require('assert')

var _ = require('lodash')

var __ = require('@carbon-io/fibers').__(module)
var _o = require('@carbon-io/bond')._o(module)
var o = require('@carbon-io/atom').o(module)
var testtube = require('@carbon-io/test-tube')

var util = require('./util')

var carbonLog = require('../lib')

__(function() {
  module.exports = o.main({
    _type: testtube.Test,
    name: 'configureTests',
    tests: [
      o({
        _type: testtube.Test,
        name: 'SimpleConfigureTest',
        setup: function() {
          this.stream = new util.StringIO()
        },
        teardown: function() {
          carbonLog._reset()
        },
        doTest: function() {
          var logger = carbonLog.createLogger({
            name: 'foo',
            level: 'INFO',
            stream: this.stream
          })
          logger.info('foo')
          carbonLog.configure({
            'foo': {
              level: 'WARN'
            }
          })
          logger.info('bar')
          logger.warn('baz')
          var records = this.stream.getValue()
          assert.equal(records.length, 2)
          assert.equal(records[0].level, carbonLog.levels.INFO)
          assert.equal(records[1].level, carbonLog.levels.WARN)
        }
      }),
      o({
        _type: testtube.Test,
        name: 'SimpleConfigureTreeTest',
        setup: function() {
          this.stream1 = new util.StringIO()
          this.stream2 = new util.StringIO()
        },
        teardown: function() {
          carbonLog._reset()
        },
        doTest: function() {
          var logger1 = carbonLog.createLogger({
            name: 'foo.bar',
            level: 'INFO',
            stream: this.stream1
          })
          var logger2 = carbonLog.createLogger({
            name: 'foo.yaz.baz',
            level: 'WARN',
            stream: this.stream2
          })
          logger1.info('foo')
          logger2.warn('bar')
          carbonLog.configure({
            'foo.*': {
              level: 'ERROR'
            }
          })
          logger1.info('bar')
          logger2.warn('baz')
          logger1.error('bar')
          logger2.fatal('baz')
          var records1 = this.stream1.getValue()
          var records2 = this.stream2.getValue()
          assert.equal(records1.length, 2)
          assert.equal(records2.length, 2)
          assert.equal(records1[0].level, carbonLog.levels.INFO)
          assert.equal(records1[1].level, carbonLog.levels.ERROR)
          assert.equal(records2[0].level, carbonLog.levels.WARN)
          assert.equal(records2[1].level, carbonLog.levels.FATAL)
        }
      }),
      o({
        _type: testtube.Test,
        name: 'ConfigureTest',
        setup: function() {
          var stream = require('stream')
          this.stream1 = new util.StringIO()
          this.stream2 = new util.StringIO()
        },
        teardown: function() {
          carbonLog._reset()
        },
        doTest: function() {
          var logger = carbonLog.createLogger({
            name: 'foo.bar',
            level: 'INFO',
            stream: this.stream1
          })
          debugger
          logger.info('foo')
          carbonLog.configure({
            'foo.*': {
              level: 'ERROR',
              streams: [
                {
                  level: 'WARN',
                  stream: this.stream2
                }
              ]
            }
          })
          logger.info('bar')
          logger.warn('baz')
          logger.error('yaz')
          var records1 = this.stream1.getValue()
          var records2 = this.stream2.getValue()
          assert.equal(records1.length, 1)
          assert.equal(records2.length, 2)
          assert.equal(records1[0].level, carbonLog.levels.INFO)
          assert.equal(records2[0].level, carbonLog.levels.WARN)
          assert.equal(records2[1].level, carbonLog.levels.ERROR)
        }
      })
    ]
  })
})

