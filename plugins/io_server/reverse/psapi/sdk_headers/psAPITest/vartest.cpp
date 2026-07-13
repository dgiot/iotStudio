#include "../psAPISDK.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <wchar.h>
#include <time.h>
#include "psAPITest.h"

void VarTest()
{
	// 创建
	PSAPIStatus nRet = 0;
	PS_VARIANT *pVar1 = PSNULL;
	PS_VARIANT *pVar2 = PSNULL;
	PS_VARIANT *pVar3 = PSNULL;

	PSSTR s1 = (PSSTR)"Hello World!";
	PSWSTR ws1 = (PSWSTR)L"我是谁AAA";
	PSBYTE *b1 = PSNULL;
	PSUINT32 nLen = 1024;
	PS_VARIANT vt1;

	nRet = psAPI_VARIANT_NEW(&pVar1);
	nRet = psAPI_VARIANT_NEW(&pVar2);
	nRet = psAPI_VARIANT_NEW(&pVar3);

	// 初始化
	psAPI_Memory_New((PSVOID**)&b1, nLen);
	
	//nRet = psAPI_VARIANT_COPY_STRING(s1, pVar1);
	//nRet = psAPI_VARIANT_COPY_WSTRING(ws1, pVar2);
	//nRet = psAPI_VARIANT_COPY_BLOB(b1, nLen, pVar3);

	// 清理
	nRet = psAPI_VARIANT_CLEAR(pVar3);

	// 拷贝
	psAPI_VARIANT_COPY(pVar2, pVar1);

	vt1.DataType = PSDATATYPE_INT16;
	vt1.Int16 = 0x7fff;
	nRet = psAPI_VARIANT_COPY(&vt1, pVar2); 

CLEAR:
	psAPI_Memory_FreeAndNull((PSVOID**)&b1);

	nRet = psAPI_VARIANT_FREE(&pVar1);
	nRet = psAPI_VARIANT_FREE(&pVar2);
	nRet = psAPI_VARIANT_FREE(&pVar3);

	// 重复一次？
	nRet = psAPI_VARIANT_FREE(&pVar3);

	if (nRet == PSERR_COMMON_PARAMETER_INVALID)
	{
		printf("Testing PS_VARIANT tools ...OK\n");
	}

}