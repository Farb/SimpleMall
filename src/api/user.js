import request from "../config/request";

export function Register(data){
  return request({
    url: '/api/auth/register',
    method: 'post',
    data: data
  })
}

export function GenerateCode(data){
  return request({
    url: '/api/user/generatecode',
    method: 'post',
    data: data
  })
}

export function GetGenerateCodeList(data){
  return request({
    url: '/api/user/getgeneratecodelist',
    method: 'post',
    data: data
  })
}

export function DispatchCode(data){
  return request({
    url: '/api/user/dispatchcode',
    method: 'post',
    data: data
  })
}

export function login(data){
	
  return request({
    url: '/api/auth/login',
    method: 'post',
    data: data
  })
}

export function refreshtoken(data){
  return request({
    url: '/api/auth/refreshtoken',
    method: 'post',
    data: data
  })
}

export function ModifyPassword(data){
  return request({
    url: '/api/user/modifypassword',
    method: 'post',
    data: data
  })
}
export function GetWechatConfig(data){
  return request({
    url: '/api/auth/getwechatconfig',
    method: 'post',
    data: data
  })
}

export function GetUserIndex() {
  return request({
    url: '/api/user/getuserindex',
    method: 'get',
  })
}

export function GetFavorite(data){
  return request({
    url: '/User/GetFavorite',
    method: 'post',
    params: { data }
  })
}

export function DelFavorite(id){
  return request({
    url: '/User/DelFavorite',
    method: 'get',
    params: { id:id }
  })
}

export function GetAddressList(){
  return request({
    url: '/api/user/getuseraddresslist',
    method: 'get',
  })
}

export function GetUserAddress(id){
  return request({
    url: '/api/user/getuseraddress',
    method: 'get',
    params: { id }
  })
}

export function GetDefaultAddress(){
  return request({
    url: '/api/user/getdefaultaddress',
    method: 'get'
  })
}

export function SaveUserAddress(data){
  return request({
    url: '/api/user/saveuseraddress',
    method: 'post',
    data: data 
  })
}
export function DeleteUserAddress(addressId){
  return request({
    url: '/api/user/deleteuseraddress',
    method: 'delete',
    params: { addressId }
  })
}

export function SubmitOrder(order){
  return request({
    url: '/api/order/submitorder',
    method: 'post',
    data: order 
  })
}

export function CancelOrder(orderId){
  return request({
    url: '/api/order/cancelorder',
    method: 'post',
    params: {orderId} 
  })
}

export function MakeSureToReceiveOrder(orderId){
  return request({
    url: '/api/order/makesuretoreceiveorder',
    method: 'post',
    params: {orderId} 
  })
}

export function GetOrder(orderId){
  return request({
    url: '/api/order/getorder',
    method: 'get',
    params: {orderId} 
  })
}

export function GetOrderExpressInfo(orderNo){
  return request({
    url: '/api/order/getorderexpressinfo',
    method: 'get',
    params: {orderNo} 
  })
}

export function GetOrderList(data){
  return request({
    url: '/api/order/getorderlist',
    method: 'post',
	data:data
  })
}

export function GetCoupon(data){
  return request({
    url: '/User/GetCoupon',
    method: 'Post',
    params: { data }
  })
}

export function ExchangeCoupon(code){
  return request({
    url: '/User/ExchangeCoupon',
    method: 'Post',
    params: { code:code }
  })
}

export function GetUrlForCode(returnUrl){
  return request({
    url: '/api/wechatpay/geturlforcode',
    method: 'get',
	params:{secondReturnUrl:returnUrl}
  })
}

export function BaseCallback(data){
  return request({
    url: '/api/wechatpay/BaseCallback',
    method: 'get',
	params:data
  })
}
export function JsApiPay(data){
  return request({
    url: '/api/wechatpay/jsapipay',
    method: 'Post',
    data: data
  })
}

export function GetUserBindedPhone(){
    return request({
      url: '/api/User/GetUserBindedPhone',
      method: 'get',
    })
  }
  export function BindPhone(phone){
    return request({
      url: '/api/user/BindPhone',
      method: 'Post',
      data: phone
    })
  }
  
  export function ResetPassword(data){
    return request({
      url: '/api/user/ResetPassword',
      method: 'Post',
      data: data
    })
  }
  
  export function ClearCache(){
    return request({
      url: '/api/index/ClearCache',
      method: 'get',
    })
  }
  