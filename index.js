module.exports = function (chai, utils) {

    var Cookie = require('cookiejar');
    var Assertion = chai.Assertion;
    var i = utils.inspect;

    function getHeader(obj, key) {
        if (key) key = key.toLowerCase();
        if (obj.getHeader) return obj.getHeader(key);
        if (obj.headers) return obj.headers[key];
    };

    Assertion.addMethod('cookie', function (key, value) {
        var header = getHeader(this._obj, 'set-cookie')
            , cookie;

        if (!header) {
            header = (getHeader(this._obj, 'cookie') || '').split(';');
        }

        if (this._obj instanceof chai.request.agent && this._obj.jar) {
            cookie = this._obj.jar.getCookie(key, Cookie.CookieAccessInfo.All);
        } else {
            cookie = Cookie.CookieJar();
            cookie.setCookies(header);
            cookie = cookie.getCookie(key, Cookie.CookieAccessInfo.All);
        }

        if (arguments.length < 2) {
            this.assert(
                'undefined' !== typeof cookie || null === header
                , 'expected cookie \'' + key + '\' to exist'
                , 'expected cookie \'' + key + '\' to not exist'
            );
        } else if (arguments[1] instanceof RegExp) {
            this.assert(
                value.test(cookie)
                , 'expected cookie \'' + key + '\' to match ' + value + ' but got ' + i(cookie)
                , 'expected cookie \'' + key + '\' not to match ' + value + ' but got ' + i(cookie)
                , value
                , header
            );
        } else {
            this.assert(
                cookie == value
                , 'expected cookie \'' + key + '\' to have value ' + value + ' but got ' + i(cookie)
                , 'expected cookie \'' + key + '\' to not have value ' + value
                , value
                , cookie
            );
        }
    });

    Assertion.addProperty('akamaiStaging', function () {
        let key = 'x-akamai-staging'
        var header = getHeader(this._obj, key);

        this.assert(
            'undefined' !== typeof header || null === header
            , 'expected header \'' + key + '\' to exist'
            , 'expected header \'' + key + '\' to not exist'
        );
    });

    Assertion.addMethod('akamaiVariable', function (name, value) {
        let headers = getHeader(this._obj, 'x-akamai-session-info').split(',');
        let patt = new RegExp('name=' + name + ';');
        let header = headers.find(o => patt.test(o))

        this.assert(
            'undefined' !== typeof header || null === header
            , 'expected variable \'' + name + '\' to exist'
            , 'expected variable \'' + name + '\' to not exist'
        );

        if (arguments.length == 2) {
            patt = new RegExp('\\s*name=[^;$]+; value=([^;$]*)');
            let actualValue = patt.exec(header)[1];

            if (arguments[1] instanceof RegExp) {
                this.assert(
                    value.test(actualValue)
                    , 'expected variable \'' + name + '\' to match ' + value + ' but got ' + i(actualValue)
                    , 'expected variable \'' + name + '\' not to match ' + value + ' but got ' + i(actualValue)
                    , value
                    , actualValue
                );
            } else {
                this.assert(
                    actualValue == value
                    , 'expected variable \'' + name + '\' to have value ' + value + ' but got ' + i(actualValue)
                    , 'expected variable \'' + name + '\' to not have value ' + value
                    , value
                    , actualValue
                );
            }
        }
    });


    function AkamaiToken(name, exp, data, hash) {
        this.name = name;
        this.exp = exp;
        this.data = data;
        this.hash = hash;
    }

    Assertion.addMethod('akamaiCookieToken', function (key) {
        var header = getHeader(this._obj, 'set-cookie')
            , cookie;

        if (!header) {
            header = (getHeader(this._obj, 'cookie') || '').split(';');
        }

        if (this._obj instanceof chai.request.agent && this._obj.jar) {
            cookie = this._obj.jar.getCookie(key, Cookie.CookieAccessInfo.All);
        } else {
            cookie = Cookie.CookieJar();
            cookie.setCookies(header);
            cookie = cookie.getCookie(key, Cookie.CookieAccessInfo.All);
        }

        this.assert(
            'undefined' !== typeof cookie || null === header
            , 'expected cookie \'' + key + '\' to exist'
            , 'expected cookie \'' + key + '\' to not exist'
        );

        var attrs = cookie.value.split('~')
            .map(o => o.split('='))
            .filter(([key, value]) => typeof key !== 'undefined' && typeof value !== 'undefined')
            .reduce((o, [key, value]) => {
                o[key] = decodeURIComponent(value)
                return o
            }, {})

        var akamaiToken = new AkamaiToken(key, parseInt(attrs['exp']), attrs['data'], attrs['hash']);
        utils.flag(this, 'object', akamaiToken);
    });

}
