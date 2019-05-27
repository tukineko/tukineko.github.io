var g_typeMax = 5; //6まで
var g_lineXMax = 3;
var g_lineYMax = 3;

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
	_dropTags: null,
	_cells: null,
	_dropRomoveTags: [],
	ctor:function () {
		this._super();
		cc.log("**** ctor: GameLayer3  ****");
		this._winSize = cc.director.getWinSize();
		this._winSizeCenterW = this._winSize.width / 2.0;
		this._winSizeCenterH = this._winSize.height / 2.0;
		
		//パズルの表示
		this.showDrop();
		cc.log(this._cells);
		
		//フレーム更新
		this.scheduleUpdate();
	},
	update:function () {
		
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
	checkDrop:function(){
		this._dropRomoveTags = [];
		for (var x = 0; x < g_lineXMax; x++) {
			for (var y = 0; y < g_lineYMax; y++) {
				this.check(2, x, y);
			}
		}
		this.removeDrop(this._dropRomoveTags);
	},
	/**
	 * 近接する同じ種類のブロックを探す
	 * 返り値は 二次元配列
	 * checkTypeの値を1に指定すると、近接するブロックの数を返す
	 * checkTypeの値を2に指定すると、近接するブロックが2個以上の場合消去
	 * @param {Object}checkType チェックの種類
	 * @param {Object} x ブロックを置く位置
	 * @param {Object} y
	 */
	check:function(checkType, x, y){
		if(this._cells[x] == null || this._cells[x][y] == null) return 0; //範囲外か空のブロック
		/*
		 * 探索用に二次元配列を作る.
		 * 未探索は-1
		 * 探索済み (x,y)にあるブロックと同じ種類のブロックは1
		 *               違う種類のブロック,空のブロックは 2
		 */
		var blockType = this._cells[x][y];
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
			if (count >= 2) {
				for (var i = 0; i < cells_check.length; i++) {
					for (var j = 0; j < cells_check[i].length; j++) {
						if (cells_check[i][j] == 1) {
							this._cells[i][j] = null;
							this._dropRomoveTags.push(this._dropTags[i][j]);
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
		if(this._cells[x] == null || this._cells[x][y] == null || 0 < cells_check[x][y]) return; //範囲外か探索済み
		if (this._cells[x][y] != blockType) { //ブロックの種類が違う
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
	//パズルの表示
	showDrop:function(){
		var typeMax = g_typeMax;
		var widthMax = g_lineXMax;
		var heightMax = g_lineYMax;
		var cells = [];
		var dropTags = [];
		
		for (var x = 0; x < widthMax; x++){
			cells[x] = [];
			dropTags[x] = [];
			
			for(var y = 0; y < heightMax; y++){
				var rand = Math.floor( Math.random() * typeMax);
				var sprite = this.DropSprite(rand);
				var posX = 250 + (x * sprite.getContentSize().width);
				var posY = 650 + (y * sprite.getContentSize().height);
				sprite.setPosition(cc.p(posX, posY));
				var tag = (x+1) + (y*widthMax);
				this.addChild(sprite, 0, tag);
				dropTags[x][y] = tag;
				cells[x][y] = rand;
				
				var listener = cc.EventListener.create({
					event: cc.EventListener.TOUCH_ONE_BY_ONE,
					swallowTouches: true,
					_targetNode : null,
					_newNode:null,
					onTouchBegan: function(touch, event) {
						var point = touch.getLocation();
						var target = event.getCurrentTarget();  
						//Get the position of the current point relative to the button
						var locationInNode = target.convertToNodeSpace(touch.getLocation());
						var s = target.getContentSize();
						var rect = cc.rect(0, 0, s.width, s.height);
						//Check the click area
						if (cc.rectContainsPoint(rect, locationInNode)) {
							//cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
							//cc.log(target.tag);
							target.opacity = 128;
							this._targetNode = target;
							
							//選択したパズルの種類を判別
							var person = {};
							this._dropTags.forEach(function(value, index){
								var result = value.indexOf( target.tag );
								if(result >= 0){
									person = {
										x:index,
										y:result
									};
								}
							});
							var type = this._cells[person.x][person.y];
							this._newNode = this.DropSprite(type);
							this._newNode.setPosition(cc.p(target.getPosition().x, target.getPosition().y));
							this.addChild(this._newNode);
							
							return true;
						}
						return false;
					}.bind(this),
					onTouchMoved: function(touch, event){
						var delta = touch.getDelta();
						var position = this._newNode.getPosition();
						var newPosition = cc.pAdd(position, delta);
						this._newNode.setPosition(newPosition);
					}.bind(this),
					onTouchEnded: function(touch, event) {
						this._targetNode.opacity = 255;
						this._newNode.removeFromParentAndCleanup(true);
						
						//盤面のパズルをチェック
						this.checkDrop();
						
					}.bind(this)
				}, this);
				cc.eventManager.addListener(listener, sprite);
			}
		}
		this._cells = cells;
		this._dropTags = dropTags;
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

