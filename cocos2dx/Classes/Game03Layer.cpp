#include "Game03Layer.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* Game03Layer::createScene()
{
    auto scene = Scene::createWithPhysics();  //物理エンジンのシーンの作成
    auto layer = Game03Layer::create();
    scene->addChild(layer);

    //gravityを変更（現実の場合0,-980）
    PhysicsWorld* world = scene->getPhysicsWorld();
    world->setGravity(Vec2(0, -980));

    return scene;
}


// on "init" you need to initialize your instance
bool Game03Layer::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Layer::init() )
    {
        return false;
    }

    auto labelBtnLabel01 = LabelTTF::create("Back to Title", "fonts/Marker Felt.ttf", 24);
    auto labelItem01 = MenuItemLabel::create(labelBtnLabel01, CC_CALLBACK_0(Game03Layer::backTitleCallback, this));
    labelItem01->setPosition(Vec2(winSizeW - 100, 30));
    auto menu = Menu::create(labelItem01, nullptr);
    menu->setPosition(Point::ZERO);
    this->addChild(menu, 100);

    // 物理衝突リスナー
    auto phlistener = EventListenerPhysicsContact::create();
    phlistener->onContactBegin = CC_CALLBACK_1(Game03Layer::onContactBegin, this);
    getEventDispatcher()->addEventListenerWithSceneGraphPriority(phlistener, this);

    //床
    auto floor = this->addNewBoxAtPosition(this, Point(winSizeCenterW, 50), false, "floor.png");

    //タッチイベント
    auto listener = EventListenerTouchOneByOne::create();
    listener->onTouchBegan = CC_CALLBACK_2(Game03Layer::onTouchBegan, this);
    listener->onTouchEnded = CC_CALLBACK_2(Game03Layer::onTouchEnded, this);
    listener->onTouchMoved = CC_CALLBACK_2(Game03Layer::onTouchMoved, this);
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->addEventListenerWithSceneGraphPriority(listener, this);

    return true;
}

bool Game03Layer::onContactBegin(PhysicsContact& constact)
{
    CCLOG("Hit");

    return true;
}

// 丸(物理エンジン)を作成
Sprite* Game03Layer::addNewCircleAtPosition(Node* parent, Point p, bool dynamic, const char* fileName) {
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
Sprite* Game03Layer::addNewBoxAtPosition(Node* parent, Point p, bool dynamic, const char* fileName) {
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
bool Game03Layer::onTouchBegan(Touch* touch, Event* event) {
    auto location = touch->getLocation();
    CCLOG("-------onTouchBegan--------");
    
    int rand = random(0, 5);

    switch (rand) {
        case 0:
            this->addNewCircleAtPosition(this, Point(location), true, "puzzle1.png");
            break;

        case 1:
            this->addNewCircleAtPosition(this, Point(location), true, "puzzle2.png");
            break;

        case 2:
            this->addNewCircleAtPosition(this, Point(location), true, "puzzle3.png");
            break;

        case 3:
            this->addNewCircleAtPosition(this, Point(location), true, "puzzle4.png");
            break;

        case 4:
            this->addNewCircleAtPosition(this, Point(location), true, "puzzle5.png");
            break;

        case 5:
            this->addNewCircleAtPosition(this, Point(location), true, "puzzle6.png");
            break;

        default:
            break;
    }

    return true;
}

//タッチを離した時に呼び出される関数  
void Game03Layer::onTouchEnded(Touch* touch, Event* event) {

}

//タッチしながら移動中に呼び出される関数
void Game03Layer::onTouchMoved(Touch* touch, Event* event) {

}

#include "TitleLayer.h"
void Game03Layer::backTitleCallback() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, TitleLayer::createScene(), Color3B::WHITE));
}