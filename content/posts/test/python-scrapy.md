---
title: "Python爬虫基础：使用Requests和BeautifulSoup爬取网页数据"
date: 2025-12-24T17:00:00+08:00
lastmod: 2025-12-24T17:00:00+08:00
draft: false
categories: ["Python", "爬虫"]
tags: ["Python", "爬虫", "Requests", "BeautifulSoup"]
keywords: ["Python", "爬虫", "Requests", "BeautifulSoup", "网页爬取"]
description: "Python爬虫基础教程，使用Requests和BeautifulSoup爬取网页数据。"
featuredImage: "/images/05.jpg"
author: "博主"
---

# Python爬虫基础：使用Requests和BeautifulSoup爬取网页数据

网络爬虫是一种自动获取网页内容的程序，它可以按照预定的规则从互联网上抓取信息。Python是编写爬虫的常用语言，因为它有丰富的第三方库支持。

{{< figure src="https://miro.medium.com/v2/resize:fit:1400/0*J5y4mS2tW6DgB503.jpg" alt="Python爬虫" title="Python爬虫" >}}

## 1. 环境准备

### 安装必要的库

```bash
# 安装Requests库，用于发送HTTP请求
pip install requests

# 安装BeautifulSoup4，用于解析HTML
pip install beautifulsoup4

# 安装lxml，用于解析XML/HTML
pip install lxml
```

## 2. Requests库基础

### 发送GET请求

```python
import requests

# 发送GET请求
response = requests.get('https://www.example.com')

# 获取响应状态码
print(f'Status code: {response.status_code}')

# 获取响应头
print(f'Headers: {response.headers}')

# 获取响应内容（文本形式）
print(f'Content: {response.text[:100]}...')

# 获取响应内容（二进制形式）
# print(response.content)
```

### 发送POST请求

```python
# 发送POST请求
payload = {'key1': 'value1', 'key2': 'value2'}
response = requests.post('https://httpbin.org/post', data=payload)

# 获取响应内容
print(response.text)
```

### 设置请求头

```python
# 设置请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

response = requests.get('https://www.example.com', headers=headers)
```

### 处理Cookie

```python
# 发送带有Cookie的请求
cookies = {'username': 'test_user'}
response = requests.get('https://httpbin.org/cookies', cookies=cookies)

# 获取响应中的Cookie
print(f'Cookies: {response.cookies}')
```

### 处理超时

```python
# 设置超时时间
try:
    response = requests.get('https://www.example.com', timeout=5)
except requests.exceptions.Timeout:
    print('Request timed out')
except requests.exceptions.RequestException as e:
    print(f'An error occurred: {e}')
```

## 3. BeautifulSoup4基础

### 解析HTML

```python
from bs4 import BeautifulSoup
import requests

# 获取HTML内容
url = 'https://www.example.com'
response = requests.get(url)
html_content = response.text

# 创建BeautifulSoup对象
# 使用lxml解析器
soup = BeautifulSoup(html_content, 'lxml')

# 或者使用html.parser解析器
# soup = BeautifulSoup(html_content, 'html.parser')

# 查看HTML结构
print(soup.prettify()[:200])
```

### 查找元素

```python
# 通过标签名查找
print(soup.title)
print(soup.title.name)
print(soup.title.string)
print(soup.h1)

# 通过id查找
# print(soup.find(id='content'))

# 通过class查找
# print(soup.find_all(class_='item'))

# 通过CSS选择器查找
# print(soup.select('.item'))
# print(soup.select('#content > .item'))

# 查找所有链接
links = soup.find_all('a')
for link in links:
    print(f'Link text: {link.text}, URL: {link.get("href")}')
```

### 提取文本和属性

```python
# 提取文本
# print(soup.get_text())

# 提取属性
# img = soup.find('img')
# print(img.get('src'))
```

## 4. 实战：爬取知乎热门话题

```python
import requests
from bs4 import BeautifulSoup

# 设置请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

# 知乎热门话题URL
url = 'https://www.zhihu.com/hot'

# 发送请求
response = requests.get(url, headers=headers)

# 解析HTML
if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'lxml')
    
    # 查找热门话题列表
    hot_list = soup.find_all('div', class_='HotItem-content')
    
    # 提取话题信息
    for i, item in enumerate(hot_list[:10], 1):
        # 话题标题
        title = item.find('h2', class_='HotItem-title').text.strip()
        # 话题链接
        link = item.find('a')['href']
        # 话题热度
        heat = item.find('div', class_='HotItem-metrics').text.strip()
        
        print(f'{i}. {title}')
        print(f'   链接: {link}')
        print(f'   热度: {heat}')
        print()
else:
    print(f'Request failed with status code: {response.status_code}')
```

## 5. 实战：爬取豆瓣电影Top250

```python
import requests
from bs4 import BeautifulSoup

# 设置请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

# 豆瓣电影Top250URL模板
url_template = 'https://movie.douban.com/top250?start={}&filter='

# 存储电影信息
movies = []

# 爬取10页数据
for page in range(0, 250, 25):
    url = url_template.format(page)
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'lxml')
        movie_list = soup.find('ol', class_='grid_view').find_all('li')
        
        for movie in movie_list:
            # 电影排名
            rank = movie.find('em').text
            # 电影名称
            title = movie.find('span', class_='title').text
            # 电影评分
            rating = movie.find('span', class_='rating_num').text
            # 评价人数
            votes = movie.find('span', class_='inq')
            quote = votes.text if votes else '暂无评价'
            
            movies.append({
                'rank': rank,
                'title': title,
                'rating': rating,
                'quote': quote
            })
    else:
        print(f'Page {page//25+1} failed')
        break

# 打印结果
for movie in movies[:10]:
    print(f"{movie['rank']}. {movie['title']} - {movie['rating']}")
    print(f"   {movie['quote']}")
    print()
```

## 6. 爬虫的注意事项

1. **遵守robots.txt规则**：在爬取网站前，查看网站的robots.txt文件，了解网站允许爬取的范围
2. **设置合理的爬取频率**：不要过快地发送请求，避免对网站服务器造成压力
3. **使用代理IP**：如果需要大量爬取，可以使用代理IP避免IP被封
4. **处理异常情况**：编写健壮的代码，处理各种异常情况
5. **尊重网站版权**：不要将爬取的数据用于商业用途，尊重网站的知识产权

## 7. 高级爬虫技术

- **使用Scrapy框架**：更强大的爬虫框架，支持并发、分布式爬取
- **使用Selenium**：用于爬取JavaScript动态生成的内容
- **使用Pyppeteer**：无头Chrome浏览器，用于处理复杂的JavaScript渲染
- **使用Redis**：用于存储爬虫队列和去重
- **使用MongoDB**：用于存储爬取的数据

## 8. 推荐学习资源

- [Requests官方文档](https://docs.python-requests.org/en/latest/)
- [BeautifulSoup4官方文档](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [Python爬虫教程 - 廖雪峰](https://www.liaoxuefeng.com/wiki/1016959663602400/1018106017947904)
- [Python3网络爬虫开发实战](https://book.douban.com/subject/30321838/)

{{< details summary="常见爬虫问题及解决方案" >}}
| 问题 | 解决方案 |
|------|------|
| 网站返回403 Forbidden | 设置合理的User-Agent，模拟浏览器请求 |
| 网站返回503 Service Unavailable | 设置更长的超时时间，增加请求间隔 |
| 网站使用JavaScript动态加载内容 | 使用Selenium或Pyppeteer处理 |
| 网站有反爬虫机制 | 使用代理IP，设置随机请求头，模拟人类行为 |
| 爬取速度慢 | 使用并发爬取，如Scrapy框架 |
{{< /details >}}

## 9. 总结

通过本教程，你已经学会了使用Python的Requests库和BeautifulSoup库进行基础的网页爬取。这两个库是Python爬虫的基础工具，掌握它们可以帮助你爬取大多数静态网页。

爬虫是一项强大的技术，但也需要谨慎使用。在爬取网站时，一定要遵守网站的规则和相关法律法规，做一个负责任的爬虫开发者。

继续学习高级爬虫技术，你将能够处理更复杂的爬取场景，如动态网页、反爬虫机制等。