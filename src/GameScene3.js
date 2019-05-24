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
			_node:null,
			_nodeNew:null,
			onTouchBegan: function(touch, event) {
				var point = touch.getLocation();
				var i = this._drops.length;
				this._node = null;
				this._nodeNew = null;
				while(i--) {
					if(cc.rectContainsPoint(this._drops[i].getBoundingBox(), point)) {
						this._node = this._drops[i];
						this._node.opacity = 128;
						this._nodeNew = this.DropSprite(0);
						this._nodeNew.setPosition(cc.p(this._node.getPosition().x, this._node.getPosition().y));
						this.addChild(this._nodeNew);
					}
				}
				
				return true;
			}.bind(this),
			onTouchMoved: function(touch, event){
				var delta = touch.getDelta();
				var position = this._nodeNew.getPosition();
				var newPosition = cc.pAdd(position, delta);
				this._nodeNew.setPosition(newPosition);
				
			}.bind(this),
			onTouchEnded: function(touch, event) {
				this._node.opacity = 255;
				this._nodeNew.removeFromParentAndCleanup(true);
				
				
			}.bind(this)
		}, this);
		
		//フレーム更新
		this.scheduleUpdate();
	},
	update:function () {
		
	},
	showDrop:function(){
		var typeMax = 3;
		var widthMax = 3;
		var heightMax = 3;
		for (var x = 0; x < widthMax; x++){
			for(var y = 0; y < heightMax; y++){
				var rand = Math.floor( Math.random() * typeMax);
				var sprite = this.DropSprite(rand);
				var posX = 250 + (x * sprite.getContentSize().width);
				var posY = 650 + (y * sprite.getContentSize().height);
				sprite.setPosition(cc.p(posX, posY));
				var tag = (x+1) + (y*widthMax);
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

