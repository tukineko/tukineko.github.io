#include "TitleLayer.h"
#include "SimpleAudioEngine.h"

#include "Game01Layer.h"
#include "Game02Layer.h"
#include "Game03Layer.h"
#include "Game04Layer.h"
#include "Game05Layer.h"
#include "Game06Layer.h"
#include "Game07Layer.h"

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

    //グリッド線
    auto render = RenderTexture::create(winSizeW, winSizeH);
    render->setPosition(Vec2(winSizeCenterW, winSizeCenterH));
    this->addChild(render, 999);
    
    render->begin();
    auto line = DrawNode::create();
    line->retain();
    for (int x = 0; x < 10; x++) {
        line->drawSegment(Vec2(100 * x, 0), Vec2(100 * x, winSizeH), 1.0f, Color4F::RED);
        line->Node::visit();
    }
    for (int y = 0; y < 7; y++) {
        line->drawSegment(Vec2(0, 100 * y), Vec2(winSizeW, 100 * y), 1.0f, Color4F::RED);
        line->Node::visit();
    }
    render->end();

    //背景
    auto bg = LayerColor::create(Color4B::WHITE, winSizeW, winSizeH);
    this->addChild(bg);

    //メニューボタン
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
    auto mItem7 = MenuItemImage::create("btn.png", "btnOn.png", CC_CALLBACK_0(TitleLayer::nextSceneCallback7, this));
    mItem7->setPosition(Vec2(winSizeW / 5, winSizeH - 350));

    //メニューを作成
    auto menu = Menu::create(mItem1, mItem2, mItem3, mItem4, mItem5, mItem6, mItem7, NULL);
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

void TitleLayer::nextSceneCallback7() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, Game07Layer::createScene(), Color3B::WHITE));
}