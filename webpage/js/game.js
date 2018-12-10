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

    this.speed = 100;
    this.turnSpeed = 2;

    window.addEventListener('keydown', function (event) {

        this.handleKeys(event.keyCode, true);
    }.bind(this), false);

    window.addEventListener('keyup', function (event) {
        this.handleKeys(event.keyCode, false);
    }.bind(this), false);
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
    },


    /**
     * handle keypresses and filter them
     * @param code : key Code pressed
     * @param state : true or false
     */
    handleKeys: function(code, state) {


        switch (code) {
        // left 37 , A 65
        case 37:
            this.keyLeft = state;
            break;
        // up 38, D 68
        case 38:
            this.keyUp = state;
            break;
        // right 39
        case 39:
            this.keyRight = state;
            break;
        // down 40
        case 40:
            this.keyDown = state;
            break;
    }
    },

    updatePhysics: function(){

        // Update ship's angular velocity for rotation
        if(this.keyLeft) {
            this.ship.angularVelocity =  -1 * this.turnSpeed;
        } else if (this.keyRight) {
            this.ship.angularVelocity =   this.turnSpeed;
        } else {
            this.ship.angularVelocity = 0;
        }

        // Apply force vector
        if(this.keyUp) {
            const angle = this.ship.angle * Math.PI /2;
            this.ship.force[0] -= this.speed * Math.cos(angle);
            this.ship.force[1] -= this.speed * Math.sin(angle);
        }
        // Apply Physics simulation to graphics
        this.shipGraphics.x = this.ship.position[0];
        this.shipGraphics.y = this.ship.position[1];
        this.shipGraphics.rotation = this.ship.angle;
        // Step Physics simulatin forward
        this.world.step(1/60);
    },
    tick: function () {

      this.updatePhysics();

      this.renderer.render(this.stage);
      requestAnimationFrame(this.tick.bind(this));
    }
};