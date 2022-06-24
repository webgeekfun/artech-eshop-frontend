# 商品模块 API

## 1. 获取所有产品类别
   - path: /category/list
   - method: get
   - params: 
   - return: { categories: array[category] }
   - 返回数据
      <!-- <details>
         <summary>查看返回数据</summary> -->

      ```json
      {
         "categories": [
            {
                  "categoryId": 1,
                  "name": "马克杯"
            },
            {
                  "categoryId": 3,
                  "name": "啤酒杯"
            }
         ]
      }
      ```
      <!-- </details> -->
## 2. 获取所有标签
   - path: /tag/list
   - method: get
   - params: { categoryId: int? }
   - return: { tags: array[tag] }
   - 逻辑说明
      - 按照tag关联商品的数量由多到少排序，只取前100个tag
      - 如果参数categoryId不为空，则标签对应的产品数量取该类别中的产品数量
   - 返回数据
      ```json
      {
         "tags": [
            {
                  "name": "Newton [牛顿]",
                  "tagId": 54,
                  "productCount": 16
            },
            {
                  "name": "classical mechanics [经典力学]",
                  "tagId": 53,
                  "productCount": 14
            }
         ]
      }
      ```
## 3. 获取产品列表
   - path: /product/list
   - method: get
   - params: { tagId: int?, categoryId: int?, page: int?, pageSize: int?, sort: string?, search: string? }
     - sort 限定为 `['priceDown', 'priceUp', 'dateDown', 'dateUp']`，默认值是`dateDown`
   - return: { products: array[product], pagination: pagination }
   - 逻辑说明
      - 每个商品的图片列需要按照rank从小到大的顺序返回
      - 每个商品的price和picture分别取自该商品对应的defalutSku的price和picture
      - 每个商品的feature字段返回字符串数组，如`['Recomended','New']`，如果没有则返回空数组`[]`
      - search参数在商品名称、简介、描述三个字段中搜索（contains）
   - 返回数据

      ```json
      {
         "pagination": {
            "hasNextPage": true,
            "hasPreviousPage": false,
            "isFirstPage": true,
            "isLastPage": false,
            "pageCount": 4,
            "pageNumber": 1,
            "totalItemCount": 16
         },
         "products": [
            {
                  "productId": 40,
                  "name": "重力加速度马克杯",
                  "picture": "2012ea0afa62aa68c90a",
                  "price": 49.9,
                  "feature": ['Recomended','New'],
                  "defaultSkuId": 79,
                  "summary": "Acceleration due to Gravity",
                  "category": {
                     "categoryId": 1,
                     "name": "马克杯"
                  },
                  "tags": [
                     {
                        "tagId": 12,
                        "name": "constant [常数]"
                     },
                     {
                        "tagId": 54,
                        "name": "Newton [牛顿]"
                     }
                  ]
            },
            {
                  "productId": 41,
                  "name": "重力势能马克杯",
                  "picture": "2012d8124a62f2069f4f",
                  "price": 49.9,
                  "feature": [],
                  "defaultSkuId": 81,
                  "summary": "Gravitational Potential Energy",
                  "category": {
                     "categoryId": 1,
                     "name": "马克杯"
                  },
                  "tags": [
                     {
                        "tagId": 53,
                        "name": "classical mechanics [经典力学]"
                     },
                     {
                        "tagId": 54,
                        "name": "Newton [牛顿]"
                     }
                  ]
            }
         ]
      }

      # 返回结果为空时，product数组为空
      {
         "pagination": null,
         "products": []
      }
      ```

## 4. 获取产品详情
   - path: /product/{id:int}
   - method: get
   - params: { id: int }
   - return: { productDetail }
   - 返回数据

      ```json
      {
         "productId": 50,
         "name": "简谐运动加速度马克杯",
         "defaultSkuId": 99,
         "price": 49.9,
         "feature": ['Recomended','New'],
         "category": {
            "categoryId": 1,
            "name": "马克杯"
         },
         "summary": "Simple harmonic motion acceleration",
         "description": "<p>简谐运动是一种变速与变加速运动。其速度与加速度可以由简谐运动方程（位移-时间方程）通过微分得到。\n</p><p>\n艾萨克·牛顿爵士（Sir Isaac Newton，1643年1月4日－1727年3月31日）是一位英格兰物理学家、数学家、天文学家、自然哲学家和炼金术士。1687年他发表《自然哲学的数学原理》，阐述了万有引力和三大运动定律，奠定世界物理和天文学的基础，成为了现代工程学的基础。他通过论证开普勒行星运动定律与他的引力理论间的一致性，展示了地面物体与天体的运动都遵循着相同的自然定律；为太阳中心学说提供了强而有力的理论支持，是科学革命的一个代表。</p>",
         "tags": [
            {
                  "tagId": 54,
                  "name": "Newton [牛顿]"
            },
            {
                  "tagId": 58,
                  "name": "trigonometric [三角]"
            }
         ],
         "skus": [
            {
                  "skuId": 99,
                  "name": "简谐运动加速度马克杯-颜色-白色",
                  "productId": 50,
                  "price": 49.9,
                  "picture": "20125b20c07604737b85",
                  "attributes": [
                     {
                        "name": "颜色",
                        "value": "白色"
                     }
                  ]
            },
            {
                  "skuId": 100,
                  "name": "简谐运动加速度马克杯-颜色-黑色",
                  "productId": 50,
                  "price": 49.9,
                  "picture": "2012964ff2bff88775f7",
                  "attributes": [
                     {
                        "name": "颜色",
                        "value": "黑色"
                     }
                  ]
            }
         ],
         "pictures": [
            "20125b20c07604737b85",
            "2012964ff2bff88775f7",
            "2012e1151c16604ec826",
            "201270d9e238101039ed",
            "201271f4f7bb26a2e155"
         ]
      }
      ```
## 5. 获取相关产品
   - path: /product/{id:int}/related
   - method: get
   - params: { id: int, count: int? }
     - count默认值是4，最大不超过50
   - return: { products: array[productRelatedSku] }
   - 逻辑说明
      - 从与指定商品具有相同Tag的sku列表中，随机挑选出指定数量的sku
      - 需要排除指定商品包含的sku
      - sku不能重复
   - 返回数据

      ```json
      {
          "products": [
              {
                  "skuId": 69,
                  "productId": 35,
                  "name": "理想气体热能马克杯",
                  "picture": "2012a9a69dc365770a58",
                  "price": 49.9,
                  "feature": [],
                  "summary": "Thermal Energy of An Ideal Gas"
              },
              {
                  "skuId": 170,
                  "productId": 102,
                  "name": "斯特藩-玻尔兹曼定律搪瓷杯",
                  "picture": "2012c5bf5879a9c0cad3",
                  "price": 49.9,
                  "feature": [],
                  "summary": "Stefan-Boltzmann law"
              },
              {
                  "skuId": 72,
                  "productId": 36,
                  "name": "热力学第一定律马克杯",
                  "picture": "20124ddbc8b7ea049435",
                  "price": 49.9,
                  "feature": [
                      "Popular"
                  ],
                  "summary": "First Law of Thermodynamics"
              }
          ]
      }
      ```

## 6. 获取SKU列表
   - path: /product/sku
   - method: get
   - params: { skuIds: string }
     - 英文逗号分隔的SkuId列表
   - 逻辑说明
     - 最多取100个
   - return: { array[sku] }
   - 返回数据
      ```json
      [
         {
            "skuId": 267,
            "name": "拉普拉斯变换定义啤酒杯",
            "price": 49.9,
            "productId": 199,
            "picture": "2012ee4eced6e554fb09",
            "attributes": []
         },
         {
            "skuId": 268,
            "name": "拉普拉斯初值定理啤酒杯",
            "price": 49.9,
            "productId": 200,
            "picture": "201279a0a588dcc13f56",
            "attributes": []
         }
      ]
      ```

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
  productCount: int # 只在标签列表中显示

product:
  productId: int
  name: string
  picture: string
  price: decimal 
  feature: array[string]
  defaultSkuId: int
  summary: string
  category: category
  tags: array[tag]

productDetail:
  productId: int
  name: string
  defaultSkuId: int
  price: decimal
  feature: string
  summary: string
  description: string  
  category: category
  tags: array[tag]
  skus: array[sku],
  pictures: array[string]

productRelatedSku: 
  skuId: int,
  productId: int,
  name: string, #产品的名称，非sku的名称
  price: decimal,
  picture: string,
  summary: string,
  feature: string

sku:
  skuId: int
  name: string
  productId: int
  price: decimal
  picture: string
  attributes: array[{
     name: string
     value: string
  }]
```
