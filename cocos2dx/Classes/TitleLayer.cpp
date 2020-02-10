#include "TitleLayer.h"
#include "SimpleAudioEngine.h"

#include "Game01Layer.h"
#include "Game02Layer.h"
#include "Game03Layer.h"
#include "Game04Layer.h"
#include "Game05Layer.h"
#include "Game06Layer.h"

USING_NS_CC;

Scene* TitleLayer::createScene()
{
    Scene* scene = Scene::create();
    TitleLayer* layer = TitleLayer::create();
    scene->addChild(layer);
    return scene;
}

bool TitleLayer::init()
{
    if ( !Layer::init() )
    {
        return false;
    }
    CCLOG("----------------TitleLayer::init()----------------");

    auto bg = LayerColor::create(Color4B::WHITE, winSizeW, winSizeH);
    this->addChild(bg);

    auto mItem1 = MenuItemImage::create("btn.png", "btnOn.png", CC_CALLBACK_0(TitleLayer::nextSceneCallback, this));
    mItem1->setPosition(Vec2(winSizeW / 5, winSizeH - 100));
    auto mItem2 = MenuItemImage::create("btn.png", "btnOn.png", CC_CALLBACK_0(TitleLayer::nextSceneCallback2, this));
    mItem2->setPosition(Vec2(winSizeW / 5, winSizeH - 150));
    auto mItem3 = MenuItemImage::create("btn.png", "btnOn.png", CC_CALLBACK_0(TitleLayer::nextSceneCallback3, this));
    mItem3->setPosition(Vec2(winSizeW / 5, winSizeH - 200));
    auto mItem4 = MenuItemImage::create("btn.png", "btnOn.png", CC_CALLBACK_0(TitleLayer::nextSceneCallback4, this));
    mItem4->setPosition(Vec2(winSizeW / 5, winSizeH - 250));
    auto mItem5 = MenuItemImage::create("btn.png", "btnOn.png", CC_CALLBACK_0(TitleLayer::nextSceneCallback5, this));
    mItem5->setPosition(Vec2(winSizeW / 5, winSizeH - 300));
    auto mItem6 = MenuItemImage::create("btn.png", "btnOn.png", CC_CALLBACK_0(TitleLayer::nextSceneCallback6, this));
    mItem6->setPosition(Vec2(winSizeW / 5, winSizeH - 350));

    //ƒƒjƒ…[‚ðì¬
    auto menu = Menu::create(mItem1, mItem2, mItem3, mItem4, mItem5, mItem6, NULL);
    menu->setPosition(Point::ZERO);
    this->addChild(menu);

    return true;
}

void TitleLayer::nextSceneCallback() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, Game01Layer::createScene(), Color3B::WHITE));
}

void TitleLayer::nextSceneCallback2() {
    Director::getInstance()->replaceScene(TransitionFadeTR::create(1.0f, Game02Layer::createScene()));
}

void TitleLayer::nextSceneCallback3() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, Game03Layer::createScene(), Color3B::WHITE));
}

void TitleLayer::nextSceneCallback4() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, Game04Layer::createScene(), Color3B::WHITE));
}

void TitleLayer::nextSceneCallback5() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, Game05Layer::createScene(), Color3B::WHITE));
}

void TitleLayer::nextSceneCallback6() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, Game06Layer::createScene(), Color3B::WHITE));
}