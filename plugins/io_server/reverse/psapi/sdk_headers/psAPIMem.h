#ifndef __PS_APIMEM_H__
#define __PS_APIMEM_H__

#include "psAPICommon.h"

#ifdef __cplusplus
extern "C"
{
#endif


	/* =====================================================================
	内存辅助（PSMemory_*）函数定义
	===================================================================== */

	/* 
	<summary>
	[API] 为变量申请空间
	</summary>
	<param name="ppVoid">
	变量地址的指针
	如果申请成功，则将地址指向新空间，如果不成功，则指向PSNULL
	</param>
	<param name="nSize">
	申请的大小
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回PSERR_COMMON_NO_MEMORY错误
	</returns>
	<remarks>
	建议在应用程序中与实时数据库相关的操作，所有对内存的申请，都调用该函数
	注意:
		申请释放采用在同一个模块申请释放原则，避免在一个模块申请，另一个模块释放
		使用本函数申请的变量请用psAPI_Memory_FreeAndNull来释放
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_New(
		PSOUT PSVOID **ppVoid,
		PSIN PSUINT32 nSize
		);

	/* 
	<summary>
	[API] 为变量申请空间，并清空内存
	</summary>
	<param name="ppVoid">
	变量地址的指针
	如果申请成功，则将地址指向新空间
	如果申请成功，则内容清为0
	如果不成功，则指向PSNULL
	</param>
	<param name="nSize">
	申请的尺寸
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回PSERR_COMMON_NO_MEMORY错误
	</returns>
	<remarks>
	建议在应用程序中与实时数据库相关的操作，所有对内存的申请，都调用该函数
	注意:
		申请释放采用在同一个模块申请释放原则，避免在一个模块申请，另一个模块释放
		使用本函数申请的变量请用psAPI_Memory_FreeAndNull来释放
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_NewAndClear(
		PSOUT PSVOID **ppVoid,
		PSIN PSUINT32 nSize
		);

	/* 
	<summary>
	[API] 释放内存空间
	</summary>
	<param name="ppVoid">
	变量地址的指针
	如果变量地址不为PSNULL，则释放内存空间，并自动将地址设为PSNULL
	</param>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	建议在应用程序中与实时数据库相关的操作，所有对内存的申请，都调用该函数
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeAndNull(
		PSIN PSOUT PSVOID **ppVoid
		);

	/* 
	<summary>
	[API] 释放PS_CONNECT_INFO类型指针
	</summary>
	<param name="ppConnectInfos">
	PS_CONNECT_INFO数组指针
	</param>
	<param name="nCount">
	PS_CONNECT_INFO数组数量
	</param>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	配合psAPI_Server_GetAllConnectInfo使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeConnectInfoList(
		PSIN PSOUT PS_CONNECT_INFO **ppConnectInfos,
		PSIN PSUINT32 nCount
		);

	/* 
	<summary>
	[API] 释放PSServerProp类型指针
	</summary>
	<param name="ppServerProp">
	服务器属性指针
	</param>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	配合psAPI_Server_GetProp使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeServerProp(
		PSIN PSOUT PS_SERVER_PROP **ppServerProp
		);

	/* 
	<summary>
	[API] 释放PS_VARIANT类型指针
	</summary>
	<param name="ppValues">
	PS_VARIANT值数组指针
	</param>
	<param name="nCount">
	PS_VARIANT值数组数量
	</param>
	<returns>
	总是返回PSRET_OK
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeValueList(
		PSIN PSOUT PS_VARIANT **ppValues, 
		PSIN PSUINT32 nCount
		);

	/* 
	<summary>
	[API] 释放PS_TAG_PROP_LIST类型指针
	</summary>
	<param name="ppTagPropValues">
	PS_TAG_PROP_LIST数组指针
	</param>
	<param name="nCount">
	PS_TAG_PROP_LIST数组数量
	</param>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	配合psAPI_Tag_GetTagListProps、psAPI_Tag_Query函数使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeTagPropList(
		PSIN PSOUT PS_TAG_PROP_LIST **ppTagPropValues,
		PSIN PSUINT32 nCount
		);

	/* 
	<summary>
	[API] 释放PS_TAG_TYPE_INFO类型指针
	</summary>
	<param name="ppTagTypeInfos">
	PS_TAG_TYPE_INFO数组指针
	</param>
	<param name="nCount">
	PS_TAG_TYPE_INFO数组数量
	</param>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	配合psAPI_TagType_GetTagTypeList函数使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeTagTypeList(
		PSIN PSOUT PS_TAG_TYPE_INFO **ppTagTypeInfos,
		PSIN PSUINT32 nCount
		);

	/* 
	<summary>
	[API] 释放PS_TAG_PROP_INFO类型指针
	</summary>
	<param name="ppTagPropValues">
	PS_TAG_PROP_INFO数组指针
	</param>
	<param name="nCount">
	PS_TAG_PROP_INFO数组数量
	</param>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	配合psAPI_TagType_GetPropList函数使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeTagPropInfoList(
		PSIN PSOUT PS_TAG_PROP_INFO **ppTagPropInfos,
		PSIN PSUINT32 nCount
		);


	/* 
	<summary>
	[API] 释放PS_DATA类型指针
	</summary>
	<param name="ppDataList">
	PS_DATA数组指针
	</param>
	<param name="nCount">
	PS_DATA数组数量
	</param>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	配合读取实时值psAPI_Real_Read、psAPI_Real_ReadList
		以及订阅实时并获取初值psAPI_Real_NewSubscribeAndRead、psAPI_Real_AddSubscribeAndRead函数使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeDataList(
		PSIN PSOUT PS_DATA **ppDataList,
		PSIN PSUINT32 nCount
		);

	/* 
	<summary>
	[API] 释放PS_HIS_DATA类型指针
	</summary>
	<param name="ppTagHisDataList">
	PSTagHisData数组指针
	</param>
	<param name="nCount">
	PSTagHisData数组数量
	</param>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	配合读取历史值psAPI_His_ReadRaw、psAPI_His_ReadAtTime、psAPI_His_ReadProcessed函数使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeTagHisDataList(
		PSIN PSOUT PS_HIS_DATA **ppTagHisDataList,
		PSIN PSUINT32 nCount
		);

	/* 
	<summary>
	[API] 释放PS_USER_GROUP类型指针
	</summary>
	<param name="ppUserGroups">
	PS_USER_GROUP数组指针
	</param>
	<param name="nCount">
	PS_USER_GROUP数组数量
	</param>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	配合psAPI_UserGroup_GetList、psAPI_UserGroup_GetProp使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeUserGroupList(
		PSIN PSOUT PS_USER_GROUP **ppUserGroups,
		PSIN PSUINT32 nCount
		);

	/* 
	<summary>
	[API] 释放PS_USER类型指针
	</summary>
	<param name="ppUsers">
	PS_USER数组指针
	</param>
	<param name="nCount">
	PS_USER数组数量
	</param>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	配合psAPI_User_GetList、psAPI_User_GetProp使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeUserList(
		PSIN PSOUT PS_USER **ppUsers,
		PSIN PSUINT32 nCount
		);

	/* 
	<summary>
	[API] 释放PS_ALARM类型指针
	</summary>
	<param name="ppAlarms">
	PS_ALARM数组指针
	</param>
	<param name="nCount">
	PS_ALARM数组数量
	</param>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	配合psAPI_Alarm_Query使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeAlarmList(
		PSIN PSOUT PS_ALARM **ppAlarms,
		PSIN PSUINT32 nCount
		);

	/* 
	<summary>
	[API] 释放PS_EVENT类型指针
	</summary>
	<param name="ppEvents">
	PS_EVENT数组指针
	</param>
	<param name="nCount">
	PS_EVENT数组数量
	</param>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	配合psAPI_Event_Query使用
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Memory_FreeEventList(
		PSIN PSOUT PS_EVENT **ppEvents,
		PSIN PSUINT32 nCount
		);

#ifdef  __cplusplus
}
#endif

#endif	/* __PS_APIMEM_H__ */