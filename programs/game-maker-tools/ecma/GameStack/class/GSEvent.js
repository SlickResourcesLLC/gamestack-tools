
class GSEvent {

    constructor(args = {}) {

        this.name = args.name || "blankEvent";

        this.on = args.on || "collision";

        this.object = args.object || {};

        this.gpix = args.gpix || 0;

        this.ix = args.ix || 0; //the button-index OR stick-index

        this.targets = args.targets || [];

        this.triggered = args.triggered || function () {
            }

        this.statKey = args.statKey || false;

        this.lessThan = args.lessThan || false;

        this.greaterThan = args.greaterThan || false;

    }

    apply() {

        var __inst = this;

        switch (this.on) {
            case "collision":
            case "collide":

                $Q(this.object).on('collision', this.targets, function (obj1, obj2) {

                    __inst.triggered(obj1, obj2);

                });

                break;

            case "button":

                //rig the button call

                $Q(this.object).on('button' + this.ix, function (pressed) {


                    __inst.triggered(pressed);

                });

                break;


            case "stick_left":
            case "stick_right":
            case "right_stick":
            case "left_stick":

                //rig the stick call

                $Q(this.object).on(this.on, function (x, y) {


                    __inst.triggered(x, y);

                });

                break;

            case "stat":

                //rig the stat call

                console.error('STAT CALLS ARE NOT SET-UP YET. Please add this to the Gamestack library');

                function isStrOrNum(str){return typeof(str)=='string' || typeof(str)=='number'}

                var onKey = "[" + this.statKey + (isStrOrNum(this.greaterThan)?">":"") + (isStrOrNum(this.lessThan)?"<":"") + (this.greaterThan || this.lessThan);

                $Q(this.object).on(onKey, function (x, y) {

                    __inst.triggered(x, y);

                });

                break;

        }

    }

    triggered() {
    } //called when triggered

    onTriggered(fun) {
        this.triggered = function () {
            fun();
        };
    } //adds a function argument for triggered

    rejected() {
    }

    onRejected(fun) {
        this.rejected = function () {
            fun();
        };
    }

}