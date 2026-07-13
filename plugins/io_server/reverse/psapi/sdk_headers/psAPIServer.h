#ifndef __PS_APISERVER_H__
#define __PS_APISERVER_H__

#include "psAPICommon.h"

//定义结构体4字节对齐
#pragma pack(push, Before_psAPISDK)
#pragma pack(4)

#define __DEFAULT_CONNECT_TIMEOUT 10	/* 缺省的连接超时时间为10秒 */
#define __DEFAULT_EXECUTE_TIMEOUT 60	/* 缺省的执行超时时间为60秒 */

#ifdef __cplusplus
extern "C"
{
#endif

	/* 
	<summary>
	服务器的当前状态
	</summary> */
	typedef enum __PS_SERVER_STATUS_ENUM
	{
		PS_SERVER_STATUS_STOP = 0,				/* 服务器已停止，但并未退出 */
		PS_SERVER_STATUS_BUSY,					/* 服务器正忙，暂时不能响应客户端请求 */
		PS_SERVER_STATUS_RUN,					/* 服务器正常运行 */
		PS_SERVER_STATUS_ERROR,					/* 服务器有故障 */
		PS_SERVER_STATUS_NETERROR,				/* 网络需要重连 */
		PS_SERVER_STATUS_STOPPING,				/* 服务器正在停止中 */
		PS_SERVER_STATUS_MAX 					/* 最大服务器状态 */
	} PS_SERVER_STATUS_ENUM;

	/*
	<summary>
	[Enum] 连接到服务器的应用程序类型
	</summary> */
	typedef enum __PS_APPTYPE_ENUM
	{
		PS_APPTYPE_USERCUSTOM = 0 ,				/* 用户编写的应用程序 */

		PS_APPTYPE_MIN = 77 ,					
		PS_APPTYPE_IOCONFIG  ,					/* 采集器组态程序 */
		PS_APPTYPE_IORUN  ,						/* 采集器运行程序 */
		PS_APPTYPE_IOMONITER  ,					/* 采集器监视程序 */
		PS_APPTYPE_DRAW ,						/* eForceCon组态程序 */
		PS_APPTYPE_VIEW ,						/* eForceCon运行程序 */
		PS_APPTYPE_NETVIEW ,					/* eForceCon远程运行程序 */
		PS_APPTYPE_DBCONFIG ,					/* 数据库组态程序 */
		PS_APPTYPE_DBMONITER ,					/* 数据库运行监控程序 */
		PS_APPTYPE_TOOL ,						/* 公司内部开发的工具程序 */
		PS_APPTYPE_EX ,							/* Ex组件，OPCServer、ODBCRouter */
		PS_APPTYPE_MAX							
	} PS_APPTYPE_ENUM ;

	/*
	<summary>
	服务器连接信息
	</summary> */
	typedef struct __PS_CONNECT_INFO
	{
		PSUINT16		ClientHandle;			/* 连接Id */
		PSUINT16		UserId;					/* 连接对应的用户Id */
		PSUINT16		ConnectTimeout;			/* 连接超时时间 */
		PSUINT16		ExcuteTimeout;			/* 执行超时时间 */
		PSSTR			ClientComputer;			/* 连接对应的客户端计算机名称 */
		PSSTR			ClientAppName;			/* 连接对应的客户端程序名称 */
		PSSTR			UserName;				/* 连接对应的用户名称 */
	} PS_CONNECT_INFO;

	/* 
	<summary>
	服务器属性
	</summary> */
	typedef struct __PS_SERVER_PROP
	{
		PSUINT16			Version;			/* 服务器版本号 */
		PSUINT16			SubVersion;			/* 服务器子版本号 */
		PSSTR				ServerName;			/* 服务器名称 */
		PSSTR				UserName;			/* 登录的用户名称 */
		PSUINT32			Permission;			/* 当前用户的权限 */
		PSUINT64			SecurityArea;		/* 当前用户的安全区 */
		PSUINT32			Status;				/* 服务器当前状态 */
	} PS_SERVER_PROP;							/* 服务器属性 */

	/* =====================================================================
	服务器（PSServer_*）相关函数定义
	===================================================================== */

	/* 
	<summary>
	[API] 连接实时数据库
	</summary>
	<param name="pszServer">
	需连接的服务器计算机地址
	支持IP地址和DNS名称，本地据库名称为"127.0.0.1"或 "localhost"
	如果需要指定服务器端口号,在地址后面加冒号后跟端口号 如192.168.0.1:8889
	如果没有指定服务器端口号,使用8889默认端口
	</param>
	<param name="pszUserName">
		用户名称，区分大小写，支持中文字符串。
	</param>
	<param name="pszPassword">
		用户密码，区分大小写。
	</param>
	<param name="phServer">
		如果成功，则返回数据库连接句柄。
	</param>
	<returns>
		成功时返回PSRET_OK，失败时返回相应的错误代码。
	</returns>
	<remarks>
	在执行大部分操作前，应先连接数据库，
	在已连接数据库的情况下，使用不同的用户名称重新连接，则以前的连接句
	柄自动失效，在网络长时间中断、或服务器重新启动、或服务器注销了该连
	接，则需要重新连接
	链接时使用__DEFAULT_CONNECT_TIMEOUT秒的网络链接超时和__DEFAULT_EXECUTE_TIMEOUT秒服务器执行本函数超时
	常见返回错误类型
		PSERR_NET_CONNECT_FAILED 网络连接到服务器失败
		PSERR_USER_USER_NOT_EXIST 用户名不存在
		PSERR_USER_USERNAME_OR_PASSWORD_NOTMATCH 密码错误
		PSERR_COMMON_PARAMETER_INVALID 确保传入的字符串有效，phServer不为NULL
		PSERR_NET_APIVERSION_FAILED 客户端与服务端API版本不一致,需更新客户端版本
	</remarks>
	<example>
	<code>
		PSAPIStatus nRet = PSRET_OK;
		PSHANDLE hHandle = PSHANDLE_UNUSED;
		PSSTR pszServer = (PSSTR)"localhost";
		PSSTR pszUserName = (PSSTR)"admin";
		PSSTR pszPassword = (PSSTR)"admin888";

		nRet = psAPI_Server_Connect(pszServer, pszUserName, pszPassword, &hHandle);
		if (nRet == PSERR_NET_CONNECT_FAILED)
		{
			printf("连接到服务器%s失败 %s\n", pszUserName, psAPI_Commom_GetErrorDesc(nRet));
		}
		else if (nRet == PSERR_USER_USER_NOT_EXIST)
		{
			printf("用户名%s不存在 %s\n", pszUserName, psAPI_Commom_GetErrorDesc(nRet));
		}
		else if (nRet == PSERR_USER_USERNAME_OR_PASSWORD_NOTMATCH)
		{
			printf("密码%s错误 %s\n", pszPassword, psAPI_Commom_GetErrorDesc(nRet));
		}
		else if ( PSERR(nRet) )
		{
			printf("连接失败错误 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		}
		else
		{
			printf("连接到服务器%s成功\n", pszServer);
		}
		</code>
	</example> */
	PSDLL PSAPIStatus PSAPI psAPI_Server_Connect(
		PSIN PSSTR pszServer,
		PSIN PSSTR pszUserName,
		PSIN PSSTR pszPassword,
		PSOUT PSHANDLE *phServer
		);

	/* 
	<summary>
	[API] 连接实时数据库，并设置相关的连接和执行超时参数。
	</summary>
	<param name="pszServer">
		需连接的服务器计算机地址
		支持IP地址和DNS名称，本地据库名称为"127.0.0.1"或 "localhost"
		如果需要指定服务器端口号,在地址后面加冒号后跟端口号 如192.168.0.1:8889
		如果没有指定服务器端口号,使用8889默认端口
	</param>
	<param name="pszUserName">
		用户名称，区分大小写，支持中文字符串。
	</param>
	<param name="pszPassword">
		用户密码，区分大小写。
	</param>
	<param name="nConnectTimeout">
		连接超时。
		0 : 表示使用缺省参数，缺省为__DEFAULT_CONNECT_TIMEOUT秒。
		>0 : 表示具体的连接超时秒数。
	</param>
	<param name="nExecuteTimeout">
		执行超时。
		0 ：表示使用缺省参数，缺省为__DEFAULT_EXECUTE_TIMEOUT秒。
		>0 : 表示具体的执行超时秒数。
	</param>
	<param name="bUseProxy">
		是否使用代理。
		该参数为系统保留以后使用的参数。
	</param>
	<param name="phServer">
		如果成功，则返回数据库连接句柄，用户需要确保phServer不为空。
	</param>
	<returns>
		成功时返回PSRET_OK，失败时返回相应的错误代码。
	</returns>
	<remarks>
		在执行大部分操作前，应先连接数据库，
		在已连接数据库的情况下，使用不同的用户名称重新连接，则以前的连接句
		柄自动失效，在网络长时间中断、或服务器重新启动、或服务器注销了该连
		接，则需要重新连接。

		常见返回错误类型
		PSERR_NET_CONNECT_FAILED 网络连接到服务器失败
		PSERR_USER_USER_NOT_EXIST 用户名不存在
		PSERR_USER_USERNAME_OR_PASSWORD_NOTMATCH 密码错误
		PSERR_COMMON_PARAMETER_INVALID 确保传入的字符串有效，phServer不为NULL
		PSERR_NET_APIVERSION_FAILED 客户端与服务端API版本不一致,需更新客户端版本
	</remarks>
	*/
	PSDLL PSAPIStatus PSAPI psAPI_Server_ConnectTimeout(
		PSIN PSSTR pszServer,
		PSIN PSSTR pszUserName,
		PSIN PSSTR pszPassword,
		PSIN PSUINT16 nConnectTimeout,	
		PSIN PSUINT16 nExecuteTimeout,
		PSIN PSBOOL bUseProxy,
		PSOUT PSHANDLE *phServer
		);

	/* 
	<summary>
	[API] 断开连接
	</summary>
	<param name="hServer">
	[PSIN]数据库连接句柄
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	在退出系统前，应该断开连接
	对于已失效的连接，断开连接会提示出错
	不管是否断开成功，使用本函数后句柄不能再使用
	常见返回错误类型
		PSERR_NET_STATUSERR 连接句柄已经失效
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Server_Disconnect(
		PSIN PSHANDLE hServer
		);

	/* 
	<summary>
	[API] 判断是否已连接服务器
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pbConnected">
	返回结果 为真表示已连接服务器
	</param>
	<returns>
	执行成功时返回PSRET_OK
	</returns>
	<remarks>
	常见返回错误类型
		返回PSERR_COMMON_PARAMETER_INVALID传入参数错误 确保pbConnected不为NULL
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Server_IsConnected(
		PSIN PSHANDLE hServer,
		PSOUT PSBOOL *pbConnected
		);

	/* 
	<summary>
	[API] 设置客户端API函数执行超时时间
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nSecTimeout">
	超时时间，以秒为单位
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
		设置成功后执行其他同步函数，如果执行时间大于nSecTimeout秒,将返回PSERR_NET_GETQ_TIMEOUT
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Server_SetTimeout(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nSecTimeout
		);

	/*
	<summary>
	[API] 获取服务器所有连接信息
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pnConnectCount">
	返回服务器连接数量
	</param>
	<param name="ppConnectInfos">
	返回服务器连接信息数组
	空间由被调用者申请，调用者释放psAPI_Memory_FreeConnectInfoList(ppConnectInfos,*pnConnectCount)
	调用前，*ppConnectInfos必须为PSNULL
	</param>
	<returns>
	成功时返回psRET_OK，失败时返回相应的错误代码。
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Server_GetAllConnectInfo(
		PSIN PSHANDLE hServer,
		PSOUT PSUINT32 *pnConnectCount,
		PSOUT PS_CONNECT_INFO **ppConnectInfos
		);

	/* 
	<summary>
	[API] 得到服务器时间
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pTime">
	返回服务器时间 精确到秒
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	获取服务器本地的当前时间
	</remarks>*/
	PSDLL PSAPIStatus PSAPI psAPI_Server_GetTime(
		PSIN PSHANDLE hServer,
		PSOUT PS_TIME *pTime
		);

	/* 
	<summary>
	[API] 得到服务器的属性
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="ppServerProp">
	服务器属性,传入参数时保证*ppServerProp为NULL 
	空间由被调用者申请,调用者通过psAPI_Memory_FreeServerProp(ppServerProp)函数释放
	</param>
	<return>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_Server_GetProp(
		PSIN PSHANDLE hServer,
		PSOUT PS_SERVER_PROP **ppServerProp
		);

	/* 
	<summary>
	服务器状态改变的回调函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nServerStatus">
	服务器状态
	</param>
	<returns>
	空
	</returns>
	<remarks>
	要得到服务器状态通知，需要使用psAPI_Server_RegisterStatusCallback注册回调函数
	当服务器状态（或网络通讯状态）改变时，通过此函数通知客户端
	服务器停止时发送状态PS_SERVER_STATUS_STOPPING通知注册回调函数的客户端
	当自动检测链接不上服务器网络需要重连时发送状态PS_SERVER_STATUS_NETERROR通知注册回调函数的客户端
	</remarks> */
	typedef PSVOID (PSAPI *psAPI_Server_StatusCallback)(
		PSIN PSHANDLE hServer,
		PSIN PSUINT32 nServerStatus
		);

	/* 
	<summary>
	[API] 注册服务器状态改变的回调处理函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="CallbackFunction">
	回调处理函数
	当回调处理函数设为PSNULL时，返回PSERR_COMMON_PARAMETER_INVALID错误
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	一个客户端连接（psAPI_Server_Connect)可以多次注册服务器状态改变的回调函数
	服务器状态改变通知所有注册的回调函数
	如果同一个回调函数地址注册多次 服务器状态改变该回调函数只调用一次
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Server_RegisterStatusCallback(
		PSIN PSHANDLE hServer,
		PSIN psAPI_Server_StatusCallback CallbackFunction
		);

	/* 
	<summary>
	[API] 取消注册服务器状态改变的回调处理函数
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="CallbackFunction">
	回调处理函数
	当回调处理函数设为PSNULL时，返回PSERR_COMMON_PARAMETER_INVALID错误
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	一个客户端连接（psAPI_Server_Connect)可以多次注册服务器状态改变的回调函数
	服务器状态改变通知所有注册的回调函数
	如果同一个回调函数地址注册多次 需要取消注册相应的次数
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Server_UnRegisterStatusCallback(
		PSIN PSHANDLE hServer,
		PSIN psAPI_Server_StatusCallback CallbackFunction
		);

#ifdef  __cplusplus
}
#endif

#pragma pack(pop, Before_psAPISDK)

#endif	/* __PS_APISERVER_H__ */