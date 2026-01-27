---
title: "引用和借用"
description: "学习如何在不转移所有权的情况下使用数据"
duration: 20
difficulty: "intermediate"
tags: ["引用", "借用", "所有权"]
---

# 速览

在上一课中，我们学习了所有权和移动。但每次使用值都要转移所有权显然不方便。Rust 提供了**引用**（reference）机制，允许我们在不获取所有权的情况下使用值。

## 什么是引用？

引用允许你**借用**（borrow）值而不获取其所有权：

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);  // 传递引用

    println!("'{}' has length {}", s1, len);  // ✅ s1 仍然有效！
}

fn calculate_length(s: &String) -> usize {
    s.len()
}  // s 离开作用域，但不会丢弃数据（没有所有权）
```

**符号说明**：
- `&s1` - 创建一个指向 `s1` 的引用
- `&String` - 引用类型（函数参数）

## 引用的内存视图

```
栈                  堆
s1 ────────────→  ┌─────────┐
                  │ h e l l o│
                  └─────────┘
                     ↑
s (引用) ───────────┘
```

引用像一个指针，但不拥有数据。

# 借用规则

Rust 的借用系统遵循以下规则：

## 规则 1：不可变引用可以有多个

```rust
let s = String::from("hello");

let r1 = &s;  // ✅ 第一个不可变引用
let r2 = &s;  // ✅ 第二个不可变引用
let r3 = &s;  // ✅ 第三个不可变引用

println!("{}, {}, {}", r1, r2, r3);  // ✅ 都可以使用
```

## 规则 2：可变引用同时只能有一个

```rust
let mut s = String::from("hello");

let r1 = &mut s;  // ✅ 第一个可变引用
// let r2 = &mut s;  // ❌ 错误！不能同时有两个可变引用

r1.push_str(", world");
println!("{}", r1);
```

**为什么？** 防止数据竞争（data race）！

## 规则 3：不可变和可变引用不能同时存在

```rust
let mut s = String::from("hello");

let r1 = &s;      // ✅ 不可变引用
let r2 = &s;      // ✅ 不可变引用
// let r3 = &mut s;  // ❌ 错误！已经有不可变引用了

println!("{} {}", r1, r2);
```

## 引用的作用域

```rust
let mut s = String::from("hello");

let r1 = &s;  // 不可变引用
let r2 = &s;  // 不可变引用
println!("{} {}", r1, r2);
// r1 和 r2 在此之后不再使用

let r3 = &mut s;  // ✅ 可变引用（r1, r2 已失效）
r3.push_str("!");
println!("{}", r3);
```

**NLL（Non-Lexical Lifetimes）**：引用的作用域从创建到最后一次使用。

# 可变引用

使用 `&mut` 创建可变引用：

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);
    println!("{}", s);  // "hello, world"
}

fn change(s: &mut String) {
    s.push_str(", world");
}
```

**关键点**：
- 变量必须是 `mut` 的
- 引用类型是 `&mut`
- 函数可以修改借用的数据

## 悬垂引用

Rust 编译器防止**悬垂引用**（dangling reference）：

```rust
fn dangle() -> &String {  // ❌ 错误！
    let s = String::from("hello");
    &s  // 返回 s 的引用
}  // s 在这里被丢弃，引用指向无效内存
```

**正确做法**：返回所有权

```rust
fn no_dangle() -> String {  // ✅ 正确
    let s = String::from("hello");
    s  // 移动所有权
}
```

# 实践示例

## 解引用

使用 `*` 解引用：

```rust
let x = 5;
let y = &x;

assert_eq!(5, x);
assert_eq!(5, *y);  // 解引用获取值

// println!("{}", x == y);  // ❌ 错误：类型不匹配
println!("{}", x == *y);  // ✅ 正确
```

## 函数参数中的引用

### 不可变引用参数

```rust
fn print_length(s: &String) {
    println!("Length: {}", s.len());
}  // s 不会丢弃数据

let my_string = String::from("hello");
print_length(&my_string);
println!("{}", my_string);  // ✅ 仍然有效
```

### 可变引用参数

```rust
fn append_world(s: &mut String) {
    s.push_str(" world");
}

let mut my_string = String::from("hello");
append_world(&mut my_string);
println!("{}", my_string);  // "hello world"
```

## 借用与所有权的比较

| 特性 | 所有权 | 不可变引用 | 可变引用 |
|------|--------|------------|----------|
| 符号 | `T` | `&T` | `&mut T` |
| 数量限制 | 1个 | 多个 | 1个 |
| 可以修改 | ✅ | ❌ | ✅ |
| 转移所有权 | ✅ | ❌ | ❌ |

## 切片引用

切片是一种特殊的引用：

```rust
let s = String::from("hello world");
let hello = &s[0..5];   // 字符串切片
let world = &s[6..11];

println!("{} {}", hello, world);
```

切片类型：`&str`（字符串切片），`&[T]`（数组切片）

## 方法调用的自动引用

Rust 会自动添加 `&`、`&mut` 或 `*`：

```rust
let s = String::from("hello");

// 等价的调用
s.len();      // 自动借用
(&s).len();   // 显式借用
```

# 要点总结

## 核心概念

- ✅ 引用允许借用值而不获取所有权
- ✅ `&T` 是不可变引用，`&mut T` 是可变引用
- ✅ 多个不可变引用 OR 一个可变引用
- ✅ 引用必须始终有效（无悬垂引用）
- ✅ 引用的作用域到最后一次使用
- ✅ 编译器保证借用安全

## 实践练习

修复下面的代码：

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s;
    let r2 = &mut s;  // ❌ 错误！

    println!("{} {}", r1, r2);
}
```

**提示**：不可变引用和可变引用不能同时存在！

下一课我们将学习**切片类型**，它是引用的一种特殊形式。
