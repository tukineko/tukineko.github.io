var GameLayer2 = cc.Layer.extend({
	space: null,
	ctor: function() {

		this._super();

		this.initSpace();
		//this.createPhysicsSprite();
		this.createFloor();
	},
	initSpace: function() {

		this.space = new cp.Space();

		// 重力加速度
		this.space.gravity = cp.v(0, -980);

		// shapeを可視化する（デバッグ用）
		this.addChild(new cc.PhysicsDebugNode(this.space));

		this.scheduleUpdate();
		this.schedule(this.createPhysicsSprite, 0.5, 10);
	},
	createPhysicsSprite: function() {

		// 物理スプライト
		var physicsSprite = new cc.PhysicsSprite(res.img_item01);

		// 質量
		var mass = 100;

		// スプライトの大きさを取得
		var width = physicsSprite.getContentSize().width;
		var height = physicsSprite.getContentSize().height;

		// 質量、慣性モーメントを設定
		var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
		this.space.addBody(body);

		// 形状、摩擦係数、反発係数を設定
		var shape = new cp.BoxShape(body, width, height);
		shape.setFriction(0.6);
		shape.setElasticity(1.3);
		this.space.addShape(shape);
		physicsSprite.setBody(body);
		physicsSprite.setPosition(cc.winSize.width / 2, cc.winSize.height);
		this.addChild(physicsSprite);
	},
	createFloor: function() {

		// 床を静的剛体として作る
		var floorThickness = 10;

		var bottomBar = new cp.SegmentShape(this.space.staticBody, cp.v(0, 50), cp.v(1080,50), floorThickness);
		bottomBar.setFriction(1); //摩擦係数
		bottomBar.setElasticity(0.6); //弾性
		this.space.addShape(bottomBar);
		
		var topBar = new cp.SegmentShape(this.space.staticBody, cp.v(0,1920), cp.v(1080,1920), floorThickness);
		topBar.setFriction(1);
		topBar.setElasticity(0.3);
		this.space.addShape(topBar);

		var leftBar = new cp.SegmentShape(this.space.staticBody, cp.v(0,1920), cp.v(0,50), floorThickness);
		leftBar.setFriction(1);
		leftBar.setElasticity(0.3);
		this.space.addShape(leftBar);

		var rightBar = new cp.SegmentShape(this.space.staticBody, cp.v(1080,1920), cp.v(1080,50), floorThickness);
		rightBar.setFriction(1);
		rightBar.setElasticity(0.3);
		this.space.addShape(rightBar);
	},
	update: function(dt) {
		// 物理エンジンの更新
		this.space.step(dt);
	},
});

var GameScene2 = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new GameLayer2();
		this.addChild(layer);
	}
});






