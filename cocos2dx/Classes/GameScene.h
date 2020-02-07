#ifndef __GameScene_H__
#define __GameScene_H__

#include "Config.h"

USING_NS_CC;

class GameScene : public cocos2d::Scene
{
protected:
    
    Vector<Sprite*> _items;

public:
    static cocos2d::Scene* createScene();

    virtual bool init();
    
    void setupItems();

    bool onTouchBegan(cocos2d::Touch* touch, cocos2d::Event* event);
    void onTouchEnded(cocos2d::Touch* touch, cocos2d::Event* event);
    void onTouchMoved(cocos2d::Touch* touch, cocos2d::Event* event);

    // implement the "static create()" method manually
    CREATE_FUNC(GameScene);
};

#endif // __GameScene_H__
