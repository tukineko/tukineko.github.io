var GameScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new GameLayer();
		this.addChild(layer);
	}
});

var GameLayer = cc.Layer.extend({
	space: null,
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	_bg: null,
	_bg2: null,
	_bgfloor: null,
	_bgfloor2: null,
	_bgfloor3: null,
	_bgfloor4: null,
	_block: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer  ****");
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		//背景描画
		this.drawBg();
		this.drawBlock();
		
		this.initSpace();
		this.createPhysicsSprite();
		this.createFloor();
		
	},
	//背景描画
	drawBg: function() {
		//背景
		this._bg = new cc.Sprite(res.img_gameBg);
		this._bg.setAnchorPoint(cc.p(0, 0));
		this._bg.setPosition(cc.p(0, 0));
		this.addChild(this._bg, 0);
		
		this._bg2 = new cc.Sprite(res.img_gameBg);
		this._bg2.setAnchorPoint(cc.p(0, 0));
		this._bg2.setPosition(cc.p(this._bg.getContentSize().width, 0));
		this.addChild(this._bg2, 0);
		
		//床
		this._bgfloor = new cc.Sprite(res.img_Floor);
		this._bgfloor.setAnchorPoint(cc.p(0, 0));
		this._bgfloor.setPosition(cc.p(0, -50));
		this._bgfloor.setScale(2.0);
		this.addChild(this._bgfloor, 2);
		
		this._bgfloor2 = new cc.Sprite(res.img_Floor);
		this._bgfloor2.setAnchorPoint(cc.p(0, 0));
		this._bgfloor2.setPosition(cc.p(this._bgfloor.getContentSize().width, -50));
		this._bgfloor2.setScale(2.0);
		this.addChild(this._bgfloor2, 2);
		
		this._bgfloor3 = new cc.Sprite(res.img_Floor2);
		this._bgfloor3.setAnchorPoint(cc.p(0, 0));
		this._bgfloor3.setPosition(cc.p(0, 400));
		this.addChild(this._bgfloor3, 1);
		
		this._bgfloor4 = new cc.Sprite(res.img_Floor2);
		this._bgfloor4.setAnchorPoint(cc.p(0, 0));
		this._bgfloor4.setPosition(cc.p(this._bgfloor3.getContentSize().width, 400));
		this.addChild(this._bgfloor4, 1);
		
	},
	scrollBg: function() {
		//背景
		this._bg.setPositionX(this._bg.getPositionX() - 2);
		this._bg2.setPositionX(this._bg2.getPositionX() - 2);
		if (this._bg2.getPositionX() < 0) {
			this._bg.setPositionX(this._bg2.getPositionX() + this._bg2.getContentSize().width);
			// 背景AとBの変数を入れ替える
			[this._bg, this._bg2] = [this._bg2, this._bg];
		}
		
		//床
		this._bgfloor.setPositionX(this._bgfloor.getPositionX() - 10);
		this._bgfloor2.setPositionX(this._bgfloor2.getPositionX() - 10);
		if (this._bgfloor2.getPositionX() < 0) {
			this._bgfloor.setPositionX(this._bgfloor2.getPositionX() + this._bgfloor2.getContentSize().width);
			// 背景AとBの変数を入れ替える
			[this._bgfloor, this._bgfloor2] = [this._bgfloor2, this._bgfloor];
		}
		
		this._bgfloor3.setPositionX(this._bgfloor3.getPositionX() - 3);
		this._bgfloor4.setPositionX(this._bgfloor4.getPositionX() - 3);
		if (this._bgfloor4.getPositionX() < 0) {
			this._bgfloor3.setPositionX(this._bgfloor4.getPositionX() + this._bgfloor4.getContentSize().width);
			// 背景AとBの変数を入れ替える
			[this._bgfloor3, this._bgfloor4] = [this._bgfloor4, this._bgfloor3];
		}
		
	},
	drawBlock: function() {
		var blockTop = new cc.Sprite(res.img_Block);
		blockTop.anchorX = 0;
		blockTop.setPosition(cc.p(this._winSize.width, this._winSize.height - 200));
		blockTop.setTag(1);
		
		var blockBottom = new cc.Sprite(res.img_Block);
		blockBottom.anchorX = 0;
		blockBottom.setPosition(cc.p(this._winSize.width, 200));
		blockBottom.setTag(2);
		
		var blockWap = new cc.Node();
		blockWap.addChild(blockTop);
		blockWap.addChild(blockBottom);
		//blockWap.setTextureRect(cc.rect(0, 0, 150, 3000));
		this.addChild(blockWap, 1);
		this._block = blockWap;
		
	},
	scrollBlock: function() {
		//ブロック
		this._block.getChildByTag(1).setPositionX(this._block.getChildByTag(1).getPositionX() - 10);
		this._block.getChildByTag(2).setPositionX(this._block.getChildByTag(2).getPositionX() - 10);
		//cc.log(this._block.getChildByTag(1).getPositionX());
		if (this._block.getChildByTag(1).getPositionX() < -150) {
			//var y = Math.floor( Math.random() * 300) + 200;
			
			this._block.getChildByTag(1).setPositionX(this._winSize.width);
			//this._block.getChildByTag(1).setPositionY(this._block.getChildByTag(1).getPositionY() - y);
			
			this._block.getChildByTag(2).setPositionX(this._winSize.width);
			//this._block.getChildByTag(2).setPositionY(y);
		}
	},
	initSpace: function() {
		this.space = new cp.Space();
		// 重力加速度
		this.space.gravity = cp.v(0, -2000);
		// shapeを可視化する（デバッグ用）
		this.addChild(new cc.PhysicsDebugNode(this.space), 10);
		this.scheduleUpdate();
	},
	createPhysicsSprite: function() {

		// 物理スプライト
		var physicsSprite = new cc.PhysicsSprite(res.img_gamePlayer);
		physicsSprite.setFlippedX(true);

		// 質量
		var mass = 1;

		// スプライトの大きさを取得
		var width = physicsSprite.getContentSize().width;
		var height = physicsSprite.getContentSize().height;

		// 質量、慣性モーメントを設定
		var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
		this.space.addBody(body);

		// 形状、摩擦係数、反発係数を設定
		var shape = new cp.BoxShape(body, width, height);
		shape.setFriction(1.0);
		shape.setElasticity(0);
		this.space.addShape(shape);
		physicsSprite.setBody(body);
		physicsSprite.setPosition(this._winSizeCenterW - 350, this._winSizeCenterH);
		this.addChild(physicsSprite, 4);
		
		//タッチイベント
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
				//body.applyImpulse(cp.v(0, mass * 500), cp.v(0, 0));
				body.vy = 800;
				
				return true;
			}.bind(this),
			onTouchMoved: function(touch, event){
				
			}.bind(this),
			onTouchEnded: function(touch, event) {
				
			}.bind(this)
		}, this);
	},
	createFloor: function() {
		// 床を静的剛体として作る
		var floorThickness = 10;

		var bottomBar = new cp.SegmentShape(this.space.staticBody, cp.v(0, 450), cp.v(1080, 450), floorThickness);
		bottomBar.setFriction(1); //摩擦係数
		bottomBar.setElasticity(0); //弾性
		this.space.addShape(bottomBar);
		
	},
	update: function(dt) {
		// 物理エンジンの更新
		this.space.step(dt);
		
		//背景スクロール処理
		this.scrollBg();
		
		//ブロックスクロール処理
		this.scrollBlock();
	},
});