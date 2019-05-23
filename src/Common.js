var GridLayer = cc.Layer.extend({
	ctor:function (lineWidth, lineHeight) {
		this._super();
		cc.log("**** ctor: GridLayer  ****");
		var winSize = cc.director.getWinSize();

		// 線の太さと色
		var lineSize = 1;
		var color = cc.color(51, 51, 51);
		var color2 = cc.color(128, 0, 0);
		
		var renderTexture = new cc.RenderTexture(winSize.width, winSize.height);
		renderTexture.setPosition(cc.p(winSize.width/2, winSize.height/2));
		this.addChild(renderTexture, 999);
		
		renderTexture.begin();
		
		// 縦線を引く
		for (var x = 1; x < (winSize.width / lineWidth); x++)
		{
			var xPoint = x * lineWidth;
			var draw = new cc.DrawNode();
			draw.setPosition(cc.p(0, 0));
			if(x % 5 == 0){
				draw.drawSegment(cc.p(xPoint, 0), cc.p(xPoint, winSize.height), lineSize, color2);
			}else{
				draw.drawSegment(cc.p(xPoint, 0), cc.p(xPoint, winSize.height), lineSize, color);
			}
			draw.visit();
		}
		// 横線を引く
		for (var y = 1; y < (winSize.height / lineHeight); y++)
		{
			var yPoint = y * lineHeight;
			var draw = new cc.DrawNode();
			draw.setPosition(cc.p(0, 0));
			if(y % 5 == 0){
				draw.drawSegment(cc.p(0, yPoint), cc.p(winSize.width, yPoint), lineSize, color2);
			}else{
				draw.drawSegment(cc.p(0, yPoint), cc.p(winSize.width, yPoint), lineSize, color);
			}
			draw.visit();
		}
		
		renderTexture.end();
	}
});
