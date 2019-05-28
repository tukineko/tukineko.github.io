//------------------------------------------------------------------
//
// Game Layer
//
//------------------------------------------------------------------
var ccm = ccm || {};

/* --------------------------------- */
/* for Debug                         */

DROP_DEBUG = 0; // Draw drop number
/* --------------------------------- */

ccm.Panel = {
    left: 2,
    bottom: 2,
    offsetX: 2,
    offsetY: 2,
    col: 6,
    row: 5,
    drops: []
};

DROP = {
    tag: 1,
    width: 52,
    height: 52
};

DROP_TAG = {
    FrontToTop: 50,
    Dummy: 100 // for swap dummy drop
};
LABEL_TAG = {
    FrontToTop: 60
};

DROP_COLOR = {
    Red: 0,
    Green: 1,
    Blue: 2,
    Purple: 3,
    Yellow: 4,

    _count: 0
};

DROP_FILENAME = [
    "drop_red.png",
    "drop_green.png",
    "drop_blue.png",
    "drop_purple.png",
    "drop_yellow.png"
    ];

function getEnumCount() {

    if(this._count > 0) return this._count;

    for(var i in this) {
        if(typeof(this[i]) != "function") this._count++;
    }
    this._count--; // this._count
    return this._count;
}

Array.prototype.include = function(checkValue) {
    for(i = 0; i < this.length; i++) {
        if(checkValue == this[i]) return true;
    }
    return false;
};

DROP_COLOR.count = getEnumCount;


DROP.distance_1 = Math.pow(Math.round(DROP.width), 2);
DROP.distance_2 = Math.pow(Math.round(DROP.width * Math.sqrt(2)), 2);

DROP_BLANK = -1;
INVALID_DROP_NUMBER = -1;

ccm.Panel.right = ccm.Panel.left + (DROP.width * ccm.Panel.col);
ccm.Panel.top = ccm.Panel.bottom + (DROP.height * ccm.Panel.row);
ccm.Drop = function() {};
ccm.Result = function() {};

/*==== Drop Object ====*/
ccm.Drop.extend = cc.Class.extend;
ccm.Result.extend = cc.Class.extend;

var GameDrop = ccm.Drop.extend({

    number: 0,
    // [R/W] Current Drop Number(Location)
    location: 0,
    // [R] Drop Location
    position: null,
    // [R] to reset location
    sprite: null,
    // [R/W] associated sprite
    live: true,
    // [R/W] is Alive?
    color: 0,
    // [R/W] Drop Color
    type: 0,
    // [R/W] Drop Type
    isChecked: false
});

var ComboLabel = cc.Node.extend({

    // Constructor
    ctor: function(count, delayTime, position) {

        // This is needed when subclassing a native class from JS
        cc.associateWithNative(this, cc.Node);

        // Initialize the Node
        this.init();

        var label = cc.LabelTTF.create(count + "Combo!", "Marker Felt", 16);
        this.addChild(label);
        label.setPosition(position);

        label.setVisible(false);
        var fadeOut = cc.FadeOut.create(1.5);
        var delay = cc.DelayTime.create(delayTime);
        var func = cc.CallFunc.create(this.exit, this);
        var seq = cc.Sequence.create(delay, cc.Show.create(), fadeOut, func);
        label.runAction(seq);
    },

    exit: function() {
        this.removeFromParent();
    }

});



// ccm.PanelLayer
var spriteFrameCache = cc.SpriteFrameCache.getInstance();

ccm.GameLayer = cc.Layer.extend({

    _touchLocation: null,
    _movingDrop: {},
    _dummyDrops: [],
    _result: {},
    _checkMatching: false,
    _grossini: null,

    // Constructor
    ctor: function() {

        // This is needed when subclassing a native class from JS
        cc.associateWithNative(this, cc.Layer);

        // Initialize the Layer
        this.init();

        // schedule update
        this.scheduleUpdate();
        this.setTouchEnabled(true);
        this.loadTextures();

        this.inititalizePanels();
        this._grossini = new Grossini();
        this.addChild(this._grossini);

    },

    inititalizePanels: function() {

        var dropTag = 0;
        var row, col, i;

        for(row = 0; row < ccm.Panel.row; row++) {

            for(col = 0; col < ccm.Panel.col; col++, dropTag++) {

                var drop = new GameDrop();
                drop.color = parseInt(Math.random() * DROP_COLOR.count(), 10);

                var dropSprite = cc.Sprite.createWithSpriteFrameName(DROP_FILENAME[drop.color]);
                dropSprite.setTag(DROP.tag + dropTag);
                var p = cc.p(ccm.Panel.offsetX + (DROP.width / 2) + (col * DROP.width), ccm.Panel.offsetY + (DROP.height / 2) + (row * DROP.height));
                dropSprite.setPosition(p);

                if(DROP_DEBUG == 1) {
                    var label = cc.LabelTTF.create(dropTag, "Marker Felt", 24);
                    dropSprite.addChild(label);
                    label.setPosition(cc.p(28, 28));
                }

                this.addChild(dropSprite, DROP.tag + dropTag);

                /* Drop information */
                drop.number = dropTag;
                drop.location = dropTag;
                drop.sprite = dropSprite;
                drop.position = p;
                ccm.Panel.drops[dropTag] = drop;
            }
        }

        for(i = 0; i < DROP_COLOR.count(); i++) {

            var drop_ = cc.Sprite.createWithSpriteFrameName(DROP_FILENAME[i]);
            drop_.setTag(DROP_TAG.Dummy + i);
            this.addChild(drop_);
            drop_.setOpacity(parseInt((0.5 * 255), 10));
            drop_.setVisible(false);
        }

        cc.log("DROP_COLOR COUNT:" + DROP_COLOR.count());
    },

    loadTextures: function() {

        // load GameObjects by plists
        spriteFrameCache.addSpriteFrames(res_gameobjects_plist);
    },

    checkTopDownLine: function(startIndex, result) {

        var row = Math.floor(startIndex / ccm.Panel.row);
        var checkResult = [];
        var y = 0;

        for(var i = 0; i < row; i++, y++) {

            var checkIndex = startIndex - ccm.Panel.col * y;

            if(result.include(checkIndex)) {
                checkResult.push(checkIndex);
            } else {
                break;
            }
        }
        if(checkResult.length >= 3) {
            return checkResult;
        }

        return [];
    },

    checkDownTopLine: function(startIndex, result) {

        var row = Math.floor(startIndex / ccm.Panel.row);
        var checkResult = [];
        var y = 0;
        for(var i = row; i < ccm.Panel.row; i++, y++) {
            var checkIndex = startIndex + ccm.Panel.col * y;
            if(result.include(checkIndex)) {
                checkResult.push(checkIndex);
            } else {
                break;
            }
        }
        if(checkResult.length >= 3) {
            return checkResult;
        }

        return [];
    },

    checkRightLeftLine: function(startIndex, result) {

        var col = Math.floor(startIndex % ccm.Panel.col);
        var checkResult = [];
        var x = 0;
        for(var i = 0; i < col; i++, x++) {
            var checkIndex = startIndex - x;
            if(result.include(checkIndex)) {
                checkResult.push(checkIndex);
            } else {
                break;
            }
        }
        if(checkResult.length >= 3) {
            return checkResult;
        }

        return [];
    },

    checkLeftRightLine: function(startIndex, result) {

        var col = Math.floor(startIndex % ccm.Panel.col);
        var checkResult = [];
        var x = 0;
        for(var i = col; i < ccm.Panel.col; i++, x++) {
            var checkIndex = startIndex + x;
            if(result.include(checkIndex)) {
                checkResult.push(checkIndex);
            } else {
                break;
            }
        }
        if(checkResult.length >= 3) {
            return checkResult;
        }

        return [];
    },

    checkMatchDirections: function(result) {

        var tempResults = [];
        var results = [];
        for(var i = 0; i < result.length; i++) {
            tempResults.push(this.checkTopDownLine(result[i], result));
            tempResults.push(this.checkDownTopLine(result[i], result));
            tempResults.push(this.checkRightLeftLine(result[i], result));
            tempResults.push(this.checkLeftRightLine(result[i], result));
        }

        for(var j = 0; j < tempResults.length; j++) {

            for(var k = 0; k < tempResults[j].length; k++) {
                if(results.include(tempResults[j][k]) === false) {
                    results.push(tempResults[j][k]);
                }
            }
        }
        return results;
    },

    checkMatchDrops: function() {

        this._result.drops = [];
        this._result.newPanel = {};
        this._result.newPanel.drops = [];
        this._result.matchAllDrops = [];

        var results = this._result.drops;
        var drops = ccm.Panel.drops;

        var i = 0;
        for(i = 0; i < ccm.Panel.drops.length; i++) {
            drops[i].isChecked = false;
        }

        for(i = 0; i < drops.length; i++) {

            var result = [];
            if(drops[i].isChecked === true) {

            } else {

                drops[i].isChecked = true;
                result.push(drops[i].location);
                this.checkMatchSub(drops[i].color, drops, i, result);
            }

            if(result.length >= 3) {

                result = this.checkMatchDirections(result);

                if(result.length > 0) {

                    var color = drops[i].color;
                    this._result.comboInfo[color] = (this._result.comboInfo.hasOwnProperty(color)) ? this._result.comboInfo[color] + 1 : 1;
                    this._result.comboMaxCount += 1;
                    results.push(result);
                }
            }
        }
    },

    checkMatchSub: function(checkValue, drops, index, result) {

        var row = Math.floor(index / ccm.Panel.row);
        var col = Math.floor(index % ccm.Panel.col);
        var checkIndex = 0;

        function isEqualDrop(drop, checkValue) {

            if(drop.isChecked === false && drop.color == checkValue) {
                return true;
            }
            return false;
        }

        // Right
        if(col + 1 < ccm.Panel.col) {

            checkIndex = index + 1;
            if(isEqualDrop(drops[checkIndex], checkValue)) {
                drops[checkIndex].isChecked = true;
                result.push(drops[checkIndex].location);
                this.checkMatchSub(checkValue, drops, index + 1, result);
            }
        }

        // Left
        if(col - 1 >= 0) {

            checkIndex = index - 1;
            if(isEqualDrop(drops[checkIndex], checkValue)) {
                drops[checkIndex].isChecked = true;
                result.push(drops[checkIndex].location);
                this.checkMatchSub(checkValue, drops, index - 1, result);
            }
        }

        // Down
        if(index - ccm.Panel.col >= 0) {

            checkIndex = index - ccm.Panel.col;
            if(isEqualDrop(drops[checkIndex], checkValue)) {
                drops[checkIndex].isChecked = true;
                result.push(drops[checkIndex].location);
                this.checkMatchSub(checkValue, drops, index - ccm.Panel.col, result);
            }
        }

        // Up
        if(index + ccm.Panel.col < (ccm.Panel.col * ccm.Panel.row)) {

            checkIndex = index + ccm.Panel.col;
            if(isEqualDrop(drops[checkIndex], checkValue)) {
                drops[checkIndex].isChecked = true;
                result.push(drops[checkIndex].location);
                this.checkMatchSub(checkValue, drops, index + ccm.Panel.col, result);
            }
        }
    },

    getDropLocation: function(x, y) {

        rc = cc.rect(
        ccm.Panel.offsetX, ccm.Panel.offsetY, DROP.width * ccm.Panel.col - 1, // rectContainsPoint include <= , so -1 require
        DROP.height * ccm.Panel.row - 1);


        if(cc.rectContainsPoint(rc, cc.p(x, y))) {

            var locX = Math.floor((x - ccm.Panel.offsetX) / DROP.width);
            var locY = Math.floor((y - ccm.Panel.offsetY) / DROP.height);
            var location = locX + (locY * ccm.Panel.col);
            return {
                position: {
                    x: locX,
                    y: locY
                },
                number: location,
                location: location
            };
        }
        return {
            position: {
                x: -1,
                y: -1
            },
            number: INVALID_DROP_NUMBER,
            location: INVALID_DROP_NUMBER
        };
    },

    createBezierPoints: function(pStart, pEnd, deg) {

        if(0 <= deg && deg <= 360) {

        } else {
            return [];
        }

        var rad = deg * Math.PI / 180;

        var v = cc.p(pEnd.x - pStart.x, pEnd.y - pStart.y);
        var vh = cc.p(v.x / 2, v.y / 2);

        var vr = cc.p(
        (vh.x * Math.cos(rad) - vh.y * Math.sin(rad)), (vh.x * Math.sin(rad) + vh.y * Math.cos(rad)));

        var vh_length = Math.sqrt(Math.pow(vh.x, 2) + Math.pow(vh.y, 2));
        var vt = vh_length / Math.cos(rad);
        var nv = cc.p(vr.x / vh_length, vr.y / vh_length);

        var p3 = cc.p((vt * nv.x) + pStart.x, (vt * nv.y) + pStart.y);

        return [pStart, p3, pEnd];
    },

    swapDrop: function(pos) {

        function getDropLength(p1, p2) {
            return Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2);
        }

        var target = this.getDropLocation(pos.x, pos.y);
        if(target.location == INVALID_DROP_NUMBER) return false;

        if(target.location == this._movingDrop.location) return false;

        var dst = target;
        var src = this._movingDrop;

        var srcp = ccm.Panel.drops[src.location].position;
        var dstp = ccm.Panel.drops[dst.location].position;
        var l = getDropLength(srcp, dstp);

        if(l > DROP.distance_2 && l > DROP.distance_1) {
            return false;
        }

        this.swapDropCore(src, dst);
        this._movingDrop.location = target.location;
        audioEngine.playEffect(res_swap_sound);
        return true;
    },

    swapDropCore: function(src, dst) {

        var srcLocation = src.location;
        var dstLocation = dst.location;
        var srcDrop = ccm.Panel.drops[srcLocation];
        var dstDrop = ccm.Panel.drops[dstLocation];

        srcDrop.color = dstDrop.color;
        dstDrop.color = src.color;

        // update drop number
        srcDrop.number = dstDrop.number;
        dstDrop.number = src.number;

        // animation
        var st, end, points;
        var bezierTime = 0.1;
        var dummySprite = this._movingDrop.dummySprite;
        st = dstDrop.position;
        end = srcDrop.position;
        points = this.createBezierPoints(st, end, 40);
        var move1 = cc.BezierTo.create(bezierTime, points);
        dstDrop.sprite.stopAllActions();
        dstDrop.sprite.runAction(move1);

        points = this.createBezierPoints(end, st, 40);
        var move2 = cc.BezierTo.create(bezierTime, points);
        dummySprite.stopAllActions();
        dummySprite.runAction(move2);

        // swap associated sprite information
        var tempSprite = dstDrop.sprite;
        dstDrop.sprite = srcDrop.sprite;
        srcDrop.sprite = tempSprite;
    },

    onTouchesBegan: function(touch, event) {

        if(this._checkMatching) return;

        var pos = touch[0].getLocation();

        this._touchLocation = pos;

        var drop = this.getDropLocation(pos.x, pos.y);
        this._movingDrop.location = drop.location;
        if(this._movingDrop.location == INVALID_DROP_NUMBER) return;

        this._movingDrop.number = ccm.Panel.drops[drop.location].number;
        this._movingDrop.color = ccm.Panel.drops[drop.location].color;
        this._movingDrop.sprite = ccm.Panel.drops[drop.location].sprite;
        this._movingDrop.sprite.setPosition(pos.x, pos.y + DROP.height / 2);


        // visible dummy drop
        var dummyDropSprite = this.getChildByTag(DROP_TAG.Dummy + ccm.Panel.drops[drop.location].color);
        this._movingDrop.dummySprite = dummyDropSprite;
        var p_ = ccm.Panel.drops[drop.location].position;
        dummyDropSprite.setVisible(true);
        dummyDropSprite.setPosition(p_);
        this.reorderChild(dummyDropSprite, DROP_TAG.FrontToTop - 1);

        // front to moving Drop
        this.reorderChild(this._movingDrop.sprite, DROP_TAG.FrontToTop);
    },

    onTouchesMoved: function(touch, event) {

        if(this._checkMatching) return;

        if(this._movingDrop.location == INVALID_DROP_NUMBER) return;

        var pos = touch[0].getLocation();
        this._movingDrop.sprite.setPosition(pos.x, pos.y + DROP.height / 2 - 10);

        // adjustment collision position
        pos.y += 5;

        // update touch information
        this._touchLocation = pos;

        var maxY = ccm.Panel.offsetY + (ccm.Panel.row * DROP.height);
        if(pos.y >= maxY) {
            pos.y = maxY - 1;
        }

        // swap drop
        this.swapDrop(pos);
    },

    endDropFadeOut: function() {

        function isIncludeInArray(value, array) {

            for(var i = 0; i < array.length; i++) {
                if(array[i] == value) {
                    return true;
                }
            }
            return false;
        }

        var row = 0,
            col = 0;
        var newDrop;
        var drop;
        var location;
        var i;

        for(row = 0; row < ccm.Panel.row; row++) {
            for(col = 0; col < ccm.Panel.col; col++) {

                newDrop = new GameDrop();
                drop = ccm.Panel.drops[ccm.Panel.col * row + col];
                newDrop.number = drop.number;
                newDrop.location = drop.location;
                this._result.newPanel.drops.push(newDrop);
            }
        }

        for(col = 0; col < ccm.Panel.col; col++) {

            var blankDrops = [];
            var row2 = 0;
            for(row = 0; row < ccm.Panel.row; row++) {

                newDrop = this._result.newPanel.drops[ccm.Panel.col * row2 + col];

                location = ccm.Panel.col * row + col;
                if(isIncludeInArray(location, this._result.matchAllDrops)) {

                    blankDrops.push(ccm.Panel.drops[location].number);
                } else {
                    var location2 = ccm.Panel.col * row2 + col;
                    newDrop.number = ccm.Panel.drops[location].number;
                    newDrop.location = location2;
                    newDrop.color = ccm.Panel.drops[location].color;
                    newDrop.position = ccm.Panel.drops[location2].position;
                    newDrop.sprite = ccm.Panel.drops[location].sprite;
                    row2++;
                }
            }

            var number;
            for(i = 0; i < blankDrops.length; i++, row2++) {
                location = ccm.Panel.col * row2 + col;
                number = blankDrops[i];

                newDrop = this._result.newPanel.drops[location];
                newDrop.number = number;
                newDrop.location = location;
                newDrop.color = parseInt((Math.random() * DROP_COLOR.count()), 10);
                newDrop.position = ccm.Panel.drops[location].position;
                newDrop.sprite = null;
            }
        }

        // this.dumpDrops(this._result.newPanel.drops);
        var srcDrop, dstDrop;
        var moveTime = 0.5;
        var easeRate = 2.0;
        var index;
        for(col = 0; col < ccm.Panel.col; col++) {

            var count = 1;
            for(row = 0; row < ccm.Panel.row; row++) {
                index = row * ccm.Panel.col + col;

                srcDrop = ccm.Panel.drops[index];
                for(i = 0; i < ccm.Panel.row; i++) {

                    var j = i * ccm.Panel.col + col;
                    var move, ease;
                    dstDrop = this._result.newPanel.drops[j];
                    if(srcDrop.live === false) {

                        if(srcDrop.number == dstDrop.number) {

                            var tag = srcDrop.sprite.getTag();
                            srcDrop.sprite.removeFromParent();
                            dstDrop.sprite = cc.Sprite.createWithSpriteFrameName(DROP_FILENAME[dstDrop.color]);
                            dstDrop.sprite.setTag(tag);
                            this.addChild(dstDrop.sprite);
                            if(DROP_DEBUG == 1) {
                                var label = cc.LabelTTF.create(dstDrop.number, "Arial", 24);
                                dstDrop.sprite.addChild(label);
                                label.setPosition(cc.p(28, 28));
                            }

                            var basePosition = ccm.Panel.drops[col + (ccm.Panel.col * (ccm.Panel.row - 1))].position;
                            dstDrop.sprite.setPosition(cc.p(basePosition.x, basePosition.y + DROP.height * count));
                            move = cc.MoveTo.create(moveTime, dstDrop.position);
                            ease = cc.EaseInOut.create(move, easeRate);
                            dstDrop.sprite.runAction(ease);
                            srcDrop.live = true;
                            count++;
                            break;
                        }

                    } else {
                        if(srcDrop.number == dstDrop.number) {
                            if(index != j) {
                                move = cc.MoveTo.create(moveTime, dstDrop.position);
                                ease = cc.EaseInOut.create(move, easeRate);
                                dstDrop.sprite.runAction(ease);
                                break;
                            }
                        }
                    }
                }

            }
        }
        for(row = 0; row < ccm.Panel.row; row++) {
            for(col = 0; col < ccm.Panel.col; col++) {
                index = col + ccm.Panel.col * row;
                dstDrop = this._result.newPanel.drops[index];

                srcDrop = ccm.Panel.drops[index];
                srcDrop.number = dstDrop.number;
                srcDrop.location = dstDrop.location;
                srcDrop.color = dstDrop.color;
                srcDrop.sprite = dstDrop.sprite;
                srcDrop.live = true;
            }
        }

        var func = cc.CallFunc.create(this.unlockDropMoveOperation, this);
        var delay = cc.DelayTime.create(moveTime);
        var seq = cc.Sequence.create(delay, func);
        this.runAction(seq);

        // this.dumpDrops(ccm.Panel.drops);
        // this.dumpDropsColor(ccm.Panel.drops);
        // this.dumpDropsLocation(ccm.Panel.drops);
    },

    unlockDropMoveOperation: function() {
        cc.log("**** Unlock operation ****");

        this.checkMatchDrops();
        if(this._result.drops.length > 0) {

            this.eraseDrops();

        } else {

            if(this._result.comboMaxCount > 0) {
                if(this._result.comboMaxCount < 5) {

                    this._grossini.danceRequest(0);
                } else {
                    this._grossini.danceRequest(1);
                }
            }

            this._checkMatching = false;
            if(DROP_DEBUG == 1) {
                this.dumpComboInfo();
            }
        }
    },


    playComboSE: function() {
        audioEngine.playEffect(res_combo_sound,false);
    },

    eraseDrops: function() {

        cc.log("Results:" + this._result.drops.length);

        var fadeTime = 0.5;
        var delayTime = 0.5;
        var waitTime = 0.0;

        var func, fade, delay, seq;
        for(var i = 0; i < this._result.drops.length; i++) {

            if(i == (this._result.drops.length - 1)) {
                last = true;
            }

            waitTime += fadeTime;
            for(var dropIdx = 0; dropIdx < this._result.drops[i].length; dropIdx++) {

                // set disable flg
                var dropLocations = this._result.drops[i];
                var location = dropLocations[dropIdx];
                ccm.Panel.drops[location].live = false;

                // First combo drop
                if(dropIdx === 0) {

                    var pos = ccm.Panel.drops[location].sprite.getPosition();

                    // comboLabel
                    this._result.comboCurrentCount++;
                    var combo = new ComboLabel(
                    this._result.comboCurrentCount, fadeTime * i, pos);
                    this.addChild(combo, LABEL_TAG.FrontToTop);

                    func = cc.CallFunc.create(this.playComboSE);
                    fade = cc.FadeOut.create(fadeTime);
                    delay = cc.DelayTime.create(delayTime * i);
                    seq = cc.Sequence.create(delay, func, fade);
                    ccm.Panel.drops[location].sprite.runAction(seq);

                }else {

                    fade = cc.FadeOut.create(fadeTime);
                    delay = cc.DelayTime.create(delayTime * i);
                    seq = cc.Sequence.create(delay, fade);
                    ccm.Panel.drops[location].sprite.runAction(seq);
                }

                this._result.matchAllDrops.push(dropLocations[dropIdx]);
            }
        }

        // Callback End Fadeout
        (function() {
            var delay = cc.DelayTime.create(waitTime);
            var func = cc.CallFunc.create(this.endDropFadeOut, this);
            var seq = cc.Sequence.create(delay, func);
            this.runAction(seq);
        }).apply(this);

        this._checkMatching = true;
    },

    onTouchesEnded: function(touch, event) {

        if(this._movingDrop.location == INVALID_DROP_NUMBER) return;
        if(this._checkMatching === true) return;

        var number = this._movingDrop.number;
        if(number == INVALID_DROP_NUMBER) return;

        this._touchLocation = null;

        var resetPos = ccm.Panel.drops[this._movingDrop.location].position;
        this._movingDrop.sprite.setPosition(resetPos.x, resetPos.y);
        this.reorderChild(this._movingDrop.sprite, this._movingDrop.location );

        // dummySprite hide
        this._movingDrop.dummySprite.setVisible(false);

        // reset combo information
        this._result.comboMaxCount = 0;
        this._result.comboCurrentCount = 0;
        this._result.comboInfo = {};

        this.checkMatchDrops();
        this.eraseDrops();
    },

    onTouchesCancelled: function(touch, event) {

        if(this._checkMatching) return;

        this._touchLocation = null;

        var resetPos = ccm.Panel.drops[this._movingDrop.location].position;
        this._movingDrop.sprite.setPosition(resetPos.x, resetPos.y);

        // dummySprite hide
        this._movingDrop.dummyDropSprite.setVisible(false);
    },

    //
    // callbacks
    //
    onEnter: function() {
        this._super();
        // Do something if needed
    },

    onExit: function() {
        this._super();
    },

    update: function(dt) {},

    dumpDrops: function(drops) {

        var c = 0;
        var size = drops.length - 1;
        cc.log("===== DUMP NUMBER =====");
        for(var y = (ccm.Panel.row - 1); y >= 0; y--) {

            for(var x = 0; x < ccm.Panel.col; x++) {

                var number = (y * ccm.Panel.col) + x;
                var s = String(drops[number].number);
                if(s.length == 1) {
                    s = "0" + s;
                }
                cc.print(s + ",");
            }
            cc.print("\n");
        }
    },

    dumpDropsColor: function(drops) {

        var c = 0;
        var size = drops.length - 1;
        cc.log("===== DUMP COLOR =====");
        for(var y = (ccm.Panel.row - 1); y >= 0; y--) {

            for(var x = 0; x < ccm.Panel.col; x++) {

                var number = (y * ccm.Panel.col) + x;
                var s = String(drops[number].color);
                if(s.length == 1) {
                    s = "0" + s;
                }
                cc.print(s + ",");
            }
            cc.print("\n");
        }
    },

    dumpDropsLocation: function(drops) {

        var c = 0;
        var size = drops.length - 1;

        cc.log("===== DUMP LOCATION =====");
        for(var y = (ccm.Panel.row - 1); y >= 0; y--) {

            for(var x = 0; x < ccm.Panel.col; x++) {

                var number = (y * ccm.Panel.col) + x;
                var s = String(drops[number].location);
                if(s.length == 1) {
                    s = "0" + s;
                }
                cc.print(s + ",");
            }
            cc.print("\n");
        }
    },

    dumpComboInfo: function() {

        cc.log("===== COMBO RESULT =====");
        cc.log("COMBO : " + this._result.comboMaxCount);
        for(var key in this._result.comboInfo) {
            cc.log("> Color : " + key + " COUNT : " + this._result.comboInfo[key]);
        }
    },

    dumpPanels: function() {

        var c = 0;
        var size = ccm.Panel.drops.length - 1;

        for(var y = (ccm.Panel.row - 1); y >= 0; y--) {

            for(var x = 0; x < ccm.Panel.col; x++) {

                var number = (y * ccm.Panel.col) + x;
                var s = String(ccm.Panel.drops[number].number);
                if(s.length == 1) {
                    s = "0" + s;
                }
                cc.print(s + ",");
            }
            cc.print("\n");
        }
    }

});