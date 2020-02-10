#ifndef __Game03Layer_H__
#define __Game03Layer_H__

#include "Config.h"

USING_NS_CC;

class Game03Layer : public Layer
{
private:
    
protected:
    
public:
    static Scene* createScene();
    CREATE_FUNC(Game03Layer);
    virtual bool init();

    bool onContactBegin(PhysicsContact& constact);

    Sprite* addNewCircleAtPosition(Node* parent, Point p, bool dynamic, const char* fileName);
    Sprite* addNewBoxAtPosition(Node* parent, Point p, bool dynamic, const char* fileName);

    bool onTouchBegan(Touch* touch, Event* event);
    void onTouchEnded(Touch* touch, Event* event);
    void onTouchMoved(Touch* touch, Event* event);

    void backTitleCallback();
};

#endif // __Game03Layer_H__
