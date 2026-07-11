Get-ChildItem -Path C:\Users\Administrator\*.pcapng -Recurse -ErrorAction SilentlyContinue | Select FullName,Length
Get-ChildItem -Path D:\*.pcapng -Recurse -ErrorAction SilentlyContinue | Select FullName,Length
