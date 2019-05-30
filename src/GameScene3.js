//define
DROP_SIZE = 150;
DROP_NUM_X = 6;
DROP_NUM_Y = 5;
DROP_TYPE = 6;
DROP_OFFSET_X = 150;
DROP_OFFSET_Y = 150;
BOARD_RIGHT = DROP_OFFSET_X + (DROP_SIZE * (DROP_NUM_X - 1));
BOARD_TOP = DROP_OFFSET_Y + (DROP_SIZE * (DROP_NUM_Y - 1));

var GameLayer3 = cc.Layer.extend({
	_winSize: null,
	_winSizeCenterW: null,
	_winSizeCenterH: null,
	_dropRomoveTags: null,
	_board: null,
	_game_state: null,
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer3  ****");
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		//変数の初期化
		this._board = null;
		this._game_state = GameLayer3.GameState["PLAYING"];
		
		//パズルの初期表示
		this.initDrop();
		//cc.log(this._board);
		
		//フレーム更新
		this.scheduleUpdate();
		
		//タッチイベント
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			_moveNode : null,
			onTouchBegan: function(touch, event) {
				if(this._game_state === GameLayer3.GameState["PLAYING"]){
					//タッチしたパズル玉のノードを返す
					var moveNode = this.getTouchDrop(touch.getLocation());
					if(moveNode){
						moveNode.opacity = 200;
						this._moveNode = moveNode;
						return true;
					}else{
						return false;
					}
				}else{
					return false;
				}
				
			}.bind(this),
			onTouchMoved: function(touch, event){
				//選択したパズル玉の移動
				this._moveNode.setPosition(cc.pClamp(cc.pAdd(this._moveNode.getPosition(), touch.getDelta()), cc.p(DROP_OFFSET_X, DROP_OFFSET_Y), cc.p(BOARD_RIGHT, BOARD_TOP)));
				
				var nextNode = this.getNextDrop(this._moveNode);
				if(nextNode && this._moveNode != nextNode){
					this.swapNode(this._moveNode, nextNode);
				}
			}.bind(this),
			onTouchEnded: function(touch, event) {
				//状態をパズル玉消去中に
				this._game_state = GameLayer3.GameState["DROP_DELETE"];
				
				this._moveNode.opacity = 255;
				var posX = DROP_OFFSET_X + (this._moveNode.indexX * DROP_SIZE);
				var posY = DROP_OFFSET_Y + (this._moveNode.indexY * DROP_SIZE);
				this._moveNode.setPosition(cc.p(posX, posY));
				this._moveNode = null;
				
				//盤面のパズルをチェック
				this.checkBoardDrop();
				
			}.bind(this)
		}, this);
	},
	update:function () {
		
	},
	//ノード同士の入れ替え
	swapNode: function(moveNode, nextNode){
		var next = {x:nextNode.indexX, y:nextNode.indexY};
		
		nextNode.moveFlg = true;
		var posX = DROP_OFFSET_X + (moveNode.indexX * DROP_SIZE);
		var posY = DROP_OFFSET_Y + (moveNode.indexY * DROP_SIZE);
		//nextNode.setPosition(cc.p(posX, posY));
		nextNode.indexX = moveNode.indexX;
		nextNode.indexY = moveNode.indexY;
		this._board[nextNode.indexX][nextNode.indexY] = nextNode;
		var action = cc.sequence(
			cc.moveTo(0.3, cc.p(posX, posY)).easing(cc.easeOut(3)),
			cc.callFunc(function() {
				nextNode.moveFlg = false;
			}, this)
		);
		nextNode.runAction(action);
		
		moveNode.indexX = next.x;
		moveNode.indexY = next.y;
		this._board[next.x][next.y] = moveNode;
	},
	/**
	 * タッチしたパズル玉
	 * @param {object} touchPos タッチ座標
	 * @param {object} moveObj 移動中のオブジェクト
	 **/
	getTouchDrop: function(touchPos){
		for (var x = 0; x < DROP_NUM_X; x++) {
			for (var y = 0; y < DROP_NUM_Y; y++) {
				var pos = this._board[x][y].getPosition();
				var size = DROP_SIZE / 2;
				if(cc.pDistance(touchPos , pos) < size){
					return this._board[x][y];
				}
			}
		}
		return null;
	},
	getNextDrop: function(moveNode){
		for (var x = 0; x < DROP_NUM_X; x++) {
			for (var y = 0; y < DROP_NUM_Y; y++) {
				if(moveNode && x == moveNode.indexX && y == moveNode.indexY){
					continue;
				}
				
				var mpos = moveNode.getPosition();
				var pos = this._board[x][y].getPosition();
				var size = DROP_SIZE / 2;
				if(cc.pDistance(mpos , pos) < size && this._board[x][y].moveFlg === false){
					return this._board[x][y];
				}
			}
		}
		return null;
	},
	//パズルの初期表示
	initDrop:function(){
		var board = [];
		
		for (var x = 0; x < DROP_NUM_X ; x++){
			board[x] = [];
			
			for(var y = 0; y < DROP_NUM_Y ; y++){
				var sprite = this.DropSprite(x, y);
				this.addChild(sprite, 0);
				board[x][y] = sprite;
			}
		}
		
		this._board = board;
	},
	//パズル玉の生成
	DropSprite:function(x, y, newCnt) {
		var dropType = Math.floor( Math.random() * DROP_TYPE);
		
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
		var posX = DROP_OFFSET_X + (x * DROP_SIZE);
		if(newCnt == null){
			var posY = DROP_OFFSET_Y + (y * DROP_SIZE);
		}else{
			var posY = BOARD_TOP + DROP_SIZE + (newCnt * DROP_SIZE);
		}
		var tag = (x + 1) + (y * DROP_NUM_X);
		sprite.setPosition(cc.p(posX, posY));
		sprite.tag = tag;
		sprite.dropType = dropType;
		sprite.indexX = x;
		sprite.indexY = y;
		sprite.moveFlg = false;
		
		return sprite;
	},
	createDrop:function(){
		//cc.log(this._board);
		var cnt = 0;
		var board = [];
		for (var x = 0; x < this._board.length ; x++) {
			//var count = this._board[x].filter(function(k){return k===null}).length;
			board[x] = [];
			cnt = 0;
			for (var y = 0; y < this._board[x].length ; y++) {
				if(this._board[x][y] === null){
					var sprite = this.DropSprite(x, y, cnt);
					this.addChild(sprite, 0);
					board[x][cnt] = sprite;
					cnt++;
				}
			}
		}
		
		var newBoard = [];
		for (var x = 0; x < this._board.length ; x++) {
			newBoard[x] = [];
			var arr = this._board[x].concat(board[x]);
			line = arr.filter(v => v);
			newBoard[x] = line;
		}
		this._board = newBoard;
		
		//動きとリセット
		for (var x = 0; x < DROP_NUM_X ; x++){
			for(var y = 0; y < DROP_NUM_Y ; y++){
				var sprite = this._board[x][y];
				
				var posX = DROP_OFFSET_X + (x * DROP_SIZE);
				var posY = DROP_OFFSET_Y + (y * DROP_SIZE);
				var tag = (x + 1) + (y * DROP_NUM_X);
				//sprite.setPosition(cc.p(posX, posY));
				sprite.tag = tag;
				sprite.indexX = x;
				sprite.indexY = y;
				sprite.moveFlg = false;
				
				var action = cc.sequence(
					cc.moveTo(1.5, cc.p(posX, posY)),
					cc.callFunc(function() {
						this._game_state = GameLayer3.GameState["PLAYING"];
					}, this)
				);
				sprite.runAction(action);
				
				
				this._board[x][y] = sprite;
			}
		}
		
	},
	//パズルの消去(タグを指定)
	removeDrop:function(){
		if(this._dropRomoveTags.length==0){
			//this._game_state = GameLayer3.GameState["DROP_MOVING"];
			return;
		}
		var self = this;
		
		// 配列の先頭を使う
		var removeTags = this._dropRomoveTags[0];
		for(var i = 0; i < removeTags.length; i++ ){
			var node = this.getChildByTag(removeTags[i]);
			var action = cc.sequence(
				cc.spawn(
					cc.fadeOut(0.5).easing(cc.easeIn(3)),
					cc.scaleTo(0.5, 0).easing(cc.easeIn(3))
				),
				cc.callFunc(function() {
					
				}, this),
				cc.removeSelf()
			);
			node.runAction(action);
		}
		// 処理済みのパラメータ削除
		this._dropRomoveTags.shift();
		// 次の回の実行予約
		setTimeout(function(){ 
			self.removeDrop();
		}, 500);
	},
	//盤面のパズルをチェック
	checkBoardDrop:function(){
		this._dropRomoveTags = [];
		for (var x = 0; x < DROP_NUM_X; x++) {
			for (var y = 0; y < DROP_NUM_Y; y++) {
				this.check(2, x, y);
			}
		}
		if(this._dropRomoveTags.length == 0){
			this._game_state = GameLayer3.GameState["PLAYING"];
		}else{
			this.removeDrop();
			this.createDrop();
		}
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
		var blockType = this._board[x][y].dropType;
		var cells_check = [];
		for (var i = 0; i < DROP_NUM_X; i++) {
			cells_check[i] = [];
			for (var j = 0; j < DROP_NUM_Y; j++) {
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
				var tmpAry = [];
				for (var i = 0; i < cells_check.length; i++) {
					for (var j = 0; j < cells_check[i].length; j++) {
						if (cells_check[i][j] == 1) {
							tmpAry.push(this._board[i][j].tag);
							this._board[i][j] = null;
						}
					}
				}
				this._dropRomoveTags.push(tmpAry);
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
		if (this._board[x][y].dropType != blockType) { //ブロックの種類が違う
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
	
	
	
});

// ゲームの状態
GameLayer3.GameState = {
	"READY":   0, // 開始演出中
	"PLAYING": 1, // プレイ中
	"DROP_DELETE":  2, // パズル消去中
	"DROP_MOVING":  3, // パズル落ちてる
	"ENDING":  4, // 終了演出中
	"RESULT":  5  // スコア表示
};

var GameScene3 = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer2 = new GridLayer(40, 40);
		this.addChild(layer2);
		
		var layer = new GameLayer3();
		this.addChild(layer);
	}
});
