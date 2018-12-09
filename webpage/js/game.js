const Game = function () {
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
        this.ship.beginFill(0x20d3fe);
        this.ship.moveTo(0, 0);
        this.ship.lineTo(-26, 60);
        this.ship.lineTo(26, 60);
        this.ship.endFill();

        // add an engine
        this.ship.beginFill(0x1495d1);
        this.ship.drawRect(-15, 60, 30, 8);
        this.ship.endFill();

        // position the ship in the middle of the screen
        this.ship.x = Math.round(this._width / 2);
        this.ship.y = Math.round(this._height /2);
        // Attach the ship tp the stage
        this.stage.addChild(this.ship);
    },

    tick: function () {
        this.renderer.render(this.stage);
        requestAnimationFrame(this.tick.bind(this));
    }
};