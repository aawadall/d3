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

    tick: function () {
        this.renderer.render(this.stage);
        requestAnimationFrame(this.tick.bind(this));
    }
};