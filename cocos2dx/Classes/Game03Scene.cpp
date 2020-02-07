#include "Game03Scene.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* Game03Scene::createScene()
{
    //return Game03Scene::create();
    auto scene = Scene::createWithPhysics();  //�����G���W���̃V�[���̍쐬
    auto layer = Game03Scene::create();
    scene->addChild(layer);

    //gravity��ύX�i�����̏ꍇ0,-980�j
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

    // �����Փ˃��X�i�[
    auto phlistener = EventListenerPhysicsContact::create();
    phlistener->onContactBegin = CC_CALLBACK_1(Game03Scene::onContactBegin, this);
    getEventDispatcher()->addEventListenerWithSceneGraphPriority(phlistener, this);

    //��
    auto floor = this->addNewBoxAtPosition(this, Point(winSizeCenterW, 50), false, "floor.png");

    //�^�b�`�C�x���g
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

// ��(�����G���W��)���쐬
Sprite* Game03Scene::addNewCircleAtPosition(Node* parent, Point p, bool dynamic, const char* fileName) {
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
Sprite* Game03Scene::addNewBoxAtPosition(Node* parent, Point p, bool dynamic, const char* fileName) {
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
bool Game03Scene::onTouchBegan(Touch* touch, Event* event) {
    auto location = touch->getLocation();
    CCLOG("-------onTouchBegan--------");
    
    auto ball = this->addNewCircleAtPosition(this, Point(location), true, "puzzle2.png");

    return true;
}

//�^�b�`�𗣂������ɌĂяo�����֐�  
void Game03Scene::onTouchEnded(Touch* touch, Event* event) {

}

//�^�b�`���Ȃ���ړ����ɌĂяo�����֐�
void Game03Scene::onTouchMoved(Touch* touch, Event* event) {

}
