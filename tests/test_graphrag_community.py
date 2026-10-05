"""iotStudio — GraphRAG 社区问答 (Level 2) 回归测试

★ 这个文件的存在理由：
  `ask_community()` 在本目录里**零覆盖**活了很久（`grep -rn ask_community tests/` 曾为空）。
  直到 2026-09-20 手工跑三级检索才发现它**必然抛** `KeyError: 'text_summary'` ——
  而且 `_llm = None`（默认配置）也崩，因为 else 分支读的是同一个键。

根因不是「写错一个字」，是**同名不同源**：
  - `text_summary` 是 `GraphRAG._summarize()`（src/graphrag.py:586）的键
  - `engine.community_summary()` 返回的是 `{level, groups, text}`，从来没有过 text_summary
  ⇒ 两个函数各有一个「摘要文本」，名字被混用了。

同函数的第二处同类缺陷（不抛异常，所以更隐蔽）：
  拼 prompt 时写 `summary.get('stats', summary.get('entities', []))` ——
  两个键都不存在于 community_summary 的返回里 ⇒ **恒为 []**，静默。
"""
from src.graphrag import GraphRAG
from src.ontology import build_engine


def _rag(llm_call=None):
    return GraphRAG(build_engine(), llm_call=llm_call)


class TestCommunitySummaryContract:
    """engine 侧的契约 —— ask_community 读的键必须真的在"""

    def test_required_keys_present(self):
        s = build_engine().community_summary("site")
        for k in ("level", "groups", "text"):
            assert k in s, f"community_summary 缺键 {k}"

    def test_text_summary_is_not_a_key(self):
        """★ 负控：`text_summary` 属于 _summarize()，不属于这里。
        哪天有人「顺手补上」它，说明两处摘要语义又混在一起了 —— 报红。"""
        s = build_engine().community_summary("site")
        assert "text_summary" not in s

    def test_text_is_not_empty(self):
        """★ 判据自检：text 为空会让下面「内容在不在 prompt 里」的断言变成恒真。"""
        s = build_engine().community_summary("site")
        assert s["text"].strip(), "社区摘要为空 —— 下面的 prompt 断言将失去判别力"


class TestAskCommunityNoLlm:
    """无 LLM 走 else 分支 —— 默认配置，崩的就是这条路"""

    def test_does_not_raise(self):
        out = _rag().ask_community("整体态势如何")
        assert out["answer"]

    def test_answer_is_the_summary_text(self):
        """同一个 engine 实例内两次调用，结果须一致（跨 build_engine() 不保证）。"""
        rag = _rag()
        s = rag.engine.community_summary("site")
        out = rag.ask_community("整体态势如何")
        assert out["answer"] == s["text"]

    def test_no_error_key_leaked(self):
        out = _rag().ask_community("整体态势如何")
        assert "error" not in out
        assert out.get("level") == "site"


class TestAskCommunityWithLlm:
    """有 LLM 走 prompt 分支 —— 摘要是拼进 prompt 的，拼错了不崩、只会答空"""

    def test_prompt_carries_real_summary(self):
        """★ 语义侧检查（与键名实现无关）：
        摘要正文必须**原样**出现在送给 LLM 的 prompt 里。
        键名再漂一次 ⇒ 这里要么 KeyError、要么 prompt 里没内容 ⇒ 红。"""
        seen = {}

        def stub(system_prompt, user_prompt):
            seen["user"] = user_prompt
            return "stub-answer"

        rag = _rag(llm_call=stub)
        s = rag.engine.community_summary("site")
        out = rag.ask_community("整体态势如何")

        assert seen.get("user"), "stub 没被调用 —— prompt 分支没走到"
        assert s["text"] in seen["user"], "摘要正文没有进 prompt"
        assert out["answer"] == "stub-answer"

    def test_prompt_statistics_not_silently_empty(self):
        """★ 第二处键名缺陷：原写作 `summary.get('stats', summary.get('entities', []))` ——
        两个键都不存在 ⇒ 恒为 []，而且**不抛异常**，所以没人发现。
        这里断言「详细统计」段里真的有内容，不是占位。"""
        seen = {}

        def stub(system_prompt, user_prompt):
            seen["user"] = user_prompt
            return "ok"

        rag = _rag(llm_call=stub)
        rag.ask_community("整体态势如何")
        user = seen["user"]
        assert "## 详细统计" in user, "prompt 结构变了，这条判据要跟着改"
        stats = user.split("## 详细统计", 1)[1].split("请根据以上摘要", 1)[0].strip()
        assert stats not in ("", "[]"), f"详细统计段是空的/占位: {stats[:40]!r}"

    def test_question_reaches_prompt(self):
        seen = {}

        def stub(system_prompt, user_prompt):
            seen["user"] = user_prompt
            return "ok"

        _rag(llm_call=stub).ask_community("整体态势如何")
        assert "整体态势如何" in seen["user"]
