# API设计

每个API都分为四个部分：路径、输入参数、逻辑规则、返回数据。

## 全局规则

### 路径规则

路径规则: 
- /<名词单数>/<动词或形容词>
- /<名词单数>/{id:int}/<动词或形容词>
- CRUD动词限定：list/update，create/delete (针对资源本身)，add/remove (针对关系)
- 获取某个对象的详情，省略形容词details，例如商品详情用/product/{id:int}，而不用/product/{id:int}/details。其他情况不省略。
- 连词用`-`

### 输入参数规则

只使用以下三种方式传参，服务器端不接受其他方式的传参。
- 路由参数，比如 /product/{id:int}, id为路由参数
- QueryString，网址中的问号参数
- RequestBody，统一用RequestBody传参，参数用json格式

HTTP谓词只使用GET和POST，不用PUT、DELETE等其他的谓词。GET只取数据，POST会改变数据。GET都用QueryString方式传参，POST如果是用户输入的参数，比如表单，则用RequestBody方式传参，其他的用QueryString方式。

输入参数的校验规则：
- 参数的类型有以下几种：`int`,`bigint`,`decimal`,`string`,`bool`,`int?`,`bigint?`,`decimal?`,`string?`,`bool?`。问号表示是否可空。
- 每个参数都有类型，如果输入参数不符合类型，则服务器端忽略该参数，如果是可空参数，则认为是null。如果该参数是路由参数，则匹配不到路由。
- 分页参数统一用page和pageSize
  - page默认值是1，页数从1开始，如果输入的小于1，则赋值为1。
  - pageSize默认值是10，最小值是1，如果小于1，则赋值为1；最大值是50，如果超过50，则赋值为50，不报错。
- 如果接口必须登录后才能访问，则先验证身份，验证失败返回401错误。带`[Auth]`表示需要认证。
- 

### 返回数据规则

通过HTTP状态码来判断是否成功，返回数据格式为JSON。

1. 状态码
   - 成功返回信息，状态码为200
   - 请求错误，应以4**代码返回（如HTTP_400_BAD_REQUEST，HTTP_401_UNAUTHORIZED，HTTP_403_FORBIDDEN，HTTP_404_NOT_FOUND）
   - 尽量避免出现服务器逻辑错误，避免5**的状态码出现

2. 返回数据
   - 数据格式为JSON
   - 变量名称遵循**小驼峰**命名法
   - 如果数据类型是数组，无数据时返回空数组，即`[]`，不用`null`
   - decimal类型的字段，保留两位小数

3. 错误信息说明
   - errorCode：由三组编码构成的错误码，<模块号码>.<HTTP状态码>.<自定义错误类型>
     - 模块号码：product：001，order：002，user：003，article：004，comment：005
     - 自定义错误类型
        ```python
           AUTH_ERROR = '001', '未认证'
           INPUT_ERROR = '002', '输入参数错误'  # 非路由参数本身的格式及有效性校验
           DB_NOT_FOUND = '003', '找不到符合条件的记录' # 通常是路由参数对应的资源没找到
           EMPTY_CART = '004', '购物车为空'
           STOCK_NOT_ENOUGH = '005', '库存不足'
           PAY_ERROR = '006', '支付错误'
           DB_UPDATE_EXCEPTION = '007', '数据库更新异常'
        ```
   - errorMessage：错误信息提示，有两种格式。1）如果是非路由参数校验出错，则会给出具体的参数错误；2）如果是其他错误，则直接给出字符串的错误信息。这两种方式可以根据errorCode中的自定义错误类型来判断。例如：
      ```json
      # 格式1
      {
         "errorMessage": {
            "count": [
               "购买数量不能小于零"
            ],
         },
         "errorCode": "002.400.002"
      }
      # 格式2
      {
         "errorMessage": "库存不足",
         "errorCode": "002.400.005"
      }
      ```

## API 列表

- [API设计之用户模块](API设计之用户模块.md)
- [API设计之商品模块](API设计之商品模块.md)
- [API设计之购物模块](API设计之购物模块.md)
- [API设计之文章模块](API设计之文章模块.md)
- [API设计之评论模块](API设计之评论模块.md)
