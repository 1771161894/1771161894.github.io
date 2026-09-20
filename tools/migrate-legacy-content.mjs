import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const sourceOrigin = process.env.LEGACY_SITE_ORIGIN || "https://xchlab.top";
const root = path.resolve(import.meta.dirname, "..");
const postsDirectory = path.join(root, "_posts");
const filesDirectory = path.join(root, "assets", "files", "legacy");

const categoryMap = {
  problem: ["计算机基础", "算法"],
  template: ["工具箱", "代码模板"],
  resource: ["工具箱", "学习资源"],
};

function yamlString(value = "") {
  return JSON.stringify(String(value));
}

function yamlList(values = []) {
  return `[${values.map((value) => yamlString(value)).join(", ")}]`;
}

function dateParts(value) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) throw new Error(`Invalid date: ${value}`);
  return {
    fileDate: date.toISOString().slice(0, 10),
    frontMatterDate: date.toISOString().replace("T", " ").replace("Z", " +0000"),
  };
}

function safeLanguage(value = "") {
  return String(value).trim().replace(/[^a-zA-Z0-9_+#.-]/g, "") || "text";
}

function createPost(item) {
  const created = dateParts(item.created_at || item.updated_at);
  const updated = dateParts(item.updated_at || item.created_at);
  const categories = categoryMap[item.type] || ["学习记录"];
  const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
  const lines = [
    "---",
    `title: ${yamlString(item.title)}`,
    `date: ${created.frontMatterDate}`,
    `last_modified_at: ${updated.frontMatterDate}`,
    `categories: ${yamlList(categories)}`,
    `tags: ${yamlList(tags)}`,
    `description: ${yamlString(item.summary)}`,
    `pin: ${item.pinned ? "true" : "false"}`,
    "math: false",
    "mermaid: false",
    `legacy_id: ${Number(item.id)}`,
    "---",
    "",
  ];

  if (item.summary) {
    lines.push(`> ${String(item.summary).replace(/\n/g, "\n> ")}`, "{: .prompt-info }", "");
  }

  if (item.difficulty) {
    lines.push(`**原分类难度：** ${item.difficulty}`, "");
  }

  if (item.source_url) {
    lines.push(`**原始来源：** [访问链接](${item.source_url})`, "");
  }

  if (item.body) {
    lines.push(String(item.body).trim(), "");
  }

  if (item.code) {
    lines.push("## 代码", "", `\`\`\`\`${safeLanguage(item.language)}`, String(item.code).trim(), "````", "");
  }

  if (Array.isArray(item.attachments) && item.attachments.length > 0) {
    lines.push("## 附件", "");
    for (const attachment of item.attachments) {
      const target = `/assets/files/legacy/${attachment.stored_name}`;
      if (String(attachment.mime || "").startsWith("image/")) {
        lines.push(`![${attachment.display_name}](${target})`, "");
      } else {
        lines.push(`- [${attachment.display_name}](${target})`);
      }
    }
    lines.push("");
  }

  lines.push(
    "---",
    "",
    "_本文由旧版个人知识库自动迁移，后续可直接在 GitHub 中继续修改。_",
    "",
  );

  return {
    filename: `${created.fileDate}-legacy-${Number(item.id)}.md`,
    content: `${lines.join("\n").replace(/\t/g, "    ").replace(/[ ]+$/gm, "").trimEnd()}\n`,
  };
}

async function downloadAttachment(attachment) {
  const response = await fetch(`${sourceOrigin}/uploads/${encodeURIComponent(attachment.stored_name)}`);
  if (!response.ok) {
    throw new Error(`Attachment download failed (${response.status}): ${attachment.stored_name}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(filesDirectory, attachment.stored_name), buffer);
}

async function main() {
  const response = await fetch(`${sourceOrigin}/api/items`);
  if (!response.ok) throw new Error(`Legacy API failed with HTTP ${response.status}`);

  const payload = await response.json();
  const items = Array.isArray(payload.items) ? payload.items : [];
  if (items.length === 0) throw new Error("Legacy API returned no items; migration stopped.");

  await mkdir(postsDirectory, { recursive: true });
  await mkdir(filesDirectory, { recursive: true });

  let attachments = 0;
  for (const item of items) {
    const post = createPost(item);
    await writeFile(path.join(postsDirectory, post.filename), post.content, "utf8");

    for (const attachment of item.attachments || []) {
      await downloadAttachment(attachment);
      attachments += 1;
    }
  }

  const counts = items.reduce((result, item) => {
    result[item.type] = (result[item.type] || 0) + 1;
    return result;
  }, {});

  console.log(`Migrated ${items.length} posts and ${attachments} attachments.`);
  console.log(JSON.stringify(counts, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
