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
		
		
		
		var bg = new cc.Sprite(res.img_bgGame4);
		bg.setAnchorPoint(cc.p(0, 0));
		bg.setPosition(cc.p(0, 0));
		this.addChild(bg);
		
		
		
		
		var color = cc.color(128,128,128);
		this.setColor(color);

		var size = cc.winSize;

		this._emitter = new cc.ParticleFire();
		this.addChild(this._emitter, 10);

		//画像はcocos2d-jsのsamples/js-tests/resのものを使用
		this._emitter.texture = cc.textureCache.addImage(res.img_debug);

		this._emitter.x = cc.winSize.width / 2;
		this._emitter.y = cc.winSize.height / 2;
		
		
		
		//フレーム更新
		this.scheduleUpdate();
		
	},
	update:function () {
		
	},
	setQuad:function(node){
		var Quad = cc.V3F_C4B_T2F_Quad();
		cc.log(Quad);
		var size = node.getContentSize();
		var v = [
			cc.Vertex3F(0,0, 0),
			cc.Vertex3F(0, size.height, 0),
			cc.Vertex3F(size.width, size.height, 0),
			cc.Vertex3F(size.width, 0, 0),
		];
		node.quad = v;
	}
});