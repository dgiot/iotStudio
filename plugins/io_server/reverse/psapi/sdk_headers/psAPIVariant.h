#ifndef __PS_APIVARIANT_H__
#define __PS_APIVARIANT_H__

#include "psAPICommon.h"

#ifdef __cplusplus
extern "C"
{
#endif

	/* 
	<summary>
	[API] 申请PS_VARIANT类型变量
	</summary>
	<param name="ppVariant">
	PS_VARIANT类型变量指针的指针,*ppVariant必须为PSNULL
	</param>
	<returns>
	成功时返回PSRET_OK，失败时返回PSERR_COMMON_NO_MEMORY错误
	</returns>
	<remarks>
	执行后ppVariant是PSDATATYPE_EMPTY类型
	注意:
		申请释放采用在同一个模块申请释放原则，避免在一个模块申请，另一个模块释放
		通过本函数申请的PS_VARIANT变量，释放时需要psAPI_VARIANT_FREE来释放
	</remarks>  */
	PSDLL PSAPIStatus PSAPI psAPI_VARIANT_NEW(
		PSOUT PS_VARIANT **ppVariant
		);

	/* 
	<summary>
	[API] 清空PS_VARIANT类型
	</summary>
	<param name="pVariant">
	PS_VARIANT类型变量指针
	</param>
	<returns>
	成功时返回PSRET_OK，pVariant为PSNULL时返回参数错误
	</returns>
	<remarks>
	注意:
		如果pVariant数据类型为PSDATATYPE_STRING、PSDATATYPE_WSTRING、PSDATATYPE_BLOB时
			将会释放pVariant所指向的数据
			避免出错，应保证pVariant所指向的数据是用下面的拷贝函数或者psAPI_Memory_New、psAPI_Memory_NewAndClear申请的
		清空后pVariant数据类型为PSDATATYPE_EMPTY
	</remarks>  */
	PSDLL PSAPIStatus PSAPI psAPI_VARIANT_CLEAR(
		PSIN PSOUT PS_VARIANT *pVariant
		);

	/* 
	<summary>
	[API] 释放已申请的PS_VARIANT变量空间
	</summary>
	<param name="ppVariant">
	PS_VARIANT类型变量指针的指针
	</param>
	<returns>
	总是返回成功PSRET_OK
	</returns>
	<remarks>
	与psAPI_Memory_FreeValueList不同的是psAPI_Memory_FreeValueList可以释放PS_VARIANT数组
	注意:
		ppVariant应保证是通过psAPI_VARIANT_NEW或者psAPI_Memory_New、psAPI_Memory_NewAndClear申请的
		如果ppVariant数据类型为PSDATATYPE_STRING、PSDATATYPE_WSTRING、PSDATATYPE_BLOB时
			将会释放ppVariant所指向的数据
			避免出错，应保证ppVariant所指向的数据是用下面的拷贝函数或者psAPI_Memory_New、psAPI_Memory_NewAndClear申请的
	</remarks>  */
	PSDLL PSAPIStatus PSAPI psAPI_VARIANT_FREE(
		PSIN PSOUT PS_VARIANT **ppVariant
		);

	/* 
	<summary>
	[API] 复制PS_VARIANT变量
	</summary>
	<param name="pSource">
	复制PS_VARIANT变量的源数据
	</param>
	<param name="pDestination">
	复制的PS_VARIANT变量目的地
	</param>
	<returns>
	成功时返回PSRET_OK
	如果pSource或者pDestination为PSNULL将返回参数错误PSERR_COMMON_PARAMETER_INVALID
	如果pSource指向的数据类型有误也返回参数错误PSERR_COMMON_PARAMETER_INVALID
	</returns>
	<remarks>
	复制前将用psAPI_VARIANT_CLEAR清空pDestination变量
	如果pSource数据类型为PSDATATYPE_STRING、PSDATATYPE_WSTRING、PSDATATYPE_BLOB时
		将会为pDestination指向的数据采用psAPI_Memory_New申请新的空间
	</remarks> */
	PSDLL  PSAPIStatus PSAPI psAPI_VARIANT_COPY(
		PSIN PS_VARIANT *pSource,
		PSOUT PS_VARIANT *pDestination
		);

	/* 
	<summary>
	[API] 将PSSTR字符串赋给PS_VARIANT变量
	</summary>
	<param name="pszStr">
	复制给PS_VARIANT变量的C风格字符串
	</param>
	<param name="pVariant">
	复制的PS_VARIANT变量目的地
	</param>
	<returns>
	成功时返回PSRET_OK
	如果pszStr或者pVariant为PSNULL将返回参数错误PSERR_COMMON_PARAMETER_INVALID
	</returns>
	<remarks>
	复制前将用psAPI_VARIANT_CLEAR清空pDestination变量
	将会为pVariant指向的字符串采用psAPI_Memory_New申请新的空间
	执行后pVariant指向PSDATATYPE_STRING类型
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_VARIANT_COPY_PSSTR(
		PSIN PSSTR pszStr, 
		PSOUT PS_VARIANT *pVariant
		);

	/* 
	<summary>
	[API] 将PS_STRING字符串赋给PS_VARIANT变量
	</summary>
	<param name="pStr">
	复制给PS_VARIANT变量的PS_STRING字符串
	</param>
	<param name="pVariant">
	复制的PS_VARIANT变量目的地
	</param>
	<returns>
	成功时返回PSRET_OK
	如果pStr或者pVariant为PSNULL将返回参数错误PSERR_COMMON_PARAMETER_INVALID
	</returns>
	<remarks>
	复制前将用psAPI_VARIANT_CLEAR清空pDestination变量
	将会为pVariant指向的字符串采用psAPI_Memory_New申请新的空间
	执行后pVariant指向PSDATATYPE_STRING类型
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_VARIANT_COPY_STRING(
		PSIN PS_STRING  *pStr, 
		PSOUT PS_VARIANT *pVariant
		);

	/* 
	<summary>
	[API] 将PSWSTR字符串赋给PS_VARIANT变量
	</summary>
	<param name="pwszStr">
	复制给PS_VARIANT变量的C风格宽字符串
	</param>
	<param name="pVariant">
	复制的PS_VARIANT变量目的地
	</param>
	<returns>
	成功时返回PSRET_OK
	如果pwszStr或者pVariant为PSNULL将返回参数错误PSERR_COMMON_PARAMETER_INVALID
	</returns>
	<remarks>
	复制前将用psAPI_VARIANT_CLEAR清空pDestination变量
	将会为pVariant指向的字符串采用psAPI_Memory_New申请新的空间
	执行后pVariant指向PSDATATYPE_WSTRING类型
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_VARIANT_COPY_PSWSTR(
		PSIN PSWSTR pwszStr, 
		PSOUT PS_VARIANT *pVariant
		);

	/* 
	<summary>
	[API] 将PS_WSTRING字符串赋给PS_VARIANT变量
	</summary>
	<param name="pwStr">
	复制给PS_VARIANT变量的PS_WSTRING宽字符串
	</param>
	<param name="pVariant">
	复制的PS_VARIANT变量目的地
	</param>
	<returns>
	成功时返回PSRET_OK
	如果pwStr或者pVariant为PSNULL将返回参数错误PSERR_COMMON_PARAMETER_INVALID
	</returns>
	<remarks>
	复制前将用psAPI_VARIANT_CLEAR清空pDestination变量
	将会为pVariant指向的字符串采用psAPI_Memory_New申请新的空间
	执行后pVariant指向PSDATATYPE_WSTRING类型
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_VARIANT_COPY_WSTRING(
		PSIN PS_WSTRING *pwStr, 
		PSOUT PS_VARIANT *pVariant
		);

	/* 
	<summary>
	[API] 将二进制串赋给PS_VARIANT变量
	</summary>
	<param name="pBlob">
	复制给PS_VARIANT变量的二进制串
	</param>
	<param name="pVariant">
	复制的PS_VARIANT变量目的地
	</param>
	<returns>
	成功时返回PSRET_OK
	如果pBlob或者pVariant为PSNULL将返回参数错误PSERR_COMMON_PARAMETER_INVALID
	</returns>
	<remarks>
	复制前将用psAPI_VARIANT_CLEAR清空pDestination变量
	将会为pVariant指向的字符串采用psAPI_Memory_New申请新的空间
	执行后pVariant指向PSDATATYPE_BLOB类型
	</remarks> */
	PSDLL PSAPIStatus PSAPI psAPI_VARIANT_COPY_BLOB(
		PSIN PS_BLOB *pBlob,
		PSOUT PS_VARIANT *pVariant
		);

#ifdef  __cplusplus
}
#endif

#endif /* __PS_APIVARIANT_H__ */
