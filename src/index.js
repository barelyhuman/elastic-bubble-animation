const NUMBEROFBUBBLES = 55;
const colors = ['#C5E1A5', "#FFF176", "#FF9800"];
const ANIMATIONSPEED = "500ms";


class ElasticBubbleAnimation {
    constructor(opts) {
        this.opts = opts;
        this.colors = opts.colors;
        this.numberOfBubbles = opts.bubbleCount || NUMBEROFBUBBLES;
        if (!opts.colors) {
            this.colors = colors;
        }
        this.radius = parseInt(this.opts.bubbleSize.replace('px', '')) / 2;
        this.positions = [];
        this.initialPosition = {};
        this.bubbles = [];
        this.xBounds = [];
        this.yBounds = [];
        this.mouseMoveHandler = this.moveBubblesToMouse.bind(this);
        this.mouseOutHandler = this.resetBubblePositions.bind(this);
    }

    init() {
        this.opts.el.style.position = 'relative';
        this.opts.el.style.overflow = 'hidden';
        for (let i = 0; i < this.numberOfBubbles; i += 1) {
            const bubble = this.addBubble();
            this.bubbles.push(bubble);
        }

        this.mouseMoveHandler = this.moveBubblesToMouse.bind(this);


        this.opts.el.addEventListener('mouseenter', (e) => {
            this.opts.el.addEventListener('mousemove', this.mouseMoveHandler);
        });


        this.opts.el.addEventListener('mouseleave', (e) => {
            this.opts.el.removeEventListener('mousemove', this.mouseMoveHandler);
            setTimeout(() => {
                return this.mouseOutHandler(e);
            }, 650)
        });

    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    addBubble() {
        const position = this.generateRandomPosition();
        const bubble = document.createElement('div');
        const rgba = this.hexToRgbA(this.colors[this.getRandomNumber(0, this.colors.length)], 0.5);
        bubble.style.height = this.opts.bubbleSize;
        bubble.style.width = this.opts.bubbleSize;
        bubble.style.borderRadius = "100px";
        bubble.style.background = rgba;
        bubble.style.position = "absolute";
        bubble.style.top = position.y + 'px';
        bubble.style.left = position.x + 'px';
        bubble.style.translate = `transform(${position.x},${position.y})`;
        bubble.style.transition = `all ${ANIMATIONSPEED} ease`;
        this.opts.el.appendChild(bubble);
        return {
            id: this.bubbles.length + 1 + '-' + 'bubble',
            position: position,
            bubble: bubble
        }
    }

    hexToRgbA(hex, transparency) {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + transparency + ')';
        }
        throw new Error('Bad Hex');
    }

    moveBubblesToMouse(event) {
        this.bubbles.forEach(bubble => {

            const boundingBoxes = bubble.bubble.getBoundingClientRect();

            if (!this.initialPosition[bubble.id]) {

                this.initialPosition[bubble.id] = {
                    x: boundingBoxes.x,
                    y: boundingBoxes.y
                }
            }

            this.resetBubblePositions();

            setTimeout(() => {
                const { x, y } = this.generateRandomRadialPosition();
                const xBounds = [boundingBoxes.x, event.clientX];
                const yBounds = [boundingBoxes.y, event.clientY];

                this.moveRandomly(xBounds, yBounds, bubble.bubble, event);
                this.moveRandomly(xBounds, yBounds, bubble.bubble, event);
                this.moveRandomly(xBounds, yBounds, bubble.bubble, event);

                setTimeout(() => {
                    const yFromCenter = ((event.clientY) - parseInt(y)) + 'px';
                    const xFromCenter = ((event.clientX) + parseInt(x)) + 'px';
                    bubble.bubble.style.top = yFromCenter;
                    bubble.bubble.style.left = xFromCenter;
                }, ANIMATIONSPEED / 2);
            }, (500));

        });
    }


    moveRandomly(xBounds, yBounds, bubble, mousePosition) {
        const xRandomPoint = this.getRandomNumber(Math.min(xBounds[0], xBounds[1]), Math.max(xBounds[0], xBounds[1]));
        const yRandomPoint = this.getRandomNumber(Math.min(yBounds[0], yBounds[1]), Math.max(yBounds[0], yBounds[1]))
        const yFromCenter = ((yRandomPoint)) + 'px';
        const xFromCenter = ((xRandomPoint)) + 'px';
        setTimeout(() => {
            bubble.style.top = yFromCenter;
            bubble.style.left = xFromCenter;
        }, ANIMATIONSPEED / 2)
    }

    generateRandomRadialPosition() {
        const randomAngle = (this.getRandomNumber(0, 360)) * Math.PI / 180;
        const x = (this.radius * Math.cos(randomAngle));
        const y = (this.radius * Math.sin(randomAngle));
        return {
            x, y
        }
    }


    generateRandomPosition() {
        let x, y;
        const container = this.opts.el.getBoundingClientRect();

        this.xBounds = [container.x, container.right];
        this.yBounds = [container.y, container.bottom];

        x = this.getRandomNumber(this.xBounds[0], this.xBounds[1]);
        y = this.getRandomNumber(this.yBounds[0], this.yBounds[1]);

        return {
            x, y
        }

    }

    resetBubblePositions(event) {
        this.bubbles.forEach(bubble => {

            if (this.initialPosition[bubble.id]) {
                bubble.bubble.style.top = this.initialPosition[bubble.id].y + 'px';
                bubble.bubble.style.left = this.initialPosition[bubble.id].x + 'px';
            }

        });
    }

}



export default ElasticBubbleAnimation;