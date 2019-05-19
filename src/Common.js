var GridLayer = cc.Layer.extend({
	ctor:function () {
		this._super();
		cc.log("**** ctor: GridLayer  ****");
		var winSize = cc.director.getWinSize();

		// 線の太さと色
		var lineSize = 1;
		var lineW = 40;
		var lineH = 40;
		var color = cc.color(0, 0, 125);

		// 縦線を引く
		for (var x = 1; x < (winSize.width / lineW); x++)
		{
			var xPoint = x * lineW;
			var draw = new cc.DrawNode();
			draw.setPosition(cc.p(0, 0));
			draw.drawSegment(cc.p(xPoint, 0), cc.p(xPoint, winSize.height), lineSize, color);
			this.addChild(draw, 999);
		}
		// 横線を引く
		for (var y = 1; y < (winSize.height / lineH); y++)
		{
			var yPoint = y * lineH;
			var draw = new cc.DrawNode();
			draw.setPosition(cc.p(0, 0));
			draw.drawSegment(cc.p(0, yPoint), cc.p(winSize.width, yPoint), lineSize, color);
			this.addChild(draw, 999);
		}
	}
});
