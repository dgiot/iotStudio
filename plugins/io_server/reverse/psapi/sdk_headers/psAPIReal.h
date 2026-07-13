#ifndef __PS_APIREAL_H__
#define __PS_APIREAL_H__

#include "psAPICommon.h"

//定义结构体4字节对齐
#pragma pack(push, Before_psAPISDK)
#pragma pack(4)

#ifdef __cplusplus
extern "C"
{
#endif

	/* 
	<summary>
	质量戳常量定义
	OPC 3.0的质量戳低八位由质量Q、子状态S和限制状态L构成：QQSSSSLL
	详细参考OPC DA 3.00 Specification，6.8节（160页）
	</summary> */
	typedef enum __PS_QUALITY_ENUM
	{
		PS_QUALITY_MASK						= 0xc0,			/* Quality BITMASK */

		PS_QUALITY_BAD					   	= 0x00,			/* 坏数据 */
		PS_QUALITY_UNCERTAIN				= 0x1*0x40,		/* 不可靠数据 */
		PS_QUALITY_NA						= 0x2*0x40,		/* N/A */
		PS_QUALITY_GOOD						= 0x3*0x40,		/* 好的数据 */

		PS_QUALITY_SUBSTATUS_MASK			= 0xfc,			/* Substatus for BAD Quality */

		PS_QUALITY_CONFIG_ERROR				= 0x01*0x04,	/* 配置错误 */
		PS_QUALITY_NOT_CONNECTED			= 0x02*0x04,	/* 没有连接设备 */
		PS_QUALITY_DEVICE_FAILURE			= 0x03*0x04,	/* 设备失败 */
		PS_QUALITY_SENSOR_FAILURE			= 0x04*0x04,	/* 传感器失败 */
		PS_QUALITY_LAST_KNOWN				= 0x05*0x04,	/* 上一次采集的值(通讯失败) */
		PS_QUALITY_COMM_FAILURE				= 0x06*0x04,	/* 通讯失败(且无上一次采集值可用) */
		PS_QUALITY_OUT_OF_SERVICE			= 0x07*0x04,	/* 设备停机 */
		PS_QUALITY_WAITING_FOR_INITIAL_DATA	= 0x08*0x04,	/* 尚未取得设备数据 */

		PS_QUALITY_LAST_USABLE				= 0x11*0x04,	/* 上一个可用值 */
		PS_QUALITY_SENSOR_CAL				= 0x14*0x04,	/* 传感器值不精确 */
		PS_QUALITY_EGU_EXCEEDED				= 0x15*0x04,	/* 超量程 */
		PS_QUALITY_SUB_NORMAL				= 0x16*0x04,	/* 值从多个数据源得到，但缺少足够多的好数据 */

		PS_QUALITY_LOCAL_OVERRIDE			= 0x36*0x04,	/* 值被覆盖(GOOD) */
		PS_QUALITY_WRITE_BY_CONTROL			= 0x3*0x40+0x0A*0x04,	/* 通过下置组件写的值(GOOD) */

		PS_QUALITY_LL_MASK					= 0x3,			/* The Limit BitField */

		/* 历史部分质量戳 */
		PS_QUALITY_EXTRADATA				= 0x00010000,
		PS_QUALITY_INTERPOLATED				= 0x00020000,
		PS_QUALITY_RAW						= 0x00040000,
		PS_QUALITY_CALCULATED				= 0x00080000,
		PS_QUALITY_NOBOUND					= 0x00100000,
		PS_QUALITY_NODATA					= 0x00200000,
		PS_QUALITY_DATALOST					= 0x00400000,
		PS_QUALITY_CONVERSION				= 0x00800000,
		PS_QUALITY_PARTIAL					= 0x01000000,
	} PS_QUALITY_ENUM; 

#define IS_DATA_BAD( dataQuality )		(((dataQuality) & PS_QUALITY_MASK) == PS_QUALITY_BAD )
#define IS_DATA_UNCERTAIN( dataQuality )	(((dataQuality) & PS_QUALITY_MASK) == PS_QUALITY_UNCERTAIN )
#define IS_DATA_GOOD( dataQuality )		(((dataQuality) & PS_QUALITY_MASK) == PS_QUALITY_GOOD )

	/* 
	实时数据记录定义
	*/
	typedef struct __PS_DATA
	{
		PS_TIME				Time;				/* 时间戳 */
		PS_VARIANT			Value;				/* 值 */
		PSUINT32			Quality;			/* 质量戳 */
	} PS_DATA;

	/* =====================================================================
	实时数据处理（PSReal_*）相关函数定义
	===================================================================== */

	/* 
	<summary>
	[API] 测点实时值订阅的回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	新建订阅时返回的订阅号
	</param>
	<param name="pUserPara">
	实时订阅psAPI_Real_NewSubscribe、psAPI_Real_NewSubscribeAndRead传入的自定义参数
	</param>
	<param name="nCount">
	pTagIds、pRealDataList数组的大小为nCount
	</param>
	<param name="pTagIds">
	测点ID数组
	</param>
	<param name="ppRealDataList">
	对应测点ID的实时值
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_Real_CallbackFunction)(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId,
		PSIN PSVOID *pUserPara,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN PS_DATA *pRealDataList
		);

	/* 
	<summary>
	[API] 读取一批测点的实时值 异步回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pUserPara">
	使用psAPI_Real_ReadListAsyn传入的用户自定义参数
	</param>
	<param name="nCount">
	测点数，pTagIds、pRealDataList、pAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	读取测点数组
	</param>
	<param name="pRealDataList">
	返回的实时数据
	</param>
	<param name="nRet">
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</param>
	<param name="pAPIErrors">
	nRet返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点读取实时值不成功，返回错误号数组
	测点成功读取实时值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，释放
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_Real_ReadListAsynComplete)(
		PSIN PSHANDLE hServer,
		PSIN PSVOID *pUserPara,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN PS_DATA *pRealDataList,
		PSIN PSAPIStatus nRet,
		PSIN PSAPIStatus *pAPIErrors
		);

	/* 
	<summary>
	[API] 写入一批测点的实时值 异步回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pUserPara">
	使用psAPI_Real_WriteListAsyn传入的用户自定义参数
	</param>
	<param name="nCount">
	测点数，pTagIds、pAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	写入测点数组
	</param>
	<param name="nRet">
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</param>
	<param name="pAPIErrors">
	nRet返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点写实时值不成功，返回错误号数组
	测点成功写实时值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，释放
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_Real_WriteListAsynComplete)(
		PSIN PSHANDLE hServer,
		PSIN PSVOID *pUserPara,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN PSAPIStatus nRet,
		PSIN PSAPIStatus *pAPIErrors
		);

	/* 
	<summary>
	[API] 读取测点的实时值
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nTagId">
	测点ID
	</param>
	<param name="ppRealDataList">
	返回单个测点实时值
	空间由被调用者申请，调用者通过psAPI_Memory_FreeDataList(ppRealData,1)释放
	调用前，*ppRealData必须为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	常见返回错误
		PSERR_TAG_NOT_EXIST 测点Id nTagId不存在
		PSERR_REAL_CANNOT_READ 测点可能为节点类型，不能读实时值
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Real_Read(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nTagId,
		PSOUT PS_DATA **ppRealData
		);

	/* 
	<summary>
	[API] 读取一批测点的实时值
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	读取测点数量，pTagIds、ppRealDataList、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	测点ID数组
	</param>
	<param name="ppRealDataList">
	返回实时值数组
	空间由被调用者申请，调用者通过psAPI_Memory_FreeDataList(ppRealData,nCount)释放
	调用前，*ppRealDataList必须为NULL
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点读取实时值不成功，返回错误号数组
	测点成功读取实时值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Real_ReadList(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSOUT PS_DATA **ppRealDataList,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 读取一批测点的实时值异步函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds数组的大小为nCount
	</param>
	<param name="pTagIds">
	测点ID数组
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
	PSDLL PSAPIStatus PSAPI psAPI_Real_ReadListAsyn(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN psAPI_Real_ReadListAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 更改单个测点的实时值
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nTagId">
	测点ID
	</param>
	<param name="pDataValue">
	实时值 不能为NULL
	</param>
	<param name="pTimeStamp">
	时间戳 为NULL服务器自动获取当前时间
	</param>
	<param name="pQuality">
	质量戳 为NULL服务器自动设置为正常数据
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	pDataValue 的数据类型可以和测点的数据类型不一样
	常见返回错误
		PSERR_TAG_NOT_EXIST 测点Id nTagId不存在
		PSERR_REAL_CANNOT_WRITE 测点可能为节点类型，不能更改实时值
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Real_Write(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nTagId,
		PSIN PS_VARIANT *pDataValue,
		PSIN PS_TIME *pTimeStamp,
		PSIN PSUINT32 *pQuality
		);

	/* 
	<summary>
	[API] 写入一批测点的实时值
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	写入一批测点的数量，pTagIds、pTimeStamps、pDataValues、pQualities、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	测点ID数组
	</param>
	<param name="pDataValues">
	写入值数组
	</param>
	<param name="pTimeStamps">
	写入时间戳数组 为NULL服务器自动获取当前时间
	</param>
	<param name="pQualities">
	写入质量戳数组 为NULL服务器自动设置为正常数据
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点写实时值不成功，返回错误号数组
	测点成功写实时值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Real_WriteList(
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
	[API] 写入一批测点的实时值 异步函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、pTimeStamps、pDataValues、pQualities数组的大小为nCount
	</param>
	<param name="pTagIds">
	测点ID数组
	</param>
	<param name="pDataValues">
	写入值数组
	</param>
	<param name="pTimeStamps">
	写入时间戳数组 为NULL服务器自动获取当前时间
	</param>
	<param name="pQualities">
	写入质量戳数组 为NULL服务器自动设置为正常数据
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
	PSDLL PSAPIStatus PSAPI psAPI_Real_WriteListAsyn(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN PS_VARIANT *pDataValues,
		PSIN PS_TIME *pTimeStamps,
		PSIN PSUINT32 *pQualities,
		PSIN psAPI_Real_WriteListAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 新建订阅测点实时值变化
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	实时订阅测点ID数组
	</param>
	<param name="CallbackFunction">
	发布订阅时回调函数地址
	</param>
	<param name="pUserPara">
	用户自定义参数
	</param>
	<param name="pnSubscribeId">
	返回新建订阅号 根据订阅号增加订阅测点或删除订阅测点
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点订阅实时值不成功，返回错误号数组
	测点成功订阅实时值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	如果订阅测点数组里包含节点,该节点下的所有测点也被订阅
	同一个点在同一个订阅号里被订阅多次,发布订阅时回调一次
	以后增加订阅测点如果使用返回的订阅号pnSubscribeId,发布订阅时
	使用同样的回调函数CallbackFunction和用户自定义参数pUserPara
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Real_NewSubscribe(
		PSIN PSHANDLE hServer, 
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN psAPI_Real_CallbackFunction CallbackFunction,
		PSIN PSVOID *pUserPara,
		PSOUT PSUINT32 *pnSubscribeId,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 新建订阅测点实时值变化并得到初值
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	实时订阅测点ID数组
	</param>
	<param name="CallbackFunction">
	发布订阅时回调函数地址
	</param>
	<param name="pUserPara">
	用户自定义参数
	</param>
	<param name="pnSubscribeId">
	返回新建订阅号 根据订阅号增加订阅测点或删除订阅测点
	</param>
	<param name="ppRealDataList">
	返回初值数组
	空间由被调用者申请，调用者通过psAPI_Memory_FreeDataList(ppRealData,nCount)释放
	调用前，*ppRealDataList必须为NULL
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点订阅实时值不成功，返回错误号数组
	测点成功订阅实时值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	如果订阅测点数组里包含节点,该节点下的所有测点也被订阅
	同一个点在同一个订阅号里被订阅多次,发布订阅时回调一次
	以后增加订阅测点如果使用返回的订阅号pnSubscribeId,发布订阅时
	使用同样的回调函数CallbackFunction和用户自定义参数pUserPara
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Real_NewSubscribeAndRead(
		PSIN PSHANDLE hServer, 
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN psAPI_Real_CallbackFunction CallbackFunction,
		PSIN PSVOID *pUserPara,
		PSOUT PSUINT32 *pnSubscribeId,
		PSOUT PS_DATA **ppRealDataList,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 增加订阅测点实时值变化
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	新建订阅测点实时值变化psAPI_Real_NewSubscribe或psAPI_Real_NewSubscribeAndRead返回的订阅号
	</param>
	<param name="nCount">
	测点数，pTagIds、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	实时订阅测点ID数组
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点订阅实时值不成功，返回错误号数组
	测点成功订阅实时值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	nSubscribeId为0是将返回参数错误 PSERR_COMMON_PARAMETER_INVALID
	如果订阅测点数组里包含节点,该节点下的所有测点也被订阅
	同一个点在同一个订阅号里被订阅多次,发布订阅时回调一次
	以后增加订阅测点如果使用返回的订阅号pnSubscribeId,发布订阅时
	使用同样的回调函数CallbackFunction和用户自定义参数pUserPara
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Real_AddSubscribe(
		PSIN PSHANDLE hServer, 
		PSIN PSUINT32 nSubscribeId,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 增加订阅测点实时值变化并得到初值
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	新建订阅测点实时值变化psAPI_Real_NewSubscribe或psAPI_Real_NewSubscribeAndRead返回的订阅号
	</param>
	<param name="nCount">
	测点数，pTagIds、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	实时订阅测点ID数组
	</param>
	<param name="ppRealDataList">
	返回初值数组
	空间由被调用者申请，调用者通过psAPI_Memory_FreeDataList(ppRealData,nCount)释放
	调用前，*ppRealDataList必须为NULL
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点订阅实时值不成功，返回错误号数组
	测点成功订阅实时值在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	nSubscribeId为0是将返回参数错误 PSERR_COMMON_PARAMETER_INVALID
	如果订阅测点数组里包含节点,该节点下的所有测点也被订阅
	同一个点在同一个订阅号里被订阅多次,发布订阅时回调一次
	以后增加订阅测点如果使用返回的订阅号pnSubscribeId,发布订阅时
	使用同样的回调函数CallbackFunction和用户自定义参数pUserPara
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Real_AddSubscribeAndRead(
		PSIN PSHANDLE hServer, 
		PSIN PSUINT32 nSubscribeId,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSOUT PS_DATA **ppRealDataList,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 删除测点实时值变化订阅
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	新建订阅测点实时值变化psAPI_Real_NewSubscribe或psAPI_Real_NewSubscribeAndRead返回的订阅号
	</param>
	<param name="nCount">
	测点数，pTagIds、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	删除测点订阅ID数组
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点取消实时值订阅不成功，返回错误号数组
	测点成功取消实时值订阅在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	nSubscribeId为0是将返回参数错误 PSERR_COMMON_PARAMETER_INVALID
	同一个点在同一个订阅号里被订阅多次，取消该点订阅只需要一次
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Real_DelSubscribe(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 删除订阅号下的所有测点实时值变化订阅
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	新建订阅测点实时值变化psAPI_Real_NewSubscribe或psAPI_Real_NewSubscribeAndRead返回的订阅号
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	nSubscribeId为0是将删除当前用户登录连接下的所有订阅号下的所有订阅
	注意,删除后订阅号不能在使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Real_DelSubscribeAll(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId
		);

#ifdef  __cplusplus
}
#endif

#pragma pack(pop, Before_psAPISDK)

#endif	/* __PS_APIREAL_H__ */