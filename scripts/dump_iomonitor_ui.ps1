# IoMonitor UI Dumper v3 - Win32 API for SysListView32/SysTreeView32
$outFile = "D:\temp\iomonitor_ui.txt"
$script:out = [System.Collections.ArrayList]@()

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class Win32UI {
    [DllImport("user32.dll")] public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
    [DllImport("user32.dll")] public static extern IntPtr FindWindowEx(IntPtr hwndParent, IntPtr hwndChildAfter, string lpszClass, string lpszWindow);
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
    [DllImport("user32.dll")] public static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);
    [DllImport("user32.dll")] public static extern int SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
    [DllImport("user32.dll")] public static extern int SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, StringBuilder lParam);
    [DllImport("user32.dll")] public static extern int SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, ref LVITEM lParam);
    [DllImport("kernel32.dll")] public static extern void RtlMoveMemory(IntPtr dest, IntPtr src, int size);
    [DllImport("kernel32.dll")] public static extern IntPtr VirtualAllocEx(IntPtr hProcess, IntPtr lpAddress, uint dwSize, uint flAllocationType, uint flProtect);
    [DllImport("kernel32.dll")] public static extern bool VirtualFreeEx(IntPtr hProcess, IntPtr lpAddress, uint dwSize, uint dwFreeType);
    [DllImport("kernel32.dll")] public static extern IntPtr OpenProcess(uint dwDesiredAccess, bool bInheritHandle, int dwProcessId);
    [DllImport("kernel32.dll")] public static extern bool CloseHandle(IntPtr hObject);
    [DllImport("kernel32.dll")] public static extern bool ReadProcessMemory(IntPtr hProcess, IntPtr lpBaseAddress, [Out] byte[] lpBuffer, uint dwSize, out IntPtr lpNumberOfBytesRead);

    public const int WM_GETTEXT = 0x000D;
    public const int WM_GETTEXTLENGTH = 0x000E;
    public const int LVM_FIRST = 0x1000;
    public const int LVM_GETITEMCOUNT = LVM_FIRST + 4;
    public const int LVM_GETITEMTEXTW = LVM_FIRST + 115;
    public const int LVM_GETCOLUMNWIDTH = LVM_FIRST + 29;
    public const int LVM_GETHEADER = LVM_FIRST + 31;
    public const int LVM_GETCOLUMN = LVM_FIRST + 95;
    public const int TVM_GETNEXTITEM = 0x1100 + 10;
    public const int TVM_GETITEM = 0x1100 + 62;
    public const int TVM_SELECTITEM = 0x1100 + 11;
    public const int TVGN_ROOT = 0x0;
    public const int TVGN_NEXT = 0x1;
    public const int TVGN_CHILD = 0x4;
    public const int TVIF_TEXT = 0x1;

    [StructLayout(LayoutKind.Sequential)]
    public struct LVITEM {
        public uint mask; public int iItem; public int iSubItem;
        public uint state; public uint stateMask; public IntPtr pszText;
        public int cchTextMax; public int iImage; public IntPtr lParam;
        public int iIndent;
    }

    [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Auto)]
    public struct TVITEM {
        public int mask; public IntPtr hItem; public int state; public int stateMask;
        public IntPtr pszText; public int cchTextMax; public int iImage;
        public int iSelectedImage; public int cChildren; public IntPtr lParam;
    }
}
"@
[void]$script:out.Add("Win32UI compiled")

# Helper functions
function Get-ListItems($hwnd) {
    [void]$script:out.Add("  === ListView (HWND=$hwnd) ===")
    $count = [Win32UI]::SendMessage($hwnd, [Win32UI]::LVM_GETITEMCOUNT, [IntPtr]::Zero, [IntPtr]::Zero)
    [void]$script:out.Add("  Items: $count")

    $sb = New-Object System.Text.StringBuilder(256)
    $maxItems = [Math]::Min($count, 200)

    for($row = 0; $row -lt $maxItems; $row++) {
        $cells = @()
        for($col = 0; $col -lt 20; $col++) {
            $sb.Clear()
            $sb.EnsureCapacity(256)
            $lv = New-Object Win32UI+LVITEM
            $lv.iItem = $row
            $lv.iSubItem = $col
            $lv.mask = 1  # LVIF_TEXT
            $lv.cchTextMax = 255
            $lv.pszText = [System.Runtime.InteropServices.Marshal]::StringToHGlobalUni(new string(' ', 255))
            $ret = [Win32UI]::SendMessage($hwnd, [Win32UI]::LVM_GETITEMTEXTW, [IntPtr]$row, [ref]$lv)
            $text = [System.Runtime.InteropServices.Marshal]::PtrToStringUni($lv.pszText)
            [System.Runtime.InteropServices.Marshal]::FreeHGlobal($lv.pszText)
            if ($text -and $text.Trim()) {
                $cells += $text.Trim()
            } else {
                break  # no more columns
            }
        }
        if ($cells.Count -gt 0) {
            $line = "  [$row] " + ($cells -join " | ")
            if ($line.Length -gt 300) { $line = $line.Substring(0,300) + "..." }
            [void]$script:out.Add($line)
        }
    }
}

function Get-TreeItems($hwnd) {
    [void]$script:out.Add("  === TreeView (HWND=$hwnd) ===")

    $sb = New-Object System.Text.StringBuilder(256)

    # Start from root
    $hRoot = [Win32UI]::SendMessage($hwnd, [Win32UI]::TVM_GETNEXTITEM, [IntPtr][Win32UI]::TVGN_ROOT, [IntPtr]::Zero)
    if ($hRoot -eq [IntPtr]::Zero) {
        [void]$script:out.Add("  No root item")
        return
    }

    # Recursive tree walk
    function Walk-Tree($hItem, $depth) {
        if ($depth -gt 15) { return }
        $indent = "  " * $depth
        $sb.Clear()
        $sb.EnsureCapacity(256)
        $sb.Append(' ', 255)
        $tv = New-Object Win32UI+TVITEM
        $tv.hItem = $hItem
        $tv.mask = [Win32UI]::TVIF_TEXT
        $tv.pszText = [System.Runtime.InteropServices.Marshal]::StringToHGlobalUni(new string(' ', 255))
        $tv.cchTextMax = 255
        [Win32UI]::SendMessage($hwnd, [Win32UI]::TVM_GETITEM, [IntPtr]::Zero, [ref]$tv) | Out-Null
        $text = [System.Runtime.InteropServices.Marshal]::PtrToStringUni($tv.pszText)
        [System.Runtime.InteropServices.Marshal]::FreeHGlobal($tv.pszText)
        if ($text -and $text.Trim()) {
            [void]$script:out.Add("$indent$($text.Trim())")
        }

        # Walk children
        $hChild = [Win32UI]::SendMessage($hwnd, [Win32UI]::TVM_GETNEXTITEM, [IntPtr][Win32UI]::TVGN_CHILD, $hItem)
        if ($hChild -ne [IntPtr]::Zero) {
            Walk-Tree $hChild ($depth + 1)
        }

        # Walk next sibling
        $hNext = [Win32UI]::SendMessage($hwnd, [Win32UI]::TVM_GETNEXTITEM, [IntPtr][Win32UI]::TVGN_NEXT, $hItem)
        if ($hNext -ne [IntPtr]::Zero) {
            Walk-Tree $hNext $depth
        }
    }

    Walk-Tree $hRoot 0
}

# === MAIN ===
[void]$script:out.Add("=== IoMonitor UI Dump v3 (Win32) ===")
[void]$script:out.Add("Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")

# Find IoMonitor window
$hMain = [Win32UI]::FindWindow($null, "IoMonitor")
if ($hMain -eq [IntPtr]::Zero) {
    $hMain = [Win32UI]::FindWindow("Afx:400000:b:10003:6:8ad40155", $null)
}
if ($hMain -eq [IntPtr]::Zero) {
    [void]$script:out.Add("IoMonitor window NOT found")
} else {
    [void]$script:out.Add("IoMonitor HWND: $hMain")

    # Find all SysTreeView32 children
    $hTreeView = [Win32UI]::FindWindowEx($hMain, [IntPtr]::Zero, "SysTreeView32", $null)
    if ($hTreeView -ne [IntPtr]::Zero) {
        Get-TreeItems $hTreeView
    }

    # Find all SysListView32 children
    $hListView = [IntPtr]::Zero
    $lvCount = 0
    while ($true) {
        $hListView = [Win32UI]::FindWindowEx($hMain, $hListView, "SysListView32", $null)
        if ($hListView -eq [IntPtr]::Zero) { break }
        $lvCount++
        Get-ListItems $hListView
    }
    [void]$script:out.Add("Total ListViews found: $lvCount")
}

$script:out | Out-File -FilePath $outFile -Encoding UTF8
Write-Host "Output: $outFile ($($script:out.Count) lines)"
