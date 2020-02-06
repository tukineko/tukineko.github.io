#ifndef __Config_H__
#define __Config_H__

#include "cocos2d.h"

#define VisibleSize Director::getInstance()->getVisibleSize()
#define winSizeW VisibleSize.width
#define winSizeH VisibleSize.height
#define winSizeCenterW winSizeW / 2
#define winSizeCenterH winSizeH / 2

enum kBlock {
    kBlockRed,
    kBlockBlue,
    kBlockYellow,
    kBlockGreen,
    kBlockGray,
    kBlockCount
};

enum kStatus {
    kStatusNormal,
    kStatusMarked,
    kStatusSwept
};


#endif // __Config_H__