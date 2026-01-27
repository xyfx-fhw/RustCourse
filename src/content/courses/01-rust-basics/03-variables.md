---
title: "变量和可变性"
description: "学习 Rust 中的变量声明、可变性和数据类型"
duration: 25
difficulty: "beginner"
tags: ["变量", "数据类型", "可变性"]
---

import CodePlayground from '@/components/interactive/CodePlayground';

# 变量和可变性

在 Rust 中，变量默认是**不可变的**（immutable）。这是 Rust 推崇的安全性和并发性的一部分。

## 不可变变量

当你声明一个变量时，默认情况下它是不可变的：

```rust
fn main() {
    let x = 5;
    println!("x 的值是: {}", x);
    // x = 6; // 这会导致编译错误！
}
```

## 在线实践：尝试修改不可变变量

下面的代码编辑器展示了不可变变量的特性。尝试取消注释第 4 行，看看会发生什么：

<CodePlayground 
  defaultCode={`fn main() {
    let x = 5;
    println!("x 的值是: {}", x);
    // x = 6; // 取消这行注释试试
    // println!("x 的新值是: {}", x);
}`}
  client:load 
/>

## 可变变量

如果你想让变量可变，需要使用 `mut` 关键字：

```rust
fn main() {
    let mut y = 5;
    println!("y 的值是: {}", y);
    y = 6;
    println!("y 的新值是: {}", y);
}
```

## 在线实践：使用可变变量

现在试试运行这个可变变量的例子：

<CodePlayground 
  defaultCode={`fn main() {
    let mut y = 5;
    println!("y 的值是: {}", y);
    y = 6;
    println!("y 的新值是: {}", y);
}`}
  client:load 
/>

## 常量

除了不可变变量，Rust 还有**常量**（constants），它们总是不可变的：

```rust
const MAX_POINTS: u32 = 100_000;
```

常量与不可变变量的区别：
- 常量使用 `const` 关键字，必须标注类型
- 常量可以在任何作用域声明，包括全局作用域
- 常量只能被设置为常量表达式，不能是函数调用的结果

## 要点总结

- 变量默认不可变（`let x = 5`）
- 使用 `mut` 使变量可变（`let mut y = 5`）
- 常量使用 `const` 声明，必须标注类型
- 不可变性帮助我们写出更安全的代码
