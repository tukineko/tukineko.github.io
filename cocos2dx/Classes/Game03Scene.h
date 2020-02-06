#ifndef __Game03Scene_H__
#define __Game03Scene_H__

#include "Config.h"

#include "BlockSprite.h"

class Game03Scene : public cocos2d::Scene
{
protected:
    int _speed = 10;
    int _degree = 180;

    Vector<Sprite*> _balls;

public:
    static cocos2d::Scene* createScene();

    virtual bool init();
    
    // implement the "static create()" method manually
    CREATE_FUNC(Game03Scene);

    void update(float frame);

    void spawnBall();
};

#endif // __Game03Scene_H__
