"""
parse_lite Admin Dashboard — 嵌入式管理面板
============================================
访问: /admin
无外部依赖，纯 HTML + 内联 CSS/JS
"""
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

router = APIRouter(tags=["admin"])

ADMIN_HTML = r"""<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DG-IoT Admin</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font:14px/1.5 'Microsoft YaHei',sans-serif;background:#0c1c30;color:#c0d5e8;display:flex;min-height:100vh}
.sidebar{width:200px;background:#0f1d33;border-right:1px solid #234060;padding:16px 0}
.sidebar h2{color:#66d9ff;font-size:15px;padding:0 16px 16px;border-bottom:1px solid #234060}
.sidebar a{display:block;padding:8px 20px;color:#8aa0b4;text-decoration:none;font-size:13px}
.sidebar a:hover,.sidebar a.active{color:#66d9ff;background:#152a40}
.main{flex:1;padding:20px;overflow-y:auto}
.card{background:#162844;border:1px solid #234060;border-radius:8px;padding:16px;margin-bottom:16px}
.card h3{color:#66d9ff;font-size:14px;margin-bottom:12px;display:flex;align-items:center;gap:8px}
table{width:100%;border-collapse:collapse;font-size:12px}
th,td{padding:6px 10px;text-align:left;border-bottom:1px solid #1e3a5f}
th{color:#66d9ff;font-weight:600;background:#0d1f33}
tr:hover{background:#1a3050}
.badge{padding:2px 8px;border-radius:10px;font-size:11px}
.badge-ok{background:#1a4020;color:#4caf50}
.badge-warn{background:#403a10;color:#ff9800}
.badge-info{background:#102040;color:#2196f3}
.btn{padding:6px 14px;border:1px solid #234060;border-radius:4px;background:#1a3050;color:#c0d5e8;cursor:pointer;font-size:12px}
.btn:hover{background:#234060;color:#66d9ff}
.btn-danger{color:#ef5350;border-color:#402020}
.btn-danger:hover{background:#402020}
input,select{background:#0d1f33;border:1px solid #234060;color:#c0d5e8;padding:6px 10px;border-radius:4px;font-size:12px;width:100%}
.form-row{display:flex;gap:8px;margin-bottom:8px}
.form-row input,.form-row select{flex:1}
.status{display:flex;gap:16px;margin-bottom:16px}
.stat{background:#162844;border:1px solid #234060;border-radius:8px;padding:12px 16px;flex:1;text-align:center}
.stat .num{font-size:24px;color:#66d9ff;font-weight:bold}
.stat .label{font-size:11px;color:#8aa0b4;margin-top:4px}
#result{max-height:300px;overflow:auto;background:#0a1628;border-radius:4px;padding:8px;font:12px monospace;white-space:pre-wrap}
</style>
</head>
<body>
<div class="sidebar">
  <h2>DG-IoT Admin</h2>
  <a href="#" class="active" onclick="showSection('overview')">概览</a>
  <a href="#" onclick="showSection('schemas')">Schema</a>
  <a href="#" onclick="showSection('query')">数据查询</a>
  <a href="#" onclick="showSection('users')">用户管理</a>
</div>
<div class="main">
  <div id="overview">
    <h3 style="color:#66d9ff;margin-bottom:16px">系统概览</h3>
    <div class="status" id="stats"></div>
    <div class="card"><h3>表列表</h3><div id="tables"></div></div>
  </div>
  <div id="schemas" style="display:none"><div class="card"><h3>Schema 定义</h3><div id="schema-list"></div></div></div>
  <div id="query" style="display:none">
    <div class="card">
      <h3>数据查询</h3>
      <div class="form-row">
        <select id="q-table"><option>选择表...</option></select>
        <input id="q-where" placeholder='where (JSON, e.g. {"status":"online"})'>
        <button class="btn" onclick="doQuery()">查询</button>
      </div>
      <div id="q-result"></div>
    </div>
  </div>
  <div id="users" style="display:none"><div class="card"><h3>用户管理</h3><div id="user-list"></div></div></div>
</div>
<script>
var tables=[];
async function api(url,opts){let r=await fetch(url,opts);return r.json()}
async function init(){
  let s=await api('/api/stats');
  document.getElementById('stats').innerHTML=
    '<div class="stat"><div class="num">'+s.total_devices+'</div><div class="label">设备</div></div>'+
    '<div class="stat"><div class="num">'+s.online_devices+'</div><div class="label">在线</div></div>'+
    '<div class="stat"><div class="num">'+s.telemetry_rows+'</div><div class="label">遥测记录</div></div>'+
    '<div class="stat"><div class="num">'+s.active_alarms+'</div><div class="label">活跃告警</div></div>';
  let sch=await api('/api/schemas');
  tables=(sch.results||[]).map(r=>r.className);
  document.getElementById('tables').innerHTML=tables.map(t=>
    '<span class="badge badge-info" style="margin:2px;display:inline-block">'+t+'</span>').join('');
  let sel=document.getElementById('q-table');
  tables.forEach(t=>{let o=document.createElement('option');o.value=t;o.textContent=t;sel.appendChild(o)});
  loadSchemas();
  loadUsers();
}
async function loadSchemas(){
  let s=await api('/api/schemas');
  let html='<table><tr><th>ClassName</th><th>Fields</th><th>CLP</th></tr>';
  (s.results||[]).forEach(r=>{
    let fields=Object.keys(r.fields||{}).join(', ')||'-';
    let clp=Object.keys(r.classLevelPermissions||{}).join(', ')||'*';
    html+='<tr><td>'+r.className+'</td><td>'+fields+'</td><td>'+clp+'</td></tr>';
  });
  html+='</table>';
  document.getElementById('schema-list').innerHTML=html;
}
async function loadUsers(){
  let u=await api('/api/auth/users');
  let html='<table><tr><th>Username</th><th>Role</th><th>Enabled</th></tr>';
  (u.users||[]).forEach(r=>{
    html+='<tr><td>'+r.username+'</td><td><span class="badge badge-'+(r.role=='admin'?'warn':'ok')+'">'+r.role+'</span></td><td>'+(r.enabled?'是':'否')+'</td></tr>';
  });
  html+='</table>';
  document.getElementById('user-list').innerHTML=html;
}
async function doQuery(){
  let t=document.getElementById('q-table').value;
  let w=document.getElementById('q-where').value;
  if(!t)return;
  let params='limit=50';
  if(w)try{params+='&where='+encodeURIComponent(w)}catch(e){}
  let d=await api('/api/classes/'+t+'?'+params);
  let rows=d.results||[];
  if(!rows.length){document.getElementById('q-result').innerHTML='<p style="color:#8aa0b4;padding:20px">0 results</p>';return}
  let cols=Object.keys(rows[0]);
  let html='<table><tr>'+cols.map(c=>'<th>'+c+'</th>').join('')+'</tr>';
  rows.forEach(r=>{html+='<tr>'+cols.map(c=>'<td title="'+JSON.stringify(r[c])+'">'+trunc(JSON.stringify(r[c]),60)+'</td>').join('')+'</tr>'});
  html+='</table><p style="color:#8aa0b4;margin-top:8px">'+rows.length+' / '+d.count+' rows</p>';
  document.getElementById('q-result').innerHTML=html;
}
function trunc(s,n){return s&&s.length>n?s.slice(0,n)+'...':s}
function showSection(id){
  document.querySelectorAll('.main>div').forEach(d=>d.style.display='none');
  document.getElementById(id).style.display='block';
  document.querySelectorAll('.sidebar a').forEach(a=>a.classList.remove('active'));
  event.target.classList.add('active');
}
init();
</script>
</body>
</html>"""


@router.get("/admin", response_class=HTMLResponse)
async def admin_panel():
    return HTMLResponse(ADMIN_HTML)


@router.get("/parse/admin", response_class=HTMLResponse)
async def parse_admin():
    """别名: Parse Dashboard 兼容入口"""
    return HTMLResponse(ADMIN_HTML)
