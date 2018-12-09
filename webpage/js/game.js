const Game = function () {

    this.averageDirectionDelta = 0.001;
    this.averageSpeed = 0.0;
    this.beta = 0.9995;

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

            let star = new PIXI.Graphics();
            star.beginFill(0xFFFFFF, alpha);
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

        this.ship.pivot.x = 26;
        this.ship.pivot.y = 60;

        // Add Shield

        const boxSize = 20;
        for (let x = -50; x < 50; x += boxSize) {
            for (let y = -10; y < 90; y += boxSize) {
                //console.log("x = " + x + " y = " + y);
                //console.log("pivot = " + this.ship.pivot.x + " , " + this.ship.pivot.y);
                const xDist = Math.sqrt((this.ship.pivot.x - x) * (this.ship.pivot.x -x)) ;
                const yDist = Math.sqrt((this.ship.pivot.y - y) * (this.ship.pivot.y- y)) ;
                console.log("xDist = " + xDist + " yDist = "+yDist);

                const blue =  xDist * 0xff;
                const green = yDist * 0xffff;
                const red = Math.max(Math.min(Math.sqrt(xDist*xDist + yDist*yDist) / 2 , 1) * 0xff0000, 0xff0000);
                const alpha = Math.min(1 - Math.sqrt(xDist*xDist + yDist*yDist), 1) / 2;
                const color = red + green + blue;
                this.ship.beginFill(color, alpha);
                this.ship.drawRect(x, y, boxSize, boxSize);
                this.ship.endFill();
            }
        }


        // position the ship in the middle of the screen
        this.ship.x = Math.round(this._width / 6);
        this.ship.y = Math.round(this._height /2);


        this.ship.rotation = 90;
        // Attach the ship tp the stage
        this.stage.addChild(this.ship);
    },

    tick: function () {

        this.averageDirectionDelta = this.beta * this.averageDirectionDelta + (1 - this.beta) * (1 - Math.random() / 2) ;
        const rotationDelta = this.averageDirectionDelta;

        this.ship.alpha = 1 - this.averageSpeed;

        this.averageSpeed = this.beta * this.averageSpeed + (1 - this.beta) * (1 - Math.random() /2) * 0.99;
        const distance = this.averageSpeed;
        this.ship.rotation = rotationDelta;

        this.ship.x += Math.cos(this.ship.rotation - 3.14159/2) * distance;
        this.ship.y += Math.sin(this.ship.rotation - 3.14159/2) * distance;
        this.renderer.render(this.stage);
        requestAnimationFrame(this.tick.bind(this));
    }
};