#include "Game07Layer.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* Game07Layer::createScene()
{
    Scene* scene = Scene::create();
    Game07Layer* layer = Game07Layer::create();
    scene->addChild(layer);
    return scene;
}


// on "init" you need to initialize your instance
bool Game07Layer::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Layer::init() )
    {
        return false;
    }

    
    return true;
}
