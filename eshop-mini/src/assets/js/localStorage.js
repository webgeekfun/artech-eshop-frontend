// 购物车
const CART_STORAGE_KEY = 'cart'

class cart {
  static fetch() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]')
  }

  static save(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }
}


// 订单
const ORDERLIST_STORAGE_KEY = 'orders'

class orderList {
  static fetch(){
    return JSON.parse(localStorage.getItem(ORDERLIST_STORAGE_KEY) || '[]')
  }

  static save(orders){
    localStorage.setItem(ORDERLIST_STORAGE_KEY, JSON.stringify(orders))
  }
}

export default{
  cart, orderList
}