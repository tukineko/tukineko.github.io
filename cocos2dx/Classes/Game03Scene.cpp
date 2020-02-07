#include "Game03Scene.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* Game03Scene::createScene()
{
    //return Game03Scene::create();
    auto scene = Scene::createWithPhysics();  //物理エンジンのシーンの作成
    auto layer = Game03Scene::create();
    scene->addChild(layer);

    //gravityを変更（現実の場合0,-980）
    PhysicsWorld* world = scene->getPhysicsWorld();
    world->setGravity(Vec2(0, -980));

    return scene;
}


// on "init" you need to initialize your instance
bool Game03Scene::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Layer::init() )
    {
        return false;
    }

    // 物理衝突リスナー
    auto phlistener = EventListenerPhysicsContact::create();
    phlistener->onContactBegin = CC_CALLBACK_1(Game03Scene::onContactBegin, this);
    getEventDispatcher()->addEventListenerWithSceneGraphPriority(phlistener, this);

    //床
    auto floor = this->addNewBoxAtPosition(this, Point(winSizeCenterW, 50), false, "floor.png");

    //タッチイベント
    auto listener = EventListenerTouchOneByOne::create();
    listener->onTouchBegan = CC_CALLBACK_2(Game03Scene::onTouchBegan, this);
    listener->onTouchEnded = CC_CALLBACK_2(Game03Scene::onTouchEnded, this);
    listener->onTouchMoved = CC_CALLBACK_2(Game03Scene::onTouchMoved, this);
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->addEventListenerWithSceneGraphPriority(listener, this);

    return true;
}

bool Game03Scene::onContactBegin(PhysicsContact& constact)
{
    CCLOG("Hit");

    return true;
}

// 丸(物理エンジン)を作成
Sprite* Game03Scene::addNewCircleAtPosition(Node* parent, Point p, bool dynamic, const char* fileName) {
    CCLOG("-------addNewCircleAtPosition--------");
    Sprite* sprite = Sprite::create(fileName);
    auto material = PHYSICSBODY_MATERIAL_DEFAULT;
    material.density = 1.0f; // 密度
    material.restitution = 1.0f; // 反発係数
    material.friction = 0.4f; // 摩擦係数
    sprite->setPhysicsBody(PhysicsBody::createCircle((sprite->getContentSize().width / 2 - 1), material));
    sprite->getPhysicsBody()->setDynamic(dynamic);
    sprite->setPosition(p);
    parent->addChild(sprite, 10);
    return sprite;
}

// 四角(物理エンジン)を作成
Sprite* Game03Scene::addNewBoxAtPosition(Node* parent, Point p, bool dynamic, const char* fileName) {
    Sprite* sprite = Sprite::create(fileName);
    auto material = PHYSICSBODY_MATERIAL_DEFAULT;
    material.density = 1.0f; // 密度
    material.restitution = 0.7f; // 反発係数
    material.friction = 0.0f; // 摩擦係数
    sprite->setPhysicsBody(PhysicsBody::createBox(sprite->getContentSize(), material));
    sprite->getPhysicsBody()->setDynamic(dynamic);
    sprite->setPosition(p);
    parent->addChild(sprite, 10);
    return sprite;
}

//タッチした時に呼び出される関数
bool Game03Scene::onTouchBegan(Touch* touch, Event* event) {
    auto location = touch->getLocation();
    CCLOG("-------onTouchBegan--------");
    
    auto ball = this->addNewCircleAtPosition(this, Point(location), true, "puzzle2.png");

    return true;
}

//タッチを離した時に呼び出される関数  
void Game03Scene::onTouchEnded(Touch* touch, Event* event) {

}

//タッチしながら移動中に呼び出される関数
void Game03Scene::onTouchMoved(Touch* touch, Event* event) {

}
