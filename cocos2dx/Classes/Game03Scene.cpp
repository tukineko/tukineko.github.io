#include "Game03Scene.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* Game03Scene::createScene()
{
    return Game03Scene::create();
}

// on "init" you need to initialize your instance
bool Game03Scene::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Scene::init() )
    {
        return false;
    }

    this->spawnBall();
    
    this->scheduleUpdate();
    
    return true;
}

void Game03Scene::update(float frame) {
    
    
    
}

void Game03Scene::spawnBall()
{
    BlockSprite* block = BlockSprite::create(1, kBlockRed, kStatusNormal);
    block->setPosition(Vec2(winSizeCenterW, winSizeCenterH));
    this->addChild(block, 0, 1);
}
