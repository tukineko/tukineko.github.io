#include "Game03Layer.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* Game03Layer::createScene()
{
    auto scene = Scene::createWithPhysics();  //�����G���W���̃V�[���̍쐬
    auto layer = Game03Layer::create();
    scene->addChild(layer);

    //gravity��ύX�i�����̏ꍇ0,-980�j
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

    // �����Փ˃��X�i�[
    auto phlistener = EventListenerPhysicsContact::create();
    phlistener->onContactBegin = CC_CALLBACK_1(Game03Layer::onContactBegin, this);
    getEventDispatcher()->addEventListenerWithSceneGraphPriority(phlistener, this);

    //��
    auto floor = this->addNewBoxAtPosition(this, Point(winSizeCenterW, 50), false, "floor.png");

    //�^�b�`�C�x���g
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

// ��(�����G���W��)���쐬
Sprite* Game03Layer::addNewCircleAtPosition(Node* parent, Point p, bool dynamic, const char* fileName) {
    CCLOG("-------addNewCircleAtPosition--------");
    Sprite* sprite = Sprite::create(fileName);
    auto material = PHYSICSBODY_MATERIAL_DEFAULT;
    material.density = 1.0f; // ���x
    material.restitution = 1.0f; // �����W��
    material.friction = 0.4f; // ���C�W��
    sprite->setPhysicsBody(PhysicsBody::createCircle((sprite->getContentSize().width / 2 - 1), material));
    sprite->getPhysicsBody()->setDynamic(dynamic);
    sprite->setPosition(p);
    parent->addChild(sprite, 10);
    return sprite;
}

// �l�p(�����G���W��)���쐬
Sprite* Game03Layer::addNewBoxAtPosition(Node* parent, Point p, bool dynamic, const char* fileName) {
    Sprite* sprite = Sprite::create(fileName);
    auto material = PHYSICSBODY_MATERIAL_DEFAULT;
    material.density = 1.0f; // ���x
    material.restitution = 0.7f; // �����W��
    material.friction = 0.0f; // ���C�W��
    sprite->setPhysicsBody(PhysicsBody::createBox(sprite->getContentSize(), material));
    sprite->getPhysicsBody()->setDynamic(dynamic);
    sprite->setPosition(p);
    parent->addChild(sprite, 10);
    return sprite;
}

//�^�b�`�������ɌĂяo�����֐�
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

//�^�b�`�𗣂������ɌĂяo�����֐�  
void Game03Layer::onTouchEnded(Touch* touch, Event* event) {

}

//�^�b�`���Ȃ���ړ����ɌĂяo�����֐�
void Game03Layer::onTouchMoved(Touch* touch, Event* event) {

}

#include "TitleLayer.h"
void Game03Layer::backTitleCallback() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, TitleLayer::createScene(), Color3B::WHITE));
}