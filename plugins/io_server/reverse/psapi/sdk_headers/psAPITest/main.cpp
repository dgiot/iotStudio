#include <stdio.h>
#include <stddef.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "psAPITest.h"
#include <string>

PSHANDLE	g_hServer = PSHANDLE_UNUSED;
PSBOOL		g_bConnect = PSTRUE;
char		g_pszServer[64] = {0};
char		g_pszUserName[64] = {0};
char		g_pszPassword[64] = {0};

char* PSVARIANT2STRHELP(char* pszVariant, PS_VARIANT *pVariant)
{
	PS_VARIANT *var = pVariant;
	char *temp = pszVariant;
	struct tm * ptm = PSNULL;

	memset(temp, 0, 256);
	switch (var->DataType)
	{
	case PSDATATYPE_BOOL: 
		strcpy(temp,var->Bool==PSTRUE? "1":"0");
		break;
	case PSDATATYPE_INT8 :
		sprintf(temp,"%d",var->Int8);
		break;
	case PSDATATYPE_UINT8 :	
		sprintf(temp,"%d",var->UInt8);
		break;
	case PSDATATYPE_INT16 :
		sprintf(temp,"%d",var->Int16);
		break;
	case PSDATATYPE_UINT16 :
		sprintf(temp,"%d",var->UInt16);
		break;
	case PSDATATYPE_INT32 :	
		sprintf(temp,"%d",var->Int32);
		break;
	case PSDATATYPE_UINT32 :
		sprintf(temp,"%d",var->UInt32);
		break;
	case PSDATATYPE_INT64 :
		sprintf(temp,"%lld",var->Int64);
		break;
	case PSDATATYPE_UINT64 :
		sprintf(temp,"%llu",var->UInt64);
		break;
	case PSDATATYPE_FLOAT :
		sprintf(temp, "%.4f", var->Float );
		break;
	case PSDATATYPE_DOUBLE :
		sprintf(temp,"%.4f",var->Double);
		break;
	case PSDATATYPE_TIME :		
		ptm=localtime((time_t*)&(var->Time.Second));
		sprintf(temp,"%04d-%02d-%02d %02d:%02d:%02d.%03d",ptm->tm_year+1900,ptm->tm_mon+1,ptm->tm_mday,ptm->tm_hour,ptm->tm_min,ptm->tm_sec,var->Time.Millisec);
		break;
	case PSDATATYPE_STRING:
		strncpy(temp, var->String.Data, var->String.Length);
		break;
	default:
		strcpy(temp, "");
	}
	return temp;
}

char* PSTIME2STR(PS_TIME psTm)
{
	static char pszTime[256] = {0};
	time_t tt = psTm.Second;
	struct tm * ptm =  localtime(&(tt));
	sprintf(pszTime,"%04d-%02d-%02d %02d:%02d:%02d.%03d",ptm->tm_year+1900,
		ptm->tm_mon+1,ptm->tm_mday,ptm->tm_hour,ptm->tm_min,ptm->tm_sec,psTm.Millisec);
	return pszTime;
}
void STR2PSTIME(PS_TIME* d, std::string s)
{
	if(s== "")
	{
		d->Millisec=0;
		d->Second=0;
		return;
	}
	d->Second = 0;
	d->Millisec = 0;
	//2008-05-12 14:28:04.123
	PSUINT32  nStrLen = s.length();
	d->Millisec=(PSUINT32)atoi(s.substr(20,3).c_str());
	tm tm_struct;
	tm_struct.tm_mon=atoi(s.substr(5,2).c_str())-1;
	tm_struct.tm_mday=atoi(s.substr(8,2).c_str());
	tm_struct.tm_hour=atoi(s.substr(11,2).c_str());
	tm_struct.tm_min=atoi(s.substr(14,2).c_str());
	tm_struct.tm_sec=atoi(s.substr(17,2).c_str());
	tm_struct.tm_year=atoi(s.substr(0,4).c_str())-1900;
	d->Second= (PSUINT32)mktime(&tm_struct);
}

//得到错误的中文描述测试
void GetErrorDescTest()
{
	printf("===============================================================\n");
	printf("===由错误号得到相关的中文描述测试\n");
	printf("\tPSRET_OK的中文描述:%s\n", psAPI_Commom_GetErrorDesc(PSRET_OK));
	printf("\tPSERR_MIN的中文描述:%s\n", psAPI_Commom_GetErrorDesc(PSERR_MIN));
	printf("\tPSERR_USER_USER_NOT_EXIST的中文描述:%s\n", psAPI_Commom_GetErrorDesc(PSERR_USER_USER_NOT_EXIST));
	assert(psAPI_Commom_GetErrorDesc(PSRET_OK+1)==PSNULL);
	assert(psAPI_Commom_GetErrorDesc(PSERR_MAX-1)==PSNULL);
	printf("===由错误号得到相关的中文描述测试结束\n");
}

//支持链接参数 服务器地址 用户名 密码
int main(int argc, char* argv[])
{	
	PSAPIStatus nRet = psAPI_Common_StartAPI();


	if ( PSERR(nRet) )
	{
		printf("启动psAPI失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	srand(time(PSNULL));
	//获取链接参数
	if (argc > 3)
	{
		strcpy(g_pszServer, argv[1]);
		strcpy(g_pszUserName, argv[2]);
		strcpy(g_pszPassword, argv[3]);
	}
	else
	{
		strcpy(g_pszServer, "localhost");
		strcpy(g_pszUserName, "admin");
		strcpy(g_pszPassword, "admin888");
		printf("使用默认帐号链接到本地服务器\n");
	}
	//ServerTest();


	//nRet = psAPI_Common_StopAPI();
	//nRet = psAPI_Common_StartAPI();
	g_bConnect = PSTRUE;
	//PS_VARIANT函数测试
	//VarTest();
	
	//获取错误描述测试
	//GetErrorDescTest();
	//链接到服务器等相关函数测试
	ServerTest();

	//DataSetTest();

	//getchar();
	//用户 用户组相关函数测试
	//UserTest();
	////测点相关函数测试
	//TagTest();
	////实时函数测试
	//RealTest();
	////历史函数测试
	//HisTest();
	////报警测试
	//AlarmTest();
	////事件测试
	//EventTest();

	////未链接下测试
//	g_bConnect = PSFALSE;
	////链接到服务器等相关函数测试
	//ServerTest();
	////用户 用户组相关函数测试
	//UserTest();
	////测点相关函数测试
	//TagTest();
	////实时函数测试
	//RealTest();
	////历史函数测试
	//HisTest();
	////报警测试
	//AlarmTest();
	////事件测试
	//EventTest();

	g_bConnect = PSTRUE;
	////服务器状态订阅测试
	//ServerStatusCallbackTest();
	////测点属性订阅测试
	//TagSubscribeTest();
	////实时值订阅测试
	//RealSubscribeTest();
	////报警订阅测试
	//AlarmSubscribeTest();
	////事件订阅测试
	//EventSubscribeTest();

	printf("测试结束.按任意键退出\n");
	getchar();

	psAPI_Common_StopAPI();
	return 0;
};