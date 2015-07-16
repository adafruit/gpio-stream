# GPIO Stream

GPIO Stream allows you to pipe around inputs and outputs on the Raspberry Pi using the
[node.js stream API](http://nodejs.org/api/stream.html#stream_api_for_stream_consumers).
Why is this a good thing? Node streams allow you to pipe output from one stream to the
input of another stream, just like [unix pipes](https://en.wikipedia.org/wiki/Pipeline_%28Unix%29).
Streams make it easy to combine small chunks of code into complex systems with very little effort.

## Installing

    npm install gpio-stream

## A Simple Example

Let's say we want to view the state of the button from our SSH connection. Since *stdout* is
a writable stream, we can pipe the output of the button directly to *stdout*.

![led gif](https://uniontownlabs.org/images/gpio_stream/stdout.gif)

```js
var GpioStream = require('gpio-stream'),
    button = GpioStream.readable(17);

// pipe the button presses to stdout
button.pipe(process.stdout);
```

## Next Steps

Now let's try a simple example of how to pipe the output of a button to an LED.

![led gif](https://uniontownlabs.org/images/gpio_stream/led.gif)

```js
var GpioStream = require('gpio-stream'),
    button = GpioStream.readable(17),
    led = GpioStream.writable(18);

// pipe the button presses to the LED
button.pipe(led);
```

## Going Further

What else can we do with this? How about streaming the button presses to a LED & to a web browser?
Since the node.js HTTP server response is a writable stream, we can pipe the button presses to the LED,
and then to the HTTP response object. Your browser can receive the presses on the fly using
[chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding). All of that
with ~10 lines of code!

![browser gif](https://uniontownlabs.org/images/gpio_stream/browser.gif)

```js
var GpioStream = require('gpio-stream'),
    http = require('http'),
    button = GpioStream.readable(17),
    led = GpioStream.writable(18);

var stream = button.pipe(led);

http.createServer(function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.write('<pre>logging button presses:\n');
  stream.pipe(res);
}).listen(8080);
```

## License
Copyright (c) 2014 Adafruit Industries. Licensed under the MIT license.
