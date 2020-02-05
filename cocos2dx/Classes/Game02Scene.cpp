#include "Game02Scene.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* Game02Scene::createScene()
{
    return Game02Scene::create();
}

// on "init" you need to initialize your instance
bool Game02Scene::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Scene::init() )
    {
        return false;
    }

    //auto visibleSize = Director::getInstance()->getVisibleSize();
    _winSizwW = VisibleSize.width;
    _winSizeH = VisibleSize.height;
    
    DrawNode* line = DrawNode::create();
    line->drawSegment(Vec2(_winSizwW / 4, 0), Vec2(_winSizwW / 4, _winSizeH), 2.5f, Color4F::RED);
    this->addChild(line);

    this->viewScore();
    this->drawChara1();
    this->drawChara2();

    auto listener = EventListenerTouchOneByOne::create();
    listener->onTouchBegan = CC_CALLBACK_2(Game02Scene::onTouchBegan, this);
    listener->onTouchEnded = CC_CALLBACK_2(Game02Scene::onTouchEnded, this);
    listener->onTouchMoved = CC_CALLBACK_2(Game02Scene::onTouchMoved, this);
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->addEventListenerWithSceneGraphPriority(listener, this);

    this->scheduleUpdate();
    //this->schedule(schedule_selector(Game02Scene::spawnItem), 1.5f);

    this->scheduleOnce(schedule_selector(Game02Scene::spawnBall), 2.0f);

    return true;
}

void Game02Scene::update(float frame) {
    if (status == 1) {
        if (_ball->getPosition().x >= 1100) {
            _ball->removeFromParentAndCleanup(true);
            this->spawnBall2();
        }
    }
}

void Game02Scene::viewScore()
{
    auto label = Label::createWithTTF(StringUtils::toString(_score), "fonts/Marker Felt.ttf", 24);
    label->setPosition(Vec2(_winSizwW / 2, _winSizeH - 300));
    this->addChild(label);
}

void Game02Scene::drawChara1()
{
    // 矩形
    // x座標, y座標, width, height
    Rect rect = Rect(0, 0, 100, 200);
    auto chara1 = Sprite::create();
    chara1->setTextureRect(rect);
    chara1->setPosition(Chara1Pos);
    this->addChild(chara1);

    Rect rect2 = Rect(0, 0, 50, 80);
    _ude1 = Sprite::create();
    _ude1->setTextureRect(rect2);
    _ude1->setAnchorPoint(Vec2(0.5f, 0));
    _ude1->setPosition(Chara1UdePos);
    _ude1->setRotation(50);
    this->addChild(_ude1);
}

void Game02Scene::drawChara2()
{
    // 矩形
    // x座標, y座標, width, height
    Rect rect = Rect(0, 0, 100, 200);
    auto chara2 = Sprite::create();
    chara2->setTextureRect(rect);
    chara2->setPosition(Chara2Pos);
    this->addChild(chara2);

    Rect rect2 = Rect(0, 0, 50, 80);
    auto ude = Sprite::create();
    ude->setTextureRect(rect2);
    ude->setPosition(Chara2UdePos);
    ude->setRotation(-50);
    this->addChild(ude);
}

void Game02Scene::spawnBall(float frame)
{
    status = 0;

    _ball = Sprite::create("puzzle2.png");
    _ball->setPosition(ItemPos);
    this->addChild(_ball);

    // ベジエ曲線に乗っ取ってアニメーションさせる
    ccBezierConfig config{};
    config.controlPoint_1 = ItemPos;
    config.controlPoint_2 = Vec2(_winSizwW / 2, _winSizeH * 1.5);
    config.endPosition = Vec2(100, 0);

    auto ac = Sequence::create(
        CCEaseOut::create(BezierTo::create(3.f, config), 2),
        RemoveSelf::create(),
        nullptr);
    ac->setTag(1);
    _ball->runAction(ac);
}

void Game02Scene::spawnBall2()
{
    status = 0;

    _ball = Sprite::create("puzzle2.png");
    _ball->setPosition(ItemPos);
    this->addChild(_ball);

    // ベジエ曲線に乗っ取ってアニメーションさせる
    ccBezierConfig config{};
    config.controlPoint_1 = ItemPos;
    config.controlPoint_2 = Vec2(_winSizwW / 2, _winSizeH * 1.5);
    config.endPosition = Vec2(100, 0);

    auto ac = Sequence::create(
        CCEaseOut::create(BezierTo::create(3.f, config), 2),
        RemoveSelf::create(),
        nullptr);
    ac->setTag(1);
    _ball->runAction(ac);
}

//タッチした時に呼び出される関数
bool Game02Scene::onTouchBegan(cocos2d::Touch* touch, cocos2d::Event* event) {
    auto location = touch->getLocation();
   
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
    _ude1->runAction(ude_ac);

    if (_ball->getPosition().x <= (_winSizwW / 4)) {
        _ball->stopActionByTag(1);
        _ball->setVisible(false);

        _ball->setPosition(Vec2(200, 300));
        _ball->setVisible(true);

        ccBezierConfig config{};
        config.controlPoint_1 = Vec2(200, 300);
        config.controlPoint_2 = Vec2(_winSizwW / 2, _winSizeH * 1.5);
        config.endPosition = ItemPos;

        auto ac = Sequence::create(
            CCEaseOut::create(BezierTo::create(3.f, config), 2),
            nullptr);
        ac->setTag(1);
        _ball->runAction(ac);

        if (status == 0) {
            _score++;
            this->viewScore();
        }
        status = 1;
    }

    /*for (int i = 0; i < (int)_items.size(); i++) {
        Sprite* item = _items.at(i);
        if (item->getPosition().x <= (_winSizwW / 4)) {
            item->stopActionByTag(1);

            // 0～int最大値までの乱数を取得
            //int num = cocos2d::random();
            // 指定した範囲内の乱数を取得
            //int scoped_num = cocos2d::random<int>(10, 20);

            int randX = cocos2d::random<int>(50, 100);
            int randY = cocos2d::random<int>(100, 200);

            auto ac = Sequence::create(
                Spawn::create(
                    MoveBy::create(0.5f, Vec2(randX, randY)),
                    FadeOut::create(0.3f),
                    ScaleTo::create(0.3f, 0.1f),
                    nullptr
                ),
                RemoveSelf::create(),
                nullptr);
            item->runAction(ac);

            ccBezierConfig config{};
            config.controlPoint_1 = Vec2(100, 0);
            config.controlPoint_2 = Vec2(_winSizwW / 2, _winSizeH * 1.5);
            config.endPosition = ItemPos;

            auto ac = Sequence::create(

                BezierTo::create(3.f, config),
                RemoveSelf::create(),
                nullptr);
            ac->setTag(1);
            item->runAction(ac);

            _items.erase(i);
            i--;
        }
    }*/
    

    
    return true;
}

//タッチを離した時に呼び出される関数  
void Game02Scene::onTouchEnded(cocos2d::Touch* touch, cocos2d::Event* event) {
    
}

//タッチしながら移動中に呼び出される関数
void Game02Scene::onTouchMoved(cocos2d::Touch* touch, cocos2d::Event* event) {

}
