#include "TitleScene.h"
#include "SimpleAudioEngine.h"

#include "GameScene.h"
#include "Game02Scene.h"

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

    auto visibleSize = Director::getInstance()->getVisibleSize();
    _winSizwW = visibleSize.width;
    _winSizeH = visibleSize.height;

    auto _bg2 = LayerColor::create(Color4B::WHITE, _winSizwW, _winSizeH);
    this->addChild(_bg2);

    auto mItem1 = MenuItemImage::create("btn.png", "btnOn.png", CC_CALLBACK_0(TitleScene::nextSceneCallback, this));
    mItem1->setPosition(Vec2(_winSizwW / 5, _winSizeH / 1.25));
    auto mItem2 = MenuItemImage::create("btn.png", "btnOn.png", CC_CALLBACK_0(TitleScene::nextSceneCallback2, this));
    mItem2->setPosition(Vec2(_winSizwW / 5, _winSizeH / 1.5));

    //ƒƒjƒ…[‚ðì¬
    auto _menu2 = Menu::create(mItem1, mItem2, NULL);
    _menu2->setPosition(Point::ZERO);
    this->addChild(_menu2);

    return true;
}

void TitleScene::nextSceneCallback() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, GameScene::createScene(), Color3B::WHITE));
}

void TitleScene::nextSceneCallback2() {
    Director::getInstance()->replaceScene(TransitionFadeTR::create(1.0f, Game02Scene::createScene()));
}

