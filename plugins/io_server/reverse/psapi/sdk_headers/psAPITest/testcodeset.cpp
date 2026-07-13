//alec yin created
#include <iostream>
#include "../psAPISDK.h"
#include "psAPItest.h"
void test_raw();
void test_process();
extern void testCase_Server_Connect();
void DataSetTest()
{

	printf("===============================================================\n");
	printf("===测点相关函数测试\n");



	testCase_Server_Connect();

	test_raw();
	test_process();
	testCase_Server_Disconnect();

	printf("===测点相关函数测试结束\n");


}


void test_raw()
{
	PS_TIME start_time;
	start_time.Second=12;
	start_time.Millisec=0;
	PS_TIME end_time;
	end_time.Second=1262431480;
	end_time.Millisec=0;
	PS_CURSOR* temp=PSNULL;
	psAPI_His_ReadRawByCursor(g_hServer,start_time,end_time,10000,0,4,&temp);
	PS_DATA* pdata=PSNULL;
	PSAPIStatus nRet=PSRET_OK;
	while ((nRet=psAPI_His_ReadNextRaw(temp,&pdata))==PSRET_OK)
	{
		//printf("获取吓一跳数据值失败 %\n", psAPI_Commom_GetErrorDesc(nRet));
		static int i=0;
		if (!(i%10000))
		{
			std::cout<<"秒:"<<pdata->Time.Second<<"\t毫秒:"<<pdata->Time.Millisec<<"\t值"<<pdata->Value.Double<<std::endl;
		}
		i++;
		pdata=PSNULL;
	}
	std::cout<<"错误号:"<<nRet<<std::endl;
	psAPI_His_ReleaseCursor(temp);
}


void test_process()
{
	PS_TIME start_time;
	start_time.Second=1262200480;
	start_time.Millisec=0;
	PS_TIME end_time;
	end_time.Second=1263238480;
	end_time.Millisec=0;
	PS_TIME sample_time;
	sample_time.Second=60;
	sample_time.Millisec=0;

	PS_CURSOR* temp=PSNULL;
	psAPI_His_ReadProcessedByCursor(g_hServer,start_time,end_time,sample_time,PS_HIS_COUNT,4,&temp);
	PS_DATA* pdata=PSNULL;
	PSAPIStatus nRet=PSRET_OK;
	while ((nRet=psAPI_His_ReadNextProcessed(temp,&pdata))==PSRET_OK)
	{
		//printf("获取吓一跳数据值失败 %\n", psAPI_Commom_GetErrorDesc(nRet));
		static int i=0;
		if (!(i%1000))
		{
			std::cout<<"秒:"<<pdata->Time.Second<<"\t毫秒:"<<pdata->Time.Millisec<<"\t值"<<pdata->Value.Double<<std::endl;
		}
		i++;
		pdata=PSNULL;
	}
	std::cout<<"错误号:"<<nRet<<std::endl;
	psAPI_His_ReleaseCursor(temp);
}
