---
title: "安装 Rust"
description: "学习如何在不同操作系统上安装 Rust 工具链"
duration: 15
difficulty: "beginner"
tags: ["安装", "环境配置", "rustup"]
---

# 速览

Rust 使用 **rustup** 作为官方的工具链管理器。通过 rustup，你可以轻松安装、更新和管理不同版本的 Rust 编译器。

本节课程分为三个部分，根据你的操作系统选择：

- **Linux 安装** - 适用于 Ubuntu、Debian、Fedora、Arch 等 Linux 发行版
- **macOS 安装** - 适用于 macOS 和 Apple Silicon (M1/M2/M3)
- **Windows 安装** - 适用于 Windows 10/11

# Rustup 简介

## 什么是 Rustup？

Rustup 是 Rust 官方的工具链安装器和版本管理工具。它可以帮助你：

- 安装和更新 Rust 编译器
- 管理多个 Rust 版本
- 切换不同的发布渠道（stable、beta、nightly）
- 安装交叉编译工具链

## Rust 工具链组成

安装 Rust 后，你会得到以下工具：

- **rustc** - Rust 编译器，将 Rust 代码编译为可执行文件
- **cargo** - 包管理器和构建工具，管理依赖和项目
- **rustup** - 工具链管理器，更新和管理 Rust 版本
- **rustfmt** - 代码格式化工具，保持代码风格一致
- **clippy** - Rust 代码检查工具，提供最佳实践建议

# 安装步骤

根据你的操作系统，选择相应的安装指南：

## 👉 点击侧边栏或下方链接查看具体安装步骤

- **Linux 用户** → 查看 1.1.1 Linux 安装
- **macOS 用户** → 查看 1.1.2 macOS 安装
- **Windows 用户** → 查看 1.1.3 Windows 安装

# 验证安装

无论使用哪种操作系统，安装完成后都需要验证：

```bash
rustc --version
cargo --version
```

你应该看到版本信息输出，例如：

```
rustc 1.75.0 (82e1608df 2023-12-21)
cargo 1.75.0 (1d8b05cdd 2023-11-20)
```

# 下一步

安装完成后，你就可以：

1. 进入下一课学习如何编写第一个 Rust 程序
2. 使用 `cargo new my_project` 创建你的第一个项目
3. 开始探索 Rust 的基本语法

# 需要帮助？

如果安装过程中遇到问题：

1. 检查系统是否满足前置要求
2. 查看 [Rust 官方文档](https://www.rust-lang.org/tools/install)
3. 访问 [Rust 中文社区](https://rust.cc/)

开始你的 Rust 学习之旅吧！🦀
