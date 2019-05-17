var GridLayer = cc.Layer.extend({
	ctor:function () {
		this._super();
		var winSize = cc.director.getWinSize();

		// 線の太さと色
		var lineSize = 1;
		var lineW = 40;
		var lineH = 40;
		var color = cc.color(0, 0, 125);

		// 縦線を引く
		for (var x = 1; x <= (winSize.width / lineW); x++)
		{
			var xPoint = x * lineW;
			var draw = new cc.DrawNode();
			draw.setPosition(cc.p(0, 0));
			draw.drawSegment(cc.p(xPoint, 0), cc.p(xPoint, winSize.height), lineSize, color);
			this.addChild(draw, 999);
		}
		// 横線を引く
		/*for (var y = 1; y &lt; pTiledMap->getMapSize().height; y++)
		{
			float yPoint = y * pTiledMap->getTileSize().height;
			draw->drawSegment(Point(0, yPoint), Point(pTiledMap->getContentSize().width, yPoint), lineSize, color);
		}*/
		
	}
});


//タイトルアニメーションフラグ
var g_runTitleAnime = false;

var TitleScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new TitleLayer();
		this.addChild(layer);
		
		var layer2 = new GridLayer();
		this.addChild(layer2);
	}
});

//魔方陣
var MagicCircuitNode = cc.Node.extend({
	_sprite: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: MagicCircuitNode  ****");
		this._sprite = cc.Sprite.create(res.img_titleImg02);
		this._sprite.setScale(0);
		this.addChild(this._sprite);
	},
	onEnter: function() {
		this._super();
		cc.log("**** onEnter: MagicCircuitNode  ****");
		if(g_runTitleAnime === true){
			this._sprite.setScale(1.0);
			this._sprite.runAction(
						cc.repeat(cc.rotateBy(5.0, 360),Math.pow(2, 30))
					);
			return;
		}
	},
	onEnterTransitionDidFinish: function() {
		this._super();
		cc.log("**** onEnterTransitionDidFinish: MagicCircuitNode  ****");
		if(g_runTitleAnime === true){
			return;
		}
		//アニメーション
		var act = cc.spawn(
			cc.rotateBy(5.0, 360),
			cc.scaleTo(0.5, 1.0).easing(cc.easeBackOut())
		);
		var repeat = cc.repeat(act,Math.pow(2, 30));
		this._sprite.runAction(repeat);
	}
});

var TitleLayer = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	_bg: null,
	_title: null,
	_chara: null,
	_magic: null,
	_btnStart: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: TitleLayer  ****");
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		//背景の配置
		this._bg = cc.Sprite.create(res.img_bgTitle);
		this._bg.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH));
		this.addChild(this._bg, 0);
		
		//タイトルの配置
		this._title = cc.Sprite.create(res.img_titleLogo);
		this._title.setPosition(cc.p(this._winSizeCenterW, this._winSize.height - 300));
		this._title.setScale(0);
		this.addChild(this._title, 1);
		
		//キャラクター配置
		this._chara = cc.Sprite.create(res.img_titleImg01);
		this._chara.setPosition(cc.p(this._winSizeCenterW - 50, this._winSizeCenterH - 30));
		this._chara.setOpacity(0);
		this.addChild(this._chara, 2);
		
		//魔法陣配置
		this._magic = new MagicCircuitNode();
		this._magic.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH - 300));
		this._magic.setScale(1.0, 0.5);
		this.addChild(this._magic, 1);
		
		//スタートボタンの配置
		this._btnStart = ccui.Button.create();
		this._btnStart.setTouchEnabled(false);
		this._btnStart.loadTextures(res.img_btnStart, res.img_btnStartOn, null);
		this._btnStart.setPosition(cc.p(this._winSizeCenterW, 200));
		this._btnStart.setOpacity(0);
		this.addChild(this._btnStart, 2);
		
		//スタートボタンのタッチイベントを設定
		this._btnStart.addTouchEventListener(function(sender, type){
			switch (type) {
			case ccui.Widget.TOUCH_BEGAN: // ボタンにタッチした時
				break;
			case ccui.Widget.TOUCH_MOVED: // ボタンにタッチ中
				break;
			case ccui.Widget.TOUCH_ENDED: // ボタンを離した時
				this.onStart();
				break;
			case ccui.Widget.TOUCH_CANCELED: // キャンセルした時
				break;
			}
		}, this);
		
		//スタートボタン2の配置
		var btnStart2 = ccui.Button.create();
		btnStart2.setTouchEnabled(true);
		btnStart2.loadTextures(res.img_btnStart, res.img_btnStartOn, null);
		btnStart2.setPosition(cc.p(10, 10));
		btnStart2.setScale(0.5);
		this.addChild(btnStart2, 2);
		
		//スタートボタン2のタッチイベントを設定
		btnStart2.addTouchEventListener(function(sender, type){
			switch (type) {
			case ccui.Widget.TOUCH_BEGAN: // ボタンにタッチした時
				break;
			case ccui.Widget.TOUCH_MOVED: // ボタンにタッチ中
				break;
			case ccui.Widget.TOUCH_ENDED: // ボタンを離した時
				cc.director.runScene(cc.TransitionFade.create(1, new GameScene2()));
				break;
			case ccui.Widget.TOUCH_CANCELED: // キャンセルした時
				break;
			}
		}, this);
		
		//スタートボタン3の配置
		var btnStart3 = ccui.Button.create();
		btnStart3.setTouchEnabled(true);
		btnStart3.loadTextures(res.img_btnStart, res.img_btnStartOn, null);
		btnStart3.setPosition(cc.p(this._winSize.width - 10, 10));
		btnStart3.setScale(0.5);
		this.addChild(btnStart3, 2);
		
		//スタートボタン2のタッチイベントを設定
		btnStart3.addTouchEventListener(function(sender, type){
			switch (type) {
			case ccui.Widget.TOUCH_BEGAN: // ボタンにタッチした時
				break;
			case ccui.Widget.TOUCH_MOVED: // ボタンにタッチ中
				break;
			case ccui.Widget.TOUCH_ENDED: // ボタンを離した時
				cc.director.runScene(cc.TransitionFade.create(1, new TestScene()));
				break;
			case ccui.Widget.TOUCH_CANCELED: // キャンセルした時
				break;
			}
		}, this);
	},
	onEnter: function() {
		this._super();
		cc.log("**** onEnter: TitleLayer  ****");
		if(g_runTitleAnime === true){
			this._chara.runAction(
				cc.sequence(
					cc.spawn(
						cc.moveBy(0, cc.p(0, 30)),
						cc.fadeIn(0)
					),
					cc.repeat(
						cc.sequence(
							cc.moveBy(1.0, cc.p(0, -30)).easing(cc.easeSineIn()),
							cc.delayTime(0.3),
							cc.moveBy(1.0, cc.p(0, 30)).easing(cc.easeSineIn()),
						),Math.pow(2, 30)
					)
				)
			);
			
			var act = cc.repeat( 
							cc.sequence(
								cc.rotateTo(0.05, 10).easing(cc.easeIn(3)),
								cc.rotateTo(0.05, -10).easing(cc.easeIn(3))
						), 10);
			this._title.runAction(
				cc.sequence(
					cc.scaleTo(0, 1.0),
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
							cc.delayTime(1.0)
						),Math.pow(2, 30)
					)
				)
			);
			
			this._btnStart.setTouchEnabled(true);
			this._btnStart.runAction(
				cc.sequence(
					cc.fadeIn(0)
				)
			);
			return;
		}
	},
	//トランジション終わり時
	onEnterTransitionDidFinish: function() {
		this._super();
		cc.log("**** onEnterTransitionDidFinish: TitleLayer  ****");
		if(g_runTitleAnime === true){
			return;
		}
		
		g_runTitleAnime = true;
		
		//キャラクターのアニメーション
		this._chara.runAction(
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
				cc.repeat(
					cc.sequence(
						cc.moveBy(1.0, cc.p(0, -30)).easing(cc.easeSineIn()),
						cc.delayTime(0.3),
						cc.moveBy(1.0, cc.p(0, 30)).easing(cc.easeSineIn()),
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
		this._title.runAction(
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
						cc.delayTime(1.0)
					),Math.pow(2, 30)
				)
			)
		);
		
		//ボタンのアニメーション
		var btnStart = this._btnStart;
		this._btnStart.runAction(
			cc.sequence(
				cc.delayTime(3.5),
				cc.fadeIn(0.3).easing(cc.easeOut(3)),
				cc.callFunc(function(){
					btnStart.setTouchEnabled(true);
				})
			)
		);
	},
	//スタート処理
	onStart: function(){
		//わらわら出現
		this.schedule(this.spawnChara, 0.05, 20);
		cc.director.runScene(cc.TransitionFade.create(3, new GameScene()));
	},
	//ランダムにキャラクターを配置
	spawnChara: function(){
		var sprite = cc.Sprite.create(res.img_titleImg01);
		var x = Math.floor(Math.random() * this._winSize.width);
		var y = Math.floor(Math.random() * this._winSize.height);
		sprite.setPosition(cc.p(x, y));
		sprite.setOpacity(0);
		sprite.setScale(0);
		this.addChild(sprite, 4);
		
		var act = cc.sequence(
						cc.spawn(
							cc.scaleTo(0.5, 1.0).easing(cc.easeIn(3)),
							cc.fadeIn(0.5).easing(cc.easeIn(3))
						),
						cc.delayTime(1.0)
					);
		sprite.runAction(act);
	}
});