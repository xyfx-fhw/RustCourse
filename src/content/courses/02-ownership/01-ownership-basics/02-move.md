---
title: "移动语义"
description: "深入理解 Rust 的移动语义和所有权转移"
duration: 10
difficulty: "intermediate"
tags: ["所有权", "移动", "语义"]
---

# 移动语义

移动（Move）是 Rust 所有权系统的核心概念。当所有权从一个变量转移到另一个变量时，我们说发生了**移动**。

## 什么是移动？

```rust
let s1 = String::from("hello");
let s2 = s1;  // s1 的值"移动"到了 s2
```

**内存视角**：
- `String` 由三部分组成：指针、长度、容量
- 移动时，只复制栈上的元数据（指针等）
- 堆上的实际数据不复制
- `s1` 被标记为无效

```
栈              堆
s1 (无效)       ┌─────────┐
  ↓             │ h e l l o│
s2 ──────────→  └─────────┘
```

## 为什么需要移动？

**防止二次释放（Double Free）**：

```rust
// 如果不移动，会发生什么？
let s1 = String::from("hello");
let s2 = s1;  // 假设 s1 仍然有效

// 当 s1 和 s2 都离开作用域时
// 它们会尝试释放同一块堆内存
// 这会导致内存错误！💥
```

Rust 通过移动语义避免了这个问题：移动后，`s1` 不再有效，只有 `s2` 会释放内存。

## 函数调用中的移动

### 传递参数时移动

```rust
fn main() {
    let s = String::from("hello");
    takes_ownership(s);  // s 的所有权移动到函数中

    // println!("{}", s);  // ❌ 错误！s 已经移动
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
}  // some_string 在这里离开作用域并被丢弃
```

### 返回值时移动

```rust
fn main() {
    let s1 = gives_ownership();  // 函数返回值移动到 s1
    println!("{}", s1);  // ✅ s1 有效
}

fn gives_ownership() -> String {
    let some_string = String::from("hello");
    some_string  // 所有权移动到调用者
}
```

### 移动并返回

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = takes_and_gives_back(s1);  // s1 移入，返回值移动到 s2

    // println!("{}", s1);  // ❌ s1 无效
    println!("{}", s2);     // ✅ s2 有效
}

fn takes_and_gives_back(a_string: String) -> String {
    a_string  // 返回给调用者
}
```

## 移动语义的例外

某些类型**不会**移动，而是**复制**（Copy）：

```rust
let x = 5;
let y = x;  // 复制，x 仍然有效

println!("{} {}", x, y);  // ✅ 都有效
```

**为什么？** 因为整数等简单类型：
- 存储在栈上
- 大小固定且已知
- 复制成本很低
- 实现了 `Copy` trait

## 多重赋值

```rust
let s1 = String::from("hello");
let s2 = s1;
let s3 = s2;
let s4 = s3;

// 只有 s4 有效
println!("{}", s4);  // ✅ 有效
// println!("{}", s3);  // ❌ 无效
// println!("{}", s2);  // ❌ 无效
// println!("{}", s1);  // ❌ 无效
```

所有权像接力棒一样传递：s1 → s2 → s3 → s4

## 部分移动

结构体的字段可以单独移动：

```rust
struct Point {
    x: i32,
    y: String,
}

let p = Point {
    x: 5,
    y: String::from("hello"),
};

let x = p.x;  // i32 实现了 Copy，所以复制
let y = p.y;  // String 移动

// println!("{}", p.x);  // ✅ 仍然有效（Copy）
// println!("{}", p.y);  // ❌ 已经移动
// println!("{:?}", p);  // ❌ p 部分失效
```

## 模式匹配中的移动

```rust
let s = Some(String::from("hello"));

match s {
    Some(text) => println!("{}", text),  // s 中的值移动到 text
    None => {},
}

// println!("{:?}", s);  // ❌ s 中的值已经移动
```

## 避免不必要的移动

### 方法 1：使用引用（后续章节详解）

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);  // 传递引用，不移动

    println!("{} has length {}", s1, len);  // ✅ s1 仍然有效
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

### 方法 2：返回所有权

```rust
fn main() {
    let s1 = String::from("hello");
    let (s2, len) = calculate_length(s1);  // 返回所有权

    println!("{} has length {}", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();
    (s, length)  // 返回字符串和长度
}
```

## 要点总结

- ✅ 移动转移所有权，原变量失效
- ✅ 移动只复制栈上元数据，不复制堆数据
- ✅ 防止二次释放内存
- ✅ 函数参数和返回值也会移动
- ✅ Copy 类型例外（复制而不移动）
- ✅ 引用可以避免移动

## 练习

尝试修复这段代码：

```rust
fn main() {
    let s = String::from("hello");
    print_string(s);
    print_string(s);  // ❌ 错误！如何修复？
}

fn print_string(s: String) {
    println!("{}", s);
}
```

**提示**：可以使用引用（`&s`）或克隆（`s.clone()`），下一节会详细讲解！
