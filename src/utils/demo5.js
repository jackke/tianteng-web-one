!function(e) {
    function t(t) {
        for (var o, a, c = t[0], u = t[1], s = t[2], l = 0, p = []; l < c.length; l++)
            a = c[l],
            r[a] && p.push(r[a][0]),
            r[a] = 0;
        for (o in u)
            Object.prototype.hasOwnProperty.call(u, o) && (e[o] = u[o]);
        for (f && f(t); p.length; )
            p.shift()();
        return i.push.apply(i, s || []),
        n()
    }
    function n() {
        for (var e, t = 0; t < i.length; t++) {
            for (var n = i[t], o = !0, c = 1; c < n.length; c++) {
                var u = n[c];
                0 !== r[u] && (o = !1)
            }
            o && (i.splice(t--, 1),
            e = a(a.s = n[0]))
        }
        return e
    }
    var o = {}
      , r = {
        4: 0
    }
      , i = [];
    function a(t) {
        if (o[t])
            return o[t].exports;
        var n = o[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return e[t].call(n.exports, n, n.exports, a),
        n.l = !0,
        n.exports
    }
    a.m = e,
    a.c = o,
    a.d = function(e, t, n) {
        a.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        })
    }
    ,
    a.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    a.t = function(e, t) {
        if (1 & t && (e = a(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var n = Object.create(null);
        if (a.r(n),
        Object.defineProperty(n, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var o in e)
                a.d(n, o, function(t) {
                    return e[t]
                }
                .bind(null, o));
        return n
    }
    ,
    a.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return a.d(t, "a", t),
        t
    }
    ,
    a.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    a.p = "";
    var c = window.webpackJsonp = window.webpackJsonp || []
      , u = c.push.bind(c);
    c.push = t,
    c = c.slice();
    for (var s = 0; s < c.length; s++)
        t(c[s]);
    var f = u;
    i.push([30, 0]),
    n()
}({
    27: function(e, t, n) {},
    30: function(e, t, n) {
        "use strict";
        n.r(t);
        var o = n(1)
          , r = n(6)
          , i = n(15)
          , a = n(10)
          , c = n(9)
          , u = n(2)
          , s = n(11)
          , f = n(7)
          , l = n(8)
          , p = n(34)
          , y = n(37)
          , h = n(35)
          , b = n(36);
        function d(e) {
            return (d = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            )(e)
        }
        function v(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                o.configurable = !0,
                "value"in o && (o.writable = !0),
                Object.defineProperty(e, o.key, o)
            }
        }
        function w(e, t) {
            return !t || "object" !== d(t) && "function" != typeof t ? function(e) {
                if (void 0 === e)
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }(e) : t
        }
        function m(e) {
            return (m = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            }
            )(e)
        }
        function O(e, t) {
            return (O = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t,
                e
            }
            )(e, t)
        }
        var g, j, P = n(4);
        n(14),
        n(27);
        function S(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1,
                o.configurable = !0,
                "value"in o && (o.writable = !0),
                Object.defineProperty(e, o.key, o)
            }
        }
        function _(e, t, n) {
            return (_ = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
                var o = function(e, t) {
                    for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = F(e)); )
                        ;
                    return e
                }(e, t);
                if (o) {
                    var r = Object.getOwnPropertyDescriptor(o, t);
                    return r.get ? r.get.call(n) : r.value
                }
            }
            )(e, t, n || e)
        }
        function k(e) {
            return (k = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            }
            : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            }
            )(e)
        }
        function M(e, t) {
            if (!(e instanceof t))
                throw new TypeError("Cannot call a class as a function")
        }
        function x(e, t) {
            return !t || "object" !== k(t) && "function" != typeof t ? function(e) {
                if (void 0 === e)
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }(e) : t
        }
        function F(e) {
            return (F = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                return e.__proto__ || Object.getPrototypeOf(e)
            }
            )(e)
        }
        function T(e, t) {
            if ("function" != typeof t && null !== t)
                throw new TypeError("Super expression must either be null or a function");
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    writable: !0,
                    configurable: !0
                }
            }),
            t && z(e, t)
        }
        function z(e, t) {
            return (z = Object.setPrototypeOf || function(e, t) {
                return e.__proto__ = t,
                e
            }
            )(e, t)
        }
        var E, L = new (g = Object(f.a)({
            x: 1,
            y: 1
        }, .1),
        Object(l.a)((E = j = g(j = function(e) {
            function t() {
                return M(this, t),
                x(this, F(t).apply(this, arguments))
            }
            return T(t, r["a"]),
            t
        }()) || j,
        j = function(e) {
            function t(e) {
                var n;
                return function(e, t) {
                    if (!(e instanceof t))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t),
                (n = w(this, m(t).call(this, e))).clock = new o.Clock,
                n.currentPass = !1,
                n.effects = {},
                n.passes = [],
                n.composer = new p.a(n.renderer,{}),
                n.effects.render = new y.a(n.scene,n.camera),
                n.addPass(n.effects.render),
                n
            }
            var n, r, i;
            return function(e, t) {
                if ("function" != typeof t && null !== t)
                    throw new TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: !0,
                        configurable: !0
                    }
                }),
                t && O(e, t)
            }(t, E),
            n = t,
            (r = [{
                key: "addBloomEffect",
                value: function(e, t) {
                    this.effects.bloom = new h.a(e),
                    this.effects.bloom.blendMode.opacity.value = t,
                    this.addPass(new b.a(this.camera,this.effects.bloom))
                }
            }, {
                key: "addPass",
                value: function(e) {
                    this.passes.length && (this.passes[this.passes.length - 1].renderToScreen = !1),
                    this.passes.push(e),
                    this.composer.addPass(e),
                    this.passes[this.passes.length - 1].renderToScreen = !0
                }
            }, {
                key: "render",
                value: function() {
                    this.composer.render(this.clock.getDelta())
                }
            }, {
                key: "resizeRender",
                value: function() {
                    this.composer && this.composer.setSize(this.width, this.height)
                }
            }]) && v(n.prototype, r),
            i && v(n, i),
            t
        }() || j)) || j);
        L.camera.position.z = 2,
        L.addBloomEffect({
            resolutionScale: .5,
            kernelSize: 4,
            distinction: .01
        }, 1);
        var C = new a.a("Meteorological system",{
            color: "#FFFFFF",
            size: P.a.isMobile ? .08 : .08,
            wireframe: !0,
            opacity: 1
        });
        C.position.y = .4, // y 位置调整
        C.position.x -= .5 * C.basePosition,
        L.add(C);
        var R = new i.a;
        R.update = function() {
            R.rotation.y -= 4e-4,
            R.rotation.x -= 2e-4
        }
        ,
        L.add(R);
        var A = new o.Vector3
          , B = new o.Vector3
          , I = new o.Raycaster
          , D = new o.SphereBufferGeometry(4,32,32,0,3.2,4,2.1)
          , J = new o.MeshBasicMaterial({
            wireframe: !0,
            visible: !1
        })
          , V = new o.Mesh(D,J);
        L.add(V),
        V.position.z = 2;
        var q = ["#FFFAFF", "#0A2463", "#3E92CC", "#723bb7", "#efd28e", "#3f9d8c"].map(function(e) {
            return new o.Color(e)
        })
          , G = new (function(e) {
            function t() {
                return M(this, t),
                x(this, F(t).apply(this, arguments))
            }
            var n, o, r;
            return T(t, c["a"]),
            n = t,
            (o = [{
                key: "addLine",
                value: function() {
                    for (var e = Object(u.a)(-2.4, 7.2), n = -25 * Math.PI / 180, o = 200 * Math.PI / 180, r = []; n < o; ) {
                        n += .2,
                        e -= .1,
                        A.set(4 * Math.cos(n), e, 4 * Math.sin(n)),
                        B.set(-A.x, 0, -A.z),
                        B.normalize(),
                        I.set(A, B);
                        var i = I.intersectObject(V, !0);
                        i.length && r.push(i[0].point.x, i[0].point.y, i[0].point.z)
                    }
                    0 !== r.length && (Math.random() > .5 ? _(F(t.prototype), "addLine", this).call(this, {
                        visibleLength: Object(u.a)(.01, .2),
                        points: r,
                        speed: Object(u.a)(.003, .008),
                        color: Object(s.a)(q),
                        width: Object(u.a)(.01, .1)
                    }) : _(F(t.prototype), "addLine", this).call(this, {
                        visibleLength: Object(u.a)(.05, .2),
                        points: r,
                        speed: Object(u.a)(.01, .1),
                        color: q[0],
                        width: Object(u.a)(.01, .01)
                    }))
                }
            }]) && S(n.prototype, o),
            r && S(n, r),
            t
        }())({
            frequency: .99
        },{
            transformLineMethod: function(e) {
                return e
            }
        });
        L.add(G),
        L.start();
        var H = new TimelineLite({
            delay: .2,
            onStart: function() {
                G.start()
            }
        });
        H.to(".overlay", 2, {
            autoAlpha: 0
        }),
        H.fromTo(L.lookAt, 3, {
            y: -4
        }, {
            y: 0,
            ease: Power3.easeOut
        }, "-=2"),
        H.add(C.show, "-=2"),
        P.a.onHide(function(e) {
            var t = new TimelineLite;
            t.to(L.lookAt, 2, {
                y: -6,
                ease: Power3.easeInOut
            }),
            t.add(C.hide, 0),
            t.add(G.stop),
            t.to(".overlay", .5, {
                autoAlpha: 1,
                onComplete: e
            }, "-=1.5")
        })
    }
});
