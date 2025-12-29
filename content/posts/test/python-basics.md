---
title: "Python基础入门：从安装到第一个程序"
date: 2025-12-24T14:00:00+08:00
lastmod: 2025-12-24T14:00:00+08:00
draft: false
categories: ["Python"]
tags: ["Python", "基础", "入门"]
keywords: ["Python", "基础", "安装", "第一个程序"]
description: "Python基础入门教程，包括安装、环境配置和第一个程序编写。"
featuredImage: ""
author: "博主"
---

# Python基础入门：从安装到第一个程序

## 1. Python简介

Python是一种高级编程语言，以其简洁的语法和强大的功能而闻名。它广泛应用于Web开发、数据分析、人工智能、机器学习等领域。

{{< figure src="https://www.python.org/static/img/python-logo-large.png" alt="Python Logo" title="Python Logo" >}}

## 2. 安装Python

### Windows安装

1. 访问[Python官网](https://www.python.org/downloads/)下载最新版本的Python
2. 运行安装程序，勾选"Add Python to PATH"
3. 点击"Install Now"完成安装

### macOS安装

```bash
# 使用Homebrew安装
brew install python
```

### Linux安装

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3 python3-pip
```

## 3. 第一个Python程序

创建一个名为`hello.py`的文件，内容如下：

```python
print("Hello, World!")
print("Welcome to Python!")
```

在命令行中运行：

```bash
python hello.py
```

输出结果：
```
Hello, World!
Welcome to Python!
```

## 4. Python基本语法

### 变量和数据类型

```python
# 字符串
name = "Python"

# 整数
age = 33

# 浮点数
salary = 1000.50

# 布尔值
is_active = True

# 列表
fruits = ["apple", "banana", "cherry"]

# 字典
person = {"name": "Alice", "age": 25}
```

### 条件语句

```python
x = 10
if x > 5:
    print("x is greater than 5")
elif x == 5:
    print("x is equal to 5")
else:
    print("x is less than 5")
```

### 循环语句

```python
# for循环
for i in range(5):
    print(i)

# while循环
count = 0
while count < 5:
    print(count)
    count += 1
```

## 5. Python常用库

| 库名 | 用途 |
|------|------|
| NumPy | 数值计算 |
| Pandas | 数据分析 |
| Matplotlib | 数据可视化 |
| Requests | HTTP请求 |
| BeautifulSoup | 网页解析 |
| Django | Web框架 |
| Flask | Web框架 |
| Scikit-learn | 机器学习 |

## 6. 学习资源

- [Python官网](https://www.python.org/)
- [Python教程](https://docs.python.org/3/tutorial/)
- [Real Python](https://realpython.com/)
- [Python Crash Course](https://nostarch.com/pythoncrashcourse2e)

{{< details summary="查看更多资源" >}}
- [Python Cookbook](https://www.oreilly.com/library/view/python-cookbook-3rd/9781449357337/)
- [Effective Python](https://effectivepython.com/)
- [Python for Data Analysis](https://www.oreilly.com/library/view/python-for-data/9781491957653/)
{{< /details >}}

## 7. 总结

Python是一种功能强大、易于学习的编程语言，适合各种编程任务。通过本教程，你已经学会了：

1. Python的安装和环境配置
2. 编写和运行第一个Python程序
3. Python的基本语法
4. Python常用库
5. 学习资源

现在，你可以开始你的Python编程之旅了！