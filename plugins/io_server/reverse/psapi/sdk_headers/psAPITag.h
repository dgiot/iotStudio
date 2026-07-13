#ifndef __PS_APITAG_H__
#define __PS_APITAG_H__

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
	常规属性ID定义
	注意：
	1. 整个系统用一套属性ID，即不同测点类型中，相同ID的属性具有相同的特性；
	2. 属性有只读和可读写两类；
	3. 属性在测点内部不一定需要一个特定的字段来描述
	</summary> */
	typedef enum __PS_TAG_PROP_ENUM
	{
		PS_TAG_PROP_TAGBASE_MIN = 0,

		PS_TAG_PROP_ID = PS_TAG_PROP_TAGBASE_MIN,
		PS_TAG_PROP_TAGTYPE,
		PS_TAG_PROP_NAME,
		PS_TAG_PROP_LONGNAME,
		PS_TAG_PROP_ISUNIQUE,
		PS_TAG_PROP_DESCRIPTION,
		PS_TAG_PROP_SECURITYAREA,
		PS_TAG_PROP_PARENTID,
		PS_TAG_PROP_FIRSTCHILDID,
		PS_TAG_PROP_PREVID,
		PS_TAG_PROP_NEXTID,
		PS_TAG_PROP_ISNODE,
		PS_TAG_PROP_SUBNODECOUNT,
		PS_TAG_PROP_DATATYPE,
		PS_TAG_PROP_LASTMODIFYTIME,
		PS_TAG_PROP_CREATETIME,
		PS_TAG_PROP_TAGBASE_MAX,

		/* 保存相关属性 */
		PS_TAG_PROP_HIS_MIN = 30,
		PS_TAG_PROP_HIS_ISSAVE =	PS_TAG_PROP_HIS_MIN,	/* 是否保存开关 */
		PS_TAG_PROP_HIS_COMPRESSRATE,				/* 压缩失真率 */
		PS_TAG_PROP_HIS_ISCOMPRESSRATEPERCENTAGE,	/* 压缩率是否采用百分比形式 */
		PS_TAG_PROP_HIS_COMPRESSMODE,				/* 压缩模式 */
		PS_TAG_PROP_HIS_MAX,

		/* 扩展属性最小值 */
		PSPROPFLAG_EXTEND_MIN=37,
		PS_TAG_PROP_PV=PSPROPFLAG_EXTEND_MIN,
		PS_TAG_PROP_LASTPV,
		PS_TAG_PROP_PV_TIME,
		PS_TAG_PROP_PV_QUALITY,
		PS_TAG_PROP_LASTPV_TIME,
		PS_TAG_PROP_LASTPV_QUALITY,
		PS_TAG_PROP_OFFMESSAGE,
		PS_TAG_PROP_ONMESSAGE,
		PS_TAG_PROP_INITVALUE,
		PS_TAG_PROP_SAVEASINITVALUE,
		PS_TAG_PROP_ENABLEALARM,
		PS_TAG_PROP_ENABLEVALUEALARM,
		PS_TAG_PROP_NORMALVALUE,
		PS_TAG_PROP_VALUEALARMNEEDRESPOND,
		PS_TAG_PROP_ENABLEQUALITYALARM,
		PS_TAG_PROP_QUALITYALARMNEEDRESPOND,
		PS_TAG_PROP_VALUEALARMLEVEL,
		PS_TAG_PROP_QUALITYALARMLEVEL,

		PS_TAG_PROP_FLAG_MAX_DIGITAL,
		PS_TAG_PROP_FLAG_MAX_STRING=PS_TAG_PROP_FLAG_MAX_DIGITAL,
		/* 模拟量 */
		PS_TAG_PROP_ENABLELLALARM,					/* 低低限开关 */
		PS_TAG_PROP_ENABLELOALARM,					/* 低限开关 */
		PS_TAG_PROP_ENABLEHIALARM,		  			/* 高限开关 */
		PS_TAG_PROP_ENABLEHHALARM,		  			/* 高高限开关 */

		PS_TAG_PROP_ENABLERATEALARM,		  		/* 变化率报警开关 */
		PS_TAG_PROP_ENABLEDEVALARM,		  			/* 偏差报警开关 */


		PS_TAG_PROP_LOWLOWALARMNEEDRESPOND,			/* 低低限是否需要应答 */
		PS_TAG_PROP_LOWALARMNEEDRESPOND,			/* 低限是否需要应答 */
		PS_TAG_PROP_HIGHALARMNEEDRESPOND,		  	/* 高限是否需要应答 */
		PS_TAG_PROP_HIGHHIGHALARMNEEDRESPOND,	  	/* 高高限是否需要应答 */
		PS_TAG_PROP_RATEALARMNEEDRESPOND,		  	/* 变化率报警是否需要应答 */
		PS_TAG_PROP_DEVALARMNEEDRESPOND,	        /* 偏差报警是否需要应答 */


		PS_TAG_PROP_LOWLOWALARM,					/* 低低限 */
		PS_TAG_PROP_LOWALARM,						/* 低限 */
		PS_TAG_PROP_HIGHALARM,						/* 高限 */
		PS_TAG_PROP_HIGHHIGHALARM,					/* 高高限 */
		PS_TAG_PROP_RATE,							/* 变化率报警限值 */
		PS_TAG_PROP_RATEPERIOD,						/* 变化率周期 */
		PS_TAG_PROP_DEV,							/* 偏差报警限值 */
		PS_TAG_PROP_SP,								/* 目标值 */
		PS_TAG_PROP_DEADBAND,						/* 报警死区 */

		PS_TAG_PROP_LOWLOWALARMLEVEL,				/* 低低限报警优先级 */
		PS_TAG_PROP_LOWALARMLEVEL,					/* 低限报警优先级 */
		PS_TAG_PROP_HIGHALARMLEVEL,					/* 高限报警优先级 */
		PS_TAG_PROP_HIGHHIGHALARMLEVEL,				/* 高高限报警优先级 */
		PS_TAG_PROP_RATEALARMLEVEL,					/* 变化率报警优先级 */
		PS_TAG_PROP_DEVALARMLEVEL,					/* 偏差报警优先级 */

		PS_TAG_PROP_RANGEMINIMUM,					/* 量程下限 */
		PS_TAG_PROP_RANGEMAXIMUN,					/* 量程上限 */
		PS_TAG_PROP_ENGINEERINGUNIT,				/* 工程单位 */

		PS_TAG_PROP_FLAG_MAX_ANALOG,

		PS_TAG_PROP_FLAG_EXTEND_MAX
	} PS_TAG_PROP_ENUM;

	/*
	<summary>
	历史数据的压缩模式
	</summary> */
	typedef enum __HIS_COMPRESSMODE_ENUM
	{
		HIS_COMPRESSMODE_UNDEFINED=0,				/* 未定义 */
		HIS_COMPRESSMODE_NOCOMPRESS,				/* 不压缩 */
		HIS_COMPRESSMODE_CHANGE,					/* 变化压缩 */
		HIS_COMPRESSMODE_SWING						/* LKT压缩 */
	}HIS_COMPRESSMODE_ENUM;

	/* 
	<summary>
	测点改变的类型
	</summary> */
	typedef enum __PS_TAG_CHANGE_TYPE_ENUM
	{
		PS_TAG_CHANGE_TYPE_CREATE = 0,				/* 测点建立 */
		PS_TAG_CHANGE_TYPE_CHANGE,					/* 测点属性改动 */
		PS_TAG_CHANGE_TYPE_DELETE,					/* 测点被删除 */
		PS_TAG_CHANGE_TYPE_INIT,					/* 系统初始化，所有测点被删除 */
		PS_TAG_CHANGE_TYPE_MAX 
	} PS_TAG_CHANGE_TYPE_ENUM;


	/* 
	<summary>
	单个测点类型
	</summary> */
	typedef struct __PS_TAG_TYPE_INFO
	{
		PSUINT16			Id;						/* 测点类型ID */
		PSSTR				Name;					/* 测点类型名称 */
		PSSTR				Desc;					/* 测点类型描述 */
	} PS_TAG_TYPE_INFO;

	/* 
	<summary>
	单个属性
	</summary> */
	typedef struct __PS_TAG_PROP_INFO
	{
		PSUINT16			Id;						/* 属性ID */
		PSSTR				Name;					/* 属性名称 */
		PSUINT32			DataType;				/* 数据类型 */
		PSBOOL				ReadOnly;				/* 是否只读属性 */
		PSSTR				Desc;					/* 描述 */
	} PS_TAG_PROP_INFO;

	/* 
	<summary>
	测点属性值数组
	</summary> */
	typedef struct __PS_TAG_PROP_LIST
	{
		PSUINT32			PropCount;				/* 属性个数 */
		PSUINT16			*PropIds;				/* 属性ID数组 */
		PS_VARIANT			*PropValues;				/* 属性值数组 */
	} PS_TAG_PROP_LIST;

	/* 
	<summary>
	测点查询条件过滤
	</summary> */
	typedef struct __PS_TAG_QUERY_FILTER
	{
		PSUINT16			QueryLevel;				/* 查询的树深度，0查本身，PSQUERYLEVEL_ALL查所有，1、2、3...查相关深度 */
		PSBOOL				QuerySelf;				/* 当查询的深度超过0时，是否查起始结点本身 */
		PSUINT32			FieldPropCount;			/* 过滤的属性数量 */
		PSUINT16			*FieldPropIds;			/* 过滤的属性ID数组 */
		PS_VARIANT			*FieldPropValues;		/* 过滤的属性值数组 */
		PSUINT32			Result_Start;			/* 从符合条件的第Result_Start个元素开始返回 */
		PSUINT32			Result_Num;				/* 返回的符合条件的元素个数 为0时表示返回Result_Start之后的全部 */
	} PS_TAG_QUERY_FILTER;


	/* =====================================================================
	测点类型（PSTagType_*）相关函数定义
	===================================================================== */

	/* 
	<summary>
	[API] 得到系统支持的测点类型数组
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pnTagTypeCount">
	返回系统支持的测点类型总数，空间由调用者申请并负责释放
	</param>
	<param name="ppTagTypes">
	返回系统支持的所有测点类型
	当ppTagTypes为NULL表示只获取数量,否则需要调用前*ppTagTypes为NULL
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeTagTypeList(ppTagTypes,*pnTagTypeCount)函数释放
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_TagType_GetTagTypeList(
		PSIN PSHANDLE hServer,
		PSOUT PSUINT32 *pnTagTypeCount,
		PSOUT PS_TAG_TYPE_INFO **ppTagTypes
		);

	/* 
	<summary>
	[API] 得到某测点类型的所有属性列表
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nTagType">
	测点类型
		PSTAGTYPE_NODE:	结点测点
		PSTAGTYPE_ALL:	所有测点
	</param>
	<param name="pnTagPropCount">
	返回某测点类型的属性总数，空间由调用者申请并负责释放
	</param>
	<param name="ppTagPropInfos">
	返回某测点类型的所有属性
	当ppTagPropInfos为NULL表示只获取数量,否则需要调用前*ppTagPropInfos为NULL
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeTagPropInfoList(ppTagPropInfos,*pnTagPropCount)函数释放
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	举例说明：
		系统有两个测点类型：TagType1、TagType2，其中
		TagType1中包含属性ID{1,2,3,5}，TagType中包含属性ID{1,3,4,6}，
		则以PSTAGTYPE_ALL为参数，得到的属性总数为6；
		需要注意，相同ID的属性，在不同测点类型中具有相同的含义
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_TagType_GetPropList(
		PSIN PSHANDLE hServer,
		PSIN PSUINT16 nTagType,
		PSOUT PSUINT32 *pnTagPropCount,
		PSOUT PS_TAG_PROP_INFO **ppTagPropInfos
		);

	/* 
	<summary>
	[API] 由属性的名称得到属性的ID
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pszPropName">
	属性名称
	</param>
	<param name="pnPropId">
	返回结果，空间由调用者申请并负责释放
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_TagType_GetId(
		PSIN PSHANDLE hServer,
		PSIN PSSTR pszPropName,
		PSOUT PSUINT16 *pnPropId
		);

	/* =====================================================================
	测点（PSTag_*）相关函数定义
	===================================================================== */


	/* 
	<summary>
	[API] 测点订阅的回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	新建订阅时返回的订阅号
	</param>
	<param name="pUserPara">
	测点订阅psAPI_Tag_NewSubscribe传入的自定义参数
	</param>
	<param name="nTagId">
	发布测点ID
	</param>
	<param name="nChangeType">
	测点变化类型
	</param>
	<param name="nPropCount">
	测点变化属性个数
	</param>
	<param name="pPropIds">
	测点变化属性数组
	</param>
	<param name="pPropValues">
	测点变化属性值数组
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_Tag_CallbackFunction)(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId,
		PSIN PSVOID *pUserPara,
		PSIN PSUINT32 nTagId,
		PSIN PSUINT32 nChangeType,
		PSIN PSUINT32 nPropCount,
		PSIN PSUINT16 *pPropIds,
		PSIN PS_VARIANT *pPropValues
		);

	/* 
	<summary>
	[API] 批量增加测点异步回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pUserPara">
	使用psAPI_Tag_AddListAsyn传入的自定义参数
	</param>
	<param name="nCount">
	测点数，pTagIds、pAPIErrors数组的大小为nCount
	</param>
	<param name="ppTagIds">
	每个加入测点属性数组，空间由调用者申请并负责释放
	</param>
	<param name="nRet">
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</param>
	<param name="pAPIErrors">
	nRet返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点添加不成功，返回错误号数组
	测点成功添加在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，释放
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_Tag_AddListAsynComplete)(
		PSIN PSHANDLE hServer,
		PSIN PSVOID *pUserPara,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN PSAPIStatus nRet,
		PSIN PSAPIStatus *pAPIErrors
		);

	/* 
	<summary>
	[API] 查询测点树异步回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pUserPara">
	使用psAPI_Tag_QueryAsyn传入的自定义参数
	</param>
	<param name="nCount">
	测点数，pTagPropValues数组的大小为nCount
	</param>
	<param name="pTagPropValues">
	查询返回测点属性数组
	空间由被调用者申请,释放
	</param>
	<param name="nRet">
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_Tag_QueryAsynComplete)(
		PSIN PSHANDLE hServer,
		PSIN PSVOID *pUserPara,
		PSIN PSUINT32 nCount,
		PSIN PS_TAG_PROP_LIST *pTagPropValues,
		PSIN PSAPIStatus nRet
		);
	/* 
	<summary>
	[API] 查询测点树,返回结果个数 异步回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pUserPara">
	使用psAPI_Tag_QueryCountAsyn传入的自定义参数
	</param>
	<param name="nCount">
	返回的测点数
	</param>
	<param name="nRet">
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_Tag_QueryCountAsynComplete)(
		PSIN PSHANDLE hServer,
		PSIN PSVOID *pUserPara,
		PSIN PSUINT32 nCount,
		PSIN PSAPIStatus nRet
		);

	/* 
	<summary>
	[API] 在某结点下增加一批测点
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nParentTagId">
	加入测点的父测点ID
	</param>
	<param name="nPropCount">
	加入测点属性数量 pPropIds、pPropValues数组的大小为nPropCount
	</param>
	<param name="pPropIds">
	加入测点属性ID数组
	</param>
	<param name="pPropValues">
	加入测点对于属性ID的值数组
	</param>
	<param name="pnTagId">
	返回添加新测点的ID
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> 
	<remarks>
	添加测点是最少应设置测点名称，测点类型
	测点类型为模拟量时应设置测点的数据类型
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_Add(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nParentTagId,
		PSIN PSUINT32 nPropCount,
		PSIN PSUINT16 *pPropIds,
		PSIN PS_VARIANT *pPropValues,
		PSOUT PSUINT32 *pnTagId
		);

	/* 
	<summary>
	[API] 在某结点下增加一批测点
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nParentTagId">
	加入测点的父测点ID
	</param>
	<param name="nCount">
	加入测点数，pTagPropValues、pTagIds、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagPropValues">
	每个加入测点属性数组，空间由调用者申请并负责释放
	</param>
	<param name="ppTagIds">
	返回增加测点的ID数组
	空间由被调用者申请，由调用者通过PSMemory_FreeAndNull函数释放
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点添加不成功，返回错误号数组
	测点成功添加在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_AddList(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nParentTagId,
		PSIN PSUINT32 nCount,
		PSIN PS_TAG_PROP_LIST *pTagPropValues,
		PSOUT PSUINT32 **ppTagIds,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 在某结点下增加一批测点异步接口
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nParentTagId">
	加入测点的父测点ID
	</param>
	<param name="nCount">
	加入测点数，pTagPropValues数组的大小为nCount
	</param>
	<param name="ppTagIds">
	每个加入测点属性数组，空间由调用者申请并负责释放
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
	PSDLL PSAPIStatus PSAPI psAPI_Tag_AddListAsyn(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nParentTagId,
		PSIN PSUINT32 nCount,
		PSIN PS_TAG_PROP_LIST *pTagPropValues,
		PSIN psAPI_Tag_AddListAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 删除测点
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="unTagId">
	需删除测点的ID
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_Delete(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nTagId
		);

	/* 
	<summary>
	[API] 删除一批测点
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	测点ID数组
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点删除不成功，返回错误号数组
	测点成功删除在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_DeleteList(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 将测点（及其子结点）复制到一个新的父测点下的子测点数组的最后位置
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSourceTagId">
	需复制的测点ID
	</param>
	<param name="nParentTagId">
	新父测点的ID
	</param>
	<param name="pnNewTagId">
	如果复制成功，则返回测点的ID，空间由调用者申请并负责释放
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	如果新的父测点下有同名的测点,操作将会失败
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_Copy(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSourceTagId,
		PSIN PSUINT32 nParentTagId,
		PSOUT PSUINT32 *pnNewTagId
		);

	/* 
	<summary>
	[API] 将测点（及其子结点）移动到一个新的父测点下的子测点数组的最后位置
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSourceTagId">
	需移动的测点ID
	</param>
	<param name="nParentTagId">
	新父测点的ID
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	移动后，测点ID不发生变化
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_Move(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSourceTagId,
		PSIN PSUINT32 nParentTagId
		);

	/* 
	<summary>
	[API] 判断测点是否存在
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nTagId">
	需判断的测点ID
	</param>
	<param name="pbExist">
	返回结果，空间由调用者申请并负责释放
	PSTRUE:存在
	PSFALSE:不存在
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_IsExist(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nTagId,
		PSOUT PSBOOL *pbExist
		);

	/* 
	<summary>
	[API] 判断第一个测点是否是第二个测点的父结点
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nFirstTagId">
	第一个测点ID
	</param>
	<param name="nSecondTagId">
	第二个测点ID
	</param>
	<param name="pbParent">
	返回结果，空间由调用者申请并负责释放
	PSTRUE:是
	PSFALSE:不是
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_IsParent(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nFirstTagId,
		PSIN PSUINT32 nSecondTagId,
		PSOUT PSBOOL *pbParent
		);

	/* 
	<summary>
	[API] 判断第一个测点是否是第二个测点的祖先结点，即从第二个测点开始循
	环找父结点，是否能找到第一个测点
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nFirstTagId">
	第一个测点ID
	</param>
	<param name="nSecondTagId">
	第二个测点ID
	</param>
	<param name="pbAncestor">
	返回结果，空间由调用者申请并负责释放
	PSTRUE:是
	PSFALSE:不是
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_IsAncestor(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nFirstTagId,
		PSIN PSUINT32 nSecondTagId,
		PSOUT PSBOOL *pbAncestor
		);

	/* 
	<summary>
	[API] 由测点长名 得到测点的ID
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pszTagLongName">
	测点长名
	</param>
	<param name="pnTagId">
	返回测点ID，返回对应的测点ID或PSTAGID_UNUSED
	空间由调用者申请并负责释放
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	常见返回错误类型:
		PSERR_TAG_NAME_NOT_EXIST 没找到测点长名为pszTagLongName的测点
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_GetIdByLongName(
		PSIN PSHANDLE hServer,
		PSIN PSSTR pszTagLongName,
		PSOUT PSUINT32 *pnTagId
		);

	/* 
	<summary>
	[API] 由测点长名数组 得到测点的ID数组
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点长名数量 pszTagLongNames，ppTagIds数组数量为nCount
	</param>
	<param name="pszTagLongNames">
	测点长名数组
	</param>
	<param name="pTagIds">
	返回测点ID数组，返回对应的测点ID或PSTAGID_UNUSED
	空间由调用者申请并负责释放psAPI_Memory_FreeAndNull(ppTagIds)
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有根据长名获取测点的ID不成功，返回错误号数组
	根据长名获取测点的ID成功在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_GetIdListByLongName(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount,
		PSIN PSSTR *pszTagLongNames,
		PSOUT PSUINT32 **ppTagIds,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 得到测点的一批属性
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nTagId">
	测点ID
	</param>
	<param name="nPropCount">
	获取测点属性数量 pPropIds、ppPropValues数组数量为nPropCount
	</param>
	<param name="pPropIds">
	获取测点属性ID数组
	</param>
	<param name="ppPropValues">
	返回值数组
	空间由被用用者申请，由调用者通过psAPI_Memory_FreeValueList(ppPropValues,nPropCount)释放
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_GetTagProps(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nTagId,
		PSIN PSUINT32 nPropCount,
		PSIN PSUINT16 *pPropIds,
		PSOUT PS_VARIANT **ppPropValues
		);

	/* 
	<summary>
	[API] 设置测点的一批属性
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nTagId">
	测点ID
	</param>
	<param name="nPropCount">
	设置测点属性数量 pPropIds、pPropValues数组数量为nPropCount
	</param>
	<param name="pPropIds">
	设置测点属性ID数组
	</param>
	<param name="pPropValues">
	设置测点属性ID对应的值数组
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_SetTagProps(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nTagId,
		PSIN PSUINT32 nPropCount,
		PSIN PSUINT16 *pPropIds,
		PSIN PS_VARIANT *pPropValues
		);

	/* 
	<summary>
	[API] 得到一批测点的一批属性
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、ppTagPropValues、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	获取测点ID数组
	</param>
	<param name="nPropCount">
	获取测点属性数量 pPropIds数组数量为nPropCount
	</param>
	<param name="pPropIds">
	获取测点属性ID数组
	</param>
	<param name="ppTagPropValues">
	返回值数组
	调用前，*ppTagPropValues必须为NULL
	空间由被用用者申请，由调用者通过psAPI_Memory_FreeTagPropList(ppTagPropValues,nCount)释放
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点获取属性不成功，返回错误号数组
	测点成功获取属性在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_GetTagListProps(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN PSUINT32 nPropCount,
		PSIN PSUINT16 *pPropIds,
		PSOUT PS_TAG_PROP_LIST **ppTagPropValues,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 设置一批测点的一批属性
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、ppTagPropValues、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	设置测点ID数组
	</param>
	<param name="pTagPropValues">
	设置的属性值数组
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点设置属性不成功，返回错误号数组
	测点成功设置属性在数组里返回PSRET_OK，失败时返回相应的错误代码
	空间由被调用者申请，由调用者通过psAPI_Memory_FreeAndNull(ppAPIErrors)函数释放
	调用前，*ppAPIErrors必须为NULL
	调用后，如果函数返回值不为PSERR_FAIL_IN_BATCH，则*ppAPIErrors为NULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_SetTagListProps(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN PS_TAG_PROP_LIST *pTagPropValues,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 查询测点树
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nTagId">
	查询的起始结点（包括它本身）
	</param>
	<param name="pFilter">
	查询过滤条件
	如果传为PSNULL,返回起始结点本身和起始结点的所有子结点
	空间由调用者申请，并负责释放
	查询条件为匹配属性数组，对于非字符串属性，采用严格相等匹配
	对于字符串属性，支持“?*”等模糊查询
	匹配属性数组的关系是“并且”的关系
	</param>
	<param name="nPropCount">
	查询后需返回的属性字段数量,为0时返回测点所有属性
	</param>
	<param name="pPropIds">
	查询后需返回的属性字段数组,nPropCount为0时可为PSNULL
	</param>
	<param name="pnCount">
	查询返回的测点数量
	</param>
	<param name="ppTagPropValues">
	查询返回测点属性数组结果
	空间由被调用者申请，调用者通过psAPI_Memory_FreeTagPropList(ppTagPropValues,*pnCount)释放
	调用时，*ppTagPropValues必须为PSNULL；
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	如果起始结点是根结点,则不会返回本身结点
	如果需要返回测点ID,需要在返回的属性字段设置返回ID,ppTagPropValues包含测点ID
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_Query(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nTagId,
		PSIN PS_TAG_QUERY_FILTER *pFilter,
		PSIN PSUINT32 nPropCount,
		PSIN PSUINT16 *pPropIds,
		PSOUT PSUINT32 *pnCount,
		PSOUT PS_TAG_PROP_LIST **ppTagPropValues
		);

	/* 
	<summary>
	[API] 查询测点树异步函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nTagId">
	查询的起始结点（包括它本身）
	</param>
	<param name="pFilter">
	查询过滤条件
	如果传为NULL,返回起始结点本身和起始结点的所有子结点
	空间由调用者申请，并负责释放
	查询条件为匹配属性数组，对于非字符串属性，采用严格相等匹配
	对于字符串属性，支持“?*”等模糊查询
	匹配属性数组的关系是“并且”的关系
	</param>
	<param name="nPropCount">
	查询后需返回的属性字段数量,为0时返回测点所有属性
	</param>
	<param name="pPropIds">
	查询后需返回的属性字段数组,nPropCount为0时可为PSNULL
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
	如果起始结点是根结点,则不会返回本身结点
	如果需要返回测点ID,需要在返回的属性字段设置返回ID,ppTagPropValues包含测点ID
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_QueryAsyn(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nTagId,
		PSIN PS_TAG_QUERY_FILTER *pFilter,
		PSIN PSUINT32 nPropCount,
		PSIN PSUINT16 *pPropIds,
		PSIN psAPI_Tag_QueryAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);


	/* 
	<summary>
	[API] 查询测点树 返回结果个数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nTagId">
	查询的起始结点（包括它本身）
	</param>
	<param name="pFilter">
	查询过滤条件
	如果传为NULL,返回起始结点本身和起始结点的所有子结点
	空间由调用者申请，并负责释放
	查询条件为匹配属性数组，对于非字符串属性，采用严格相等匹配
	对于字符串属性，支持“%*”等模糊查询
	匹配属性数组的关系是“并且”的关系
	</param>
	<param name="pnCount">
	查询返回的测点数量
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	如果起始结点是根结点,则不会返回本身结点
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_QueryCount(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nTagId,
		PSIN PS_TAG_QUERY_FILTER *pFilter,
		PSOUT PSUINT32 *pnCount
		);

	/* 
	<summary>
	[API] 查询测点树 返回结果个数 异步函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nTagId">
	查询的起始结点（包括它本身）
	</param>
	<param name="pFilter">
	查询过滤条件
	如果传为NULL,返回起始结点本身和起始结点的所有子结点
	空间由调用者申请，并负责释放
	查询条件为匹配属性数组，对于非字符串属性，采用严格相等匹配
	对于字符串属性，支持“%*”等模糊查询
	匹配属性数组的关系是“并且”的关系
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
	如果起始结点是根结点,则不会返回本身结点
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_QueryCountAsyn(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nTagId,
		PSIN PS_TAG_QUERY_FILTER *pFilter,
		PSIN psAPI_Tag_QueryCountAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 新建测点订阅
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nCount">
	测点数，pTagIds、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	订阅测点ID数组
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
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点订阅属性变化不成功，返回错误号数组
	测点成功订阅属性变化在数组里返回PSRET_OK，失败时返回相应的错误代码
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
	PSDLL PSAPIStatus PSAPI psAPI_Tag_NewSubscribe(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSIN psAPI_Tag_CallbackFunction CallbackFunction,
		PSIN PSVOID *pUserPara,
		PSOUT PSUINT32 *pnSubscribeId,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 增加测点订阅
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	订阅号,新建测点订阅里返回的订阅号
	</param>
	<param name="nCount">
	测点数，pTagIds、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	订阅测点ID数组
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点订阅属性变化不成功，返回错误号数组
	测点成功订阅属性变化在数组里返回PSRET_OK，失败时返回相应的错误代码
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
	发布订阅时新建测点订阅的回调函数CallbackFunction和用户自定义参数pUserPara
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_AddSubscribe(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 删除测点订阅
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	订阅号,新建测点订阅里返回的订阅号
	</param>
	<param name="nCount">
	测点数，pTagIds、ppAPIErrors数组的大小为nCount
	</param>
	<param name="pTagIds">
	删除测点订阅ID数组
	</param>
	<param name="ppAPIErrors">
	函数返回值为PSERR_FAIL_IN_BATCH时，批量操作中有测点取消订阅属性变化不成功，返回错误号数组
	测点成功取消订阅属性变化在数组里返回PSRET_OK，失败时返回相应的错误代码
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
	PSDLL PSAPIStatus PSAPI psAPI_Tag_DelSubscribe(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pTagIds,
		PSOUT PSAPIStatus **ppAPIErrors
		);

	/* 
	<summary>
	[API] 删除订阅号下的所有测点订阅
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	订阅号,新建测点订阅里返回的订阅号
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	注意,删除后订阅号不能在使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Tag_DelSubscribeAll(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId
		);

#ifdef  __cplusplus
}
#endif

#pragma pack(pop, Before_psAPISDK)

#endif	/* __PS_APITAG_H__ */