#include "../psAPISDK.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "psAPITest.h"

void testCase_His_ReadRaw()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_TIME EndTime = {time(NULL), 0};
	PS_TIME StartTime = {EndTime.Second-3600, 0};
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PS_HIS_DATA *pHisDataList = PSNULL;
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;
	PSUINT32 m = 0;

	nRet = psAPI_His_ReadRaw(g_hServer, StartTime, EndTime, 0, PSFALSE, nCount, 
		pTagIds, &pHisDataList, &pAPIErrors);

	if ( PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("查询一批测点一段时间的原始历史数据失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}

	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("查询一批测点一段时间的原始历史数据部分成功部分失败\n");
	}
	else
	{
		printf("查询一批测点一段时间的原始历史数据成功\n");
	}

	for (n = 0; n < nCount; n++)
	{
		if (nRet == PSERR_FAIL_IN_BATCH 
			&& PSERR(*(pAPIErrors+n))
			&& *(pAPIErrors+n)!=PSERR_HIS_MOREDATA)
		{
			continue;
		}
		printf("\t测点ID%u 统计项%u 历史数据个数%u\n", 
			(pHisDataList+n)->TagId, (pHisDataList+n)->Aggregate, (pHisDataList+n)->DataCount);
		for (m = 0; m < (pHisDataList+n)->DataCount; m++)
		{
			printf("\t\t值:%.4f\t质量辍:%u\t时间:%s\n", 
				((pHisDataList+n)->DataList+m)->Value.Double, 
				((pHisDataList+n)->DataList+m)->Quality, 
				PSTIME2STR(((pHisDataList+n)->DataList+m)->Time));
		}
	}
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
	}
	psAPI_Memory_FreeTagHisDataList(&pHisDataList, nCount);
}

void testCase_His_ReadAtTime()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nNumTimeStamps = 60;
	PS_TIME pTimeStamps[60] = {0};
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PS_HIS_DATA *pHisDataList = PSNULL;
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;
	PSUINT32 m = 0;

	pTimeStamps[0].Second =time(NULL)-10*nNumTimeStamps;
	for (n = 1; n < nNumTimeStamps; n++)
	{
		pTimeStamps[n].Second = pTimeStamps[n-1].Second + 10;
	}

	nRet = psAPI_His_ReadAtTime(g_hServer, nNumTimeStamps, pTimeStamps, 
		nCount, pTagIds, &pHisDataList, &pAPIErrors);

	if ( PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("查询一批测点固定时间的历史数据失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}

	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("查询一批测点固定时间的历史数据部分成功部分失败\n");
	}
	else
	{
		printf("查询一批测点固定时间的历史数据成功\n");
	}

	for (n = 0; n < nCount; n++)
	{
		if (nRet == PSERR_FAIL_IN_BATCH && PSERR(*(pAPIErrors+n)))
		{
			continue;
		}
		printf("\t测点ID%u 统计项%u 历史数据个数%u\n", 
			(pHisDataList+n)->TagId, (pHisDataList+n)->Aggregate, (pHisDataList+n)->DataCount);
		for (m = 0; m < (pHisDataList+n)->DataCount; m++)
		{
			printf("\t\t值:%.8f\t质量辍:%u\t时间:%s\n", 
				((pHisDataList+n)->DataList+m)->Value.Double, 
				((pHisDataList+n)->DataList+m)->Quality, 
				PSTIME2STR(((pHisDataList+n)->DataList+m)->Time));
		}
	}
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
	}
	psAPI_Memory_FreeTagHisDataList(&pHisDataList, nCount);
}

void testCase_His_ReadProcessed()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_TIME EndTime = {time(NULL), 0};
	PS_TIME StartTime = {EndTime.Second-36000, 0};
	PS_TIME ResampleInterval = {6,0};
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PSUINT32 pAggregates[3] = {PS_HIS_TOTAL, PS_HIS_INTERPOLATIVE, PS_HIS_NOAGGREGATE};
	PS_HIS_DATA *pHisDataList = PSNULL;
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;
	PSUINT32 m = 0;

	nRet = psAPI_His_ReadProcessed(g_hServer, StartTime, EndTime, ResampleInterval,
		nCount, pTagIds, pAggregates, &pHisDataList, &pAPIErrors);

	if ( PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("查询一批测点一段时间的历史统计数据失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}

	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("查询一批测点一段时间的历史统计数据部分成功部分失败\n");
	}
	else
	{
		printf("查询一批测点一段时间的历史统计数据成功\n");
	}

	for (n = 0; n < nCount; n++)
	{
		if (nRet == PSERR_FAIL_IN_BATCH && PSERR(*(pAPIErrors+n)))
		{
			continue;
		}
		printf("\t测点ID%u 统计项%u 历史数据个数%u\n", 
			(pHisDataList+n)->TagId, (pHisDataList+n)->Aggregate, (pHisDataList+n)->DataCount);
		for (m = 0; m < (pHisDataList+n)->DataCount; m++)
		{
			printf("\t\t值:%.8f\t质量辍:%u\t时间:%s\n", 
				((pHisDataList+n)->DataList+m)->Value.Double, 
				((pHisDataList+n)->DataList+m)->Quality, 
				PSTIME2STR(((pHisDataList+n)->DataList+m)->Time));
		}
	}
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
	}
	psAPI_Memory_FreeTagHisDataList(&pHisDataList, nCount);
}

void testCase_His_Insert()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PS_VARIANT pDataValues[3] = {0};
	PS_TIME  pTimeStamps[3] = {0};
	PSUINT32 pQualities[3] = {0};
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	pDataValues[0].DataType = PSDATATYPE_DOUBLE;
	pDataValues[1].DataType = PSDATATYPE_DOUBLE;
	pDataValues[2].DataType = PSDATATYPE_DOUBLE;

	pDataValues[0].Double = rand();
	pDataValues[1].Double = rand();
	pDataValues[2].Double = rand();

	pTimeStamps[0].Second = time(NULL) - 3600;
	pTimeStamps[1].Second = pTimeStamps[0].Second + 30;
	pTimeStamps[2].Second = pTimeStamps[0].Second + 60;

	pQualities[0] = PS_QUALITY_RAW;
	pQualities[1] = PS_QUALITY_RAW;
	pQualities[2] = PS_QUALITY_RAW;

	nRet = psAPI_His_Insert(g_hServer, nCount, pTagIds,
			pDataValues, pTimeStamps, pQualities, &pAPIErrors);

	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("插入一批测点的历史数据错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("插入一批测点的历史数据 部分成功部分失败\n");
		for(n = 0; n < nCount; n++)
		{
			printf("\t测点ID%u错误 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
	}
	else
	{
		printf("插入一批测点的历史数据成功 \n");
	}
}

void testCase_His_Replace()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PS_VARIANT pDataValues[3] = {0};
	PS_TIME  pTimeStamps[3] = {0};
	PSUINT32 pQualities[3] = {0};
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	pDataValues[0].DataType = PSDATATYPE_DOUBLE;
	pDataValues[1].DataType = PSDATATYPE_DOUBLE;
	pDataValues[2].DataType = PSDATATYPE_DOUBLE;

	pDataValues[0].Double = rand();
	pDataValues[1].Double = rand();
	pDataValues[2].Double = rand();

	pTimeStamps[0].Second = time(NULL) - 3600;
	pTimeStamps[1].Second = pTimeStamps[0].Second + 30;
	pTimeStamps[2].Second = pTimeStamps[0].Second + 60;

	pQualities[0] = PS_QUALITY_RAW;
	pQualities[1] = PS_QUALITY_RAW;
	pQualities[2] = PS_QUALITY_RAW;

	nRet = psAPI_His_Replace(g_hServer, nCount, pTagIds,
		pDataValues, pTimeStamps, pQualities, &pAPIErrors);

	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("替换一批测点的历史数据 错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("替换一批测点的历史数据 部分成功部分失败\n");
		for(n = 0; n < nCount; n++)
		{
			printf("\t测点ID%u错误 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
	}
	else
	{
		printf("替换一批测点的历史数据成功 \n");
	}
}

void testCase_His_InsertReplace()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PS_VARIANT pDataValues[3] = {0};
	PS_TIME  pTimeStamps[3] = {0};
	PSUINT32 pQualities[3] = {0};
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	pDataValues[0].DataType = PSDATATYPE_DOUBLE;
	pDataValues[1].DataType = PSDATATYPE_DOUBLE;
	pDataValues[2].DataType = PSDATATYPE_DOUBLE;

	pDataValues[0].Double = rand();
	pDataValues[1].Double = rand();
	pDataValues[2].Double = rand();

	pTimeStamps[0].Second = time(NULL) - 3600;
	pTimeStamps[1].Second = pTimeStamps[0].Second + 30;
	pTimeStamps[2].Second = pTimeStamps[0].Second + 60;

	pQualities[0] = PS_QUALITY_RAW;
	pQualities[1] = PS_QUALITY_RAW;
	pQualities[2] = PS_QUALITY_RAW;

	nRet = psAPI_His_InsertReplace(g_hServer, nCount, pTagIds,
		pDataValues, pTimeStamps, pQualities, &pAPIErrors);

	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("插入替换一批测点的历史数据 错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("插入替换一批测点的历史数据 部分成功部分失败\n");
		for(n = 0; n < nCount; n++)
		{
			printf("\t测点ID%u错误 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
	}
	else
	{
		printf("插入替换一批测点的历史数据成功 \n");
	}
}

void testCase_His_DeleteRaw()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_TIME EndTime = {time(NULL), 0};
	PS_TIME StartTime = {EndTime.Second-3600, 0};
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_His_DeleteRaw(g_hServer, StartTime, EndTime, nCount, pTagIds, &pAPIErrors);
	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("删除一批测点一段时间的历史数据 错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("删除一批测点一段时间的历史数据 部分成功部分失败\n");
		for(n = 0; n < nCount; n++)
		{
			printf("\t测点ID%u错误 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
	}
	else
	{
		printf("删除一批测点一段时间的历史数据成功 \n");
	}
}

void testCase_His_DeleteAtTime()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PS_TIME  pTimeStamps[3] = {0};
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	pTimeStamps[0].Second = time(NULL) - 3600;
	pTimeStamps[1].Second = pTimeStamps[0].Second + 30;
	pTimeStamps[2].Second = pTimeStamps[0].Second + 60;

	nRet = psAPI_His_DeleteAtTime(g_hServer, nCount, pTagIds, pTimeStamps, &pAPIErrors);
	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("删除一批测点固定时间的历史数据 错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("删除一批测点固定时间的历史数据 部分成功部分失败\n");
		for(n = 0; n < nCount; n++)
		{
			printf("\t测点ID%u错误 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
	}
	else
	{
		printf("删除一批测点固定时间的历史数据成功 \n");
	}
}

//////////////////////////////////////////////////////////////////////////
//异步函数测试
PSUINT32 g_nRunCount = 0;
PSVOID PSAPI His_ReadAsynComplete(
	PSIN PSHANDLE hServer,
	PSIN PSVOID *pUserPara,
	PSIN PSUINT32 nCount,
	PSIN PS_HIS_DATA *pHisDataList,
	PSIN PSAPIStatus nRet,
	PSIN PSAPIStatus *pAPIErrors
	)
{
	PSUINT32 nRunPara = (PSUINT32)pUserPara;
	PSUINT32 n = 0;
	PSUINT32 m = 0;
	if ( PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("异步读取历史数据列表失败 自定义参数:%u 错误 %s\n", nRunPara,  psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("异步读取历史数据列表: 自定义参数:%u\n", nRunPara);
	for (n = 0; n < nCount; n++)
	{
		printf("\t测点ID%u 统计项%u 历史数据个数%u\n", 
			(pHisDataList+n)->TagId, (pHisDataList+n)->Aggregate, (pHisDataList+n)->DataCount);
		for (m = 0; m < (pHisDataList+n)->DataCount; m++)
		{
			printf("\t\t值:%s\t质量辍:%u\t时间:%s\n", 
				PSVARIANT2STR(&(((pHisDataList+n)->DataList+m)->Value)), 
				((pHisDataList+n)->DataList+m)->Quality, 
				PSTIME2STR(((pHisDataList+n)->DataList+m)->Time));
		}
	}
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("异步读取历史数据列表 有部分成功部分失败:\n");
		for (n = 0; n < nCount; n++)
		{
			printf("\t测点ID%u错误 %s\n", (pHisDataList+n)->TagId, psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
	}
}

PSVOID PSAPI His_WriteAsynComplete(
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
		printf("异步修改历史数据列表失败 自定义参数:%u 错误 %s\n", nRunCount,  psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("异步修改历史数据列表成功 自定义参数:%u\n", nRunCount);
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("异步修改历史数据列表 有部分成功部分失败:\n");
		for (n = 0; n < nCount; n++)
		{
			printf("\t测点ID%u错误 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
	}
}

void testCase_His_ReadRawAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_TIME EndTime = {time(NULL), 0};
	PS_TIME StartTime = {EndTime.Second-3600, 0};
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};

	nRet = psAPI_His_ReadRawAsyn(g_hServer, StartTime, EndTime, 0, PSTRUE, nCount, 
		pTagIds, His_ReadAsynComplete, (PSVOID*)++g_nRunCount);

	if (PSERR(nRet))
	{
		printf("异步查询一批测点一段时间的历史数据失败 错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("异步查询一批测点一段时间的历史数据执行成功,自定义参数:%u 正在等待返回...\n", g_nRunCount);
}

void testCase_His_ReadAtTimeAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nNumTimeStamps = 60;
	PS_TIME pTimeStamps[60] = {0};
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PSUINT32 n = 0;
	PSUINT32 m = 0;

	pTimeStamps[0].Second =time(NULL)-10*nNumTimeStamps;
	for (n = 1; n < nNumTimeStamps; n++)
	{
		pTimeStamps[n].Second = pTimeStamps[n-1].Second + 10;
	}

	nRet = psAPI_His_ReadAtTimeAsyn(g_hServer, nNumTimeStamps, pTimeStamps, 
		nCount, pTagIds, His_ReadAsynComplete, (PSVOID*)++g_nRunCount);
	if (PSERR(nRet))
	{
		printf("异步查询一批测点固定时间的历史数据失败 错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("异步查询一批测点固定时间的历史数据执行成功,自定义参数:%u 正在等待返回...\n", g_nRunCount);
}

void testCase_His_ReadProcessedAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_TIME EndTime = {time(NULL), 0};
	PS_TIME StartTime = {EndTime.Second-3600, 0};
	PS_TIME ResampleInterval = {600,0};
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PSUINT32 pAggregates[3] = {PS_HIS_TOTAL, PS_HIS_INTERPOLATIVE, PS_HIS_NOAGGREGATE};
	PSUINT32 n = 0;
	PSUINT32 m = 0;

	nRet = psAPI_His_ReadProcessedAsyn(g_hServer, StartTime, EndTime, ResampleInterval,
		nCount, pTagIds, pAggregates, His_ReadAsynComplete, (PSVOID*)++g_nRunCount);

	if (PSERR(nRet))
	{
		printf("异步查询一批测点一段时间的历史统计数据失败 错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("异步查询一批测点一段时间的历史统计数据执行成功,自定义参数:%u 正在等待返回...\n", g_nRunCount);
}

void testCase_His_InsertAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PS_VARIANT pDataValues[3] = {0};
	PS_TIME  pTimeStamps[3] = {0};
	PSUINT32 pQualities[3] = {0};
	PSUINT32 n = 0;

	pDataValues[0].DataType = PSDATATYPE_DOUBLE;
	pDataValues[1].DataType = PSDATATYPE_DOUBLE;
	pDataValues[2].DataType = PSDATATYPE_DOUBLE;

	pDataValues[0].Double = rand();
	pDataValues[1].Double = rand();
	pDataValues[2].Double = rand();

	pTimeStamps[0].Second = time(NULL) - 3600;
	pTimeStamps[1].Second = pTimeStamps[0].Second + 30;
	pTimeStamps[2].Second = pTimeStamps[0].Second + 60;

	pQualities[0] = PS_QUALITY_RAW;
	pQualities[1] = PS_QUALITY_RAW;
	pQualities[2] = PS_QUALITY_RAW;

	nRet = psAPI_His_InsertAsyn(g_hServer, nCount, pTagIds,
		pDataValues, pTimeStamps, pQualities, His_WriteAsynComplete, (PSVOID*)++g_nRunCount);

	if (PSERR(nRet))
	{
		printf("异步插入一批测点的历史数据失败 错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("异步插入一批测点的历史数据执行成功,自定义参数:%u 正在等待返回...\n", g_nRunCount);
}

void testCase_His_ReplaceAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PS_VARIANT pDataValues[3] = {0};
	PS_TIME  pTimeStamps[3] = {0};
	PSUINT32 pQualities[3] = {0};
	PSUINT32 n = 0;

	pDataValues[0].DataType = PSDATATYPE_DOUBLE;
	pDataValues[1].DataType = PSDATATYPE_DOUBLE;
	pDataValues[2].DataType = PSDATATYPE_DOUBLE;

	pDataValues[0].Double = rand();
	pDataValues[1].Double = rand();
	pDataValues[2].Double = rand();

	pTimeStamps[0].Second = time(NULL) - 3600;
	pTimeStamps[1].Second = pTimeStamps[0].Second + 30;
	pTimeStamps[2].Second = pTimeStamps[0].Second + 60;

	pQualities[0] = PS_QUALITY_RAW;
	pQualities[1] = PS_QUALITY_RAW;
	pQualities[2] = PS_QUALITY_RAW;

	nRet = psAPI_His_ReplaceAsyn(g_hServer, nCount, pTagIds,
		pDataValues, pTimeStamps, pQualities, His_WriteAsynComplete, (PSVOID*)++g_nRunCount);

	if (PSERR(nRet))
	{
		printf("异步替换一批测点的历史数据失败 错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("异步替换一批测点的历史数据执行成功,自定义参数:%u 正在等待返回...\n", g_nRunCount);
}

void testCase_His_InsertReplaceAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PS_VARIANT pDataValues[3] = {0};
	PS_TIME  pTimeStamps[3] = {0};
	PSUINT32 pQualities[3] = {0};
	PSUINT32 n = 0;

	pDataValues[0].DataType = PSDATATYPE_DOUBLE;
	pDataValues[1].DataType = PSDATATYPE_DOUBLE;
	pDataValues[2].DataType = PSDATATYPE_DOUBLE;

	pDataValues[0].Double = rand();
	pDataValues[1].Double = rand();
	pDataValues[2].Double = rand();

	pTimeStamps[0].Second = time(NULL) - 3600;
	pTimeStamps[1].Second = pTimeStamps[0].Second + 30;
	pTimeStamps[2].Second = pTimeStamps[0].Second + 60;

	pQualities[0] = PS_QUALITY_RAW;
	pQualities[1] = PS_QUALITY_RAW;
	pQualities[2] = PS_QUALITY_RAW;

	nRet = psAPI_His_InsertReplaceAsyn(g_hServer, nCount, pTagIds,
		pDataValues, pTimeStamps, pQualities, His_WriteAsynComplete, (PSVOID*)++g_nRunCount);

	if (PSERR(nRet))
	{
		printf("异步替换插入一批测点的历史数据失败 错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("异步替换插入一批测点的历史数据执行成功,自定义参数:%u 正在等待返回...\n", g_nRunCount);
}

void testCase_His_DeleteAtTimeAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PS_TIME  pTimeStamps[3] = {0};
	PSUINT32 n = 0;

	pTimeStamps[0].Second = time(NULL) - 3600;
	pTimeStamps[1].Second = pTimeStamps[0].Second + 30;
	pTimeStamps[2].Second = pTimeStamps[0].Second + 60;

	nRet = psAPI_His_DeleteAtTimeAsyn(g_hServer, nCount, pTagIds, pTimeStamps, His_WriteAsynComplete, (PSVOID*)++g_nRunCount);
	if (PSERR(nRet))
	{
		printf("异步删除一批测点固定时间的历史数据失败 错误%s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("异步删除一批测点固定时间的历史数据执行成功,自定义参数:%u 正在等待返回...\n", g_nRunCount);
}

void testCase_His_DeleteRawAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_TIME EndTime = {time(NULL), 0};
	PS_TIME StartTime = {EndTime.Second-3600, 0};
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[4]};
	PSUINT32 n = 0;

	nRet = psAPI_His_DeleteRawAsyn(g_hServer, StartTime, EndTime, nCount, pTagIds, His_WriteAsynComplete, (PSVOID*)++g_nRunCount);
	if (PSERR(nRet))
	{
		printf("异步删除一批测点一段时间的历史数据失败 错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	printf("异步删除一批测点一段时间的历史数据执行成功,自定义参数:%u 正在等待返回...\n", g_nRunCount);
}

void HisTest()
{
	printf("===============================================================\n");
	printf("===历史相关函数测试\n");

	testCase_Server_Connect();
	testCase_AddTag();

	testCase_His_ReadRaw();
	testCase_His_ReadAtTime();
	testCase_His_ReadProcessed();
	testCase_His_Insert();
	testCase_His_Replace();
	testCase_His_InsertReplace();
	testCase_His_ReadRaw();
	testCase_His_DeleteRaw();
	testCase_His_ReadRaw();
	testCase_His_DeleteAtTime();


	testCase_His_ReadRawAsyn();
	testCase_His_ReadAtTimeAsyn();
	testCase_His_ReadProcessedAsyn();

	testCase_His_ReplaceAsyn();
	testCase_His_InsertAsyn();
	testCase_His_InsertReplaceAsyn();

	testCase_His_ReadRawAsyn();
	testCase_His_ReadAtTimeAsyn();
	testCase_His_ReadProcessedAsyn();

	testCase_His_DeleteRawAsyn();
	testCase_His_DeleteAtTimeAsyn();

	testCase_His_ReadRawAsyn();

	printf("正在等待异步返回... 按任意键退出\n");
	getchar();

	testCase_DelTag();
	testCase_Server_Disconnect();

	printf("===历史相关函数测试结束\n");

}