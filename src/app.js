var TitleScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new TitleLayer();
		this.addChild(layer);
	}
});

var MagicCircuitNode = cc.Node.extend({
	_sprite:null,
	ctor:function () {
		this._super();
		this._sprite = cc.Sprite.create(res.img_titleImg02);
		this._sprite.setScale(0);
		this.addChild(this._sprite, 0);
	},
	onEnter:function(){
		this._super();
		var act = cc.spawn(
			cc.rotateBy(5.0, 360),
			cc.scaleTo(0.5, 1.0).easing(cc.easeBackOut())
		);
		var repeat = cc.repeat(act,Math.pow(2, 30))
		this._sprite.runAction(repeat);
	},
	onExit:function(){
		this._super();
		
	}
});

var TitleLayer = cc.Layer.extend({
	ctor:function () {
		this._super();
		var winSize = cc.director.getWinSize();
		var winSizeCenterW = winSize.width / 2.0;
		var winSizeCenterH = winSize.height / 2.0;
		
		//背景の配置
		var bg = cc.Sprite.create(res.img_bgTitle);
		bg.setPosition(cc.p(winSizeCenterW, winSizeCenterH));
		this.addChild(bg, 0);
		
		//タイトルの配置
		var title = cc.Sprite.create(res.img_titleLogo);
		title.setPosition(cc.p(winSizeCenterW, winSize.height - 300));
		title.setScale(0);
		this.addChild(title, 1);
		
		//キャラクター配置
		var chara = cc.Sprite.create(res.img_titleImg01);
		chara.setPosition(cc.p(winSizeCenterW-50, winSizeCenterH-30));
		chara.setOpacity(0);
		this.addChild(chara, 1);
		
		//魔法陣配置
		var magic = new MagicCircuitNode();
		magic.setPosition(cc.p(winSizeCenterW, winSizeCenterH-300));
		magic.setScale(1.0, 0.5);
		this.addChild(magic, 0);
		
		//スタートボタンの配置
		var button = ccui.Button.create();
		button.setTouchEnabled(false);
		button.loadTextures(res.img_btnStart, res.img_btnStartOn, null);
		button.setPosition(cc.p(winSizeCenterW, 200));
		button.setOpacity(0);
		this.addChild(button, 2);
		
		//キャラクターのアニメーション
		chara.runAction(
			cc.sequence(
				cc.delayTime(1.0),
				cc.spawn(
					cc.moveBy(1.0, cc.p(0, 30)).easing(cc.easeOut(3)),
					cc.repeat( 
						cc.sequence(
							cc.moveBy(0.05, cc.p(5, 0)).easing(cc.easeIn(3)),
							cc.moveBy(0.05, cc.p(-5, 0)).easing(cc.easeIn(3))
						), 14),
					cc.fadeIn(0.5).easing(cc.easeIn(3))
				),
				cc.delayTime(1.0),
				cc.repeat(
					cc.sequence(
						cc.moveBy(1.0, cc.p(0, 30)).easing(cc.easeSineIn()),
						cc.moveBy(1.0, cc.p(0, -30)).easing(cc.easeSineIn()),
						cc.delayTime(0.3)
					),Math.pow(2, 30)
				)
			)
		);
		
		//タイトルのアニメーション
		var act = cc.repeat( 
						cc.sequence(
							cc.rotateTo(0.05, 10).easing(cc.easeIn(3)),
							cc.rotateTo(0.05, -10).easing(cc.easeIn(3))
					), 10);
		title.runAction(
			cc.sequence(
				cc.delayTime(3.0),
				cc.scaleTo(0.3, 1.0).easing(cc.easeBackOut()),
				cc.delayTime(2.0),
				cc.repeat(
					cc.sequence(
						cc.rotateBy(0.5, 720).easing(cc.easeIn(3)),
						cc.delayTime(1.0),
						cc.spawn(
							act,
							cc.scaleTo(0.5, 2.0).easing(cc.easeIn(3)),
							cc.fadeOut(0.5).easing(cc.easeIn(3))
						),
						cc.delayTime(1.0),
						cc.rotateTo(0, 0),
						cc.spawn(
							cc.scaleTo(0.3, 1.0).easing(cc.easeIn(3)),
							cc.fadeIn(0.3).easing(cc.easeIn(3))
						),
						cc.delayTime(1.0),
					),Math.pow(2, 30)
				)
			)
		);
		
		//ボタンのアニメーション
		button.runAction(
			cc.sequence(
				cc.delayTime(3.5),
				cc.fadeIn(0.3).easing(cc.easeOut(3)),
				cc.callFunc(function(){
					button.setTouchEnabled(true);
				})
			)
		);
		
		//ボタンのタッチイベントを設定
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
	},
});


var GameLayer = cc.Layer.extend({
	_player:null,
	_label_score:null,
	_score: 0,
	_enemies: [],
	_coins: [],
	_dx: 10, //自キャラX方向の移動量
	_game_state: null,
	ctor:function () {
		this._super();
		//初期化
		this._game_state = GameLayer.GameState["READY"];
		this._enemies = [];
		this._coins = [];
		//画面サイズ
		var size = cc.director.getWinSize();
		
		//背景
		var bg = cc.Sprite.create(res.img_bgGame);
		bg.setPosition(size.width / 2, size.height / 2);
		this.addChild(bg, 0);
		
		//自キャラ
		var player = cc.Sprite.create(res.img_player01);
		player.setPosition(size.width / 2, 300);
		player.setFlippedX(true);
		this.addChild(player, 1);
		this._player = player;
		
		
		var label = cc.LabelTTF.create("0", null, 100);
		label.setPosition(50, size.height-130);
		label.setColor(cc.color(0,0,0,255));
		this.addChild(label, 1);
		this._label_score = label;
		
		this.scheduleUpdate();
		//1秒ごとに敵出現
		this.schedule(this.spawnEnemy, 1);
		//1.2秒ごとにコイン出現
		this.schedule(this.spawnCoin, 1.2);
		
		
		//タッチイベント
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
				if (this._game_state === GameLayer.GameState["PLAYING"]) {
					this.changeDirection();
				}
				
				
				return true;
			}.bind(this)
		}, this);
		
	},
	
	update:function () {
		var size = cc.director.getWinSize();
		
		if (this._game_state === GameLayer.GameState["PLAYING"]) {
			//自キャラ移動処理
			var playerX = this._player.getPositionX();
			var newX = playerX + this._dx;
			this._player.setPositionX(newX);
			if (newX > (size.width-50) || newX < (0+50)) {
				this.changeDirection();
			}

			// 衝突判定
			var playerRect = this._player.getBoundingBox();
			// 敵と衝突しているか
			for(var i = 0; i < this._enemies.length; i++){
				if (cc.rectIntersectsRect(playerRect, this._enemies[i].getBoundingBox())) {
					// ゲームオーバー
					this.onGameOver();
				}
			}

			// コインと衝突しているか
			var i = this._coins.length;
			while(i--){
				if (cc.rectIntersectsRect(playerRect, this._coins[i].getBoundingBox())) {
					this._coins[i].removeFromParent();
					this._coins.splice(i,1);
					this._score++;
					this._label_score.string = this._score+"";
				}
			}
		}
	},
	//トランジション終わり時
	onEnterTransitionDidFinish: function() {
		this._super();
		this.onGameStart();
	},
	
	//自キャラ方向転換処理
	changeDirection: function(){
		if (this._game_state === GameLayer.GameState["PLAYING"]) {
			this._dx = -this._dx;
			if (this._dx > 0) {
				this._player.setFlippedX(true);
			}else{
				this._player.setFlippedX(false);
			}
		}
	},
	//敵出現処理
	spawnEnemy: function(){
		if (this._game_state === GameLayer.GameState["PLAYING"]) {
			var size = cc.director.getWinSize();
			var enemy = cc.Sprite.create(res.img_enemy01);
			var x = Math.floor( Math.random() * (size.width - 50) );
			var y = size.height;
			enemy.setPosition(x , y);
			this.addChild(enemy, 0);
			//配列に保存
			this._enemies.push(enemy); 
			var randDuration = Math.random() * 2;
			var baseDuration = 2;
			var duration = baseDuration + randDuration; // 2～4の間の数字を生成
			var move = new cc.MoveBy(duration, cc.p(0, -size.height));
			var remove = new cc.RemoveSelf(true);
			var action = new cc.Sequence([move, remove]);
			enemy.runAction(action);
		}
	},
	//コイン出現処理
	spawnCoin: function(){
		if (this._game_state === GameLayer.GameState["PLAYING"]) {
			var size = cc.director.getWinSize();
			var coin = cc.Sprite.create(res.img_coin01);
			var x = Math.floor( Math.random() * (size.width - 50) );
			var y = size.height;
			coin.setPosition(x , y);
			this.addChild(coin, 0);
			//配列に保存
			this._coins.push(coin)
			var randDuration = Math.random() * 4;
			var duration = 5 + randDuration;
			var move = new cc.MoveBy(duration, cc.p(0, -size.height));
			var remove = new cc.RemoveSelf(true);
			var action = new cc.Sequence([move, remove])
			coin.runAction(action);
		}
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
		
		var i = this._coins.length;
		while(i--){
			this._coins[i].pause();
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
		this.addChild(gameover, 1);
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
		this.addChild(button, 1);
		
		
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
		this.addChild(button2, 1);
		
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









var debugScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		this.sprites = [];
		var size = cc.director.getWinSize();

		for (var i = 0; i < 500; i++) {
			var sprite = cc.Sprite.create(res.img_debug);
			sprite.setPosition(size.width / 2, size.height / 2);
			sprite.dir = {
				x : Math.random() * 20 - 10,
				y : Math.random() * 20 - 10
			};
			this.sprites.push(sprite);
			this.addChild(sprite, 0);
		}

		this._label = cc.LabelTTF.create("", "Arial", 20);
		this._label.setPosition(50, size.height-20);
		this._label.setColor(cc.color(0,0,0,255));
		this.addChild(this._label, 1);

		this.scheduleUpdate();
	},
	update:function () {
		sprites = this.sprites;
		var size = cc.director.getWinSize();
		for (var i = 0, len = sprites.length; i < len; i++) {
			sprites[i].x +=  sprites[i].dir.x;
			sprites[i].y +=  sprites[i].dir.y;
			if (sprites[i].x >= size.width || sprites[i].x <= 0) sprites[i].dir.x *= -1
			if (sprites[i].y >= size.height || sprites[i].y <= 0) sprites[i].dir.y *= -1
		}

		var currentTime = new Date();
		var fps = 1000 / (currentTime - this._oldTime);
		this._oldTime = currentTime;
		this._label.setString(fps.toFixed(2) + " FPS");
	}
});