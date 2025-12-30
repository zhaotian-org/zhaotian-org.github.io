---
title: "Python装饰器详解：从入门到精通"
date: 2025-12-24T19:00:00+08:00
lastmod: 2025-12-24T19:00:00+08:00
draft: false
categories: ["Python", "进阶"]
tags: ["Python", "装饰器", "进阶"]
keywords: ["Python", "装饰器", "进阶", "函数式编程"]
description: "Python装饰器详解，从基础概念到高级应用，全面掌握Python装饰器。"
featuredImage: "/images/05.jpg"
author: "博主"
---

# Python装饰器详解：从入门到精通

装饰器是Python中一种强大的功能，它允许我们修改函数或类的行为，而无需修改它们的源代码。装饰器是函数式编程的一个重要概念，在Python中被广泛应用于日志记录、性能分析、权限验证等场景。

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/0*aG3x5Dq5Kx6Yj9ZQ.png" alt="Python装饰器" title="Python装饰器" >}}

## 1. 装饰器基础

### 装饰器的定义

装饰器是一个函数，它接受一个函数作为参数，并返回一个新的函数。装饰器的语法糖是`@`符号，放在函数定义的前面。

```python
# 简单的装饰器

def my_decorator(func):
    def wrapper():
        print("装饰器开始执行")
        func()
        print("装饰器结束执行")
    return wrapper

# 使用装饰器@语法
@my_decorator
def say_hello():
    print("Hello, World!")

# 调用函数
say_hello()
```

输出结果：
```
装饰器开始执行
Hello, World!
装饰器结束执行
```

### 装饰器的工作原理

```python
# 不使用@语法，手动应用装饰器
def say_hello():
    print("Hello, World!")

# 手动应用装饰器
say_hello = my_decorator(say_hello)

# 调用函数
say_hello()
```

## 2. 带参数的装饰器

### 装饰带参数的函数

```python
# 装饰带参数的函数
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("装饰器开始执行")
        result = func(*args, **kwargs)
        print("装饰器结束执行")
        return result
    return wrapper

@my_decorator
def add(a, b):
    return a + b

# 调用函数
result = add(10, 20)
print(f"结果: {result}")
```

输出结果：
```
装饰器开始执行
装饰器结束执行
结果: 30
```

### 带参数的装饰器

```python
# 带参数的装饰器
def repeat(n):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for i in range(n):
                print(f"执行第{i+1}次")
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say_hello():
    print("Hello!")

# 调用函数
say_hello()
```

输出结果：
```
执行第1次
Hello!
执行第2次
Hello!
执行第3次
Hello!
```

## 3. 保留函数元信息

### 问题：装饰器丢失函数元信息

```python
@my_decorator
def say_hello():
    """这是一个打招呼的函数"""
    print("Hello, World!")

# 查看函数元信息
print(f"函数名: {say_hello.__name__}")
print(f"函数文档: {say_hello.__doc__}")
```

输出结果：
```
函数名: wrapper
函数文档: None
```

### 解决方案：使用functools.wraps

```python
from functools import wraps

# 保留函数元信息的装饰器
def my_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("装饰器开始执行")
        result = func(*args, **kwargs)
        print("装饰器结束执行")
        return result
    return wrapper

@my_decorator
def say_hello():
    """这是一个打招呼的函数"""
    print("Hello, World!")

# 查看函数元信息
print(f"函数名: {say_hello.__name__}")
print(f"函数文档: {say_hello.__doc__}")
```

输出结果：
```
函数名: say_hello
函数文档: 这是一个打招呼的函数
```

## 4. 常见装饰器应用场景

### 1. 日志记录

```python
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 日志记录装饰器
def log_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger.info(f"调用函数: {func.__name__}")
        logger.info(f"参数: {args}, {kwargs}")
        result = func(*args, **kwargs)
        logger.info(f"返回值: {result}")
        return result
    return wrapper

@log_decorator
def add(a, b):
    return a + b

# 调用函数
add(10, 20)
```

### 2. 性能分析

```python
import time

# 性能分析装饰器
def timing_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        execution_time = end_time - start_time
        print(f"函数 {func.__name__} 执行时间: {execution_time:.4f} 秒")
        return result
    return wrapper

@timing_decorator
def slow_function():
    time.sleep(1)
    return "完成"

# 调用函数
slow_function()
```

### 3. 权限验证

```python
# 权限验证装饰器
def permission_required(permission):
    def decorator(func):
        @wraps(func)
        def wrapper(user, *args, **kwargs):
            if user.get('permission') == permission:
                return func(user, *args, **kwargs)
            else:
                return "权限不足"
        return wrapper
    return decorator

@permission_required('admin')
def admin_only(user):
    return "欢迎管理员"

@permission_required('user')
def user_only(user):
    return "欢迎用户"

# 测试
alice = {'name': 'Alice', 'permission': 'admin'}
bob = {'name': 'Bob', 'permission': 'user'}

print(admin_only(alice))  # 输出: 欢迎管理员
print(admin_only(bob))    # 输出: 权限不足
print(user_only(alice))    # 输出: 欢迎用户
print(user_only(bob))      # 输出: 欢迎用户
```

### 4. 缓存

```python
# 缓存装饰器
cache = {}

def cache_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        key = str(args) + str(kwargs)
        if key in cache:
            print(f"从缓存获取结果")
            return cache[key]
        result = func(*args, **kwargs)
        cache[key] = result
        print(f"缓存结果")
        return result
    return wrapper

@cache_decorator
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 测试
print(fibonacci(10))
print(fibonacci(10))  # 第二次调用会从缓存获取结果
```

### 5. 异常处理

```python
# 异常处理装饰器
def exception_handler(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            print(f"发生异常: {type(e).__name__}: {e}")
            return None
    return wrapper

@exception_handler
def divide(a, b):
    return a / b

# 测试
print(divide(10, 2))   # 输出: 5.0
print(divide(10, 0))   # 输出: 发生异常: ZeroDivisionError: division by zero 然后返回 None
```

## 5. 类装饰器

### 类装饰器基础

```python
class MyDecorator:
    def __init__(self, func):
        self.func = func
    
    def __call__(self, *args, **kwargs):
        print("类装饰器开始执行")
        result = self.func(*args, **kwargs)
        print("类装饰器结束执行")
        return result

@MyDecorator
def say_hello():
    print("Hello, World!")

# 调用函数
say_hello()
```

### 带参数的类装饰器

```python
class RepeatDecorator:
    def __init__(self, n):
        self.n = n
    
    def __call__(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for i in range(self.n):
                result = func(*args, **kwargs)
            return result
        return wrapper

@RepeatDecorator(3)
def say_hello():
    print("Hello!")

# 调用函数
say_hello()
```

## 6. 装饰器链

### 多个装饰器的应用顺序

```python
def decorator1(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("装饰器1开始执行")
        result = func(*args, **kwargs)
        print("装饰器1结束执行")
        return result
    return wrapper

def decorator2(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("装饰器2开始执行")
        result = func(*args, **kwargs)
        print("装饰器2结束执行")
        return result
    return wrapper

# 装饰器链，从上到下应用
@decorator1
@decorator2
def say_hello():
    print("Hello, World!")

# 调用函数
say_hello()
```

输出结果：
```
装饰器1开始执行
装饰器2开始执行
Hello, World!
装饰器2结束执行
装饰器1结束执行
```

## 7. 装饰器在类中的应用

### 装饰类方法

```python
class MyClass:
    def __init__(self, value):
        self.value = value
    
    @log_decorator
    def my_method(self, x):
        return self.value * x

# 测试
obj = MyClass(10)
obj.my_method(5)
```

### 装饰静态方法

```python
class MyClass:
    @staticmethod
    @log_decorator
    def static_method(x, y):
        return x + y

# 测试
MyClass.static_method(10, 20)
```

### 装饰类

```python
# 装饰类
def class_decorator(cls):
    # 为类添加属性
    cls.new_attribute = "这是一个新属性"
    
    # 为类添加方法
    def new_method(self):
        return "这是一个新方法"
    
    cls.new_method = new_method
    return cls

@class_decorator
class MyClass:
    def __init__(self, value):
        self.value = value

# 测试
obj = MyClass(10)
print(obj.new_attribute)  # 输出: 这是一个新属性
print(obj.new_method())   # 输出: 这是一个新方法
```

## 8. 内置装饰器

Python提供了一些内置的装饰器：

### @staticmethod

将方法转换为静态方法，不需要访问实例或类。

### @classmethod

将方法转换为类方法，接收类作为第一个参数而不是实例。

### @property

将方法转换为属性，允许通过属性访问方法。

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        return self._radius
    
    @radius.setter
    def radius(self, value):
        if value > 0:
            self._radius = value
        else:
            raise ValueError("半径必须大于0")
    
    @property
    def area(self):
        return 3.14159 * self._radius ** 2

# 测试
circle = Circle(5)
print(circle.radius)  # 输出: 5
print(circle.area)    # 输出: 78.53975

circle.radius = 10
print(circle.radius)  # 输出: 10
print(circle.area)    # 输出: 314.159

# circle.radius = -5  # 会引发ValueError
```

## 9. 装饰器的高级应用

### 1. 使用装饰器实现单例模式

```python
# 单例装饰器
def singleton(cls):
    instances = {}
    
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    
    return get_instance

@singleton
class MySingleton:
    def __init__(self, value):
        self.value = value

# 测试
a = MySingleton(10)
b = MySingleton(20)

print(a is b)  # 输出: True
print(a.value) # 输出: 10
print(b.value) # 输出: 10
```

### 2. 使用装饰器实现状态机

```python
# 状态机装饰器
def state_machine(initial_state):
    def decorator(cls):
        cls._state = initial_state
        
        # 保存原始方法
        original_methods = {}
        
        # 遍历类的所有属性
        for name, attr in cls.__dict__.items():
            if callable(attr) and hasattr(attr, '_transition'):
                original_methods[name] = attr
        
        # 替换方法，添加状态检查
        for name, method in original_methods.items():
            transition = method._transition
            
            def wrapper(self, *args, **kwargs):
                if self._state in transition['from_states']:
                    result = method(self, *args, **kwargs)
                    self._state = transition['to_state']
                    return result
                else:
                    return f"当前状态 {self._state} 不允许执行此操作"
            
            setattr(cls, name, wrapper)
        
        return cls
    return decorator

# 状态转换装饰器
def transition(from_states, to_state):
    def decorator(func):
        func._transition = {
            'from_states': from_states,
            'to_state': to_state
        }
        return func
    return decorator

@state_machine('off')
class LightSwitch:
    @transition(from_states=['off'], to_state='on')
    def turn_on(self):
        return "灯亮了"
    
    @transition(from_states=['on'], to_state='off')
    def turn_off(self):
        return "灯灭了"

# 测试
switch = LightSwitch()
print(switch.turn_on())  # 输出: 灯亮了
print(switch.turn_off()) # 输出: 灯灭了
print(switch.turn_off()) # 输出: 当前状态 off 不允许执行此操作
```

## 10. 装饰器的最佳实践

1. **使用functools.wraps**：保留原函数的元信息
2. **保持装饰器简单**：每个装饰器只做一件事
3. **使用清晰的命名**：装饰器名称应该反映其功能
4. **添加文档字符串**：为装饰器添加文档，说明其用途和参数
5. **测试装饰器**：确保装饰器在各种情况下都能正常工作
6. **避免过度使用装饰器**：过多的装饰器会使代码难以理解和调试
7. **使用类装饰器**：对于复杂的装饰器，使用类装饰器可以提供更好的封装

## 11. 总结

装饰器是Python中一种强大的功能，它允许我们在不修改源代码的情况下扩展函数或类的功能。通过本教程，你已经学会了：

1. 装饰器的基础概念和工作原理
2. 如何创建简单的装饰器
3. 如何创建带参数的装饰器
4. 如何保留函数的元信息
5. 装饰器的常见应用场景
6. 类装饰器的使用
7. 装饰器链的应用
8. Python内置装饰器
9. 装饰器的高级应用
10. 装饰器的最佳实践

装饰器是Python编程中的一个重要概念，掌握装饰器可以让你的代码更加简洁、优雅和可维护。继续学习和实践，你将能够灵活运用装饰器解决各种问题。