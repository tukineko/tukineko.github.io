
var GameLayer = cc.Layer.extend({
	space: null,
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	_game_state: null,
	_player:null,
	_bg: null,
	_bg2: null,
	_bgfloor: null,
	_bgfloor2: null,
	_bgfloor3: null,
	_bgfloor4: null,
	_scoreBatchNode: null,
	_score: null,
	_block: [],
	_blockHit: [],
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer  ****");
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		//初期化
		this._block = [];
		this._blockHit = [];
		this._score = 0;
		
		//スコア画像はBatchNodeで処理
		this._scoreBatchNode = new cc.SpriteBatchNode(res.img_number);
		this.addChild(this._scoreBatchNode, 5);
		//スコア表示
		this.viewScore(this._score);
		
		//背景描画
		this.drawBg();
		
		//壁生成
		this.schedule(this.drawBlock, 2.0);
		
		this.initSpace();
		this.createPhysicsSprite();
		this.createFloor();
		
	},
	update: function(dt) {
		// 物理エンジンの更新
		if (this._game_state === GameLayer.GameState["PLAYING"]) {
			this.space.step(dt);
		
			//背景スクロール処理
			this.scrollBg();

			// 自キャラの判定ボックス
			var playerRect = this._player.getBoundingBoxToWorld();

			//衝突判定
			this._blockHit.forEach(function(element, index, array) {
				var isHit = cc.rectIntersectsRect(playerRect, element.getBoundingBox());
				if (isHit) {
					this.hitBlockH(element);
				}
			}, this);

			this._block.forEach(function(element, index, array) {
				var isHit = cc.rectIntersectsRect(playerRect, element.getBoundingBox());
				if (isHit) {
					this.onGameOver();
				}
			}, this);
		}
	},
	//トランジション終わり時
	onEnterTransitionDidFinish: function() {
		this._super();
		this._game_state = GameLayer.GameState["PLAYING"];
	},
	//スコア表示処理
	viewScore: function(score){
		var text = ('0000000000' + score).slice(-8);
		var leng = text.length;
		var num = text.split('');
		var sprites = [];
		var scale = 1.0;
		var portionSize = 64;
		
		//初期化
		this._scoreBatchNode.removeAllChildren();
		
		num.reverse();
		for(var i = 0; i < leng; i += 1) {
			var number = cc.Sprite.createWithTexture(this._scoreBatchNode.getTexture(), cc.rect(0, 0, portionSize, portionSize));
			number.setPosition(cc.p((this._winSize.width - 50 ) - (i * portionSize * scale), this._winSize.height - 50));
			number.setTextureRect(cc.rect(portionSize * num[i], 0, portionSize, portionSize));
			number.setScale(scale);
			this._scoreBatchNode.addChild(number);
		}
		
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
		if (this._game_state === GameLayer.GameState["PLAYING"]) {
			
			var action = cc.sequence(
				cc.moveBy(3.0, cc.p(-this._winSize.width-150, 0)),
				cc.removeSelf()
			);

			var action2 = cc.sequence(
				cc.moveBy(3.0, cc.p(-this._winSize.width-150, 0)),
				cc.removeSelf()
			);

			var action3 = cc.sequence(
				cc.moveBy(3.0, cc.p(-this._winSize.width-150, 0)),
				cc.removeSelf()
			);

			var x = this._winSize.width + 75;
			var y = Math.floor( Math.random() * 900) + 700;
			var blockTopY = y + 250;
			var blockBottomY = y - 250;
		
			var blockTop = new cc.Sprite(res.img_Block);
			blockTop.anchorY = 0;
			blockTop.setPosition(cc.p(x, blockTopY));
			blockTop.runAction(action);
			this.addChild(blockTop, 1);
			this._block.push(blockTop);

			var blockBottom = new cc.Sprite(res.img_Block);
			blockBottom.anchorY = 1;
			blockBottom.setPosition(cc.p(x, blockBottomY));
			blockBottom.runAction(action2);
			this.addChild(blockBottom, 1);
			this._block.push(blockBottom);

			var blockHit = new cc.Sprite(res.img_dumy);
			blockHit.setTextureRect(cc.rect(0, 0, 150, 500));
			blockHit.setPosition(cc.p(x, y));
			blockHit.runAction(action3);
			this.addChild(blockHit, 1);
			this._blockHit.push(blockHit);
		}
		
	},
	hitBlockH: function(chara){
		//点数加算
		this._score++;
		this.viewScore(this._score);
		
		//配列から削除
		this._blockHit.forEach(function(element, index, array) {
			if(element === chara) {
				array.splice(index, 1);
				return;
			}
		});
		
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
		this._player = physicsSprite;
		
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
	//ゲームオーバー処理
	onGameOver: function(){
		this._game_state = GameLayer.GameState["ENDING"];
		
		for(var i = 0; i < this._block.length; i++){
			this._block[i].pause();
		}
		for(var i = 0; i < this._blockHit.length; i++){
			this._blockHit[i].pause();
		}
		
		this._game_state = GameLayer.GameState["RESULT"];
		this.onResult();
	},
	//リザルト処理
	onResult: function(){
		
		//メニューボタン
		var item1 = new cc.MenuItemImage(res.img_btnRetry, res.img_btnRetryOn, function(){
			cc.director.runScene(cc.TransitionFade.create(1, new GameScene()));
		});
		var item2 = new cc.MenuItemImage(res.img_btnReturn, res.img_btnReturnOn, function(){
			cc.director.runScene(cc.TransitionFade.create(1, new TitleScene()));
		});
		
		var menu = new cc.Menu(item1, item2);
		menu.alignItemsVerticallyWithPadding(50);
		menu.setPosition(this._winSizeCenterW, this._winSizeCenterH);
		this.addChild(menu, 10);
		
		
	},
	
});

// ゲームの状態
GameLayer.GameState = {
	"READY":   0, // 開始演出中
	"PLAYING": 1, // プレイ中
	"ENDING":  2, // 終了演出中
	"RESULT":  3  // スコア表示
};

var GameScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new GameLayer();
		this.addChild(layer);
		
		//var layer2 = new GridLayer();
		//this.addChild(layer2);
	}
});
