---
title: "所有权规则"
description: "掌握 Rust 所有权的三条核心规则"
duration: 10
difficulty: "intermediate"
tags: ["所有权", "规则"]
---

# 所有权的三条规则

在 Rust 中，所有权系统遵循三条核心规则：

1. **每个值都有一个所有者**
2. **同一时间只能有一个所有者**
3. **当所有者离开作用域时，值将被丢弃**

## 规则 1：每个值都有一个所有者

```rust
let s = String::from("hello");  // s 是字符串 "hello" 的所有者
```

在这个例子中，变量 `s` 是字符串值 `"hello"` 的所有者。

## 规则 2：同一时间只能有一个所有者

```rust
let s1 = String::from("hello");
let s2 = s1;  // s1 的所有权转移给了 s2

// println!("{}", s1);  // ❌ 错误！s1 不再有效
println!("{}", s2);     // ✅ 正确！s2 现在拥有所有权
```

**重要概念**：当 `s1` 赋值给 `s2` 时，所有权发生了**移动**（move），`s1` 不再有效。

## 规则 3：当所有者离开作用域，值被丢弃

```rust
{
    let s = String::from("hello");  // s 在此处进入作用域

    // 使用 s
    println!("{}", s);

}  // s 在此处离开作用域，内存被自动释放
```

这个机制称为 **RAII**（Resource Acquisition Is Initialization），Rust 会自动调用 `drop` 函数清理内存。

## 变量作用域示例

```rust
fn main() {
    let s1 = String::from("hello");  // s1 有效

    {
        let s2 = String::from("world");  // s2 有效
        println!("{} {}", s1, s2);       // s1 和 s2 都有效
    }  // s2 离开作用域，被丢弃

    println!("{}", s1);  // s1 仍然有效
    // println!("{}", s2);  // ❌ 错误！s2 已经无效
}  // s1 离开作用域，被丢弃
```

## 栈与堆的数据

不同类型的数据在内存中的存储方式不同：

### 栈上的数据（已知固定大小）

```rust
let x = 5;
let y = x;  // 简单的复制，x 仍然有效

println!("{} {}", x, y);  // ✅ 都有效
```

像整数这样的简单类型存储在**栈**上，复制非常快，所以 `x` 赋值给 `y` 时是**复制**而不是移动。

### 堆上的数据（大小可变）

```rust
let s1 = String::from("hello");
let s2 = s1;  // 移动，不是复制

// println!("{}", s1);  // ❌ 错误！s1 已经移动
```

`String` 类型的数据存储在**堆**上，赋值时发生**移动**以避免二次释放（double free）问题。

## 实现 Copy trait 的类型

以下类型实现了 `Copy` trait，赋值时会复制而不是移动：

- 所有整数类型：`i32`, `u64` 等
- 布尔类型：`bool`
- 浮点类型：`f64` 等
- 字符类型：`char`
- 元组（如果元素都是 Copy 类型）：`(i32, i32)`

## 要点总结

- ✅ 每个值有且只有一个所有者
- ✅ 所有权可以转移（移动）
- ✅ 所有者离开作用域时，值自动释放
- ✅ 栈上数据复制，堆上数据移动
- ✅ 实现 Copy trait 的类型例外

## 思考练习

下面的代码会发生什么？

```rust
fn main() {
    let s = String::from("hello");
    takes_ownership(s);
    println!("{}", s);  // ❓ 这行能编译通过吗？
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
}
```

答案：❌ 不能！因为 `s` 的所有权已经移动到函数 `takes_ownership` 中，函数结束后 `s` 被丢弃。

下一节我们将详细学习移动语义！
