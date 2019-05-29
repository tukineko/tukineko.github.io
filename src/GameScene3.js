var g_typeMax = 3; //6まで
var g_lineXMax = 4;
var g_lineYMax = 4;

var GameScene3 = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer2 = new GridLayer(40, 40);
		this.addChild(layer2);
		
		var layer = new GameLayer3();
		this.addChild(layer);
	}
});

var GameLayer3 = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	_dropRomoveTags: [],
	_board: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer3  ****");
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		//変数の初期化
		this._board = null;
		
		//パズルの初期表示
		this.initDrop();
		cc.log(this._board);
		
		//フレーム更新
		this.scheduleUpdate();
		
		//タッチイベント
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			_moveObj : null,
			onTouchBegan: function(touch, event) {
				var point = touch.getLocation();
				//タッチしたパズル玉のオブジェクトを返す
				var moveObj = this.TouchDrop(point);
				if(moveObj){
					moveObj.sprite.opacity = 128;
					this._moveObj = moveObj;
					return true;
				}
				return false;
				
			}.bind(this),
			onTouchMoved: function(touch, event){
				//選択したパズル玉の移動
				this._moveObj.sprite.setPosition(cc.pAdd(this._moveObj.sprite.getPosition(), touch.getDelta()));
				
				var nextObj = this.nextTouchDrop(this._moveObj);
				if(nextObj){
					this.swapObj(this._moveObj, nextObj);
					
				}
			}.bind(this),
			onTouchEnded: function(touch, event) {
				this._moveObj.sprite.opacity = 255;
				this._moveObj.sprite.setPosition(cc.p(this._board[this._moveObj.aryX][this._moveObj.aryY].posX, this._board[this._moveObj.aryX][this._moveObj.aryY].posY));
				
				//盤面のパズルをチェック
				this.checkBoardDrop();
				
			}.bind(this)
		}, this);
	},
	update:function () {
		
	},
	//オブジェクト同士の入れ替え
	swapObj: function(moveObj, nextObj){
		//移動先の位置を記憶
		var tmpPosX = nextObj.posX;
		var tmpPosY = nextObj.posY;
		
		//移動先のパズル玉の位置を入れ替え
		nextObj.posX = moveObj.posX;
		nextObj.posY = moveObj.posY;
		nextObj.sprite.setPosition(cc.p(moveObj.posX, moveObj.posY));
		
		//移動中のパズル玉の位置情報を更新
		this._board[moveObj.aryX][moveObj.aryY].posX = tmpPosX;
		this._board[moveObj.aryX][moveObj.aryY].posY = tmpPosY;
	},
	/**
	 * タッチしたパズル玉
	 * @param {object} touchPos タッチ座標
	 **/
	TouchDrop: function(touchPos){
		for (var x = 0; x < g_lineXMax; x++) {
			for (var y = 0; y < g_lineYMax; y++) {
				var rect = this._board[x][y].sprite.getBoundingBoxToWorld();
				if (cc.rectContainsPoint(rect, touchPos)) {
					return this._board[x][y];
				}
			}
		}
	},
	/**
	 * 移動先のパズル玉
	 * @param {object} moveObj 移動中のオブジェクト
	 **/
	nextTouchDrop: function(moveObj){
		for (var x = 0; x < g_lineXMax; x++) {
			for (var y = 0; y < g_lineYMax; y++) {
				if(this._board[x][y].sprite.tag == moveObj.sprite.tag){
					continue;
				}
				
				var movePos = moveObj.sprite.getPosition();
				var Pos = this._board[x][y].sprite.getPosition();
				var radius = moveObj.sprite.getContentSize().width / 2;
				if(cc.pDistance(movePos , Pos) < radius){
					return this._board[x][y];
				}
			}
		}
	},
	//パズルの初期表示
	initDrop:function(){
		var typeMax = g_typeMax;
		var widthMax = g_lineXMax;
		var heightMax = g_lineYMax;
		var board = [];
		
		for (var x = 0; x < widthMax; x++){
			board[x] = [];
			
			for(var y = 0; y < heightMax; y++){
				var rand = Math.floor( Math.random() * typeMax);
				var sprite = this.DropSprite(rand);
				var posX = 250 + (x * sprite.getContentSize().width);
				var posY = 650 + (y * sprite.getContentSize().height);
				sprite.setPosition(cc.p(posX, posY));
				sprite.dropType = rand;
				var tag = (x+1) + (y*widthMax);
				this.addChild(sprite, 0, tag);
				
				board[x][y] = {
					aryX:x,
					aryY:y,
					posX: posX,
					posY: posY,
					sprite: sprite
				};
			}
		}
		
		this._board = board;
	},
	//パズルの消去(タグを指定)
	removeDrop:function(removeTags){
		//cc.log(removeTags);
		//this.removeChildByTag(1);
		for(var i = 0; i < removeTags.length; i++ ){
			var node = this.getChildByTag(removeTags[i]);
			var action = cc.sequence(
				cc.spawn(
					cc.fadeOut(0.5).easing(cc.easeIn(3)),
					cc.scaleTo(0.5, 0).easing(cc.easeIn(3))
				),
				cc.removeSelf()
			);
			node.runAction(action);
		}
	},
	//盤面のパズルをチェック
	checkBoardDrop:function(){
		this._dropRomoveTags = [];
		for (var x = 0; x < g_lineXMax; x++) {
			for (var y = 0; y < g_lineYMax; y++) {
				this.check(2, x, y);
			}
		}
		this.removeDrop(this._dropRomoveTags);
		cc.log(this._board);
	},
	/**
	 * 近接する同じ種類のブロックを探す
	 * 返り値は 二次元配列
	 * checkTypeの値を1に指定すると、近接するブロックの数を返す
	 * checkTypeの値を2に指定すると、近接するブロックが3個以上の場合消去
	 * @param {Object}checkType チェックの種類
	 * @param {Object} x ブロックを置く位置
	 * @param {Object} y
	 */
	check:function(checkType, x, y){
		if(this._board[x] == null || this._board[x][y] == null) return 0; //範囲外
		/*
		 * 探索用に二次元配列を作る.
		 * 未探索は-1
		 * 探索済み (x,y)にあるブロックと同じ種類のブロックは 1
		 *               違う種類のブロックは 2
		 */
		var blockType = this._board[x][y].sprite.dropType;
		var cells_check = [];
		for (var i = 0; i < g_lineXMax; i++) {
			cells_check[i] = [];
			for (var j = 0; j < g_lineYMax; j++) {
				cells_check[i][j] = -1; //未チェック
			}
		}
		
		this.checkRecursive(x, y, cells_check, blockType);
		
		//隣接するブロックの数を数える
		var count = 0;
		for (var i = 0; i < cells_check.length; i++) {
			for (var j = 0; j < cells_check[i].length; j++) {
				if (cells_check[i][j] == 1) {
					count++;
				}
			}
		}
		
		//ブロック消去
		if (checkType == 2) {
			if (count >= 3) {
				for (var i = 0; i < cells_check.length; i++) {
					for (var j = 0; j < cells_check[i].length; j++) {
						if (cells_check[i][j] == 1) {
							this._dropRomoveTags.push(this._board[i][j].sprite.tag);
							this._board[i][j] = null;
						}
					}
				}
			}else{
				return 0;
			}
		}
		return count;
	},
	checkRecursive: function(x, y, cells_check, blockType){
		if(this._board[x] == null || this._board[x][y] == null || 0 < cells_check[x][y]){ //範囲外か探索済み
			return;
		}
		if (this._board[x][y].sprite.dropType != blockType) { //ブロックの種類が違う
			cells_check[x][y] = 2;
			return;
		}
		//一致
		cells_check[x][y] = 1; //チェック
		this.checkRecursive(x + 1, y, cells_check, blockType); //右探索
		this.checkRecursive(x - 1, y, cells_check, blockType); //左
		this.checkRecursive(x, y + 1, cells_check, blockType); //下
		this.checkRecursive(x, y - 1, cells_check, blockType); //上
		return;
	},
	//パズルの移動
	moveDrop:function(){
		
	},
	
	
	//パズル玉の描画
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

