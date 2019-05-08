var TitleScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new TitleLayer();
		this.addChild(layer);
	}
});

var TitleLayer = cc.Layer.extend({
	ctor:function () {
		this._super();
		var size = cc.director.getWinSize();
		
		//背景
		var bg = cc.Sprite.create(res.img_bgtitle);
		bg.setPosition(size.width / 2, size.height / 2);
		this.addChild(bg, 0);
		
		//タイトル
		var title = cc.Sprite.create(res.img_title);
		title.setPosition(size.width / 2, size.height + 75);
		title.runAction(
			cc.sequence(
				cc.moveBy(0.5, 0, -375).easing(cc.easeOut(3)),
				cc.delayTime(1),
				cc.callFunc(function(){
					var seq = cc.sequence(
						cc.spawn(
							cc.scaleTo(0.5, 1.3).easing(cc.easeIn(3)),
							cc.rotateBy(0.5, 10).easing(cc.easeElasticIn()),
						),
						cc.rotateBy(0.2, -10),
						cc.delayTime(0.5),
						cc.scaleTo(0.5, 1).easing(cc.easeOut(3)),
						cc.delayTime(0.5),
					);
					var repeat = cc.repeatForever(seq);
					title.runAction(repeat);
				})
			)
		);
		this.addChild(title, 1);
		
		//スタートボタン
		var button = ccui.Button.create();
		button.setTouchEnabled(false);
		button.loadTextures(res.img_btnStart, res.img_btnStart, null);
		button.setPosition(size.width / 2, size.height / 2);
		button.addTouchEventListener(function(sender, type){ // タッチイベントを設定
			switch (type) {
			case ccui.Widget.TOUCH_BEGAN: // ボタンにタッチした時
				break;
			case ccui.Widget.TOUCH_MOVED: // ボタンにタッチ中
				break;
			case ccui.Widget.TOUCH_ENDED: // ボタンを離した時
				cc.director.runScene(cc.TransitionFade.create(2, new GameScene()));
				break;
			case ccui.Widget.TOUCH_CANCELED: // キャンセルした時
				break;
			}
		}, this);
		button.setOpacity(0);
		button.runAction(
			cc.sequence(
				cc.delayTime(1.5),
				cc.fadeIn(1.0),
				cc.callFunc(function(){
					button.setTouchEnabled(true);
				})
			)
		);
		this.addChild(button, 1);
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
		this._game_state = GameLayer.GameState["PLAYING"];
		this._enemies = [];
		this._coins = [];
		//画面サイズ
		var size = cc.director.getWinSize();
		
		//背景
		var bg = cc.Sprite.create(res.img_bgtitle);
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
				if (this._game_state == GameLayer.GameState["DAMAGE"]) {
					cc.director.runScene(new TitleScene());
					return true;
				}
				
				this.changeDirection();
				return true;
			}.bind(this)
		}, this);
		
	},
	
	update:function () {
		if (this._game_state === GameLayer.GameState["DAMAGE"]) {
			return false;
		}
		
		var size = cc.director.getWinSize();
		
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
				this.gameOver();
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
	},
	//自キャラ方向転換処理
	changeDirection: function(){
		if (this._game_state === "gameover") {
			return false;
		}
		this._dx = -this._dx;
		if (this._dx > 0) {
			this._player.setFlippedX(true);
		}else{
			this._player.setFlippedX(false);
		}
	},
	//敵出現処理
	spawnEnemy: function(){
		if (this._game_state === GameLayer.GameState["DAMAGE"]) {
			return false;
		}
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
	},
	//コイン出現処理
	spawnCoin: function(){
		if (this._game_state === GameLayer.GameState["DAMAGE"]) {
			return false;
		}
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
	},
	//ゲームオーバー処理
	gameOver: function(){
		var size = cc.director.getWinSize();
		var label = cc.LabelTTF.create("ゲームオーバー！", null, 100);
		label.setPosition(size.width / 2, size.height / 2);
		label.setColor(cc.color(255,0,0,255));
		this.addChild(label, 1);
		this._game_state = GameLayer.GameState["DAMAGE"];
		
		for(var i = 0; i < this._enemies.length; i++){
			this._enemies[i].pause();
		}
		
		var i = this._coins.length;
		while(i--){
			this._coins[i].pause();
		}
	},
});

// ゲームの状態
GameLayer.GameState = {
	"READY":   0, // 開始演出中
	"PLAYING": 1, // プレイ中
	"DAMAGE": 2, // 被弾
	"ENDING":  3, // 終了演出中
	"RESULT":  4  // スコア表示
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