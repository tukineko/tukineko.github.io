var TitleScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var size = cc.director.getWinSize();
		var bg_title = cc.Sprite.create(res.img_bgtitle);
		bg_title.setPosition(size.width / 2, size.height / 2);
		this.addChild(bg_title, 0);
		
		var label = cc.LabelTTF.create("touch me！", "Arial", 50);
		label.setPosition(size.width / 2, size.height / 2);
		label.setColor(cc.color(0,0,0,255));
		this.addChild(label, 1);
		
		var listener = cc.EventListener.create( {
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function(touch, event) {
				cc.director.runScene(new GameScene());
			}
		});
		cc.eventManager.addListener(listener,this);
	}
});

var GameScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		this.sprites = [];
		var size = cc.director.getWinSize();

		for (var i = 0; i < 500; i++) {
			var sprite = cc.Sprite.create(res.img_enemy);
			sprite.setPosition(size.width / 2, size.height / 2);
			sprite.dir = {
				x : Math.random() * 20 - 10,
				y : Math.random() * 20 - 10
			};
			this.sprites.push(sprite);
			this.addChild(sprite, 0);
		}

		this._label = cc.LabelTTF.create("", "Arial", 20);
		this._label.setPosition(50, size.height-20);
		this._label.setColor(cc.color(0,0,0,255));
		this.addChild(this._label, 1);

		this.scheduleUpdate();
	},
	update:function () {
		sprites = this.sprites;
		var size = cc.director.getWinSize();
		for (var i = 0, len = sprites.length; i < len; i++) {
			sprites[i].x +=  sprites[i].dir.x;
			sprites[i].y +=  sprites[i].dir.y;
			if (sprites[i].x >= size.width || sprites[i].x <= 0) sprites[i].dir.x *= -1
			if (sprites[i].y >= size.height || sprites[i].y <= 0) sprites[i].dir.y *= -1
		}

		var currentTime = new Date();
		var fps = 1000 / (currentTime - this._oldTime);
		this._oldTime = currentTime;
		this._label.setString(fps.toFixed(2) + " FPS");
	}
});