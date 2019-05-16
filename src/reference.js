var TestScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new TestLayer();
		this.addChild(layer);
	}
});

var TestLayer = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	_bg:null,
	_bg2:null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer  ****");
		//cc.textureCache.dumpCachedTextureInfo();
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		
		var gridNodeTarget = new cc.NodeGrid();
		this.addChild(gridNodeTarget, 2);
		
		
		var chara = cc.Sprite.create(res.img_titleImg01);
		chara.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH));
		gridNodeTarget.addChild(chara);
		
		gridNodeTarget.setAnchorPoint(cc.p(this._winSizeCenterW, this._winSizeCenterH));
		gridNodeTarget.rotationY = 30;
		
		cc.log(gridNodeTarget);
		
		
		
		
		var node = cc.ParallaxNode.create();
		
		var chara = cc.Sprite.create(res.img_titleImg01);
		chara.scale = 0.8;
		node.addChild(chara, 3, cc.p(2.0,2.0), cc.p(this._winSizeCenterW,this._winSizeCenterH));
		
		var chara2 = cc.Sprite.create(res.img_titleImg01);
		chara2.scale = 0.6;
		node.addChild(chara2, 2, cc.p(1.5,1.5), cc.p(this._winSizeCenterW + 100,this._winSizeCenterH));
		
		var chara3 = cc.Sprite.create(res.img_titleImg01);
		chara3.scale = 0.3;
		node.addChild(chara3, 1, cc.p(1.0,1.0), cc.p(this._winSizeCenterW + 200,this._winSizeCenterH));
		
		this.addChild(node);
		
		var act = cc.sequence(
			cc.moveBy(2.0, cc.p(0, 300)),
			cc.moveBy(2.0, cc.p(0, -300))
		);
		var repeat = cc.repeat(act,Math.pow(2, 30));
		node.runAction(repeat);
		
		var size = cc.winSize;
		this._emitter = new cc.ParticleFire();
		this.addChild(this._emitter, 10);
		this._emitter.texture = cc.textureCache.addImage(res.img_debug);
		this._emitter.x = cc.winSize.width / 2;
		this._emitter.y = cc.winSize.height / 2;
		
		
		//背景
		var bg = cc.Sprite.create(res.img_bgGame2);
		bg.setAnchorPoint(cc.p(0, 0));
		bg.setTag(1);
		//bg.setPosition(cc.p(0, 0));
		//this.addChild(bg);
		//this._bg = bg;
		
		var bg2 = cc.Sprite.create(res.img_bgGame3);
		bg2.setAnchorPoint(cc.p(0, 0));
		bg2.setTag(1);
		/*bg2.setPosition(cc.p(0, bg.height));
		this.addChild(bg2);
		this._bg2 = bg2;*/
		
		var chara = cc.Sprite.create(res.img_countdown1);
		var chara2 = cc.Sprite.create(res.img_countdown2);
		
		var chara3 = cc.Sprite.create(res.img_countdown1);
		var chara4 = cc.Sprite.create(res.img_countdown2);
		
		var bgNode = cc.ParallaxNode.create();
		//bgNode.setAnchorPoint(cc.p(0, 0));
		bgNode.addChild(bg, 1, cc.p(0,1), cc.p(0,0));
		bgNode.addChild(chara, 2, cc.p(0,1.2), cc.p(300,this._winSizeCenterH));
		bgNode.addChild(chara2, 2, cc.p(0,1.4), cc.p(450,this._winSizeCenterH));
		this.addChild(bgNode, 0);
		this._bg = bgNode;
		
		var bgNode2 = cc.ParallaxNode.create();
		//bgNode2.setAnchorPoint(cc.p(0, 0));
		bgNode2.setPosition(cc.p(0, bgNode.getChildByTag(1).height));
		bgNode2.addChild(bg2, 1, cc.p(0,1), cc.p(0,0));
		bgNode2.addChild(chara3, 2, cc.p(0,1.2), cc.p(300,this._winSizeCenterH));
		bgNode2.addChild(chara4, 2, cc.p(0,1.4), cc.p(450,this._winSizeCenterH));
		this.addChild(bgNode2, 0);
		this._bg2 = bgNode2;
		
		
		
		
		//フレーム更新
		this.scheduleUpdate();
		
	},
	update:function () {
		// 背景ABを毎フレームごとに5px下にスクロールする
		this._bg.setPositionY(this._bg.getPositionY() - 5);
		this._bg2.setPositionY(this._bg2.getPositionY() - 5);

		if (this._bg2.getPositionY() < 0) {
			this._bg.setPositionY(this._bg2.getPositionY() + this._bg2.getChildByTag(1).height);

			// 背景AとBの変数を入れ替える
			[this._bg, this._bg2] = [this._bg2, this._bg];
		}
		
		
	},
	
	
});