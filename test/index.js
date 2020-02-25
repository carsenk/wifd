var wif = require('../')
var fixtures = require('./fixtures')
var tape = require('tape')
var Buffer = require('safe-buffer').Buffer

fixtures.valid.forEach(function (f) {
  tape('encode/encodeRaw returns ' + f.WIF + ' for ' + f.privateKeyHex.slice(0, 20) + '... (' + f.version + ')', function (t) {
    t.plan(1)

    var privateKey = Buffer.from(f.privateKeyHex, 'hex')
    var actual = wif.encode(f.version, privateKey, f.compressed)
    t.equal(actual, f.WIF)
  })
})

fixtures.valid.forEach(function (f) {
  tape('decode/decodeRaw returns ' + f.privateKeyHex.slice(0, 20) + '... (' + f.version + ')' + ' for ' + f.WIF, function (t) {
    t.plan(3)

    var actual = wif.decode(f.WIF, f.version)
    t.equal(actual.version, f.version)
    t.equal(actual.privateKey.toString('hex'), f.privateKeyHex)
    t.equal(actual.compressed, f.compressed)
  })
})

fixtures.invalid.encode.forEach(function (f) {
  tape('throws ' + f.exception + ' for ' + f.privateKeyHex, function (t) {
    t.plan(1)
    t.throws(function () {
      wif.encode(f.version, Buffer.from(f.privateKeyHex, 'hex'))
    }, new RegExp(f.exception))
  })
})

fixtures.invalid.decode.forEach(function (f) {
  tape('throws ' + f.exception + ' for ' + f.WIF, function (t) {
    t.plan(1)
    t.throws(function () {
      wif.decode(f.WIF, f.version)
    }, new RegExp(f.exception))
  })
})

fixtures.valid.forEach(function (f) {
  tape('decode/encode for ' + f.WIF, function (t) {
    t.plan(1)

    var actual = wif.encode(wif.decode(f.WIF, f.version))
    t.equal(actual, f.WIF)
  })
})
