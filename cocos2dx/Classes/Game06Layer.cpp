#include "Game06Layer.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* Game06Layer::createScene()
{
    auto scene = Scene::createWithPhysics();  //�����G���W���̃V�[���̍쐬
    auto layer = Game06Layer::create();
    scene->addChild(layer);

    //gravity��ύX�i�����̏ꍇ0,-980�j
    PhysicsWorld* world = scene->getPhysicsWorld();
    world->setGravity(Vec2(0, -980));
    //�f�o�b�N�p
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

    // �����Փ˃��X�i�[
    auto phlistener = EventListenerPhysicsContact::create();
    phlistener->onContactBegin = CC_CALLBACK_1(Game06Layer::onContactBegin, this);
    getEventDispatcher()->addEventListenerWithSceneGraphPriority(phlistener, this);

    //��
    auto wall = Sprite::create();
    wall->setPosition(Vec2(winSizeW / 2, 0));
    wall->setTextureRect(Rect(0, 0, winSizeW * 3, winSizeH / 10));
    wall->setColor(Color3B::BLACK);
    //wall->setRotation(3.0f);//3�x�̌X��
    //�����@���̐ݒ�
    auto pWall = PhysicsBody::createBox(wall->getContentSize());
    pWall->setDynamic(false);//�d�͂��󂯂Ȃ�
    pWall->setRotationEnable(false);//��]�^���s��
    wall->setPhysicsBody(pWall);
    this->addChild(wall);
    

    //�v���C���[
    Sprite* character = Sprite::create("puzzle3.png");
    character->setPosition(Vec2(winSizeCenterW, winSizeCenterH));
    auto material = PHYSICSBODY_MATERIAL_DEFAULT;
    material.density = 1.0f; // ���x
    material.restitution = 0.7f; // �����W��
    material.friction = 0.4f; // ���C�W��
    PhysicsBody* charaPb = PhysicsBody::createCircle(75, material);
    charaPb->setMass(1.0f); // �d�����w��i�����������ƌ�Ŕ�΂��Ȃ��Ȃ�j
    character->setPhysicsBody(charaPb);
    character->setTag(1);
    this->addChild(character);
    //player�̈ړ��ɉ�ʂ����Ă���
    //this->runAction(Follow::create(character));

    //�^�b�`�C�x���g
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

// ��(�����G���W��)���쐬
Sprite* Game06Layer::addNewCircleAtPosition(Node* parent, Point p, bool dynamic, const char* fileName) {
    Sprite* sprite = Sprite::create(fileName);
    auto material = PHYSICSBODY_MATERIAL_DEFAULT;
    material.density = 1.0f; // ���x
    material.restitution = 0.7f; // �����W��
    material.friction = 0.4f; // ���C�W��
    sprite->setPhysicsBody(PhysicsBody::createCircle((sprite->getContentSize().width / 2 - 1), material));
    sprite->getPhysicsBody()->setDynamic(dynamic);
    sprite->setPosition(p);
    parent->addChild(sprite, 10);
    return sprite;
}

// �l�p(�����G���W��)���쐬
Sprite* Game06Layer::addNewBoxAtPosition(Node* parent, Point p, bool dynamic, const char* fileName) {
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

Rect Game06Layer::getRect(Node* node)
{
    Point point = node->getPosition();
    int width = node->getContentSize().width;
    int height = node->getContentSize().height;
    return Rect(point.x - (width / 2), point.y - (height / 2), width, height);
}

//�^�b�`�������ɌĂяo�����֐�
bool Game06Layer::onTouchBegan(Touch* touch, Event* event) {
    Sprite* character = (Sprite*)this->getChildByTag(1);
    Rect characterRect = getRect(character);
    _touchPoint = touch->getLocation();

    CCLOG("x=%.f , y=%.f", _touchPoint.x, _touchPoint.y);
    
    return characterRect.containsPoint(_touchPoint);
}

//�^�b�`�𗣂������ɌĂяo�����֐�  
void Game06Layer::onTouchEnded(Touch* touch, Event* event) {
    Sprite* character = (Sprite*)this->getChildByTag(1);
    Point endPoint = touch->getLocation();
    Vect force = Vect(_touchPoint.x - endPoint.x, _touchPoint.y - endPoint.y) * 4;
    character->getPhysicsBody()->applyImpulse(force);
}

//�^�b�`���Ȃ���ړ����ɌĂяo�����֐�
void Game06Layer::onTouchMoved(Touch* touch, Event* event) {

}

#include "TitleLayer.h"
void Game06Layer::backTitleCallback() {
    Director::getInstance()->replaceScene(TransitionFade::create(1.0f, TitleLayer::createScene(), Color3B::WHITE));
}