# vocab/ — 外部参考本体词表（原样 vendor）

这里放的是**别人定的本体**，一个字都不改。它们不是我们写的，也不是文档 ——
**它们是判据的执行者**。

## 为什么仓里要放一份外部的文件

`src/interop.py` 的导出器声称把本地实体映射到 W3C / 工业标准。
「声称」要能被检验，就得有一个**不由我们说了算**的判据来源。

2026-09-16 之前这里没有这份来源，于是三处错都**静默通过**了全部既有检查：

| 我们写的 | 词表里的实际 | 后果 |
|---|---|---|
| `ssn:hostedBy` | **没有这个词**（正确写法是 `sosa:isHostedBy`）| 静默变成一个自造属性 `…/ssn/hostedBy`，不报错、不失效、只是不是 SSN |
| `ssn:forProperty` 接字符串字面量 | 它是 `owl:ObjectProperty`，只能接个体 | OWL 2 DL 语法级错误 —— DL 解析器会拒收整份本体 |
| `ssn:hasSubSystem` 指向 `sosa:Platform` | `ssn:System ⊑ ∀ssn:hasSubSystem.ssn:System` | 推理器反推出一批我们**从未声明**的类型（修前实测 23 个） |

三条都不是「写错一个字母」，而是**没有一个东西知道正确的词长什么样**。
词表进仓之后，`tests/test_ontology_alignment.py` 才拿得到判据：
**映射里出现词表里没有的 term，直接报红。**

> ⚠️ 上表是 **2026-09-16 的修前实测记录**，不是当前状态。
> 当前状态由 `tests/test_ontology_alignment.py` 守 —— 别把这张表当现状读。

## 文件

| 文件 | 来源 | 抓取日 | sha256 |
|---|---|---|---|
| `sosa.ttl` | <https://www.w3.org/ns/sosa/> | 2026-09-16 | `c70b0d1c843c0047e4c98e0a89392e46a05752ff6365bda7f7f55303905a0392` |
| `ssn.ttl`  | <https://www.w3.org/ns/ssn/>  | 2026-09-16 | `184d86189191146e314cc52b1bceb96fca11e70aacbc160d71588102a5153eb9` |

sha256 用 `sha256sum` 复核；不符就是被改过了。

> 表里的值是人读的镜像；机器判据在 `vocab/alignment.json`。

> 本表只列 **vendor** 文件。`alignment.json`（我们的映射声明）与
> `desc_ledger.tsv`（由 `src/ontology.py` 导出图派生的台账）见下节
> 「这里有两类文件：vendor 的，和我们自己的」。

## 许可（再分发依据）

两个文件自己写着（`sosa.ttl:39-41`）：

```
dcterms:rights  "Copyright 2017 W3C/OGC." ;
dcterms:license <http://www.w3.org/Consortium/Legal/2015/copyright-software-and-document> ;
dcterms:license <http://www.opengeospatial.org/ogc/Software> ;
```

W3C Software and Document Notice and License + OGC Software License，
两者都允许再分发，条件是**保留版权与许可声明**。所以：

**这两个文件必须原样保留 —— 不许手改，也不许删掉文件头里的 `dcterms:` 那几行。**
要改就改在别处，然后重新抓一份、重算 sha256、更新 `alignment.json`（上表是人读的镜像，同步过去）。

## 这里有两类文件：vendor 的，和我们自己的

| 类别 | 文件 | 谁说了算 | 判据 |
|---|---|---|---|
| **vendor**（原样，不许改） | `sosa.ttl` · `ssn.ttl` | W3C / OGC | `tests/test_ontology_alignment.py` |
| **我们的声明** | `alignment.json` | 我们 | `tests/test_ontology_alignment.py` |
| **我们的派生件** | `desc_ledger.tsv` | **图**（`src/ontology.py` 的导出图） | `tests/test_ontology_metadata.py` |

`desc_ledger.tsv` 是**生成物，不是手写件**。它载的是 GB/T 48000.3 表A.1 里
OWL 装不下的三项 —— 名称 / 属性集 / 子类。改它请改图再重新派生：

```bash
python scripts/gen_desc_ledger.py            # 重新派生
python scripts/gen_desc_ledger.py --check    # 只比对不写：一致 0 / 漂移 1 / 缺文件 2（以 --help 为准）
```

**手改台账会被判据打回**，因为台账的值由 `rdfs:domain` / `rdfs:subClassOf`
反查、名称取自 IRI 局部名 —— 手改一处，就是让台账与图说两件事。

## 它不证明什么

词表在这里，只证明我们**知道正确的词长什么样**。
它**不**证明我们的映射是对的 —— 那要 `tests/test_ontology_alignment.py` 一条条验。

同理，`alignment.json` 里的每一行也只是**我们的声明**；
它之所以不是「我声称」，是因为判据会把每一行拿去词表里查。
