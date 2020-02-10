#include "Game05Layer.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* Game05Layer::createScene()
{
    Scene* scene = Scene::create();
    Game05Layer* layer = Game05Layer::create();
    scene->addChild(layer);
    return scene;
}

// on "init" you need to initialize your instance
bool Game05Layer::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Layer::init() )
    {
        return false;
    }
    CCLOG("----------------Game05Layer::init()----------------");
    
    auto labelBtnLabel01 = LabelTTF::create("Back to Title", "fonts/Marker Felt.ttf", 24);
    auto labelItem01 = MenuItemLabel::create(labelBtnLabel01, CC_CALLBACK_0(Game05Layer::backTitleCallback, this));
    labelItem01->setPosition(Vec2(winSizeW - 100, 30));
    auto menu = Menu::create(labelItem01, nullptr);
    menu->setPosition(Point::ZERO);
    this->addChild(menu, 100);

    auto cameraLayer = Layer::create();
    auto rotation3D = cameraLayer->getRotation3D();
    rotation3D.x = -35;
    cameraLayer->setRotation3D(rotation3D);
    addChild(cameraLayer);

    auto node = Sprite::create("puzzle1.png");
    node->setPosition(Vec2(winSizeCenterW, winSizeH));
    node->setRotation3D(cameraLayer->getRotation3D());
    cameraLayer->addChild(node);
    node->runAction(MoveTo::create(6.0f, Vec2(winSizeCenterW, 0)));

    auto node2 = Sprite::create("HelloWorld.png");
    node2->setPosition(Vec2(winSizeCenterW / 2, winSizeCenterH));
    node2->setRotation3D(cameraLayer->getRotation3D());
    cameraLayer->addChild(node2);

    auto listener = EventListenerTouchOneByOne::create();
    listener->onTouchBegan = CC_CALLBACK_2(Game05Layer::onTouchBegan, this);
    listener->onTouchEnded = CC_CALLBACK_2(Game05Layer::onTouchEnded, this);
    listener->onTouchMoved = CC_CALLBACK_2(Game05Layer::onTouchMoved, this);
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->addEventListenerWithSceneGraphPriority(listener, this);

    return true;
}

//タッチした時に呼び出される関数
bool Game05Layer::onTouchBegan(Touch* touch, Event* event) {
    auto location = touch->getLocation();

    return true;
}

//タッチを離した時に呼び出される関数  
void Game05Layer::onTouchEnded(Touch* touch, Event* event) {
    

    
}

//タッチしながら移動中に呼び出される関数
void Game05Layer::onTouchMoved(Touch* touch, Event* event) {
    
}

#include "TitleLayer.h"
void Game05Layer::backTitleCallback() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, TitleLayer::createScene(), Color3B::WHITE));
}