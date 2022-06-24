# 购物模块 API

## 购物车
### 1. [Auth] 将一个产品加入购物车
   - path: /cart/add
   - method: post
   - params: { skuId: int, count: int? }
     - skuId有效是指对应的sku存在且已上架
     - count默认值是1，不能小于等于0
   - return: { cartInfo }
   - 逻辑说明
      - 购物车中没有指定sku时，新增购物车记录
      - 购物车中已有指定sku时，数量增加count
      - 添加商品到购物车时，固化sku信息，保存到字段cartitem.descripion：
         ```json
         {"name": "黑洞温度马克杯-颜色-黑色", "price": 49.9, "skuId": 10, "picture": "201211ebe824f2ac2d62", "productId": 5, "attributes": [{"name": "颜色", "value": "黑色"}]}
         ```
   - 返回数据
      ```json
      {
         "totalCount": 3,
         "itemCount": 2,
         "totalPrice": 99.81
      }
      ```
   - 错误提示返回数据
      ```json
      # skuId无效提示
      {
         "errorMessage": {
            "skuId": [
               "未指定skuid,或找不到对应商品"
            ],
         },
         "errorCode": "002.400.002"
      }
      ```
### 2. [Auth] 获取购物车内sku列表
   - path: /cart/list
   - method: get
   - params: { skuId: int? }
     - 根据skuId过滤购物车列表
   - return: { totalCount: int, itemCount int, totalPrice: decimal, items: array[cartItem] }
   - 逻辑说明
      - 字段isSkuFound：sku存在且已上架时返回true，否则返回false。
      - 字段isStockEnough：isSkuFound==true而且库存大于等于购物车中商品数量，返回true，否则返回false
      - 字段sku：如果isSkuFound==false，则取自添加到购物车时固化的sku信息（cartitem.descripion字段），否则取sku的最新数据。如果商品下架，前端页面提示商品已下架。
   - 返回数据
      ```json
      # 购物车内无商品
      {
         "totalCount": 0,
         "itemCount": 0,
         "totalPrice": 0,
         "items": []
      }
      # 购物车内有商品
      {
         "totalCount": 4,
         "itemCount": 2,
         "totalPrice": 99.82,
         "items": [
            {
                  "count": 2,
                  "isSkuFound": true,
                  "isStockEnough": true,
                  "sku": {
                     "skuId": 1,
                     "name": "多普勒效应马克杯-颜色-白色",
                     "productId": 1,
                     "price": 0.01,
                     "picture": "2012785f03f61b02fdd5",
                     "attributes": [
                        {
                              "name": "颜色",
                              "value": "白色"
                        }
                     ]
                  }
            },
            {
                  "count": 2,
                  "isSkuFound": true,
                  "isStockEnough": true,
                  "sku": {
                     "skuId": 10,
                     "name": "黑洞温度马克杯-颜色-黑色",
                     "productId": 5,
                     "price": 49.9,
                     "picture": "201211ebe824f2ac2d62",
                     "attributes": [
                        {
                              "name": "颜色",
                              "value": "黑色"
                        }
                     ]
                  }
            }
         ]
      }
      ```
### 3. [Auth] 修改购物车中某个商品的数量
   - path: /cart/update
   - method: post
   - params: { skuId: int, count: int }
     - skuId 存在购物车中
     - count 大于等于0
   - return: { cartInfo }
   - 逻辑说明
      - count等于0时，则从购物车中删除指定sku
   - 返回数据
      ```json
      {
         "totalCount": 3,
         "itemCount": 2,
         "totalPrice": 99.81
      }
      ```
   - 错误提示返回数据
      ```json
      # 修改数量小于等于0，或非数字
      {
         "errorMessage": {
            "count": [
               "商品数量不能小于零"
            ],
         },
         "errorCode": "002.400.002"
      }
      ```

## 订单
### 1. [Auth] 确认下单
   - path: /cart/checkout
   - method: post
   - params: { address: address }
     - address 必填
   - return: { orderId: bigint }
   - 逻辑说明
      - 数据预处理，逐个检查购物车中sku
         - 无对应sku或已下架时，直接删除对应的购物车条目
         - 如存在库存不足的sku，返回错误信息，提示库存不足
      - 购物车为空时，返回错误信息
      - 数据库事务处理
        - 第一步使用数据库事务更新product数据库，减去sku库存
        - 第二步使用数据库事务更新order数据库，创建订单，清空购物车
        - 如果第二步失败，则恢复sku库存
      - 生成订单的逻辑
        - 订单ID从数据库表order_id_pool读取，每次取used_time为空的、id最小的记录
        - 固化sku信息，记录到OrderItem.Description字段中
            ```json
            {"name": "黑洞温度马克杯-颜色-黑色", "price": 49.9, "skuId": 10, "picture": "201211ebe824f2ac2d62", "productId": 5, "attributes": [{"name": "颜色", "value": "黑色"}]}
            ```
   - 返回数据
      ```json
      {
         "orderId": 1712345
      }
      ```
   - 错误提示返回数据
      ```json
      # 购物车为空
      {
         "errorMessage": "购物车为空:不能生成订单",
         "errorCode": "002.400.004"
      }
      # 库存不足
      {
         "errorMessage": "库存不足",
         "errorCode": "002.400.005"
      }
      # 数据校验错误
      {
         "errorMessage": {
            "street": [
               "详细地址不能为空。"
            ],
            "userName": [
               "收件人字段不能超过 32 个字符。"
            ],
            "phoneNumber": [
               "手机号码验证未通过。"
            ]
         },
         "errorCode": "002.400.002"
      }
      {
         "errorMessage": {
            "province": [
                  "请确保这个字段不能超过 16 个字符。"
            ],
            "city": [
                  "请确保这个字段不能超过 16 个字符。"
            ],
            "street": [
                  "请确保这个字段不能超过 256 个字符。"
            ],
            "userName": [
                  "请确保这个字段不能超过 32 个字符。"
            ],
            "phoneNumber": [
                  "手机号码验证未通过。"
            ]
         },
         "errorCode": "002.400.002"
      }
      ```
### 2. [Auth] 获取订单详情
   - path: /order/{id:bigint}
   - method: get
   - params:
   - return: { orderDetail }
   - 返回数据
      ```json
      {
         "orderId": 6544690,
         "orderTime": "2021-01-04T14:05:39.159856",
         "orderStatus": "待支付",
         "totalPrice": 99.82,
         "orderItems": [
            {
                  "sku": {
                     "skuId": 1,
                     "name": "多普勒效应马克杯-颜色-白色",
                     "productId": 1,
                     "price": 0.01,
                     "picture": "2012785f03f61b02fdd5",
                     "attributes": [
                        {
                              "name": "颜色",
                              "value": "白色"
                        }
                     ]
                  },
                  "count": 2
            },
            {
                  "sku": {
                     "skuId": 10,
                     "name": "黑洞温度马克杯-颜色-黑色",
                     "productId": 5,
                     "price": 49.9,
                     "picture": "201211ebe824f2ac2d62",
                     "attributes": [
                        {
                              "name": "颜色",
                              "value": "黑色"
                        }
                     ]
                  },
                  "count": 2
            }
         ],
         "address": {
            "userName": "收件人",
            "phoneNumber": "12344442222",
            "province": null,
            "city": null,
            "street": "大屯北路"
         },
         "payTime": null,
         "payMethod": null,
         "shippingTime": null,
         "shippingNo": null,
         "shippingCompany": null,
         "cancelTime": null
      }
      ```
### 3. [Auth] 查询登录用户的订单列表
   - path: /order/list
   - method: get
   - params: 
   - return:  { orders: array[order] }
   - 逻辑说明
      - 返回当前用户的订单列表，按照下单时间从新到旧排列

   - 返回数据
      ```json
      # 正常返回
      {
         "orders": [
            {
                  "orderId": 6544690,
                  "orderTime": "2021-01-04T14:05:39.159856",
                  "orderStatus": "待支付",
                  "totalPrice": 99.82
            },
            {
                  "orderId": 4523886,
                  "orderTime": "2021-01-04T13:29:44.752153",
                  "orderStatus": "待支付",
                  "totalPrice": 99.82
            }
         ]
      }
      # 用户无订单时，返回空数组
      {
         "orders": []
      }
      ```

## 支付

### 1. [Auth] 生成微信支付二维码(PC端二维码扫码支付)
   - path: /order/{id:bigint}/pay/wechat-qrcode
   - method: post
   - params:
   - return: { qrcode }
   - 逻辑说明
      - 参考微信支付官方文档提供参数
         - out_trade_no设置为orderId
         - body设置为'eShop-商品支付'（待讨论）
         - trade_type为'NATIVE'
      - 判断微信支付成功返回支付链接code_url
         - 判断条件：return_code == 'SUCCESS' and result_code == 'SUCCESS'
         - 微信返回出错时，将微信返回信息放入errorMessage，返回错误信息（错误代码400），并记录日志
      - 根据微信支付返回的code_url，生成二维码图片
   - 返回数据
      ```json
      {
         "orderId": 6544690,
         "qrcode": "weixin://wxpay/bizpayurl?pr=QyV0Krkzz",
         "qrcodeImg": "static/orderqrcode/6544690.png"
      }
      ```
   - 错误提示返回数据
      ```json
      # 验证用户的订单中，没有指定的订单号
      {
         "errorMessage": "找不到符合条件的记录:请检查订单号",
         "errorCode": "002.404.003"
      }
      # 支付失败，errorMessage显示微信支付返回的信息（转json）
      {
         "errorMessage": { "该订单已支付" },
         "errorCode": "002.400.006"
      }
      # 同一个订单，两次请求的价格不同时，错误返回信息
      {
         "errorMessage": { "201 商户订单号重复" },
         "errorCode": "002.400.006"
      }
      ```

### 2. 微信支付回调函数
  - path：/order/pay/qrcode/callback/
  - method: post
  - 逻辑说明：
     - 判断微信支付成功的条件：return_code == 'SUCCESS' and result_code == 'SUCCESS' and <校验签名成功>
     - 更新订单支付相关字段
        - pay_time: <当前时间>
        - pay_price：<返回信息.total_fee>
        - pay_method：'微信扫码支付'
        - pay_sign：openid:<返回信息.openid>
        - order_status：'已完成'
     - 根据微信接口要求返回成功或错误信息

## 心愿单
#### 1. [Auth] 将一个产品加入心愿单
   - path: /wishlist/add
   - method: post
   - params: { skuId: int}
     - skuId有效是指对应的sku存在且已上架
   - return: { count: int }
   - 逻辑说明
      - sku不能重复
   - 返回数据
      ```json
      {
         "count": 3
      }
      ```
   - 错误提示返回数据
      ```json
      # 商品无效提示
      {
         "errorMessage": {
            "skuId": [
                  "未指定skuId,或找不到对应商品SKU"
            ]
         },
         "errorCode": "002.400.002"
      }
      ```
#### 2. [Auth] 获取心愿单内物品列表
   - path: /wishlist/list
   - method: get
   - params: 
   - return: { count: int, items: array[wishlistItem] }
   - 逻辑说明：
      - 字段isSkuFound：sku存在且已上架时返回true，否则返回false。
      - 字段sku：如果isSkuFound==false，则取自添加到心愿单时固化的sku信息（wishlist.descripion字段），否则取sku的最新数据。如果商品下架，前端页面提示商品已下架。
   - 返回数据      

      ```json
      # 心愿单内无商品sku
      {
         "count": 0,
         "items": []
      }
      # 心愿单内有商品sku
      {
         "count": 2,
         "items": [
            {
                  "isSkuFound": true,
                  "sku": {
                     "skuId": 3,
                     "name": "康普顿效应马克杯-颜色-白色",
                     "productId": 2,
                     "price": 49.9,
                     "picture": "2012fd09d76535610525",
                     "attributes": [
                        {
                              "name": "颜色",
                              "value": "白色"
                        }
                     ]
                  }
            },
            {
                  "isSkuFound": true,
                  "sku": {
                     "skuId": 15,
                     "name": "自由狄拉克场马克杯-颜色-白色",
                     "productId": 8,
                     "price": 49.9,
                     "picture": "2012cfc66f26ac6ff171",
                     "attributes": [
                        {
                              "name": "颜色",
                              "value": "白色"
                        }
                     ]
                  }
            }
         ]
      }
      ```

#### 3. [Auth] 将产品从心愿单移除
   - path: /wishlist/remove
   - method: post
   - params: { skuId: int }
     - skuId 存在心愿单中
   - return: { count: int }
   - 返回数据

      ```json
      # 空心愿单
      {
         "count": 0
      }
      # 非空心愿单
      {
         "count": 5
      }
      ```
   - 错误提示返回数据

      ```json
      # 心愿单中无指定的商品sku
      {
         "errorMessage": {
            "skuId": [
                  "心愿单中无指定skuId的商品"
            ]
         },
         "errorCode": "002.400.002"
      }
      ```

#### 4. [Auth] 获取登录用户的购物车内商品、心愿单商品数量
   - path: /count-of-cart-and-wishlist
   - method: get
   - params: 
   - return: { cartCount: int, wishlistCount: int }
   - 逻辑说明
      - 返回购物车内商品sku总数（数量求和）、心愿单内商品sku总数

   - 返回数据
      ```json
      # 空购物车和心愿单
      {
         "cartCount": 0,
         "wishlistCount": 0
      }
      # 非空购物车和心愿单
      {
         "cartCount": 3,
         "wishlistCount": 5
      }
      ```

## API 中的对象定义

```yml
cartInfo:
  totalCount: int,
  itemCount: int,
  totalPrice: decimal

address:
  userName: string
  phoneNumber: string
  province: string
  city: string
  street: string

cartItem:
  count: int
  isSkuFound: bool
  isStockEnough: bool
  sku: sku

wishlistItem:
  isSkuFound: bool
  sku: sku

orderItem:
  count: int
  sku: sku

order:
   orderId: bigint
   orderTime: date
   orderStatus: string
   totalPrice: decimal

orderDetail:
  orderId: bigint
  orderStatus: string
  orderTime: date
  totalPrice: decimal
  orderItems: array[orderItem]
  address: address
  payTime: date
  payMethod: string
  shippingTime: date
  shippingNo: string
  shippingCompany: string
  cancelTime: date

qrcode:
  orderId: bigint
  qrcode: string
  qrcodeImg: string  # url path
```
