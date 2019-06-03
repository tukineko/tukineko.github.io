var MenuScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer2 = new GridLayer(40, 40);
		this.addChild(layer2);
		
		var layer = new MenuLayer();
		this.addChild(layer);
	}
});

var MenuLayer = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: MenuLayer ****");
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		//キャラ
		var chara = cc.Sprite.create(res.img_gamePlayer);
		chara.setPosition(cc.p(this._winSizeCenterW - 300, this._winSize.height - 200));
		this.addChild(chara);
		
		//キャラ2
		var chara2 = cc.Sprite.create(res.img_title2Chara);
		chara2.setPosition(cc.p(this._winSizeCenterW + 300, this._winSize.height - 200));
		chara2.setScale(0.5);
		this.addChild(chara2);
		
		var chara3 = cc.Sprite.create(res.img_puzzle1);
		chara3.setPosition(cc.p(this._winSizeCenterW - 300, this._winSizeCenterH + 200));
		this.addChild(chara3);
		
		var chara4 = cc.Sprite.create(res.img_puzzle2);
		chara4.setPosition(cc.p(this._winSizeCenterW, this._winSizeCenterH + 200));
		this.addChild(chara4);
		
		var chara5 = cc.Sprite.create(res.img_puzzle3);
		chara5.setPosition(cc.p(this._winSizeCenterW + 300, this._winSizeCenterH + 200));
		this.addChild(chara5);
		
		//タッチイベント
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
				var point = touch.getLocation();
				
				//キャラとの衝突
				if(cc.rectContainsPoint(chara.getBoundingBox(), point)){
					cc.director.runScene(cc.TransitionFade.create(1, new TitleScene()));
				}
				
				//キャラ2との衝突
				if(cc.rectContainsPoint(chara2.getBoundingBox(), point)){
					cc.director.runScene(cc.TransitionFade.create(1, new TitleScene2()));
				}
				
				if(cc.rectContainsPoint(chara3.getBoundingBox(), point)){
					cc.director.runScene(cc.TransitionFade.create(1, new GameScene3()));
				}
				
				if(cc.rectContainsPoint(chara4.getBoundingBox(), point)){
					cc.director.runScene(cc.TransitionFade.create(1, new GameScene4()));
				}
				
				if(cc.rectContainsPoint(chara5.getBoundingBox(), point)){
					cc.director.runScene(cc.TransitionFade.create(1, new GameScene5()));
				}
				
				
				return true;
			}.bind(this),
			onTouchMoved: function(touch, event) {
				
			}.bind(this),
			onTouchEnded: function(touch, event) {
				
			}.bind(this)
		}, this);
	},
	
});
