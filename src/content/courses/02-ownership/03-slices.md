---
title: "切片类型"
description: "理解字符串切片和数组切片"
duration: 15
difficulty: "intermediate"
tags: ["切片", "引用", "字符串"]
---

# 切片类型

切片（slice）是对集合中连续序列的引用。切片让你可以引用集合的一部分而不是整个集合。

## 字符串切片

字符串切片是对 `String` 一部分的引用：

```rust
let s = String::from("hello world");

let hello = &s[0..5];   // "hello"
let world = &s[6..11];  // "world"

println!("{} {}", hello, world);
```

**类型**：`&str`（字符串切片类型）

## 切片语法

### 基本语法

```rust
let s = String::from("hello");

let slice = &s[0..2];   // "he" - 从索引0到2（不包括2）
let slice = &s[..2];    // "he" - 省略开始索引
let slice = &s[3..];    // "lo" - 省略结束索引
let slice = &s[..];     // "hello" - 完整切片
```

**规则**：
- `[start..end]` - 包括 start，不包括 end
- `[..end]` - 从开始到 end
- `[start..]` - 从 start 到结束
- `[..]` - 完整切片

### 范围语法

```rust
let s = String::from("hello");

let slice1 = &s[1..3];   // "el"
let slice2 = &s[1..=3];  // "ell" - 包括结束索引
```

## 字符串字面量就是切片

```rust
let s = "Hello, world!";  // 类型是 &str
```

**重要概念**：
- 字符串字面量的类型是 `&str`
- 它是指向二进制程序中某个位置的切片
- 这就是为什么字符串字面量不可变

## 字符串切片作为参数

### 改进函数签名

```rust
// ❌ 不够灵活
fn first_word(s: &String) -> &str {
    // ...
}

// ✅ 更好！接受 &str
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}
```

**为什么更好？**

```rust
let my_string = String::from("hello world");
let my_string_literal = "hello world";

// 两种都能调用
let word = first_word(&my_string[..]);
let word = first_word(my_string_literal);
```

## 切片的内存表示

```rust
let s = String::from("hello world");
let hello = &s[0..5];
```

**内存视图**：

```
String s 在栈上：
┌─────────┬────────┬──────────┐
│ ptr     │ len: 11│ cap: 11  │
└────│────┴────────┴──────────┘
     │
     ↓
堆上的数据：
┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐
│h│e│l│l│o│ │w│o│r│l│d│
└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘

切片 hello 在栈上：
┌─────────┬────────┐
│ ptr     │ len: 5 │  ← 指向 "hello"
└────│────┴────────┘
     │
     └─→ 指向堆上的 "h"
```

## 切片的安全性

切片防止悬垂引用：

```rust
fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s);  // 不可变借用

    s.clear();  // ❌ 错误！尝试可变借用

    println!("first word: {}", word);
}
```

**编译错误**：不能在有不可变借用时进行可变借用！

## 数组切片

切片不仅适用于字符串：

```rust
let a = [1, 2, 3, 4, 5];

let slice = &a[1..3];  // 类型：&[i32]

assert_eq!(slice, &[2, 3]);
```

## Vec 切片

```rust
let v = vec![1, 2, 3, 4, 5];

let slice = &v[2..4];  // &[i32]

println!("{:?}", slice);  // [3, 4]
```

## 可变切片

可以创建可变切片来修改数据：

```rust
let mut arr = [1, 2, 3, 4, 5];

let slice = &mut arr[1..4];
slice[0] = 10;  // 修改第二个元素

println!("{:?}", arr);  // [1, 10, 3, 4, 5]
```

## 切片方法

切片提供了很多有用的方法：

### 字符串切片方法

```rust
let s = "hello world";

// 长度
println!("{}", s.len());  // 11

// 检查是否为空
println!("{}", s.is_empty());  // false

// 包含
println!("{}", s.contains("world"));  // true

// 分割
let words: Vec<&str> = s.split_whitespace().collect();
println!("{:?}", words);  // ["hello", "world"]
```

### 数组切片方法

```rust
let arr = [1, 2, 3, 4, 5];
let slice = &arr[..];

// 迭代
for &item in slice.iter() {
    println!("{}", item);
}

// 查找
println!("{:?}", slice.first());  // Some(1)
println!("{:?}", slice.last());   // Some(5)
```

## String vs &str

理解这两种类型的区别很重要：

| 特性 | `String` | `&str` |
|------|----------|--------|
| 所有权 | 拥有数据 | 借用数据 |
| 可变性 | 可变 | 通常不可变 |
| 内存位置 | 堆 | 栈/堆/静态 |
| 大小 | 动态 | 固定 |

### 转换

```rust
// String → &str
let s = String::from("hello");
let slice: &str = &s;  // 或 &s[..]

// &str → String
let s = "hello";
let string: String = s.to_string();  // 或 String::from(s)
```

## 实际应用示例

### 提取文件扩展名

```rust
fn get_extension(filename: &str) -> Option<&str> {
    filename.rfind('.').map(|i| &filename[i+1..])
}

let filename = "document.txt";
if let Some(ext) = get_extension(filename) {
    println!("Extension: {}", ext);  // "txt"
}
```

### 解析命令

```rust
fn parse_command(input: &str) -> (&str, &str) {
    let mut parts = input.trim().splitn(2, ' ');
    let cmd = parts.next().unwrap_or("");
    let args = parts.next().unwrap_or("");
    (cmd, args)
}

let input = "echo hello world";
let (cmd, args) = parse_command(input);
println!("Command: {}, Args: {}", cmd, args);
// Command: echo, Args: hello world
```

## UTF-8 和切片

**注意**：字符串切片必须在有效的 UTF-8 字符边界上：

```rust
let s = "你好世界";

// ✅ 正确：在字符边界
let hello = &s[0..6];  // "你好" (每个中文字符3字节)

// ❌ 错误：不在字符边界
// let invalid = &s[0..1];  // 运行时 panic！
```

**安全方法**：使用字符迭代器

```rust
let s = "你好世界";
let chars: Vec<char> = s.chars().collect();
let hello: String = chars[0..2].iter().collect();
println!("{}", hello);  // "你好"
```

## 要点总结

- ✅ 切片是对集合部分的引用
- ✅ 字符串切片：`&str`，数组切片：`&[T]`
- ✅ 语法：`[start..end]`、`[..end]`、`[start..]`、`[..]`
- ✅ 切片不拥有数据，只是引用
- ✅ 切片提供安全的访问，防止悬垂引用
- ✅ 字符串字面量就是 `&str` 类型
- ⚠️ 字符串切片必须在 UTF-8 字符边界

## 实践练习

实现一个函数，返回字符串中第一个单词：

```rust
fn first_word(s: &str) -> &str {
    // TODO: 实现这个函数
    // 提示：遍历字节，找到第一个空格
}

fn main() {
    let s = "hello world";
    let word = first_word(s);
    println!("First word: {}", word);  // 应该打印 "hello"
}
```

恭喜你完成了所有权章节！现在你已经掌握了 Rust 最核心的概念。🎉
