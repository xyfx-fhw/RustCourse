---
title: "Linux 安装"
description: "在 Linux 系统上安装 Rust"
duration: 5
difficulty: "beginner"
tags: ["Linux", "安装"]
---

# 速览

在 Linux 上安装 Rust 非常简单，只需要一条命令。Rustup 会自动处理所有依赖和环境配置。

# Linux 安装步骤

## 前置要求

确保你的系统已安装：
- `curl`
- C 编译器（gcc 或 clang）
- `make`

大多数 Linux 发行版都已预装这些工具。如果没有，可以通过包管理器安装：

```bash
# Ubuntu/Debian
sudo apt install build-essential curl

# Fedora/RHEL
sudo dnf install gcc make curl

# Arch Linux
sudo pacman -S base-devel curl
```

## 安装 Rust

打开终端并运行：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

这条命令会：
1. 下载 rustup 安装脚本
2. 安装最新的稳定版 Rust
3. 配置环境变量
4. 安装 Cargo 和其他工具

## 配置环境

安装完成后，需要重新加载 shell 配置：

```bash
source $HOME/.cargo/env
```

或者重启终端。

## 验证安装

验证 Rust 是否正确安装：

```bash
rustc --version
cargo --version
```

# 实践练习

1. 在你的 Linux 系统上安装 Rust
2. 验证 `rustc` 和 `cargo` 版本
3. 运行 `which rustc` 查看 Rust 安装位置

# 下一步

Linux 安装完成！接下来可以查看 macOS 或 Windows 的安装方法，或直接开始编写你的第一个 Rust 程序。
