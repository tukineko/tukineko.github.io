var PlayerNode = cc.Node.extend({
	ctor: function () {
		this._super();
		cc.log("**** ctor: TestLayerPlayer ****");
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		var player = cc.Sprite.create(res.img_player01);
		player.setPosition(cc.p(0, 0));
		player.setTag(1);
		this.addChild(player, 0);
		
		var playerHitCircle = new cc.DrawNode();
		playerHitCircle.drawDot(cc.p(0, 0), 20, cc.color(0, 255, 0, 255));
		playerHitCircle.setTag(2);
		this.addChild(playerHitCircle, 1);
		
	},
	
});

var GameLayer = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	_player:null,
	_score: null,
	_charas: [],
	_enemies: [],
	_game_state: null,
	_scoreBatchNode: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer  ****");
		//cc.textureCache.dumpCachedTextureInfo();
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		//初期化
		this._game_state = GameLayer.GameState["READY"];
		this._charas = [];
		this._enemies = [];
		this._score = 0;
		this._dx = 10;
		
		//背景
		var bg = cc.Sprite.create(res.img_bgGame);
		bg.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH));
		this.addChild(bg, 0);
		
		//スコア画像はBatchNodeで処理
		this._scoreBatchNode = new cc.SpriteBatchNode(res.img_number);
		this.addChild(this._scoreBatchNode, 5);
		//スコア表示
		this.viewScore(this._score);
		
		//自キャラ
		//var player = cc.Sprite.create(res.img_player01);
		var player = new PlayerNode();
		player.setPosition(cc.p(this._winSizeCenterW, 300));
		this.addChild(player, 1);
		this._player = player;
		
		//フレーム更新
		this.scheduleUpdate();
		
		//6フレームで令和出現
		this.schedule(this.spawnChara, 0.1);
		
		//1秒ごとに敵出現
		this.schedule(this.spawnEnemy, 1.0);
		
		//タッチイベント
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
				
				return true;
			}.bind(this),
			onTouchMoved: function(touch, event) {
				if (this._game_state === GameLayer.GameState["PLAYING"]) {
					var delta = touch.getDelta();
					var position = this._player.getPosition();
					var newPosition = cc.pAdd(position, delta);
					
					this._player.setPosition(cc.pClamp(newPosition, cc.p(20, position.y), cc.p(this._winSize.width - 20, position.y)));
				}
			}.bind(this),
			onTouchEnded: function(touch, event) {
				
			}.bind(this)
		}, this);
		
	},
	update:function () {
		if (this._game_state === GameLayer.GameState["PLAYING"]) {

			// 自キャラの判定ボックス
			var playerRect = this._player.getBoundingBoxToWorld();
			var playerPoint = this._player.getPosition();
			
			//令和衝突判定
			this._charas.forEach(function(element, index, array) {
				var isHit = cc.rectIntersectsRect(playerRect, element.getBoundingBox());
				if (isHit) {
					this.hitChara(element);
				}
			}, this);
			
			// 敵衝突判定(円と短形)
			this._enemies.forEach(function(element, index, array) {
				var pos = cc.p(cc.clampf(playerPoint.x , element.getBoundingBox().x , element.getBoundingBox().x + element.width),
							cc.clampf(playerPoint.y , element.getBoundingBox().y , element.getBoundingBox().y + element.height));
				var radius = 20.0;
				var isHit = cc.pDistance(playerPoint , pos) < radius;
				if (isHit) {
					//this.hitEnemy(element);
					this.onGameOver();
				}
			}, this);
			
			
		}
	},
	//トランジション終わり時
	onEnterTransitionDidFinish: function() {
		this._super();
		this.onGameStart();
		//this._game_state = GameLayer.GameState["PLAYING"];
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
	//令和出現処理
	spawnChara: function(){
		if (this._game_state === GameLayer.GameState["PLAYING"]) {
			var sprite = cc.Sprite.create(res.img_chara);
			var x = Math.floor( Math.random() * (this._winSize.width - sprite.width)) + (sprite.width / 2);
			var y = this._winSize.height - (sprite.height / 2);
			sprite.setPosition(cc.p(x, y));
			sprite.setOpacity(0);
			this.addChild(sprite, 2);
			this._charas.push(sprite);

			//動き
			var action = cc.sequence(
				cc.fadeIn(0.3),
				cc.moveBy(3.0, cc.p(0, -this._winSize.height)).easing(cc.easeIn(3)),
				cc.removeSelf()
			);
			action.setTag(1);
			sprite.runAction(action);
		}
	},
	//令和衝突処理
	hitChara: function(chara){
		//点数加算
		this._score++;
		this.viewScore(this._score);
		
		//アクションをストップ
		chara.stopActionByTag(1);
		
		//衝突アクション
		var randX = Math.floor( Math.random() * 800 ) - 400;
		var randR = Math.floor( Math.random() * 360 ) + 720;
		var action = cc.sequence(
			cc.spawn(
				cc.moveBy(0.3, cc.p(randX, 300)).easing(cc.easeOut(3)),
				cc.rotateBy(0.3, randR).easing(cc.easeOut(3)),
				cc.fadeOut(0.3).easing(cc.easeIn(3)),
				cc.scaleTo(0.3, 0.3).easing(cc.easeOut(3)),
			),
			cc.removeSelf()
		);
		chara.runAction(action);
		//配列から削除
		this._charas.forEach(function(element, index, array) {
			if(element === chara) {
				array.splice(index, 1);
				return;
			}
		});
		
	},
	//敵出現処理
	spawnEnemy: function(){
		if (this._game_state === GameLayer.GameState["PLAYING"]) {
			var sprite = cc.Sprite.create(res.img_enemy01);
			var x = Math.floor( Math.random() * (this._winSize.width - sprite.width)) + (sprite.width / 2);
			var y = this._winSize.height;
			sprite.setPosition(cc.p(x, y));
			this.addChild(sprite, 3);
			this._enemies.push(sprite);

			//動き
			var duration = Math.random() * 2 + 2;
			var action = cc.sequence(
				cc.moveBy(duration, cc.p(0, -this._winSize.height)),
				cc.removeSelf()
			);
			action.setTag(1);
			sprite.runAction(action);
		}
	},
	//敵衝突処理
	hitEnemy: function(enemy){
		//アクションをストップ
		enemy.stopActionByTag(1);
		
		var action = cc.sequence(
			cc.removeSelf()
		);
		enemy.runAction(action);
		
		//配列から削除
		this._enemies.forEach(function(element, index, array) {
			if(element === enemy) {
				array.splice(index, 1);
				return;
			}
		});
		
	},
	//ゲームスタート処理
	onGameStart: function(){
		
		//カウントダウン
		var count3 = cc.Sprite.create(res.img_countdown3);
		count3.setPosition(this._winSizeCenterW, this._winSizeCenterH);
		count3.setOpacity(0);
		this.addChild(count3, 1);
		
		var count2 = cc.Sprite.create(res.img_countdown2);
		count2.setPosition(this._winSizeCenterW, this._winSizeCenterH);
		count2.setOpacity(0);
		
		var count1 = cc.Sprite.create(res.img_countdown1);
		count1.setPosition(this._winSizeCenterW, this._winSizeCenterH);
		count1.setOpacity(0);
		
		var start = cc.Sprite.create(res.img_start);
		start.setPosition(this._winSizeCenterW, this._winSizeCenterH);
		
		//共通アクション
		var act = cc.sequence(
							cc.spawn(
								cc.moveBy(0.3, cc.p(0, 100)).easing(cc.easeOut(3)),
								cc.fadeIn(0.3).easing(cc.easeOut(3))
							),
							cc.fadeOut(0.5).easing(cc.easeOut(3))
						);
		
		//アニメーション
		count3.runAction(
			cc.sequence(
				cc.delayTime(0.5),
				act,
				cc.callFunc(function() {
					this.addChild(count2, 1);
				}, this),
				cc.removeSelf()
			)
		);
		
		count2.runAction(
			cc.sequence(
				act,
				cc.callFunc(function() {
					this.addChild(count1, 1);
				}, this),
				cc.removeSelf()
			)
		);
		
		count1.runAction(
			cc.sequence(
				act,
				cc.callFunc(function() {
					this.addChild(start, 1);
					this._game_state = GameLayer.GameState["PLAYING"];
				}, this),
				cc.removeSelf()
			)
		);
		
		start.runAction(
			cc.sequence(
				cc.spawn(
					cc.scaleTo(0.3, 2.0).easing(cc.easeIn(3)),
					cc.fadeOut(0.3)
				),
				cc.removeSelf()
			)
		);
	},
	//ゲームオーバー処理
	onGameOver: function(){
		this._game_state = GameLayer.GameState["ENDING"];
		
		for(var i = 0; i < this._enemies.length; i++){
			this._enemies[i].pause();
		}
		for(var i = 0; i < this._charas.length; i++){
			this._charas[i].pause();
		}
		
		//ゲームオーバー表示
		var gameover = cc.Sprite.create(res.img_gameover);
		gameover.setPosition(this._winSizeCenterW, this._winSizeCenterH);
		gameover.setScale(0);
		this.addChild(gameover, 10);
		
		//アニメーション
		gameover.runAction(
			cc.sequence(
				cc.scaleTo(0.3, 1.0).easing(cc.easeExponentialIn()),
				cc.delayTime(1.0),
				cc.scaleTo(0.3, 0).easing(cc.easeExponentialIn()),
				cc.callFunc(function() {
					this._game_state = GameLayer.GameState["RESULT"];
					this.onResult();
				}, this)
			)
		);
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
	}
});



