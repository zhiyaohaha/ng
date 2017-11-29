(function ($) {
    $.extend({
        timestamp: function () {
            return (new Date().getTime()).toString().substr(0, 10);
        },
        jsonToStr: function (param) {
            return param ? JSON.stringify(param) : "";
        },
        strSort: function (param) {
            if (typeof param === "string") {
                return param;
            }
            var params = [];
            for (var key in param) {
                params.push(key)
            }
            params.sort();
            var _params = "";
            for (var i = 0; i < params.length; i++) {
                _params += params[i] + "=" + param[params[i]] + (i == params.length - 1 ? "" : "&");
            }
            return _params;
        },
        postAuth: function (param) {
            var _param = {};
            var str = $.jsonToStr(param);
            var timestamp = $.timestamp();

            _param.data = str;
            _param.timestamp = timestamp;
            _param.sign = $.md5(str + timestamp + "84qudMIhOkX5JMQXVd0f4jneqfP2Lp");

            return _param;
        },
        getAuth: function (param) {
            var _param = {};
            var timestamp = $.timestamp();
            var str = $.strSort(param);
            var sign = param ? $.md5(str + timestamp + "84qudMIhOkX5JMQXVd0f4jneqfP2Lp") 　: $.md5(timestamp + "84qudMIhOkX5JMQXVd0f4jneqfP2Lp");

            return param ? str + '&timestamp=' + timestamp + '&sign=' + sign : 'timestamp=' + timestamp + '&sign=' + sign;
        },
        generateGUID: function () {
            var d = new Date().getTime();
            var uuid = 'sxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        },
        repeatStr: function (str, key) {
            var arr = str.split("");
            var num = 0;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == key) {
                    num++;
                }
            }
            return num;
        },
        request: function (m) {
            var sValue = location.search.match(new RegExp("[\?\&]" + m + "=([^\&]*)(\&?)", "i"));
            return sValue ? sValue[1] : sValue;
        }
    })
})($)