#ifndef __PS_APIUSER_H__
#define __PS_APIUSER_H__

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
	权限定义
	</summary> */
	typedef enum __PS_PERMISSION_ENUM
	{
		PS_PERMISSION_READSERVER		= 0X00000001,	/* 读取服务器信息 */
		PS_PERMISSION_MANAGESERVER		= 0X00000002,	/* 修改服务器信息 */
		PS_PERMISSION_READUSER			= 0X00000004,	/* 读取用户和用户组信息 */
		PS_PERMISSION_MANAGEUSER		= 0X00000008,	/* 修改用户和用户组信息 */
		PS_PERMISSION_READTAG			= 0X00000010,	/* 读取测点信息 */
		PS_PERMISSION_MANAGETAG			= 0X00000020,	/* 修改测点信息 */
		PS_PERMISSION_READDATA			= 0X00000040,	/* 读取实时/历史数据 */
		PS_PERMISSION_WRITEDATA			= 0X00000080,	/* 写入实时/历史数据 */
		PS_PERMISSION_READHISTORY		= 0X00000100,	/* 读取历史数据归档配置信息 */
		PS_PERMISSION_MANAGEHISTORY		= 0X00000200,	/* 修改历史数据归档配置 */
		PS_PERMISSION_READEVENT			= 0X00000400,	/* 读取事件 */
		PS_PERMISSION_WRITEEVENT		= 0X00000800,	/* 修改事件 */
		PS_PERMISSION_MANAGEEVENT		= 0X00001000,	/* 配置和管理事件文件 (未使用)*/
		PS_PERMISSION_SETTIME			= 0X00002000,	/* 对服务器对时 (未使用) */
		PS_PERMISSION_READALARM			= 0x00004000,	/* 读取报警 */
		PS_PERMISSION_WRITEALARM		= 0x00008000,	/* 写入报警 */
		PS_PERMISSION_ACKALARM			= 0x00010000,	/* 应答报警 */
		PS_PERMISSION_DELETETAG			= 0x00020000,	/* 删除测点 */
	}PS_PERMISSION_ENUM;

	/* 
	<summary>
	用户组结构定义
	</summary> */
	typedef struct __PS_USER_GROUP
	{
		PSUINT16			Id;					/* 用户组ID，只读 */
		PSSTR				Name;				/* 用户组名称 */
		PSSTR				Desc;				/* 用户组描述 */
		PSUINT32			Permission;			/* 权限，每一位表示一种权限 PS_PERMISSION_ENUM */
		PSUINT64			SecurityArea;		/* 安全区，每一位表示一个安全区 */
	} PS_USER_GROUP;

	/* 
	<summary>
	用户组字段结构定义
	</summary> */
	typedef struct __PS_USER_GROUP_FIELD
	{
		PSBOOL      		All;		        /* 所有字段均被设置 */
		PSBOOL				Name;				/* 用户组名称 */
		PSBOOL				Desc;				/* 用户组描述 */
		PSBOOL				Permission;			/* 权限，每一位表示一种权限 PS_PERMISSION_ENUM */
		PSBOOL				SecurityArea;		/* 安全区，每一位表示一个安全区 */
	}PS_USER_GROUP_FIELD;

	/* 
	<summary>
	用户结构定义
	</summary> */
	typedef struct __PS_USER
	{
		PSUINT16			Id;					/* 用户ID，只读 */
		PSSTR				Name;				/* 用户名称 */
		PSSTR				Password;			/* 用户密码 */
		PSUINT32			Permission;			/* 权限，每一位表示一种权限，只读 */
		PSUINT64			SecurityArea;		/* 安全区，每一位表示一个安全区，只读 */		
		PSSTR				Desc;				/* 用户描述 */
	} PS_USER;

	/* 
	<summary>
	用户字段结构定义
	</summary> */
	typedef struct __PS_USER_FIELD
	{
		PSBOOL				All;            	/* 所有字段均被设置 */
		PSBOOL				Name;				/* 用户名称 */
		PSBOOL				Password;			/* 用户密码 */
		PSBOOL				Desc;				/* 用户描述 */
	}PS_USER_FIELD;


	/* =====================================================================
	用户组处理（PSUserGroup_*）相关函数定义
	===================================================================== */

	/* 
	<summary>
	[API] 根据用户组名查找对应的用户组ID
	</summary>
	<param name="pszGroupName">
	用户组名
	</param>
	<param name="pnGId">
	用户组ID，用于返回
	</param>
	<returns>
	如果找到，返回PSRET_OK,否则，返回PSERR_USER_USERGROUP_NOT_EXIST
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_UserGroup_GetGroupIdByName(
		PSIN PSHANDLE hServer,
		PSIN PSSTR pszGroupName,
		PSOUT PSUINT16 *pnGId
		);

	/* 
	<summary>
	[API] 得到所有用户组列表
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pnUserGroupCount">
	返回用户组个数
	</param>
	<param name="ppUserGroups">
	返回用户组数组
	如果ppUserGroups为NULL 表示只获取数量 否则*ppUserGroups必须为NULL
	被调用者申请变量空间 调用者使用psAPI_Memory_FreeUserGroupList(ppUserGroups,*pnUserGroupCount)释放
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_UserGroup_GetList(
		PSIN  PSHANDLE hServer,
		PSOUT PSUINT32 *pnUserGroupCount,	
		PSOUT PS_USER_GROUP **ppUserGroups
		);	

	/* 
	<summary>
	[API] 增加一个用户组
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pField">
	用户组域信息，标识pUserGroup内选填项是否被填入
	</param>
	<param name="pUserGroup">
	用户组信息，Name为必填项，其他值如果不填则自动生成默认值
	</param>
	<param name="pnGId">
	服务器生成的用户组ID
	</param>
	<return>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	如果pUserGroup参数不包含pField设置字段，则返回参数错误	
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_UserGroup_Add(
		PSIN PSHANDLE hServer,
		PSIN PS_USER_GROUP_FIELD *pField,
		PSIN PS_USER_GROUP *pUserGroup,
		PSOUT PSUINT16 *pnGId
		);

	/* 
	<summary>
	[API] 删除一个用户组
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nGId">
	用户组ID
	</param>
	<return>
	成功时返回PSRET_OK
	</returns>
	<remarks>
	常见返回错误
		PSERR_USER_USERGROUP_NOT_EXIST 操作不存在的用户组
		PSRR_USER_USERGROUP_ONLYREAD 输入的用户组ID不能被删除,系统保留一个可修改
		但不能被删除的用户组
	</remarks>*/
	PSDLL PSAPIStatus PSAPI psAPI_UserGroup_Delete(
		PSIN PSHANDLE hServer,
		PSIN PSUINT16 nGId
		);

	/* 
	<summary>
	[API] 得到单个用户组的属性
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nGId">
	用户组ID号
	</param>
	<param name="ppUserGroup">
	用户组属性
	被调用者申请变量空间 调用者使用psAPI_Memory_FreeUserGroupList(ppUserGroup,1)释放
	</param>
	<return>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_UserGroup_GetProp(
		PSIN PSHANDLE hServer,
		PSIN PSUINT16 nGId,
		PSOUT PS_USER_GROUP **ppUserGroup
		);

	/* 
	<summary>
	[API] 设置单个用户组的属性
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nGId">
	用户组ID号
	</param>
	<param name="pField">
	用户组属性字段，标识设置哪些属性
	</param>
	<param name="pUserGroup">
	用户组属性
	</param>
	<return>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_UserGroup_SetProp(
		PSIN PSHANDLE hServer,
		PSIN PSUINT16 nGId,
		PSIN PS_USER_GROUP_FIELD *pField,
		PSIN PS_USER_GROUP *pUserGroup
		);

	/* 
	<summary>
	[API] 得到属于用户组的用户ID列表
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nGId">
	用户组ID号
	</param>
	<param name="pnUserCount">
	该组用户数
	</param>
	<param name="ppUserIds">
	属于用户组的用户ID数组
	被调用者申请变量空间 调用者使用psAPI_Memory_FreeAndNull(ppUserIds)释放
	</param>
	<return>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	*/
	PSDLL PSAPIStatus PSAPI psAPI_UserGroup_GetUserList(
		PSIN  PSHANDLE hServer,
		PSIN  PSUINT16 nGId,
		PSOUT PSUINT32 *pnUserCount,
		PSOUT PSUINT16 **ppUserIds
		);

	/* 
	<summary>
	[API] 用户组中增加一个用户ID
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nGId">
	用户组ID号
	</param>
	<param name="nUId">
	用户ID
	</param>
	<return>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_UserGroup_AddUser(
		PSIN PSHANDLE hServer,
		PSIN PSUINT16 nGId,
		PSIN PSUINT16 nUId
		);

	/* 
	<summary>
	[API] 用户组中删除一个用户ID
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nGId">
	用户组ID号
	</param>
	<param name="nUId">
	用户ID
	</param>
	<return>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_UserGroup_DeleteUser(
		PSIN PSHANDLE hServer,
		PSIN PSUINT16 nGId,
		PSIN PSUINT16 nUId
		);

	/* =====================================================================
	用户处理（PSUser_*）相关函数定义
	===================================================================== */

	/* 
	<summary>
	在系统中查找用户名对应的用户ID
	</summary>
	<param name="pszUserName">
	用户名
	</param>
	<param name="pnUId">
	用户ID，用于返回
	</param>
	<returns>
	如果找到，返回PSRET_OK,否则，返回PSERR_USER_USER_NOT_EXIST
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_User_GetUserIdByName(
		PSIN PSHANDLE hServer,
		PSIN PSSTR pszUserName,
		PSOUT PSUINT16 *pnUId
		);

	/* 
	<summary>
	[API] 得到所有用户列表
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pnUserCount">
	返回用户总数
	</param>
	<param name="ppUsers">
	返回用户数组
	如果ppUsers为NULL 表示只获取数量 否则*ppUsers必须为NULL
	被调用者申请变量空间 调用者使用psAPI_Memory_FreeUserList(ppUsers,*pUserCount)释放
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_User_GetList(
		PSIN  PSHANDLE hServer,
		PSOUT PSUINT32 *pnUserCount,
		PSOUT PS_USER **ppUsers
		);

	/* 
	<summary>
	[API] 增加一个用户
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="pField">
	标识可选字段是否被填写
	</param>
	<param name="pUser">
	用户 Name、Password为必填项，其他值如果不填则自动生成默认值
	空间由调用者申请并负责释放
	</param>
	<param name="pnUId">
	服务器生成的用户ID
	</param>
	<return>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_User_Add(
		PSIN PSHANDLE hServer,
		PSIN PS_USER_FIELD *pField,
		PSIN PS_USER *pUser,
		PSOUT PSUINT16 *pnUId
		);

	/* 
	<summary>
	[API] 删除一个用户
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nUId">
	用户ID
	</param>
	<return>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	常见返回错误
		PSERR_USER_USER_NOT_EXIST 操作不存在的用户
		PSERR_USER_USER_ONLYREAD 输入的用户ID不能被删除,系统保留一个可修改
	但不能被删除的用户
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_User_Delete(
		PSIN PSHANDLE hServer,
		PSIN PSUINT16 nUId
		);

	/* 
	<summary>
	[API] 得到单个用户的属性
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nUId">
	用户ID号
	</param>
	<param name="ppUser">
	用户属性
	被调用者申请变量空间 调用者使用psAPI_Memory_FreeUserList（ppUser,1)释放
	</param>
	<return>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_User_GetProp(
		PSIN PSHANDLE hServer,
		PSIN PSUINT16 nUId,
		PSOUT PS_USER **ppUser
		);

	/* 
	<summary>
	[API] 设置单个用户的属性
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nUId">
	用户ID号
	</param>
	<param name="pField">
	用户属性字段，标识设置哪些属性
	</param>
	<param name="pUser">
	用户属性
	</param>
	<return>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_User_SetProp(
		PSIN PSHANDLE hServer,
		PSIN PSUINT16 nUId,
		PSIN PS_USER_FIELD *pField,
		PSIN PS_USER *pUser
		);

	/* 
	<summary>
	[API] 得到用户所属的用户组列表
	</summary>
	<param name="hServer">
	数据库连接句柄
	</param>
	<param name="nUId">
	用户ID号
	</param>
	<param name="pnUserGroupCount">
	该用户ID号，所在的组总数
	</param>
	<param name="ppUserGroupIds">
	用户所属的用户组ID数组
	被调用者申请变量空间 调用者使用psAPI_Memory_FreeAndNull(ppUserGroupIds)释放
	</param>
	<return>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns> */
	PSDLL PSAPIStatus PSAPI psAPI_User_GetUserGroupList(
		PSIN PSHANDLE hServer,
		PSIN PSUINT16 nUId,
		PSOUT PSUINT32 *pnUserGroupCount,
		PSOUT PSUINT16 **ppUserGroupIds
		);

#ifdef  __cplusplus
}
#endif

#pragma pack(pop, Before_psAPISDK)

#endif	/* __PS_APIUSER_H__ */