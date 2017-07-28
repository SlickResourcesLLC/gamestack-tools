"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BlockSprite = function BlockSprite(sprite) {
    _classCallCheck(this, BlockSprite);

    this.__subType = "block";

    //todo: apply a sprite that collides on both sides
};

var PowerContainer = function () {
    function PowerContainer(sprite) {
        _classCallCheck(this, PowerContainer);

        this.__subType = "block";

        //todo: apply a sprite that collides on both sides
    }

    _createClass(PowerContainer, [{
        key: "onStrike",
        value: function onStrike() {}
    }]);

    return PowerContainer;
}();

var SideScrollerSprite = function SideScrollerSprite(sprite) {
    _classCallCheck(this, SideScrollerSprite);

    this.__subType = "block";

    //todo: apply a sprite that collides on both sides
};
//# sourceMappingURL=SpriteTypes.js.map
