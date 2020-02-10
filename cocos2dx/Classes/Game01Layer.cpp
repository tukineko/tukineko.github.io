#include "Game01Layer.h"
#include "SimpleAudioEngine.h"

Scene* Game01Layer::createScene()
{
    Scene* scene = Scene::create();
    Game01Layer* layer = Game01Layer::create();
    scene->addChild(layer);
    return scene;
}

// on "init" you need to initialize your instance
bool Game01Layer::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Layer::init() )
    {
        return false;
    }
    CCLOG("----------------Game01Layer::init()----------------");

    this->setupItems();
    
    auto labelBtnLabel01 = LabelTTF::create("Back to Title", "fonts/Marker Felt.ttf", 24);
    auto labelItem01 = MenuItemLabel::create(labelBtnLabel01, CC_CALLBACK_0(Game01Layer::backTitleCallback, this));
    labelItem01->setPosition(Vec2(winSizeW - 100, 30));
    auto menu = Menu::create(labelItem01, nullptr);
    menu->setPosition(Point::ZERO);
    this->addChild(menu, 100);

    auto listener = EventListenerTouchOneByOne::create();
    listener->onTouchBegan = CC_CALLBACK_2(Game01Layer::onTouchBegan, this);
    listener->onTouchEnded = CC_CALLBACK_2(Game01Layer::onTouchEnded, this);
    listener->onTouchMoved = CC_CALLBACK_2(Game01Layer::onTouchMoved, this);
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->addEventListenerWithSceneGraphPriority(listener, this);

    return true;
}

void Game01Layer::setupItems(){
    //30個の画像を画面上のランダムな位置に表示して配列に格納
    for (int i = 0; i < 30; i++) {
        auto item = Sprite::create("puzzle1.png");
        int px = rand() % (int)winSizeW;
        int py = rand() % (int)winSizeH;
        item->setPosition(Vec2(px, py));
        this->addChild(item);

        _items.pushBack(item);
    }
}

//タッチした時に呼び出される関数
bool Game01Layer::onTouchBegan(cocos2d::Touch* touch, cocos2d::Event* event) {
    CCLOG("-------onTouchBegan--------");
    return true;
}

//タッチを離した時に呼び出される関数  
void Game01Layer::onTouchEnded(cocos2d::Touch* touch, cocos2d::Event* event) {
    auto location = touch->getLocation();

    for (int i = 0; i < (int)_items.size(); i++) {
        Sprite* item = _items.at(i);
        Rect spriteRect = Rect(item->getPosition().x - item->getContentSize().width / 2,
            item->getPosition().y - item->getContentSize().height / 2,
            item->getContentSize().width,
            item->getContentSize().height);
        if (spriteRect.containsPoint(location)) {
            item->removeFromParent();
            _items.erase(i);
            i--;
        }
    }
}

//タッチしながら移動中に呼び出される関数
void Game01Layer::onTouchMoved(cocos2d::Touch* touch, cocos2d::Event* event) {
    
}

#include "TitleLayer.h"
void Game01Layer::backTitleCallback() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, TitleLayer::createScene(), Color3B::WHITE));
}

