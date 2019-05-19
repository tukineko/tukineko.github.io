var MenuScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
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
		var chara = cc.Sprite.create(res.img_titleChara);
		chara.setPosition(cc.p(this._winSizeCenterW - 300, this._winSize.height - 200));
		chara.setScale(0.5);
		this.addChild(chara, 2);
		
		//キャラ2
		var chara2 = cc.Sprite.create(res.img_title2Chara);
		chara2.setPosition(cc.p(this._winSizeCenterW + 300, this._winSize.height - 200));
		chara2.setScale(0.5);
		this.addChild(chara2, 2);
		
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
				
				
				return true;
			}.bind(this),
			onTouchMoved: function(touch, event) {
				
			}.bind(this),
			onTouchEnded: function(touch, event) {
				
			}.bind(this)
		}, this);
	},
	
});
