#ifndef __PS_APICOMMON_H__
#define __PS_APICOMMON_H__

//定义结构体4字节对齐
#pragma pack(push, Before_psAPISDK)
#pragma pack(4)

#ifdef __cplusplus
extern "C"
{
#endif

	/* dll导出函数定义 */
#ifndef PSDLL

#ifdef _WIN32
#define PSDLL __declspec(dllimport)
#else
#define PSDLL
#endif

#endif /* #ifndef PSDLL */


	/* =====================================================================
	基本数据类型宏定义
	客户应用程序应该以以下定义的数据类型来访问pSpace接口函数
	===================================================================== */

#include <stdio.h>

	typedef		float				PSFLOAT;	
	typedef		double				PSDOUBLE;
#ifdef _WIN32
	typedef		void				PSVOID;
	typedef		__int8				PSINT8;
	typedef		__int16				PSINT16;
	typedef		__int32				PSINT32;
	typedef		__int64				PSINT64;
	typedef		unsigned __int8		PSUINT8;
	typedef		unsigned __int16	PSUINT16;
	typedef		unsigned __int32	PSUINT32;
	typedef		unsigned __int64	PSUINT64;
#else
#define _stdcall                __attribute__((__stdcall__))
#define PSVOID	void
#include <sys/types.h>
#include <stdint.h>
	typedef     int8_t              PSINT8;
	typedef     int16_t             PSINT16;
	typedef     int32_t             PSINT32;
	typedef     int64_t             PSINT64;
	typedef     uint8_t				PSUINT8;
	typedef     uint16_t			PSUINT16;
	typedef     uint32_t			PSUINT32;
	typedef     uint64_t			PSUINT64;
#endif
	typedef		PSUINT8				PSBOOL;
	typedef		PSUINT8				PSBYTE;
	typedef		char				PSCHAR;
	typedef		wchar_t				PSWCHAR;
	typedef		PSCHAR				*PSSTR;
	typedef		PSWCHAR				*PSWSTR;
	typedef		const char			*PSCSTR;
	typedef		const wchar_t		*PSCWSTR;
	typedef		PSUINT16			PSHANDLE;
	typedef		PSINT32				PSAPIStatus;	/* 函数返回错误码 */


	/* =====================================================================
	常用宏定义
	===================================================================== */

#define PSFALSE					0 			/* 布尔量假 */
#define PSTRUE					1 			/* 布尔量真 */

#define PSAPI					_stdcall

#define PSIN								/* 传入参数 */
#define PSOUT								/* 传出参数 */
#define PSNULL					0			/* 空 */

#define	PSHANDLE_UNUSED			0xFFFF		/* 未使用的服务器句柄 */

#define	PSTAGTYPE_NODE			0 			/* 结点类型 */
#define	PSTAGTYPE_ALL			0xFFFF 		/* 所有点类型 */

#define	PSTAGID_UNUSED			0xFFFFFFFF	/* 无效的测点ID */
#define	PSTAGID_ROOT			0x00000000	/* 根测点ID */
#define	PSPROPID_UNUSED			0xFFFF		/* 无效的属性ID */
#define PSQUERYLEVEL_ALL		0xFFFF		/* 查询结点下的所有内容，用于PS_TAG_QUERY_FILTER */

#define PSUSERGROUPID_UNUSED	0xFFFF		/* 无效的用户组ID */
#define PSUSERID_UNUSED			0xFFFF		/* 无效的用户ID */

#define PSOK(ret)	(!((PSAPIStatus)(ret)))	/* 判断返回值是否正确 */
#define PSERR(ret)	(((PSAPIStatus)(ret)))	/* 判断返回值是否错误 */


	/* =====================================================================
	通用数据类型定义
	===================================================================== */

	/* 
	标准时间
	 */
	typedef struct __PS_TIME
	{
		PSUINT32		Second;				/* 秒 */
		PSUINT16		Millisec;			/* 毫秒 */
	} PS_TIME;

	/* 
	带长度的Ansi字符串
	 */
	typedef struct __PS_STRING
	{
		PSUINT32		Length;				/* 字符串长度，不带'\0'结尾符 */
		PSSTR			Data;				/* 字符串内容 */
	} PS_STRING;

	/* 
	带长度的宽字符串
	 */
	typedef struct __PS_WSTRING
	{
		PSUINT32		Length;				/* 宽字符串长度，不带L'\0'结尾符 */
		PSWSTR			Data;				/* 宽字符串内容 */
	} PS_WSTRING;

	/* 
	带长度的二进制串
	 */
	typedef struct __PS_BLOB
	{
		PSUINT32		Length;				/* 二进制数据块的长度 */
		PSBYTE			*Data;				/* 二进制数据块的内容 */
	} PS_BLOB;

	/* 
	支持的数据类型种类
	 */
	typedef enum __PS_DATATYPE_ENUM
	{
		PSDATATYPE_EMPTY = 0,					/* 未定义 */
		PSDATATYPE_BOOL,						/* 开关量 */
		PSDATATYPE_INT8,						/* 一字节整数 */
		PSDATATYPE_UINT8,						/* 一字节无符号整数 */
		PSDATATYPE_INT16,						/* 二字节整数 */
		PSDATATYPE_UINT16,						/* 二字节无符号整数 */
		PSDATATYPE_INT32,						/* 四字节整数 */
		PSDATATYPE_UINT32,						/* 四字节无符号整数 */
		PSDATATYPE_INT64,						/* 八字节整数 */
		PSDATATYPE_UINT64,						/* 八字节无符号整数 */
		PSDATATYPE_FLOAT,						/* 单精度浮点数 */
		PSDATATYPE_DOUBLE,						/* 双精度浮点数 */
		PSDATATYPE_TIME,						/* 时间 */
		PSDATATYPE_STRING,						/* ANSI字符串 */
		PSDATATYPE_WSTRING,						/* 宽字符串 */
		PSDATATYPE_BLOB,						/* 二进制数据块 */
	} PS_DATATYPE_ENUM;

	/* 
	通用数据类型
	 */
	typedef struct __PS_VARIANT
	{
		PSUINT8				DataType;			/* 数据类型（PSDataTypeEnum） */
		union
		{
			PSBOOL				Bool;			/* 开关量 */
			PSINT8				Int8;			/* 一字节整数 */
			PSUINT8				UInt8;			/* 一字节无符号整数 */
			PSINT16				Int16;			/* 二字节整数 */
			PSUINT16			UInt16;			/* 二字节无符号整数 */
			PSINT32				Int32;			/* 四字节整数 */
			PSUINT32			UInt32;			/* 四字节无符号整数 */
			PSINT64				Int64;			/* 八字节整数 */
			PSUINT64			UInt64;			/* 八字节无符号整数 */
			PSFLOAT				Float;			/* 单精度浮点数 */
			PSDOUBLE			Double;			/* 双精度浮点数 */
			PS_TIME				Time;			/* 时间 */
			PS_STRING			String;			/* ANSI字符串 */
			PS_WSTRING			WString;		/* 宽字符串 */
			PS_BLOB				Blob;			/* 二进制块 */
		}; 										/* 不同数据类型的值定义 */
	} PS_VARIANT;

	/* =====================================================================
	函数返回值及错误号定义
	===================================================================== */

	/* 
	<summary>
	pSpace错误号码，范围从-20000至-10000
	</summary> */
	typedef enum __PS_ERROR_CODE_ENUM
	{
		PSRET_OK = 0,								/* 返回成功 */
		PSRET_FAIL = -1,							/* 返回失败 */

		PSWARN_MIN=-30000,							/* 接口返回最小警告号 */
		PSWARN_TAG_INFO_DISCARDED,					/* 接口返回最小错误号 */
		PSWARN_MAX=-20000,							/* 接口返回最大警告号 */

		PSERR_MIN = -20000 ,						/* 接口返回最小错误号 */

		PSERR_COMMON_BASE = -20000 ,				/* 通用错误 */

		PSERR_COMMON_FUNCTION_NOT_IMPLEMENT ,		/* 功能未实现 */
		PSERR_COMMON_PARAMETER_INVALID ,			/* 参数错误 */
		PSERR_FAIL_IN_BATCH ,						/* 操作集中有出错的元素，具体错误原因查看返回值列表对应元素的返回值 */
		PSERR_COMMON_NO_MEMORY ,					/* 无足够内存空间 */
		PSERR_COMMON_NO_AUHTORITY,					/* 无操作权限 */
		PSERR_COMMON_STRING_TOO_LONG,				/* 字符串太长 */
		PSERR_COMMON_DATATYPE_CONVERT_FAIL,			/* 写入的数据类型和需求的不一致，进行类型转换时超出目标类型的范围 */
		PSERR_COMM_NOMQ,							/* 同步操作没有发现相关消息队列 */
		PSERR_COMMON_THREAD,						/* 初始化创建线程失败 */
		PSERR_COMMON_NEED_QUIT,						/* 收到退出消息，需要立即返回 */

		PSERR_INTERFACE_BASE = -19900,				/* 接口动态库相关错误 */

		PSERR_INTERFACE_REGISTER_CALLBACK_FAIL,		/* 回调函数注册失败 */

		PSERR_NET_BASE = -19800,					/* 通讯相关错误 */

		PSERR_NET_GETQ_TIMEOUT,						/* 操作消息队列超时 */
		PSERR_NET_MQ_SHUTDOWN,						/* 消息队列关闭 */
		PSERR_NET_MAPUNBIND,						/* 连接信息解除绑定失败 */
		PSERR_NET_STATUSERR,						/* 网络连接状态查找失败,没有对应的状态信息保存 */
		PSERR_NET_CONNECT_FAILED,					/* 连接失败 */
		PSERR_NET_SENDN_ERR,						/* 发送失败 */
		PSERR_NET_RECVN_FAILED,                     /* 接受失败 */
		PSERR_NET_NEWTHREAD_SEND,					/* 线程失败 */
		PSERR_NET_NO_CONNECTED,						/* 没有连接 */
		PSERR_NET_NOHANDLE_FIND,					/* 没有保存的handle信息 */
		PSERR_NET_MAX_CONNECTION,					/* 最大连接数 */
		PSERR_NET_NEEDRESET,						/* 服务器端已经重启，客户端需要重启 */
		PSERR_NET_CONNECTING,						/* 网络正在连接中 */
		PSERR_NET_CLIENTID_REPEAT,					/* 网络ClientID重复，请检查id.lst文件 */
		PSERR_NET_CLIENTID_BINDERR,					/* 网络ClientID绑定失败 */
		PSERR_NET_APIVERSION_FAILED,				/* 客户端与服务端API版本不一致 */


		PSERR_SCHUDULER_BASE = -19700 ,				/* 服务器相关错误 */

		PSERR_SCHUDULER_STATUS_ERROR,				/* 服务器处在错误状态 */
		PSERR_SCHUDULER_STATUS_STOP,				/* 服务器处在停止状态 */
		PSERR_SCHUDULER_STATUS_BUSY,				/* 服务器处在正忙状态 */
		PSERR_SCHUDULER_PARA_FILE_FAIL,				/* 调度模块读取配置文件失败 */
		PSERR_SCHEDULER_CONNECT_HASHMAP_ERROR, 		/* 读取hash表失败 */
		PSERR_SCHEDULER_START_ERROR,				/* 调度模块启动失败 */
		PSERR_SCHEDULER_CONNECT_NOT_FOUND,  		/* 调度模块中未发现连接信息 */
		PSERR_SCHEDULER_API_CONNECT_NOT_FOUND,		/* 调度模块中未发现应用连接 */
		PSERR_SCHEDULER_NET_CONNECT_NOT_FOUND,		/* 调度模块中未发现网络连接 */
		PSERR_CONNECTMGR_STOPED,					/* 连接管理器已经停止 */

		PSERR_TAGTYPEMANAGER_BASE = -19600 ,		/* 测点类型相关错误 */

		PSERR_TAGTYPEMANAGER_CANNOT_START,			/* 测点类型管理模块不能启动 */
		PSERR_TAGTYPEMANAGER_MANAGER_FILE_NOT_FOUND,/* 测点类型管理文件不存在 */
		PSERR_TAGTYPEMAMAGER_MAMAGER_FILE_FAIL,		/* 测点类型管理文件错误 */
		PSERR_TAGTYPEMANAGER_TOTAL_PROP_FILE_NOT_FOUND,/* 测点类型完整属性文件不存在 */
		PSERR_TAGTYPEMANAGER_TOTAL_PROP_FILE_FAIL,	/* 测点类型完整属性文件错误 */

		PSERR_TAGTYPE_BASE = -19500 ,				/* 测点类型相关错误 */

		PSERR_TAGTYPE_CANNOT_SRART,					/* 测点类型动态库不能启动 */
		PSERR_TAGTYPE_HAVE_STARTED,					/* 测点类型动态库已经启动 */
		PSERR_TAGTYPE_INFO_FILE_FAIL,				/* 测点类型信息文件错误 */
		PSERR_TAGTYPE_PROP_FILE_FAIL,				/* 测点类型属性文件错误 */

		PSERR_TAGTYPE_NOT_EXIST,					/* 测点类型不存在 */
		PSERR_TAGTYPE_LOADTYPE_FAILURE,				/* 加载测点类型错误或尚未加载 */

		PSERR_TAG_BASE = -19400 ,					/* 测点相关错误 */

		PSERR_TAG_NAME,								/* 点名错误 */
		PSERR_TAG_GETLONGNAME,						/* 获取点长名失败 */
		PSERR_TAG_NAME_TOOLONG,						/* 名称超长 */
		PSERR_TAG_INFOFILE,							/* 不能打开测点信息文件 */
		PSERR_TAG_DATAFILE,							/* 不能打开测点数据文件 */
		PSERR_TAG_HAVE_DELETED,						/* 测点已经被删除 */
		PSERR_TAG_PROP_REDUPLICATE,					/* 属性重复 */
		PSERR_TAG_NAME_REDUPLICATE,					/* 测点名称重复 */
		PSERR_TAG_NAME_NOT_EXIST,					/* 测点名不存在 */
		PSERR_TAG_NAMEHASH_FAILURE,					/* 名称HASH表出错 */
		PSERR_TAG_NOT_NODE,							/* 指定的点不是结点类型 */
		PSERR_TAG_CANNOT_MOVE,						/* 测点不能移动 */
		PSERR_TAG_CANNOT_COPY,						/* 测点不能复制 */
		PSERR_TAG_NOT_EXIST,						/* 测点不存在 */
		PSERR_TAG_PROP_NOT_EXIST,					/* 属性不存在 */
		PSERR_TAG_PROP_NOT_CHANGED,					/* 测点值未改变 */
		PSERR_TAG_PROP_FILTER,						/* 测点值被过滤 */
		PSERR_TAG_CANNOT_GETPROP,					/* 不能读属性 */
		PSERR_TAG_CANNOT_SETPROP,					/* 不能写属性 */
		PSERR_TAG_LACK_PROP,						/* 增加测点时缺少必要属性 */
		PSERR_TAG_QUERY_START_OUT_RANGE ,			/* 查询开始编号超出结果集范围 */
		PSERR_DATATYPE,								/* 数据类型错误 */
		PSERR_TAG_NOT_SAVE_HIS,						/* 测点不保存历史 */
		PSERR_TAG_NAME_ILLEGAL,						/* 测点名称不合法 */
		PSERR_TAG_PROP_VALUE_INVALID,				/* 测点属性值无效 */
		PSERR_DESC_TOO_LONG,						/* 点描述信息超长 */

		PSERR_TAGNOTIFY_BASE = -19300,

		PSERR_TAGNOTIFY_SUBCRIBE_FAILED,			/* 注册失败 */
		PSERR_TAGNOTIFY_CANNOT_START,				/* 测点订阅发布模块不能启动 */
		PSERR_TAGNOTIFY_SUBSCRIBE_MAP_ERROR,		/* 测点订阅发布模块的订阅表错误 */
		PSERR_TAGNOTIFY_PBULISH_MAP_ERROR,			/* 测点订阅发布模块的发布者表错误 */
		PSERR_TAGNOTIFY_TAG_NOT_SUBSCRIBED,			/* 测点未被订阅 */
		PSERR_TAGNOTIFY_CONNECT_NOT_FOUND,			/* 连接不存在 */

		PSERR_REAL_BASE = -19200 ,					/* 实时相关错误 */

		PSERR_REAL_CANNOT_READ,						/* 不能读实时值 */
		PSERR_REAL_CANNOT_WRITE,					/* 不能写实时值 */
		PSERR_REAL_DATA_FILE_FAIL,					/* 实时数据保存文件错误 */

		PSERR_REALNOTIFY_BASE = -19100 ,			/* 实时相关错误 */

		PSERR_REALNOTIFY_CANNOT_START,				/* 实时订阅发布模块不能启动 */
		PSERR_REALNOTIFY_SUBSCRIBE_MAP_ERROR,		/* 实时订阅发布模块的订阅表错误 */
		PSERR_REALNOTIFY_PUBLISH_MAP_ERROR,			/* 实时订阅发布模块的发布者表错误 */
		PSERR_REALNOTIFY_TAG_NOTSUBSCRIBED,			/* 实时未被订阅 */
		PSERR_REALNOTIFY_CONNECT_NOT_FOUND,			/* 连接不存在 */

		PSERR_AUTHORITY_BASE = -19000,				/* 权限相关错误 */

		PSERR_AUTHORITY_SECURITY_AREA_NOT_MATCH,	/* 安全区不匹配 */
		PSERR_AUTHORITY_WRITE_READONLY_PROPERTY,	/* 写只读属性 */
		PSERR_TAG_BEYOND_MAX,						/* 总点数超过授权 */
		PSERR_LICENSE_UPDATA_ERROR,					/* 更新License信息失败，停止运行（刚性保护） */
		PSERR_LICENSE_TYPE_NO,						/* 没有任何许可证，Server停止运行（刚性保护） */
		PSERR_LICENSE_DEMO_RUN_TIMEOUT,				/* 演示版和开发试用版运行超时，Server停止运行（刚性保护） */
		PSERR_LICENSE_NOT_PSPACE5,					/* 没有获取pSpace 5.x版本的License，Server停止运行（刚性保护） */
		PSERR_LICENSE_NOT_SIMPLIFIED_CHINESE,		/* 没有获取简体中文版本的License，Server停止运行（刚性保护） */
		PSERR_LICENSE_SITRAP_START,					/* SITrap启动（刚性保护） */
		PSERR_LICENSE_CONNECT_BEYOND_USERAPP_MAX,	/* 用户自编写的应用程序客户端连接数超过限制值，不能再建立连接（弹性保护） */
		PSERR_LICENSE_CONNECT_BEYOND_VIEW_MAX,		/* View客户端数连接数超过限制值，不能再建立连接（弹性保护） */
		PSERR_LICENSE_CONNECT_BEYOND_NETVIEW_MAX,	/* NetView客户端数连接数超过限制值，不能再建立连接（弹性保护） */
		PSERR_LICENSE_CONNECT_BEYOND_IO_MAX,		/* NetView客户端数连接数超过限制值，不能再建立连接（弹性保护） */
		PSERR_AUTHORITY_START_LICENSE_FAIL,			/* 启动License失败（刚性保护） */
		PSERR_LICENSE_EVALUATION_TIMEOUT,			/* 评估版运行超时（刚性保护） */
		PSERR_LICENSE_NO_EX_LICENSE,				/* 扩展组件没有License授权（弹性保护） */

		PSERR_HIS_BASE = -18900 ,					/* 历史和历史文件相关错误 */

		PSERR_HIS_NO_DISK_SPACE,					/* 磁盘空间不足 */
		PSERR_HIS_DATA_DATAEXISTS,					/* 数据已经存在 */
		PSERR_HIS_MOREDATA,							/* 真实数据条数超出指定数 */
		PSERR_HIS_NODATA,							/* 在指定的时间范围内没有数据 */
		PSERR_HIS_TIMESTAMP_EARLY,					/* 时间戳太早（写入值的时间戳比此点最后一条数据时间戳早） */
		PSERR_HIS_AGGREGATE_NOT_IMPLEMENT,			/* 不支持的统计方法 */
		PSERR_HIS_TAG_NOT_SAVE_HIS,					/* 该点不保存历史 */
		PSERR_HIS_SE_FAIL,							/* 存储引擎失败，详细错误请查看日志 */
		PSERR_HIS_TAG_VERSION_MAX,					/* 历史点版本号达到最大 */
		PSERR_HIS_TAG_COMPRESS_MODE_ERROR,			/* 当前点类型不支持此种压缩模式 */

		PSERR_EVENT_BASE = -18800 ,					/* 事件相关错误 */

		PSERR_SQL_ERROR	,							/* 关系数据库错误 */
		PSERR_CONNECT_SQL_FAIL,						/* 连接数据源失败 */
		PSERR_CREATE_TABLE_FAIL,					/* 创建数据表失败 */
		PSERR_TABLE_NOT_EXIST,						/* 数据表不存在 */
		PSERR_DULPLICATE_KEY,						/* 事件编号重复 */
		PSERR_DISKSPACE_FULL,						/* 磁盘空间不足 */
		PSERR_EVENT_MOREDATA,						/* 真实事件条数超出指定数(返回值列表有效但不全) */

		PSERR_EVENTNOTIFY_BASE = -18700 ,			/* 事件发布相关错误 */

		PSERR_EVENTNOTIFY_CANNOT_START,				/* 事件订阅发布模块不能启动 */
		PSERR_EVENTNOTIFY_SUBSCRIBE_MAP_ERROR,		/* 事件订阅发布模块的订阅表错误 */
		PSERR_EVENTNOTIFY_PUBLISH_MAP_ERROR,		/* 事件订阅发布模块的发布者表错误 */
		PSERR_EVENTNOTIFY_CONNECT_NOT_FOUND,		/* 连接不存在 */

		PSERR_USER_BASE = -18600 ,					/* 用户和用户组相关错误 */

		PSERR_USER_GROUPNAME_CONFLICT,              /* 用户组名冲突 */
		PSERR_USER_USERNAME_CONFLICT,               /* 用户名冲突 */
		PSERR_USER_USER_IN_GROUP,                   /* 向用户组添加组中存在的用户 */
		PSERR_USER_USER_NOT_IN_GROUP,               /* 从用户组删除不存在的用户 */
		PSERR_USER_REIGISTE_USERNAME_FAIL,          /* 向系统注册用户名出错 */
		PSERR_USER_REIGISTE_GROUPNAME_FAIL,         /* 向系统注册用户组名出错 */
		PSERR_USER_USERGROUP_NOT_EXIST,             /* 操作不存在的用户组 */
		PSERR_USER_USER_NOT_EXIST,                  /* 操作不存在的用户 */
		PSERR_USER_USERNAME_OR_PASSWORD_NOTMATCH,   /* 用户名和密码不匹配 */
		PSERR_USER_READ_PSUSERCONF_FAIL,            /* 用户和用户组配置文件读出错 */
		PSERR_USER_WRITE_PSUSERCONF_FAIL,           /* 用户和用户组配置文件写错误 */
		PSERR_USER_USERGROUP_ONLYREAD,              /* 用户组只读 */
		PSERR_USER_USER_ONLYREAD,                   /* 用户只读 */
		PSERR_USER_LOST_VITAL_DATA,					/* 缺失必须字段 */
		PSERR_USER_NAME_LENGTH_WRONG,				/* 用户名或用户组名长度错误； */
		PSERR_USER_NAME_ILLEGAL,					/* 用户名或用户组名非法 */
		PSERR_USER_CONF_DESTROY,					/* 用户配置文件被破坏 */
		PSERR_USER_CONF_BACKUP_FAIL,				/* 用户配置文件备份失败 */

		PSERR_ALARM_BASE = -18500 ,					/* 报警相关错误 */
		PSERR_ALARM_MOREDATA,						/* 真实报警条数超出指定数(返回值列表有效但不全) */

		PSERR_MAX = -10000 							/* 接口返回最大错误号 */
	} PS_ERROR_CODE_ENUM;


	/* =====================================================================
	通用（PSCommon_*）功能函数定义
	===================================================================== */

	/* 
	<summary>
	[API] 启动初化化pSpace接口动态库
	</summary>
	<returns>
	成功时返回PSRET_OK，失败时返回相应的错误代码
	</returns>
	<remarks>
	注意：在使用pSpace API接口的时候必须首先调用本函数
	该函数可以调用多次,退出时需调用psAPI_Common_StopAPI相应的次数
	该函数可能返回失败
	返回失败之后应继续尝试调用该函数或者退出进程
	常见返回错误类型
		PSERR_INTERFACE_REGISTER_CALLBACK_FAIL 初始化注册回调函数失败
		PSERR_COMMON_THREAD	创建相关的线程失败
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Common_StartAPI();

	/* 
	<summary>
	[API] 退出清理pSpace接口动态库
	</summary>
	<returns>
	总是返回PSRET_OK
	</returns>
	<remarks>
	退出使用pSpace API接口时调用
	如果psAPI_Common_StartAPI调用多次，本函数也应该调用多次才能释放相关的资源
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_Common_StopAPI();

	/* 
	<summary>
	[API] 由错误号得到相关的中文描述
	</summary>
	<param name="nError">
	查询的错误码 PS_ERROR_CODE_ENUM枚举类型
	</param>
	<returns>
	返回错误号相关的中文描述
	如果没找到相关的中文描述，返回PSNULL
	</returns> */
	PSDLL PSCSTR PSAPI psAPI_Commom_GetErrorDesc(PSIN PSAPIStatus nError);

#ifdef  __cplusplus
}
#endif

#pragma pack(pop, Before_psAPISDK)

#endif	/* __PS_APICOMMON_H__ */
