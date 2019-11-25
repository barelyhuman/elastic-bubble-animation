const NUMBEROFBUBBLES = 55;
const colors = ['#C5E1A5', "#FFF176", "#FF9800"];


class ElasticBubbleAnimation {
    constructor(opts) {
        this.opts = opts;
        this.colors = opts.colors;
        this.numberOfBubbles = opts.bubbleCount || NUMBEROFBUBBLES;
        if (!opts.colors) {
            this.colors = colors;
        }

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
            return this.mouseOutHandler(e);
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
        bubble.style.transition = 'all 250ms ease';
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

            if (!this.initialPosition[bubble.id]) {
                const boundingBoxes = bubble.bubble.getBoundingClientRect();

                this.initialPosition[bubble.id] = {
                    x: boundingBoxes.x,
                    y: boundingBoxes.y
                }
            }

            const randomAngle = (this.getRandomNumber(0, 360)) * Math.PI / 180;

            const x = (10 * Math.cos(randomAngle));
            const y = (10 * Math.sin(randomAngle));

            const yFromCenter = ((event.clientY) - parseInt(y)) + 'px';
            const xFromCenter = ((event.clientX) + parseInt(x)) + 'px';

            bubble.bubble.style.top = yFromCenter;
            bubble.bubble.style.left = xFromCenter;
        });
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