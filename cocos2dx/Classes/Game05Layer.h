#ifndef __Game05Layer_H__
#define __Game05Layer_H__

#include "Config.h"

USING_NS_CC;

class Game05Layer : public Layer
{
protected:
    
public:
    static Scene* createScene();
    virtual bool init();
    CREATE_FUNC(Game05Layer);

    bool onTouchBegan(Touch* touch, Event* event);
    void onTouchEnded(Touch* touch, Event* event);
    void onTouchMoved(Touch* touch, Event* event);

    void backTitleCallback();
};

#endif // __Game05Layer_H__
