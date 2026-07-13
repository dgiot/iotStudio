
#include <assert.h>
#include <Malloc.h>
#include "psAPISDK.h"

char* PSVARIANT2STRHELP(char* pszVariant, PS_VARIANT *pVariant);
#define PSVARIANT2STR(pVariant) PSVARIANT2STRHELP((char*)alloca(256), pVariant)

char* PSTIME2STR(PS_TIME ptm);

//链接到服务器
void testCase_Server_Connect();
void testCase_Server_Disconnect();
//建立删除需要的测点
void testCase_AddTag();
void testCase_DelTag();

//PS_VARIANT函数测试
void VarTest();
//获取错误描述测试
void GetErrorDescTest();
//链接到服务器等相关函数测试
void ServerTest();
//用户 用户组相关函数测试
void UserTest();
//测点相关函数测试
void TagTest();
//实时函数测试
void RealTest();
//历史函数测试
void HisTest();
//报警测试
void AlarmTest();
//事件测试
void EventTest();

//服务器状态订阅测试
void ServerStatusCallbackTest();
//测点属性订阅测试
void TagSubscribeTest();
//实时值订阅测试
void RealSubscribeTest();
//报警订阅测试
void AlarmSubscribeTest();
//事件订阅测试
void EventSubscribeTest();

extern PSHANDLE g_hServer;
extern PSUINT32 g_TagIds[5];
extern PSBOOL	g_bConnect;
extern char		g_pszServer[64];
extern char		g_pszUserName[64];
extern char		g_pszPassword[64];

void DataSetTest();