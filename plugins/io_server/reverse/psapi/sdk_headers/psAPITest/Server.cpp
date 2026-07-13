#include "../psAPISDK.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "psAPITest.h"

void testCase_Server_Connect()
{
	PSAPIStatus nRet = PSRET_OK;
	PSSTR pszServer = (PSSTR)g_pszServer;
	PSSTR pszUserName = (PSSTR)g_pszUserName;
	PSSTR pszPassword = (PSSTR)g_pszPassword;

	//做为链接状态下测试
	if (!g_bConnect)
	{
		return;
	}

	nRet = psAPI_Server_Connect(pszServer, pszUserName, pszPassword, &g_hServer);
	
	if (nRet == PSERR_NET_CONNECT_FAILED)
	{
		printf("连接到服务器%s失败 %s\n", pszServer, psAPI_Commom_GetErrorDesc(nRet));
	}
	else if (nRet == PSERR_USER_USER_NOT_EXIST)
	{
		printf("用户名%s不存在 %s\n", pszUserName, psAPI_Commom_GetErrorDesc(nRet));
	}
	else if (nRet == PSERR_USER_USERNAME_OR_PASSWORD_NOTMATCH)
	{
		printf("密码%s错误 %s\n", pszPassword, psAPI_Commom_GetErrorDesc(nRet));
	}
	else if ( PSERR(nRet) )
	{
		printf("连接失败错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("连接到服务器%s成功\n", pszServer);
	}
}

void testCase_Server_ConnectTimeout()
{
	PSAPIStatus nRet = PSRET_OK;
	PSSTR pszServer = (PSSTR)g_pszServer;
	PSSTR pszUserName = (PSSTR)g_pszUserName;
	PSSTR pszPassword = (PSSTR)g_pszPassword;

	nRet = psAPI_Server_ConnectTimeout(pszServer, pszUserName, pszPassword, 3, 3, PSFALSE, &g_hServer);
	if ( PSERR(nRet) )
	{
		printf("测试超时连接到服务器失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("测试超时连接到服务器%s成功\n", pszServer);
	}
}

void testCase_Server_SetTimeout()
{
	PSAPIStatus nRet = PSRET_OK;
	nRet = psAPI_Server_SetTimeout(g_hServer, 10);
	if ( PSERR(nRet) )
	{
		printf("设置客户端API函数执行超时时间失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("设置客户端API函数执行超时时间成功\n");
	}
}

void testCase_Server_Disconnect()
{
	PSAPIStatus nRet = PSRET_OK;
	nRet = psAPI_Server_Disconnect(g_hServer);
	if ( PSERR(nRet) )
	{
		printf("断开连接失败错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("断开连接成功\n");
	}
}

void testCase_Server_IsConnected()
{
	PSAPIStatus nRet = PSRET_OK;
	PSBOOL bConnected = PSFALSE;
	nRet = psAPI_Server_IsConnected(g_hServer, &bConnected);
	if ( PSERR(nRet) )
	{
		printf("测试服务器是否连接失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return ;
	}
	if (bConnected)
	{
		printf("服务器已经连接\n");
	}
	else
	{
		printf("没有链接到服务器\n");
	}
}

void testCase_Server_GetAllConnectInfo()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nConnectCount = 0;
	PS_CONNECT_INFO *pConnectInfos = PSNULL;
	PSUINT32 n = 0;
	nRet = psAPI_Server_GetAllConnectInfo(g_hServer, &nConnectCount, &pConnectInfos);
	if (PSERR(nRet))
	{
		printf("获取服务器所有连接信息失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取服务器所有连接信息成功 返回数量%u\n", nConnectCount);
	for (n = 0; n < nConnectCount; n++)
	{
		printf("\tUserName:%s UserId:%d\n", pConnectInfos[n].UserName, pConnectInfos[n].UserId);
		printf("\tClientComputer:%s ClientHandle:%d\n", pConnectInfos[n].ClientComputer, pConnectInfos[n].ClientHandle);
		printf("\tClientAppName:%s ConnectTimeout:%d ExcuteTimeout:%d\n", pConnectInfos[n].ClientAppName, pConnectInfos[n].ConnectTimeout, pConnectInfos[n].ExcuteTimeout);
	}
}

void testCase_Server_GetTime()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_TIME psTm = {0};

	nRet = psAPI_Server_GetTime(g_hServer, &psTm);
	if ( PSERR(nRet) )
	{
		printf("获取服务器时间失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取服务器时间:%s", PSTIME2STR(psTm));
}

void testCase_Server_ServerGetProp()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_SERVER_PROP *pServerProp = PSNULL;
	nRet = psAPI_Server_GetProp(g_hServer, &pServerProp);
	if ( PSERR(nRet) )
	{
		printf("获取服务器属性失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("服务器名称:%s\n", pServerProp->ServerName);
	printf("登录的用户名称:%s\n", pServerProp->UserName);
	printf("服务器版本号:%d\n", pServerProp->Version);
	printf("服务器子版本号:%d\n", pServerProp->SubVersion);
	printf("当前用户的权限:%d\n", pServerProp->Permission);
	printf("服务器当前状态:%d\n", pServerProp->Status);
	printf("当前用户的安全区:0X%X\n", pServerProp->SecurityArea);

	psAPI_Memory_FreeServerProp(&pServerProp);
}

//服务器状态订阅测试
PSVOID PSAPI Server_StatusCallback1(
	PSIN PSHANDLE hServer,
	PSIN PSUINT32 nServerStatus
	)
{
	printf("回调1 收到服务器:%u状态变化通知 当前状态:%u\n", hServer, nServerStatus);
}

PSVOID PSAPI Server_StatusCallback2(
	 PSIN PSHANDLE hServer,
	 PSIN PSUINT32 nServerStatus
	 )
{
	printf("回调2 收到服务器:%u状态变化通知 当前状态:%u\n", hServer, nServerStatus);
}

void testCase_Server_RegisterStatusCallback(psAPI_Server_StatusCallback CallbackFunction)
{
	PSAPIStatus nRet = PSRET_OK;
	nRet = psAPI_Server_RegisterStatusCallback(g_hServer, CallbackFunction);
	if (PSERR(nRet))
	{
		printf("注册服务器状态改变的回调处理函数失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("注册服务器状态改变的回调处理函数成功\n");
}

void testCase_Server_UnRegisterStatusCallback(psAPI_Server_StatusCallback CallbackFunction)
{
	PSAPIStatus nRet = PSRET_OK;
	nRet = psAPI_Server_UnRegisterStatusCallback(g_hServer, CallbackFunction);
	if (PSERR(nRet))
	{
		printf("取消注册服务器状态改变的回调处理函数失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("取消注册服务器状态改变的回调处理函数成功\n");
}

void ServerStatusCallbackTest()
{
	PSUINT32 nSubscribeID = 0;
	char ch;

	printf("===============================================================\n");
	printf("===服务器状态订阅测试\n");

	testCase_Server_Connect();

	printf("\t按1注册服务器状态改变的回调函数1\n");
	printf("\t按2注册服务器状态改变的回调函数2\n");
	printf("\t按3取消注册服务器状态改变的回调函数1\n");
	printf("\t按4取消注册服务器状态改变的回调函数2\n");
	printf("\t按Q退出服务器状态改变订阅测试\n");
	while(PSTRUE)
	{
		ch = getchar();
		if (ch == '1')
		{
			testCase_Server_RegisterStatusCallback(Server_StatusCallback1);
		}
		else if (ch == '2')
		{
			testCase_Server_RegisterStatusCallback(Server_StatusCallback2);
		}
		else if (ch == '3')
		{
			testCase_Server_UnRegisterStatusCallback(Server_StatusCallback1);
		}
		else if (ch == '4')
		{
			testCase_Server_UnRegisterStatusCallback(Server_StatusCallback2);
		}
		else if (ch == 'q' || ch == 'Q')
		{
			break;
		}
		else if (ch == 'h' || ch == 'H')
		{
			printf("\t按1注册服务器状态改变的回调函数1\n");
			printf("\t按2注册服务器状态改变的回调函数2\n");
			printf("\t按3取消注册服务器状态改变的回调函数1\n");
			printf("\t按4取消注册服务器状态改变的回调函数2\n");
			printf("\t按Q退出服务器状态改变订阅测试\n");
		}
	}

	testCase_Server_Disconnect();

	printf("===服务器状态订阅测试\n");
}

void ServerTest()
{
	printf("===============================================================\n");
	printf("===服务相关函数测试\n");

	testCase_Server_Connect();
	testCase_Server_IsConnected();
	testCase_Server_SetTimeout();
	testCase_Server_GetAllConnectInfo();
	testCase_Server_GetTime();
	testCase_Server_ServerGetProp();
	testCase_Server_Disconnect();

	testCase_Server_ConnectTimeout();
	testCase_Server_Disconnect();

	printf("===服务相关函数测试结束\n");
}