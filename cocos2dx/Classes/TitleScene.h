#ifndef __TitleScene_H__
#define __TitleScene_H__

#include "cocos2d.h"

class TitleScene : public cocos2d::Scene
{
protected:
    int _winSizwW;
    int _winSizeH;

public:
    static cocos2d::Scene* createScene();

    virtual bool init();
    
    CREATE_FUNC(TitleScene);

    void nextSceneCallback();
    void nextSceneCallback2();
};

#endif // __TitleScene_H__
