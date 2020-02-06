#include "GameScene.h"
#include "SimpleAudioEngine.h"

USING_NS_CC;

Scene* GameScene::createScene()
{
    return GameScene::create();
}

// on "init" you need to initialize your instance
bool GameScene::init()
{
    //////////////////////////////
    // 1. super init first
    if ( !Scene::init() )
    {
        return false;
    }

    this->setupItems();
    

    auto listener = EventListenerTouchOneByOne::create();
    listener->onTouchBegan = CC_CALLBACK_2(GameScene::onTouchBegan, this);
    listener->onTouchEnded = CC_CALLBACK_2(GameScene::onTouchEnded, this);
    listener->onTouchMoved = CC_CALLBACK_2(GameScene::onTouchMoved, this);
    auto dispatcher = Director::getInstance()->getEventDispatcher();
    dispatcher->addEventListenerWithSceneGraphPriority(listener, this);

    return true;
}

void GameScene::setupItems(){
    //30�̉摜����ʏ�̃����_���Ȉʒu�ɕ\�����Ĕz��Ɋi�[
    for (int i = 0; i < 30; i++) {
        auto item = Sprite::create("puzzle1.png");
        int px = rand() % (int)winSizeW;
        int py = rand() % (int)winSizeH;
        item->setPosition(Vec2(px, py));
        this->addChild(item);

        _items.pushBack(item);
    }
}

//�^�b�`�������ɌĂяo�����֐�
bool GameScene::onTouchBegan(cocos2d::Touch* touch, cocos2d::Event* event) {

    return true;
}

//�^�b�`�𗣂������ɌĂяo�����֐�  
void GameScene::onTouchEnded(cocos2d::Touch* touch, cocos2d::Event* event) {
    auto location = touch->getLocation();

    for (int i = 0; i < (int)_items.size(); i++) {
        Sprite* item = _items.at(i);
        Rect spriteRect = Rect(item->getPosition().x - item->getContentSize().width / 2,
            item->getPosition().y - item->getContentSize().width / 2,
            item->getContentSize().width,
            item->getContentSize().height);
        if (spriteRect.containsPoint(location)) {
            item->removeFromParent();
            _items.erase(i);
            i--;
        }
    }
}

//�^�b�`���Ȃ���ړ����ɌĂяo�����֐�
void GameScene::onTouchMoved(cocos2d::Touch* touch, cocos2d::Event* event) {
    
}

