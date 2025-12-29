---
title: "Flask基础入门：构建轻量级Web应用"
date: 2025-12-24T16:00:00+08:00
lastmod: 2025-12-24T16:00:00+08:00
draft: false
categories: ["Flask", "Web开发"]
tags: ["Flask", "Web开发", "轻量级"]
keywords: ["Flask", "Web开发", "入门", "轻量级应用"]
description: "Flask基础入门教程，包括安装、项目创建和轻量级Web应用开发。"
featuredImage: ""
author: "博主"
---

# Flask基础入门：构建轻量级Web应用

Flask是一个轻量级的Python Web框架，它被设计为简单易用，同时具有扩展性。Flask基于Werkzeug WSGI工具箱和Jinja2模板引擎。

{{< figure src="https://flask.palletsprojects.com/en/3.0.x/_images/flask-logo.png" alt="Flask Logo" title="Flask Logo" >}}

## 1. 安装Flask

```bash
# 使用pip安装Flask
pip install flask

# 验证安装
python -c "import flask; print(flask.__version__)"
```

## 2. 第一个Flask应用

创建一个名为`app.py`的文件，内容如下：

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, Flask!'

if __name__ == '__main__':
    app.run(debug=True)
```

运行应用：

```bash
python app.py
```

访问 http://127.0.0.1:5000/ 可以看到"Hello, Flask!"。

## 3. 路由和视图函数

```python
# 基本路由
@app.route('/')
def index():
    return 'Index Page'

# 动态路由
@app.route('/user/<username>')
def show_user_profile(username):
    return f'User {username}'

# 带类型的动态路由
@app.route('/post/<int:post_id>')
def show_post(post_id):
    return f'Post {post_id}'

# 多个URL规则指向同一个函数
@app.route('/projects/')
@app.route('/our-projects/')
def projects():
    return 'The project page'
```

## 4. HTTP方法

```python
from flask import request

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return 'Login POST'
    else:
        return 'Login GET'
```

## 5. 模板渲染

### 创建模板

在项目根目录创建`templates`文件夹，并创建`hello.html`文件：

```html
<!DOCTYPE html>
<html>
<head>
    <title>Hello Flask</title>
</head>
<body>
    <h1>Hello, {{ name }}!</h1>
    <p>This is a Flask template.</p>
</body>
</html>
```

### 渲染模板

```python
from flask import render_template

@app.route('/hello/<name>')
def hello(name):
    return render_template('hello.html', name=name)
```

## 6. 表单处理

```python
from flask import request, render_template, redirect, url_for

@app.route('/form', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        name = request.form['name']
        return redirect(url_for('hello', name=name))
    return render_template('form.html')
```

创建`form.html`模板：

```html
<!DOCTYPE html>
<html>
<head>
    <title>Form Example</title>
</head>
<body>
    <form method="post">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name">
        <input type="submit" value="Submit">
    </form>
</body>
</html>
```

## 7. 静态文件

在项目根目录创建`static`文件夹，用于存放CSS、JavaScript和图片等静态文件。

### 在模板中使用静态文件

```html
<link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
<script src="{{ url_for('static', filename='script.js') }}"></script>
<img src="{{ url_for('static', filename='image.jpg') }}" alt="Static Image">
```

## 8. 会话管理

```python
from flask import session, redirect, url_for, request

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))
```

## 9. 错误处理

```python
@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(error):
    return render_template('500.html'), 500
```

## 10. Flask扩展

Flask有许多扩展，可以增强其功能：

| 扩展 | 用途 |
|------|------|
| Flask-SQLAlchemy | ORM数据库支持 |
| Flask-Migrate | 数据库迁移 |
| Flask-Login | 用户认证 |
| Flask-WTF | 表单处理 |
| Flask-RESTful | REST API支持 |
| Flask-Caching | 缓存支持 |
| Flask-Mail | 邮件发送 |
| Flask-Admin | 管理后台 |

## 11. 示例：待办事项应用

```python
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)
app.secret_key = 'your-secret-key'

todos = []

@app.route('/')
def index():
    return render_template('todo.html', todos=todos)

@app.route('/add', methods=['POST'])
def add_todo():
    todo = request.form['todo']
    todos.append(todo)
    return redirect(url_for('index'))

@app.route('/delete/<int:index>')
def delete_todo(index):
    if 0 <= index < len(todos):
        todos.pop(index)
    return redirect(url_for('index'))
```

创建`todo.html`模板：

```html
<!DOCTYPE html>
<html>
<head>
    <title>Todo List</title>
</head>
<body>
    <h1>Todo List</h1>
    <form method="post" action="{{ url_for('add_todo') }}">
        <input type="text" name="todo" placeholder="Add a todo">
        <input type="submit" value="Add">
    </form>
    <ul>
        {% for todo in todos %}
        <li>
            {{ todo }}
            <a href="{{ url_for('delete_todo', index=loop.index0) }}">Delete</a>
        </li>
        {% endfor %}
    </ul>
</body>
</html>
```

## 12. 部署Flask应用

### 使用Gunicorn

```bash
# 安装Gunicorn
pip install gunicorn

# 运行应用
gunicorn -w 4 app:app
```

### 使用Docker

创建`Dockerfile`：

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "app:app"]
```

创建`requirements.txt`：

```
flask
gunicorn
```

构建和运行Docker容器：

```bash
docker build -t flask-app .
docker run -p 5000:5000 flask-app
```

## 13. 推荐学习资源

- [Flask官方文档](https://flask.palletsprojects.com/)
- [Flask Mega-Tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world)
- [Flask Web开发实战](https://book.douban.com/subject/27075030/)

{{< details summary="Flask与Django的比较" >}}
| 特性 | Flask | Django |
|------|-------|--------|
| 设计理念 | 轻量级、灵活 | 全功能、 batteries included |
| 学习曲线 | 较平缓 | 较陡峭 |
| 性能 | 更快 | 相对较慢 |
| 扩展性 | 高度可扩展 | 有一定限制 |
| 适合项目 | 小型应用、API、微服务 | 大型应用、内容管理系统 |
| ORM | 无内置，需扩展 | 内置Django ORM |
| 管理后台 | 无内置，需扩展 | 内置强大的管理后台 |
{{< /details >}}

## 14. 总结

Flask是一个轻量级、灵活的Python Web框架，适合构建各种规模的Web应用。通过本教程，你已经学会了：

1. Flask的安装和环境配置
2. 创建第一个Flask应用
3. 路由和视图函数
4. 模板渲染
5. 表单处理
6. 会话管理
7. 错误处理
8. Flask扩展
9. 简单的待办事项应用
10. 部署Flask应用

Flask的简洁设计和强大的扩展性使其成为Web开发的热门选择。继续学习Flask，你将能够构建更复杂的Web应用和API。