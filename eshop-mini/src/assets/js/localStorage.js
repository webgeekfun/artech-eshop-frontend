// 购物车
class cart {
  static fetch() {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  }

  static save(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
  }
}


// 订单
class orderList {
  static fetch(){
    return JSON.parse(localStorage.getItem('orders') || '[]')
  }

  static save(orders){
    localStorage.setItem('orders', JSON.stringify(orders))
  }
}

export default{
  cart, orderList
}