# 商品模块 API

## 1. 获取所有产品类别
   - path: /category/list
   - method: get
   - params: 
   - return: { categories: array[category] }
## 2. 获取所有标签
   - path: /tag/list
   - method: get
   - params: { categoryId: int? }
   - return: { tags: array[tag] }
   - 逻辑说明
      - 按照tag关联商品的数量由多到少排序，只取前100个tag
      - 如果参数categoryId不为空，则标签对应的产品数量取该类别中的产品数量
## 3. 获取产品列表
   - path: /product/list
   - method: get
   - params: { tagId: int?, categoryId: int?, page: int?, pageSize: int?, sort: string?, search: string? }
     - sort 限定为 `['priceDown', 'priceUp', 'dateDown', 'dateUp']`，默认值是`dateDown`
   - return: { products: array[product], pagination: pagination }
   - 逻辑说明
      - 每个商品的feature字段返回字符串数组，如`['Recomended','New']`，如果没有则返回空数组`[]`
      - search参数在商品名称、简介、描述三个字段中搜索（contains）

## 4. 获取产品详情
   - path: /product/{id:int}
   - method: get
   - params: { id: int }
   - return: { productDetail }
## 5. 获取相关产品
   - path: /product/{id:int}/related
   - method: get
   - params: { id: int, count: int? }
     - count默认值是4，最大不超过50
   - return: { products: array[product] }
   - 逻辑说明
      - 从与指定商品具有相同Tag的product列表中，随机挑选出指定数量的product
      - 需要排除url中的指定商品
      - 商品不能重复
## 6. 根据Ids获取产品列表
   - path: /product/listByIds
   - method: get
   - params: { productIds: string }
     - 英文逗号分隔的ProductId列表
   - 逻辑说明
     - 最多取100个
   - return: { array[product] }

## API 中的对象定义

```yml
pagination:
  hasNextPage: bool
  hasPreviousPage: bool
  isFirstPage: bool
  isLastPage: bool
  pageCount: int
  pageNumber: int
  totalItemCount: int

category:
  categoryId: int
  name: string

tag:
  tagId: int
  name: string
  productCount: int # 只需要在标签列表中显示

product:
  productId: int
  name: string
  picture: string
  price: decimal 
  feature: array[string]
  summary: string
  category: category
  tags: array[tag]
  
productSimple:  # 用于购物模块的购物车、心愿单、订单明细
  productId: int
  name: string
  picture: string
  price: decimal 

productDetail:
  productId: int
  name: string
  picture: string
  price: decimal
  feature: string  
  summary: string  
  category: category
  tags: array[tag]  
  description: string  # 比product多出的字段
```
