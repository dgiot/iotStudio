#ifndef __PS_APIALARM_H__
#define __PS_APIALARM_H__

#include "psAPICommon.h"

//定义结构体4字节对齐
#pragma pack(push, Before_psAPISDK)
#pragma pack(4)

#ifdef __cplusplus
extern "C"
{
#endif

	/* <summary>
	报警主题
	</summary> */
	typedef enum
	{
		PS_ALARM_TOPIC_QUALITY_CHANGE=0x01,	/* 质量戳改变*/
		PS_ALARM_TOPIC_VALUE_CHANGE = 0x02,	/* 值改变*/
		PS_ALARM_TOPIC_HIGH = 0x04,			/* 越高限*/
		PS_ALARM_TOPIC_HIGHHIGH = 0x08,		/* 越高高限*/
		PS_ALARM_TOPIC_LOW = 0x10,			/* 越低限*/
		PS_ALARM_TOPIC_LOWLOW = 0x20,		/* 越低低限*/
		PS_ALARM_TOPIC_CHANGERATE = 0x40,	/* 变化率报警*/
		PS_ALARM_TOPIC_WARP = 0x80,			/* 偏差报警*/
	} PS_ALARM_TOPIC_ENUM;

	/* 
	<summary>
	报警级别
	</summary> */
	typedef enum
	{
		PS_ALARM_LEVEL_LOW = 0,		/* 低级*/
		PS_ALARM_LEVEL_HIGH,		/* 高级*/
		PS_ALARM_LEVEL_EMERGENCY	/* 紧急*/
	} PS_ALARM_LEVEL_ENUM;

	/* 
	<summary>
	报警内容
	</summary> */
	typedef struct __PS_ALARM
	{
		PSUINT32			AlarmId;			/* 报警Id */
		PSUINT32			TagId;				/* 产生报警的测点ID */
		PSUINT16			UserID;				/* 用户标识号 */
		PSUINT8				AppType;			/* 产生报警的应用程序类型 */
		PSUINT8				AlarmLevel;			/* 报警级别 */
		PSSTR				AlarmContent;		/* 报警内容 */
		PSSTR				AlarmValue;      	/* 报警值	*/
		PSSTR				AlarmAckUserName;	/* 报警确认用户名*/
		PSUINT8				AlarmTopic;			/* 报警主题 */
		PSBOOL				AlarmNeedAck;		/* 需要确认 */
		PSBOOL				AlarmHaveAcked;		/* 已经确认 */	
		PS_TIME				AlarmStartTime;		/* 产生开始时间（产生报警的时间） */
		PS_TIME 			AlarmEndTime;		/* 报警结束时间 */
		PSUINT16			AlarmAckedId;		/* 应答者ID */
		PS_TIME				AlarmAckTime;		/* 应答时间 */	
	} PS_ALARM;
	/* 
	<summary>
	报警字段定义
	</summary> */
	typedef struct __PS_ALARM_FIELD
	{
		PSBOOL				All;				/* 所有字段均被设置 */
		PSBOOL				AlarmId;			/* 报警Id */
		PSBOOL				TagId;				/* 产生报警的测点ID */
		PSBOOL				UserID;				/* 用户标识号 */
		PSBOOL				AppType;			/* 产生报警的应用程序类型 */
		PSBOOL				AlarmLevel;			/* 报警级别 */
		PSBOOL				AlarmContent;		/* 报警内容 */
		PSBOOL				AlarmValue;      	/* 报警值	*/
		PSBOOL				AlarmAckUserName;	/* 报警确认用户名*/
		PSBOOL				AlarmTopic;			/* 报警主题 */
		PSBOOL				AlarmNeedAck;		/* 需要确认 */
		PSBOOL				AlarmHaveAcked;		/* 已经确认 */	
		PSBOOL				AlarmStartTime;		/* 产生开始时间（产生报警的时间） */
		PSBOOL 				AlarmEndTime;		/* 报警结束时间 */
		PSBOOL				AlarmAckedId;		/* 应答者ID */
		PSBOOL				AlarmAckTime;		/* 应答时间 */
	} PS_ALARM_FIELD;	


	/* 
	<summary>
	报警查询过滤器
	</summary> */
	typedef struct __PS_ALARM_FILTER
	{
		PSUINT32			AlarmId;			/* 报警ID */
		PSUINT32		    TagId;				/* 相关测点ID */
		PSUINT16			UserID;				/* 用户标识号 */
		PSUINT8				AlarmTopic;			/* 报警主题	  */
		PSBOOL				AlarmHaveAcked;		/* 报警的应答标志 */
		PSUINT16			AlarmAckedId;		/* 报警应答者ID */
		PSUINT8				AlarmLowLevel;		/* 查询报警级别的低限 */
		PSUINT8				AlarmHighLevel;		/* 查询报警级别的高限 */
		PSSTR				AlarmContent;		/* 报警内容 */
		PSBOOL				IsQueryOneLevel;	/* 当点ID为结点时是否只查询一层子结点*/
	} PS_ALARM_FILTER;

	/* 
	<summary>
	报警查询过滤器字段定义
	</summary> */
	typedef struct __PS_ALARM_FILTER_FIELD
	{
		PSBOOL				All;				/* 所有字段均被设置 */
		PSBOOL				AlarmId;			/* 报警ID */
		PSBOOL			    TagId;				/* 相关测点ID */
		PSBOOL				UserID;				/* 用户标识号 */
		PSBOOL				AlarmTopic;			/* 报警主题	  */
		PSBOOL				AlarmHaveAcked;		/* 报警的应答标志 */
		PSBOOL				AlarmAckedId;		/* 报警应答者ID */
		PSBOOL				AlarmLowLevel;		/* 查询报警级别的低限 */
		PSBOOL				AlarmHighLevel;		/* 查询报警级别的高限 */
		PSBOOL				AlarmContent;		/* 报警内容 */
		PSBOOL				IsQueryOneLevel;	/* 当点ID为结点时是否只查询一层子结点*/
	} PS_ALARM_FILTER_FIELD;

	/* =====================================================================
	报警处理（PSAlarm_*）相关函数定义
	===================================================================== */
	/* 
	<summary>
	[API] 查询实时报警
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pFilterField">
	报警查询的过滤条件字段
	</param>
	<param name="pFilter">
	报警查询的过滤条件
	</param>
	<param name="pnAlarmCount">
	查询返回报警数量
	</param>
	<param name="ppAlarms">
	查询返回报警数组
	空间由被调用者申请，调用者释放psAPI_Memory_FreeAlarmList(ppAlarms,*pnAlarmCount)
	调用前，*ppAlarms必须为PSNULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> 
	*/
	PSDLL PSAPIStatus PSAPI psAPI_Alarm_Real_Query(
		PSIN PSHANDLE hServer,
		PSIN PS_ALARM_FILTER_FIELD *pFilterField,
		PSIN PS_ALARM_FILTER *pFilter,
		PSOUT PSUINT32 *pnAlarmCount,
		PSOUT PS_ALARM **ppAlarms
		);
	/* 
	<summary>
	[API] 查询历史报警
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pFilterField">
	报警历史查询的过滤条件字段
	</param>
	<param name="pFilter">
	报警历史查询的过滤条件
	</param>
	<param name="pQueryStartTime">
	报警历史查询的开始时间
	</param>
	<param name="pQueryEndTime">
	报警历史查询结束时间
	</param>
	<param name="pnAlarmCount">
	查询返回报警数量
	</param>
	<param name="ppAlarms">
	查询返回报警数组
	空间由被调用者申请，调用者释放psAPI_Memory_FreeAlarmList(ppAlarms,*pnAlarmCount)
	调用前，*ppAlarms必须为PSNULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> 
	*/
	PSDLL PSAPIStatus PSAPI psAPI_Alarm_His_Query(
		PSIN PSHANDLE hServer,
		PSIN PS_ALARM_FILTER_FIELD *pFilterField,
		PSIN PS_ALARM_FILTER *pFilter,
		PSIN PS_TIME  QueryStartTime,
		PSIN PS_TIME  QueryEndTime,
		PSOUT PSUINT32 *pnAlarmCount,
		PSOUT PS_ALARM **ppAlarms
		);
	/* 
	<summary>
	[API] 应答报警
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nAckUserId">
	应答者ID
	</param>
	<param name="AckUserName">
	应答时间
	</param>
	<param name="AckTime">
	应答时间
	</param>
	<param name="nCount">
	需要应答报警个数
	</param>
	<param name="pAIds">
	需要应答的报警Id数组
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> 
	*/
	PSDLL PSAPIStatus PSAPI psAPI_Alarm_Ack(
		PSIN PSHANDLE hServer,
		PSIN PSUINT16 nAckUserId,
		PSIN PSSTR	  AlarmAckUserName, 
		PSIN PS_TIME  AckTime,
		PSIN PSUINT32 nCount,
		PSIN PSUINT32 *pAIds
		);

	/* 
	<summary>
	[API] 报警订阅回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	新建订阅时返回的订阅号
	</param>
	<param name="pUserPara">
	使用psAPI_Alarm_AddSubscribe的用户自定义参数
	</param>
	<param name="pAlarm">
	报警内容
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_Alarm_CallbackFunction)(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId,
		PSIN PSVOID *pUserPara,
		PSIN PS_ALARM *pAlarm
		);

	/* 
	<summary>
	[API] 查询报警异步回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pUserPara">
	使用psAPI_Alarm_QueryAsyn的用户自定义参数
	</param>
	<param name="nAlarmCount">
	报警数量
	</param>
	<param name="pAlarms">
	报警内容
	</param>
	<param name="nRet">
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</param>
	<returns>
	空
	</returns> */
	typedef PSVOID (PSAPI *psAPI_Alarm_QueryAsynComplete)(
		PSIN PSHANDLE hServer,
		PSIN PSVOID *pUserPara,
		PSIN PSUINT32 nAlarmCount,
		PSIN PS_ALARM *pAlarms,
		PSIN PSAPIStatus nRet
		);

	/* 
	<summary>
	[API] 添加报警
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pField">
	添加报警域信息，标识PS_ALARM内选填项是否被添入
	</param>
	<param name="pAlarm">
	添加报警内容
	</param>
	<returns>
	成功后报警编号在pAlarm.Id里返回
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Alarm_Add(
		PSIN PSHANDLE hServer,
		PSIN PS_ALARM_FIELD pField,
		PSIN PS_ALARM *pAlarm
		);
	/* 
	<summary>
	[API] 查询报警异步接口
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pFilterField">
	报警查询的过滤条件字段
	</param>
	<param name="pFilter">
	报警查询的过滤条件
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
	PSDLL PSAPIStatus PSAPI psAPI_Alarm_QueryAsyn(
		PSIN PSHANDLE hServer,
		PSIN PS_ALARM_FILTER_FIELD *pFilterField,
		PSIN PS_ALARM_FILTER *pFilter,
		PSIN psAPI_Alarm_QueryAsynComplete CompleteFunction,
		PSIN PSVOID *pUserPara
		);

	/* 
	<summary>
	[API] 新建报警订阅
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pnTagId">
	只订阅相关测点ID为*pnTagId的事件,为PSNULL表示订阅所有的测点
	</param>
	<param name="pbHaveAcked">
	指定报警是否应答,为PSNULL表示忽略是否应答(不管报警是否应答,都订阅)
	</param>
	<param name="pnActorID">
	只订阅应答者ID为*pnActorID的事件,为PSNULL表示忽略应答者ID
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
	PSDLL PSAPIStatus PSAPI psAPI_Alarm_NewSubscribe(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 *pnTagId,
		PSIN PSBOOL *pbHaveAcked,
		PSIN PSUINT16 *pnActorID,
		PSIN PSUINT8 *pnLevel,
		PSIN psAPI_Alarm_CallbackFunction CallbackFunction,
		PSIN PSVOID *pUserPara,
		PSOUT PSUINT32 *pnSubscribeId
		);

	/* 
	<summary>
	[API] 增加报警订阅
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	订阅号,新建报警订阅里返回的订阅号
	</param>
	<param name="pnTagId">
	指定相关测点ID,为PSNULL表示订阅所有的测点
	</param>
	<param name="pbHaveAcked">
	指定报警是否应答,为PSNULL表示忽略是否应答(不管报警是否应答,都订阅)
	</param>
	<param name="pnActorID">
	指定应答者ID,为PSNULL表示忽略应答者ID
	</param>
	<param name="pnLevel">
	指定报警级别,为PSNULL表示所有报警级别都订阅
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Alarm_AddSubscribe(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId,
		PSIN PSUINT32 *pnTagId,
		PSIN PSBOOL *pbHaveAcked,
		PSIN PSUINT16 *pnActorID,
		PSIN PSUINT8 *pnLevel
		);

	/* 
	<summary>
	[API] 删除订阅号下的所有报警订阅
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSubscribeId">
	订阅号,新建报警订阅里返回的订阅号
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Alarm_DelSubscribeAll(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSubscribeId
		);

#ifdef  __cplusplus
}
#endif

#pragma pack(pop, Before_psAPISDK)

#endif	/* __PS_APIALARM_H__ */