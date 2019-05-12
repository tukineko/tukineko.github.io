

var GameLayer = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	_player:null,
	_playerHitCircle:null,
	_dx: null,
	_score: null,
	_charas: [],
	_enemies: [],
	_game_state: null,
	_scoreBatchNode: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer  ****");
		cc.textureCache.dumpCachedTextureInfo();
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
		
		//自キャラ
		var player = cc.Sprite.create(res.img_player01);
		player.setPosition(cc.p(this._winSizeCenterW, 300));
		player.setFlippedX(true);
		this.addChild(player, 1);
		this._player = player;
		var playerHitCircle = new cc.DrawNode();
		playerHitCircle.drawDot(cc.p(this._winSizeCenterW, 270), 20, cc.color(255, 0, 0, 255));
		this.addChild(playerHitCircle, 10);
		this._playerHitCircle = playerHitCircle;
		
		
		//スコア画像はBatchNodeで処理
		this._scoreBatchNode = new cc.SpriteBatchNode(res.img_number);
		this.addChild(this._scoreBatchNode, 5);
		//スコア表示
		this.viewScore(this._score);
		
		//フレーム更新
		this.scheduleUpdate();
		
		//6フレームで令和出現
		this.schedule(this.spawnChara, 0.1);
		
		//1秒ごとに敵出現
		this.schedule(this.spawnEnemy, 1.0);
		
		
		/*var renderTexture = new cc.RenderTexture(this._winSize.width, this._winSize.height);
		renderTexture.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH));
		this.addChild(renderTexture, 10);*/
		
		//var prevPos = null;
		
		//タッチイベント
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
				//var pos = touch.getLocation();
				//prevPos = pos;
				
				/*if (this._game_state === GameLayer.GameState["PLAYING"]) {
					var playerX = this._player.getPositionX();
					if((this._player.width / 2) <= playerX && playerX <= (this._winSize.width - (this._player.width / 2))){
						this.changePlayerDirection();
					}
				}*/
				return true;
			}.bind(this),
			onTouchMoved: function(touch, event) {
				if (this._game_state === GameLayer.GameState["PLAYING"]) {
					/*var pos = touch.getLocation();
					renderTexture.begin();
					var draw = cc.DrawNode.create();
					draw.drawSegment(prevPos, pos, 100, cc.color(255,0,0,255));
					draw.visit();
					renderTexture.end();
					prevPos = pos;*/
					
					
					var delta = touch.getDelta();
					var position = this._player.getPosition();
					var newPosition = cc.pAdd(position, delta);
					this._player.setPosition(cc.pClamp(newPosition, cc.p((this._player.width / 2), position.y), cc.p(this._winSize.width - (this._player.width / 2), position.y)));
					//this._player.setPosition(cc.pClamp(newPosition, cc.p((this._player.width / 2), 200), cc.p(this._winSize.width - (this._player.width / 2), this._winSizeCenterH)));
					
					//var positionH = this._playerHitCircle.getPosition();
					//var newPositionH = cc.pAdd(positionH, delta);
					//this._playerHitCircle.setPosition(cc.pClamp(newPositionH, cc.p((this._playerHitCircle.width / 2), positionH.y), cc.p(this._winSize.width - (this._playerHitCircle.width / 2), positionH.y)));
					
				}
			}.bind(this),
			onTouchEnded: function(touch, event) {
				/*if (this._game_state === GameLayer.GameState["PLAYING"]) {
					var endPoint = touch.getLocation();
					var force = cc.p(prevPos.x - endPoint.x, prevPos.y - endPoint.y)
					cc.log(cc.p(prevPos.x - endPoint.x, prevPos.y - endPoint.y));
					this._player.runAction(cc.moveBy(1.0, force).easing(cc.easeOut(3)));
				}*/
			}.bind(this)
		}, this);
		
	},
	update:function () {
		var size = cc.director.getWinSize();
		
		if (this._game_state === GameLayer.GameState["PLAYING"]) {
			//自キャラ自動移動処理
			/*var playerX = this._player.getPositionX();
			var newX = playerX + this._dx;
			this._player.setPositionX(newX);
			if (newX >= (this._winSize.width - (this._player.width / 2)) || newX <= (this._player.width / 2)) {
				this.changePlayerDirection();
			}*/

			// 自キャラの判定ボックス
			var playerRect = this._player.getBoundingBox();
			var playerPoint = this._player.getPosition();
			
			//令和衝突判定
			this._charas.forEach(function(element, index, array) {
				var isHit = cc.rectIntersectsRect(playerRect, element.getBoundingBox());
				if (isHit) {
					this.hitChara(element);
				}
			}, this);
			
			// 敵衝突判定
			this._enemies.forEach(function(element, index, array) {
				var isHit = cc.rectContainsPoint(element.getBoundingBox(), playerPoint);
				if (isHit) {
					this.hitEnemy(element);
					this.onGameOver();
				}
			}, this);
			
			
		}
	},
	//トランジション終わり時
	onEnterTransitionDidFinish: function() {
		this._super();
		//this.onGameStart();
		this._game_state = GameLayer.GameState["PLAYING"];
	},
	//自キャラ方向転換処理
	changePlayerDirection: function(){
		if (this._game_state === GameLayer.GameState["PLAYING"]) {
			this._dx = -this._dx;
			if (this._dx > 0) {
				this._player.setFlippedX(true);
			}else{
				this._player.setFlippedX(false);
			}
		}
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
		//点数加算
		this._score++;
		this.viewScore(this._score);
		
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
		var size = cc.director.getWinSize();
		
		//カウントダウン
		var seq = cc.sequence(
							cc.spawn(
								cc.moveBy(0.5, 0, 200).easing(cc.easeOut(5)),
								cc.fadeIn(0.5).easing(cc.easeOut(5))
							),
							cc.fadeOut(0.5).easing(cc.easeOut(5))
						);
		var count3 = cc.Sprite.create(res.img_countdown3);
		count3.setPosition(size.width / 2, size.height / 2);
		count3.setOpacity(0);
		count3.runAction(
			cc.sequence(
				cc.delayTime(0.5),
				seq,
				cc.callFunc(function() {
					this.addChild(count2, 1);
				}, this),
				cc.removeSelf()
			)
		);
		this.addChild(count3, 1);
		
		var count2 = cc.Sprite.create(res.img_countdown2);
		count2.setPosition(size.width / 2, size.height / 2);
		count2.setOpacity(0);
		count2.runAction(
			cc.sequence(
				seq,
				cc.callFunc(function() {
					this.addChild(count1, 1);
				}, this),
				cc.removeSelf()
			)
		);
		
		var count1 = cc.Sprite.create(res.img_countdown1);
		count1.setPosition(size.width / 2, size.height / 2);
		count1.setOpacity(0);
		count1.runAction(
			cc.sequence(
				seq,
				cc.callFunc(function() {
					this.addChild(start, 1);
					this._game_state = GameLayer.GameState["PLAYING"];
				}, this),
				cc.removeSelf()
			)
		);
		
		var start = cc.Sprite.create(res.img_start);
		start.setPosition(size.width / 2, size.height / 2);
		start.runAction(
			cc.sequence(
				cc.spawn(
					cc.scaleTo(0.5, 2.0).easing(cc.easeIn(0.5)),
					cc.fadeOut(0.5)
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
		
		var size = cc.director.getWinSize();
		var gameover = cc.Sprite.create(res.img_gameover);
		gameover.setPosition(size.width / 2, size.height / 2);
		gameover.setScale(0);
		gameover.runAction(
			cc.sequence(
				cc.scaleTo(0.5, 1.0).easing(cc.easeExponentialIn()),
				cc.delayTime(2.0),
				cc.scaleTo(0.5, 0).easing(cc.easeExponentialIn()),
				cc.delayTime(0.5),
				cc.callFunc(function() {
					this._game_state = GameLayer.GameState["RESULT"];
					this.onResult();
				}, this)
			)
		);
		this.addChild(gameover, 10);
	},
	//リザルト処理
	onResult: function(){
		var size = cc.director.getWinSize();
		
		//もう一度ボタン
		var button = ccui.Button.create();
		button.setTouchEnabled(true);
		button.loadTextures(res.img_btnRetry, res.img_btnRetryOn, null);
		button.setPosition(size.width / 2, size.height / 2 + 100);
		button.addTouchEventListener(function(sender, type){
			switch (type) {
			case ccui.Widget.TOUCH_BEGAN: // ボタンにタッチした時
				break;
			case ccui.Widget.TOUCH_MOVED: // ボタンにタッチ中
				break;
			case ccui.Widget.TOUCH_ENDED: // ボタンを離した時
				cc.director.runScene(cc.TransitionFade.create(1, new GameScene()));
				break;
			case ccui.Widget.TOUCH_CANCELED: // キャンセルした時
				break;
			}
		}, this);
		this.addChild(button, 10);
		
		
		//タイトルボタン
		var button2 = ccui.Button.create();
		button2.setTouchEnabled(true);
		button2.loadTextures(res.img_btnReturn, res.img_btnReturnOn, null);
		button2.setPosition(size.width / 2, size.height / 2 - 100);
		button2.addTouchEventListener(function(sender, type){
			switch (type) {
			case ccui.Widget.TOUCH_BEGAN: // ボタンにタッチした時
				break;
			case ccui.Widget.TOUCH_MOVED: // ボタンにタッチ中
				break;
			case ccui.Widget.TOUCH_ENDED: // ボタンを離した時
				cc.director.runScene(cc.TransitionFade.create(1, new TitleScene()));
				break;
			case ccui.Widget.TOUCH_CANCELED: // キャンセルした時
				break;
			}
		}, this);
		this.addChild(button2, 10);
		
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



