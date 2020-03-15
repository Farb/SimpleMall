import banners from './page/banners.json'
import imgageTexts from './page/imgageTexts.json'
import products from './page/products.json'
import product from './page/productDetail.json';
import GetUserIndex from './user/GetUserIndex.json'

import GetAddressList from './user/GetAddressList.json'
import GetAddressById from './user/GetAddressById.json'

import orderList from './user/orderList.json'
import orderDetail from './user/GetOrderDetail.json'
import logisticsInfo from './user/logisticsInfo.json'

export default {
	'/api/index/getimagetexts':imgageTexts,
	'/api/product/getproductlist':products,
	'/api/index/getbanners':banners,
	'/api/product/getproduct':product,
	
    '/api/user/getuserindex':GetUserIndex,
    '/api/user/getuseraddresslist':GetAddressList,
    '/api/user/getuseraddress':GetAddressById,
	
	'/api/order/getorderlist':orderList,
	'/api/order/getorder':orderDetail,
	'/api/order/getorderexpressinfo':logisticsInfo
}