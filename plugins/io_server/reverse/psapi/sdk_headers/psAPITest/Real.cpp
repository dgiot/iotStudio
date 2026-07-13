#include "../psAPISDK.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "psAPITest.h"

void testCase_Real_Read()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_DATA *pRealData = PSNULL;

	nRet = psAPI_Real_Read(g_hServer, g_TagIds[1], &pRealData);
	if ( PSERR(nRet) )
	{
		printf("读取实时数据失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("读取实时数据成功\n\t测点ID:%u 值:%f 质量辍:%u 时间:%s\n", 
			g_TagIds[1], pRealData->Value.Double, pRealData->Quality, PSTIME2STR(pRealData->Time));
		psAPI_Memory_FreeDataList(&pRealData, 1);
	}
}

void testCase_Real_ReadList()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_DATA *pRealDataList = PSNULL;
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 tagIds[3] = {g_TagIds[2],g_TagIds[3], g_TagIds[4]};
	PSUINT32 n = 0;

	nRet = psAPI_Real_ReadList(g_hServer, 3, tagIds, &pRealDataList, &pAPIErrors);
	if ( PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("读取实时数据列表失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("读取实时数据列表:\n");
	for (n = 0; n < 3; n++)
	{
		printf("\t测点ID:%u 值:%f 质量辍:%u 时间:%s\n", 
			tagIds[n], 
			(pRealDataList+n)->Value.Double, 
			(pRealDataList+n)->Quality, 
			PSTIME2STR((pRealDataList+n)->Time));
	}
	psAPI_Memory_FreeDataList(&pRealDataList, 3);
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("读取实时数据列表 有部分成功部分失败:\n");
		for (n = 0; n < 3; n++)
		{
			printf("\t测点ID:%u 返回 %s\n", tagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
	}
}

void testCase_Real_Write()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_VARIANT realData;
	realData.DataType = PSDATATYPE_DOUBLE;
	realData.Double = 55.567;

	nRet = psAPI_Real_Write(g_hServer, g_TagIds[1], &realData, PSNULL, PSNULL);

	if ( PSERR(nRet) )
	{
		printf("写实时数据失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("写实时数据成功\n");
	}
}

void testCase_Real_WriteList()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 tagIds[3] = {g_TagIds[2],g_TagIds[3], g_TagIds[4]};
	PS_VARIANT realDataList[3];
	PSUINT32 qualities[3] = {PS_QUALITY_GOOD, PS_QUALITY_UNCERTAIN, PS_QUALITY_GOOD};
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	realDataList[0].DataType = PSDATATYPE_DOUBLE;
	realDataList[0].Double = 355.567;

	realDataList[1].DataType = PSDATATYPE_BOOL;
	realDataList[1].Bool = PSTRUE;

	realDataList[2].DataType = PSDATATYPE_DOUBLE;
	realDataList[2].Double = 255.567;

	nRet = psAPI_Real_WriteList(g_hServer, 3, tagIds, realDataList, NULL, qualities, &pAPIErrors);
	
	if ( PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("写实时数据列表失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("写实实时数据列表 有部分成功部分失败:\n");
		for (n = 0; n < 3; n++)
		{
			printf("\t测点ID:%u 返回 %s\n", tagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
		return;
	}
	printf("写实实时数据列表成功\n");
}

//////////////////////////////////////////////////////////////////////////

//异步函数测试
PSVOID PSAPI Real_ReadListAsynComplete(
	PSIN PSHANDLE hServer,
	PSIN PSVOID *pUserPara,
	PSIN PSUINT32 nCount,
	PSIN PSUINT32 *pTagIds,
	PSIN PS_DATA *pRealDataList,
	PSIN PSAPIStatus nRet,
	PSIN PSAPIStatus *pAPIErrors
	)
{
	PSUINT32 nRunCount = (PSUINT32)pUserPara;
	PSUINT32 n = 0;
	if ( PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("异步读取实时数据列表失败 自定义参数:%u 返回错误 %s\n", nRunCount, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("异步读取实时数据列表: 自定义参数:%u\n", nRunCount);
	for (n = 0; n < nCount; n++)
	{
		printf("\t测点ID:%u 值:%f 质量辍:%u 时间:%s\n", 
			*(pTagIds+n), 
			(pRealDataList+n)->Value.Double, 
			(pRealDataList+n)->Quality, 
			PSTIME2STR((pRealDataList+n)->Time));
	}
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("异步读取实时数据列表 有部分成功部分失败:\n");
		for (n = 0; n < nCount; n++)
		{
			printf("\t测点ID:%u 返回 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
	}
}

void testCase_Real_ReadListAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 tagIds[3] = {g_TagIds[2],g_TagIds[3], g_TagIds[4]};
	static PSUINT32 nRunCount = 0;
	nRet = psAPI_Real_ReadListAsyn(g_hServer, 3, tagIds, Real_ReadListAsynComplete, (PSVOID*)nRunCount++);
	if (PSERR(nRet))
	{
		printf("异步读取实时数据列表失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("异步读取实时数据列表执行成功,正在等待返回...\n");
}

PSVOID PSAPI Real_WriteListAsynComplete(
	PSIN PSHANDLE hServer,
	PSIN PSVOID *pUserPara,
	PSIN PSUINT32 nCount,
	PSIN PSUINT32 *pTagIds,
	PSIN PSAPIStatus nRet,
	PSIN PSAPIStatus *pAPIErrors
	)
{
	PSUINT32 nRunCount = (PSUINT32)pUserPara;
	PSUINT32 n = 0;
	if ( PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("异步写实时数据列表失败 自定义参数:%u 返回错误 %s\n", nRunCount, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("异步写实时数据列表 有部分成功部分失败:\n");
		for (n = 0; n < nCount; n++)
		{
			printf("\t测点ID:%u 返回 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
	}
	printf("异步写实时数据列表成功 自定义参数:%u\n", nRunCount);
}

void testCase_Real_WriteListAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 tagIds[3] = {g_TagIds[2],g_TagIds[3], g_TagIds[4]};
	PS_VARIANT realDataList[3];
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;
	static PSUINT32 nRunCount = 0;

	realDataList[0].DataType = PSDATATYPE_DOUBLE;
	realDataList[0].Double = 755.567;

	realDataList[1].DataType = PSDATATYPE_BOOL;
	realDataList[1].Double = PSFALSE;

	realDataList[2].DataType = PSDATATYPE_DOUBLE;
	realDataList[2].Double = 955.567;

	nRet = psAPI_Real_WriteListAsyn(g_hServer, 3, tagIds, 
		realDataList, NULL, NULL, Real_WriteListAsynComplete, (PSVOID*)nRunCount++);

	if (PSERR(nRet))
	{
		printf("异步写实时数据列表失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("异步写实时数据列表执行成功,正在等待返回...\n");
}
//////////////////////////////////////////////////////////////////////////

//实时订阅测试
PSVOID PSAPI Real_CallbackFunction(
	PSIN PSHANDLE hServer,
	PSIN PSUINT32 nSubscribeId,
	PSIN PSVOID *pUserPara,
	PSIN PSUINT32 nCount,
	PSIN PSUINT32 *pTagIds,
	PSIN PS_DATA *pRealDataList
	)
{
	PSUINT32 nNewSubscribe = (PSUINT32)pUserPara;
	PSUINT32 n = 0;

	printf("用户参数:%u返回值数量%u\n", 
		nNewSubscribe, nCount);
	for (n = 0; n < nCount; n++)
	{
		printf("\t测点ID:%u 值:%f 质量辍:%u 时间:%s\n", 
			*(pTagIds+n), 
			(pRealDataList+n)->Value.Double, 
			(pRealDataList+n)->Quality, 
			PSTIME2STR((pRealDataList+n)->Time));
	}
}

void testCase_Real_WriteList_Subscribe()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 tagIds[4] = {g_TagIds[1],g_TagIds[2],g_TagIds[3], g_TagIds[4]};
	PS_VARIANT realDataList[4] = {0};
	PSUINT32 qualities[4] = {0};
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	for (n = 0; n < 4; n++)
	{
		realDataList[n].DataType = PSDATATYPE_DOUBLE;
		realDataList[n].Double = ((double)rand())/3;
		if (n == 2)
		{
			realDataList[n].DataType = PSDATATYPE_BOOL;
			realDataList[n].Bool = (rand())%2;
		}
		qualities[n] = (rand()%2)?PS_QUALITY_GOOD:PS_QUALITY_UNCERTAIN;
	}

	nRet = psAPI_Real_WriteList(g_hServer, 4, tagIds, realDataList, NULL, qualities, &pAPIErrors);

	if ( PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("写实时数据列表失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("写实实时数据列表 有部分成功部分失败:\n");
		for (n = 0; n < 4; n++)
		{
			printf("\t测点ID:%u 返回 %s\n", tagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
		return;
	}
	printf("写实实时数据列表成功\n");
}

PSUINT32 testCase_Real_NewSubscribe()
{
	static PSUINT32 nNewSubscribe = 0;
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 2;
	PSUINT32 pTagIds[2] = {g_TagIds[1], g_TagIds[2]};
	PSUINT32 nSubscribeID = 0;
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_Real_NewSubscribe(g_hServer, nCount, pTagIds,
		Real_CallbackFunction, (PSVOID*)nNewSubscribe++, &nSubscribeID, &pAPIErrors);

	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("新建实时订阅失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return 0;
	} 

	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("新建实时订阅部分成功部分失败 订阅号:%u\n", nSubscribeID);	
		for (n = 0; n < nCount; n++)
		{
			printf("\t测点ID:%u 返回 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)pAPIErrors);

	}
	else
	{
		printf("新建实时订阅成功 订阅号:%u\n", nSubscribeID);	
	}
	return nSubscribeID;
}

PSUINT32 testCase_Real_NewSubscribeAndRead()
{
	static PSUINT32 nNewSubscribe = 0;
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 2;
	PSUINT32 pTagIds[2] = {g_TagIds[1], g_TagIds[4]};
	PSUINT32 nSubscribeID = 0;
	PS_DATA *pRealDataList = PSNULL;
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_Real_NewSubscribeAndRead(g_hServer, nCount, pTagIds,
		Real_CallbackFunction, (PSVOID*)nNewSubscribe++, &nSubscribeID, &pRealDataList, &pAPIErrors);

	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("新建实时订阅失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return 0;
	} 

	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("新建实时订阅部分成功部分失败 订阅号:%u\n", nSubscribeID);	
		for (n = 0; n < nCount; n++)
		{
			printf("\t测点ID:%u 返回 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)pAPIErrors);

	}
	else
	{
		printf("新建实时订阅成功 订阅号:%u\n", nSubscribeID);	
	}

	printf("读取实时数据列表:\n");
	for (n = 0; n < nCount; n++)
	{
		printf("\t测点ID:%u 值:%f 质量辍:%u 时间:%s\n", 
			*(pTagIds+n), 
			(pRealDataList+n)->Value.Double, 
			(pRealDataList+n)->Quality, 
			PSTIME2STR((pRealDataList+n)->Time));
	}
	psAPI_Memory_FreeDataList(&pRealDataList, nCount);
	return nSubscribeID;
}

void testCase_Real_AddSubscribe(PSUINT32 nSubscribeID)
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 2;
	PSUINT32 pTagIds[2] = {g_TagIds[3], g_TagIds[4]};
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_Real_AddSubscribe(g_hServer, nSubscribeID, nCount, pTagIds, &pAPIErrors);
	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("增加实时订阅失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return ;
	} 
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("增加实时订阅部分成功部分失败\n");
		for (n = 0; n < nCount; n++)
		{
			printf("\t测点ID:%u 返回 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)pAPIErrors);

	}
	else
	{
		printf("增加实时订阅成功\n");	
	}
}

void testCase_Real_AddSubscribeAndRead(PSUINT32 nSubscribeID)
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PS_DATA *pRealDataList = PSNULL;
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_Real_AddSubscribeAndRead(g_hServer, nSubscribeID, nCount, pTagIds, &pRealDataList,&pAPIErrors);
	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("增加实时订阅失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return ;
	} 
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("增加实时订阅部分成功部分失败\n");
		for (n = 0; n < nCount; n++)
		{
			printf("\t测点ID:%u 返回 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)pAPIErrors);

	}
	else
	{
		printf("增加实时订阅成功\n");	
	}
	printf("读取实时数据列表:\n");
	for (n = 0; n < nCount; n++)
	{
		printf("\t测点ID:%u 值:%f 质量辍:%u 时间:%s\n", 
			*(pTagIds+n), 
			(pRealDataList+n)->Value.Double, 
			(pRealDataList+n)->Quality, 
			PSTIME2STR((pRealDataList+n)->Time));
	}
	psAPI_Memory_FreeDataList(&pRealDataList, nCount);
}

void testCase_Real_DelSubscribe(PSUINT32 nSubscribeID)
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 2;
	PSUINT32 pTagIds[2] = {g_TagIds[3],g_TagIds[2]};
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_Real_DelSubscribe(g_hServer, nSubscribeID, nCount, pTagIds, &pAPIErrors);
	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("删除实时订阅失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return ;
	} 
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("删除实时订阅部分成功部分失败\n");
		for (n = 0; n < nCount; n++)
		{
			printf("\t测点ID:%u 返回 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)pAPIErrors);

	}
	else
	{
		printf("删除实时订阅成功\n");	
	}
}

void testCase_Real_DelSubscribeAll(PSUINT32 nSubscribeID)
{
	PSAPIStatus nRet = PSRET_OK;
	nRet = psAPI_Real_DelSubscribeAll(g_hServer, nSubscribeID);
	if (PSERR(nRet))
	{
		printf("删除订阅号%u下的所有实时订阅失败%s\n", nSubscribeID, psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("删除订阅号%u下的所有实时订阅成功\n", nSubscribeID);
	}
}

void RealSubscribeTest()
{
	PSUINT32 nSubscribeID = 0;
	char ch;

	printf("===============================================================\n");
	printf("===实时订阅相关函数测试\n");

	testCase_Server_Connect();
	testCase_AddTag();

	printf("\t按N新建实时订阅测试\n");
	printf("\t按M新建实时订阅并得到初值测试\n");
	printf("\t按A在上次订阅号下增加实时订阅测试\n");
	printf("\t按R在上次订阅号下增加实时订阅并得到初值测试\n");
	printf("\t按D在上次订阅号下删除实时订阅测试\n");
	printf("\t按B删除上次订阅号的所有订阅\n");
	printf("\t按C删除所有订阅号的订阅\n");
	printf("\t按W写相关测点实时数据\n");
	printf("\t按Q退出实时订阅测试\n");
	while(PSTRUE)
	{
		ch = getchar();
		if (ch == 'n' || ch == 'N')
		{
			nSubscribeID = testCase_Real_NewSubscribe();
		}
		if (ch == 'm' || ch == 'M')
		{
			nSubscribeID = testCase_Real_NewSubscribeAndRead();
		}
		if (ch == 'a' || ch == 'A')
		{
			if (nSubscribeID != 0)
			{
				testCase_Real_AddSubscribe(nSubscribeID);
			}
		}
		if (ch == 'r' || ch == 'R')
		{
			if (nSubscribeID != 0)
			{
				testCase_Real_AddSubscribeAndRead(nSubscribeID);
			}
		}
		if (ch == 'd' || ch == 'D')
		{
			if (nSubscribeID != 0)
			{
				testCase_Real_DelSubscribe(nSubscribeID);
			}
		}
		if (ch == 'b' || ch == 'B')
		{
			if (nSubscribeID != 0)
			{
				testCase_Real_DelSubscribeAll(nSubscribeID);
			}
		}
		if (ch == 'c' || ch == 'C')
		{
			testCase_Real_DelSubscribeAll(0);
		}
		if (ch == 'w' || ch == 'W')
		{
			testCase_Real_WriteList_Subscribe();
		}
		if (ch == 'q' || ch == 'Q')
		{
			break;
		}
		if (ch == 'h' || ch == 'H')
		{
			printf("\t按N新建实时订阅测试\n");
			printf("\t按M新建实时订阅并得到初值测试\n");
			printf("\t按A在上次订阅号下增加实时订阅测试\n");
			printf("\t按R在上次订阅号下增加实时订阅并得到初值测试\n");
			printf("\t按D在上次订阅号下删除实时订阅测试\n");
			printf("\t按B删除上次订阅号的所有订阅\n");
			printf("\t按C删除所有订阅号的订阅\n");
			printf("\t按W写相关测点实时数据\n");
			printf("\t按Q退出实时订阅测试\n");
		}
	}

	testCase_DelTag();
	testCase_Server_Disconnect();

	printf("===实时订阅相关函数测试结束\n");
}

void RealTest()
{
	printf("===============================================================\n");
	printf("===实时相关函数测试\n");

	testCase_Server_Connect();
	testCase_AddTag();

	testCase_Real_Write();
	testCase_Real_Read();
	
	testCase_Real_WriteList();
	testCase_Real_ReadList();
	testCase_Real_WriteListAsyn();
	testCase_Real_ReadListAsyn();

	printf("正在等待异步返回... 按任意键退出\n");
	getchar();

	testCase_DelTag();
	testCase_Server_Disconnect();

	printf("===实时相关函数测试结束\n");

}