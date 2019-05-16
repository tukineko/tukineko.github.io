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
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer  ****");
		//cc.textureCache.dumpCachedTextureInfo();
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		
		
		//背景
		var bg = cc.Sprite.create(res.img_bgGame2);
		bg.setAnchorPoint(cc.p(0, 0));
		bg.setTag(1);
		
		var bg2 = cc.Sprite.create(res.img_bgGame3);
		bg2.setAnchorPoint(cc.p(0, 0));
		bg2.setTag(1);
		
		var bgNode = cc.ParallaxNode.create();
		bgNode.addChild(bg, 1, cc.p(1, 1), cc.p(0,0));
		this.addChild(bgNode, 0);
		this._bg = bgNode;
		
		var bgNode2 = cc.ParallaxNode.create();
		bgNode2.setPosition(cc.p(0, bgNode.getChildByTag(1).height));
		bgNode2.addChild(bg2, 1, cc.p(1, 1), cc.p(0,0));
		this.addChild(bgNode2, 0);
		this._bg2 = bgNode2;
		
		
		
		var gridNodeTarget = new cc.NodeGrid();
		this.addChild(gridNodeTarget, 2);
		
		
		var chara = cc.Sprite.create(res.img_titleImg01);
		chara.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH));
		gridNodeTarget.addChild(chara);
		
		gridNodeTarget.setAnchorPoint(cc.p(this._winSizeCenterW, this._winSizeCenterH));
		gridNodeTarget.rotationY = 30;
		
		cc.log(gridNodeTarget);
		
		//var act = new cc.RotateTo(3.0, 0, 90);
		//gridNodeTarget.runAction(act);
		
		
		
		//フレーム更新
		this.scheduleUpdate();
		
	},
	update:function () {
		this._bg.setPositionY(this._bg.getPositionY() - 5);
		this._bg2.setPositionY(this._bg2.getPositionY() - 5);

		if (this._bg2.getPositionY() < 0) {
			this._bg.setPositionY(this._bg2.getPositionY() + this._bg2.getChildByTag(1).height);

			// 背景AとBの変数を入れ替える
			[this._bg, this._bg2] = [this._bg2, this._bg];
		}
	}
});