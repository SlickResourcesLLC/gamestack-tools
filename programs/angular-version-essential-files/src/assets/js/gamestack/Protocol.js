'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = __gameInstance || {};

/*****************
 *  ResourceApi():
 *
 *  Dependencies: (1) :
 *      -$JQuery : ajax
 ******************/

var ResourceApi = function () {
        function ResourceApi(args) {
                _classCallCheck(this, ResourceApi);

                this.__constructors = args.constructors;

                this.__onGet = args.onGet || function () {};

                if (!this.__constructors instanceof Array) {

                        this.__constructors = [];
                }
        }

        _createClass(ResourceApi, [{
                key: 'get_all_by_type',
                value: function get_all_by_type(constructor, callback) {
                        this.get(constructor, '*', callback);
                }
        }, {
                key: 'get_all',
                value: function get_all(callback) {
                        var __inst = this;

                        $.each(this.__constructors, function (ix, item) {

                                __inst.get_all_by_type(item, callback);
                        });
                }
        }, {
                key: 'get',
                value: function get(constructor, name, callback) {
                        var c = constructor instanceof String ? c : c.name;

                        var __inst = this;

                        $.get('/resources/' + c + '/' + name, function (data) {

                                callback(data);

                                if (typeof __inst.__onGet == 'function') {
                                        __inst.onGet(data);
                                }
                        });
                }
        }, {
                key: 'save',
                value: function save(constructor, name, contents) //TOTEST:
                {
                        var c = constructor instanceof String ? c : c.name;

                        if (name.indexOf('.json') >= 0) {
                                var e = '".json" is not allowed in the name of saved objects';

                                alert(e);

                                return console.error(e);
                        }

                        $.post('/resources/' + c + '/' + name + '?', { filename: name, contents: contents }, function (data) {

                                console.info(jstr(data));
                        });
                }
        }]);

        return ResourceApi;
}();

;
//# sourceMappingURL=Protocol.js.map
