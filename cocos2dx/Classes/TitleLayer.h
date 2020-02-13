#ifndef __TitleLayer_H__
#define __TitleLayer_H__

#include "Config.h"

USING_NS_CC;

class TitleLayer : public Layer
{
protected:
    
public:
    static Scene* createScene();
    virtual bool init();
    CREATE_FUNC(TitleLayer);

    void nextSceneCallback();
    void nextSceneCallback2();
    void nextSceneCallback3();
    void nextSceneCallback4();
    void nextSceneCallback5();
    void nextSceneCallback6();
    void nextSceneCallback7();
};

#endif // __TitleLayer_H__
