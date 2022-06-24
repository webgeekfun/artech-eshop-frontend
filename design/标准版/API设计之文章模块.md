# 文章模块 API

## 1. [Auth] 创建文章
   - path: /article/create
   - method: post
   - params: { subject: string, cover: string?, abstract: string?, content: string, isPublished: bool, tags: array[string] }
   - return: { articleDetails }
   - 说明：content是带html标记的文本内容
## 2. [Auth] 修改文章
   - path: /article/{articleId:int}/update
   - method: post
   - params: { articleId: int, cover: string?, abstract: string?, subject: string, content: string, isPublished: bool, tags: array[string] }
   - return: { articleDetails }
## 3. [Auth] 删除文章
   - path: /article/{articleId:int}/delete
   - method: post
   - params: { articleId: int }
   - return: 
## 5. 获取所有文章标签
   - path: /article-tag/list
   - method: get
   - params: {  }
   - return: { tags: array[tag] }
## 6. 获取文章列表
   - path: /article/list
   - method: get
   - params: { tagId: int?, page: int?, pageSize: int? }
   - return: { articles: array[article], pagination: pagination }
## 7. 获取文章详情
   - path: /article/{articleId:int}
   - method: get
   - params: { articleId: int }
   - return: { articleDetails }
## 8. 获取相关文章
   - path: /article/{articleId:int}/related
   - method: get
   - params: { articleId: int, count: int? }
   - return: { articles: array[article] }


## API 中的对象定义

```yml
tag:
  tagId: int
  name: string
  articleCount: int

article:
  articleId: int
  subject: string
  cover: string
  abastract: string
  author: user
  updateTime: date
  tags: array[tag]

articleDetails:
  articleId: int
  subject: string
  cover: string
  abastract: string
  content: string
  author: user
  updateTime: date
  tags: array[tag]
  pre: {
     articleId: int,
     subject: string
  },
  next: {
     articleId: int,
     subject: string
  }

user:
  userId: int
  username: string
  avatar: string
```
