# 外部驱动插件配方（新增协议 = 装插件）

引擎只认契约不认实现。协议驱动以 setuptools entry_points 声明：

```toml
[project.entry-points."iotstudio.drivers"]
my_protocol = "my_pkg:MyDriver"   # MyDriver 必须是 BaseProtocolAdapter 子类
```

```bash
pip install ./my-driver-pkg      # 装插件
python run.py                    # 引擎启动时 discover_entry_points 自动发现
```

契约（src/protocols/base.py）：`connect / disconnect / read_points /
write_point / health_check`。注册时类立即校验，字符串类名在使用时
严格校验——违规一律响亮报错，绝不静默降级。

本目录的 `demo_sim` 即最小可用样例（无硬件正弦信号驱动）。
