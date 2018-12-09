const Game = function () {


    this.beta = 0.9;

    this._width = 1200;
    this._height = 720;

    this.renderer = new PIXI.CanvasRenderer(this._width, this._height);
    document.body.appendChild(this.renderer.view);

    this.stage = new PIXI.Stage();

    this.build();
};

Game.prototype = {
    build : function () {
        this.drawStars();
        this.setupBoundaries();

        // draw the ship to the scene
        this.createShip();

        requestAnimationFrame(this.tick.bind(this));
    },

    drawStars : function () {
        for(let i=0; i< 1500; i++) {
            const x = Math.round(Math.random() * this._width);
            const y = Math.round(Math.random() * this._height);
            const rad = Math.ceil(Math.random() * 2);
            const alpha = Math.min(Math.random() * 0.25, 1 );

            const red = (Math.random() > 0.7) * 0xff0000;
            const green = (Math.random() > 0.7) * 0x00ff00;
            const blue = (Math.random() > 0.7) * 0x0000ff;

            const colorBeta = 0.0;
            let color = 0;
            switch (Math.round(Math.random() * 4)) {
                case 0 : color = 0xffffff;
                break;
                case 1:  color = 0xffeeee;
                break;
                case 2:  color = 0xeeeeff;
                break;
                default: color = 0xffffff;

            }

            let star = new PIXI.Graphics();
            star.beginFill(color, alpha);
            star.drawCircle(x, y, rad);
            star.endFill();

            this.stage.addChild(star);
        }
    },
    
    setupBoundaries : function () {
        let walls = new PIXI.Graphics();
        walls.beginFill(0xFFFFFF, 0.5);
        walls.drawRect(0, 0, this._width, 10);
        walls.drawRect(this._width - 10, 10, 10, this._height - 20);
        walls.drawRect(0, this._height - 10, this._width, 10);
        walls.drawRect(0, 10, 10, this._height - 20);


        this.stage.addChild(walls);
        
    },

    createShip: function() {
        // create a new ship object

        // ship fusalage
        this.ship = new PIXI.Graphics();
        this.ship.beginFill(0x20d3fe, 0.8);
        this.ship.moveTo(0, 0);
        this.ship.lineTo(-26, 60);
        this.ship.lineTo(26, 60);
        this.ship.endFill();

        // add an engine
        this.ship.beginFill(0x1495d1, 0.8);
        this.ship.drawRect(-15, 60, 30, 8);
        this.ship.endFill();

        this.ship.pivot.x = 0;
        this.ship.pivot.y = 30;

        // Add Shield


        /*
        let boxSize = 1;

        for (let x = -50; x < 50; x += boxSize ) {
            for (let y = -20; y < 90; y += boxSize ) {
                //console.log("x = " + x + " y = " + y);
                //console.log("pivot = " + this.ship.pivot.x + " , " + this.ship.pivot.y);
                const xDist = Math.sqrt((this.ship.pivot.x - x) * (this.ship.pivot.x -x)) ;
                const yDist = Math.sqrt((this.ship.pivot.y - y) * (this.ship.pivot.y- y)) ;
                //console.log("xDist = " + xDist + " yDist = "+yDist);

                const blue  =  0x0000ff * (1 + Math.sin( xDist / 3000) ) /2;
                const green =  0x00ff00 * (1 - Math.sin( yDist / 3000) ) /2;
                const red   =  0xff0000 * (boxSize /  2) ;
                const alpha = Math.max(Math.min( 1- Math.exp(-Math.sqrt( xDist*xDist + yDist*yDist ) / 10), 1), 0) /2;
                const color = Math.round(red + green + blue);
                this.ship.beginFill(color, alpha);
                //this.ship.drawCircle(x, y, boxSize);
                this.ship.drawRect(x, y, boxSize, boxSize);
                this.ship.endFill();

                boxSize = Math.sqrt(xDist * xDist + yDist * yDist) / 30 + 1;
            }
        }

        */
        // position the ship in the middle of the screen
        this.ship.x = Math.round(this._width / 2);
        this.ship.y = Math.round(this._height /2);



        // Attach the ship tp the stage
        this.stage.addChild(this.ship);


    },

    tick: function () {

        // Move North
        Mousetrap.bind('up', function () {
            this.ship.rotation = this.ship.rotation  * this.beta +
                                 Math.PI * 0 * (1 - this.beta);
        }.bind(this));

        // Move North
        Mousetrap.bind('down', function () {
            this.ship.rotation = this.ship.rotation  * this.beta +
                Math.PI * 1 * (1 - this.beta);
        }.bind(this));

        // Move North
        Mousetrap.bind('right', function () {
            this.ship.rotation = this.ship.rotation  * this.beta +
                Math.PI * 0.5 * (1 - this.beta);
        }.bind(this));

        // Move North
        Mousetrap.bind('left', function () {
            this.ship.rotation = this.ship.rotation  * this.beta +
                Math.PI * 1.5 * (1 - this.beta);
        }.bind(this));

        const distance = 0.1;
        this.ship.x += Math.cos(this.ship.rotation - Math.PI/2) * distance;
        this.ship.y += Math.sin(this.ship.rotation - Math.PI/2) * distance;
        this.renderer.render(this.stage);
        requestAnimationFrame(this.tick.bind(this));
    }
};