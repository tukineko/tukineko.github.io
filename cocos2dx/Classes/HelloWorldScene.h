#ifndef __HELLOWORLD_SCENE_H__
#define __HELLOWORLD_SCENE_H__

#include "cocos2d.h"

USING_NS_CC;

class HelloWorld : public cocos2d::Scene
{
protected:
    int _winSizwW;
    int _winSizeH;
    int _muki;

    Sprite* _puzzle1;
    Sprite* _puzzle2;
    Sprite* _puzzle3;

    Vector<Sprite*> _items;

public:
    static cocos2d::Scene* createScene();

    virtual bool init();
    

    // implement the "static create()" method manually
    CREATE_FUNC(HelloWorld);

    void update(float frame);

    void Action01(float frame);

    void spawnChara(float frame);

    bool onTouchBegan(cocos2d::Touch* touch, cocos2d::Event* event);
    void onTouchEnded(cocos2d::Touch* touch, cocos2d::Event* event);
    void onTouchMoved(cocos2d::Touch* touch, cocos2d::Event* event);
};

#endif // __HELLOWORLD_SCENE_H__
