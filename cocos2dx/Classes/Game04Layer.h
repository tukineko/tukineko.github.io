#ifndef __Game04Layer_H__
#define __Game04Layer_H__

#include "Config.h"

USING_NS_CC;

class Game04Layer : public Layer
{
protected:
    Node* _moveNode;
    float _prevAngle;

public:
    static Scene* createScene();
    virtual bool init();
    CREATE_FUNC(Game04Layer);

    bool onTouchBegan(Touch* touch, Event* event);
    void onTouchEnded(Touch* touch, Event* event);
    void onTouchMoved(Touch* touch, Event* event);

    void backTitleCallback();
};

#endif // __Game04Layer_H__
