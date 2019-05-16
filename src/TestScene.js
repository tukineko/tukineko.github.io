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
	_lineH: null,
	_lineW: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer  ****");
		//cc.textureCache.dumpCachedTextureInfo();
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		
		
		//フレーム更新
		this.scheduleUpdate();
		
	},
	update:function () {
		
	},
	
	
	
});