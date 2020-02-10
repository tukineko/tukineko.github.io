#ifndef __Game01Layer_H__
#define __Game01Layer_H__

#include "Config.h"

USING_NS_CC;

class Game01Layer : public Layer
{
protected:
    Vector<Sprite*> _items;

public:
    static Scene* createScene();
    virtual bool init();
    CREATE_FUNC(Game01Layer);
    
    void setupItems();

    bool onTouchBegan(Touch* touch, Event* event);
    void onTouchEnded(Touch* touch, Event* event);
    void onTouchMoved(Touch* touch, Event* event);

    void backTitleCallback();
};

#endif // __Game01Layer_H__
