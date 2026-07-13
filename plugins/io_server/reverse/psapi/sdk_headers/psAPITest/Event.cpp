#include "../psAPISDK.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "psAPITest.h"

void testCase_Event_Add()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_EVENT_FIELD fieldTemp = {PSFALSE, PSFALSE, PSFALSE, PSTRUE, PSTRUE, PSTRUE, PSTRUE};
	PS_EVENT eventTemp = {0};
	eventTemp.EventTopic = PS_EVENT_TOPIC_SECURITY;
	eventTemp.Level = PS_EVENT_LEVEL_FATAL;
	eventTemp.TagId = 0;
	eventTemp.EventString = (PSSTR)"你完了";
	nRet = psAPI_Event_Add(g_hServer, fieldTemp, &eventTemp);
	if ( PSERR(nRet) )
	{
		printf("增加事件失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("增加事件成功\n");
	}
}

void testCase_Event_Query()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_EVENT_FILTER_FIELD filterField = {0};
	PS_EVENT_FILTER filter = {0};
	PSUINT32 nEventCount = 0;
	PS_EVENT *pEvents = PSNULL;
	PSUINT32 n = 0;
	filterField.EventTopic = PSTRUE;
	filter.EventTopic = PS_EVENT_TOPIC_COMMUNICATION;
	filterField.StartTime = PSTRUE;
	filter.StartTime.Second = time(NULL) - 3600;
	nRet = psAPI_Event_Query(g_hServer, &filterField, &filter, &nEventCount, &pEvents);
	if ( PSERR(nRet) )
	{
		printf("查询最近1个小时的连接事件 失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("查询最近1个小时的连接事件成功 返回数量%u\n", nEventCount);
	for(n = 0; n < nEventCount; n++)
	{
		printf("\t时间:%s ID:%u UserID:%d TagId:%u EventTopic:%u Level:%u\n", PSTIME2STR(pEvents[n].Time),
			pEvents[n].Id, pEvents[n].UserID, pEvents[n].TagId, pEvents[n].EventTopic, pEvents[n].Level);
		printf("\t\t事件描述:%s\n", pEvents[n].EventString);
	}
	psAPI_Memory_FreeEventList(&pEvents, nEventCount);
}

PSVOID PSAPI Event_QueryAsynComplete(
	PSIN PSHANDLE hServer,
	PSIN PSVOID *pUserPara,
	PSIN PSUINT32 nEventCount,
	PSIN PS_EVENT *pEvents,
	PSIN PSAPIStatus nRet
	)
{
	PSUINT32 n = 0;
	if ( PSERR(nRet) )
	{
		printf("查询最近1个小时的配置相关事件 失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("查询最近1个小时的配置相关事件成功 返回数量%u\n", nEventCount);
	for(n = 0; n < nEventCount; n++)
	{
		printf("\t时间:%s ID:%u UserID:%d TagId:%u EventTopic:%u Level:%u\n", PSTIME2STR(pEvents[n].Time),
			pEvents[n].Id, pEvents[n].UserID, pEvents[n].TagId, pEvents[n].EventTopic, pEvents[n].Level);
		printf("\t\t事件描述:%s\n", pEvents[n].EventString);
	}
}

void testCase_Event_QueryAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_EVENT_FILTER_FIELD filterField = {0};
	PS_EVENT_FILTER filter = {0};
	filterField.EventTopic = PSTRUE;
	filter.EventTopic = PS_EVENT_TOPIC_CONFIGURE;
	filterField.StartTime = PSTRUE;
	filter.StartTime.Second = time(NULL) - 3600;
	nRet = psAPI_Event_QueryAsyn(g_hServer, &filterField, &filter, Event_QueryAsynComplete, PSNULL);
	if ( PSERR(nRet) )
	{
		printf("查询最近1个小时的配置相关事件 失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
}

void PSAPI Event_CallbackFunction(
							PSIN PSHANDLE hServer,
							PSIN PSUINT32 nSubscribeId,
							PSIN PSVOID *pUserPara,
							PSIN PS_EVENT *pEvent)
{
	printf("订阅事件返回,订阅ID%u", nSubscribeId);
	printf("\t时间:%s ID:%u UserID:%d TagId:%u EventTopic:%u Level:%u\n", PSTIME2STR(pEvent->Time),
		pEvent->Id, pEvent->UserID, pEvent->TagId, pEvent->EventTopic, pEvent->Level);
	printf("\t\t事件描述:%s\n", pEvent->EventString);
}

PSUINT32 testCase_Event_NewSubscribe()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nEventTopic = PS_EVENT_TOPIC_SECURITY;
	PSUINT32 nSubscribeId = 0;
	nRet = psAPI_Event_NewSubscribe(g_hServer, PSNULL, &nEventTopic, PSNULL, 
		Event_CallbackFunction, PSNULL, &nSubscribeId);
	if ( PSERR(nRet) )
	{
		printf("新增加订阅安全相关事件 失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return 0;
	}
	printf("新增加订阅安全相关事件 成功\n");
	return nSubscribeId;
}

void testCase_Event_AddSubscribe(PSUINT32 nSubscribeId)
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nEventTopic = PS_EVENT_TOPIC_APPLICATION;
	nRet = psAPI_Event_AddSubscribe(g_hServer, nSubscribeId, PSNULL, &nEventTopic, PSNULL);
	if ( PSERR(nRet) )
	{
		printf("增加订阅程序相关事件 失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("增加订阅程序相关事件 成功\n");
}

void testCase_Event_DelSubscribeAll(PSUINT32 nSubscribeId)
{
	PSAPIStatus nRet = PSRET_OK;
	nRet = psAPI_Event_DelSubscribeAll(g_hServer, nSubscribeId);
	if (PSERR(nRet))
	{
		printf("删除%s订阅 失败 %s\n", nSubscribeId?"上一次":"所有", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("删除%s订阅 成功\n", nSubscribeId?"上一次":"所有");
}

//事件订阅测试
void EventSubscribeTest()
{
	PSUINT32 nSubscribeID = 0;
	char ch;

	printf("===============================================================\n");
	printf("===事件订阅相关函数测试\n");

	testCase_Server_Connect();
	testCase_AddTag();

	printf("\t按N新建事件订阅测试\n");
	printf("\t按A在上次订阅号下增加事件订阅测试\n");
	printf("\t按D删除上次订阅号下的所有订阅\n");
	printf("\t按E删除所有订阅号的订阅\n");
	printf("\t按Q退出事件订阅测试\n");
	while(PSTRUE)
	{
		ch = getchar();
		if (ch == 'n' || ch == 'N')
		{
			nSubscribeID = testCase_Event_NewSubscribe();
		}
		if (ch == 'a' || ch == 'A')
		{
			if (nSubscribeID != 0)
			{
				testCase_Event_AddSubscribe(nSubscribeID);
			}
		}
		if (ch == 'd' || ch == 'D')
		{
			if (nSubscribeID != 0)
			{
				testCase_Event_DelSubscribeAll(nSubscribeID);
			}
		}
		if (ch == 'e' || ch == 'E')
		{
			testCase_Event_DelSubscribeAll(0);
		}
		if (ch == 'q' || ch == 'Q')
		{
			break;
		}
		if (ch == 'h' || ch == 'H')
		{
			printf("\t按N新建事件订阅测试\n");
			printf("\t按A在上次订阅号下增加事件订阅测试\n");
			printf("\t按D删除上次订阅号下的所有订阅\n");
			printf("\t按E删除所有订阅号的订阅\n");
			printf("\t按Q退出事件订阅测试\n");
		}
	}

	testCase_DelTag();
	testCase_Server_Disconnect();

	printf("===事件订阅相关函数测试结束\n");
}

//事件测试
void EventTest()
{
	printf("===============================================================\n");
	printf("===事件相关函数测试\n");

	testCase_Server_Connect();
	testCase_AddTag();

	testCase_Event_Add();
	testCase_Event_Query();

	testCase_Event_QueryAsyn();

	printf("正在等待异步返回... 按任意键退出\n");
	getchar();

	testCase_DelTag();
	testCase_Server_Disconnect();

	printf("===事件相关函数测试结束\n");
}