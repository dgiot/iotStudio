#include "../psAPISDK.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "psAPITest.h"

//记住这些变量 让测试函数不依赖服务器当前的用户用户组设置
PSSTR g_pszTestGroupName = (PSSTR)"testCase_Group";
PSUINT16 g_nTestGId = PSUSERGROUPID_UNUSED;
PSSTR g_pszTestUserName = (PSSTR)"testCase_group";
PSUINT16 g_nTestUId = PSUSERID_UNUSED;

void testCase_UserGroup_GetGroupIdByName()
{
	PSSTR pszGroupName = g_pszTestGroupName;
	PSUINT16 nGId = PSUSERGROUPID_UNUSED;
	PSAPIStatus nRet = psAPI_UserGroup_GetGroupIdByName(g_hServer, pszGroupName, &nGId);
	if (PSERR(nRet))
	{
		printf("获取用户组名%s的ID失败 %s\n", pszGroupName, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("用户组名%s的ID为%d\n", pszGroupName, nGId);
}

void testCase_UserGroup_GetList()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nUserGroupCount = 0;
	PS_USER_GROUP *pUserGroups = PSNULL;
	PSUINT32 n = 0;
	PSUINT32 hSecurityArea = 0;

	nRet = psAPI_UserGroup_GetList(g_hServer, &nUserGroupCount, PSNULL);
	if (PSERR(nRet))
	{
		printf("获取用户组数量失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取用户组数量%u\n", nUserGroupCount);

	nRet = psAPI_UserGroup_GetList(g_hServer, &nUserGroupCount, &pUserGroups);
	if (PSERR(nRet))
	{
		printf("获取用户组列表失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取用户组列表 数量%u\n", nUserGroupCount);
	for (n = 0; n < nUserGroupCount; n++)
	{
		hSecurityArea = (pUserGroups+n)->SecurityArea>>32;
		printf("====用户组名:%s\n\t用户描述:%s\n\tID:%d 权限:0X%.8X 安全区:0X%.8X%.8X\n",
			(pUserGroups+n)->Name, (pUserGroups+n)->Desc,
			(pUserGroups+n)->Id,(pUserGroups+n)->Permission, hSecurityArea,(pUserGroups+n)->SecurityArea&0xFFFFFFFF);
	}
	psAPI_Memory_FreeUserGroupList(&pUserGroups, nUserGroupCount);
}

void testCase_UserGroup_Add()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_USER_GROUP_FIELD field = {0,1,0,0,1};
	PS_USER_GROUP userGroup = {0};
	PSUINT16 nGId = 0;

	userGroup.Name = g_pszTestGroupName;
	userGroup.SecurityArea = 0xFFFF;

	nRet = psAPI_UserGroup_Add(g_hServer, &field, &userGroup, &nGId);
	if (PSERR(nRet))
	{
		printf("添加用户组%s失败 %s\n", userGroup.Name, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	g_nTestGId = nGId;
	printf("添加用户组%s成功 用户组ID:%d\n", userGroup.Name, nGId);
}

void testCase_UserGroup_Delete()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT16 nGId = g_nTestGId;

	nRet = psAPI_UserGroup_Delete(g_hServer, nGId);
	if (PSERR(nRet))
	{
		printf("删除用户组ID:%d失败 %s\n", nGId, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("删除用用户组ID:%d成功\n", nGId);
}

void testCase_UserGroup_GetProp()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_USER_GROUP *pUserGroup = NULL;
	PSUINT16 nGId = g_nTestGId;
	PSUINT32 hSecurityArea = 0;
	
	nRet = psAPI_UserGroup_GetProp(g_hServer, nGId, &pUserGroup);
	if (PSERR(nRet))
	{
		printf("获取用户组ID:%d属性失败 %s\n", nGId, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取用户组ID:%d属性成功\n", nGId);
	hSecurityArea = pUserGroup->SecurityArea>>32;
	printf("====用户组名:%s\n\t用户描述:%s\n\tID:%d 权限:0X%.8X 安全区:0X%.8X%.8X\n",
		pUserGroup->Name,pUserGroup->Desc,
		pUserGroup->Id, pUserGroup->Permission, hSecurityArea, pUserGroup->SecurityArea&0xFFFFFFFF);

	psAPI_Memory_FreeUserGroupList(&pUserGroup, 1);
}

void testCase_UserGroup_SetProp()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_USER_GROUP_FIELD field = {0,0,1,0,1};
	PS_USER_GROUP userGroup = {0};
	PSUINT16 nGId = g_nTestGId;

	userGroup.Desc = (PSSTR)"测试设置属性";
	userGroup.SecurityArea = 0x0FFF;

	nRet = psAPI_UserGroup_SetProp(g_hServer, nGId, &field, &userGroup);
	if (PSERR(nRet))
	{
		printf("设置用户组ID:%d属性失败 %s\n", nGId, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("设置用户组ID:%d属性成功\n", nGId);
}

//////////////////////////////////////////////////////////////////////////

void testCase_User_GetUserIdByName()
{
	PSSTR pszName = g_pszTestUserName;
	PSUINT16 nUId = PSUSERID_UNUSED;
	PSAPIStatus nRet = psAPI_User_GetUserIdByName(g_hServer, pszName, &nUId );
	if (PSERR(nRet))
	{
		printf("获取用户名%s的ID失败 %s\n", pszName, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("用户组%s的ID为%d\n", pszName, nUId);
}
void testCase_User_GetList()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT32 nUserCount = 0;
	PS_USER *pUsers = PSNULL;
	PSUINT32 n = 0;
	PSUINT32 hSecurityArea = 0;

	nRet = psAPI_User_GetList(g_hServer, &nUserCount, PSNULL);
	if (PSERR(nRet))
	{
		printf("获取用户数量失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取用户数量%u\n", nUserCount);

	nRet = psAPI_User_GetList(g_hServer, &nUserCount, &pUsers);
	if (PSERR(nRet))
	{
		printf("获取用户列表失败 %s\n", psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取用户列表 数量%u\n", nUserCount);
	for (n = 0; n < nUserCount; n++)
	{
		hSecurityArea = (pUsers+n)->SecurityArea>>32;
		printf("====用户名:%s\n\t密码:%s\n\t描述:%s\n\tID:%d 权限:0X%.8X 安全区:0X%.8X%.8X\n",
			(pUsers+n)->Name, (pUsers+n)->Password, (pUsers+n)->Desc,
			(pUsers+n)->Id,(pUsers+n)->Permission, hSecurityArea,(pUsers+n)->SecurityArea&0xFFFFFFFF);
	}
	psAPI_Memory_FreeUserList(&pUsers, nUserCount);
}

void testCase_User_Add()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_USER_FIELD field = {0,1,1,0};
	PS_USER user = {0};
	PSUINT16 nUId = 0;

	user.Name = g_pszTestUserName;
	user.Password = (PSSTR)"testPwd";

	nRet = psAPI_User_Add(g_hServer, &field, &user, &nUId);
	if (PSERR(nRet))
	{
		printf("添加用户%s失败 %s\n", user.Name, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	g_nTestUId = nUId;
	printf("添加用户%s成功 用户ID:%d\n", user.Name, nUId);
}

void testCase_User_Delete()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT16 nUId = g_nTestUId;

	nRet = psAPI_User_Delete(g_hServer, nUId);
	if (PSERR(nRet))
	{
		printf("删除用户ID:%d失败 %s\n", nUId, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("删除用用户ID:%d成功\n", nUId);
}

void testCase_User_GetProp()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_USER *pUser = NULL;
	PSUINT16 nUId = g_nTestUId;
	PSUINT32 hSecurityArea = 0;

	nRet = psAPI_User_GetProp(g_hServer, nUId, &pUser);
	if (PSERR(nRet))
	{
		printf("获取用户ID:%d属性失败 %s\n", nUId, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取用户ID:%d属性成功\n", nUId);
	hSecurityArea = pUser->SecurityArea>>32;
	printf("====用户名:%s\n\t密码:%s\n\t描述:%s\n\tID:%d 权限:0X%.8X 安全区:0X%.8X%.8X\n",
		pUser->Name, pUser->Password, pUser->Desc,
		pUser->Id,pUser->Permission, hSecurityArea,pUser->SecurityArea&0xFFFFFFFF);

	psAPI_Memory_FreeUserList(&pUser, 1);
}

void testCase_User_SetProp()
{
	PSAPIStatus nRet = PSRET_OK;
	PS_USER_FIELD field = {0,0,0,1};
	PS_USER user = {0};
	PSUINT16 nUId = g_nTestUId;

	user.Desc = (PSSTR)"测试设置属性";
	user.SecurityArea = 0x0FFF;

	nRet = psAPI_User_SetProp(g_hServer, nUId, &field, &user);
	if (PSERR(nRet))
	{
		printf("设置用户ID:%d属性失败 %s\n", nUId, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("设置用户ID:%d属性成功\n", nUId);
}

//////////////////////////////////////////////////////////////////////////

void testCase_UserGroup_GetUserList()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT16 nGId = g_nTestGId;
	PSUINT32 nUserCount = 0;
	PSUINT16 *pUserIds = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_UserGroup_GetUserList(g_hServer, nGId, &nUserCount, &pUserIds);
	if (PSERR(nRet))
	{
		printf("获取用户组ID:%d的用户列表失败 %s\n", nGId, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取用户组ID:%d的用户列表成功 数量%d\n", nGId, nUserCount);
	printf("\t用户列表");
	for (n = 0; n < nUserCount; n++)
	{
		printf("%d, ", *(pUserIds+n));
	}
	printf("\n");
	psAPI_Memory_FreeAndNull((PSVOID**)&pUserIds);
}

void testCase_User_GetUserGroupList()
{
	PSAPIStatus nRet = PSRET_OK;
	PSUINT16 nUId = g_nTestUId;
	PSUINT32 nUserGroupCount = 0;
	PSUINT16 *pUserGroupIds = PSNULL;
	PSUINT32 n = 0;

	nRet = psAPI_User_GetUserGroupList(g_hServer, nUId, &nUserGroupCount, &pUserGroupIds);
	if (PSERR(nRet))
	{
		printf("获取用户ID:%d所属用户组列表失败 %s\n", nUId, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("获取用户ID:%d所属用户组列表成功 数量%d\n", nUId, nUserGroupCount);
	printf("\t所属用户组列表");
	for (n = 0; n < nUserGroupCount; n++)
	{
		printf("%d, ", *(pUserGroupIds+n));
	}
	printf("\n");
	psAPI_Memory_FreeAndNull((PSVOID**)&pUserGroupIds);
}

void testCase_UserGroup_AddUser()
{
	PSUINT16 nGId = g_nTestGId;
	PSUINT16 nUId = g_nTestUId;
	PSAPIStatus nRet = PSRET_OK;

	nRet = psAPI_UserGroup_AddUser(g_hServer, nGId, nUId);
	if (PSERR(nRet))
	{
		printf("增加用户%d到用户组%d失败 %s\n", nUId, nGId, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("增加用户%d到用户组%d成功\n", nUId, nGId);
}

void testCase_UserGroup_DeleteUser()
{
	PSUINT16 nGId = g_nTestGId;
	PSUINT16 nUId = g_nTestUId;
	PSAPIStatus nRet = PSRET_OK;

	nRet = psAPI_UserGroup_DeleteUser(g_hServer, nGId, nUId);
	if (PSERR(nRet))
	{
		printf("删除用户%d到用户组%d失败 %s\n", nUId, nGId, psAPI_Commom_GetErrorDesc(nRet));
		return;
	}
	printf("删除用户%d到用户组%d成功\n", nUId, nGId);
}

void UserTest()
{
	printf("\n===============================================================\n");
	printf("===用户用户组相关函数测试\n");

	testCase_Server_Connect();
	testCase_UserGroup_GetGroupIdByName();
	testCase_UserGroup_Add();
	testCase_UserGroup_GetList();
	testCase_UserGroup_SetProp();
	testCase_UserGroup_GetProp();
	testCase_UserGroup_Delete();
	testCase_UserGroup_GetList();
	
	//////////////////////////////////////////////////////////////////////////
	testCase_User_GetUserIdByName();
	testCase_User_GetList();
	testCase_User_Add();
	testCase_User_GetList();
	testCase_User_SetProp();
	testCase_User_GetList();
	testCase_User_GetProp();
	testCase_User_Delete();
	testCase_User_GetList();

	//////////////////////////////////////////////////////////////////////////
	testCase_User_Add();
	testCase_UserGroup_Add();
	testCase_UserGroup_GetUserList();
	testCase_User_GetUserGroupList();

	testCase_UserGroup_AddUser();
	testCase_UserGroup_GetUserList();
	testCase_User_GetUserGroupList();

	testCase_UserGroup_DeleteUser();
	testCase_UserGroup_GetUserList();
	testCase_User_GetUserGroupList();
	testCase_User_Delete();
	testCase_UserGroup_Delete();

	testCase_Server_Disconnect();

	printf("===用户用户组相关函数测试结束\n");
}