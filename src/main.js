window.onload = function(){
	cc.game.onStart = function(){
		cc.view.adjustViewPort(true);
		cc.view.setDesignResolutionSize(1080, 1920, cc.ResolutionPolicy.SHOW_ALL);
		cc.view.resizeWithBrowserSize(true);
		
		var preload_res = [
			res.img_bgtitle,
			res.img_enemy,
			res.img_item01,
			res.img_chara01,
			res.img_enemy01,
			res.img_coin01,
			res.img_btn01,
		]

		//load resources
		cc.LoaderScene.preload(preload_res, function () {
			cc.director.runScene(new TitleScene());
		}, this);
	};
	cc.game.run("gameCanvas");
};