#include "HelloWorldScene.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* HelloWorld::createScene()
{
    return HelloWorld::create();
}

// on "init" you need to initialize your instance
bool HelloWorld::init()
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
    
    _puzzle1 = Sprite::create("puzzle1.png");
    _puzzle1->setPosition(Vec2(_winSizwW / 1.20, _winSizeH / 3));
    this->addChild(_puzzle1);

    _muki = 0;

    /*_puzzle2 = Sprite::create("puzzle2.png");
    _puzzle2->setPosition(Vec2(_winSizwW / 5, _winSizeH / 2));
    this->addChild(_puzzle2);

    _puzzle3 = Sprite::create("puzzle3.png");
    _puzzle3->setPosition(Vec2(_winSizwW / 1.25, _winSizeH / 2));
    this->addChild(_puzzle3);*/

    //sprite->runAction(MoveTo::create(1.0f, Point(100, 200)));
    

    auto listener = EventListenerTouchOneByOne::create();
    listener->onTouchBegan = CC_CALLBACK_2(HelloWorld::onTouchBegan, this);
    listener->onTouchEnded = CC_CALLBACK_2(HelloWorld::onTouchEnded, this);
    listener->onTouchMoved = CC_CALLBACK_2(HelloWorld::onTouchMoved, this);
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->addEventListenerWithSceneGraphPriority(listener, this);

    this->scheduleUpdate();

    //this->schedule(schedule_selector(HelloWorld::spawnChara), 1.5f);

    return true;
}

void HelloWorld::Action01(float frame)
{
    // �傫���i�k���j�A�N�V������K�p 1.0�b 0�{
    auto scaleTo1 = ScaleTo::create(1.0f, 0.0f);

    //callback�ł̏�������
    auto removeSprite1 = CallFunc::create([this]() {
        this->removeChild(_puzzle1);
    });

    // �k���A�����A�N�V������K�p
    auto sequence1 = Sequence::create(scaleTo1, removeSprite1, NULL);

    // �k���A����run�A�N�V������K�p
    _puzzle1->runAction(sequence1);

}

void HelloWorld::spawnChara(float frame)
{
    auto puzzle = Sprite::create("puzzle2.png");
    puzzle->setPosition(Vec2(0, _winSizeH / 2));
    this->addChild(puzzle, 2);

    auto ac = Sequence::create(
        MoveBy::create(4.0f, Vec2(_winSizwW / 1.25, 0)),
        Repeat::create(Sequence::create(MoveBy::create(0.0625f, Vec2(10, 0)),
        MoveBy::create(0.125f, Vec2(-20, 0)),
        MoveBy::create(0.0625f, Vec2(10, 0)),
        nullptr),
        6),
        Spawn::create(JumpBy::create(1.0f, Vec2(140, -200), 140, 1),
            FadeTo::create(1.0f, 0),
            nullptr),
        RemoveSelf::create(),
        nullptr);
    
    puzzle->runAction(ac);
}

void HelloWorld::update(float frame) {
    if (_puzzle1->getPositionX() < 300) {
        _muki = 1;
    }
    else if (_puzzle1->getPositionX() > _winSizwW / 1.20) {
        _muki = 0;
    }

    if (_muki == 0) {
        _puzzle1->setPosition(Vec2(_puzzle1->getPositionX() - 200 * frame, _puzzle1->getPositionY()));
    }
    else {
        _puzzle1->setPosition(Vec2(_puzzle1->getPositionX() + 200 * frame, _puzzle1->getPositionY()));
    }
}

//�^�b�`�������ɌĂяo�����֐�
bool HelloWorld::onTouchBegan(cocos2d::Touch* touch, cocos2d::Event* event) {

    //�ʒu���擾
    auto pos = touch->getLocation();

    //���W��\��
    CCLOG("x=%.f , y=%.f", pos.x, pos.y);

    return true;
}

//�^�b�`�𗣂������ɌĂяo�����֐�  
void HelloWorld::onTouchEnded(cocos2d::Touch* touch, cocos2d::Event* event) {
    //�^�b�`�������ꏊ�̈ʒu�����擾
    auto location = touch->getLocation();

    //�I�u�W�F�N�g�Ɏ��s������
    //_puzzle1->runAction(MoveTo::create(1.0f, location));
}

//�^�b�`���Ȃ���ړ����ɌĂяo�����֐�
void HelloWorld::onTouchMoved(cocos2d::Touch* touch, cocos2d::Event* event) {
    
}

