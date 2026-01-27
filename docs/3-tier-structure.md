# 3级目录结构说明文档

## 概述

Rust 学习网站现在支持 **3级目录结构**，可以更细致地组织课程内容：

- **第 1 级**：章节（Chapter）- 如 "第 1 章：Rust 基础"
- **第 2 级**：课程（Lesson）- 如 "1.1 安装 Rust"
- **第 3 级**：小节（Subsection）- 如 "1.1.1 Linux 安装"

## 文件结构

### 2级结构（原有方式）

```
src/content/courses/
├── 01-rust-basics/
│   ├── 02-hello-world.md           # 1.2 Hello World
│   ├── 03-variables.md             # 1.3 变量
│   └── 04-control-flow.md          # 1.4 控制流
```

### 3级结构（新增方式）

```
src/content/courses/
├── 01-rust-basics/
│   ├── 01-installation/            # 课程文件夹
│   │   ├── 01-linux.md            # 1.1.1 Linux 安装
│   │   ├── 02-macos.md            # 1.1.2 macOS 安装
│   │   └── 03-windows.md          # 1.1.3 Windows 安装
│   ├── 02-hello-world.md          # 1.2 Hello World（无小节）
│   └── 03-variables.md            # 1.3 变量（无小节）
```

## 使用方法

### 创建 2级课程（无小节）

直接在章节文件夹下创建 Markdown 文件：

```bash
touch src/content/courses/01-rust-basics/05-functions.md
```

文件内容：
```markdown
---
title: "函数"
description: "学习 Rust 中的函数定义和使用"
duration: 20
difficulty: "beginner"
---

# 函数

你的课程内容...
```

### 创建 3级课程（有小节）

1. 创建课程文件夹：
```bash
mkdir -p src/content/courses/01-rust-basics/06-ownership
```

2. 在文件夹内创建小节文件：
```bash
touch src/content/courses/01-rust-basics/06-ownership/01-what-is-ownership.md
touch src/content/courses/01-rust-basics/06-ownership/02-references.md
touch src/content/courses/01-rust-basics/06-ownership/03-slices.md
```

3. 编写小节内容：
```markdown
---
title: "什么是所有权"
description: "理解 Rust 的所有权概念"
duration: 15
difficulty: "intermediate"
---

# 什么是所有权

你的小节内容...
```

## 命名规则

### 章节文件夹
格式：`{序号}-{名称}`
- 序号：两位数字（01, 02, 03...）
- 名称：小写字母，用连字符分隔
- 示例：`01-rust-basics`, `02-ownership`, `03-structs`

### 课程文件/文件夹
格式：`{序号}-{名称}.md` 或 `{序号}-{名称}/`
- 序号：两位数字（01, 02, 03...）
- 名称：小写字母，用连字符分隔
- 示例：
  - 文件：`01-installation.md`
  - 文件夹：`01-installation/`

### 小节文件
格式：`{序号}-{名称}.md`
- 序号：两位数字（01, 02, 03...）
- 名称：小写字母，用连字符分隔
- 示例：`01-linux.md`, `02-macos.md`, `03-windows.md`

## 侧边栏显示

### 2级课程显示
```
第 1 章：Rust 基础
  ├─ 1.2 Hello World
  ├─ 1.3 变量
  └─ 1.4 控制流
```

### 3级课程显示（可折叠）
```
第 1 章：Rust 基础
  └─ 1.1 安装 Rust ▼          # 点击可展开/折叠
       ├─ 1.1.1 Linux 安装
       ├─ 1.1.2 macOS 安装
       └─ 1.1.3 Windows 安装
  ├─ 1.2 Hello World
  └─ 1.3 变量
```

## 导航行为

### 上一课/下一课
系统会自动按照以下顺序导航：

1. 1.1.1 Linux 安装
2. 1.1.2 macOS 安装
3. 1.1.3 Windows 安装
4. 1.2 Hello World
5. 1.3 变量
6. ...

小节之间、课程之间的导航都是自动的，无需手动配置。

## URL 结构

### 2级课程
```
/courses/01-rust-basics/02-hello-world
```

### 3级课程
```
/courses/01-rust-basics/01-installation/01-linux
/courses/01-rust-basics/01-installation/02-macos
/courses/01-rust-basics/01-installation/03-windows
```

## 何时使用 3级结构

### 适合使用 3级结构的场景

1. **多平台/多版本内容**
   - 如：Linux、macOS、Windows 安装
   - 如：Rust 2018 vs Rust 2021

2. **概念细分**
   - 如：所有权 → 移动、借用、引用
   - 如：生命周期 → 基础、高级、省略规则

3. **实践练习系列**
   - 如：项目实战 → 需求分析、架构设计、编码实现

### 不适合使用 3级结构的场景

1. **内容简短且独立**
   - 如：Hello World（单个文件足够）
   - 如：变量声明（无需细分）

2. **线性教学内容**
   - 如：控制流（if/match/loop 可以在一个文件中讲解）

## 示例：创建"所有权"课程

假设要创建一个包含 3 个小节的"所有权"课程：

```bash
# 1. 创建课程文件夹
mkdir -p src/content/courses/02-ownership/01-ownership

# 2. 创建小节文件
cat > src/content/courses/02-ownership/01-ownership/01-basics.md << 'EOF'
---
title: "所有权基础"
description: "理解 Rust 的所有权规则"
duration: 20
difficulty: "intermediate"
---

# 所有权基础

Rust 的所有权系统是其最独特的特性...
EOF

cat > src/content/courses/02-ownership/01-ownership/02-references.md << 'EOF'
---
title: "引用和借用"
description: "学习如何使用引用避免移动"
duration: 15
difficulty: "intermediate"
---

# 引用和借用

引用允许你使用值而不获取其所有权...
EOF

cat > src/content/courses/02-ownership/01-ownership/03-slices.md << 'EOF'
---
title: "切片类型"
description: "了解切片：另一种不持有所有权的数据类型"
duration: 10
difficulty: "intermediate"
---

# 切片类型

切片让你引用集合中一段连续的元素序列...
EOF
```

## 迁移现有课程

如果要将现有的 2级课程改为 3级：

```bash
# 原有文件
src/content/courses/01-rust-basics/01-installation.md

# 迁移步骤
mkdir -p src/content/courses/01-rust-basics/01-installation

# 将内容拆分为多个小节文件
# 创建 01-linux.md, 02-macos.md, 03-windows.md

# 删除原文件
rm src/content/courses/01-rust-basics/01-installation.md
```

## 技术实现细节

### 自动识别
系统会自动识别课程结构：
- 如果 slug 是 `chapter/lesson` → 2级结构
- 如果 slug 是 `chapter/lesson/subsection` → 3级结构

### 侧边栏渲染
- 2级课程：直接显示课程链接
- 3级课程：显示课程标题（可折叠）+ 小节列表

### 进度跟踪
- 2级课程：跟踪课程完成状态
- 3级课程：跟踪每个小节的完成状态

## 常见问题

### Q: 可以混用 2级和 3级结构吗？
A: 可以！在同一个章节中，部分课程可以是 2级（单文件），部分课程可以是 3级（多小节）。

### Q: 小节的数量有限制吗？
A: 没有硬性限制，但建议每个课程不超过 5-7 个小节，以保持内容清晰。

### Q: 可以嵌套更多层级吗（4级、5级）？
A: 目前只支持 3级。如果需要更深的层级，建议重新组织内容结构。

### Q: 如何修改小节的顺序？
A: 重命名文件的数字前缀即可：
```bash
# 交换顺序
mv 01-linux.md tmp.md
mv 02-macos.md 01-macos.md
mv tmp.md 02-linux.md
```

## 总结

3级目录结构提供了更灵活的内容组织方式：
- ✅ 支持 2级和 3级混用
- ✅ 自动识别结构
- ✅ 侧边栏自动折叠/展开
- ✅ 导航自动生成
- ✅ 进度跟踪完整

开始使用 3级结构，让你的课程内容更加结构化和易于导航！
