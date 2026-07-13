#include "../psAPISDK.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "psAPITest.h"
#include <string>
#include <iostream>

PSUINT32 g_AlarmID = 0;
extern void STR2PSTIME(PS_TIME* d, std::string s);
void testCase_Alarm_Add()
{
// 	PSAPIStatus nRet = PSRET_OK;
// 	PS_ALARM_FIELD field = {0};
// 	PS_ALARM alarm = {0};
// 	field.TagId = PSTRUE;
// 	alarm.TagId = g_TagIds[1];
// 	field.Type = PSTRUE;
// 	alarm.Type = PS_ALARM_TYPE_Start;
// 	field.Time = PSTRUE;
// 	alarm.Time.Second = time(NULL);
// 	field.Level = PSTRUE;
// 	alarm.Level = PS_ALARM_LEVEL_INFORMATION;
// 	field.AlarmString = PSTRUE;
// 	alarm.AlarmString = "我完了";
// 	nRet = psAPI_Alarm_Add(g_hServer, field, &alarm);
// 	if ( PSERR(nRet) )
// 	{
// 		printf("增加报警失败昨 %s\n", psAPI_Commom_GetErrorDesc(nRet));
// 	}
// 	else
// 	{
// 		printf("增加报警成功\n");
// 		g_AlarmID = alarm.Id;
// 	}
}

void testCase_Alarm_Acked()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_TIME AckTime = {time(NULL), 0};
	PSUINT32  nAckUserId = 1;
	char AlarmAckUserName[10] = {"admin"};
	PSUINT32*  nAid = new PSUINT32[1];
	nAid[0] =  2;
	std::cout<<"输入UserId,确认用户名，测点ID"<<std::endl;
	//std::cin>>nAckUserId>>AlarmAckUserName;
	nRet= psAPI_Alarm_Ack(g_hServer,nAckUserId,AlarmAckUserName,AckTime,1,nAid);
	if ( PSERR(nRet) )
	{
		printf("应答报警失败昨 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("应答报警成功\n");
	}
}

void testCase_Alarm_Real_Query()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_ALARM_FILTER_FIELD filterField = {0};
	PS_ALARM_FILTER filter = {0};
	PSUINT32 nAlarmCount = 0;
	PS_ALARM *pAlarms = PSNULL;
 	PSUINT32 n = 0;
	filterField.TagId = PSTRUE;
	filter.TagId = 0;
	/*filterField.AlarmHighLevel = PSTRUE;
	filter.AlarmHighLevel = 2;
	filterField.AlarmLowLevel = PSTRUE;
	filter.AlarmLowLevel = 0;
	filterField.AlarmHaveAcked = PSTRUE;
	filter.AlarmHaveAcked = 0;*/
	/*
	PS_ALARM_TOPIC_QUALITY_CHANGE=0x01,	 质量戳改变
	PS_ALARM_TOPIC_VALUE_CHANGE = 0x02,	 值改变
	PS_ALARM_TOPIC_HIGH = 0x04,			 越高限
	PS_ALARM_TOPIC_HIGHHIGH = 0x08,		 越高高限
	PS_ALARM_TOPIC_LOW = 0x10,			 越低限
	PS_ALARM_TOPIC_LOWLOW = 0x20,		 越低低限
	PS_ALARM_TOPIC_CHANGERATE = 0x40,	 变化率报警
	PS_ALARM_TOPIC_WARP = 0x80,			 偏差报警
	*/

	nRet = psAPI_Alarm_Real_Query(g_hServer, &filterField, &filter, &nAlarmCount, &pAlarms);
	if (PSERR(nRet))
	{
		printf("查询测点%u的报警 失败 %s\n", g_TagIds[1], psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("查询测点%u的报警成功 返回数量%u\n", g_TagIds[1], nAlarmCount);
	for(n = 0; n < nAlarmCount; n++)
	{
		printf("报警%u \n",n);
		printf("AlarmId  %u\t\n",pAlarms[n].AlarmId);
		printf("TagId  %u\t\n",pAlarms[n].TagId);
		printf("UserID %u\t\n",pAlarms[n].UserID);
		printf("AppType %u\t\n",pAlarms[n].AppType);
		printf("AlarmLevel %u\t\n",pAlarms[n].AlarmLevel);
		printf("AlarmContent %s\t\n",pAlarms[n].AlarmContent);
		printf("AlarmValue %s\t\n",pAlarms[n].AlarmValue);
		printf("AlarmAckUserName %s\t\n",pAlarms[n].AlarmAckUserName);	
		printf("AlarmTopic %u\t\n",pAlarms[n].AlarmTopic);
		printf("AlarmNeedAck %u\t\n",pAlarms[n].AlarmNeedAck);
		printf("AlarmHaveAcked %u\t\n",pAlarms[n].AlarmHaveAcked);
		printf("AlarmStartTime %s\t\n",PSTIME2STR(pAlarms[n].AlarmStartTime));
		printf("AlarmEndTime %s\t\n",PSTIME2STR(pAlarms[n].AlarmEndTime));
		printf("AlarmAckedId %u\t\n",pAlarms[n].AlarmAckedId);
		printf("AlarmAckTime %s\t\n",PSTIME2STR(pAlarms[n].AlarmAckTime));
		printf("\n");
	}
	psAPI_Memory_FreeAlarmList(&pAlarms, nAlarmCount);
}

void testCase_Alarm_His_Query()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_ALARM_FILTER_FIELD filterField = {0};
	PS_ALARM_FILTER filter = {0};
	PSUINT32 nAlarmCount = 0;
	PS_ALARM *pAlarms = PSNULL;
	PSUINT32 n = 0;
	PS_TIME psStartTime;
	PS_TIME psEndTime;
	std::string strStartTime = "2010-03-24 16:45:00.000";
	std::string strEndTime = "2010-03-24 16:50:00.000";
	STR2PSTIME(&psStartTime,strStartTime);
	STR2PSTIME(&psEndTime,strEndTime);

	//PSTIME 字符串格式 2008-05-12 12:00:10.000
	filterField.TagId = PSFALSE;
	filter.TagId = 4;

	filterField.AlarmHaveAcked = PSTRUE;
	filter.AlarmHaveAcked = PSTRUE;

	filterField.AlarmContent = PSTRUE;
	filter.AlarmContent = "%192";

	/*
		PS_ALARM_TOPIC_QUALITY_CHANGE=0x01,	 质量戳改变
		PS_ALARM_TOPIC_VALUE_CHANGE = 0x02,	 值改变
		PS_ALARM_TOPIC_HIGH = 0x04,			 越高限
		PS_ALARM_TOPIC_HIGHHIGH = 0x08,		 越高高限
		PS_ALARM_TOPIC_LOW = 0x10,			 越低限
		PS_ALARM_TOPIC_LOWLOW = 0x20,		 越低低限
		PS_ALARM_TOPIC_CHANGERATE = 0x40,	 变化率报警
		PS_ALARM_TOPIC_WARP = 0x80,			 偏差报警
	*/
	filterField.AlarmTopic = PSFALSE;
	//filter.AlarmTopic = PS_ALARM_TOPIC_HIGH|PS_ALARM_TOPIC_HIGHHIGH|PS_ALARM_TOPIC_LOW;
	filter.AlarmTopic = PS_ALARM_TOPIC_QUALITY_CHANGE|PS_ALARM_TOPIC_HIGH|PS_ALARM_TOPIC_VALUE_CHANGE|
						PS_ALARM_TOPIC_HIGHHIGH|PS_ALARM_TOPIC_WARP|PS_ALARM_TOPIC_CHANGERATE|PS_ALARM_TOPIC_LOWLOW;

	nRet = psAPI_Alarm_His_Query(g_hServer,&filterField,&filter,psStartTime,psEndTime, &nAlarmCount,&pAlarms);
	if (PSERR(nRet))
	{
		printf("查询测点的报警 失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("查询测点的报警成功 返回数量\n",nAlarmCount);
	for(n = 0; n < nAlarmCount; n++)
	{
		printf("报警序号%u \n",n);
		printf("AlarmId %u\t\n",pAlarms[n].AlarmId);
		printf("TagId %u\t\n",pAlarms[n].TagId);
		printf("UserID %u\t\n",pAlarms[n].UserID);
		printf("AppType %u\t\n",pAlarms[n].AppType);
		printf("AlarmLevel %u\t\n",pAlarms[n].AlarmLevel);
		printf("AlarmContent %s\t\n",pAlarms[n].AlarmContent);
		printf("AlarmValue %s\t\n",pAlarms[n].AlarmValue);
		printf("AlarmAckUserName %s\t\n",pAlarms[n].AlarmAckUserName);
		printf("AlarmTopic %u\t\n",pAlarms[n].AlarmTopic);
		printf("AlarmNeedAck %u\t\n",pAlarms[n].AlarmNeedAck);
		printf("AlarmHaveAcked %u\t\n",pAlarms[n].AlarmHaveAcked);
		printf("AlarmStartTime %s\t\n",PSTIME2STR(pAlarms[n].AlarmStartTime));
		printf("AlarmEndTime %s\t\n",PSTIME2STR(pAlarms[n].AlarmEndTime));
		printf("AlarmAckedId %u\t\n",pAlarms[n].AlarmAckedId);
		printf("AlarmAckTime %s\t\n",PSTIME2STR(pAlarms[n].AlarmAckTime));
		printf("\n");
	}
	psAPI_Memory_FreeAlarmList(&pAlarms, nAlarmCount);
}

PSVOID PSAPI Alarm_QueryAsynComplete(
								   PSIN PSHANDLE hServer,
								   PSIN PSVOID *pUserPara,
								   PSIN PSUINT32 nAlarmCount,
								   PSIN PS_ALARM *pAlarms,
								   PSIN PSAPIStatus nRet)
{
	/*PSUINT32 n = 0;
	if (PSERR(nRet))
	{
		printf("查询未应答的报警 失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("查询未应答的报警成功 返回数量%u\n", nAlarmCount);
	for(n = 0; n < nAlarmCount; n++)
	{
		printf("\t时间:%s ID:%u UserID:%d \n\t\tTagId:%u Category:%u Level:%u", PSTIME2STR(pAlarms[n].Time),
			pAlarms[n].Id, pAlarms[n].UserID, pAlarms[n].TagId, pAlarms[n].Category, pAlarms[n].Level);
		printf("\n\t\tStartTime:%s", PSTIME2STR(pAlarms[n].StartTime));
		printf("\n\t\tEndTime:%s",PSTIME2STR(pAlarms[n].EndTime));
		printf("\n\t\tAckTime:%s Type:%d Completed:%d \n\t\tNeedAck:%d HaveAcked:%d ActorID:%d",
			PSTIME2STR(pAlarms[n].AckTime),pAlarms[n].Type, pAlarms[n].Completed, pAlarms[n].NeedAck,
			pAlarms[n].HaveAcked, pAlarms[n].ActorID);
		printf("\n\t\t报警描述:%s\n\n", pAlarms[n].AlarmString);
	}*/
}

void testCase_Alarm_QueryAsyn()
{
	/*PSAPIStatus nRet = PSRET_OK;
	PS_ALARM_FILTER_FIELD filterField = {0};
	PS_ALARM_FILTER filter = {0};

	filterField.HaveAcked = PSTRUE;
	filter.HaveAcked = PSFALSE;

	nRet = psAPI_Alarm_QueryAsyn(g_hServer, &filterField, &filter, Alarm_QueryAsynComplete, PSNULL);
	if (PSERR(nRet))
	{
		printf("查询未应答的报警 失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}*/
}

PSVOID PSAPI Alarm_CallbackFunction(
	PSIN PSHANDLE hServer,
	PSIN PSUINT32 nSubscribeId,
	PSIN PSVOID *pUserPara,
	PSIN PS_ALARM *pAlarm
	)
{
	/*printf("订阅报警返回,订阅ID%u", nSubscribeId);
	printf("\t时间:%s ID:%u UserID:%d \n\t\tTagId:%u Category:%u Level:%u", PSTIME2STR(pAlarm->Time),
		pAlarm->Id, pAlarm->UserID, pAlarm->TagId, pAlarm->Category, pAlarm->Level);
	printf("\n\t\tStartTime:%s", PSTIME2STR(pAlarm->StartTime));
	printf("\n\t\tEndTime:%s",PSTIME2STR(pAlarm->EndTime));
	printf("\n\t\tAckTime:%s Type:%d Completed:%d \n\t\tNeedAck:%d HaveAcked:%d ActorID:%d",
		PSTIME2STR(pAlarm->AckTime),pAlarm->Type, pAlarm->Completed, pAlarm->NeedAck,
		pAlarm->HaveAcked, pAlarm->ActorID);
	printf("\n\t\t报警描述:%s\n\n", pAlarm->AlarmString);*/
}

PSUINT32 testCase_Alarm_NewSubscribe()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nTagId = g_TagIds[1];
	PSUINT32 nSubscribeId = 0;

	nRet = psAPI_Alarm_NewSubscribe(g_hServer, &nTagId, PSNULL, PSNULL, PSNULL, 
		Alarm_CallbackFunction, PSNULL, &nSubscribeId);
	if ( PSERR(nRet) )
	{
		printf("新增加订阅测点%u相关报警 失败 %s\n", nTagId, psAPI_Commom_GetErrorDesc(nRet));
		return 0;
	}
	printf("新增加订阅测点%u相关报警 成功\n", nTagId);
	return nSubscribeId;
}

void testCase_Alarm_AddSubscribe(PSUINT32 nSubscribeId)
{
	PSAPIStatus nRet = PSRET_OK;
	PSBOOL bHaveAcked = PSFALSE;
	nRet = psAPI_Alarm_AddSubscribe(g_hServer, nSubscribeId, PSNULL, &bHaveAcked, PSNULL, PSNULL);
	if ( PSERR(nRet) )
	{
		printf("增加订阅未应答报警 失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("增加订阅程未应答报警 成功\n");
}

void testCase_Alarm_DelSubscribeAll(PSUINT32 nSubscribeId)
{
	PSAPIStatus nRet = PSRET_OK;
	nRet = psAPI_Alarm_DelSubscribeAll(g_hServer, nSubscribeId);
	if (PSERR(nRet))
	{
		printf("删除%s订阅 失败 %s\n", nSubscribeId?"上一次":"所有", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("删除%s订阅 成功\n", nSubscribeId?"上一次":"所有");
}

//报警订阅测试
void AlarmSubscribeTest()
{
	PSUINT32 nSubscribeID = 0;
	char ch;

	printf("===============================================================\n");
	printf("===报警订阅相关函数测试\n");

	//testCase_Server_Connect();
	//testCase_AddTag();

	//printf("\t按N新建报警订阅测试\n");
	//printf("\t按A在上次订阅号下增加报警订阅测试\n");
	//printf("\t按D删除上次订阅号下的报警订阅\n");
	//printf("\t按E删除所有订阅号的订阅\n");
	//printf("\t按Q退出报警订阅测试\n");
	
	/*	if (ch == 'n' || ch == 'N')
		{
			nSubscribeID = testCase_Alarm_NewSubscribe();
		}
		if (ch == 'a' || ch == 'A')
		{
			if (nSubscribeID != 0)
			{
				testCase_Alarm_AddSubscribe(nSubscribeID);
			}
		}
		if (ch == 'd' || ch == 'D')
		{
			if (nSubscribeID != 0)
			{
				testCase_Alarm_DelSubscribeAll(nSubscribeID);
			}
		}
		if (ch == 'e' || ch == 'E')
		{
			testCase_Alarm_DelSubscribeAll(0);
		}
		if (ch == 'q' || ch == 'Q')
		{
			break;
		}
		if (ch == 'h' || ch == 'H')
		{
			printf("\t按N新建报警订阅测试\n");
			printf("\t按A在上次订阅号下增加报警订阅测试\n");
			printf("\t按D删除上次订阅号下的报警订阅\n");
			printf("\t按E删除所有订阅号的订阅\n");
			printf("\t按Q退出报警订阅测试\n");;
		}*/
	//}

	//testCase_DelTag();
	//testCase_Server_Disconnect();

	printf("===报警订阅相关函数测试结束\n");
}

//报警测试
void AlarmTest()
{
	testCase_Server_Connect();
	printf("===============================================================\n");
	printf("报警相关函数测试\n");
	char ch;
	printf("\t按R报警实时测试\n");
	printf("\t按H报警历史测试\n");
	printf("\t按A报警测试\n");
	while(PSTRUE)
	{
		ch = getchar();
		if (ch == 'r' || ch == 'R')
		{
			testCase_Alarm_Real_Query();
		}
		if (ch == 'h' || ch == 'H')
		{
			testCase_Alarm_His_Query();
		}
		if (ch == 'a' || ch == 'A')
		{
			testCase_Alarm_Acked();
		}
		if(ch =='q'|| ch == 'Q')
		{
			break;
		}
	}
	testCase_Server_Connect();
	testCase_AddTag();

	testCase_Alarm_Add();
	testCase_Alarm_Acked();
	testCase_Alarm_Real_Query();
	
	testCase_Alarm_His_Query();

	testCase_Alarm_QueryAsyn();

	//printf("正在等待异步返回... 按任意键退出\n");
	//getchar();

	//testCase_DelTag();
	//testCase_Server_Disconnect();
	testCase_Server_Disconnect();
	printf("===报警相关函数测试结束\n");
}

