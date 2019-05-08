window.onload = function(){
	cc.game.onStart = function(){
		cc.view.adjustViewPort(true);
		cc.view.setDesignResolutionSize(1080, 1920, cc.ResolutionPolicy.SHOW_ALL);
		cc.view.resizeWithBrowserSize(true);
		
		//load resources
		cc.LoaderScene.preload(preload_res, function () {
			//cc.director.runScene(new TitleScene());
			cc.director.runScene(new GameScene());
		}, this);
	};
	cc.game.run("gameCanvas");
};