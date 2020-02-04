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

    auto visibleSize = Director::getInstance()->getVisibleSize();
    _winSizwW = visibleSize.width;
    _winSizeH = visibleSize.height;
    
    this->scheduleUpdate();
    this->schedule(schedule_selector(Game02Scene::spawnItem), 1.5f);

    return true;
}

void Game02Scene::update(float frame) {
    
}

void Game02Scene::spawnItem(float frame)
{
    auto item = Sprite::create("puzzle2.png");
    item->setPosition(Vec2(_winSizwW, _winSizeH / 3));
    this->addChild(item);
    _items.pushBack(item);

    // ベジエ曲線に乗っ取ってアニメーションさせる
    ccBezierConfig config{};
    config.controlPoint_1 = Vec2(_winSizwW, _winSizeH / 3);
    config.controlPoint_2 = Vec2(_winSizwW / 2, _winSizeH);
    config.endPosition = Vec2(0, _winSizeH / 3);

    auto ac = Sequence::create(
        BezierTo::create(3.f, config),
        RemoveSelf::create(),
        nullptr);

    item->runAction(ac);
}

