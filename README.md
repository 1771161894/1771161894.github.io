# Xiao's Homepage

基于 [Jekyll Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) 的个人学术主页与学习档案。

站点计划部署到 <https://xchlab.top>。当前版本保留并迁移了旧知识库中的算法复盘、代码模板与学习资源，同时增加研究方向、项目和个人介绍页面。

## 当前内容

- 个人学术首页：头像、简介、简历概览与主要内容入口
- 研究方向页：`_tabs/research.md`
- 项目页：`_tabs/projects.md`
- 关于页：`_tabs/about.md`
- 文章分类、标签、归档和全文搜索
- 深色与浅色模式
- 50 篇由旧站迁移的 Markdown 文章
- 旧站附件的本地副本

## 在 GitHub 网页端发布文章

1. 打开仓库中的 `_posts` 文件夹。
2. 点击 **Add file → Create new file**。
3. 文件名使用 `年-月-日-英文短标题.md`，例如：

   ```text
   2026-09-20-transformer-reading-notes.md
   ```

4. 复制 `_drafts/post-template.md` 的内容并修改标题、分类、标签和正文。
5. 点击 **Commit changes**。
6. GitHub Actions 会自动构建并发布网站。

最小文章格式：

```markdown
---
title: Transformer 论文阅读笔记
date: 2026-09-20 20:00:00 +0800
categories: [人工智能, 论文阅读]
tags: [Transformer, Attention]
description: 整理 Transformer 的核心结构与个人理解。
math: true
mermaid: false
---

## 问题与背景

正文写在这里。
```

### 上传图片和附件

在 GitHub 网页端进入相应目录，使用 **Add file → Upload files**：

- 文章图片：`assets/img/posts/`
- PDF、代码压缩包等附件：`assets/files/`

Markdown 中引用：

```markdown
![实验结果](/assets/img/posts/experiment-result.png)

[下载实验报告](/assets/files/report.pdf)
```

## 修改站点信息

| 内容 | 文件 |
|---|---|
| 姓名、站点标题、邮箱、域名 | `_config.yml` |
| 首页姓名、简介、教育和经历 | `_data/profile.yml` |
| 研究方向 | `_tabs/research.md` |
| 项目经历 | `_tabs/projects.md` |
| 个人介绍、教育经历、联系方式 | `_tabs/about.md` |
| 头像 | `_config.yml` 中的 `avatar` |

GitHub 用户名当前配置为 `1771161894`。文章页提供“在 GitHub 中编辑”入口，登录后可以直接通过网页修改 Markdown。

## 分类建议

```text
人工智能
├── 基础知识
├── 论文阅读
├── 模型复现
└── 实验记录

科研成长
├── 科研方法
├── 每周总结
└── 想法与问题

计算机基础
├── 算法
├── 数据结构
└── 编程语言

工具箱
├── 代码模板
└── 学习资源
```

分类使用两级结构，例如：

```yaml
categories: [人工智能, 论文阅读]
```

标签可以添加多个：

```yaml
tags: [Transformer, Attention, 论文精读]
```

## GitHub Pages 首次配置

1. 在 `1771161894` 账号下创建空仓库 `1771161894.github.io`，然后将本项目推送到该仓库。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **GitHub Actions**。
4. 推送到 `main` 分支后，`.github/workflows/pages-deploy.yml` 会自动构建。
5. 在 Pages 设置中绑定 `xchlab.top`。确认新站正常后，再调整域名 DNS，避免旧站提前中断。

仓库尚未绑定到个人 GitHub 远程地址。绑定前不要直接向 Chirpy 官方 starter 仓库推送。

## 本地预览

Chirpy 需要 Ruby、Bundler 和 Jekyll。本机当前没有 Ruby，因此没有修改主机环境；构建将首先通过 GitHub Actions 验证。

具备 Ruby 环境后可运行：

```bash
bundle install
bundle exec jekyll serve
```

然后访问 <http://127.0.0.1:4000>。

## 旧站迁移

迁移脚本位于 `tools/migrate-legacy-content.mjs`。它从旧站只读 API 获取内容，生成 `_posts` 下的 Markdown，并下载附件：

```powershell
node tools\migrate-legacy-content.mjs
```

脚本按固定文件名覆盖同一批迁移文章，不会删除手工新增的文章。

## 版权

站点工程继承 Chirpy Starter 的 MIT License。文章、图片和个人内容的版权归站点作者所有。
