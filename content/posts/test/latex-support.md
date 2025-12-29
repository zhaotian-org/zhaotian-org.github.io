---
title: "Hugo博客LaTeX公式支持使用指南"
date: 2025-12-28T10:00:00+08:00
description: "详细介绍Hugo博客中LaTeX公式的使用方法"
categories: ["技术"]
tags: ["Hugo", "LaTeX", "数学公式"]
author: "博主"
---

## 什么是LaTeX？

LaTeX是一种高质量的排版系统，特别适合生成包含复杂数学公式的文档。在博客中添加LaTeX支持可以让你方便地展示各种数学公式。

## 行内公式

行内公式使用单个美元符号 `$` 包围，例如：

- 勾股定理：$a^2 + b^2 = c^2$
- 欧拉公式：$e^{i\pi} + 1 = 0$
- 二次方程：$ax^2 + bx + c = 0$

## 块级公式

块级公式使用两个美元符号 `$$` 包围，例如：

$$
\frac{d}{dx}f(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

## 常用数学符号

### 微积分

导数：
$$
\frac{dy}{dx} = y' = f'(x)
$$

积分：
$$
\int_{a}^{b} f(x) \, dx
$$

多重积分：
$$
\iint_D f(x,y) \, dxdy
$$

### 线性代数

矩阵：
$$
A = \begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
$$

向量：
$$
\vec{v} = \begin{pmatrix} v_1 \\ v_2 \\ v_3 \end{pmatrix}
$$

矩阵乘法：
$$
AB = C
$$

### 概率论

期望：
$$
E[X] = \sum_{i} x_i P(X = x_i)
$$

方差：
$$
Var(X) = E[X^2] - (E[X])^2
$$

正态分布：
$$
N(\mu, \sigma^2) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

### 希腊字母

| 大写 | 小写 | 名称 |
|------|------|------|
| $A$ | $\alpha$ | alpha |
| $B$ | $\beta$ | beta |
| $\Gamma$ | $\gamma$ | gamma |
| $\Delta$ | $\delta$ | delta |
| $E$ | $\epsilon$ | epsilon |
| $Z$ | $\zeta$ | zeta |
| $H$ | $\eta$ | eta |
| $\Theta$ | $\theta$ | theta |

### 其他常用符号

- 求和：$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$
- 求积：$\prod_{i=1}^{n} i = n!$
- 极限：$\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e$
- 根号：$\sqrt{x} = x^{1/2}$
- 分数：$\frac{a}{b} = a/b$

## 高级公式示例

### 泰勒展开

$$
f(x) = f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \frac{f'''(a)}{3!}(x-a)^3 + \cdots
$$

### 傅里叶变换

$$
\mathcal{F}\{f(t)\}(\omega) = \int_{-\infty}^{\infty} f(t) e^{-i\omega t} dt
$$

### 薛定谔方程

$$
-i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r},t) = \left[ -\frac{\hbar^2}{2m} \nabla^2 + V(\mathbf{r},t) \right] \Psi(\mathbf{r},t)
$$

## 使用注意事项

1. 公式中的反斜杠需要转义，或者在Markdown中使用raw HTML
2. 复杂公式可能需要使用`\\`进行换行
3. 可以使用`\label{}`和`\ref{}`进行公式引用
4. 支持使用`\begin{}`和`\end{}`环境创建各种数学结构

## 总结

通过添加KaTeX支持，我们可以在Hugo博客中方便地使用LaTeX公式。无论是简单的行内公式还是复杂的块级公式，都可以轻松实现。

希望这篇文章对你有所帮助！