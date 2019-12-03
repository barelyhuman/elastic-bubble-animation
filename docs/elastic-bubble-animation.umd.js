(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.ElasticBubbleAnimation = factory());
}(this, function () { 'use strict';

    var NUMBEROFBUBBLES = 20;
    var colors = ["#C5E1A5", "#FFF176", "#FF9800"];
    var ANIMATIONSPEED = "500ms";

    var ElasticBubbleAnimation = function ElasticBubbleAnimation(opts) {
        this.opts = opts;
        this.colors = opts.colors;
        this.numberOfBubbles = opts.bubbleCount || NUMBEROFBUBBLES;
        if (!opts.colors) {
            this.colors = colors;
        }
        this.radius = parseInt(this.opts.bubbleSize.replace("px", "")) / 2;
        this.positions = [];
        this.bubbleBackground = opts.bubbleBackground;
        this.initialPosition = {};
        this.bubbles = [];
        this.xBounds = [];
        this.yBounds = [];
        this.mouseMoveHandler = this.moveBubblesToMouse.bind(this);
        this.mouseOutHandler = this.resetBubblePositions.bind(this);
        this.attachMouseTo = opts.attachMouseTo;
    };

    ElasticBubbleAnimation.prototype.init = function init () {
            var this$1 = this;

        this.opts.el.style.overflow = "hidden";
        for (var i = 0; i < this.numberOfBubbles; i += 1) {
            var bubble = this.addBubble();
            this.bubbles.push(bubble);
        }

        this.mouseMoveHandler = this.moveBubblesToMouse.bind(this);

        if (this.attachMouseTo) {
            this.attachMouseTo.addEventListener("mouseenter", function (e) {
                this$1.opts.el.addEventListener(
                    "mousemove",
                    this$1.mouseMoveHandler
                );
            });

            this.attachMouseTo.addEventListener("mouseleave", function (e) {
                this$1.opts.el.removeEventListener(
                    "mousemove",
                    this$1.mouseMoveHandler
                );
                setTimeout(function () {
                    return this$1.mouseOutHandler(e);
                }, 650);
            });
        } else {
            this.opts.el.addEventListener("mouseenter", function (e) {
                this$1.opts.el.addEventListener(
                    "mousemove",
                    this$1.mouseMoveHandler
                );
            });

            this.opts.el.addEventListener("mouseleave", function (e) {
                this$1.opts.el.removeEventListener(
                    "mousemove",
                    this$1.mouseMoveHandler
                );
                setTimeout(function () {
                    return this$1.mouseOutHandler(e);
                }, 650);
            });
        }
    };

    ElasticBubbleAnimation.prototype.getRandomNumber = function getRandomNumber (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };

    ElasticBubbleAnimation.prototype.addBubble = function addBubble () {
        var position = this.generateRandomPosition();
        var bubble = document.createElement("div");
        var rgba = this.hexToRgbA(
            this.colors[this.getRandomNumber(0, this.colors.length)],
            0.5
        );
        bubble.style.height = this.opts.bubbleSize;
        bubble.style.width = this.opts.bubbleSize;
        bubble.style.borderRadius = "100px";
        if (!this.bubbleBackground) {
            bubble.style.background = rgba;
        } else {
            bubble.style.background = "url(" + (this.bubbleBackground) + ")";
            bubble.style.backgroundSize = "cover";
            bubble.style.backgroundRepeat = "no-repeat";
            bubble.style.backgroundPosition = "center";
        }
        bubble.style.position = "absolute";
        bubble.style.top = position.y + "px";
        bubble.style.left = position.x + "px";
        bubble.style.transition = "all " + ANIMATIONSPEED + " ease";
        this.opts.el.appendChild(bubble);
        return {
            id: this.bubbles.length + 1 + "-" + "bubble",
            position: position,
            bubble: bubble
        };
    };

    ElasticBubbleAnimation.prototype.hexToRgbA = function hexToRgbA (hex, transparency) {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split("");
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = "0x" + c.join("");
            return (
                "rgba(" +
                [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
                "," +
                transparency +
                ")"
            );
        }
        throw new Error("Bad Hex");
    };

    ElasticBubbleAnimation.prototype.moveBubblesToMouse = function moveBubblesToMouse (event) {
            var this$1 = this;

        this.bubbles.forEach(function (bubble) {
            var boundingBoxes = bubble.bubble.getBoundingClientRect();

            if (!this$1.initialPosition[bubble.id]) {
                this$1.initialPosition[bubble.id] = {
                    x: boundingBoxes.x,
                    y: boundingBoxes.y
                };
            }

            this$1.resetBubblePositions();

            setTimeout(function () {
                var ref = this$1.generateRandomRadialPosition();
                    var x = ref.x;
                    var y = ref.y;
                var xBounds = [boundingBoxes.x, event.clientX];
                var yBounds = [boundingBoxes.y, event.clientY];

                this$1.moveRandomly(xBounds, yBounds, bubble.bubble, event);

                setTimeout(function () {
                    var yFromCenter = event.clientY - parseInt(y) + "px";
                    var xFromCenter = event.clientX + parseInt(x) + "px";
                    bubble.bubble.style.top = yFromCenter;
                    bubble.bubble.style.left = xFromCenter;
                }, ANIMATIONSPEED / 2);
            }, 500);
        });
    };

    ElasticBubbleAnimation.prototype.moveRandomly = function moveRandomly (xBounds, yBounds, bubble, mousePosition) {
        var xRandomPoint = this.getRandomNumber(
            Math.min(xBounds[0], xBounds[1]),
            Math.max(xBounds[0], xBounds[1])
        );
        var yRandomPoint = this.getRandomNumber(
            Math.min(yBounds[0], yBounds[1]),
            Math.max(yBounds[0], yBounds[1])
        );
        var yFromCenter = yRandomPoint + "px";
        var xFromCenter = xRandomPoint + "px";
        setTimeout(function () {
            bubble.style.top = yFromCenter;
            bubble.style.left = xFromCenter;
        }, ANIMATIONSPEED / 2);
    };

    ElasticBubbleAnimation.prototype.generateRandomRadialPosition = function generateRandomRadialPosition () {
        var randomAngle = (this.getRandomNumber(0, 360) * Math.PI) / 180;
        var x = this.radius * Math.cos(randomAngle);
        var y = this.radius * Math.sin(randomAngle);
        return {
            x: x,
            y: y
        };
    };

    ElasticBubbleAnimation.prototype.generateRandomPosition = function generateRandomPosition () {
        var x, y;
        var container = this.opts.el.getBoundingClientRect();

        this.xBounds = [container.x, container.right];
        this.yBounds = [container.y, container.bottom];

        var xMin = Math.min(this.xBounds[0], this.xBounds[1]);
        var xMax = Math.max(this.xBounds[1], this.xBounds[1]);
        var yMin = Math.min(this.yBounds[0], this.yBounds[1]);
        var yMax = Math.max(this.yBounds[1], this.yBounds[1]);

        x = this.getRandomNumber(xMin, xMax);
        y = this.getRandomNumber(yMin, yMax);

        return {
            x: x,
            y: y
        };
    };

    ElasticBubbleAnimation.prototype.resetBubblePositions = function resetBubblePositions (event) {
            var this$1 = this;

        this.bubbles.forEach(function (bubble) {
            if (this$1.initialPosition[bubble.id]) {
                bubble.bubble.style.top =
                    this$1.initialPosition[bubble.id].y + "px";
                bubble.bubble.style.left =
                    this$1.initialPosition[bubble.id].x + "px";
            }
        });
    };

    return ElasticBubbleAnimation;

}));
