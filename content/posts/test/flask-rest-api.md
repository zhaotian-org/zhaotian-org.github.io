---
title: "Flask REST API开发：从基础到部署"
date: 2024-01-16T10:00:00+08:00
categories: ["Flask", "后端开发"]
tags: ["flask", "rest-api", "python", "sqlalchemy", "authentication"]
---

# Flask REST API开发

Flask是一个轻量级的Python Web框架，非常适合构建REST API。它提供了灵活的路由系统和简洁的API设计，让开发者可以快速构建高效的Web服务。

## 基础REST API

### 安装Flask

```bash
pip install flask
```

### 简单的API示例

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

# 模拟数据
tasks = [
    {"id": 1, "title": "完成Flask教程", "description": "学习Flask基础知识", "done": False},
    {"id": 2, "title": "构建REST API", "description": "使用Flask创建API", "done": False}
]

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify({"tasks": tasks})

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = [task for task in tasks if task['id'] == task_id]
    if len(task) == 0:
        return jsonify({"error": "任务不存在"}), 404
    return jsonify({"task": task[0]})

@app.route('/api/tasks', methods=['POST'])
def create_task():
    if not request.json or not 'title' in request.json:
        return jsonify({"error": "缺少标题"}), 400
    task = {
        "id": tasks[-1]['id'] + 1,
        "title": request.json['title'],
        "description": request.json.get('description', ""),
        "done": False
    }
    tasks.append(task)
    return jsonify({"task": task}), 201

if __name__ == '__main__':
    app.run(debug=True)
```

## 使用Flask-RESTful

Flask-RESTful是一个扩展，提供了快速构建REST API的工具。

### 安装Flask-RESTful

```bash
pip install flask-restful
```

### 使用Flask-RESTful创建API

```python
from flask import Flask
from flask_restful import Resource, Api, reqparse

app = Flask(__name__)
api = Api(app)

# 模拟数据
tasks = {}

# 请求解析器
parser = reqparse.RequestParser()
parser.add_argument('title', required=True, help="标题不能为空")
parser.add_argument('description')

class TaskList(Resource):
    def get(self):
        return {"tasks": tasks}
    
    def post(self):
        args = parser.parse_args()
        task_id = len(tasks) + 1
        task = {
            "id": task_id,
            "title": args['title'],
            "description": args.get('description', ""),
            "done": False
        }
        tasks[task_id] = task
        return task, 201

class Task(Resource):
    def get(self, task_id):
        if task_id not in tasks:
            return {"error": "任务不存在"}, 404
        return {"task": tasks[task_id]}
    
    def put(self, task_id):
        if task_id not in tasks:
            return {"error": "任务不存在"}, 404
        args = parser.parse_args()
        tasks[task_id]['title'] = args['title']
        if 'description' in args:
            tasks[task_id]['description'] = args['description']
        tasks[task_id]['done'] = args.get('done', False)
        return {"task": tasks[task_id]}
    
    def delete(self, task_id):
        if task_id not in tasks:
            return {"error": "任务不存在"}, 404
        del tasks[task_id]
        return {"message": "任务已删除"}

# 注册资源
api.add_resource(TaskList, '/api/tasks')
api.add_resource(Task, '/api/tasks/<int:task_id>')

if __name__ == '__main__':
    app.run(debug=True)
```

## 数据库集成

### 安装SQLAlchemy

```bash
pip install flask-sqlalchemy
```

### 配置数据库

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    done = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "done": self.done
        }

# 创建数据库
db.create_all()
```

### 集成到API

```python
class TaskList(Resource):
    def get(self):
        tasks = Task.query.all()
        return {"tasks": [task.to_dict() for task in tasks]}
    
    def post(self):
        args = parser.parse_args()
        task = Task(title=args['title'], description=args.get('description'))
        db.session.add(task)
        db.session.commit()
        return task.to_dict(), 201

class Task(Resource):
    def get(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return {"error": "任务不存在"}, 404
        return {"task": task.to_dict()}
    
    def put(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return {"error": "任务不存在"}, 404
        args = parser.parse_args()
        task.title = args['title']
        if 'description' in args:
            task.description = args['description']
        if 'done' in args:
            task.done = args['done']
        db.session.commit()
        return {"task": task.to_dict()}
    
    def delete(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return {"error": "任务不存在"}, 404
        db.session.delete(task)
        db.session.commit()
        return {"message": "任务已删除"}
```

## 认证和授权

### 使用Flask-JWT-Extended

```bash
pip install flask-jwt-extended
```

### 配置JWT

```python
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # 生产环境中使用环境变量
jwt = JWTManager(app)

# 用户模型
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

# 登录路由
@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    
    user = User.query.filter_by(username=username).first()
    if not user or password != user.password:  # 生产环境中使用密码哈希
        return jsonify({"error": "用户名或密码错误"}), 401
    
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

# 保护路由
class TaskList(Resource):
    @jwt_required()
    def get(self):
        # 受保护的代码
        pass
```

## API测试

### 使用Postman测试

1. **GET /api/tasks** - 获取所有任务
2. **GET /api/tasks/1** - 获取单个任务
3. **POST /api/tasks** - 创建新任务
4. **PUT /api/tasks/1** - 更新任务
5. **DELETE /api/tasks/1** - 删除任务

### 使用curl测试

```bash
# 获取所有任务
curl http://localhost:5000/api/tasks

# 创建新任务
curl -X POST -H "Content-Type: application/json" -d '{"title":"新任务","description":"这是一个新任务"}' http://localhost:5000/api/tasks
```

## API文档

### 使用Flask-RESTX

```bash
pip install flask-restx
```

### 集成Swagger文档

```python
from flask_restx import Api, Resource, fields

api = Api(app, version='1.0', title='任务API', description='一个简单的任务管理API')

# 命名空间
ns = api.namespace('tasks', description='任务操作')

# 模型
task_model = api.model('Task', {
    'id': fields.Integer(readonly=True, description='任务ID'),
    'title': fields.String(required=True, description='任务标题'),
    'description': fields.String(description='任务描述'),
    'done': fields.Boolean(description='任务完成状态')
})

# 资源
@ns.route('/')
class TaskList(Resource):
    @ns.doc('list_tasks')
    @ns.marshal_list_with(task_model)
    def get(self):
        """获取所有任务"""
        return Task.query.all()
    
    @ns.doc('create_task')
    @ns.expect(task_model)
    @ns.marshal_with(task_model, code=201)
    def post(self):
        """创建新任务"""
        data = api.payload
        task = Task(title=data['title'], description=data.get('description'))
        db.session.add(task)
        db.session.commit()
        return task, 201
```

## 部署Flask API

### 使用Gunicorn

```bash
pip install gunicorn
```

### 运行Gunicorn

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### 使用Docker部署

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

## REST API最佳实践

| 最佳实践 | 描述 |
|---------|------|
| 使用HTTP方法 | GET（获取）、POST（创建）、PUT（更新）、DELETE（删除） |
| 使用HTTP状态码 | 200 OK、201 Created、400 Bad Request、404 Not Found、500 Internal Server Error |
| 版本化API | /api/v1/tasks、/api/v2/tasks |
| 使用JSON格式 | 所有请求和响应使用JSON格式 |
| 提供过滤和分页 | /api/tasks?page=1&limit=10&status=done |
| 使用认证 | JWT、OAuth2等 |
| 添加速率限制 | 防止API滥用 |
| 提供文档 | Swagger、ReDoc等 |

{{< details title="Flask REST API开发总结" open=false >}}
- 基础API：使用Flask创建简单的REST API
- Flask-RESTful：使用扩展简化API开发
- 数据库集成：使用SQLAlchemy与数据库交互
- 认证授权：使用JWT保护API
- 测试：使用Postman或curl测试API
- 文档：使用Flask-RESTX生成Swagger文档
- 部署：使用Gunicorn和Docker部署API
{{< /details >}}

## 结语

Flask是一个灵活且强大的框架，非常适合构建REST API。通过结合各种扩展，我们可以快速构建出功能完整、性能优良的API服务。

在实际项目中，我们应该根据需求选择合适的扩展，并遵循RESTful设计原则，确保API的易用性和可扩展性。同时，我们还需要考虑安全性、性能和文档等方面，以构建高质量的API服务。