#include "Game04Layer.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* Game04Layer::createScene()
{
    Scene* scene = Scene::create();
    Game04Layer* layer = Game04Layer::create();
    scene->addChild(layer);
    return scene;
}

// on "init" you need to initialize your instance
bool Game04Layer::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Layer::init() )
    {
        return false;
    }
    CCLOG("----------------Game04Layer::init()----------------");
    
    auto labelBtnLabel01 = LabelTTF::create("Back to Title", "fonts/Marker Felt.ttf", 24);
    auto labelItem01 = MenuItemLabel::create(labelBtnLabel01, CC_CALLBACK_0(Game04Layer::backTitleCallback, this));
    labelItem01->setPosition(Vec2(winSizeW - 100, 30));
    auto menu = Menu::create(labelItem01, nullptr);
    menu->setPosition(Point::ZERO);
    this->addChild(menu, 100);

    //スタート文字
    _moveNode = Sprite::create("txt_start.png");
    _moveNode->setPosition(Vec2(winSizeCenterW, winSizeCenterH));
    this->addChild(_moveNode);

    auto listener = EventListenerTouchOneByOne::create();
    listener->onTouchBegan = CC_CALLBACK_2(Game04Layer::onTouchBegan, this);
    listener->onTouchEnded = CC_CALLBACK_2(Game04Layer::onTouchEnded, this);
    listener->onTouchMoved = CC_CALLBACK_2(Game04Layer::onTouchMoved, this);
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->addEventListenerWithSceneGraphPriority(listener, this);

    return true;
}

//タッチした時に呼び出される関数
bool Game04Layer::onTouchBegan(Touch* touch, Event* event) {
    auto location = touch->getLocation();

    auto diff = _moveNode->getPosition() - touch->getLocation();
    _prevAngle = CC_RADIANS_TO_DEGREES(atan2(diff.x, diff.y));

    return true;
}

//タッチを離した時に呼び出される関数  
void Game04Layer::onTouchEnded(Touch* touch, Event* event) {
    

    
}

//タッチしながら移動中に呼び出される関数
void Game04Layer::onTouchMoved(Touch* touch, Event* event) {
    auto diff = _moveNode->getPosition() - touch->getLocation();
    auto angle = CC_RADIANS_TO_DEGREES(atan2(diff.x, diff.y));
    _moveNode->setRotation(_moveNode->getRotation() + (angle - _prevAngle));
    _prevAngle = angle;
    
}

#include "TitleLayer.h"
void Game04Layer::backTitleCallback() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, TitleLayer::createScene(), Color3B::WHITE));
}