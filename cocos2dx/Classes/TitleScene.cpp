#include "TitleScene.h"
#include "SimpleAudioEngine.h"

#include "GameScene.h"
#include "Game02Scene.h"
#include "Game03Scene.h"

USING_NS_CC;

Scene* TitleScene::createScene()
{
    return TitleScene::create();
}

bool TitleScene::init()
{
    if ( !Scene::init() )
    {
        return false;
    }
    CCLOG("----------------TitleLayer::init()----------------");

    auto bg = LayerColor::create(Color4B::WHITE, winSizeW, winSizeH);
    this->addChild(bg);

    auto mItem1 = MenuItemImage::create("btn.png", "btnOn.png", CC_CALLBACK_0(TitleScene::nextSceneCallback, this));
    mItem1->setPosition(Vec2(winSizeW / 5, winSizeH - 100));
    auto mItem2 = MenuItemImage::create("btn.png", "btnOn.png", CC_CALLBACK_0(TitleScene::nextSceneCallback2, this));
    mItem2->setPosition(Vec2(winSizeW / 5, winSizeH - 150));
    auto mItem3 = MenuItemImage::create("btn.png", "btnOn.png", CC_CALLBACK_0(TitleScene::nextSceneCallback3, this));
    mItem3->setPosition(Vec2(winSizeW / 5, winSizeH - 200));

    //ƒƒjƒ…[‚ðì¬
    auto menu = Menu::create(mItem1, mItem2, mItem3, NULL);
    menu->setPosition(Point::ZERO);
    this->addChild(menu);

    return true;
}

void TitleScene::nextSceneCallback() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, GameScene::createScene(), Color3B::WHITE));
}

void TitleScene::nextSceneCallback2() {
    Director::getInstance()->replaceScene(TransitionFadeTR::create(1.0f, Game02Scene::createScene()));
}

void TitleScene::nextSceneCallback3() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, Game03Scene::createScene(), Color3B::WHITE));
}

