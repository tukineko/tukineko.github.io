var GameScene3 = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new GameLayer3();
		this.addChild(layer);
		
		var layer2 = new GridLayer(40, 40);
		this.addChild(layer2);
	}
});

var GameLayer3 = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	_drops: [],
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer3  ****");
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		//パズルの表示
		this.showDrop();
		
		//タッチイベント
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
				var location = touch.getLocation();
				this.hitDrop(location);
				
				return true;
			}.bind(this),
			onTouchMoved: function(touch, event){
				
			}.bind(this),
			onTouchEnded: function(touch, event) {
				
			}.bind(this)
		}, this);
		
		//フレーム更新
		this.scheduleUpdate();
	},
	update:function () {
		
	},
	hitDrop:function(location){
		this._drops.forEach(function(element, index, array) {
			if(cc.rectIntersectsRect(element.getBoundingBox(), location)){
				cc.log(element.tag);
			}
		}, this);
	},
	showDrop:function(){
		for (var x = 0; x < 6; x++){
			for(var y = 0; y < 6; y++){
				var rand = Math.floor( Math.random() * 6);
				var sprite = this.DropSprite(rand);
				var posX = 250 + (x * sprite.getContentSize().width);
				var posY = 650 + (y * sprite.getContentSize().height);
				sprite.setPosition(cc.p(posX, posY));
				var tag = (x+1) + (y*6);
				this.addChild(sprite, 0, tag);
				this._drops.push(sprite);
			}
		}
	},
	DropSprite:function(dropType) {
		var resImg = null;
		switch (dropType) {
			case 0:
				resImg = res.img_puzzle1;
			break;
			case 1:
				resImg = res.img_puzzle2;
			break;
			case 2:
				resImg = res.img_puzzle3;
			break;
			case 3:
				resImg = res.img_puzzle4;
			break;
			case 4:
				resImg = res.img_puzzle5;
			break;
			case 5:
				resImg = res.img_puzzle6;
			break;
			default:
				
			break;
		}
		
		var sprite = new cc.Sprite(resImg);
		return sprite;
	}
	
});

