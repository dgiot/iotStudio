#!/usr/bin/env python3
"""
生成油田作业区场站本体 — ECharts 力导图 HTML
"""

import json
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# 加载数据
with open('force_graph_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

nodes_json = json.dumps(data['nodes'], ensure_ascii=False)
links_json = json.dumps(data['links'], ensure_ascii=False)
categories_json = json.dumps(data['categories'], ensure_ascii=False)

html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>油田作业区场站 DLAS 本体 — 力导图</title>
<script src="https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.min.js"></script>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
    background: #0a0e27;
    color: #e0e0e0;
    overflow: hidden;
  }}
  #chart {{
    width: 100vw;
    height: 100vh;
  }}
  #legend-panel {{
    position: fixed;
    top: 16px;
    left: 16px;
    background: rgba(10,14,39,0.92);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    padding: 14px 18px;
    z-index: 10;
    font-size: 13px;
    max-height: 80vh;
    overflow-y: auto;
    backdrop-filter: blur(10px);
  }}
  #legend-panel h3 {{
    margin: 0 0 10px 0;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    padding-bottom: 8px;
  }}
  #legend-panel .item {{
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 5px 0;
    cursor: pointer;
    padding: 3px 6px;
    border-radius: 4px;
    transition: background 0.2s;
  }}
  #legend-panel .item:hover {{ background: rgba(255,255,255,0.08); }}
  #legend-panel .dot {{
    width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
  }}
  #info-panel {{
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: rgba(10,14,39,0.92);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    padding: 12px 16px;
    z-index: 10;
    font-size: 12px;
    color: #888;
    backdrop-filter: blur(10px);
  }}
  #tooltip {{
    position: fixed;
    top: 16px;
    right: 16px;
    background: rgba(10,14,39,0.95);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 10px;
    padding: 16px 20px;
    z-index: 20;
    font-size: 13px;
    max-width: 300px;
    display: none;
    backdrop-filter: blur(10px);
    line-height: 1.7;
  }}
  #tooltip .name {{ font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px; }}
  #tooltip .cat {{ color: #aaa; font-size: 12px; }}
</style>
</head>
<body>

<div id="legend-panel">
  <h3>DLAS 本体 · 力导图</h3>
  <div class="item" data-cat="场站"><span class="dot" style="background:#e74c3c"></span>场站</div>
  <div class="item" data-cat="服务器"><span class="dot" style="background:#3498db"></span>服务器</div>
  <div class="item" data-cat="进程"><span class="dot" style="background:#2ecc71"></span>进程</div>
  <div class="item" data-cat="协议"><span class="dot" style="background:#9b59b6"></span>协议</div>
  <div class="item" data-cat="设备"><span class="dot" style="background:#f39c12"></span>设备</div>
  <div class="item" data-cat="DCS"><span class="dot" style="background:#1abc9c"></span>DCS</div>
  <div class="item" data-cat="配置"><span class="dot" style="background:#95a5a6"></span>配置</div>
  <div class="item" data-cat="校验"><span class="dot" style="background:#e67e22"></span>校验</div>
  <div class="item" data-cat="约束"><span class="dot" style="background:#c0392b"></span>约束</div>
  <div class="item" data-cat="数据流"><span class="dot" style="background:#16a085"></span>数据流</div>
  <div class="item" data-cat="安全"><span class="dot" style="background:#8e44ad"></span>安全</div>
  <div class="item" data-cat="链路"><span class="dot" style="background:#2c3e50"></span>链路</div>
</div>

<div id="tooltip"></div>
<div id="info-panel">
  节点: {len(data['nodes'])} · 关系: {len(data['links'])}<br>
  拖拽移动 · 滚轮缩放 · 点击高亮
</div>
<div id="chart"></div>

<script>
const DATA = {{ nodes: {nodes_json}, links: {links_json}, categories: {categories_json} }};

const chart = echarts.init(document.getElementById('chart'));

// 为每个 link 加 label 显示
DATA.links.forEach(l => {{
  if (l.label) l.label = {{ show: true, formatter: l.label, fontSize: 10, color: '#aaa' }};
}});

// 为每个 node 加 tooltip
DATA.nodes.forEach(n => {{
  n.tooltip = {{ formatter: `<b>${{n.name}}</b><br/>分类: ${{n.category}}` }};
}});

const option = {{
  backgroundColor: '#0a0e27',
  tooltip: {{
    trigger: 'item',
    formatter: p => p.dataType === 'node'
      ? `<b>${{p.name}}</b><br/>分类: ${{p.data.category}}`
      : `${{p.data.source}} → ${{p.data.target}}<br/>${{p.data.label || ''}}`
  }},
  legend: {{ show: false }},
  series: [{{
    type: 'graph',
    layout: 'force',
    data: DATA.nodes,
    links: DATA.links,
    categories: DATA.categories,
    roam: true,
    draggable: true,
    force: {{
      repulsion: 800,
      gravity: 0.1,
      edgeLength: [120, 280],
      layoutAnimation: true,
      friction: 0.6
    }},
    emphasis: {{
      focus: 'adjacency',
      lineStyle: {{ width: 8, color: '#fff' }},
      itemStyle: {{ shadowBlur: 20, shadowColor: 'rgba(255,255,255,0.8)' }}
    }},
    blur: {{
      itemStyle: {{ opacity: 0.2 }},
      lineStyle: {{ opacity: 0.05 }}
    }},
    label: {{
      show: true,
      position: 'right',
      fontSize: 11,
      color: '#ccc',
      formatter: p => p.name.length > 15 ? p.name.slice(0,14)+'...' : p.name
    }},
    edgeLabel: {{
      show: true,
      fontSize: 9,
      color: '#666',
      formatter: p => p.data.label || ''
    }},
    lineStyle: {{
      color: 'source',
      curveness: 0.25,
      opacity: 0.4,
      width: 1.5
    }},
    itemStyle: {{
      borderColor: 'rgba(255,255,255,0.3)',
      borderWidth: 1,
      shadowBlur: 8,
      shadowColor: 'rgba(0,0,0,0.5)'
    }},
    scaleLimit: {{ min: 0.3, max: 5 }},
    animation: true,
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut'
  }}]
}};

chart.setOption(option);

// 点击节点高亮关联
chart.on('click', function(params) {{
  if (params.dataType === 'node') {{
    // 找到所有关联 link
    const name = params.name;
    const neighbors = new Set([name]);
    DATA.links.forEach(l => {{
      if (l.source === name) neighbors.add(l.target);
      if (l.target === name) neighbors.add(l.source);
    }});

    DATA.nodes.forEach(n => {{
      n.itemStyle = neighbors.has(n.name)
        ? {{ opacity: 1 }}
        : {{ opacity: 0.15 }};
    }});
    DATA.links.forEach(l => {{
      l.lineStyle = (l.source === name || l.target === name)
        ? {{ opacity: 0.9, width: 3 }}
        : {{ opacity: 0.03, width: 0.5 }};
    }});

    chart.setOption({{
      series: [{{
        data: DATA.nodes,
        links: DATA.links
      }}]
    }});
  }}
}});

// 双击恢复
chart.on('dblclick', function() {{
  DATA.nodes.forEach(n => {{ delete n.itemStyle; }});
  DATA.links.forEach(l => {{ delete l.lineStyle; }});
  chart.setOption({{
    series: [{{
      data: DATA.nodes,
      links: DATA.links
    }}]
  }});
}});

// 响应式
window.addEventListener('resize', () => chart.resize());
</script>
</body>
</html>
'''

output_path = 'oilfield_ontology_force_graph.html'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"[OK] 力导图已生成: {output_path}")
print(f"     节点={len(data['nodes'])}  连线={len(data['links'])}  分类={len(data['categories'])}")
print(f"     文件大小: {len(html):,} bytes")
print(f"     打开方式: 浏览器直接打开 {output_path}")
