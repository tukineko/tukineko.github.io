#include "Game06Layer.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* Game06Layer::createScene()
{
    auto scene = Scene::createWithPhysics();  //物理エンジンのシーンの作成
    auto layer = Game06Layer::create();
    scene->addChild(layer);

    //gravityを変更（現実の場合0,-980）
    PhysicsWorld* world = scene->getPhysicsWorld();
    world->setGravity(Vec2(0, -980));
    //デバック用
    world->setDebugDrawMask(PhysicsWorld::DEBUGDRAW_ALL);

    return scene;
}


// on "init" you need to initialize your instance
bool Game06Layer::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Layer::init() )
    {
        return false;
    }

    auto labelBtnLabel01 = LabelTTF::create("Back to Title", "fonts/Marker Felt.ttf", 24);
    auto labelItem01 = MenuItemLabel::create(labelBtnLabel01, CC_CALLBACK_0(Game06Layer::backTitleCallback, this));
    labelItem01->setPosition(Vec2(winSizeW - 100, 30));
    auto menu = Menu::create(labelItem01, nullptr);
    menu->setPosition(Point::ZERO);
    this->addChild(menu, 100);

    // 物理衝突リスナー
    auto phlistener = EventListenerPhysicsContact::create();
    phlistener->onContactBegin = CC_CALLBACK_1(Game06Layer::onContactBegin, this);
    getEventDispatcher()->addEventListenerWithSceneGraphPriority(phlistener, this);

    //床
    auto wall = Sprite::create();
    wall->setPosition(Vec2(winSizeW / 2, 0));
    wall->setTextureRect(Rect(0, 0, winSizeW * 3, winSizeH / 10));
    wall->setColor(Color3B::BLACK);
    //wall->setRotation(3.0f);//3度の傾斜
    //物理法則の設定
    auto pWall = PhysicsBody::createBox(wall->getContentSize());
    pWall->setDynamic(false);//重力を受けない
    pWall->setRotationEnable(false);//回転運動不可
    wall->setPhysicsBody(pWall);
    this->addChild(wall);
    

    //プレイヤー
    Sprite* character = Sprite::create("puzzle3.png");
    character->setPosition(Vec2(winSizeCenterW, winSizeCenterH));
    auto material = PHYSICSBODY_MATERIAL_DEFAULT;
    material.density = 1.0f; // 密度
    material.restitution = 0.7f; // 反発係数
    material.friction = 0.4f; // 摩擦係数
    PhysicsBody* charaPb = PhysicsBody::createCircle(75, material);
    charaPb->setMass(1.0f); // 重さを指定（ここが無いと後で飛ばせなくなる）
    character->setPhysicsBody(charaPb);
    character->setTag(1);
    this->addChild(character);
    //playerの移動に画面がついていく
    //this->runAction(Follow::create(character));

    //タッチイベント
    auto listener = EventListenerTouchOneByOne::create();
    listener->onTouchBegan = CC_CALLBACK_2(Game06Layer::onTouchBegan, this);
    listener->onTouchEnded = CC_CALLBACK_2(Game06Layer::onTouchEnded, this);
    listener->onTouchMoved = CC_CALLBACK_2(Game06Layer::onTouchMoved, this);
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->addEventListenerWithSceneGraphPriority(listener, this);

    return true;
}

bool Game06Layer::onContactBegin(PhysicsContact& constact)
{
    CCLOG("Hit");

    return true;
}

// 丸(物理エンジン)を作成
Sprite* Game06Layer::addNewCircleAtPosition(Node* parent, Point p, bool dynamic, const char* fileName) {
    Sprite* sprite = Sprite::create(fileName);
    auto material = PHYSICSBODY_MATERIAL_DEFAULT;
    material.density = 1.0f; // 密度
    material.restitution = 0.7f; // 反発係数
    material.friction = 0.4f; // 摩擦係数
    sprite->setPhysicsBody(PhysicsBody::createCircle((sprite->getContentSize().width / 2 - 1), material));
    sprite->getPhysicsBody()->setDynamic(dynamic);
    sprite->setPosition(p);
    parent->addChild(sprite, 10);
    return sprite;
}

// 四角(物理エンジン)を作成
Sprite* Game06Layer::addNewBoxAtPosition(Node* parent, Point p, bool dynamic, const char* fileName) {
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

Rect Game06Layer::getRect(Node* node)
{
    Point point = node->getPosition();
    int width = node->getContentSize().width;
    int height = node->getContentSize().height;
    return Rect(point.x - (width / 2), point.y - (height / 2), width, height);
}

//タッチした時に呼び出される関数
bool Game06Layer::onTouchBegan(Touch* touch, Event* event) {
    Sprite* character = (Sprite*)this->getChildByTag(1);
    Rect characterRect = getRect(character);
    _touchPoint = touch->getLocation();

    CCLOG("x=%.f , y=%.f", _touchPoint.x, _touchPoint.y);
    
    return characterRect.containsPoint(_touchPoint);
}

//タッチを離した時に呼び出される関数  
void Game06Layer::onTouchEnded(Touch* touch, Event* event) {
    Sprite* character = (Sprite*)this->getChildByTag(1);
    Point endPoint = touch->getLocation();
    Vect force = Vect(_touchPoint.x - endPoint.x, _touchPoint.y - endPoint.y) * 4;
    character->getPhysicsBody()->applyImpulse(force);
}

//タッチしながら移動中に呼び出される関数
void Game06Layer::onTouchMoved(Touch* touch, Event* event) {

}

#include "TitleLayer.h"
void Game06Layer::backTitleCallback() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, TitleLayer::createScene(), Color3B::WHITE));
}