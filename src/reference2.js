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
		
		var lineH = 60;
		var lineW = 60;
		this._lineH = lineH;
		this._lineW = lineW;
		
		
		var red = cc.color(255, 0, 0);
		var green = cc.color(0, 255, 0);
		var blue = cc.color(0, 0, 255);
		var grey = cc.color(64, 64, 64);
		var colorTbl = [
			cc.color(20, 20, 20),cc.color(20, 20, 20),cc.color(20, 20, 20),
			cc.color(30, 30, 30),cc.color(30, 30, 30),cc.color(30, 30, 30),
			cc.color(40, 40, 40),cc.color(40, 40, 40),cc.color(40, 40, 40),
		];
		
		
		//グリッド線
		for(var i = 1; i <= 16; i++){
			var line = new cc.DrawNode();
			line.drawSegment(cc.p(0, lineH*i), cc.p(this._winSize.width, lineH*i), 1, blue);
			this.addChild(line);
		}
		for(var i = 1; i <= 16; i++){
			var line = new cc.DrawNode();
			line.drawSegment(cc.p(lineW*i, 0), cc.p(lineW*i, this._winSize.height), 1, blue);
			this.addChild(line);
		}
		
		// 多角形を描く
		// 頂点座標の配列
		var vertices = [
			cc.p(0*lineW, 5*lineH),
			cc.p(5*lineW, 5*lineH),
			cc.p(6*lineW, 6*lineH),
			cc.p(6*lineW, 10*lineH),
			cc.p(5*lineW, 11*lineH),
			cc.p(0*lineW, 11*lineH)
		];
		var polygon = new cc.DrawNode();
		polygon.drawPoly(vertices, colorTbl[0], 0, colorTbl[0]);
		this.addChild(polygon, 2);
		
		/*var rect = new cc.DrawNode();
		// drawRect(開始点の座標、終了点の座標, 塗りつぶす色, 枠線の太さ, 枠線の色)
		rect.drawRect(cc.p(400, 300), cc.p(500, 400), red, 2, blue)
		this.addChild(rect);*/
		
		
		this.drawWay();
		
		//フレーム更新
		this.scheduleUpdate();
		
	},
	update:function () {
		
	},
	
	drawWay: function () {
		var colorTbl = [
			cc.color(10, 10, 10),
			cc.color(10, 10, 10)
		];
		
		var verticeTbl = [
			[[0,16],[16,16],[16,6],[0,6]], // 通路上
			[[6,6],[10,6],[16,0],[0,0]] // 通路下
		];
		
		for(var i=0; i < colorTbl.length; i++){
			var vertices = [];
			for(var j=0; j<verticeTbl[i].length; j++){
				vertices.push(cc.p(verticeTbl[i][j][0]*this._lineW, verticeTbl[i][j][1]*this._lineH));
			}
			cc.log(vertices);
			var polygon = new cc.DrawNode();
			polygon.drawPoly(vertices, colorTbl[i], 0, colorTbl[i]);
			this.addChild(polygon, 1);
		}
	},
	
});