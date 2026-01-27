---
title: "控制流"
description: "学习 Rust 中的条件语句、循环和模式匹配"
duration: 25
difficulty: beginner
tags: ["控制流", "循环", "条件"]
---

# 条件语句

Rust 使用 `if` 表达式来执行条件分支。与其他语言不同的是，Rust 中的 `if` 是一个表达式，可以返回值。

## if 表达式

最基本的 `if` 表达式：

```rust
fn main() {
    let number = 6;

    if number < 5 {
        println!("条件为真");
    } else {
        println!("条件为假");
    }
}
```

## if 作为表达式

因为 `if` 是表达式，我们可以在 `let` 语句的右侧使用它：

```rust
fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };

    println!("number 的值是: {}", number);
}
```

## 多个条件

使用 `else if` 处理多个条件：

```rust
fn main() {
    let number = 6;

    if number % 4 == 0 {
        println!("number 能被 4 整除");
    } else if number % 3 == 0 {
        println!("number 能被 3 整除");
    } else if number % 2 == 0 {
        println!("number 能被 2 整除");
    } else {
        println!("number 不能被 4、3、2 整除");
    }
}
```

# 循环

Rust 提供了三种循环：`loop`、`while` 和 `for`。每种循环都有其特定的用途。

## loop 循环

`loop` 关键字创建一个无限循环：

```rust
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("结果是: {}", result);
}
```

使用 `break` 可以退出循环，甚至可以返回一个值。

## while 循环

当条件为真时，代码会一直运行：

```rust
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{}!", number);
        number -= 1;
    }

    println!("发射！！！");
}
```

## for 循环

遍历集合中的元素：

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("值是: {}", element);
    }
}
```

使用范围（Range）：

```rust
fn main() {
    for number in (1..4).rev() {
        println!("{}!", number);
    }
    println!("发射！！！");
}
```

# 模式匹配

Rust 的 `match` 表达式是一个强大的控制流运算符，它允许将一个值与一系列的模式相比较，并根据匹配的模式执行相应的代码。

## 基本 match

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

## 绑定值的模式

模式可以绑定匹配部分的值：

```rust
#[derive(Debug)]
enum UsState {
    Alabama,
    Alaska,
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("来自 {:?} 的 25 美分!", state);
            25
        }
    }
}
```

## 匹配 Option<T>

处理 `Option` 是 `match` 的常见用法：

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

fn main() {
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
}
```

## _ 占位符

`_` 模式会匹配所有值：

```rust
fn main() {
    let some_u8_value = 0u8;
    match some_u8_value {
        1 => println!("one"),
        3 => println!("three"),
        5 => println!("five"),
        7 => println!("seven"),
        _ => (),
    }
}
```

## if let 简洁控制流

当你只关心一个模式时，`if let` 提供了更简洁的语法：

```rust
fn main() {
    let some_u8_value = Some(0u8);

    // 使用 match
    match some_u8_value {
        Some(3) => println!("three"),
        _ => (),
    }

    // 使用 if let（更简洁）
    if let Some(3) = some_u8_value {
        println!("three");
    }
}
```

# 实践练习

现在让我们通过一些练习来巩固所学的控制流知识。

## 练习 1：判断闰年

编写一个函数来判断给定年份是否为闰年：

```rust
fn is_leap_year(year: i32) -> bool {
    // TODO: 实现闰年判断
    // 提示: 能被4整除但不能被100整除，或者能被400整除
    false
}

fn main() {
    println!("2020 是闰年吗? {}", is_leap_year(2020));
    println!("2021 是闰年吗? {}", is_leap_year(2021));
    println!("2000 是闰年吗? {}", is_leap_year(2000));
    println!("1900 是闰年吗? {}", is_leap_year(1900));
}
```

## 练习 2：斐波那契数列

使用循环生成斐波那契数列的前 n 项：

```rust
fn fibonacci(n: u32) -> Vec<u32> {
    // TODO: 实现斐波那契数列生成
    vec![]
}

fn main() {
    let fib = fibonacci(10);
    println!("前10项斐波那契数列: {:?}", fib);
}
```

## 练习 3：成绩等级

根据分数返回成绩等级（A-F）：

```rust
enum Grade {
    A,
    B,
    C,
    D,
    F,
}

fn score_to_grade(score: u32) -> Grade {
    // TODO: 根据分数返回等级
    // 90-100: A, 80-89: B, 70-79: C, 60-69: D, 0-59: F
    Grade::F
}

fn main() {
    let scores = vec![95, 85, 75, 65, 55];
    for score in scores {
        let grade = score_to_grade(score);
        println!("分数 {} 的等级是: {:?}", score, grade);
    }
}
```

## 挑战：猜数字游戏

实现一个简单的猜数字游戏：

```rust
use std::io;
use std::cmp::Ordering;

fn main() {
    println!("猜数字游戏！");

    let secret_number = 42; // 秘密数字

    loop {
        println!("请输入你的猜测：");

        let mut guess = String::new();
        io::stdin()
            .read_line(&mut guess)
            .expect("读取失败");

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        println!("你猜测的数字是: {}", guess);

        // TODO: 使用 match 比较 guess 和 secret_number
        // 并给出"太小"、"太大"或"你赢了"的提示
    }
}
```

完成这些练习后，你将对 Rust 的控制流有更深入的理解！
