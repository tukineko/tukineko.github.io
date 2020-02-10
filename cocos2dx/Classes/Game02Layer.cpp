#include "Game02Layer.h"
#include "SimpleAudioEngine.h"

#include "TitleLayer.h"

USING_NS_CC;

Scene* Game02Layer::createScene()
{
    Scene* scene = Scene::create();
    Game02Layer* layer = Game02Layer::create();
    scene->addChild(layer);
    return scene;
}

// on "init" you need to initialize your instance
bool Game02Layer::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Layer::init() )
    {
        return false;
    }

    auto labelBtnLabel01 = LabelTTF::create("Back to Title", "fonts/Marker Felt.ttf", 24);
    auto labelItem01 = MenuItemLabel::create(labelBtnLabel01, CC_CALLBACK_0(Game02Layer::backTitleCallback, this));
    labelItem01->setPosition(Vec2(winSizeW - 100, 30));
    auto menu = Menu::create(labelItem01, nullptr);
    menu->setPosition(Point::ZERO);
    this->addChild(menu, 100);

    this->_game_state = 0;

    //スコア表示
    this->ViewScore();

    this->drawChara1();
    this->drawChara2();

    auto listener = EventListenerTouchOneByOne::create();
    listener->onTouchBegan = CC_CALLBACK_2(Game02Layer::onTouchBegan, this);
    listener->onTouchEnded = CC_CALLBACK_2(Game02Layer::onTouchEnded, this);
    listener->onTouchMoved = CC_CALLBACK_2(Game02Layer::onTouchMoved, this);
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->addEventListenerWithSceneGraphPriority(listener, this);

    this->scheduleUpdate();

    return true;
}

void Game02Layer::onEnterTransitionDidFinish()
{
    //ここに画面遷移後に呼び出したい処理を書く
    this->_game_state = 1;
    this->GameStart();

}

void Game02Layer::ViewScore()
{
    this->removeChildByTag(1000);

    auto label = Label::createWithTTF(StringUtils::toString(_score), "fonts/Marker Felt.ttf", 24);
    label->setPosition(Vec2(winSizeCenterW, winSizeH - 50));
    this->addChild(label, 0, 1000);
}

void Game02Layer::GameOver() {
    this->_game_state = 3;
    auto gameover = Sprite::create("txt_gameover.png");
    gameover->setPosition(Vec2(winSizeCenterW, winSizeCenterH));
    this->addChild(gameover);

    // ラベルを生成
    //Ver3.x CC_CALLBACK_1 マクロ（引数が１つ）にすること
    auto labelBtnLabel01 = LabelTTF::create("Back to Title", "fonts/Marker Felt.ttf", 48);
    // ラベルメニューアクション先の設定
    auto labelItem01 = MenuItemLabel::create(labelBtnLabel01, CC_CALLBACK_0(Game02Layer::nextSceneCallback, this));
    // ラベルの設置
    labelItem01->setPosition(Vec2(winSizeCenterW, 200));

    // メニューを作成 自動解放オブジェクト
    auto menu = Menu::create(labelItem01, nullptr);

    menu->setPosition(Point::ZERO);
    // メニューを追加
    this->addChild(menu);

}

void Game02Layer::GameStart()
{
    auto count3 = Sprite::create("countdown3.png");
    count3->setPosition(Vec2(winSizeCenterW, winSizeCenterH));
    count3->setOpacity(0);
    this->addChild(count3);

    auto count2 = Sprite::create("countdown2.png");
    count2->setPosition(Vec2(winSizeCenterW, winSizeCenterH));
    count2->setOpacity(0);
    this->addChild(count2);

    auto count1 = Sprite::create("countdown1.png");
    count1->setPosition(Vec2(winSizeCenterW, winSizeCenterH));
    count1->setOpacity(0);
    this->addChild(count1);

    auto start = Sprite::create("txt_start.png");
    start->setPosition(Vec2(winSizeCenterW, winSizeCenterH));
    start->setOpacity(1);
    this->addChild(start);

    auto ac = Sequence::create(
        Spawn::create(
            CCEaseOut::create(MoveBy::create(0.3f, Vec2(0, 100)), 3),
            CCEaseOut::create(FadeIn::create(0.5f), 3),
            nullptr
            ),
        CCEaseOut::create(FadeOut::create(0.1f), 3),
        nullptr);

    auto ac2 = Sequence::create(
        FadeIn::create(0.0f),
        Spawn::create(
            CCEaseIn::create(ScaleTo::create(0.3f, 2.0f), 3),
            CCEaseIn::create(FadeOut::create(0.3f), 3),
            nullptr
        ),
        CCEaseOut::create(FadeOut::create(0.1f), 3),
        CallFunc::create([this]() {
            this->_game_state = 2;
            this->spawnBall();
            }),
        nullptr);

    count3->runAction(
        Sequence::create(
            DelayTime::create(0.5f),
            ac,
            TargetedAction::create(count2, Sequence::create(ac, RemoveSelf::create(), nullptr)),
            TargetedAction::create(count1, Sequence::create(ac, RemoveSelf::create(), nullptr)),
            TargetedAction::create(start, Sequence::create(ac2, RemoveSelf::create(), nullptr)),
            RemoveSelf::create(),
            nullptr)
    );
}

void Game02Layer::update(float frame) {
    if (this->_ball_status == 1) {
        if (this->_ball->getPosition().x >= 1100) {
            this->_ball->removeFromParentAndCleanup(true);
            this->spawnBall();
        }
    }

    if (this->_game_state == 2) {
        if (this->_ball->getPosition().y <= 0) {
            this->GameOver();
        }
    }
}

void Game02Layer::drawChara1()
{
    DrawNode* line = DrawNode::create();
    line->drawSegment(Vec2(winSizeW / 4, 0), Vec2(winSizeW / 4, winSizeH), 2.5f, Color4F::RED);
    this->addChild(line);

    // 矩形
    // x座標, y座標, width, height
    Rect rect = Rect(0, 0, 100, 200);
    auto chara1 = Sprite::create();
    chara1->setTextureRect(rect);
    chara1->setPosition(Chara1Pos);
    this->addChild(chara1);

    Rect rect2 = Rect(0, 0, 50, 80);
    this->_ude1 = Sprite::create();
    this->_ude1->setTextureRect(rect2);
    this->_ude1->setAnchorPoint(Vec2(0.5f, 0));
    this->_ude1->setPosition(Chara1UdePos);
    this->_ude1->setRotation(50);
    this->addChild(this->_ude1);
}

void Game02Layer::drawChara2()
{
    // 矩形
    // x座標, y座標, width, height
    Rect rect = Rect(0, 0, 100, 200);
    auto chara2 = Sprite::create();
    chara2->setTextureRect(rect);
    chara2->setPosition(Chara2Pos);
    this->addChild(chara2);

    Rect rect2 = Rect(0, 0, 50, 80);
    this->_ude2 = Sprite::create();
    this->_ude2->setTextureRect(rect2);
    this->_ude2->setAnchorPoint(Vec2(0.5f, 0));
    this->_ude2->setPosition(Chara2UdePos);
    this->_ude2->setRotation(-50);
    this->addChild(this->_ude2);
}

void Game02Layer::spawnBall()
{
    this->_ball_status = 0;

    this->_ball = Sprite::create("puzzle2.png");
    this->_ball->setPosition(ItemPos);
    this->addChild(this->_ball);

    // ベジエ曲線に乗っ取ってアニメーションさせる
    ccBezierConfig config{};
    config.controlPoint_1 = ItemPos;
    config.controlPoint_2 = Vec2(winSizeW / 2, winSizeH * 1.5);
    config.endPosition = Vec2(100, 0);

    float frand_1 = random(0.7f, 2.0f);

    auto ac = Sequence::create(
        CCEaseOut::create(BezierTo::create(frand_1, config), 2),
        nullptr);
    ac->setTag(1);
    this->_ball->runAction(ac);

    //敵腕の動き
    auto ude_ac = Sequence::create(
        RotateBy::create(0.2f, 80.0f),
        RotateBy::create(0.2f, -80.0f),
        nullptr);
    this->_ude2->runAction(ude_ac);
}

//タッチした時に呼び出される関数
bool Game02Layer::onTouchBegan(cocos2d::Touch* touch, cocos2d::Event* event) {
    auto location = touch->getLocation();
   
    //ゲームプレイ中なら有効
    if (this->_game_state == 2) {
        auto eventListenerDisable = CallFunc::create([&]() {
            getEventDispatcher()->setEnabled(false);
            });

        auto eventListenerEnable = CallFunc::create([&]() {
            getEventDispatcher()->setEnabled(true);
            });

        auto ude_ac = Sequence::create(
            eventListenerDisable,
            RotateBy::create(0.2f, -80.0f),
            RotateBy::create(0.2f, 80.0f),
            eventListenerEnable,
            nullptr);


        this->_ude1->runAction(ude_ac);

        if (this->_ball->getPosition().x <= (winSizeW / 4)) {
            this->_ball->stopActionByTag(1);
            this->_ball->setVisible(false);

            this->_ball->setPosition(Vec2(200, 300));
            this->_ball->setVisible(true);

            ccBezierConfig config{};
            config.controlPoint_1 = Vec2(200, 300);
            config.controlPoint_2 = Vec2(winSizeW / 2, winSizeH * 1.5);
            config.endPosition = ItemPos;

            auto ac = Sequence::create(
                CCEaseOut::create(BezierTo::create(2.f, config), 2),
                nullptr);
            ac->setTag(1);
            this->_ball->runAction(ac);

            if (this->_ball_status == 0) {
                _score++;
                this->ViewScore();
            }
            this->_ball_status = 1;
        }
    }
    
    return true;
}

//タッチを離した時に呼び出される関数  
void Game02Layer::onTouchEnded(cocos2d::Touch* touch, cocos2d::Event* event) {
    
}

//タッチしながら移動中に呼び出される関数
void Game02Layer::onTouchMoved(cocos2d::Touch* touch, cocos2d::Event* event) {

}

void Game02Layer::nextSceneCallback() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, TitleLayer::createScene(), Color3B::WHITE));
}

void Game02Layer::backTitleCallback() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, TitleLayer::createScene(), Color3B::WHITE));
}

