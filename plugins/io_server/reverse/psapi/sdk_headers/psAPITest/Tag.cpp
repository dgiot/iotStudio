#include "psAPITest.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>

PSUINT32 g_TagIds[5] = {PSTAGID_UNUSED, PSTAGID_UNUSED, PSTAGID_UNUSED, PSTAGID_UNUSED, PSTAGID_UNUSED};

void testCase_TagType_GetTagTypeList()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nTagTypeCount = 0;
	PS_TAG_TYPE_INFO *pTagTypes = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_TagType_GetTagTypeList(g_hServer, &nTagTypeCount, PSNULL);
	if (PSERR(nRet))
	{
		printf("获取测点类型数量失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));	
	}
	else
	{
		printf("获取测点类型数量成功%d\n", nTagTypeCount);
	}

	nRet = psAPI_TagType_GetTagTypeList(g_hServer, &nTagTypeCount, &pTagTypes);
	if (PSERR(nRet))
	{
		printf("获取测点类型失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取测点类型成功 服务器支持测点类型数量%d\n",  nTagTypeCount);
	for (n = 0; n < nTagTypeCount; n++)
	{
		printf("\t测点类型ID:%d 名称:%s 描述:%s\n", 
			(pTagTypes+n)->Id, (pTagTypes+n)->Name, (pTagTypes+n)->Desc);
	}
	psAPI_Memory_FreeTagTypeList(&pTagTypes, nTagTypeCount);
}

void testCase_TagType_GetPropList()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT16 nTagType = PSTAGTYPE_NODE;
	PSUINT32 nTagPropCount = 0;
	PS_TAG_PROP_INFO *pTagPropInfos = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_TagType_GetPropList(g_hServer, nTagType, &nTagPropCount, PSNULL);
	if (PSERR(nRet))
	{
		printf("获取测点类型%d属性数量失败 %s\n", nTagType, psAPI_Commom_GetErrorDesc(nRet));	
	}
	else
	{
		printf("获取测点类型%d属性数量成功%d\n", nTagType, nTagPropCount);
	}

	nRet = psAPI_TagType_GetPropList(g_hServer, nTagType, &nTagPropCount, &pTagPropInfos);
	if (PSERR(nRet))
	{
		printf("获取测点类型属性数量失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取测点类型属性数量成功 测点类型%d的所以属性数量%d\n", nTagType, nTagPropCount);
	for (n = 0; n < nTagPropCount; n++)
	{
		printf("\t属性ID:%d\t名称:%s\t数据类型:%d\t只读:%d\t描述:%s\n", 
			(pTagPropInfos+n)->Id, (pTagPropInfos+n)->Name, 
			(pTagPropInfos+n)->DataType, (pTagPropInfos+n)->ReadOnly, (pTagPropInfos+n)->Desc);
	}
	psAPI_Memory_FreeTagPropInfoList(&pTagPropInfos, nTagPropCount);
}

void testCase_TagType_GetId()
{
	PSAPIStatus nRet = PSRET_OK;
	PSSTR pszPropName = (PSSTR)"Name";
	PSUINT16 nPropId = 0;

	nRet = psAPI_TagType_GetId(g_hServer, pszPropName, &nPropId);
	if (PSERR(nRet))
	{
		printf("获取属性名称%s对应的属性ID失败 %s\n", pszPropName, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取属性名称%s对应的属性ID%d成功\n", pszPropName, nPropId);
}

//////////////////////////////////////////////////////////////////////////
void task_GetAllTagTypeAndProp()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nTagTypeCount = 0;
	PS_TAG_TYPE_INFO *pTagTypes = PSNULL;

	PSUINT32 nTagPropCount = 0;
	PS_TAG_PROP_INFO *pTagPropInfos = PSNULL;
	PSUINT32 n = 0;
	PSUINT32 m = 0;

	nRet = psAPI_TagType_GetTagTypeList(g_hServer, &nTagTypeCount, &pTagTypes);
	if (PSERR(nRet))
	{
		printf("获取所以测点类型失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取所以测点类型成功 服务器支持测点类型数量%d\n",  nTagTypeCount);
	for (n = 0; n < nTagTypeCount; n++)
	{
		printf("\t测点类型ID:%d 名称:%s 描述:%s\n", 
			(pTagTypes+n)->Id, (pTagTypes+n)->Name, (pTagTypes+n)->Desc);

		nRet = psAPI_TagType_GetPropList(g_hServer, (pTagTypes+n)->Id, &nTagPropCount, &pTagPropInfos);
		if (PSERR(nRet))
		{
			printf("\t\t获取测点类型%d的所有属性失败 %s\n", (pTagTypes+n)->Id, psAPI_Commom_GetErrorDesc(nRet));
			continue;
		}
		for (m = 0; m < nTagPropCount; m++)
		{
			printf("\t\t属性ID:%d\t名称:%s\t数据类型:%d\t只读:%d\t描述:%s\n", 
				(pTagPropInfos+m)->Id, (pTagPropInfos+m)->Name, 
				(pTagPropInfos+m)->DataType, (pTagPropInfos+m)->ReadOnly, (pTagPropInfos+m)->Desc);
		}
		psAPI_Memory_FreeTagPropInfoList(&pTagPropInfos, nTagPropCount);
	}
	printf("获取所有点的属性\n");
	nRet = psAPI_TagType_GetPropList(g_hServer, PSTAGTYPE_ALL, &nTagPropCount, &pTagPropInfos);
	if (PSERR(nRet))
	{
		printf("\t\t获取测点类型%d的所有属性失败 %s\n", PSTAGTYPE_ALL, psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		for (m = 0; m < nTagPropCount; m++)
		{
			printf("\t\t属性ID:%d\t名称:%s\t数据类型:%d\t只读:%d\t描述:%s\n", 
				(pTagPropInfos+m)->Id, (pTagPropInfos+m)->Name, 
				(pTagPropInfos+m)->DataType, (pTagPropInfos+m)->ReadOnly, (pTagPropInfos+m)->Desc);
		}
		psAPI_Memory_FreeTagPropInfoList(&pTagPropInfos, nTagPropCount);
	}

	psAPI_Memory_FreeTagTypeList(&pTagTypes, nTagTypeCount);
}

//////////////////////////////////////////////////////////////////////////

void testCase_Tag_Add()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nParentTagId = PSTAGID_ROOT;
	PSSTR pszTagName = (PSSTR)"testCase_Node1";
	PSUINT32 nTagId = 0;
	PSUINT32 nPropCount = 2;
	PSUINT16 pPropIds[2] = {PS_TAG_PROP_NAME, PS_TAG_PROP_TAGTYPE};
	PS_VARIANT pPropValues[2] = {0};

	pPropValues[0].DataType = PSDATATYPE_STRING;
	pPropValues[0].String.Data = pszTagName;
	pPropValues[0].String.Length = strlen(pPropValues[0].String.Data);

	pPropValues[1].DataType = PSDATATYPE_UINT16;
	pPropValues[1].UInt16 = PSTAGTYPE_NODE;

	nRet = psAPI_Tag_Add(g_hServer, nParentTagId, nPropCount, pPropIds, pPropValues, &nTagId);
	if (PSERR(nRet))
	{
		printf("增加测点%s失败 %s\n", pszTagName, psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		g_TagIds[0] = nTagId;
		printf("增加测点%s成功返回ID%u\n", pszTagName, nTagId);
	}
}

void testCase_Tag_AddList()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nParentTagId = g_TagIds[0];
	PSUINT32 nCount = 3;
	PS_TAG_PROP_LIST pTagPropValues[3] = {0};

	PSUINT32 *pTagIds = PSNULL;
	PSAPIStatus *pAPIErrors = PSNULL;

	PSSTR pszTagName1 = (PSSTR)"testCase_Tag1";
	PSSTR pszTagName2 = (PSSTR)"testCase_Tag2";
	PSSTR pszTagName3 = (PSSTR)"testCase_Tag3";

	PSUINT32 nPropCount = 5;
	PSUINT16 pPropIds[5] = {PS_TAG_PROP_NAME, PS_TAG_PROP_TAGTYPE, PS_TAG_PROP_DATATYPE, PS_TAG_PROP_DESCRIPTION, PS_TAG_PROP_HIS_ISSAVE};
	
	PS_VARIANT pPropValues1[5] = {0};
	PS_VARIANT pPropValues2[5] = {0};
	PS_VARIANT pPropValues3[5] = {0};

	pPropValues1[0].DataType = PSDATATYPE_STRING;
	pPropValues1[0].String.Data = pszTagName1;
	pPropValues1[0].String.Length = strlen(pPropValues1[0].String.Data);

	pPropValues1[1].DataType = PSDATATYPE_UINT16;
	pPropValues1[1].UInt16 = 2;

	pPropValues1[2].DataType = PSDATATYPE_UINT8;
	pPropValues1[2].UInt8 = PSDATATYPE_DOUBLE;

	pPropValues1[3].DataType = PSDATATYPE_STRING;
	pPropValues1[3].String.Data = "psAPISDK测试";
	pPropValues1[3].String.Length = strlen(pPropValues1[3].String.Data);

	pPropValues1[4].DataType = PSDATATYPE_BOOL;
	pPropValues1[4].Bool = PSTRUE;

	pPropValues2[0].DataType = PSDATATYPE_STRING;
	pPropValues2[0].String.Data = pszTagName2;
	pPropValues2[0].String.Length = strlen(pPropValues2[0].String.Data);

	pPropValues2[1].DataType = PSDATATYPE_UINT16;
	pPropValues2[1].UInt16 = 2;

	pPropValues2[2].DataType = PSDATATYPE_UINT8;
	pPropValues2[2].UInt8 = PSDATATYPE_DOUBLE;

	pPropValues2[3].DataType = PSDATATYPE_STRING;
	pPropValues2[3].String.Data = "psAPISDK测试";
	pPropValues2[3].String.Length = strlen(pPropValues2[3].String.Data);

	pPropValues2[4].DataType = PSDATATYPE_BOOL;
	pPropValues2[4].Bool = PSFALSE;

	pPropValues3[0].DataType = PSDATATYPE_STRING;
	pPropValues3[0].String.Data = pszTagName3;
	pPropValues3[0].String.Length = strlen(pPropValues3[0].String.Data);

	pPropValues3[1].DataType = PSDATATYPE_UINT16;
	pPropValues3[1].UInt16 = 1;

	pPropValues3[2].DataType = PSDATATYPE_UINT8;
	pPropValues3[2].UInt8 = PSDATATYPE_BOOL;

	pPropValues3[3].DataType = PSDATATYPE_STRING;
	pPropValues3[3].String.Data = "psAPISDK测试";
	pPropValues3[3].String.Length = strlen(pPropValues3[3].String.Data);

	pPropValues3[4].DataType = PSDATATYPE_BOOL;
	pPropValues3[4].Bool = PSTRUE;

	pTagPropValues[0].PropCount = nPropCount;
	pTagPropValues[0].PropIds = pPropIds;
	pTagPropValues[0].PropValues = pPropValues1;

	pTagPropValues[1].PropCount = nPropCount;
	pTagPropValues[1].PropIds = pPropIds;
	pTagPropValues[1].PropValues = pPropValues2;

	pTagPropValues[2].PropCount = nPropCount;
	pTagPropValues[2].PropIds = pPropIds;
	pTagPropValues[2].PropValues = pPropValues3;

	nRet = psAPI_Tag_AddList(g_hServer, nParentTagId, nCount, pTagPropValues, &pTagIds, &pAPIErrors);

	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("批量添加测点失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("批量添加测点部分成功部分失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		printf("\t添加测点%s返回 %s\n", pszTagName1, psAPI_Commom_GetErrorDesc(pAPIErrors[0]));
		printf("\t添加测点%s返回 %s\n", pszTagName2, psAPI_Commom_GetErrorDesc(pAPIErrors[1]));
		printf("\t添加测点%s返回 %s\n", pszTagName3, psAPI_Commom_GetErrorDesc(pAPIErrors[2]));
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
	}
	printf("添加测点%s返回测点ID%u\n", pszTagName1, pTagIds[0]);
	printf("添加测点%s返回测点ID%u\n", pszTagName2, pTagIds[1]);
	printf("添加测点%s返回测点ID%u\n", pszTagName3, pTagIds[2]);
	g_TagIds[1] = pTagIds[0];
	g_TagIds[2] = pTagIds[1];
	g_TagIds[3] = pTagIds[2];
	psAPI_Memory_FreeAndNull((PSVOID**)&pTagIds);	
}

void testCase_Tag_Delete()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nTagId = g_TagIds[0];
	nRet = psAPI_Tag_Delete(g_hServer, nTagId);
	if (PSERR(nRet))
	{
		printf("删除测点%u失败 %s\n", nTagId, psAPI_Commom_GetErrorDesc(nRet));
	} 
	else
	{
		printf("删除测点%u成功\n", nTagId);
	}
}

void testCase_Tag_DeleteList()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 4;
	PSUINT32 pTagIds[4] = {g_TagIds[1],g_TagIds[2],g_TagIds[3],g_TagIds[4]};
	PSAPIStatus *pAPIErrors = PSNULL;

	nRet = psAPI_Tag_DeleteList(g_hServer, nCount, pTagIds, &pAPIErrors);
	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("删除测点失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	} 
	else if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("删除测点部分成功部分失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		printf("\t删除测点%u返回 %s\n", pTagIds[0], psAPI_Commom_GetErrorDesc(pAPIErrors[0]));
		printf("\t删除测点%u返回 %s\n", pTagIds[1], psAPI_Commom_GetErrorDesc(pAPIErrors[1]));
		printf("\t删除测点%u返回 %s\n", pTagIds[2], psAPI_Commom_GetErrorDesc(pAPIErrors[2]));
		printf("\t删除测点%u返回 %s\n", pTagIds[3], psAPI_Commom_GetErrorDesc(pAPIErrors[3]));
	}
	else
	{
		printf("删除测点成功\n");
	}
}

void testCase_Tag_Copy()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nSourceTagId = g_TagIds[1];
	PSUINT32 nParentTagId = PSTAGID_ROOT;
	PSUINT32 nNewTagId = 0;

	nRet = psAPI_Tag_Copy(g_hServer, nSourceTagId, nParentTagId, &nNewTagId);
	if (PSERR(nRet))
	{
		printf("复制测点%u到节点%u下失败 %s\n", nSourceTagId, nParentTagId, psAPI_Commom_GetErrorDesc(nRet));
	} 
	else
	{
		g_TagIds[4] = nNewTagId;
		printf("复制测点%u到节点%u下成功，新测点ID%u\n", nSourceTagId, nParentTagId, nNewTagId);
	}
}

void testCase_Tag_Move()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nSourceTagId = g_TagIds[2];
	PSUINT32 nParentTagId = PSTAGID_ROOT;

	nRet = psAPI_Tag_Move(g_hServer, nSourceTagId, nParentTagId);
	if (PSERR(nRet))
	{
		printf("移动测点%u到节点%u下失败 %s\n", nSourceTagId, nParentTagId, psAPI_Commom_GetErrorDesc(nRet));
	} 
	else
	{
		printf("移动测点%u到节点%u下成功\n", nSourceTagId, nParentTagId);
	}
}

void testCase_Tag_IsExist()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nTagId = g_TagIds[0];
	PSBOOL bExist = PSFALSE;
	
	nRet = psAPI_Tag_IsExist(g_hServer, nTagId, &bExist);
	if (PSERR(nRet))
	{
		printf("判断ID为%u的测点是否存在失败 %s\n", nTagId, psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("判断ID为%u的测点是否存在成功 返回值%d\n", nTagId, bExist);
	}
}

void testCase_Tag_IsParent()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nFirstTagId = g_TagIds[0];
	PSUINT32 nSecondTagId = g_TagIds[3];
	PSBOOL bParent = PSFALSE;

	nRet = psAPI_Tag_IsParent(g_hServer, nFirstTagId, nSecondTagId, &bParent);
	if (PSERR(nRet))
	{
		printf("判断测点%u是否是测点%u的父节点失败 %s\n", nFirstTagId, nSecondTagId, psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("判断测点%u是否是测点%u的父节点成功 返回值%d\n", nFirstTagId, nSecondTagId, bParent);
	}
}

void testCase_Tag_IsAncestor()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nFirstTagId = PSTAGID_ROOT;
	PSUINT32 nSecondTagId = g_TagIds[3];
	PSBOOL bAncestor = PSFALSE;

	nRet = psAPI_Tag_IsAncestor(g_hServer, nFirstTagId, nSecondTagId, &bAncestor);
	if (PSERR(nRet))
	{
		printf("判断测点%u是否是测点%u的祖先结点失败 %s\n", nFirstTagId, nSecondTagId, psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("判断测点%u是否是测点%u的祖先结点成功 返回值%d\n", nFirstTagId, nSecondTagId, bAncestor);
	}
}

void testCase_Tag_GetIdByLongName()
{
	PSAPIStatus nRet = PSRET_OK;
	PSSTR pszTagLongName = (PSSTR)"/testCase_Node1";
	PSUINT32 nTagId = PSTAGID_UNUSED;

	nRet = psAPI_Tag_GetIdByLongName(g_hServer, pszTagLongName, &nTagId);
	if (PSERR(nRet))
	{
		printf("查询测点长名是%s的ID失败 %s\n", pszTagLongName, psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("查询测点长名是%s的ID成功 返回ID%u\n", pszTagLongName, nTagId);
	}
}

void testCase_Tag_GetIdListByLongName()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 2;
	PSSTR pszTagLongNames[2] = {0};
	PSUINT32 *pTagIds = PSNULL;
	PSAPIStatus *pAPIErrors = PSNULL;

	pszTagLongNames[0] = (PSSTR)"/testCase_Node1";	
	pszTagLongNames[1] = (PSSTR)"/testCase_Node1/testCase_Tag3";
	
	nRet = psAPI_Tag_GetIdListByLongName(g_hServer, nCount, pszTagLongNames, &pTagIds, &pAPIErrors);
	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("查询测点ID列表失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	if (nRet == PSERR_FAIL_IN_BATCH && pAPIErrors != PSNULL)
	{
		printf("查询测点ID列表部分成功部分失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		printf("\t测点%s返回错误 %s\n", pszTagLongNames[0], psAPI_Commom_GetErrorDesc(pAPIErrors[0]));
		printf("\t测点%s返回错误 %s\n", pszTagLongNames[1], psAPI_Commom_GetErrorDesc(pAPIErrors[1]));
		psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
	}
	printf("查询测点ID列表成功\n");
	printf("\t查询测点%s\t返回ID%u \n", pszTagLongNames[0], pTagIds[0]);
	printf("\t查询测点%s\t返回ID%u \n", pszTagLongNames[1], pTagIds[1]);
	psAPI_Memory_FreeAndNull((PSVOID**)&pTagIds);
}

void testCase_Tag_GetTagProps()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nTagId = g_TagIds[0];
	PSUINT32 nPropCount = 2;
	PSUINT16 pPropIds[2] = {PS_TAG_PROP_NAME, PS_TAG_PROP_CREATETIME};
	PS_VARIANT *pPropValues = PSNULL;

	nRet = psAPI_Tag_GetTagProps(g_hServer, nTagId, nPropCount, pPropIds, &pPropValues);
	if (PSERR(nRet))
	{
		printf("获取测点ID%u属性失败 %s\n", nTagId, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	assert(pPropValues[0].DataType == PSDATATYPE_STRING);
	assert(pPropValues[0].String.Data != PSNULL);
	assert(pPropValues[1].DataType == PSDATATYPE_TIME);

	printf("获取测点ID%u属性ID为%d的值:%s\n", nTagId, pPropIds[0], pPropValues[0].String.Data);
	printf("获取测点ID%u属性ID为%d的值:%s\n", nTagId, pPropIds[1], PSTIME2STR(pPropValues[1].Time));

	psAPI_Memory_FreeValueList(&pPropValues, nPropCount);
}

void testCase_Tag_SetTagProps()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nTagId = g_TagIds[0];
	PSUINT32 nPropCount = 2;
	PSUINT16 pPropIds[2] = {PS_TAG_PROP_DESCRIPTION, PS_TAG_PROP_SECURITYAREA};
	PS_VARIANT pPropValues[2] = {0};

	pPropValues[0].DataType = PSDATATYPE_STRING;
	pPropValues[0].String.Data = (PSSTR)("SetTagProps1");
	pPropValues[0].String.Length = strlen(pPropValues[0].String.Data);

	pPropValues[1].DataType = PSDATATYPE_UINT64;
	pPropValues[1].UInt64 = 0x0FFF;

	nRet = psAPI_Tag_SetTagProps(g_hServer, nTagId, nPropCount, pPropIds, pPropValues);
	if (PSERR(nRet))
	{
		printf("设置测点ID%u属性失败 %s\n", nTagId, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("设置测点ID%u属性成功\n", nTagId);
}

void testCase_Tag_GetTagListProps()
{   
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 3;
	PSUINT32 pTagIds[3] = {g_TagIds[1], g_TagIds[2], g_TagIds[3]};
	PSUINT32 nPropCount = 2;
	PSUINT16 pPropIds[2] = {PS_TAG_PROP_DESCRIPTION, PS_TAG_PROP_LONGNAME};
	PS_TAG_PROP_LIST *pTagPropValues = PSNULL;
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;
	PSUINT32 m = 0;

	nRet = psAPI_Tag_GetTagListProps(g_hServer, nCount, pTagIds, nPropCount, pPropIds,
				&pTagPropValues, &pAPIErrors);
	
	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("获取批量测点属性失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return ;
	} 
	
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("获取批量测点属性部分成功部分失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		for (n = 0; n < nCount; n++)
		{
			printf("\t获取批量测点属性测点%u返回 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
	}

	for (n = 0; n < nCount; n++)
	{
		if (nRet == PSERR_FAIL_IN_BATCH && PSERR(pAPIErrors[n]))
		{
			continue;
		}
		assert(pTagPropValues[n].PropCount==nPropCount);
		assert(pTagPropValues[n].PropValues[0].String.Data != PSNULL);
		assert(pTagPropValues[n].PropValues[1].String.Data != PSNULL);

		printf("测点%u返回属性列表\n", pTagIds[n]);
		printf("\t获取测点ID%u属性ID为%d的值:%s\n", pTagIds[n], pTagPropValues[n].PropIds[0],
			pTagPropValues[n].PropValues[0].String.Data);
		printf("\t获取测点ID%u属性ID为%d的值:%s\n", pTagIds[n], pTagPropValues[n].PropIds[1],
			pTagPropValues[n].PropValues[1].String.Data);
	}
	psAPI_Memory_FreeTagPropList(&pTagPropValues, nCount);
	psAPI_Memory_FreeAndNull((PSVOID**)&pAPIErrors);
}

void testCase_Tag_SetTagListProps()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 2;
	PSUINT32 pTagIds[2] = {g_TagIds[2], g_TagIds[3]};
	PS_TAG_PROP_LIST pTagPropValues[2] = {0};
	PSAPIStatus *pAPIErrors = PSNULL;

	PSUINT16 pPropIds1[1] = {PS_TAG_PROP_DESCRIPTION};
	PS_VARIANT pPropValues1[1] = {0};

	PSUINT16 pPropIds2[2] = {PS_TAG_PROP_DESCRIPTION, PS_TAG_PROP_SECURITYAREA};
	PS_VARIANT pPropValues2[2] = {0};

	pPropValues1[0].DataType = PSDATATYPE_STRING;
	pPropValues1[0].String.Data = (PSSTR)"SetTagListProps1";
	pPropValues1[0].String.Length = strlen(pPropValues1[0].String.Data)+1;

	pPropValues2[0].DataType = PSDATATYPE_STRING;
	pPropValues2[0].String.Data = (PSSTR)("SetTagListProps2");
	pPropValues2[0].String.Length = strlen(pPropValues2[0].String.Data)+1;

	pPropValues2[1].DataType = PSDATATYPE_UINT64;
	pPropValues2[1].UInt64 = 0x0FFFFF;

	pTagPropValues[0].PropCount = 1;
	pTagPropValues[0].PropIds = pPropIds1;
	pTagPropValues[0].PropValues = pPropValues1;

	pTagPropValues[1].PropCount = 2;
	pTagPropValues[1].PropIds = pPropIds2;
	pTagPropValues[1].PropValues = pPropValues2;

	nRet = psAPI_Tag_SetTagListProps(g_hServer, nCount, pTagIds, pTagPropValues, &pAPIErrors);
	
	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("设置批量测点属性失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	} 
	else if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("设置批量测点属性部分成功部分失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		printf("\t测点%u返回%s\n", pTagIds[0], psAPI_Commom_GetErrorDesc(pAPIErrors[0]));
		printf("\t测点%u返回%d\n", pTagIds[1], psAPI_Commom_GetErrorDesc(pAPIErrors[1]));
	}
	else
	{
		printf("设置批量测点属性成功\n");
	}
}

void testCase_Tag_Query()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nTagId = PSTAGID_ROOT;

	PS_TAG_QUERY_FILTER filter = {0};
	PSUINT16 FieldPropIds = PS_TAG_PROP_NAME;
	PS_VARIANT FieldPropValues = {0};

	PSUINT32 nPropCount = 2;
	PSUINT16 pPropIds[2] = {PS_TAG_PROP_ID, PS_TAG_PROP_NAME};
	PSUINT32 nCount = 0; 
	PS_TAG_PROP_LIST *pTagPropValues = PSNULL;
	PSUINT32 n = 0;
	PSUINT32 m = 0;

	FieldPropValues.DataType = PSDATATYPE_STRING;
	FieldPropValues.String.Data = (PSSTR)"*testCase*";
	FieldPropValues.String.Length = strlen(FieldPropValues.String.Data)+1;
	filter.QuerySelf = PSFALSE;
	filter.QueryLevel = 1;
	filter.FieldPropCount = 1;
	filter.FieldPropIds = &FieldPropIds;
	filter.FieldPropValues = &FieldPropValues;

	nRet = psAPI_Tag_Query(g_hServer, g_TagIds[0], PSNULL, nPropCount, pPropIds, &nCount, &pTagPropValues);
	if (PSERR(nRet))
	{
		printf("查询%u下所有测点失败 %s\n", g_TagIds[0], psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("查询%u下所有测点成功\n", g_TagIds[0]);
		for(n = 0; n < nCount; n++)
		{
			assert((pTagPropValues+n)->PropCount == nPropCount);
			printf("\t测点名称%s\tID%u\n", (pTagPropValues+n)->PropValues[1].String.Data,
				(pTagPropValues+n)->PropValues[0].UInt32);
		}
		psAPI_Memory_FreeTagPropList(&pTagPropValues, nCount);
	}

	nRet = psAPI_Tag_Query(g_hServer, nTagId, &filter, nPropCount, pPropIds, &nCount, &pTagPropValues);
	if (PSERR(nRet))
	{
		printf("过滤条件查询测点失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("过滤条件查询测点成功\n");
		for(n = 0; n < nCount; n++)
		{
			assert(pTagPropValues->PropCount == nPropCount);
			printf("\t测点名称%s\tID%u\n", (pTagPropValues+n)->PropValues[1].String.Data,
				(pTagPropValues+n)->PropValues[0].UInt32);
		}
		psAPI_Memory_FreeTagPropList(&pTagPropValues, nCount);
	}
}

void testCase_Tag_QueryCount()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nTagId = PSTAGID_ROOT;

	PS_TAG_QUERY_FILTER filter = {0};
	PSUINT16 FieldPropIds = PS_TAG_PROP_NAME;
	PS_VARIANT FieldPropValues = {0};

	PSUINT32 nCount = 0; 

	FieldPropValues.DataType = PSDATATYPE_STRING;
	FieldPropValues.String.Data = (PSSTR)"*testCase*";
	FieldPropValues.String.Length = strlen(FieldPropValues.String.Data)+1;
	filter.QuerySelf = PSFALSE;
	filter.QueryLevel = 1;
	filter.FieldPropCount = 1;
	filter.FieldPropIds = &FieldPropIds;
	filter.FieldPropValues = &FieldPropValues;

	nRet = psAPI_Tag_QueryCount(g_hServer, nTagId, &filter, &nCount);
	if (PSERR(nRet))
	{
		printf("过滤条件查询测点数量失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("过滤条件查询测点数量成功 返回值%d\n", nCount);
	}
	nRet = psAPI_Tag_QueryCount(g_hServer, g_TagIds[0], NULL, &nCount);
	if (PSERR(nRet))
	{
		printf("查询%u下所有测点数量失败 %s\n", g_TagIds[0],  psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("查询%u下所有测点数量成功 返回值%d\n", g_TagIds[0], nCount);
	}
}
//////////////////////////////////////////////////////////////////////////
//测点异步函数
PSVOID PSAPI Tag_AddListAsynComplete(
							 PSIN PSHANDLE hServer,
							 PSIN PSVOID *pUserPara,
							 PSIN PSUINT32 nCount,
							 PSIN PSUINT32 *pTagIds,
							 PSIN PSAPIStatus nRet,
							 PSIN PSAPIStatus *pAPIErrors)
{
	PSCHAR *pszTagNames = (PSCHAR*)pUserPara;
	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("异步批量添加测点失%s败 %s\n", pszTagNames, psAPI_Commom_GetErrorDesc(nRet));
		free(pszTagNames);
		return;
	}
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("异步批量添加测点%s部分成功部分失败 %s\n", pszTagNames, psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("异步批量添加测点%s成功\n", pszTagNames);
	}
	g_TagIds[1] = pTagIds[0];
	g_TagIds[2] = pTagIds[1];
	g_TagIds[3] = pTagIds[2];
	free(pszTagNames);
}
void testCase_Tag_AddListAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nParentTagId = g_TagIds[0];
	PSUINT32 nCount = 3;
	PS_TAG_PROP_LIST pTagPropValues[3] = {0};

	PSUINT32 *pTagIds = PSNULL;
	PSAPIStatus *pAPIErrors = PSNULL;

	PSSTR pszTagName1 = (PSSTR)"testCase_Tag1";
	PSSTR pszTagName2 = (PSSTR)"testCase_Tag2";
	PSSTR pszTagName3 = (PSSTR)"testCase_Tag3";

	PSUINT32 nPropCount = 5;
	PSUINT16 pPropIds[5] = {PS_TAG_PROP_NAME, PS_TAG_PROP_TAGTYPE, PS_TAG_PROP_DATATYPE, PS_TAG_PROP_DESCRIPTION, PS_TAG_PROP_HIS_ISSAVE};

	PS_VARIANT pPropValues1[5] = {0};
	PS_VARIANT pPropValues2[5] = {0};
	PS_VARIANT pPropValues3[5] = {0};

	//传给异步回调函数的参数
	PSCHAR *pszTagNames = (PSCHAR*)malloc(256);
	memset(pszTagNames, 0, sizeof(PSCHAR)*256);
	strcat(pszTagNames, pszTagName1);
	strcat(pszTagNames, ", ");
	strcat(pszTagNames, pszTagName2);
	strcat(pszTagNames, ", ");
	strcat(pszTagNames, pszTagName3);
	strcat(pszTagNames, "...");

	pPropValues1[0].DataType = PSDATATYPE_STRING;
	pPropValues1[0].String.Data = pszTagName1;
	pPropValues1[0].String.Length = strlen(pPropValues1[0].String.Data);

	pPropValues1[1].DataType = PSDATATYPE_UINT16;
	pPropValues1[1].UInt16 = 2;

	pPropValues1[2].DataType = PSDATATYPE_UINT8;
	pPropValues1[2].UInt8 = PSDATATYPE_DOUBLE;

	pPropValues1[3].DataType = PSDATATYPE_STRING;
	pPropValues1[3].String.Data = "psAPISDK测试";
	pPropValues1[3].String.Length = strlen(pPropValues1[3].String.Data);

	pPropValues1[4].DataType = PSDATATYPE_BOOL;
	pPropValues1[4].Bool = PSTRUE;

	pPropValues2[0].DataType = PSDATATYPE_STRING;
	pPropValues2[0].String.Data = pszTagName2;
	pPropValues2[0].String.Length = strlen(pPropValues2[0].String.Data);

	pPropValues2[1].DataType = PSDATATYPE_UINT16;
	pPropValues2[1].UInt16 = 2;

	pPropValues2[2].DataType = PSDATATYPE_UINT8;
	pPropValues2[2].UInt8 = PSDATATYPE_DOUBLE;

	pPropValues2[3].DataType = PSDATATYPE_STRING;
	pPropValues2[3].String.Data = "psAPISDK测试";
	pPropValues2[3].String.Length = strlen(pPropValues2[3].String.Data);

	pPropValues2[4].DataType = PSDATATYPE_BOOL;
	pPropValues2[4].Bool = PSFALSE;

	pPropValues3[0].DataType = PSDATATYPE_STRING;
	pPropValues3[0].String.Data = pszTagName3;
	pPropValues3[0].String.Length = strlen(pPropValues3[0].String.Data);

	pPropValues3[1].DataType = PSDATATYPE_UINT16;
	pPropValues3[1].UInt16 = 1;

	pPropValues3[2].DataType = PSDATATYPE_UINT8;
	pPropValues3[2].UInt8 = PSDATATYPE_BOOL;

	pPropValues3[3].DataType = PSDATATYPE_STRING;
	pPropValues3[3].String.Data = "psAPISDK测试";
	pPropValues3[3].String.Length = strlen(pPropValues3[3].String.Data);

	pPropValues3[4].DataType = PSDATATYPE_BOOL;
	pPropValues3[4].Bool = PSTRUE;

	pTagPropValues[0].PropCount = nPropCount;
	pTagPropValues[0].PropIds = pPropIds;
	pTagPropValues[0].PropValues = pPropValues1;

	pTagPropValues[1].PropCount = nPropCount;
	pTagPropValues[1].PropIds = pPropIds;
	pTagPropValues[1].PropValues = pPropValues2;

	pTagPropValues[2].PropCount = nPropCount;
	pTagPropValues[2].PropIds = pPropIds;
	pTagPropValues[2].PropValues = pPropValues3;

	nRet = psAPI_Tag_AddListAsyn(g_hServer, nParentTagId, nCount, pTagPropValues, 
		Tag_AddListAsynComplete, pszTagNames);

	if (PSERR(nRet))
	{
		printf("异步批量添加测点失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}	
}

PSVOID PSAPI Tag_QueryAsynComplete(
	PSIN PSHANDLE hServer,
	PSIN PSVOID *pUserPara,
	PSIN PSUINT32 nCount,
	PSIN PS_TAG_PROP_LIST *pTagPropValues,
	PSIN PSAPIStatus nRet
	)
{
	PSUINT32 n = 0;
	if (PSERR(nRet))
	{
		printf("异步查询%u下所有测点失败 %s\n", g_TagIds[0], psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("异步查询%u下所有测点成功\n", g_TagIds[0]);
		for(n = 0; n < nCount; n++)
		{
			printf("\t测点名称%s\tID%u\n", (pTagPropValues+n)->PropValues[1].String.Data,
				(pTagPropValues+n)->PropValues[0].UInt32);
		}
	}
}

void testCase_Tag_QueryAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nTagId = PSTAGID_ROOT;

	PS_TAG_QUERY_FILTER filter = {0};
	PSUINT16 FieldPropIds = PS_TAG_PROP_NAME;
	PS_VARIANT FieldPropValues = {0};

	PSUINT32 nPropCount = 2;
	PSUINT16 pPropIds[2] = {PS_TAG_PROP_ID, PS_TAG_PROP_NAME};
	
	nRet = psAPI_Tag_QueryAsyn(g_hServer, g_TagIds[0], PSNULL, 
		nPropCount, pPropIds, Tag_QueryAsynComplete, PSNULL);
	if (PSERR(nRet))
	{
		printf("异步查询%u下所有测点失败 %s\n", g_TagIds[0], psAPI_Commom_GetErrorDesc(nRet));
	}
}

PSVOID PSAPI Tag_QueryCountAsynComplete(
	PSIN PSHANDLE hServer,
	PSIN PSVOID *pUserPara,
	PSIN PSUINT32 nCount,
	PSIN PSAPIStatus nRet
	)
{
	if (PSERR(nRet))
	{
		printf("异步查询所有结点数量失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("异步查询所有结点数量成功,返回%u\n", nCount);
	}
}

void testCase_Tag_QueryCountAsyn()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_TAG_QUERY_FILTER filter = {0};
	PSUINT16 FieldPropIds = PS_TAG_PROP_TAGTYPE;
	PS_VARIANT FieldPropValues = {0};

	FieldPropValues.DataType = PSDATATYPE_UINT16;
	FieldPropValues.UInt16 = PSTAGTYPE_NODE;
	filter.FieldPropCount = 1;
	filter.FieldPropIds = &FieldPropIds;
	filter.FieldPropValues = &FieldPropValues;
	filter.QueryLevel = PSQUERYLEVEL_ALL;

	nRet = psAPI_Tag_QueryCountAsyn(g_hServer, PSTAGID_ROOT, &filter, Tag_QueryCountAsynComplete, PSNULL);
	if (PSERR(nRet))
	{
		printf("异步查询所有结点数量失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
	}
}

//////////////////////////////////////////////////////////////////////////
//测点订阅测试
PSVOID PSAPI Tag_CallbackFunction(
	PSIN PSHANDLE hServer,
	PSIN PSUINT32 nSubscribeId,
	PSIN PSVOID *pUserPara,
	PSIN PSUINT32 nTagId,
	PSIN PSUINT32 nChangeType,
	PSIN PSUINT32 nPropCount,
	PSIN PSUINT16 *pPropIds,
	PSIN PS_VARIANT *pPropValues
	)
{
	PSUINT32 nNewSubscribe = (PSUINT32)pUserPara;
	PSUINT32 n = 0;

	printf("用户参数:%u测点ID:%u订阅变化类型:%u变化属性数量:%u\n", 
		nNewSubscribe, nTagId, nChangeType, nPropCount);
	for (n = 0; n < nPropCount; n++)
	{
		printf("\t属性ID:%d值:%s\n", *(pPropIds+n), PSVARIANT2STR(pPropValues+n));
	}
}

PSUINT32 testCase_Tag_NewSubscribe()
{
	static PSUINT32 nNewSubscribe = 0;
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 2;
	PSUINT32 pTagIds[2] = {g_TagIds[1],g_TagIds[2]};
	PSUINT32 nSubscribeID = 0;
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_Tag_NewSubscribe(g_hServer, nCount, pTagIds,
		Tag_CallbackFunction, (PSVOID*)nNewSubscribe++, &nSubscribeID, &pAPIErrors);

	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("新建测点订阅失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return 0;
	} 

	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("新建测点订阅部分成功部分失败 订阅号:%u\n", nSubscribeID);	
		for (n = 0; n < nCount; n++)
		{
			printf("\t测点%u返回 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)pAPIErrors);
		
	}
	else
	{
		printf("新建测点订阅成功 订阅号:%u\n", nSubscribeID);	
	}
	return nSubscribeID;
}

void testCase_Tag_AddSubscribe(PSUINT32 nSubscribeID)
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 2;
	PSUINT32 pTagIds[2] = {g_TagIds[3],g_TagIds[4]};
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_Tag_AddSubscribe(g_hServer, nSubscribeID, nCount, pTagIds, &pAPIErrors);
	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("增加测点订阅失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return ;
	} 
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("增加测点订阅部分成功部分失败\n");
		for (n = 0; n < nCount; n++)
		{
			printf("\t测点%u返回 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)pAPIErrors);

	}
	else
	{
		printf("增加测点订阅成功\n");	
	}
}

void testCase_Tag_DelSubscribe(PSUINT32 nSubscribeID)
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nCount = 2;
	PSUINT32 pTagIds[2] = {g_TagIds[2], g_TagIds[3]};
	PSAPIStatus *pAPIErrors = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_Tag_DelSubscribe(g_hServer, nSubscribeID, nCount, pTagIds, &pAPIErrors);
	if (PSERR(nRet) && nRet != PSERR_FAIL_IN_BATCH)
	{
		printf("删除测点订阅失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return ;
	} 
	if (nRet == PSERR_FAIL_IN_BATCH)
	{
		printf("删除测点订阅部分成功部分失败\n");
		for (n = 0; n < nCount; n++)
		{
			printf("\t测点%u返回 %s\n", pTagIds[n], psAPI_Commom_GetErrorDesc(pAPIErrors[n]));
		}
		psAPI_Memory_FreeAndNull((PSVOID**)pAPIErrors);

	}
	else
	{
		printf("删除测点订阅成功\n");	
	}
}

void testCase_Tag_DelSubscribeAll(PSUINT32 nSubscribeID)
{
	PSAPIStatus nRet = PSRET_OK;
	nRet = psAPI_Tag_DelSubscribeAll(g_hServer, nSubscribeID);
	if (PSERR(nRet))
	{
		printf("删除订阅号%u下的所有测点订阅失败 %s\n", nSubscribeID, psAPI_Commom_GetErrorDesc(nRet));
	}
	else
	{
		printf("删除订阅号%u下的所有测点订阅成功\n", nSubscribeID);
	}
}

void TagSubscribeTest()
{
	PSUINT32 nSubscribeID = 0;
	char ch;

	printf("===============================================================\n");
	printf("===测点订阅相关函数测试\n");

	testCase_Server_Connect();
	testCase_AddTag();

	printf("\t按N新建测点订阅测试\n");
	printf("\t按D删除上次订阅号的所有订阅\n");
	printf("\t按A删除所有订阅号的订阅\n");
	printf("\t按Q退出测点订阅测试\n");
	while(PSTRUE)
	{
		ch = getchar();
		if (ch == 'n' || ch == 'N')
		{
			nSubscribeID = testCase_Tag_NewSubscribe();
			testCase_Tag_AddSubscribe(nSubscribeID);
			testCase_Tag_DelSubscribe(nSubscribeID);
		}
		if (ch == 'd' || ch == 'D')
		{
			if (nSubscribeID != 0)
			{
				testCase_Tag_DelSubscribeAll(nSubscribeID);
			}
		}
		if (ch == 'a' || ch == 'A')
		{
			testCase_Tag_DelSubscribeAll(0);
		}
		if (ch == 'q' || ch == 'Q')
		{
			break;
		}
		if (ch == 'h' || ch == 'H')
		{
			printf("\t按N新建测点订阅测试\n");
			printf("\t按D删除上次订阅号的所有订阅\n");
			printf("\t按A删除所有订阅号的订阅\n");
			printf("\t按Q退出测点订阅测试\n");
		}
	}

	testCase_DelTag();
	testCase_Server_Disconnect();

	printf("===测点订阅相关函数测试结束\n");
}

//建立删除需要的测点
void testCase_AddTag()
{
	testCase_Tag_Add();
	testCase_Tag_AddList();
	testCase_Tag_Copy();
}
void testCase_DelTag()
{
	testCase_Tag_DeleteList();
	testCase_Tag_Delete();
}

void TagTest()
{
	printf("===============================================================\n");
	printf("===测点相关函数测试\n");

	testCase_Server_Connect();

	testCase_TagType_GetTagTypeList();
	testCase_TagType_GetPropList();
	testCase_TagType_GetId();

	task_GetAllTagTypeAndProp();

	testCase_Tag_Add();
	testCase_Tag_AddList();

	testCase_Tag_Copy();
	
	testCase_Tag_IsExist();
	testCase_Tag_IsAncestor();
	testCase_Tag_IsParent();

	testCase_Tag_GetIdByLongName();
	testCase_Tag_GetIdListByLongName();

	testCase_Tag_SetTagProps();
	testCase_Tag_GetTagProps();
	testCase_Tag_SetTagListProps();
	testCase_Tag_GetTagListProps();

	testCase_Tag_Query();
	testCase_Tag_QueryCount();

	testCase_Tag_Move();
	testCase_Tag_DeleteList();
	testCase_Tag_Delete();

	//异步测试
	testCase_Tag_Add();
	testCase_Tag_AddListAsyn();

	testCase_Tag_QueryAsyn();
	testCase_Tag_QueryCountAsyn();

	printf("正在等待异步返回... 按任意键退出\n");
	getchar();

	testCase_Tag_DeleteList();
	testCase_Tag_Delete();

	testCase_Server_Disconnect();

	printf("===测点相关函数测试结束\n");
}