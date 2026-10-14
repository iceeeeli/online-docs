# Markdown 语法演示

本页集中演示常见 Markdown 语法在本文档站中的渲染效果，方便你对照着写自己的文档。

## 文本样式

你可以给文字加上**加粗**、*斜体*，或者标记为~~删除线~~。也可以组合使用，比如***加粗斜体***。

行内代码用反引号包裹，例如安装命令 `npm install`，或引用变量名 `userName`。

## 标题层级

### 三级标题

#### 四级标题

##### 五级标题

不同层级的标题会以不同字号呈现，建议一篇文档从 `#` 一级标题开始，逐级向下使用。

## 列表

### 无序与有序嵌套

- 前端
  - HTML
  - CSS
  - JavaScript
    - ES6+
    - TypeScript
- 后端
  - Node.js
  - Python

有序列表同样支持嵌套：

1. 克隆仓库
2. 安装依赖
   1. 删除旧的 `node_modules`
   2. 重新执行安装
3. 启动服务

### 任务列表

- [x] 搭建 Docsify 文档站
- [x] 编写快速开始文档
- [ ] 补充 API 参考
- [ ] 接入全文搜索

## 表格

下面是一个三列表格，演示不同对齐方式：

| 语法元素 | 用途说明       | 是否常用 |
| :------- | :------------- | :------: |
| 标题     | 组织文档结构   |    是    |
| 代码块   | 展示示例代码   |    是    |
| 表格     | 结构化对比信息 |    是    |
| 脚注     | 补充说明       |    否    |

## 代码块（多语言）

JavaScript 示例：

```javascript
// 计算数组中所有数字之和
function sum(numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

const result = sum([1, 2, 3, 4]);
console.log(`合计：${result}`); // 合计：10
```

JSON 配置示例：

```json
{
  "name": "online-docs",
  "version": "1.0.0",
  "scripts": {
    "serve": "docsify serve docs"
  },
  "tags": ["docsify", "markdown", "文档站"]
}
```

## 引用块

> Markdown 的设计目标是让文档在未经渲染时也具有良好的可读性。
>
> —— 这正是它适合写技术文档的原因。

## 分割线

上下内容之间可以用分割线隔开：

---

## 链接与图片

外部链接写法，例如访问 [Docsify 官方文档](https://docsify.js.org/)。

图片语法与链接类似，在前面加一个感叹号即可：

![占位图示例](https://via.placeholder.com/150)

以上就是常见 Markdown 元素的演示，组合使用它们就能写出结构清晰的文档。
