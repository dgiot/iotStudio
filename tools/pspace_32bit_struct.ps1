$code = @"
using System; using System.Runtime.InteropServices;
public class PsAPI {
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Common_StartAPI(string init);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Real_ReadList(IntPtr conn, string tagNames, int count, IntPtr buf);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Server_IsConnected(int h);
    [DllImport(@"E:\IO ServerOnLine\psAPISDK.dll", CallingConvention=CallingConvention.Cdecl)]
    public static extern int psAPI_Server_GetAllConnectInfo(IntPtr buf, ref int count);
}
"@

Add-Type -TypeDefinition $code
Write-Host "StartAPI: $([PsAPI]::psAPI_Common_StartAPI(''))"

# 查现有连接
$cnt = 0
$r = [PsAPI]::psAPI_Server_GetAllConnectInfo([IntPtr]::Zero, [ref]$cnt)
Write-Host "GetAllConnectInfo: ret=$r count=$cnt"

# 尝试无连接直接读 (测试内部是否自动连接)
$buf = [Runtime.InteropServices.Marshal]::AllocHGlobal(4096)
Write-Host "Real_ReadList(0): $([PsAPI]::psAPI_Real_ReadList([IntPtr]::Zero, '/CY1C8K/DX1ZRZ/ZD010833ALA1', 1, $buf))"
