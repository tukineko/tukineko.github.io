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
	_m_scale:null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer  ****");
		//cc.textureCache.dumpCachedTextureInfo();
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		
		
		var chara = cc.Sprite.create(res.img_debug);
		var point = this.SetWorldPosition(100, 100, 50);
		chara.setPosition(point);
		chara.setScale(this.GetScale());
		this.addChild(chara);
		
		
		
		
		//フレーム更新
		this.scheduleUpdate();
		
	},
	update:function () {
		
	},
	SetWorldPosition:function(local_x, local_y, local_z){
		this._m_scale=(Z_S - Z_E) / (local_z - Z_E);
		var x = X_INF+m_scale*local_x;
		var y = Y_INF+m_scale*local_y;
		return cc.p(x, y);
	},
	GetScale:function(){
		return this._m_scale;
	},
	
});