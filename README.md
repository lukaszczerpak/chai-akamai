# Chai Akamai

> Chai assertions for testing Akamai configurations.

#### Features

- Akamai Staging Network assertion
- Akamai configuration variable assertion
- Akamai Cookie Token assertion
- full `Set-Cookie` assertion

#### Installation

Install via [npm](http://npmjs.org).

    npm install lukaszczerpak/chai-akamai

#### Plugin

Use this plugin as you would all other Chai plugins.

```js
const chai = require('chai');

chai.use(require('chai-akamai'));
```

## Assertions

The Chai Akamai module provides a number of assertions
for the `expect` and `should` interfaces.

### .akamaiStaging

Assert that a `Response` object comes from Akamai Staging Network.

```js
expect(res).to.be.akamaiStaging
```

### .akamaiVariable (key[, value])

* **@param** _{String}_ Configuration Variable key
* **@param** _{String|RegExp}_ Configuration Variable value (optional)

Assert that a `Response` object has a Configuration Variable.
If a value is provided, equality to value will be asserted.
You may also pass a regular expression to check.

```js
expect(res).to.have.akamaiVariable('PMUSER_MYVAR1', 'abc');
```

### .cookie

* **@param** _{String}_ parameter name
* **@param** _{String|RegExp}_ parameter value

Assert that a `Request` or `Response` object has a cookie header with a
given key, (optionally) equal to value.
You may also pass a regular expression to check.

```js
expect(req).to.have.cookie('session_id');
expect(req).to.have.cookie('session_id', '1234');
expect(req).to.not.have.cookie('PHPSESSID');
expect(res).to.have.cookie('session_id');
expect(res).to.have.cookie('session_id', '1234');
expect(res).to.not.have.cookie('PHPSESSID');
expect(req).to.have.cookie('mycookie1', /^text/);
```

### .akamaiCookieToken

* **@param** _{String}_ cookie name

Assert that a `Response` object has a cookie token with given name.

```js
expect(res).to.have.akamaiCookieToken('paywall').to.have.property('data').to.be.equal('userid=1234');
expect(res).to.have.akamaiCookieToken('paywall').to.have.property('exp').to.be.closeTo(new Date(), 60);
```


## License

The MIT License
