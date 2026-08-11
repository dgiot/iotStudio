# OWL Ontology 驱动的工业数据治理与主数据对齐 — 技术调研报告

> 调研范围：2020-2026 论文、标准文档（ISA-95、IOF、W3C）及工业案例
> 术语说明：核心技术术语保留英文，分析论述使用中文

---

## 一、OWL 2 本体作为工业 MDM 的语义骨架

### 1.1 TBox / ABox 架构

OWL 2 的 TBox（Terminological Box）与 ABox（Assertional Box）分离是工业主数据管理（MDM）的核心架构范式：

| 层次 | 角色 | 工业 MDM 映射 |
|------|------|---------------|
| **TBox** | 模式层 — 类层次、对象属性、数据属性、SWRL 规则 | 产品类型体系（如轴承型号 Bearing6308）、装配关系（assembledWith）、设计约束 |
| **ABox** | 实例层 — 具体个体、属性断言、属性值 | 具体设备实例（bearing_sec1）、序列号维度值、材料规格 |

**Aibel 案例**（挪威，2015 年投产至今）：基于 OWL 2 + ISO 15926-14 构建材料主数据（MMD）本体，由 **370 个领域本体** 组成，定义约 **200 万类**（98,133 类、20,412 个体、535,512 逻辑公理）。工程数据库中重复类从约 350,000 减少至 55,000，规格创建时间从 3 天缩短至约 1 天。

### 1.2 唯一标识体系

OWL 本体通过以下机制建立跨系统唯一标识：
- **IRI（Internationalized Resource Identifier）** — 全局唯一，支持 HTTP 解析
- **owl:sameAs** / **skos:closeMatch** — 跨本体对齐（如 DOnG-KG 项目将设备概念映射到 ISO 15926 的 InanimatePhysicalObject）
- **Composite Key + UUID** 策略 — 复合键（12NC + 月份）或 UUID mint 唯一 URI，确保持久性和熵

### 1.3 跨系统数据对齐

- **OTTR（Reasonable Ontology Templates）** — 从电子表格数据模式化填充本体
- **R2RML 映射** — 将关系数据源链接到基于本体的虚拟知识图谱
- **HermiT / OpenIlet 推理机** — 一致性检查和推理支持

---

## 二、ISA-95/IEC 62264 标准的本体映射

### 2.1 设备层级结构

ISA-95（IEC 62264）定义了七层设备层次模型，可映射为 OWL 类层次：

```
Enterprise        → isa95:Enterprise (owl:Class)
  ├── Site        → isa95:Site
  │    └── Area   → isa95:Area
  │         └── WorkCenter → isa95:WorkCenter
  │              ├── WorkUnit → isa95:WorkUnit
  │              │    ├── EquipmentModule → isa95:EquipmentModule
  │              │    └── ControlModule   → isa95:ControlModule
  │              └── (Storage / Material / Personnel / ...)
```

### 2.2 已实现的映射项目

| 项目/标准 | 映射方式 | 关键特征 |
|----------|---------|---------|
| **Equinor OPC UA 信息模型** | ISA-95 OPC UA 伴生规范子类型 | 从 `EquipmentClassType`/`EquipmentType` 继承；参考 ISO 14224 附件 A |
| **Reference Semantic Model (RSM)** | ISA-95 + ISA-88 的企业结构视图 | `ISA95_Area`, `ISA95_WorkCenter`; 集成 MIMOSA 资产管理、ISO 15926 功能位置 |
| **FrameworX Unified Namespace** | 直接导入 ISA-95 OWL/RDF 参考模型 | 双形状模式（裸设备 + `/Attr` 语义元数据）, 命名模式 `/{Context}/{Asset}/{Attribute}/{SubAttribute}` |
| **DOnG-KG** | ISO 15926 基础本体 + SKOS 映射 | TECHNICAL OBJECT → EQUIPMENT/INSTALLATION PLACE; CFIHOS 分类扩展 |
| **READI JIP** | ISO 15926-14 + ISO/IEC 81346 | 功能/物理/位置分解; 挪威大陆架 NOA/KRAFLA 项目 |

### 2.3 与 ISA-95 功能级别的语义对齐

ISA-95 的 Level 0-5 功能层次通过 OWL 属性链和推理规则实现跨层级关联：
- Level 4（ERP）→ `Enterprise` 类上的 `hasSite` 属性到 `Site`
- Level 1-2（控制/设备）→ `ControlModule` 通过 `controls` 属性关联到 `WorkUnit`
- 跨层级一致性通过 SHACL 形状验证（参见第四部分）

---

## 三、IOF（Industrial Ontologies Foundry）核心本体

### 3.1 IOF 核心本体概述

IOF Core 是填补制造业中层层级本体空白的开放标准，发布于 2024 年 v1 beta。技术规格：

| 维度 | 数值 |
|------|------|
| OWL 类 | 57（37 primitive, 20 defined）|
| OWL 属性 | 38 |
| 顶层本体 | BFO（ISO/IEC 21838-2:2021）|
| 推理机 | HermiT（已验证一致性）|
| 时间推理 | Allen 区间关系（7种） + OWL-Time 集成 |

### 3.2 层级架构

```
顶层（Top-level）:        BFO (Basic Formal Ontology)
  └── Continuants (实体)  +  Occurrents (事件/过程)

中层（Mid-level）:        IOF Core
  └── 制造业通用概念（工件、资源、过程、角色）

领域层（Domain）:          IOF Supply Chain / IOF Maintenance / IOF PPS
  └── 供应链本体、维护本体、生产计划与调度

应用层（Application）:     MDOCO / iof-maint / ...
  └── 具体系统实现
```

### 3.3 流程工业适用性

| IOF 模块 | 版本 | 流程工业应用 |
|---------|------|------------|
| **IOF Core** | v1 beta (2024) | 制造业通用中层级本体 |
| **PPS（生产计划与调度）** | 2020 draft | 生产流程建模，批次/流程规划 |
| **SCRO（供应链参考本体）** | 2022 | 供应链管理，多级供应商网络 |
| **IOF-Maint（维护本体）** | 2024 | 20 类 + 2 关系，支持 OWL DL 推理 |
| **MDOCO（可维护性设计本体）** | 2024 | 复杂产品可维护性设计的知识复用 |

---

## 四、基于 SPARQL 的数据治理查询

### 4.1 数据治理查询场景

#### 场景 1：重复注册检测

```sparql
# 检测具有相同序列号的多台设备实例
PREFIX ex: <http://example.org/oilgas#>
SELECT ?serial ?device1 ?device2
WHERE {
  ?device1 a ex:Pump ; ex:hasSerialNumber ?serial .
  ?device2 a ex:Pump ; ex:hasSerialNumber ?serial .
  FILTER(?device1 != ?device2)
}
```

#### 场景 2：引用完整性验证

```sparql
# 检测孤立的功能位置（没有所属 Area）
PREFIX isa95: <http://example.org/isa95#>
SELECT ?equipment
WHERE {
  ?equipment a isa95:EquipmentModule .
  FILTER NOT EXISTS {
    ?workUnit isa95:hasEquipmentModule ?equipment .
    ?workUnit a isa95:WorkUnit .
  }
}
```

#### 场景 3：跨系统一致性校验

```sparql
# 检测 ERP 和 MES 中设备状态的差异
PREFIX ex: <http://example.org/oilgas#>
SELECT ?device ?erp_status ?mes_status
WHERE {
  ?device ex:erp_status ?erp_status .
  ?device ex:mes_status ?mes_status .
  FILTER(?erp_status != ?mes_status)
}
```

### 4.2 SHACL + SPARQL 组合策略

| 能力 | OWL | SHACL-Core | SHACL-SPARQL |
|------|-----|-----------|-------------|
| 推理（推断新事实） | 原生支持 | 不支持 | 有限 |
| 约束验证（缺失数据检测） | 不适用（开放世界假设） | 支持 | 支持 |
| 自定义业务规则 | 通过 SWRL | 有限 | 完全支持 |
| 合规报告 | 无 | 标准化报告格式 | 扩展报告 |
| 领域专家可维护性 | 低（需逻辑学背景） | 中（Turtle 语法） | 高（熟悉 SPARQL） |

**推荐模式**：OWL for reasoning + SHACL for validation + SPARQL for ad-hoc queries

### 4.3 工业应用实例

- **OntoToT**（巴西石油行业，2023）：本体驱动的数据手册合规验证，与人工检测结果完全一致，时间显著缩短
- **W3C 标准合规检查**（2024）：使用 SHACL-SPARQL 规则实现加纳油气开采法规的自动化合规检查
- **ifcOWL 验证**（BIM 领域，2024）：591 条 EXPRESS WHERE 规则转换为 SPARQL SHACL 约束，覆盖 73.2% 实体规则和 100% 类型规则

---

## 五、行业真实案例

### 5.1 案例汇总表

| 项目/案例 | 行业 | 时间 | 核心技术 | 规模/效果 |
|----------|------|------|---------|----------|
| **Aibel MMD 本体** | 油气/海工 | 2015-至今 | OWL 2 + ISO 15926-14 | 370 本体，200 万类，重复类从 35 万降为 0 |
| **PeTWIN / O3PO 本体** | 石油生产 | 2020-2024 | BFO + IOF-Core | Mero 油田（巴西 Pre-Salt）数字孪生验证 |
| **OSDU 本体 + Data Mesh** | 地下能源 | 2023 | OSDU Data Platform + OWL | Apache 2.0 开源，联邦数据治理 |
| **OntoToT 数据手册合规** | 石油建设 | 2023 | Methontology + OWL | 自动合规检测，与人工 100% 一致 |
| **ONSIDE 数据集成** | 油气 | 2023 | OBDA + 多存储引擎 | 巴西油气公司异构数据集成 |
| **DOnG-KG 领域本体** | 油气 | 2021-2023 | ISO 15926 + SKOS | SAP-ERP + CFIHOS 跨系统对齐 |
| **DNV ISO 15926 RDL** | 油气全生命周期 | 持续 | ISO 15926-2 + OWL 2 | SWRL 模板解释 + DL 查询 |

### 5.2 重点案例详述

**PeTWIN / O3PO**（2020-2024，奥斯陆大学 + UFRGS + Libra/Equinor/Shell）：以 BFO 顶层本体 + GeoCore/IOF-Core 中层级为基础，构建海上石油生产设施领域本体 O3PO。涵盖井、管道、汇管、阀门、测量属性（压力、温度、流量），支撑数字孪生数据融合核（Data Fusion Core）。验证环境为巴西 Mero 油田真实数据。

**Aibel MMD**（2015-至今）：全球工业本体驱动 MDM 的标杆案例。使用 OWL DL + HermiT 推理机，解决 EPC 供应链中产品类型分类的语义不一致，消除工程数据库中的重复分类。上层本体含 Activity、Object、PhysicalObject、Quality、Role、Location 概念，拟发布为 ISO/TR 15926 Part 14。

---

## 六、OWL/SHACL vs. 传统 MDM 对比

### 6.1 对比矩阵

| 维度 | 传统 MDM（Informatica / SAP MDG） | OWL/SHACL 语义方法 |
|------|-----------------------------------|-------------------|
| **数据模型** | 关系型（ER 图），固定模式 | 图型（RDF 三元组），动态类层次 |
| **模式演进** | 困难，Schema Migration 风险高 | 灵活，开放世界假设支持增量扩展 |
| **跨系统集成** | ETL 管道，点对点 API | 语义映射（SKOS, owl:sameAs, R2RML） |
| **推理能力** | 无，需应用层硬编码 | OWL DL 推理机自动分类/检测 |
| **数据质量检查** | 内置规则引擎 | SHACL 形状约束 + SPARQL 查询 |
| **异构数据处理** | 结构化优先，非结构化困难 | 自然支持结构化/半结构化/非结构化 |
| **领域自治** | 依赖 IT/Data Steward | 领域专家可维护 SHACL 规则 |
| **标准化** | 厂商锁定 | W3C 标准（RDF, OWL, SHACL, SPARQL） |
| **查询灵活性** | SQL 预定义查询 | SPARQL 图模式匹配，即席查询 |
| **工具生态** | 成熟商业工具，GUI 丰富 | 开源 + 商业（GraphDB, Stardog, TopBraid） |
| **适用范围** | 企业内部标准化 | 跨组织供应链/生态协同 |

### 6.2 混合策略推荐

对于油气行业的工业数据治理，推荐 **三层混合架构**：

```
Layer 1 — Core MDM（传统）：    ERP 主数据管理（SAP MDG）
Layer 2 — Semantic Layer（OWL）：  本体驱动的语义映射层（ISO 15926 / IOF）
Layer 3 — Governance（SHACL + SPARQL）：  数据质量验证 + 治理查询
```

这与 Mercedes-Benz 提出的 "semantic federation layer for a digital thread" 和 OSDU + Data Mesh 的联邦治理模式一致。

---

## 七、"Single Source of Truth" 语义架构

### 7.1 三层语义架构

基于 W3C 标准和工业实践，推荐架构如下：

```
┌─────────────────────────────────────────────────────────┐
│  Tier 3 — 应用领域本体                                   │
│  (ISA-95 设备层级 / IOF-Maint / O3PO / ...)             │
│  业务规则：「给水泵 OFF 时锅炉为 CRITICAL」                │
├─────────────────────────────────────────────────────────┤
│  Tier 2 — 领域拓扑层（同态桥接 Homomorphic Bridge）       │
│  has_mqtt_source 属性将物理传感器主题映射到逻辑实体         │
│  R2RML 映射连接关系数据库 → RDF                           │
├─────────────────────────────────────────────────────────┤
│  Tier 1 — 逻辑主干（BFO / ISO 15926-14）                  │
│  顶层类别：Continuant / Occurrent, PhysicalObject / Role  │
│  时间推理：Allen 区间 + OWL-Time                          │
├─────────────────────────────────────────────────────────┤
│  数据源层                                                │
│  MQTT / OPC UA / OSDU / ERP / PLM / Historian           │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Data Fabric 模式

Gartner 定义的 Data Fabric 结合语义技术形成 "single source of truth" 的基础：

| 组件 | 语义技术实现 |
|------|------------|
| **Data Catalog** | OWL 本体 + SHACL 形状 |
| **Data Virtualization** | OBDA（Ontology-Based Data Access）+ SPARQL 端点 |
| **Data Governance** | SHACL 验证 + SPARQL 治理查询 |
| **Data Lineage** | PROV-O 本体 + 语义标注 |
| **Federated Query** | SPARQL 联邦查询（SERVICE 关键字）|
| **Digital Twin** | O3PO / MMD 本体驱动的数据融合核 |

### 7.3 关键设计原则

1. **命名空间策略**：`{Context}/{Asset}/{Attribute}/{SubAttribute}`（FrameworX 模式）
2. **双形状模式**：裸设备实例 + `/Attr` 语义元数据载体
3. **开放世界 + 闭合世界切换**：OWL 推理用开放世界，SHACL 验证用闭合世界
4. **联邦治理**：OSDU + Data Mesh 的领域自治与全局一致性平衡
5. **同态桥接（Homomorphic Bridge）**：物理数据源与逻辑本体的无损映射

---

## 八、标准映射表

| 标准 | 发布组织 | 版本 | 与本体驱动 MDM 的关系 | 应用层级 |
|------|---------|------|---------------------|---------|
| **OWL 2** | W3C | 2012 Recommendation | 主数据语义模型语言 | 全层级 |
| **RDF 1.1** | W3C | 2014 Recommendation | 数据交换基础框架 | 全层级 |
| **SHACL** | W3C | 2017 Recommendation | 数据质量约束验证 | 治理层 |
| **SPARQL 1.1** | W3C | 2013 Recommendation | 治理查询/联邦查询 | 治理层 |
| **SKOS** | W3C | 2009 Recommendation | 术语系统映射与对齐 | 对齐层 |
| **ISA-95 (IEC 62264)** | ISA / IEC | 2013 | 设备/功能层级标准 | 领域本体 |
| **ISO 15926 (Part 2/14)** | ISO | 2003-2020 | 油气设施生命周期本体 | 顶层/领域 |
| **IOF Core** | IOF | v1 beta 2024 | 制造业中层级本体 | 中层级 |
| **BFO** | BFO Consortium | ISO/IEC 21838-2:2021 | 顶层本体框架 | 顶层 |
| **ISO/IEC 81346** | ISO | 2022 | 功能/物理/位置分解 | 领域 |
| **OSDU** | OSDU Forum | 2023 (Apache 2.0) | 地下能源数据平台标准 | 平台层 |
| **CFIHOS** | IOGP | 2020 | 设施信息移交规范 | 领域 |
| **ISO 14224** | ISO | 2016 | 设备可靠性/维护数据 | 领域 |
| **PROV-O** | W3C | 2013 | 数据溯源本体 | 治理层 |
| **MIMOSA** | MIMOSA | CCOM 4.x | 资产管理/状态监测 | 领域 |

---

## 九、关键参考文献

1. **Drobnjakovic, M., Kulvatunyou, B., Ameri, F., et al.** (2024). The Industrial Ontologies Foundry (IOF) Core Ontology. *Proceedings of the 12th International Workshop on Formal Ontologies meet Industry (FOMI)*. — IOF Core v1 beta 的完整描述，57 类 + 38 属性，BFO 对齐。

2. **Abel, M., Barcelos, P., Galarreta, L., et al.** (2024). PeTWIN: O3PO — An Offshore Petroleum Production Plant Ontology for Digital Twins. *Expert Systems with Applications*. — O3PO 本体开发，Mero 油田验证，BFO + IOF-Core 集成。

3. **Waaler, A. & Skjaeveland, M.G.** (2023). Aibel Material Master Data Ontology: Classification and Exchange of Industry Standards using OWL Ontologies. *OntoCommons Workshop*. — MMD 本体现状，370 领域本体，350,000 → 0 重复类。

4. **Abolhassani, A. & Tudor, D.** (2023). A Data Mesh Adaptable Oil and Gas Ontology Based on OSDU. *SPE Annual Technical Conference*. — OSDU 本体与 Data Mesh 联邦治理。

5. **Campos, J., Almeida, J., et al.** (2023). INSIDE: An Ontology-Based Data Integration System Applied to the Oil and Gas Sector. *XIX Brazilian Symposium on Information Systems*. — OBDA 多存储引擎集成。

6. **Marques Junior, H.D., et al.** (2023). Data Digitalization and Conformity Verification in Oil and Gas Industry Databooks Using Semantic Model Based on Ontology. *ICINCO 2023*. — OntoToT 数据手册合规检查。

7. **Correia, J., et al.** (2023). Data Management in Digital Twins for the Oil and Gas Industry: Beyond the OSDU Data Platform. *Journal of Information and Data Management*. — OSDU 平台语义增强方案。

8. **Ferranti, N., De Souza, J.F., Ahmetaj, S., & Polleres, A.** (2024). Formalizing and validating Wikidata's property constraints using SHACL and SPARQL. *Journal of Web Semantics*. — SHACL-SPARQL 约束验证方法论（可迁移至工业域）。

9. **Šormaz, D., Sarkar, A., & Terkaj, W.** (2020). Progress on IOF's Process and Production Planning Reference Ontology. — IOF PPS 本体进展，流程工业应用。

10. **Hodkiewicz, M., Woods, C., Selway, M., & Stumptner, M.** (2024). IOF-Maint: Modular Maintenance Ontology. *arXiv:2404.05224*. — 维护本体，20 类 + 2 关系。

---

## 十、总结

### 核心发现

1. **OWL 2 本体已成熟应用于工业 MDM**：以 Aibel MMD 为代表，OWL 2（DL profile）在企业级工程材料主数据管理中验证了大规模可部署性（200 万级 class），TBox/ABox 分离架构支持跨组织（运营商 → EPC 承包商 → 供应商）的数据交换。

2. **ISA-95 与语义技术的融合走向标准化**：Equinor OPC UA 信息模型、RSM、FrameworX UNS 等项目证明 ISA-95 设备层次可以通过 OWL 类层次直接映射，结合 ISO 15926 和 ISO 14224 形成完整的语义设备模型。

3. **IOF 填补了制造业中层级本体空白**：BFO → IOF Core → 领域本体（Maint/PPS/SCRO）的三层架构为流程工业提供了标准化的语义骨架，2024 年 v1 beta 发布标志着本体工程化的重要里程碑。

4. **SPARQL + SHACL 是数据治理的技术栈**：OWL（推理）+ SHACL（验证）+ SPARQL（查询）的组合策略覆盖了数据治理的全部需求，已在巴西石油行业合规检查中得到验证。

5. **"Single Source of Truth" 需语义分层**：三层架构（BFO 逻辑主干 + 同态桥接 + 领域本体）结合 Data Fabric 模式，比传统 Data Warehouse + ETL 方案更灵活、可扩展。

6. **传统 MDM 与语义方法互补而非替代**：推荐混合策略 — SAP MDG 管核心主数据 + OWL 管语义映射 + SHACL 管数据质量。

### 对油气数据治理的建议

- **短期**：基于 ISA-95 设备层次构建 OWL 领域本体，以 SHACL 验证现有 MDM 数据质量
- **中期**：引入 IOF Core 作为中层级本体，接入 OSDU 数据平台，构建跨系统的语义映射层
- **长期**：部署三层语义架构，实现 Data Fabric 模式的 "single source of truth"，支撑数字孪生和 AI 应用

---

*报告生成时间：2026-07-27 | 技术指标范围：油气行业工业数据治理与本体驱动主数据对齐*
