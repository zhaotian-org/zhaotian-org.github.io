---
title: "Django基础入门：创建你的第一个Web应用"
date: 2025-12-24T15:00:00+08:00
lastmod: 2025-12-24T15:00:00+08:00
draft: false
categories: ["Django", "Web开发"]
tags: ["Django", "Web开发", "基础"]
keywords: ["Django", "Web开发", "入门", "第一个应用"]
description: "Django基础入门教程，包括安装、项目创建和第一个Web应用开发。"
featuredImage: ""
author: "博主"
---

# Django基础入门：创建你的第一个Web应用

Django是一个高级Python Web框架，它鼓励快速开发和简洁、实用的设计。Django遵循MVC（Model-View-Controller）架构模式，在Django中通常称为MTV（Model-Template-View）。

{{< figure src="https://www.djangoproject.com/m/img/logos/django-logo-positive.png" alt="Django Logo" title="Django Logo" >}}

## 1. 安装Django

```bash
# 使用pip安装Django
pip install django

# 验证安装
python -m django --version
```

## 2. 创建Django项目

```bash
# 创建项目
django-admin startproject mysite

# 进入项目目录
cd mysite

# 运行开发服务器
python manage.py runserver
```

访问 http://127.0.0.1:8000/ 可以看到Django的欢迎页面。

## 3. 创建第一个应用

```bash
# 创建应用
python manage.py startapp polls
```

## 4. 定义模型

在`polls/models.py`中定义模型：

```python
from django.db import models

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')

    def __str__(self):
        return self.question_text

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.choice_text
```

## 5. 激活模型

1. 在`mysite/settings.py`中添加应用：

```python
INSTALLED_APPS = [
    'polls.apps.PollsConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
```

2. 运行迁移：

```bash
python manage.py makemigrations
python manage.py migrate
```

## 6. 创建超级用户

```bash
python manage.py createsuperuser
```

## 7. 注册模型到管理后台

在`polls/admin.py`中注册模型：

```python
from django.contrib import admin
from .models import Question, Choice

admin.site.register(Question)
admin.site.register(Choice)
```

访问 http://127.0.0.1:8000/admin/ 登录管理后台。

## 8. 创建视图

在`polls/views.py`中创建视图：

```python
from django.http import HttpResponse
from django.shortcuts import render
from .models import Question

def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {'latest_question_list': latest_question_list}
    return render(request, 'polls/index.html', context)

def detail(request, question_id):
    return HttpResponse(f"You're looking at question {question_id}.")

def results(request, question_id):
    return HttpResponse(f"You're looking at the results of question {question_id}.")

def vote(request, question_id):
    return HttpResponse(f"You're voting on question {question_id}.")
```

## 9. 创建URL配置

1. 在`polls/urls.py`中创建URL配置：

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:question_id>/', views.detail, name='detail'),
    path('<int:question_id>/results/', views.results, name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
]
```

2. 在`mysite/urls.py`中包含应用URL：

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('polls/', include('polls.urls')),
    path('admin/', admin.site.urls),
]
```

## 10. 创建模板

在`polls/templates/polls/index.html`中创建模板：

```html
{% if latest_question_list %}
    <ul>
    {% for question in latest_question_list %}
        <li><a href="{% url 'polls:detail' question.id %}">{{ question.question_text }}</a></li>
    {% endfor %}
    </ul>
{% else %}
    <p>No polls are available.</p>
{% endif %}
```

## 11. 运行开发服务器

```bash
python manage.py runserver
```

访问 http://127.0.0.1:8000/polls/ 查看应用。

## 12. Django的核心组件

| 组件 | 描述 |
|------|------|
| ORM | 对象关系映射，用于数据库操作 |
| Admin | 自动生成的管理后台 |
| URL Routing | 灵活的URL配置 |
| Template Engine | 强大的模板系统 |
| Forms | 表单处理 |
| Authentication | 认证系统 |
| Sessions | 会话管理 |
| Middleware | 中间件机制 |

## 13. 推荐学习资源

- [Django官方文档](https://docs.djangoproject.com/)
- [Django教程](https://docs.djangoproject.com/en/5.0/intro/tutorial01/)
- [Django for Beginners](https://djangoforbeginners.com/)

{{< details summary="Django项目结构" >}}
```
mysite/
├── manage.py
├── mysite/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── polls/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── migrations/
    │   └── __init__.py
    ├── models.py
    ├── tests.py
    ├── urls.py
    ├── views.py
    └── templates/
        └── polls/
            └── index.html
```
{{< /details >}}

## 14. 总结

通过本教程，你已经学会了：

1. Django的安装和环境配置
2. 创建Django项目和应用
3. 定义模型和迁移数据库
4. 使用Django管理后台
5. 创建视图、URL和模板
6. 运行开发服务器

Django是一个功能强大的Web框架，它提供了许多内置功能，可以帮助你快速开发高质量的Web应用。继续学习Django，你将能够构建更复杂的Web应用。