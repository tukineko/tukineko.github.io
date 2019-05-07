var TitleScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var size = cc.director.getWinSize();
		var bg_title = cc.Sprite.create(res.img_bgtitle);
		bg_title.setPosition(size.width / 2, size.height / 2);
		this.addChild(bg_title, 0);
		
		/*var menuBtn = new cc.MenuItemImage(res.img_btn01, res.img_btn01, function() {
			console.log('Pressed!');
		});
		menuBtn.setPosition(200, 100);
		var menu = new cc.Menu(menuBtn);
		menu.setPosition(0, 0);
		this.addChild(menu, 2);*/
		
		/*var menu01 = cc.MenuItemFont.create("スタート１", this.onGameStart1(), this);
		var menu02 = cc.MenuItemFont.create("スタート２", this.onGameStart1(), this);
		menu01.setColor(cc.color(0,0,0,255));
		menu02.setColor(cc.color(0,0,0,255));
		menu01.setFontSize( 100 );
		menu02.setFontSize( 100 );
		var menu = cc.Menu.create(menu01, menu02);
		menu.alignItemsVertically();
		menu.setPosition(size.width / 2, size.height / 2);
		this.addChild(menu, 1);*/
		
		
		
		this._label = cc.LabelTTF.create("touch me！", null, 50);
		this._label.setPosition(size.width / 2, size.height / 2);
		this._label.setColor(cc.color(0,0,0,255));
		this._label.runAction(cc.repeatForever(cc.blink(1, 2)));
		this.addChild(this._label, 1);
		
		var listener = cc.EventListener.create( {
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(touch, event) {
				cc.director.runScene(new GameScene());
			}
		});
		cc.eventManager.addListener(listener,this);
		
		
		
		var move1 = cc.moveBy(1.0, 240, 480); // １秒かけて(320+240, 120+480)の位置に直線移動
		var ease1 = move1.easing(cc.easeIn(3)); // 加速度的な移動にする
		var rotate1 = cc.rotateBy(1.0, 720); // 1秒かけて時計回りに２回転
		var ease2 = rotate1.easing(cc.easeIn(3));  // 加速度的な回転にする
		var scale1 = cc.scaleBy(1.0, 1.5); // 1秒かけて1.5倍のサイズに拡大
		var ease3 = scale1.easing(cc.easeIn(3)); // 加速度的な変化にする
		var spawn1 = cc.spawn(ease1, ease2, ease3); // 移動と回転と拡大を同時に行う

		var delay1 = cc.delayTime(0.5); // 0.5秒間停止

		var func1 = cc.callFunc(function(){ // 関数を実行
			item01.setOpacity(0); // 透明にする
		}, item01);

		var delay2 = cc.delayTime(0.5); // 0.5秒間停止

		// 1秒かけてベジェ曲線に沿って元の位置に戻る
		var bezier1 = cc.bezierBy(1.0, [cc.p(0, 0), cc.p(-600, -200), cc.p(-240, -480)]); 
		var fade1 = cc.fadeIn(1.0); // 不透明にする
		var scale2 = scale1.reverse(); // 元のサイズに縮小
		var spawn2 = cc.spawn(bezier1, fade1, scale2); // 移動、透明度の変更、縮小を同時に行う

		var seq1 = cc.sequence(spawn1, delay1, func1, delay2, spawn2); // 作成したアクションを連続で行うシーケンスを作成
		var repeat1 = cc.repeat(seq1, 2); // シーケンスを2回繰り返す
		
		var item01 = cc.Sprite.create(res.img_item01);
		item01.setPosition(size.width / 2, size.height / 2);
		item01.runAction(repeat1);
		this.addChild(item01, 0);
		
		
	},
	onGameStart1:function () {
		cc.director.runScene(new GameScene());
	}
});

var GameScene = cc.Scene.extend({
	_chara:null,
	_label_score:null,
	_score: 0,
	_enemies: [],
	_coins: [],
	_dx: 10,
	_game_state: "game",
	onEnter:function () {
		this._super();
		//初期化
		this._game_state = "game";
		this._enemies = [];
		this._coins = [];
		
		var size = cc.director.getWinSize();
		
		var bg_title = cc.Sprite.create(res.img_bgtitle);
		bg_title.setPosition(size.width / 2, size.height / 2);
		this.addChild(bg_title, 0);
		
		var sprite = cc.Sprite.create(res.img_chara01);
		sprite.setPosition(size.width / 2, size.height / 2);
		sprite.setFlippedX(true);
		this.addChild(sprite, 0);
		this._chara = sprite;
		
		var label = cc.LabelTTF.create("0", null, 100);
		label.setPosition(50, size.height-130);
		label.setColor(cc.color(0,0,0,255));
		this.addChild(label, 1);
		this._label_score = label;
		
		this.scheduleUpdate();
		this.schedule(this.spawnEnemy, 1);
		this.schedule(this.spawnCoin, 1.5);
		
		cc.eventManager.addListener({ // タッチイベントを登録
			event: cc.EventListener.TOUCH_ONE_BY_ONE, // シングルタッチのみ対応
			swallowTouches:false, // 以降のノードにタッチイベントを渡す
			onTouchBegan:this.onTouchBegan.bind(this), // タッチ開始時
			onTouchMoved:this.onTouchMoved.bind(this), // タッチ中
			onTouchEnded:this.onTouchEnded.bind(this), // タッチ終了時
			onTouchCanceled:this.onTouchCancelled.bind(this), // タッチキャンセル時
		}, this);
	},
	onTouchBegan:function(touch, event){ // タッチ開始時処理
		if (this._game_state == "gameover") {
			cc.director.runScene(new TitleScene());
			return true;
		}
		
		this.changeDirection();
		return true;
	},
	onTouchMoved:function(touch, event){ // タッチ中の処理
		// タッチ中の処理
	},
	onTouchEnded:function(touch, event){ // タッチ終了時処理
		// タッチ終了時処理
	},
	onTouchCancelled:function(touch, event){ // タッチキャンセル時処理
		// タッチキャンセル時処理
	},
	update:function () {
		if (this._game_state == "gameover") {
			return false;
		}
		var charaX = this._chara.getPositionX();
		var newX = charaX + this._dx;
		this._chara.setPositionX(newX);
		var size = cc.director.getWinSize();
		if (newX > size.width || newX < 0) {
			this.changeDirection();
		}
		
		// 衝突判定
		var charaRect = this._chara.getBoundingBox();
		// 敵と衝突しているか
		for(var i = 0; i < this._enemies.length; i++){
			if (cc.rectIntersectsRect(charaRect, this._enemies[i].getBoundingBox())) {
				// ゲームオーバー
				this.gameOver();
			}
		}
		// コインと衝突しているか
		var i = this._coins.length;
		while(i--){
			if (cc.rectIntersectsRect(charaRect, this._coins[i].getBoundingBox())) {
				this._coins[i].removeFromParent();
				this._coins.splice(i,1);
				this._score++;
				this._label_score.string = this._score+"";
			}
		}
	},
	changeDirection: function(){
		if (this._game_state == "gameover") {
			return false;
		}
		this._dx = -this._dx;
		if (this._dx > 0) {
			this._chara.setFlippedX(true);
		}else{
			this._chara.setFlippedX(false);
		}
	},
	spawnEnemy: function(){
		if (this._game_state == "gameover") {
			return false;
		}
		var size = cc.director.getWinSize();
		// 敵Spriteの生成
		var enemy = cc.Sprite.create(res.img_enemy01);
		var x = Math.floor( Math.random() * size.width ) ;
		var y = 0;
		enemy.setPosition(x , y);  // 敵の出現時の座標
		this.addChild(enemy, 0);
		this._enemies.push(enemy); // _enemiesという配列に追加して保持しておく
		var randDuration = Math.random() * 2;
		var baseDuration = 2;
		var duration = baseDuration + randDuration; // 2~4の間の数字を生成
		var move = new cc.MoveBy(duration, cc.p(0, size.height)); // MoveByというアクションを生成
		var remove = new cc.RemoveSelf(true); // 自身を削除するアクションを生成
		var action = new cc.Sequence([move, remove]); // 各アクションを順番に実行するアクションを生成
		enemy.runAction(action); // 敵にアクションを実行させる
	},
	spawnCoin: function(){
		if (this._game_state == "gameover") {
			return false;
		}
		var size = cc.director.getWinSize();
		var coin = cc.Sprite.create(res.img_coin01);
		var x = Math.floor( Math.random() * size.width ) ;
		var y = 0;
		coin.setPosition(x , y);
		this.addChild(coin, 0);
		this._coins.push(coin)
		var randDuration = Math.random() * 4;
		var duration = 5 + randDuration;
		var move = new cc.MoveBy(duration, cc.p(0, size.height));
		var remove = new cc.RemoveSelf(true);
		var action = new cc.Sequence([move, remove])
		coin.runAction(action);
	},
	gameOver: function(){
		var size = cc.director.getWinSize();
		var label = cc.LabelTTF.create("ゲームオーバー！", null, 100);
		label.setPosition(size.width / 2, size.height / 2);
		label.setColor(cc.color(255,0,0,255));
		this.addChild(label, 1);
		this._game_state = "gameover";
		
		for(var i = 0; i < this._enemies.length; i++){
			this._enemies[i].pause();
		}
		
		var i = this._coins.length;
		while(i--){
			this._coins[i].pause();
		}
	},
});

var debugScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		this.sprites = [];
		var size = cc.director.getWinSize();

		for (var i = 0; i < 500; i++) {
			var sprite = cc.Sprite.create(res.img_enemy);
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