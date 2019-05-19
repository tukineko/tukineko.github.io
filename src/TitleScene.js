var TitleScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new TitleLayer();
		this.addChild(layer);
	}
});

var TitleLayer = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: TitleLayer  ****");
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		//背景
		var bg = new cc.Sprite(res.img_titleBg);
		bg.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH));
		bg.setScale(2.5);
		this.addChild(bg, 0);
		bg.runAction(
			cc.repeatForever(cc.rotateBy(8.0, -360))
		);
		
		var bg2 = new cc.Sprite(res.img_titleBg2);
		bg2.setPosition(cc.p(this._winSizeCenterW, 600));
		this.addChild(bg2, 0);
		
		//エフェクト
		var frameSeq = [];
		var texture = cc.textureCache.addImage(res.img_titleEffect);
		for (var i = 0; i < 10; i++) {
			var frame = new cc.SpriteFrame(texture, cc.rect(240*i,0,240,240));
			frameSeq.push(frame);
		}
		var anime = new cc.Animation(frameSeq, 0.1);
		var act = cc.repeatForever(new cc.Animate(anime));
		var sprite = new cc.Sprite(res.img_titleEffect, cc.rect(0 ,0 ,120, 120));
		sprite.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH - 100));
		sprite.setScale(3.0);
		sprite.setBlendFunc(new cc.BlendFunc(cc.SRC_ALPHA, cc.ONE));
		sprite.runAction(act);
		this.addChild(sprite, 3);
		
		//魔法陣配置
		var magic = new cc.Sprite(res.img_titleMagic);
		magic.setScale(2.0);
		magic.runAction(
			cc.repeatForever(
				cc.rotateBy(4.0, 360)
			)
		);
		var magicWap = new cc.Node();
		magicWap.addChild(magic);
		magicWap.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH - 400));
		magicWap.setScale(1.0, 0.5);
		this.addChild(magicWap, 0);
		
		//パーティクル
		var particle = new cc.ParticleSystem(res.particlePlist01);
		particle.setAutoRemoveOnFinish(true);
		particle.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH));
		this.addChild(particle, 1);
		
		//キャラ
		var chara = new cc.Sprite(res.img_titleChara);
		chara.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH));
		this.addChild(chara, 2);
		chara.runAction(
			cc.repeatForever(
				cc.sequence(
					cc.moveBy(1.0, cc.p(0, -30)).easing(cc.easeSineIn()),
					cc.delayTime(0.3),
					cc.moveBy(1.0, cc.p(0, 30)).easing(cc.easeSineIn())
				)
			)
		);
		
		cc.eventManager.addListener({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
				cc.director.runScene(cc.TransitionFade.create(1.0, new GameScene()));
				return true;
			}.bind(this),
		}, this);
		
		//もどるボタンの配置
		var btnBack = new cc.Sprite(res.img_commonBtnBack);
		btnBack.setPosition(cc.p(100, 100));
		btnBack.setScale(0.2);
		this.addChild(btnBack, 3);
		
		//タッチイベント
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
				var point = touch.getLocation();
				
				//戻るボタン
				if(cc.rectContainsPoint(btnBack.getBoundingBox(), point)){
					cc.director.runScene(cc.TransitionFade.create(1, new MenuScene()));
				}else{
					cc.director.runScene(cc.TransitionFade.create(1, new GameScene()));
				}
				
				return true;
			}.bind(this),
			onTouchMoved: function(touch, event) {
				
			}.bind(this),
			onTouchEnded: function(touch, event) {
				
			}.bind(this)
		}, this);
	}
});

var TitleScene2 = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new TitleLayer2();
		this.addChild(layer);
	}
});

var TitleLayer2 = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	_bg: null,
	_title: null,
	_chara: null,
	_btnStart: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: TitleLayer2  ****");
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		//背景の配置
		this._bg = new cc.Sprite(res.img_title2Bg);
		this._bg.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH));
		this.addChild(this._bg, 0);
		
		//タイトルの配置
		this._title = new cc.Sprite(res.img_title2Logo);
		this._title.setPosition(cc.p(this._winSizeCenterW, this._winSize.height - 300));
		this._title.setScale(2.0);
		this._title.setOpacity(0);
		this.addChild(this._title, 3);
		
		//キャラクター配置
		this._chara = new cc.Sprite(res.img_title2Chara);
		this._chara.setPosition(cc.p(this._winSizeCenterW + 70, this._winSizeCenterH - 200));
		this._chara.setRotation(25);
		this._chara.setScale(2.0);
		this._chara.setOpacity(0);
		this.addChild(this._chara, 2);
		
		//スタートボタンの配置
		this._btnStart = new ccui.Button();
		this._btnStart.setTouchEnabled(true);
		this._btnStart.loadTextures(res.img_titleBtnStart, res.img_titleBtnStartOn, null);
		this._btnStart.setPosition(cc.p(this._winSizeCenterW, 300));
		this.addChild(this._btnStart, 3);
		
		//スタートボタンのタッチイベントを設定
		this._btnStart.addTouchEventListener(function(sender, type){
			switch (type) {
			case ccui.Widget.TOUCH_BEGAN: // ボタンにタッチした時
				break;
			case ccui.Widget.TOUCH_MOVED: // ボタンにタッチ中
				break;
			case ccui.Widget.TOUCH_ENDED: // ボタンを離した時
				cc.director.runScene(cc.TransitionFade.create(3, new GameScene2()));
				break;
			case ccui.Widget.TOUCH_CANCELED: // キャンセルした時
				break;
			}
		}, this);
		
		//もどるボタンの配置
		var btnBack = new ccui.Button();
		btnBack.setTouchEnabled(true);
		btnBack.loadTextures(res.img_commonBtnBack, res.img_commonBtnBack, null);
		btnBack.setPosition(cc.p(100, 100));
		btnBack.setScale(0.2);
		this.addChild(btnBack, 3);
		
		//もどるボタンのタッチイベントを設定
		btnBack.addTouchEventListener(function(sender, type){
			switch (type) {
			case ccui.Widget.TOUCH_BEGAN: // ボタンにタッチした時
				break;
			case ccui.Widget.TOUCH_MOVED: // ボタンにタッチ中
				break;
			case ccui.Widget.TOUCH_ENDED: // ボタンを離した時
				cc.director.runScene(cc.TransitionFade.create(1.0, new MenuScene()));
				break;
			case ccui.Widget.TOUCH_CANCELED: // キャンセルした時
				break;
			}
		}, this);
		
	},
	onEnter: function() {
		this._super();
		cc.log("**** onEnter: TitleLayer2  ****");
		
	},
	//トランジション終わり時
	onEnterTransitionDidFinish: function() {
		this._super();
		cc.log("**** onEnterTransitionDidFinish: TitleLayer2  ****");
		
		var act1 = cc.repeat( 
						cc.sequence(
							cc.moveBy(0.05, cc.p(10, 0)).easing(cc.easeIn(3)),
							cc.moveBy(0.05, cc.p(-10, 0)).easing(cc.easeIn(3))
					), 10);
		this._chara.runAction(
			
				cc.spawn(
					act1,
					cc.moveBy(1.0, cc.p(0, 50)),
					cc.fadeIn(1.0)
				)
			
		);

		this._title.runAction(
			cc.sequence(
				cc.spawn(
					cc.scaleTo(0.3, 1.0).easing(cc.easeIn(3)),
					cc.fadeIn(0.3).easing(cc.easeIn(3))
				),
			)
		);
		
	}
});