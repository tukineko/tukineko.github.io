#ifndef __Game02Scene_H__
#define __Game02Scene_H__

#include "Config.h"

#define Chara1Pos Vec2(200, 200)
#define Chara1UdePos Vec2(300, 300)
#define Chara2Pos Vec2(1166, 200)
#define Chara2UdePos Vec2(1066, 300)
#define ItemPos Vec2(1166, 300)

USING_NS_CC;

class Game02Scene : public cocos2d::Scene
{
protected:
    
    //ÉQÅ[ÉÄÇÃèÛë‘
    int _game_state;

    int _ball_status = 0; //0ÅFìGçUåÇ
    int _score = 0;

    Sprite* _ude1;
    Sprite* _ude2;
    Sprite* _ball;

    Vector<Sprite*> _items;


public:
    static cocos2d::Scene* createScene();

    virtual bool init();
    
    // implement the "static create()" method manually
    CREATE_FUNC(Game02Scene);

    virtual void onEnterTransitionDidFinish();
    void update(float frame);

    void GameStart();
    void GameOver();

    void ViewScore();
    void drawChara1();
    void drawChara2();
    void spawnBall();


    bool onTouchBegan(cocos2d::Touch* touch, cocos2d::Event* event);
    void onTouchEnded(cocos2d::Touch* touch, cocos2d::Event* event);
    void onTouchMoved(cocos2d::Touch* touch, cocos2d::Event* event);

    void nextSceneCallback();
};

#endif // __Game02Scene_H__
