#ifndef __Game02Scene_H__
#define __Game02Scene_H__

#include "cocos2d.h"

USING_NS_CC;

class Game02Scene : public cocos2d::Scene
{
protected:
    int _winSizwW;
    int _winSizeH;
    
    Vector<Sprite*> _items;

public:
    static cocos2d::Scene* createScene();

    virtual bool init();
    
    // implement the "static create()" method manually
    CREATE_FUNC(Game02Scene);

    void update(float frame);

    void spawnItem(float frame);
    
};

#endif // __Game02Scene_H__
