#ifndef __Game06Layer_H__
#define __Game06Layer_H__

#include "Config.h"

USING_NS_CC;

class Game06Layer : public Layer
{
private:
    
protected:
    Point _touchPoint;
    
public:
    static Scene* createScene();
    CREATE_FUNC(Game06Layer);
    virtual bool init();

    bool onContactBegin(PhysicsContact& constact);

    Rect getRect(Node* node);

    Sprite* addNewCircleAtPosition(Node* parent, Point p, bool dynamic, const char* fileName);
    Sprite* addNewBoxAtPosition(Node* parent, Point p, bool dynamic, const char* fileName);

    bool onTouchBegan(Touch* touch, Event* event);
    void onTouchEnded(Touch* touch, Event* event);
    void onTouchMoved(Touch* touch, Event* event);

    void backTitleCallback();
};

#endif // __Game06Layer_H__
