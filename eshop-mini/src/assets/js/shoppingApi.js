import productCatalog from './productCatalog'

export default {

  //获取一个产品的信息
  getProduct(productId, successCallback, errorCallback){
    //模拟请求远程API，耗时1~2秒的随机时长
    const timeout = Math.random() * 1000 + 1000;
    //以80%成功概率，模拟从远程获取数据，
    const success= Math.random() < 0.8;
    setTimeout(() => {
      if(success) {
        //调用成功的回调函数
        successCallback(productCatalog.find(_=>_.productId === productId));
      }
      else {
        //调用失败的回调函数
        errorCallback();
      }
    }, timeout);
  },

  //获取所有产品的信息
  getProductCatalog(successCallback, errorCallback){
    //模拟请求远程API，耗时1~2秒的随机时长
    const timeout = Math.random() * 1000 + 1000;
    //以80%成功概率，模拟从远程获取数据，
    const success= Math.random() < 0.8;
    setTimeout(() => {
      if(success) {
        //调用成功的回调函数
        successCallback(productCatalog);
      }
      else {
        //调用失败的回调函数
        errorCallback();
      }
    }, timeout);
  },

  //确定下单
  checkOut(products, successCallback, errorCallback){
    //模拟请求远程API，耗时1~2秒的随机时长
    const timeout = Math.random() * 1000 + 1000;
    //以80%成功概率，模拟下单
    const success= Math.random() < 0.8;
    setTimeout(() => {
      if(success) {
        //模拟远程API返回orderId和totalPrice
        const orderId = Math.round(Math.random()*(9999999-1000000))+1000000;
        //调用成功的回调函数
        successCallback(orderId);
      } 
      else {
        //调用失败的回调函数
        errorCallback();
      }
    }, timeout);
  },
 
  //支付订单
  pay(order, successCallback, errorCallback){
    //模拟请求远程API，耗时1~2秒的随机时长
    const timeout = Math.random() * 1000 + 1000;
    const success= Math.random() < 0.8;
    //以80%成功概率，模拟远程API返回支付的orderId，如果成功同时返回总价
    const {orderId, totalPrice} = order;
    setTimeout(() => {
      if(success) 
        successCallback({orderId, totalPrice});
      else
        errorCallback({orderId, message: "支付失败，请稍候再试。"});
      }, timeout);
    }
  };