#ifndef __PS_APIHIS_H__
#define __PS_APIHIS_H__

#include "psAPICommon.h"

//定义结构体4字节对齐
#pragma pack(push, Before_psAPISDK)
#pragma pack(4)

#ifdef __cplusplus
extern "C"
{
#endif

	/* 
	测点历史数据定义
	*/
	typedef struct __PS_HIS_DATA
	{
		PSUINT32			TagId; 				/* 测点ID */
		PSUINT32			Aggregate;			/* 统计项 */
		PSUINT32			DataCount;			/* 数据个数 */
		PS_DATA				*DataList; 			/* 历史数据数组 */
	}PS_HIS_DATA;

	/* 
	<summary>
	统计项定义
	</summary> */
	typedef enum __PS_HIS_AGGREGATE_ENUM
	{
		PS_HIS_NOAGGREGATE = 0,
		PS_HIS_INTERPOLATIVE,
		PS_HIS_TOTAL,
		PS_HIS_TOTALIZEAVERAGE,
		PS_HIS_AVERAGE,
		PS_HIS_TIMEAVERAGE,
		PS_HIS_COUNT,
		PS_HIS_STDEV,
		PS_HIS_MINIMUMACTUALTIME,
		PS_HIS_MINIMUM,
		PS_HIS_MAXIMUMACTUALTIME,
		PS_HIS_MAXIMUM,
		PS_HIS_START,
		PS_HIS_END,
		PS_HIS_DELTA,
		PS_HIS_REGSLOPE,
		PS_HIS_REGCONST,
		PS_HIS_REGDEV,
		PS_HIS_VARIANCE,
		PS_HIS_RANGE,
		PS_HIS_DURATIONGOOD,
		PS_HIS_DURATIONBAD,
		PS_HIS_PERCENTGOOD,
		PS_HIS_PERCENTBAD,
		PS_HIS_WORSTQUALITY		
	} PS_HIS_AGGREGATE_ENUM;

	/* =====================================================================
	历史数据处理（PSHis_*）相关函数定义
	===================================================================== */

	/* 
	<summary>
	[API] 异步历史查询完成回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pUserPara">
	使用psAPI_His_ReadRawAsyn、psAPI_His_ReadAtTimeAsyn、
		psAPI_His_ReadProcessedAsyn传入的用户自定义参数
	</param>
	<param name="nCount">
	测点数，pHisDataList, pAPIErrors数组的大小为nCount
	</param>
	<param name="pHisDataList">
	查询返回结果
	空间由被调用者申请，释放
	</param>
	<param name="nRet">
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</param>
	<param name="pAPIErrors">
	nRet返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点查询历史值不成功，返回错误号数组
	测点成功查询历史值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，释放
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_His_ReadAsynComplete)(
		PSIN PSHANDLE hServer,
		PSIN PSVOID *pUserPara,
		PSIN PSUINT32 nCount,
		PSIN PS_HIS_DATA *pHisDataList,
		PSIN PSAPIStatus nRet,
		PSIN PSAPIStatus *pAPIErrors
		);

	/* 
	<summary>
	[API] 异步历史修改完成回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pUserPara">
	使用psAPI_His_InsertAsyn、psAPI_His_ReplaceAsyn、psAPI_His_InsertReplaceAsyn、
	psAPI_His_DeleteRawAsyn、psAPI_His_DeleteAtTimeAsyn传入的用户自定义参数
	</param>
	<param name="nCount">
	测点数，pTagIds, pAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	修改测点ID数组
	</param>
	<param name="nRet">
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</param>
	<param name="pAPIErrors">
	nRet返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点修改历史值不成功，返回错误号数组
	测点成功修改历史值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，释放
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_His_WriteAsynComplete)(
		PSIN PSHANDLE hServer,
		PSIN PSVOID *pUserPara,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN PSAPIStatus nRet,
		PSIN PSAPIStatus *pAPIErrors
		);

	/* 
	<summary>
	[API] 查询一批测点一段时间的原始历史数据
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="StartTime">
	查询的开始时间
	</param>
	<param name="EndTime">
	查询的结束时间
	</param>
	<param name="nMaxNumOfReturnValues">
	用户指定的最大返回数据条数，最大不能超过系统最大限制值（10000）
	</param>
	<param name="bBounds">
	如果开始时间和结束时间没有保存原始值，是否使用插值算法计算出来
	</param>
	<param name="nCount">
	测点数，pTagIds、ppHisDataList、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	查询的点数组，由调用者申请和释放空间
	</param>
	<param name="ppHisDataList">
	查询返回结果
	空间由被调用者申请，调用者通过psAPI_Memory_FreeTagHisDataList(ppHisDataList,nCount)函数释放
	调用前，*ppHisDataList必须为PSNULL
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点查询历史值不成功，返回错误号数组
	测点成功查询历史值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> 
	<remarks>
	常见返回错误
		PSERR_FAIL_IN_BATCH 批量操作中有出错的元素,具体错误原因查看返回值列表对应元素的返回值
		PSERR_COMMON_PARAMETER_INVALID 参数返回错误
		ppAPIErrors里返回PSERR_HIS_NODATA 测点在指定的时间范围内没有数据
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_His_ReadRaw(
		PSIN PSHANDLE hServer,
		PSIN PS_TIME StartTime,
		PSIN PS_TIME EndTime,
		PSIN PSUINT32 nMaxNumOfReturnValues,
		PSIN PSBOOL bBounds,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSOUT PS_HIS_DATA **ppHisDataList,  
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 查询一批测点一段时间的原始历史数据异步函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="StartTime">
	查询的开始时间
	</param>
	<param name="EndTime">
	查询的结束时间
	</param>
	<param name="nMaxNumOfReturnValues">
	用户指定的最大返回数据条数，最大不能超过系统最大限制值（10000）
	</param>
	<param name="bBounds">
	如果开始时间和结束时间没有保存原始值，是否使用插值算法计算出来
	</param>
	<param name="nCount">
	测点数，pTagIds数组的大小为nCount
	</param>
	<param name="pTagIds">
	查询的点数组，由调用者申请和释放空间
	</param>
	<param name="CompleteFunction">
	异步回调函数地址
	</param>
	<param name="pUserPara">
	用户自定义参数
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_ReadRawAsyn(
		PSIN PSHANDLE hServer,
		PSIN PS_TIME StartTime,
		PSIN PS_TIME EndTime,
		PSIN PSUINT32 nMaxNumOfReturnValues,
		PSIN PSBOOL bBounds,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN psAPI_His_ReadAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 查询一批测点固定时间的历史数据
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nNumTimeStamps">
	查询的时刻值数组数量 pTimeStamps数组的大小为nNumTimeStamps
	</param>
	<param name="pTimeStamps">
	查询的时刻值数组，由调用者申请和释放空间
	</param>
	<param name="nCount">
	测点数，pTagIds、ppHisDataList、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	查询的点数组，由调用者申请和释放空间
	</param>
	<param name="ppHisDataList">
	查询返回结果
	空间由被调用者申请，调用者通过psAPI_Memory_FreeTagHisDataList(ppHisDataList,nCount)函数释放
	调用前，*ppHisDataList必须为PSNULL
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点查询历史值不成功，返回错误号数组
	测点成功查询历史值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_ReadAtTime(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nNumTimeStamps,
		PSIN PS_TIME *pTimeStamps,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds, 
		PSOUT PS_HIS_DATA **ppHisDataList,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 查询一批测点固定时间的历史数据
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nNumTimeStamps">
	查询的时刻值数组数量 pTimeStamps数组的大小为nNumTimeStamps
	</param>
	<param name="pTimeStamps">
	查询的时刻值数组，由调用者申请和释放空间
	</param>
	<param name="nCount">
	测点数，pTagIds数组的大小为nCount
	</param>
	<param name="pTagIds">
	查询的点数组，由调用者申请和释放空间
	</param>
	<param name="CompleteFunction">
	异步回调函数地址
	</param>
	<param name="pUserPara">
	用户自定义参数
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_ReadAtTimeAsyn(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nNumTimeStamps,
		PSIN PS_TIME *pTimeStamps,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds, 
		PSIN psAPI_His_ReadAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 查询一批测点一段时间的历史统计数据
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="StartTime">
	查询的开始时间
	</param>
	<param name="EndTime">
	查询的结束时间
	</param>
	<param name="ResampleInterval">
	查询的时间间隔，本接口会按照该时间间隔段对历史数据进行统计，返回统计值
	</param>
	<param name="nCount">
	测点数，pTagIds、pAggregates、ppHisDataList、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	查询的点数组，由调用者申请和释放空间
	</param>
	<param name="pAggregates">
	查询的统计方法数组，数组中序号对应测点数组序号，值为OPCHDA_AGGREGATE中定义，由调用者申请和释放空间
	</param>
	<param name="ppHisDataList">
	查询返回结果
	空间由被调用者申请，调用者通过psAPI_Memory_FreeTagHisDataList(ppHisDataList,nCount)函数释放
	调用前，*ppHisDataList必须为PSNULL
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点查询历史值不成功，返回错误号数组
	测点成功查询历史值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_ReadProcessed(
		PSIN PSHANDLE hServer,
		PSIN PS_TIME StartTime,
		PSIN PS_TIME EndTime,
		PSIN PS_TIME ResampleInterval,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds, 
		PSIN PSUINT32 *pAggregates, 
		PSOUT PS_HIS_DATA **ppHisDataList,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 查询一批测点一段时间的历史统计数据
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="StartTime">
	查询的开始时间
	</param>
	<param name="EndTime">
	查询的结束时间
	</param>
	<param name="ResampleInterval">
	查询的时间间隔，本接口会按照该时间间隔段对历史数据进行统计，返回统计值
	</param>
	<param name="nCount">
	测点数，pTagIds、pAggregates数组的大小为nCount
	</param>
	<param name="pTagIds">
	查询的点数组，由调用者申请和释放空间
	</param>
	<param name="pAggregates">
	查询的统计方法数组，数组中序号对应测点数组序号，值为OPCHDA_AGGREGATE中定义，由调用者申请和释放空间
	</param>
	<param name="CompleteFunction">
	异步回调函数地址
	</param>
	<param name="pUserPara">
	用户自定义参数
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_ReadProcessedAsyn(
		PSIN PSHANDLE hServer,
		PSIN PS_TIME StartTime,
		PSIN PS_TIME EndTime,
		PSIN PS_TIME ResampleInterval,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds, 
		PSIN PSUINT32 *pAggregates, 
		PSIN psAPI_His_ReadAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 插入一批测点的历史数据
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、pTimeStamps、vDataValues、pQualities、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	插入点数组，由调用者申请和释放空间
	</param>
	<param name="pTimeStamps">
	插入值时间数组，由调用者申请和释放空间
	</param>
	<param name="vDataValues">
	插入值数组，由调用者申请和释放空间
	</param>
	<param name="pQualities">
	插入值质量戳数组，由调用者申请和释放空间
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点插入历史值不成功，返回错误号数组
	测点成功插入历史值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	如果插入时刻的历史值已经存在，则该值不会插入，具体错误号会在ppAPIErrors中返回
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_His_Insert(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount, 
		PSIN PSUINT32 *pTagIds,
		PSIN PS_VARIANT *pDataValues,
		PSIN PS_TIME *pTimeStamps,
		PSIN PSUINT32 *pQualities,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 插入一批测点的历史数据异步函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、pTimeStamps、vDataValues、pQualities数组的大小为nCount
	</param>
	<param name="pTagIds">
	插入点数组，由调用者申请和释放空间
	</param>
	<param name="pTimeStamps">
	插入值时间数组，由调用者申请和释放空间
	</param>
	<param name="vDataValues">
	插入值数组，由调用者申请和释放空间
	</param>
	<param name="pQualities">
	插入值质量戳数组，由调用者申请和释放空间
	</param>
	<param name="CompleteFunction">
	异步回调函数地址
	</param>
	<param name="pUserPara">
	用户自定义参数
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	如果插入时刻的历史值已经存在，则该值不会插入
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_His_InsertAsyn(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount, 
		PSIN PSUINT32 *pTagIds,
		PSIN PS_VARIANT *pDataValues,
		PSIN PS_TIME *pTimeStamps,
		PSIN PSUINT32 *pQualities,
		PSIN psAPI_His_WriteAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 替换一批测点的历史数据
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、pTimeStamps、vDataValues、pQualities、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	插入点数组，由调用者申请和释放空间
	</param>
	<param name="pTimeStamps">
	插入值时间数组，由调用者申请和释放空间
	</param>
	<param name="vDataValues">
	插入值数组，由调用者申请和释放空间
	</param>
	<param name="pQualities">
	插入值质量戳数组，由调用者申请和释放空间
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点替换历史值不成功，返回错误号数组
	测点成功替换历史值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	如果替换时刻的历史值不存在，则该值不会替换，具体错误号会在ppAPIErrors中返回
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_His_Replace(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount, 
		PSIN PSUINT32 *pTagIds, 
		PSIN PS_VARIANT *pDataValues,
		PSIN PS_TIME *pTimeStamps,
		PSIN PSUINT32 *pQualities,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 替换一批测点的历史数据异步函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、pTimeStamps、vDataValues、pQualities数组的大小为nCount
	</param>
	<param name="pTagIds">
	插入点数组，由调用者申请和释放空间
	</param>
	<param name="pTimeStamps">
	插入值时间数组，由调用者申请和释放空间
	</param>
	<param name="vDataValues">
	插入值数组，由调用者申请和释放空间
	</param>
	<param name="pQualities">
	插入值质量戳数组，由调用者申请和释放空间
	</param>
	<param name="CompleteFunction">
	异步回调函数地址
	</param>
	<param name="pUserPara">
	用户自定义参数
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	如果替换时刻的历史值不存在，则该值不会替换，具体错误号会在ppAPIErrors中返回
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_His_ReplaceAsyn(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount, 
		PSIN PSUINT32 *pTagIds,
		PSIN PS_VARIANT *pDataValues,
		PSIN PS_TIME *pTimeStamps,
		PSIN PSUINT32 *pQualities,
		PSIN psAPI_His_WriteAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 插入替换一批测点的历史数据
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、pTimeStamps、vDataValues、pQualities、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	插入点数组，由调用者申请和释放空间
	</param>
	<param name="pTimeStamps">
	插入值时间数组，由调用者申请和释放空间
	</param>
	<param name="vDataValues">
	插入值数组，由调用者申请和释放空间
	</param>
	<param name="pQualities">
	插入值质量戳数组，由调用者申请和释放空间
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点插入替换历史值不成功，返回错误号数组
	测点成功插入替换历史值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	如果插入时刻的历史值不存在，则插入该值，如果该时刻历史值存在，则替换该原值
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_His_InsertReplace(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount, 
		PSIN PSUINT32 *pTagIds, 
		PSIN PS_VARIANT *pDataValues,
		PSIN PS_TIME *pTimeStamps,
		PSIN PSUINT32 *pQualities,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 插入替换一批测点的历史数据异步函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、pTimeStamps、vDataValues、pQualities数组的大小为nCount
	</param>
	<param name="pTagIds">
	插入点数组，由调用者申请和释放空间
	</param>
	<param name="pTimeStamps">
	插入值时间数组，由调用者申请和释放空间
	</param>
	<param name="vDataValues">
	插入值数组，由调用者申请和释放空间
	</param>
	<param name="pQualities">
	插入值质量戳数组，由调用者申请和释放空间
	</param>
	<param name="CompleteFunction">
	异步回调函数地址
	</param>
	<param name="pUserPara">
	用户自定义参数
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	如果插入时刻的历史值不存在，则插入该值，如果该时刻历史值存在，则替换该原值
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_His_InsertReplaceAsyn(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount, 
		PSIN PSUINT32 *pTagIds,
		PSIN PS_VARIANT *pDataValues,
		PSIN PS_TIME *pTimeStamps,
		PSIN PSUINT32 *pQualities,
		PSIN psAPI_His_WriteAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 删除一批测点一段时间的历史数据
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="StartTime">
	删除的开始时间
	</param>
	<param name="EndTime">
	删除的结束时间
	</param>
	<param name="nCount">
	测点数，pTagIds数组的大小为nCount
	</param>
	<param name="pTagIds">
	删除点数组，由调用者申请和释放空间
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点删除历史值不成功，返回错误号数组
	测点成功删除历史值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_DeleteRaw(
		PSIN PSHANDLE hServer,
		PSIN PS_TIME StartTime,
		PSIN PS_TIME EndTime,
		PSIN PSUINT32 nCount, 
		PSIN PSUINT32 *pTagIds,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 删除一批测点一段时间的历史数据异步函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="StartTime">
	删除的开始时间
	</param>
	<param name="EndTime">
	删除的结束时间
	</param>
	<param name="nCount">
	测点数，pTagIds数组的大小为nCount
	</param>
	<param name="pTagIds">
	删除点数组，由调用者申请和释放空间
	</param>
	<param name="CompleteFunction">
	异步回调函数地址
	</param>
	<param name="pUserPara">
	用户自定义参数
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_DeleteRawAsyn(
		PSIN PSHANDLE hServer,
		PSIN PS_TIME StartTime,
		PSIN PS_TIME EndTime,
		PSIN PSUINT32 nCount, 
		PSIN PSUINT32 *pTagIds,
		PSIN psAPI_His_WriteAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 删除一批测点固定时间的历史数据
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、pTimeStamps数组的大小为nCount
	</param>
	<param name="pTagIds">
	删除点数组，由调用者申请和释放空间
	</param>
	<param name="pTimeStamps">
	删除时间戳数组，由调用者申请和释放空间
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点删除历史值不成功，返回错误号数组
	测点成功删除历史值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_DeleteAtTime(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN PS_TIME *pTimeStamps,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 删除一批测点固定时间的历史数据
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、pTimeStamps数组的大小为nCount
	</param>
	<param name="pTagIds">
	删除点数组，由调用者申请和释放空间
	</param>
	<param name="pTimeStamps">
	删除时间戳数组，由调用者申请和释放空间
	</param>
	<param name="CompleteFunction">
	异步回调函数地址
	</param>
	<param name="pUserPara">
	用户自定义参数
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_DeleteAtTimeAsyn(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN PS_TIME *pTimeStamps,
		PSIN psAPI_His_WriteAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);



	typedef struct PS_CURSOR PS_CURSOR;

	/* 
	<summary>
	[API] 创建查询原始数据游标
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="StartTime">
	查询的开始时间
	</param>
	<param name="EndTime">
	查询的结束时间
	</param>
	<param name="NumEveryTime">
	用户指定的每次和服务器通讯返回数据条数，最大不能超过系统最大限制值（10000）
	</param>
	<param name="bBounds">
	如果开始时间和结束时间没有保存原始值，是否使用插值算法计算出来
	</param>
	<param name="TagId">
	查询的点
	</param>
	<param name="ppDataSet">
	返回的游标
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_ReadRawByCursor(
		PSIN PSHANDLE hServer,
		PSIN PS_TIME StartTime,
		PSIN PS_TIME EndTime,
		PSIN PSUINT32 NumEveryTime,
		PSIN PSBOOL bBounds,
		PSIN PSUINT32 TagId,
		PSOUT PS_CURSOR** ppDataSet 
		);
	/* 
	<summary>
	[API] 用查询原始数据游标查询下一条数据
	</summary>
	<param name="ppDataSet">
	psAPI_His_ReadRawByCursor函数返回的游标
	</param>
	<param name="ppData">
	返回的数据
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_ReadNextRaw( 
		PSIN PS_CURSOR* pDataSet, 
		PSOUT PS_DATA** ppData 
		);

	/* 
	<summary>
	[API] 创建查询统计数据游标
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="StartTime">
	查询的开始时间
	</param>
	<param name="EndTime">
	查询的结束时间
	</param>
	<param name="ResampleInterval">
	每个采样区间的时间大小
	</param>
	<param name="Agg">
	查询的统计方法
	</param>
	<param name="TagId">
	查询的测点Id
	</param>
	<param name="ppDataSet">
	返回的游标
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_ReadProcessedByCursor( 
		PSIN PSHANDLE hServer, 
		PSIN PS_TIME StartTime,
		PSIN PS_TIME EndTime, 
		PSIN PS_TIME ResampleInterval,
		PSIN __PS_HIS_AGGREGATE_ENUM Agg, 
		PSIN PSUINT32 TagId,
		PSOUT PS_CURSOR** ppDataSet );

	/* 
	<summary>
	[API] 用查询统计数据游标查询下一条数据
	</summary>
	<param name="ppDataSet">
	psAPI_His_ReadProcessedByCursor函数返回的游标
	</param>
	<param name="ppData">
	返回的数据
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_ReadNextProcessed(
		PSIN PS_CURSOR* pDataSet, 
		PSOUT PS_DATA** ppData 
		);

	/* 
	<summary>
	[API] 创建查询原始数据游标，只需要设置一个时间
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="TagId">
	查询的点
	</param>
	<param name="StartTime">
	查询的开始时间
	</param>
	<param name="bIncreaseTime">
	是否按时间递增查找，设置为False时向前查找
	</param>
	<param name="bIgnoreBad">
	是否忽略坏数据，设置为True时，只读Good数据
	</param>
	<param name="ppDataSet">
	返回的游标
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_His_CreateCursor(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nTagId,
		PSIN PS_TIME StartTime,
		PSIN PSBOOL bIncreaseTime,
		PSIN PSBOOL bIgnoreBad,
		PSOUT PS_CURSOR** ppDataSet 
		);

	/* 
	<summary>
	[API] 用查询原始数据游标查询下一条数据
	</summary>
	<param name="ppDataSet">
	psAPI_His_CreateCursor函数返回的游标
	</param>
	<param name="ppData">
	返回的数据
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	返回的数据ppData 如果再调用psAPI_His_ReadNext可能会释放
	调用psAPI_His_ReleaseCursor后ppData一定会被释放
	</remarks>*/
	PSDLL PSAPIStatus PSAPI psAPI_His_ReadNext( 
		PSIN PS_CURSOR* pDataSet, 
		PSOUT PS_DATA** ppData 
		);

	/* 
	<summary>
	[API] 释放游标
	</summary>
	<param name="ppDataSet">
	psAPI_His_ReadRawByCursor
	psAPI_His_ReadProcessedByCursor
	psAPI_His_CreateCursor函数返回的游标
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
    PSDLL PSAPIStatus PSAPI psAPI_His_ReleaseCursor(
		PSIN PS_CURSOR* pDataSet);

	#define psReadProcessed_NumEveryTime 200

#ifdef  __cplusplus
}
#endif

#pragma pack(pop, Before_psAPISDK)

#endif	/* __PS_APIHIS_H__ */