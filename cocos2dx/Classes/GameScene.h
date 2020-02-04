#ifndef __GameScene_H__
#define __GameScene_H__

#include "cocos2d.h"

USING_NS_CC;

class GameScene : public cocos2d::Scene
{
protected:
    int _winSizwW;
    int _winSizeH;

    Vector<Sprite*> _items;

public:
    static cocos2d::Scene* createScene();

    virtual bool init();
    
    // implement the "static create()" method manually
    CREATE_FUNC(GameScene);

    void setupItems();

    bool onTouchBegan(cocos2d::Touch* touch, cocos2d::Event* event);
    void onTouchEnded(cocos2d::Touch* touch, cocos2d::Event* event);
    void onTouchMoved(cocos2d::Touch* touch, cocos2d::Event* event);
};

#endif // __GameScene_H__
