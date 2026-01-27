---
title: "macOS 安装"
description: "在 macOS 系统上安装 Rust"
duration: 5
difficulty: "beginner"
tags: ["macOS", "安装"]
---

# 速览

在 macOS 上安装 Rust 与 Linux 类似，使用 rustup 一键安装。你可以选择通过 Homebrew 或官方脚本安装。

# macOS 安装步骤

## 前置要求

macOS 需要先安装 Xcode Command Line Tools：

```bash
xcode-select --install
```

这会安装 C 编译器和其他必要的开发工具。

## 方法一：使用官方脚本（推荐）

打开终端并运行：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装过程会：
1. 下载并安装 rustup
2. 安装最新的稳定版 Rust
3. 自动配置 PATH 环境变量

## 方法二：使用 Homebrew

如果你使用 Homebrew，也可以这样安装：

```bash
brew install rustup-init
rustup-init
```

## 配置环境

安装完成后，重新加载 shell 配置：

```bash
source $HOME/.cargo/env
```

或者重启终端。

## 验证安装

检查 Rust 是否正确安装：

```bash
rustc --version
cargo --version
rustup --version
```

# M1/M2 芯片注意事项

如果你使用的是 Apple Silicon (M1/M2/M3) Mac：
- Rust 完全支持 ARM64 架构
- 无需额外配置
- 编译速度通常比 Intel Mac 更快

# 实践练习

1. 在你的 macOS 上安装 Xcode Command Line Tools
2. 使用官方脚本安装 Rust
3. 验证所有工具都正确安装

# 下一步

macOS 安装完成！你现在可以开始学习如何编写 Rust 程序了。
