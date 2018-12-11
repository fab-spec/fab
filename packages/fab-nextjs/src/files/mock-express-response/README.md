# mock-express-response

[![Build Status](https://travis-ci.org/lykmapipo/mock-express-response.svg?branch=master)](https://travis-ci.org/lykmapipo/mock-express-response)

Nodejs library to mock [expressjs](https://github.com/strongloop/express/) http response based on [mock-res](https://github.com/diachedelic/mock-res)

See [mock-express-request](https://github.com/lykmapipo/mock-express-request) to mock express http request.

*Note: The mocked response instance have the same properties and methods as an instance of express http response*

## Installation
```sh
$ npm install --save-dev mock-express-response
```

## Usage
```js
var ejs = require('ejs');
var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');

// Basic usage
var response = new MockExpressResponse();

// With options
var response = new MockExpressResponse({
    render: ejs.renderFile, //use ejs as template engine
    request: new MockExpressRequest({
    //request options
    ...
    });
    ...
});

//express response methods
//and properties

//send json response
response.json({user:{active:true}});

//render a template
response.render('user.ejs',{user:{active:true}});

//send a response
response.send('<p>Hi</p>');

...

//to obtain json response
var result = response._getJSON();

//to obtain text/html response
var result = response._getString();

...

```

## TODO
- [ ] File send mock


## Testing
* Clone this repository

* Install all development dependencies
```sh
$ npm install
```

* Then run test
```sh
$ npm test
```


## Contribute
It will be nice, if you open an issue first so that we can know what is going on, then, fork this repo and push in your ideas. Do not forget to add a bit of test(s) of what value you adding.


## Licence
The MIT License (MIT)

Copyright (c) 2015 lykmapipo & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 