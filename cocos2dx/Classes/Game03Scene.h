#ifndef __Game03Scene_H__
#define __Game03Scene_H__

#include "Config.h"

USING_NS_CC;

class Game03Scene : public Layer
{
private:
    
protected:
    
public:
    static Scene* createScene();
    CREATE_FUNC(Game03Scene);
    virtual bool init();

    bool onContactBegin(PhysicsContact& constact);

    Sprite* addNewCircleAtPosition(Node* parent, Point p, bool dynamic, const char* fileName);
    Sprite* addNewBoxAtPosition(Node* parent, Point p, bool dynamic, const char* fileName);

    bool onTouchBegan(cocos2d::Touch* touch, cocos2d::Event* event);
    void onTouchEnded(cocos2d::Touch* touch, cocos2d::Event* event);
    void onTouchMoved(cocos2d::Touch* touch, cocos2d::Event* event);
};

#endif // __Game03Scene_H__
