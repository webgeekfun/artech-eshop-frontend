# 购物模块 API

## 购物车
### 1. [Auth] 将一个产品加入购物车
   - path: /cart/add
   - method: post
   - params: { productId: int, count: int? }
     - 判断productId有效：对应的product存在且已上架
     - count默认值是1，不能小于等于0
   - return: { cartInfo }
   - 逻辑说明
      - 购物车中没有指定product时，新增购物车记录
      - 购物车中已有指定product时，数量增加count
      - 添加商品到购物车时，固化product的json数据，保存到字段cart_item.descripion。
### 2. [Auth] 获取购物车内商品列表
   - path: /cart/list
   - method: get
   - params: { productId: int? }
     
     -  带入参数productId时，根据指定productId过滤购物车商品列表
   - return: { totalCount: int, itemCount int, totalPrice: decimal, items: array[cartItem] }
### 3. [Auth] 修改购物车中某个商品的数量
   - path: /cart/update
   - method: post
   - params: { productId: int, count: int }
     - productId 存在购物车中
     - count 大于等于0
   - return: { cartInfo }
   - 逻辑说明
     
      - count等于0时，则从购物车中删除指定商品

## 订单
### 1. [Auth] 确认下单
   - path: /cart/checkout
   - method: post
   - params: { address: address }
     
     - address 必填
   - return: { orderId: bigint }
   - 逻辑说明
      - 数据预处理，逐个检查购物车中product
         - 无对应product或已下架时，直接删除对应的购物车条目
         - 如存在库存不足的product，返回错误信息，提示库存不足
      - 购物车为空时，返回错误信息
      - 数据库事务处理
        - 第一步使用数据库事务更新product数据库，减去product库存
        - 第二步使用数据库事务更新order数据库，创建订单，清空购物车
        - 如果第二步失败，则恢复product库存
      - 生成订单的逻辑
        - 订单ID从数据库表order_id_pool读取，每次取used_time为空的、id最小的记录
        - 固化product信息，记录到order_item.description字段中
### 2. [Auth] 获取订单详情
   - path: /order/{id:bigint}
   - method: get
   - params:
   - return: { orderDetail }
### 3. [Auth] 查询登录用户的订单列表
   - path: /order/list
   - method: get
   - params: 
   - return:  { orders: array[order] }
   - 逻辑说明
     
     - 返回当前用户的订单列表，按照下单时间从新到旧排列 

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
         - 微信支付返回错误时，将微信返回信息放入errorMessage，返回错误信息（错误代码400）
      - 根据微信支付返回的code_url，生成二维码图片

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
   - params: { productId: int}
     
     - 判断productId有效：对应的product存在且已上架
   - return: { count: int }
   - 逻辑说明
     
      - productId 不能重复，已经添加过的product，再次添加无效
      - 固化product的json数据，保存到字段wishlist.descripion
#### 2. [Auth] 获取心愿单内物品列表
   - path: /wishlist/list
   - method: get
   - params: 
   - return: { count: int, items: array[wishlistItem] }

#### 3. [Auth] 将产品从心愿单移除
   - path: /wishlist/remove
   - method: post
   - params: { skuId: int }
     
     - skuId 存在心愿单中
   - return: { count: int }

#### 4. [Auth] 获取登录用户的购物车内商品、心愿单商品数量
   - path: /count-of-cart-and-wishlist
   - method: get
   - params: 
   - return: { cartCount: int, wishlistCount: int }
   - 逻辑说明
     
     - 返回购物车内商品总数（数量求和）、心愿单内商品总数
            

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
  isProductFound: bool  # 存在且已上架时返回true，否则返回false。
  isStockEnough: bool  # isProductFound==true而且库存大于等于购物车中商品数量，返回true，否则返回false
  product: productSimple  #数据定义参考购物模块，isProductFound==false，则取自添加到购物车时固化的productSimple信息（cart_item.descripion字段），否则取prodcut的最新数据。如果商品已下架，前端页面应提示商品下架。

wishlistItem:
  isProductFound: bool
  product: productSimple

orderItem:
  count: int
  product: productSimple

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
