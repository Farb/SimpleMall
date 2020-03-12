
import success from './common/success.json'

import GetPage from './page/GetPage.json'
import banners from './page/banners.json'
import imgageTexts from './page/imgageTexts.json'
import products from './page/products.json'

import GetUserIndex from './user/GetUserIndex.json'
import GetFavorite from './user/GetFavorite.json'

import GetAddressList from './user/GetAddressList.json'
import GetAddressById from './user/GetAddressById.json'

import GetCoupon from './user/GetCoupon.json'

export default {
    '/Page/GetPage':GetPage,
	'/Page/imgageTexts':imgageTexts,
	'/Page/products':products,
	'/Page/banners':banners,

    '/User/GetUserIndex':GetUserIndex,
    '/User/GetFavorite':GetFavorite,
    '/User/DelFavorite':success,
    
    '/User/GetAddressList':GetAddressList,
    '/User/GetAddressById':GetAddressById,

    '/User/SaveAddress':success,
    '/User/DelAddress':success,
    
    '/User/GetCoupon':GetCoupon,
    '/User/ExchangeCoupon':success,
}