var TitleScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new TitleLayer();
		this.addChild(layer);
	}
});

//魔方陣
var MagicCircuitNode = cc.Node.extend({
	ctor:function () {
		this._super();
		var sprite = cc.Sprite.create(res.img_titleImg02);
		sprite.setScale(0);
		this.addChild(sprite);
		
		//アニメーション
		var act = cc.spawn(
			cc.rotateBy(5.0, 360),
			cc.scaleTo(0.5, 1.0).easing(cc.easeBackOut())
		);
		var repeat = cc.repeat(act,Math.pow(2, 30))
		sprite.runAction(repeat);
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
		this.addChild(chara, 2);
		
		//魔法陣配置
		var magic = new MagicCircuitNode();
		magic.setPosition(cc.p(winSizeCenterW, winSizeCenterH-300));
		magic.setScale(1.0, 0.5);
		this.addChild(magic, 1);
		
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
						cc.delayTime(1.0)
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
				this.onBtnStart();
				break;
			case ccui.Widget.TOUCH_CANCELED: // キャンセルした時
				break;
			}
		}, this);
	},
	//スタート処理
	onBtnStart: function(){
		this.schedule(this.spawnChara, 0.05, 20);
		cc.director.runScene(cc.TransitionFade.create(3, new GameScene()));
	},
	spawnChara: function(){
		var winSize = cc.director.getWinSize();
		var sprite = cc.Sprite.create(res.img_titleImg01);
		var x = Math.floor(Math.random() * winSize.width);
		var y = Math.floor(Math.random() * winSize.height);
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
	},
});