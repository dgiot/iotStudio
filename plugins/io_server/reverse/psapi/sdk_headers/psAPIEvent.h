#ifndef __PS_APIEVENT_H__
#define __PS_APIEVENT_H__

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
	事件主题
	</summary> */
	typedef enum __PS_EVENT_TOPIC_ENUM
	{
		PS_EVENT_TOPIC_APPLICATION = 0,			/* 程序相关 */
		PS_EVENT_TOPIC_COMMUNICATION,			/* 连接相关 */
		PS_EVENT_TOPIC_PERFORMANCE,				/* 性能相关 */
		PS_EVENT_TOPIC_SECURITY,				/* 安全相关 */
		PS_EVENT_TOPIC_CONFIGURE,				/* 配置相关 */
		PS_EVENT_TOPIC_MAX
	} PS_EVENT_TOPIC_ENUM; 

	/* 
	<summary>
	事件级别
	</summary> */
	typedef enum __PS_EVENT_LEVEL_ENUM
	{
		PS_EVENT_LEVEL_INFORMATION = 0,			/* 信息 */
		PS_EVENT_LEVEL_NOTIFY,					/* 通报 */
		PS_EVENT_LEVEL_WARN,					/* 警告 */
		PS_EVENT_LEVEL_ALERT,					/* 警报 */
		PS_EVENT_LEVEL_ERROR,					/* 错误 */
		PS_EVENT_LEVEL_CRITICAL,				/* 危急 */
		PS_EVENT_LEVEL_FATAL,					/* 致命 */
		PS_EVENT_LEVEL_MAX
	} PS_EVENT_LEVEL_ENUM;

	/* 
	<summary>
	事件内容
	</summary> */
	typedef struct __PS_EVENT
	{
		PSUINT32			Id;					/* 事件Id */
		PS_TIME 			Time;				/* 事件发生时间 */
		PSUINT16			UserID;				/* 用户标识号 */
		PSUINT32			EventTopic;			/* 事件主题 */
		PSUINT32			Level;				/* 事件级别 */
		PSUINT32			TagId;				/* 相关测点Id */
		PSSTR				EventString;		/* 事件内容 */
	} PS_EVENT;

	/* 
	<summary>
	事件字段定义
	</summary> */
	typedef struct __PS_EVENT_FIELD
	{
		PSBOOL				All;				/* 所有字段均被设置 */
		PSBOOL 				Time;				/* 事件发生时间 */
		PSBOOL				UserID;				/* 用户标识号 */
		PSBOOL				EventTopic;			/* 事件主题 */
		PSBOOL				Level;				/* 事件级别 */
		PSBOOL				TagId;				/* 相关测点Id */
		PSBOOL				EventString;		/* 事件内容 */
	} PS_EVENT_FIELD;							 

	/* 
	<summary>
	事件查询过滤器
	</summary> */
	typedef struct __PS_EVENT_FILTER
	{
		PSUINT32			Id;					/* 事件相关的编号 */
		PSUINT32		    TagId;				/* 相关测点ID */
		PSUINT16			UserID;				/* 用户标识号 */
		PS_TIME 			StartTime;			/* 事件发生 起始时间 */
		PS_TIME 			EndTime;			/* 事件发生 结束时间 */
		PSUINT32			EventTopic;			/* 事件主题 */
		PSUINT32			LowLevel;			/* 查询事件级别的低限 */
		PSUINT32			HighLevel;			/* 查询事件级别的高限 */
		PSSTR				EventString;		/* 事件内容 */
	} PS_EVENT_FILTER;

	/* 
	<summary>
	事件查询过滤器字段定义
	</summary> */
	typedef struct __PS_EVENT_FILTER_FIELD
	{
		PSBOOL				All;				/* 所有字段均被设置 */
		PSBOOL				Id;					/* 事件相关的编号 */
		PSBOOL			    TagId;				/* 相关测点ID */
		PSBOOL				UserID;				/* 用户标识号 */
		PSBOOL				StartTime;			/* 事件发生 起始时间 */
		PSBOOL				EndTime;			/* 事件发生 结束时间 */
		PSBOOL				EventTopic;			/* 事件主题 */
		PSBOOL				LowLevel;			/* 查询事件级别的低限 */
		PSBOOL				HighLevel;			/* 查询事件级别的高限 */
		PSBOOL				EventString;		/* 事件内容 */
	} PS_EVENT_FILTER_FIELD;


	/* =====================================================================
	事件处理（PSEvent_*）相关函数定义
	===================================================================== */

	/* 
	<summary>
	[API] 事件订阅回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	新建订阅时返回的订阅号
	</param>
	<param name="pUserPara">
	使用psAPI_Event_NewSubscribe的用户自定义参数
	</param>
	<param name="pEvent">
	回调事件内容
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_Event_CallbackFunction)(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId,
		PSIN PSVOID *pUserPara,
		PSIN PS_EVENT *pEvent
		);


	/* 
	<summary>
	[API] 查询事件异步回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pUserPara">
	使用psAPI_Event_QueryAsyn的用户自定义参数
	</param>
	<param name="nEventCount">
	回调事件数量
	</param>
	<param name="pEvents">
	回调事件内容
	</param>
	<param name="nRet">
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_Event_QueryAsynComplete)(
		PSIN PSHANDLE hServer,
		PSIN PSVOID *pUserPara,
		PSIN PSUINT32 nEventCount,
		PSIN PS_EVENT *pEvents,
		PSIN PSAPIStatus nRet
		);

	/* 
	<summary>
		[API] 添加事件
	</summary>
	<param name="hServer">
		数据库连接句柄
	</param>
	<param name="pField">
		添加事件域信息，标识PSEvent内选填项是否被添入
	</param>
	<param name="pEvent">
		添加事件内容
	</param>
	<returns>
		成功后事件编号在pEvent.Id里返回
		成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Event_Add(
		PSIN PSHANDLE hServer,
		PSIN PS_EVENT_FIELD pField,
		PSIN PS_EVENT *pEvent
		);

	/* 
	<summary>
		[API] 查询事件
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pFilterField">
	事件查询的过滤条件字段
	</param>
	<param name="pFilter">
	事件查询的过滤条件
	</param>
	<param name="pnEventCount">
	查询返回事件数量
	</param>
	<param name="ppEvents">
	查询返回事件数组
	空间由被调用者申请，调用者释放psAPI_Memory_FreeEventList(ppEvents,*pnEventCount)
	调用前，*ppEvents必须为PSNULL
	</param>
	<returns>
		成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Event_Query(
		PSIN PSHANDLE hServer,
		PSIN PS_EVENT_FILTER_FIELD *pFilterField,
		PSIN PS_EVENT_FILTER *pFilter,
		PSOUT PSUINT32 *pnEventCount,
		PSOUT PS_EVENT **ppEvents
		);

	/* 
	<summary>
	[API] 查询事件异步接口
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pFilterField">
	事件查询的过滤条件字段
	</param>
	<param name="pFilter">
	事件查询的过滤条件
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
	PSDLL PSAPIStatus PSAPI psAPI_Event_QueryAsyn(
		PSIN PSHANDLE hServer,
		PSIN PS_EVENT_FILTER_FIELD *pFilterField,
		PSIN PS_EVENT_FILTER *pFilter,
		PSIN psAPI_Event_QueryAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 新建事件订阅
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pnTagId">
	只订阅相关测点ID为*pnTagId的事件,为PSNULL表示订阅所有的测点
	</param>
	<param name="pnEventTopic">
	只订阅事件主题为*pnEventTopic的事件,为NULL表示订阅所有事件主题
	</param>
	<param name="pnLevel">
	只订阅报警级别为*pnLevel的事件,为PSNULL表示所有报警级别都订阅
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
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Event_NewSubscribe(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 *pnTagId,
		PSIN PSUINT32 *pnEventTopic,
		PSIN PSUINT32 *pnLevel,
		PSIN psAPI_Event_CallbackFunction CallbackFunction,
		PSIN PSVOID *pUserPara,
		PSOUT PSUINT32 *pnSubscribeId
		);

	/* 
	<summary>
	[API] 增加事件订阅
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	订阅号,新建事件订阅里返回的订阅号
	</param>
	<param name="pnTagId">
	只订阅相关测点ID为*pnTagId的事件,为PSNULL表示订阅所有的测点
	</param>
	<param name="pnEventTopic">
	只订阅事件主题为*pnEventTopic的事件,为NULL表示订阅所有事件主题
	</param>
	<param name="pnLevel">
	只订阅报警级别为*pnLevel的事件,为PSNULL表示所有报警级别都订阅
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Event_AddSubscribe(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId,
		PSIN PSUINT32 *pnTagId,
		PSIN PSUINT32 *pnEventTopic,
		PSIN PSUINT32 *pnLevel
		);

	/* 
	<summary>
	[API] 删除订阅号下的所有事件订阅
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	订阅号,新建事件订阅里返回的订阅号
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Event_DelSubscribeAll(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId
		);

#ifdef  __cplusplus
}
#endif

#pragma pack(pop, Before_psAPISDK)

#endif	/* __PS_APIEVENT_H__ */
