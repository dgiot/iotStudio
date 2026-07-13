#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <time.h>

// Basic type definitions
typedef float PSFLOAT;
typedef double PSDOUBLE;
typedef int8_t PSINT8;
typedef int16_t PSINT16;
typedef int32_t PSINT32;
typedef int64_t PSINT64;
typedef uint8_t PSUINT8;
typedef uint16_t PSUINT16;
typedef uint32_t PSUINT32;
typedef uint64_t PSUINT64;
typedef PSUINT8 PSBOOL;
typedef char PSCHAR;
typedef char* PSSTR;
typedef const char* PSCSTR;
typedef PSUINT16 PSHANDLE;
typedef PSINT32 PSAPIStatus;

#define PSFALSE 0
#define PSTRUE 1
#define PSNULL 0
#define PSHANDLE_UNUSED 0xFFFF
#define _stdcall

// Error codes
#define PSRET_OK 0
#define PSRET_FAIL -1
#define PSERR_NET_CONNECT_FAILED -19804
#define PSERR_USER_USER_NOT_EXIST -18610
#define PSERR_USER_USERNAME_OR_PASSWORD_NOTMATCH -18608

// Time structure
typedef struct __PS_TIME {
    PSUINT32 Second;
    PSUINT16 Millisec;
} PS_TIME;

// Server properties structure
typedef struct __PS_SERVER_PROP {
    PSUINT16 Version;
    PSUINT16 SubVersion;
    PSSTR ServerName;
    PSSTR UserName;
    PSUINT32 Permission;
    PSUINT64 SecurityArea;
    PSUINT32 Status;
} PS_SERVER_PROP;

// Mock function implementations
PSAPIStatus _stdcall psAPI_Common_StartAPI(void) {
    printf("pSpace API started successfully\n");
    return PSRET_OK;
}

PSAPIStatus _stdcall psAPI_Common_StopAPI(void) {
    printf("pSpace API stopped\n");
    return PSRET_OK;
}

PSCSTR _stdcall psAPI_Commom_GetErrorDesc(PSAPIStatus nError) {
    switch (nError) {
        case PSRET_OK:
            return "Success";
        case PSRET_FAIL:
            return "Failed";
        case PSERR_NET_CONNECT_FAILED:
            return "Network connection failed";
        case PSERR_USER_USER_NOT_EXIST:
            return "User does not exist";
        case PSERR_USER_USERNAME_OR_PASSWORD_NOTMATCH:
            return "Username or password mismatch";
        default:
            return "Unknown error";
    }
}

PSAPIStatus _stdcall psAPI_Server_Connect(PSSTR pszServer, PSSTR pszUserName, 
                                          PSSTR pszPassword, PSHANDLE *phServer) {
    if (strcmp(pszServer, "localhost") == 0 && 
        strcmp(pszUserName, "admin") == 0 && 
        strcmp(pszPassword, "admin888") == 0) {
        *phServer = 1;
        printf("Connected to server %s successfully\n", pszServer);
        return PSRET_OK;
    } else {
        printf("Failed to connect to server %s - Mock environment only supports localhost/admin/admin888\n", pszServer);
        return PSERR_NET_CONNECT_FAILED;
    }
}

PSAPIStatus _stdcall psAPI_Server_Disconnect(PSHANDLE hServer) {
    printf("Disconnected successfully\n");
    return PSRET_OK;
}

PSAPIStatus _stdcall psAPI_Server_IsConnected(PSHANDLE hServer, PSBOOL *pbConnected) {
    *pbConnected = (hServer != PSHANDLE_UNUSED) ? PSTRUE : PSFALSE;
    if (*pbConnected) {
        printf("Server is connected\n");
    } else {
        printf("Not connected to server\n");
    }
    return PSRET_OK;
}

PSAPIStatus _stdcall psAPI_Server_SetTimeout(PSHANDLE hServer, PSUINT32 nSecTimeout) {
    printf("Timeout set to %u seconds\n", nSecTimeout);
    return PSRET_OK;
}

PSAPIStatus _stdcall psAPI_Server_GetTime(PSHANDLE hServer, PS_TIME *pTime) {
    pTime->Second = (PSUINT32)time(NULL);
    pTime->Millisec = 0;
    struct tm *ptm = localtime((time_t*)&(pTime->Second));
    printf("Server time: %04d-%02d-%02d %02d:%02d:%02d\n",
           ptm->tm_year + 1900, ptm->tm_mon + 1, ptm->tm_mday,
           ptm->tm_hour, ptm->tm_min, ptm->tm_sec);
    return PSRET_OK;
}

PSAPIStatus _stdcall psAPI_Server_GetProp(PSHANDLE hServer, PS_SERVER_PROP **ppServerProp) {
    static PS_SERVER_PROP prop = {
        6, 0, (char*)"pSpace Demo Server", (char*)"admin", 0xFFFFFFFF, 0xFFFF, 2
    };
    *ppServerProp = &prop;
    printf("Server Name: %s\n", prop.ServerName);
    printf("Login User: %s\n", prop.UserName);
    printf("Server Version: %d.%d\n", prop.Version, prop.SubVersion);
    printf("User Permission: 0x%X\n", prop.Permission);
    printf("Server Status: %d\n", prop.Status);
    return PSRET_OK;
}

void GetErrorDescTest(void) {
    printf("===============================================================\n");
    printf("=== Error Code Description Test\n");
    printf("\tPSRET_OK: %s\n", psAPI_Commom_GetErrorDesc(PSRET_OK));
    printf("\tPSRET_FAIL: %s\n", psAPI_Commom_GetErrorDesc(PSRET_FAIL));
    printf("\tPSERR_NET_CONNECT_FAILED: %s\n", psAPI_Commom_GetErrorDesc(PSERR_NET_CONNECT_FAILED));
    printf("=== Error Code Description Test End\n");
}

void ServerTest(void) {
    PSHANDLE g_hServer = PSHANDLE_UNUSED;
    PSBOOL bConnected;
    PS_TIME psTm;
    PS_SERVER_PROP *pServerProp;
    PSAPIStatus nRet;

    printf("===============================================================\n");
    printf("=== Server Function Test\n");

    // Connect
    nRet = psAPI_Server_Connect((PSSTR)"localhost", (PSSTR)"admin", (PSSTR)"admin888", &g_hServer);
    
    // Check connection
    nRet = psAPI_Server_IsConnected(g_hServer, &bConnected);
    
    // Set timeout
    nRet = psAPI_Server_SetTimeout(g_hServer, 10);
    
    // Get time
    nRet = psAPI_Server_GetTime(g_hServer, &psTm);
    
    // Get properties
    nRet = psAPI_Server_GetProp(g_hServer, &pServerProp);
    
    // Disconnect
    nRet = psAPI_Server_Disconnect(g_hServer);

    printf("=== Server Function Test End\n");
}

int main(int argc, char* argv[]) {
    PSAPIStatus nRet;

    printf("========================================\n");
    printf("pSpace API Linux Mock Test Program\n");
    printf("========================================\n\n");

    // Start API
    nRet = psAPI_Common_StartAPI();
    if (nRet != PSRET_OK) {
        printf("Failed to start pSpace API: %s\n", psAPI_Commom_GetErrorDesc(nRet));
        return 1;
    }
    printf("\n");

    // Error description test
    GetErrorDescTest();
    printf("\n");

    // Server test
    ServerTest();
    printf("\n");

    printf("Test completed.\n");

    // Stop API
    psAPI_Common_StopAPI();

    return 0;
}