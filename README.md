# online-docs

一个使用 [Docsify](https://docsify.js.org/) 搭建的**零构建**文档站。无需打包、无需编译，直接把 Markdown 写进 `docs/` 目录即可在线浏览。

## 发布方式

本项目通过 **GitHub Pages** 发布：在仓库设置中选择从 `main` 分支的 `/docs` 目录发布，即可自动上线。

## 目录结构

```
online-docs/
├── docs/                 # 文档站根目录（GitHub Pages 发布源）
│   ├── index.html        # Docsify 加载器（CDN 引入，零构建）
│   ├── .nojekyll         # 禁用 Jekyll，保证 _sidebar.md 等下划线文件生效
│   ├── README.md         # 站点首页
│   └── _sidebar.md       # 左侧导航（由脚本生成）
├── scripts/
│   └── gen-sidebar.mjs   # 扫描 docs/ 自动生成 _sidebar.md
└── README.md             # 仓库说明（本文件）
```

## 本地预览

任选其一：

```bash
npx serve docs
```

或使用 docsify-cli：

```bash
docsify serve docs
```

启动后在浏览器打开提示的本地地址即可预览。
