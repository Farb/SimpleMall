import request from "../config/request";


export function getBanners(){
	return request({
	  url: '/api/index/getbanners',
	  method: 'get',
	})
}

export function getImageTexts(){
	return request({
	  url: '/api/index/getimagetexts',
	  method: 'get',
	})
}

export function getProducts(data){
	return request({
	  url: '/api/product/getproductlist',
	  method: 'get',
	  params: data 
	})
}

export function GetProductIndex() {
    return request({
      url: '/Page/GetPage',
      method: 'get',
    })
  }

export function getProduct(id) {
    return request({
      url: '/api/product/getproduct',
      method: 'get',
      params: { id }
    })
  }