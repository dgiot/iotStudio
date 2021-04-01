module.exports = {
  types: [
    { value: 'docs', name: 'docs: 文档修改' },
    { value: 'feat', name: 'feat: 新功能' },
    { value: 'fix', name: 'fix: 修复bug' },
    { value: 'style', name: 'style: 代码格式（空格、分号等）' },
    { value: 'refactor', name: 'refactor: 重构（非feat、非fix）' },
    { value: 'perf', name: 'perf: 提高性能' },
    { value: 'test', name: 'test: 添加缺少的测试' },
    { value: 'chore', name: 'chore: 杂务（对生成过程或辅助工具和库（如文档生成）的更改）' },
    { value: 'revert', name: 'revert: 还原到提交' },
    { value: 'WIP', name: 'WIP: 进行中的工作' },
    { value: 'workflow', name: 'workflow: 工作流相关文件修改' },
    { value: 'build', name: 'build: 构建过程或辅助工具的变动' },
    { value: 'ci', name: 'ci: 修改项目持续集成流程' },
    { value: 'release', name: 'release: 发布新版本' }
  ],

  scopes: [
    { name: '不归类' },
    { name: 'route' },
    { name: 'component' },
    { name: 'utils' },
    { name: 'build' },
    { name: 'docs' },
    { name: 'test' },
    { name: 'view' }
  ], // 修改范围

  messages: {
    type: "请选择【修改的性质】：",
    scope: '请选择【修改的范围】：',
    subject: '请输入简明的【修改的描述】：',
    confirmCommit: '确认提交吗？',
  }, // 选择器提示信息

  allowCustomScopes: false,
  allowBreakingChanges: [],
  skipQuestions: ['body', 'footer'],

  subjectLimit: 100 // 描述的长度限制  
};
