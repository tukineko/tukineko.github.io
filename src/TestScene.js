var TestScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new TestLayer();
		this.addChild(layer);
		
		var layer2 = new GridLayer(40, 40);
		this.addChild(layer2);
	}
});

var TestLayer = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: TestLayer  ****");
		//cc.textureCache.dumpCachedTextureInfo();
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		var draw = new cc.DrawNode();
		draw.drawDot(cc.p(0, 0), 10, cc.color(0, 255, 0, 255));
		draw.setPosition(this._winSizeCenterW, this._winSizeCenterH);
		this.addChild(draw, 1);
		
		var action = cc.sequence(
			cc.spawn(
				cc.scaleBy(2.0, 5.0),
				cc.moveBy(2.0, cc.p(0, -300)),
			),
			cc.removeSelf()
		);
		draw.runAction(action);
		
		
		// 多角形を描く
		// 頂点座標の配列
		var vertices = [
			cc.p(200, 0),
			cc.p(400, 1200),
			cc.p(600, 1200),
			cc.p(800, 0)
		];
		var polygon = new cc.DrawNode();
		polygon.drawPoly(vertices, cc.color(64, 64, 64), 0, cc.color(64, 64, 64));
		this.addChild(polygon, 0);
		cc.log(polygon);
		
		
		var sprite = new cc.Sprite(res.img_bgGame);
		sprite.setTextureRect(cc.rect(0, 0, 150, 500));
		sprite.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH));
		this.addChild(sprite);
		
		//フレーム更新
		this.scheduleUpdate();
		
	},
	update:function () {
		
	},
	
});