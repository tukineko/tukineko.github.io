var GameLayer4 = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	space: null,
	ctor:function () {
		this._super();
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		this.initSpace();
		this.createPhysicsSprite();
		this.createFloor();
		
	},
	initSpace: function() {

		this.space = new cp.Space();

		// 重力加速度
		//this.space.gravity = cp.v(0, -980);
		this.space.gravity = cp.v(0, 0);

		// shapeを可視化する（デバッグ用）
		this.addChild(new cc.PhysicsDebugNode(this.space), 0);

		this.scheduleUpdate();
		
		//this.schedule(this.createPhysicsSprite, 0.5, 2);
	},
	getRect: function(node) {
		var point = node.getPosition();
		var width = node.getContentSize().width;
		var height = node.getContentSize().height;
		return cc.rect(point.x - (width / 2), point.y - (height / 2), width, height);
	},
	createPhysicsSprite: function() {

		// 物理スプライト
		var physicsSprite = new cc.PhysicsSprite(res.img_puzzle2);

		// 質量
		var mass = 100;

		// スプライトの大きさを取得
		var width = physicsSprite.getContentSize().width;
		var height = physicsSprite.getContentSize().height;

		// 質量、慣性モーメントを設定
		var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
		this.space.addBody(body);

		// 形状、摩擦係数、反発係数を設定
		var shape = new cp.CircleShape(body, 75, cp.v(0, 0));
		shape.setFriction(1.0);
		shape.setElasticity(0.8);
		this.space.addShape(shape);
		physicsSprite.setBody(body);
		physicsSprite.setPosition(cc.winSize.width / 2, 200);
		this.addChild(physicsSprite);
		
		
		//もどるボタンの配置
		var btnBack = new cc.Sprite(res.img_commonBtnBack);
		btnBack.setPosition(cc.p(100, this._winSize.height - 100));
		btnBack.setScale(0.2);
		this.addChild(btnBack, 3);
		
		
		var touchPoint = null;
		//タッチイベント
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
				
				if(cc.rectContainsPoint(btnBack.getBoundingBox(), touch.getLocation())){
					cc.director.runScene(cc.TransitionFade.create(1, new MenuScene()));
				}
				
				var characterRect = this.getRect(physicsSprite);
				touchPoint = touch.getLocation();
				return cc.rectContainsPoint(characterRect, touchPoint);
			}.bind(this),
			onTouchMoved: function(touch, event){
				
			}.bind(this),
			onTouchEnded: function(touch, event) {
				var endPoint = touch.getLocation();
				var force = cp.v((touchPoint.x - endPoint.x) * 150, (touchPoint.y - endPoint.y) * 150);
				cc.log(force);
				//body.applyImpulse(cp.v(cc.winSize.width * 150, 100 * 1500), cp.v(0, 0));
				body.applyImpulse(force, cp.v(0, 0));
				
			}.bind(this)
		}, this);
	},
	createFloor: function() {

		// 床を静的剛体として作る
		var floorThickness = 10;

		var bottomBar = new cp.SegmentShape(this.space.staticBody, cp.v(0, 0), cp.v(1080, 0), floorThickness);
		bottomBar.setFriction(1); //摩擦係数
		bottomBar.setElasticity(0.6); //弾性
		this.space.addShape(bottomBar);
		
		var topBar = new cp.SegmentShape(this.space.staticBody, cp.v(0,1920), cp.v(1080,1920), floorThickness);
		topBar.setFriction(1);
		topBar.setElasticity(0.6);
		this.space.addShape(topBar);

		var leftBar = new cp.SegmentShape(this.space.staticBody, cp.v(0,1920), cp.v(0,0), floorThickness);
		leftBar.setFriction(1);
		leftBar.setElasticity(0.6);
		this.space.addShape(leftBar);

		var rightBar = new cp.SegmentShape(this.space.staticBody, cp.v(1080,1920), cp.v(1080,0), floorThickness);
		rightBar.setFriction(1);
		rightBar.setElasticity(0.6);
		this.space.addShape(rightBar);
	},
	update: function(dt) {
		// 物理エンジンの更新
		this.space.step(dt);
	},
});

var GameScene4 = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new GameLayer4();
		this.addChild(layer);
	}
});






