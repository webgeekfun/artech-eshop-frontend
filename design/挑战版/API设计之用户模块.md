# 用户模块 API

## 1. 用户注册
   - path: /user/register
   - method: post
   - params: { phoneNumber: string, password: string, confirmPassword: string }
      - 所有输入参数不能为空
      - 密码最少六位，confirmPassword和password必须一致
      - phoneNumber只验证格式，用正则 `^1[0-9]{10}$`
   - return: { token }
   - 逻辑说明
      - 用户名直接生成，格式为：'用户'+手机号后四位，如：用户1213
   - 返回数据
      ```json
      {
         "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjA3MDUzNTYzLCJqdGkiOiJmZThhNTE4ZDk5YmU0ZWQxYWQ4MmYxMGY5NGUxMWExMCIsInVzZXJfaWQiOjEyfQ.e08WWMsdULK4X9qFtyzbCMP0P5PQGno2ae6IjkJUxqM",
         "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYwNzEzOTY2MywianRpIjoiNTE1ODg5YTAwMGIyNGE0NGFjODFlYWM2ZTk0MzJhZTUiLCJ1c2VyX2lkIjoxMn0.9WDeRI3Mni42UjRENPX2ER2newLJGV6G6DAWr9873ns",
         "expireTime": "2020-12-04T11:46:03.627815",
         "issueTime": "2020-12-04T11:41:03.627815"
      }
      ```
   - 错误提示返回数据

      ```json
      # 手机号有指定参数，但参数值为空时
      {
         "errorMessage": {
            "phoneNumber": [
               "该字段不能为空。"
            ],
            "password": [
               "密码不能为空。"
            ]
         },
         "errorCode": "003.400.002"
      }
      ```
## 2. 用户登录
   - path: /user/login
   - method: post
   - params: { phoneNumber: string, password: string }
   - return: { token }
   - 逻辑说明
      - 用户不存在或密码不正确都返回相同的错误。
   - 返回数据
      ```json
      {
         "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjA3MDUzNTYzLCJqdGkiOiJmZThhNTE4ZDk5YmU0ZWQxYWQ4MmYxMGY5NGUxMWExMCIsInVzZXJfaWQiOjEyfQ.e08WWMsdULK4X9qFtyzbCMP0P5PQGno2ae6IjkJUxqM",
         "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYwNzEzOTY2MywianRpIjoiNTE1ODg5YTAwMGIyNGE0NGFjODFlYWM2ZTk0MzJhZTUiLCJ1c2VyX2lkIjoxMn0.9WDeRI3Mni42UjRENPX2ER2newLJGV6G6DAWr9873ns",
         "expireTime": "2020-12-04T11:46:03.627815",
         "issueTime": "2020-12-04T11:41:03.627815"
      }
      ```
   - 错误提示返回数据
      ```json
      # 用户登录，用户输入为空或用户不存在
      {
         "errorMessage": "登录失败，用户或密码不正确",
         "errorCode": "003.401.001"
      }
      ```
## 3. [Auth] 获取本人信息
   - path: /user/profile
   - method: get
   - params: 
   - return: { profile }
   - 返回数据
      ```json
      {
         "userId": 51,
         "username": "用户8888",
         "phoneNumber": "12104130659",
         "receiverUserName": "收件人",
         "receiverPhoneNumber": "12899997777",
         "receiverProvince": "北京",
         "receiverCity": "西城",
         "receiverStreet": "北苑路"
      }
      ```

## 4. [Auth] 更新本人信息
   - path: /user/update
   - method: post
   - params: { profile }
   - return: { profile }
   - 逻辑说明；
     - 用户名可以重复，手机号不能重复
   - 返回数据
      ```json
      {
         "userId": 51,
         "username": "用户8888",
         "phoneNumber": "12104130659",
         "receiverUserName": "收件人",
         "receiverPhoneNumber": "12899997777",
         "receiverProvince": "北京",
         "receiverCity": "西城",
         "receiverStreet": "北苑路"
      }
      ```
   - 错误提示返回数据
      ```json
      # 用户数据有效性检查
      {
         "errorMessage": {
            "username": [
                  "请确保这个字段不能超过 64 个字符。"
            ],
            "receiverUserName": [
                  "请确保这个字段不能超过 32 个字符。"
            ],
            "receiverPhoneNumber": [
                  "手机号码验证未通过。"
            ],
            "receiverProvince": [
                  "请确保这个字段不能超过 16 个字符。"
            ],
            "receiverCity": [
                  "请确保这个字段不能超过 16 个字符。"
            ],
            "receiverStreet": [
                  "请确保这个字段不能超过 256 个字符。"
            ]
         },
         "errorCode": "003.400.002"
      }
      ```
## 5. 刷新 accessToken
   - path: /user/refresh-token
   - method: post
   - params: { accessToken: string, refreshToken: string }
   - return: { token }
   - 逻辑说明
      - 每次生成新的refreshToken，原refreshToken要失效
   - 返回数据
      ```json
      {
         "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjA3MDUzNTYzLCJqdGkiOiJmZThhNTE4ZDk5YmU0ZWQxYWQ4MmYxMGY5NGUxMWExMCIsInVzZXJfaWQiOjEyfQ.e08WWMsdULK4X9qFtyzbCMP0P5PQGno2ae6IjkJUxqM",
         "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYwNzEzOTY2MywianRpIjoiNTE1ODg5YTAwMGIyNGE0NGFjODFlYWM2ZTk0MzJhZTUiLCJ1c2VyX2lkIjoxMn0.9WDeRI3Mni42UjRENPX2ER2newLJGV6G6DAWr9873ns",
         "expireTime": "2020-12-04T11:46:03.627815",
         "issueTime": "2020-12-04T11:41:03.627815"
      }
      ```
   - 错误提示返回数据
      ```json
      # Token无效或已过期
      {
         "errorMessage": "Token无效或已过期。",
         "errorCode": "003.401.001"
      }
      # 未提供refreshToken参数
      {
         "refreshToken": [
            "该字段是必填项。"
         ]
      }
      ```

## API 中的对象定义

```yml
token:
   accessToken: string,
   expireTime: date,
   issueTime: date,
   refreshToken: string

profile:
   userId: int,
   username: string,
   phoneNumber: string,
   receiverUserName: string?,
   receiverPhoneNumber: string?,
   receiverProvince: string?,
   receiverCity: string?,
   receiverStreet: string?
```
