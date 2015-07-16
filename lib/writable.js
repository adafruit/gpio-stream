/**
 * GPIO Writable Stream
 *
 * Copyright (c) 2014 Adafruit Industries
 * Licensed under the MIT license.
 */

/**** Module dependencies ****/
var stream = require('stream'),
    util = require('util'),
    GPIO = require('onoff').Gpio;

/**** Make Writable a duplex stream ****/
util.inherits(Writable, stream.Duplex);

/**** Writable prototype ****/
var proto = Writable.prototype;

/**** Expose Writable ****/
exports = module.exports = Writable;

/**** Writable constructor ****/
function Writable(pin, options) {

  if (! (this instanceof Writable)) {
    return new Writable(pin, options);
  }

  stream.Duplex.call(this);

  this.pin = new GPIO(pin, 'out');

}

proto.pin = false;
proto.buf = [];

proto._write = function(data, encoding, cb) {

  var state = parseInt(data.toString('utf8'));

  this.pin.write(state, function(err) {

    if(err) {
      return cb(err);
    }

    this.buf.push(data);
    this.emit('changed', data);

    cb();

  }.bind(this));

};

proto._read = function() {

  if(this.buf.length === 0) {
    return this.once('changed', function() {
      this._read();
    });
  }

  this.push(this.buf.shift());

};

