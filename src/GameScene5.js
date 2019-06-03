var GameScene5 = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer2 = new GridLayer(67, 100);
		this.addChild(layer2);
		
		var layer = new GameLayer5();
		this.addChild(layer);
	}
});

BLOCK_HEIGHT = 100;
BLOCK_WIDTH = 67.5;


var GameLayer5 = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer5  ****");
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		//もどるボタンの配置
		var btnBack = new cc.Sprite(res.img_commonBtnBack);
		btnBack.setPosition(cc.p(100, this._winSize.height - 100));
		btnBack.setScale(0.2);
		this.addChild(btnBack, 3);
		
		var colorTbl = [
			cc.color(20, 20, 20),cc.color(20, 20, 20),cc.color(20, 20, 20),
			cc.color(30, 30, 30),cc.color(30, 30, 30),cc.color(30, 30, 30),
			cc.color(40, 40, 40),cc.color(40, 40, 40),cc.color(40, 40, 40),
		];
		
		var verticesAry = [
			[
				[0, 5],[5, 5],[6, 6],[6, 10],[5, 11],[0, 11] //左・奥
			],
			[
				[5, 5],[11, 5],[11, 11],[5, 11] //真ん中・奥
			],
			[
				[10, 6],[11, 5],[16, 5],[16, 11],[11, 11],[10, 10] //右・奥
			],
			[
				[0, 3],[3, 3],[5, 5],[5, 11],[3, 13],[0, 13] //左・中
			],
			[
				[3, 3],[13, 3],[13, 13],[3, 13] //真ん中・中
			],
			[
				[11, 5],[13, 3],[16, 3],[16, 13],[13, 13],[11, 11] //右・中
			],
			[
				[0, 0],[3, 3],[3, 13],[0, 16] //左・手前
			],
			[
				
			],
			[
				[13, 3],[16, 0],[16, 16],[13, 13] //右・手前
			],
		];
		
		
		
		
		this.drawWall(verticesAry[0], colorTbl[0]);
		this.drawWall(verticesAry[2], colorTbl[2]);
		this.drawWall(verticesAry[3], colorTbl[3]);
		this.drawWall(verticesAry[5], colorTbl[5]);
		this.drawWall(verticesAry[6], colorTbl[6]);
		this.drawWall(verticesAry[8], colorTbl[8]);
		
		this.drawWay();
		
		//フレーム更新
		this.scheduleUpdate();
		
		
		//タッチイベント
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
				
				if(cc.rectContainsPoint(btnBack.getBoundingBox(), touch.getLocation())){
					cc.director.runScene(cc.TransitionFade.create(1, new MenuScene()));
				}
				
			}.bind(this)
		}, this);
	},
	update:function () {
		
	},
	drawWall: function(verticesAry, color){
		var vertices = [];
		for ( var i = 0; i<verticesAry.length; i++ ) {
			vertices.push(cc.p(verticesAry[i][0]*BLOCK_WIDTH, verticesAry[i][1]*BLOCK_HEIGHT));
		}
		
		var node = new cc.DrawNode();
		node.drawPoly(vertices, color, 0, color);
		this.addChild(node, 1);
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
				vertices.push(cc.p(verticeTbl[i][j][0]*BLOCK_WIDTH, verticeTbl[i][j][1]*BLOCK_HEIGHT));
			}
			cc.log(vertices);
			var polygon = new cc.DrawNode();
			polygon.drawPoly(vertices, colorTbl[i], 0, colorTbl[i]);
			this.addChild(polygon, 0);
		}
	},
	
});