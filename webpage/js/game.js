const Game = function () {


    this.beta = 0.9;

    this._width = 1200;
    this._height = 720;

    this.renderer = new PIXI.CanvasRenderer(this._width, this._height);
    document.body.appendChild(this.renderer.view);

    this.stage = new PIXI.Stage();

    // setup Physics simulation
    this.world = new p2.World({
        gravity: [0, 0],

    });

    this.speed = 1;
    this.turnSpeed = 2;
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

        this.ship = new p2.Body({
            mass: 1,

            angularVelocity: 0,
            damping: 0,
            angularDamping: 0,
            position: [
                Math.round(this._width / 2),
                Math.round(this._height /2)
            ]
        });

        this.shipShape = new p2.Rectangle(52, 69);
        this.ship.addShape(this.shipShape);
        this.world.addBody(this.ship);

        // ship fusalage
        this.shipGraphics = new PIXI.Graphics();
        this.shipGraphics.beginFill(0x20d3fe, 0.8);
        this.shipGraphics.moveTo(0, 0);
        this.shipGraphics.lineTo(-26, 60);
        this.shipGraphics.lineTo(26, 60);
        this.shipGraphics.endFill();

        // add an engine
        this.shipGraphics.beginFill(0x1495d1, 0.8);
        this.shipGraphics.drawRect(-15, 60, 30, 8);
        this.shipGraphics.endFill();

        this.shipGraphics.pivot.x = 0;
        this.shipGraphics.pivot.y = 30;
        this.shipGraphics.x = 100;
        this.shipGraphics.y = 500;


        // Attach the ship tp the stage
        this.stage.addChild(this.shipGraphics);
        console.log("Ship Added");

    },

    moveShip: function() {
        /*
        // Move North
        Mousetrap.bind('up', function () {
            this.speed +=  (1 - this.beta);
        }.bind(this));

        // Move North
        Mousetrap.bind('down', function () {
            this.speed -=  (1 - this.beta);
        }.bind(this));
        */
        // Move North
        Mousetrap.bind('right', function () {
            this.shipGraphics.rotation += Math.PI * 0.5 * (1 - this.beta);
        }.bind(this));

        // Move North
        Mousetrap.bind('left', function () {
            this.shipGraphics.rotation -= Math.PI * 0.5 * (1 - this.beta);
        }.bind(this));

        const distance = this.speed;
        this.shipGraphics.x += Math.cos(this.shipGraphics.rotation - Math.PI/2) * distance;
        this.shipGraphics.y += Math.sin(this.shipGraphics.rotation - Math.PI/2) * distance;
    },

    updatePhysics: function(){

        // Apply Physics simulation to graphics
        this.shipGraphics.x = this.ship.position[0];
        this.shipGraphics.y = this.ship.position[1];
        this.shipGraphics.rotation = this.ship.angle;
        // Step Physics simulatin forward
        this.world.step(1/60);
    },
    tick: function () {

      this.updatePhysics();
      this.moveShip();
      this.renderer.render(this.stage);
      requestAnimationFrame(this.tick.bind(this));
    }
};