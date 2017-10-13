



/**
 * requestAnimationFrame
 */
window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


/**
 * Vector
 */
function Vector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;

    this.z = z || 0;
}

Vector.add = function(a, b) {
    return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
};

Vector.sub = function(a, b) {
    return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
};

Vector.prototype = {
    set: function(x, y, z) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;

            z = x.z;
        }
        this.x = x || 0;
        this.y = y || 0;

        this.z = z || 0;
        return this;
    },


    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

        return this;
    },

    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;

        this.z -= v.z;

        return this;
    },

    scale: function(s) {
        this.x *= s;
        this.y *= s;

        this.z *= s;

        return this;
    },

    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    normalize: function() {
        var len = Math.sqrt(this.x * this.x + this.y * this.y);

        var lenYZ = Math.sqrt(this.y * this.y + this.z * this.z);

        if (len && lenYZ) {
            this.x /= len;
            this.y /= len;

            this.z /= lenYZ;
        }
        return this;
    },

    angle: function() {
        return Math.atan2(this.y, this.x);
    },

    angleYZ: function() {
        return Math.atan2(this.z, this.y);
    },

    distanceTo: function(v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceToYZ: function(v) {
        var dy = v.y - this.y,
            dz = v.z - this.z;
        return Math.sqrt(dy * dy + dz * dz);
    },

    distanceToSquareYZ: function(v) {
        var dy = v.y - this.y,
            dz = v.z - this.z;
        return dy * dy + dz * dz;
    },


    distanceToSq: function(v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return dx * dx + dy * dy;
    },

    clone: function() {
        return new Vector(this.x, this.y, this.z);
    }
};


/**
 * LightningPoint
 */
function LightningPoint(x, y, z, radius) {
    Vector.call(this, x, y, z);

    this.x = x;

    this.y = y;

    this.z = z;



    this.radius = radius || 7;

    this.vec = new Vector(x, y, z).normalize();

    this._easeRadius    = this.radius;
    this._currentRadius = this.radius;

}

LightningPoint.prototype = (function(o) {
    var s = new Vector(0, 0, 0), p;
    for (p in o) {
        s[p] = o[p];
    }
    return s;
})({
    color:       'rgb(255, 255, 255)',
    dragging:    false,
    _latestDrag: null,

    update: function(points, bounds) {
        this._currentRadius = random(this._easeRadius, this._easeRadius * 0.35);
        this._easeRadius += (this.radius - this._easeRadius) * 0.1;

        if (this.dragging) return;

        var vec = this.vec,
            i, len, p, d;





        for (i = 0, len = points.length; i < len; i++) {
            p = points[i];
            if (p !== this) {
                d = this.distanceToSq(p);
                if (d < 90000) {
                    vec.add(Vector.sub(this, p).normalize().scale(0.03));
                } else if (d > 250000) {
                    vec.add(Vector.sub(p, this).normalize().scale(0.015));
                }




            }
        }

        if (vec.length() > 3) vec.normalize().scale(3);

        this.add(vec);
        
        
        var keepBoundOnProp = function(obj, key, limitKey)
        {

            if (obj[key] < bounds[key]) {
                obj[key] = bounds[key];
                if (vec[key] < 0) vec[key] *= -1;

            } else if (obj[key] > bounds[limitKey]) {
                obj[key] = bounds[limitKey];
                if (vec[key] > 0) vec[key] *= -1;
            }
            
        }

        keepBoundOnProp(this, 'x', 'right');

        keepBoundOnProp(this, 'y', 'top');

        keepBoundOnProp(this, 'y', 'front');

        
    },

    hitTest: function(p) {
        if (this.distanceToSq(p) < 900) {
            this._easeRadius = this.radius * 2.5;
            return true;
        }
        return false;
    },

    startDrag: function() {
        this.dragging = true;
        this.vec.set(0, 0, 0);
        this._latestDrag = new Vector().set(this);
    },

    drag: function(p) {
        this._latestDrag.set(this);
        this.set(p);
    },

    endDrag: function() {
        this.vec = Vector.sub(this, this._latestDrag);
        this.dragging = false;
    }


});


/**
 * Lightning
 */
function Lightning(startPoint, endPoint, step) {
    this.startPoint = startPoint || new Vector();
    this.endPoint   = endPoint || new Vector();
    this.step       = step || 45;

    this.children = [];

}

Lightning.prototype = {
    color:         'rgba(255, 255, 255, 1)',
    speed:         0.025,
    amplitude:     1,
    lineWidth:     5,
    blur :         50,
    blurColor:     'rgba(255, 255, 255, 0.5)',
    points:        null,
    off:           0,
    _simplexNoise: new SimplexNoise(),
    // Case by child
    parent:        null,
    startStep:     0,
    endStep:       0,

    length: function() {
        return this.startPoint.distanceTo(this.endPoint);
    },

    getChildNum: function() {
        return children.length;
    },

    setChildNum: function(num) {
        var children = this.children, child,
            i, len;

        len = this.children.length;

        if (len > num) {
            for (i = num; i < len; i++) {
                children[i].dispose();
            }
            children.splice(num, len - num);

        } else {
            for (i = len; i < num; i++) {
                child = new Lightning();
                child._setAsChild(this);
                children.push(child);
            }
        }
    },

    update: function() {
        var startPoint = this.startPoint,
            endPoint   = this.endPoint,
            length, normal, radian, sinv, cosv, thetv,
            points, off, waveWidth, n, av, ax, ay, az, bv, bx,  by, bz, m, x, y, z,
            children, child,
            i, len;

        if (this.parent) {
            if (this.endStep > this.parent.step) {
                this._updateStepsByParent();
            }


        }


        var radianYZ;

        length = this.length();
        normal = Vector.sub(startPoint, endPoint).normalize().scale(length / this.step);


        radian = normal.angle();

        radianYZ = normal.angleYZ();



        sinv   = Math.sin(radian);
        cosv   = Math.cos(radian);

        thetv   = Math.sin(radianYZ);



        points    = this.points = [Vector(0, 0, 0), Vector(0, 0, 0)];
        off       = this.off += random(this.speed, this.speed * 0.2);
        waveWidth = (this.parent ? length * 1.5 : length) * this.amplitude;
        if (waveWidth > 750) waveWidth = 750;

        for (i = 0, len = this.step + 1; i < len; i++) {
            n = i / 60;
            av = waveWidth * this._getNoise(n - off, 0) * 0.5;
            ax = sinv * av;
            ay = cosv * av;

            az = thetv * av;


            bv = waveWidth * this._getNoise(n + off, 0) * 0.5;
            bx = sinv * bv;
            by = cosv * bv;

            bz = thetv * bv;


            m = Math.sin((Math.PI * (i / (len - 1))));

            x = startPoint.x + normal.x * i + (ax - bx) * m;
            y = startPoint.y + normal.y * i - (ay - by) * m;

          var  z = Math.abs(startPoint.z - endPoint.z) / len * i +  this._getNoise(n - off, 0) * 0.5;

            points.push(new Vector(x, y, z));
        }

        children = this.children;

        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            child.color     = this.color;
            child.speed     = this.speed * 1.35;
            child.amplitude = this.amplitude;
            child.lineWidth = this.lineWidth * 0.75;
            child.blur      = this.blur;
            child.blurColor = this.blurColor;
            children[i].update();
        }
    },

    getPoints: function(ctx) {
        var points = this.points,
            children = this.children,
            i, len, p, d;

        // Blur
        if (this.blur) {



        }



        for (i = 0, len = points.length; i < len; i++) {
            p = points[i];


        }



        // Draw children
        for (i = 0, len = this.children.length; i < len; i++) {
            children[i].draw(ctx);
        }


        return points;

    },

    dispose: function() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
        }
        this._simplexNoise = null;
    },

    _getNoise: function(v, vector) {
        var octaves = 6,
            fallout =  0.5,
            amp = 1, f = 1, sum = 0,
            i;

        for (i = 0; i < octaves; ++i) {
            amp *= fallout;
            sum += amp * (this._simplexNoise.noise3D(v * f, 0, 0) + 1) * 0.5;
            f *= 2;
        }

        return sum;
    },

    _setAsChild: function(lightning) {
        if (!(lightning instanceof Lightning)) return;
        this.parent = lightning;

        var self = this,
            setTimer = function() {
                self._updateStepsByParent();
                self._timeoutId = setTimeout(setTimer, randint(1500));
            };

        self._timeoutId = setTimeout(setTimer, randint(1500));
    },

    _updateStepsByParent: function() {
        if (!this.parent) return;
        var parentStep = this.parent.step;
        this.startStep = randint(parentStep - 2);
        this.endStep   = this.startStep + randint(parentStep - this.startStep - 2) + 2;
        this.step = this.endStep - this.startStep;
    }
};


/**
 * Vector3Bounds
 */
function Vector3Bounds(x, y, z, width, height, zepth) {
    this.x = x || 0;
    this.y = y || 0;

    this.z = z || 0;

    this.width  = width || 0;
    this.height = height || 0;
    this.right  = this.x + this.width;
    this.bottom = this.y + this.height;

    this.zepth = zepth || 0;

    this.front = this.z + zepth;

}


// Helpers

function random(max, min) {
    if (typeof max !== 'number') {
        return Math.random();
    } else if (typeof min !== 'number') {
        min = 0;
    }
    return Math.random() * (max - min) + min;
}


function randint(max, min) {
    if (!max) return 0;
    return random(max + 1, min) | 0;
}


    // Vars

    var canvas, context;
       var centerX = 0; var centerY = 0; var centerZ = 0;

       var grad,
        mouse,
        bounds,
        points,
        lightning,
        gui, control;


    // Event Listeners



    function mouseMove(e) {
        mouse.set(e.clientX, e.clientY);

        var i, hit = false;
        for (i = 0; i < 2; i++) {
            if ((!hit && points[i].hitTest(mouse)) || points[i].dragging)
                hit = true;
        }
        document.body.style.cursor = hit ? 'pointer' : 'default';
    }

    function mouseDown(e) {
        for (var i = 0; i < 2; i++) {
            if (points[i].hitTest(mouse)) {
                points[i].startDrag();
                return;
            }
        }
    }

    function mouseUp(e) {
        for (var i = 0; i < 2; i++) {
            if (points[i].dragging)
                points[i].endDrag();
        }
    }


    // GUI Control

    control = {
        childNum: 3,
        color: [255, 255, 255],
        backgroundColor: '#0b5693'
    };



    bounds = new Vector3Bounds(0, 0, 0, 200, 200, 200);
    mouse  = new Vector();


    var lightning_list =[];

    for(var x = 0; x < 1000; x+= 100)
    {

       var lightning = new Lightning();

        lightning.startPoint.set(Vector(0, 0, 0));
        lightning.endPoint.set(Vector(200, 200, 200));
        lightning.setChildNum(4);


        lightning_list.push(lightning);

    }



// GUI

    gui = new dat.GUI();
    gui.add(lightning, 'amplitude', 0, 2).name('Amplitude');
    gui.add(lightning, 'speed', 0, 0.1).name('Speed');
    gui.add(control, 'childNum', 0, 10).step(1).name('Child Num').onChange(function() {
        lightning.setChildNum(control.childNum | 0);
    });
    gui.addColor(control, 'color').name('Color').onChange(function() {
        var c = control.color;
        var r = (c[0] || 0) | 0, g = (c[1] || 0) | 0, b = (c[2] || 0) | 0,
            i, len;

        lightning.color     = 'rgb(' + r + ',' + g + ',' + b + ')';
        lightning.blurColor = 'rgba(' + r + ',' + g + ',' + b + ', 0.5)';
        for (i = 0, len = points.length; i < len; i++) {
            points[i].color = lightning.color;
        }
    });
    gui.add(lightning, 'lineWidth', 1, 10).name('Line Width').onChange(function() {
        for (var i = 0, len = points.length; i < len; i++) {
            points[i].radius = lightning.lineWidth * 1.25;
        }
    });
    gui.add(lightning, 'blur', 0, 100).name('Blur');
    gui.addColor(control, 'backgroundColor').name('Background');
    gui.close();

var lightningLoop = function (p1, p2, ctx, x) {

    this.points = [

        p1, p2

    ];


    lightning_list[x].startPoint = p1;
    lightning_list[x].endPoint = p2;
    lightning_list[x].step = Math.ceil(lightning_list[x].length() / 10);
    if (lightning_list[x].step < 5) lightning_list[x].step = 5;

    lightning_list[x].update();

    var i, p;

    for (i = 0; i < 2; i++) {
        p = points[i];
        if (p.dragging) p.drag(mouse);
        p.update(points, bounds);

    }
    return lightning_list[x];
};


var canvas = document.getElementById('c'), ctx = canvas.getContext('2d');  // Start Update

for(var x = 0; x < lightning_list.length; x++) {

lightningLoop(new Vector(0, 0, 0), new Vector(x, x, x), ctx, x);

};