---
title: "安装 Rust"
description: "学习如何在你的系统上安装 Rust 工具链"
duration: 15
difficulty: "beginner"
tags: ["安装", "环境配置", "rustup"]
---

# 安装 Rust

## 速览

Rust 使用 **rustup** 作为官方的工具链管理器。通过 rustup，你可以轻松安装、更新和管理不同版本的 Rust 编译器。

在本课中，你将学习：
- 如何在不同操作系统上安装 Rust
- 验证安装是否成功
- 了解 Rust 工具链的基本组成

## 详细讲解

### 什么是 Rustup？

Rustup 是 Rust 官方的工具链安装器和版本管理工具。它可以帮助你：
- 安装和更新 Rust 编译器
- 管理多个 Rust 版本
- 切换不同的发布渠道（stable、beta、nightly）

### 安装步骤

#### Windows

在 Windows 上，你需要：

1. 下载并运行 [rustup-init.exe](https://rustup.rs/)
2. 按照安装向导的提示进行操作
3. 安装完成后，重启终端

> **注意**: Windows 用户还需要安装 Visual Studio C++ Build Tools 或完整的 Visual Studio

#### macOS 和 Linux

在 macOS 和 Linux 上，打开终端并运行：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装脚本会：
1. 下载并安装 rustup
2. 安装最新的稳定版 Rust
3. 配置 PATH 环境变量

### 验证安装

安装完成后，验证 Rust 是否正确安装：

```bash
rustc --version
```

你应该看到类似这样的输出：

```
rustc 1.75.0 (82e1608df 2023-12-21)
```

同时验证 Cargo（Rust 的包管理器）：

```bash
cargo --version
```

输出类似：

```
cargo 1.75.0 (1d8b05cdd 2023-11-20)
```

### Rust 工具链组成

安装 Rust 后，你会得到以下工具：

- **rustc**: Rust 编译器
- **cargo**: 包管理器和构建工具
- **rustup**: 工具链管理器
- **rustfmt**: 代码格式化工具
- **clippy**: Rust 代码检查工具

## 实践练习

1. 在你的系统上安装 Rust
2. 运行 `rustc --version` 和 `cargo --version` 验证安装
3. 尝试运行 `rustup --help` 查看 rustup 的其他功能

## 要点总结

- ✅ Rustup 是官方推荐的 Rust 安装工具
- ✅ 一条命令即可安装完整的 Rust 工具链
- ✅ 安装后需要验证 `rustc` 和 `cargo` 是否可用
- ✅ Rust 提供了完整的开发工具链（编译器、包管理器、代码检查工具等）

## 下一步

现在你已经成功安装了 Rust，在下一课中，我们将编写第一个 Rust 程序 "Hello, World!"。
