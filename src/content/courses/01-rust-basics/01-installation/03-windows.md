---
title: "Windows 安装"
description: "在 Windows 系统上安装 Rust"
duration: 10
difficulty: "beginner"
tags: ["Windows", "安装"]
---

# 速览

在 Windows 上安装 Rust 需要额外安装 Visual Studio Build Tools。不过别担心，rustup 会引导你完成整个过程。

# Windows 安装步骤

## 前置要求

Windows 用户需要安装 Microsoft C++ Build Tools。有两个选择：

### 选项一：Visual Studio Build Tools（推荐）

1. 下载 [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)
2. 运行安装程序
3. 选择 "Desktop development with C++" 工作负载
4. 安装大约需要 6GB 空间

### 选项二：完整的 Visual Studio Community

如果你想要完整的 IDE：
1. 下载 [Visual Studio Community](https://visualstudio.microsoft.com/vs/community/)
2. 安装时选择 "Desktop development with C++"

## 安装 Rust

1. 下载 [rustup-init.exe](https://rustup.rs/)
2. 运行安装程序
3. 选择默认安装选项（通常选择 1）
4. 等待安装完成

安装程序会自动：
- 安装 rustup
- 安装最新的稳定版 Rust
- 配置 PATH 环境变量

## 验证安装

打开新的 PowerShell 或 CMD 窗口：

```powershell
rustc --version
cargo --version
```

你应该看到版本信息。

## 使用 WSL2（可选）

如果你使用 Windows Subsystem for Linux (WSL2)，可以按照 Linux 的安装方法：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

WSL2 提供了更接近 Linux 的开发体验。

# 常见问题

## 找不到 link.exe

如果遇到链接器错误，说明 Visual Studio Build Tools 没有正确安装。请重新安装并确保选择了 C++ 工作负载。

## PATH 环境变量

Rustup 会自动添加以下路径到 PATH：
- `%USERPROFILE%\.cargo\bin`

如果 `cargo` 命令不可用，尝试重启终端或手动添加到 PATH。

# 实践练习

1. 安装 Visual Studio Build Tools
2. 安装 Rust
3. 验证安装成功
4. 尝试运行 `cargo --help` 查看 Cargo 的功能

# 下一步

Windows 安装完成！现在你可以开始编写 Rust 代码了。建议使用 VS Code + rust-analyzer 扩展作为开发环境。
