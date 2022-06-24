# 评论模块 API

## 1. 获取评论列表
   - path: /comment/list
   - method: get
   - params: { appName: string, objectId: int, page: int?, pageSize: int? }
   - return: { comments: array[comment], pagination: pagination }
   - description: appName enum ['product', 'article'], 返回的数据按时间倒序排列
## 2. [Auth] 添加评论
   - path: /comment/create
   - method: post
   - params: { appName: string, objectId: int, content: string, score: decimal? }
   - return: { comment }
## 3. [Auth] 删除评论
   - path: /comment/{commentId:int}/delete
   - method: post
   - params: { appName: string, commentId: int }
   - return: 
## 4. [Auth] 回复评论
   - path: /reply/create
   - method: post
   - params: { appName: string, commentId: int, content: string }
   - return: { reply }
## 5. [Auth] 删除回复
   - path: /reply/{replyId:int}/delete
   - method: post
   - params: { appName: string, replyId: int }
   - return: 

## API 中的对象定义

```yml
user:
  userId: int
  username: string
  avatar: string

reply:
  replyId: int
  content: string
  user: user
  createTime: date

comment:
  commentId: int
  content: string
  score: decimal?
  user: user
  createTime: date
  replies: array[reply]
```
