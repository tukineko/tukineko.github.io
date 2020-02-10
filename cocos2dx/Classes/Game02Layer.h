#ifndef __Game02Layer_H__
#define __Game02Layer_H__

#include "Config.h"

#define Chara1Pos Vec2(200, 200)
#define Chara1UdePos Vec2(300, 300)
#define Chara2Pos Vec2(1166, 200)
#define Chara2UdePos Vec2(1066, 300)
#define ItemPos Vec2(1166, 300)

USING_NS_CC;

class Game02Layer : public Layer
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
    static Scene* createScene();
    virtual bool init();
    CREATE_FUNC(Game02Layer);

    virtual void onEnterTransitionDidFinish();
    void update(float frame);

    void GameStart();
    void GameOver();

    void ViewScore();
    void drawChara1();
    void drawChara2();
    void spawnBall();


    bool onTouchBegan(Touch* touch, Event* event);
    void onTouchEnded(Touch* touch, Event* event);
    void onTouchMoved(Touch* touch, Event* event);

    void nextSceneCallback();
    void backTitleCallback();
};

#endif // __Game02Layer_H__
