# Xiao's Homepage

基于 [al-folio](https://github.com/alshedivat/al-folio) 的个人主页，用于整理研究、项目、履历和学习笔记。

## 网页端修改

- 首页：`_pages/about.md`
- 研究：`_pages/research.md`
- 项目：`_pages/projects.md`
- 简历：`_data/cv.yml`
- 联系方式：`_data/socials.yml`
- 笔记：`_posts/`
- 头像：`assets/img/profile.png`

在 GitHub 中打开对应文件，点击编辑按钮并提交到 `main` 分支后，GitHub Actions 会自动重新发布。

## 本地预览

```bash
bundle install
npm ci
bundle exec jekyll serve
```

预览地址默认为 `http://127.0.0.1:4000/`。
