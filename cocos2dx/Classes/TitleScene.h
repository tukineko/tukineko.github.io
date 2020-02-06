#ifndef __TitleScene_H__
#define __TitleScene_H__

#include "Config.h"

class TitleScene : public cocos2d::Scene
{
protected:
    
public:
    static cocos2d::Scene* createScene();

    virtual bool init();
    
    CREATE_FUNC(TitleScene);

    void nextSceneCallback();
    void nextSceneCallback2();
    void nextSceneCallback3();
};

#endif // __TitleScene_H__
