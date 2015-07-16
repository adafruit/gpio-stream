/**
 * GPIO Readable Stream
 *
 * Copyright (c) 2014 Adafruit Industries
 * Licensed under the MIT license.
 */

/**** Module dependencies ****/
var stream = require('stream'),
    util = require('util'),
    GPIO = require('onoff').Gpio;

/**** Make Readable a readable stream ****/
util.inherits(Readable, stream.Readable);

/**** Readable prototype ****/
var proto = Readable.prototype;

/**** Expose Readable ****/
exports = module.exports = Readable;

/**** Readable Constructor ****/
function Readable(pin, options) {

  if (! (this instanceof Readable)) {
    return new Readable(pin, options);
  }

  options = util._extend({
    highWaterMark: 64 * 1024 // 64k
  }, options || {});

  stream.Readable.call(this);

  this.pin = new GPIO(pin, 'in', options.edge || 'both');

  this.watch();

}

proto.pin = false;
proto.watching = false;
proto.buf = [];

proto.watch = function() {

  this.pin.watch(function(err, state) {
    this.buf.push(state);
    this.emit('changed', state);
  }.bind(this));

  this.watching = true;
  this.emit('watching');

};

proto._read = function() {

  if(! this.watching) {
    return this.once('watching', function() {
      this._read();
    });
  }

  if(this.buf.length === 0) {
    return this.once('changed', function() {
      this._read();
    });
  }

  this.push(this.buf.shift().toString() + '\n');

};

