---
title: "克隆数据"
description: "学习如何使用 clone() 方法深拷贝数据"
duration: 8
difficulty: "intermediate"
tags: ["所有权", "克隆", "Copy"]
---

# 速览

有时候我们确实需要复制堆上的数据，而不仅仅是栈上的元数据。这时候就需要使用**克隆**（Clone）。

## clone() 方法

```rust
let s1 = String::from("hello");
let s2 = s1.clone();  // 深拷贝：堆数据也被复制

println!("{}", s1);  // ✅ s1 仍然有效
println!("{}", s2);  // ✅ s2 也有效
```

**内存视角**：

```
栈              堆
s1 ────────→  ┌─────────┐
              │ h e l l o│
              └─────────┘
s2 ────────→  ┌─────────┐
              │ h e l l o│  (新分配的内存)
              └─────────┘
```

# clone() vs 移动

## 移动（默认行为）

```rust
let s1 = String::from("hello");
let s2 = s1;  // 移动：只复制指针

// s1 无效，s2 指向原来的堆数据
```

- ✅ 快速（只复制栈上的几个字节）
- ✅ 无额外内存分配
- ❌ 原变量失效

## 克隆（显式调用）

```rust
let s1 = String::from("hello");
let s2 = s1.clone();  // 克隆：复制所有数据

// s1 和 s2 都有效，指向不同的堆数据
```

- ✅ 原变量仍然有效
- ❌ 较慢（需要分配新内存并复制数据）
- ❌ 增加内存使用

# 何时使用 clone()

## ✅ 适合使用的场景

### 1. 需要保留原始数据

```rust
fn main() {
    let original = String::from("important data");
    process_data(original.clone());  // 传递克隆

    println!("Original: {}", original);  // 原始数据仍然可用
}

fn process_data(s: String) {
    // 处理数据...
}
```

### 2. 需要多个副本

```rust
let template = String::from("Hello, {}!");
let greeting1 = template.clone();
let greeting2 = template.clone();
let greeting3 = template.clone();

// 所有变量都有效
```

### 3. 跨线程共享数据

```rust
use std::thread;

let data = String::from("shared data");
let data_clone = data.clone();

thread::spawn(move || {
    println!("{}", data_clone);
});

println!("{}", data);  // 原始数据仍然有效
```

## ❌ 不适合使用的场景

### 1. 性能敏感的代码

```rust
// ❌ 不好：频繁克隆大型数据
for i in 0..1000000 {
    let s = large_string.clone();  // 每次循环都克隆！
    process(s);
}

// ✅ 更好：使用引用
for i in 0..1000000 {
    process(&large_string);  // 无需克隆
}
```

### 2. 可以使用引用的地方

```rust
// ❌ 不好
fn print_string(s: String) {
    println!("{}", s);
}
let s = String::from("hello");
print_string(s.clone());  // 不必要的克隆

// ✅ 更好
fn print_string(s: &String) {
    println!("{}", s);
}
print_string(&s);  // 只是借用
```

# Copy vs Clone

## Copy trait（隐式复制）

```rust
let x = 5;
let y = x;  // 自动复制，无需调用方法

println!("{} {}", x, y);  // 都有效
```

**特点**：
- 栈上的简单类型
- 复制成本极低
- 自动执行，无需显式调用
- 类型：`i32`, `f64`, `bool`, `char` 等

## Clone trait（显式复制）

```rust
let s1 = String::from("hello");
let s2 = s1.clone();  // 必须显式调用

println!("{} {}", s1, s2);  // 都有效
```

**特点**：
- 可能包含堆数据
- 复制可能昂贵
- 必须显式调用 `.clone()`
- 类型：`String`, `Vec<T>`, `HashMap<K,V>` 等

## 实现 Clone trait

你可以为自己的类型实现 `Clone`：

### 自动派生

```rust
#[derive(Clone)]
struct Point {
    x: i32,
    y: i32,
}

let p1 = Point { x: 1, y: 2 };
let p2 = p1.clone();  // ✅ 自动实现
```

### 手动实现

```rust
struct MyStruct {
    data: String,
}

impl Clone for MyStruct {
    fn clone(&self) -> Self {
        MyStruct {
            data: self.data.clone(),
        }
    }
}
```

# 性能考虑

## clone() 的性能开销

### 测量克隆的开销

```rust
let small_string = String::from("hi");
let large_string = "x".repeat(1_000_000);

// 小字符串克隆：很快
let s1 = small_string.clone();  // 几纳秒

// 大字符串克隆：较慢
let s2 = large_string.clone();  // 几毫秒
```

## 优化建议

### 1. 优先使用引用

```rust
fn process(s: &String) { }  // ✅ 无开销
```

### 2. 仅在必要时克隆

```rust
if really_need_ownership {
    let s = data.clone();  // 仅在必要时
}
```

### 3. 考虑使用 Rc 或 Arc

```rust
use std::rc::Rc;

let data = Rc::new(String::from("shared"));
let data2 = Rc::clone(&data);  // 只增加引用计数
```

## 集合类型的克隆

### Vec 克隆

```rust
let v1 = vec![1, 2, 3, 4, 5];
let v2 = v1.clone();  // 克隆整个向量

// 两个独立的向量
```

### HashMap 克隆

```rust
use std::collections::HashMap;

let mut map1 = HashMap::new();
map1.insert("key", "value");

let map2 = map1.clone();  // 克隆整个哈希表
```

# 要点总结

## 核心概念

- ✅ `clone()` 执行深拷贝，包括堆数据
- ✅ 原变量和克隆都有效
- ✅ 必须显式调用 `.clone()`
- ⚠️ 可能有性能开销
- ✅ 优先考虑使用引用
- ✅ `Copy` 是自动的，`Clone` 是显式的

## 实践练习

完成这个函数，使其能够多次使用同一个字符串：

```rust
fn main() {
    let message = String::from("Hello, Rust!");

    // 如何让下面三个函数调用都能工作？
    print_uppercase(/* ??? */);
    print_lowercase(/* ??? */);
    print_length(/* ??? */);
}

fn print_uppercase(s: String) {
    println!("{}", s.to_uppercase());
}

fn print_lowercase(s: String) {
    println!("{}", s.to_lowercase());
}

fn print_length(s: String) {
    println!("Length: {}", s.len());
}
```

**提示**：可以使用 `message.clone()` 或者修改函数签名使用引用！

下一章我们将学习**引用和借用**，这是避免不必要克隆的关键技术！
