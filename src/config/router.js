import Vue from 'vue';
import Router from 'vue-router';
import VueCookies from 'vue-cookies';

import myconstants from "./constants.js";
import {hasToken,isValidToken} from '../lib/helper.js';
Vue.use(VueCookies);
Vue.use(Router);

const routes = [

	{
		path: '*', // 错误路由
		redirect: '/home'
	},
	{
		path:'/',
		redirect:'/home'
	},
	{
		name: 'home',
		path: '/home',
		component: () => import('../page/index'),
		meta: {
			title: '华芸会员中心首页',
			keepAlive: true, //该字段表示该页面需要缓存
		}
	},
	{
		path: '/login',
		component: () => import('../page/account/login'),
		meta: {
			title: '登录'
		}
	},
	{
		name: 'passwordlogin',
		path: '/login/password',
		component: () => import('../page/account/password'),
		meta: {
			title: '密码登录'
		},
		beforeEnter:(to, from, next)=>{
			if (hasToken() && isValidToken()) {
				if (!from.name||from.name != 'userindex') { //如果不是用户中心入口进来的就跳转到个人中心
					next({
						name: "userindex",
						replace: true
					});
				}
			}
			next();
		}
	},
	{
		path: '/login/phone',
		component: () => import('../page/account/phonelogin'),
		meta: {
			title: '手机号登录'
		}
	},
	{
		path: '/user/generatecode',
		name: 'generatecode',
		component: () => import('../page/user/info/generatecode'),
		meta: {
			title: '生成注册码',
			type: 'login'
		}
	},
	{
		path: '/user/admin',
		name: 'useradmin',
		component: () => import('../page/user/info/admin'),
		meta: {
			title: '管理界面',
			type: 'login'
		}
	},
	{
		path: '/user/register',
		name: 'register',
		component: () => import('../page/account/register'),
		meta: {
			title: '注册'
		}
	},
	{
		path: '/user/index',
		name: 'userindex',
		component: () => import('../page/user/index'),
		meta: {
			title: '会员中心',
			keepAlive: true,
		}
	},
	{
		path: '/user/info',
		component: () => import('../page/user/info/detail'),
		name: 'userinfo',
		meta: {
			title: '账号管理',
		}
	},
	{
		path: '/user/editpassword',
		component: () => import('../page/user/info/editpassword'),
		name: 'usereditpassword',
		meta: {
			title: '修改密码',
			type: 'login'
		}
	},
	{
		path: '/user/bindtelphone',
		component: () => import('../page/user/info/bindtelphone'),
		name: 'userbindtelphone',
		meta: {
			title: '绑定手机号码',
			type: 'login'
		}
	},
	{
		path: '/user/resetpassword',
		component: () => import('../page/user/info/resetpassword'),
		name: 'userresetpassword',
		meta: {
			title: '重置登录密码',
		}
	},
	{
		path: '/user/address',
		name: 'useraddresslist',
		component: () => import('../page/user/address/list'),
		meta: {
			title: '我的地址',
			type: 'login'
		}
	},
	{
		path: '/user/address/edit',
		name: 'useraddressedit',
		component: () => import('../page/user/address/edit'),
		meta: {
			title: '编辑地址',
			type: 'login'
		}
	},
	{
		path: '/user/favorite',
		component: () => import('../page/user/favorite/list'),
		meta: {
			title: '我的收藏',
			type: 'login'
		}
	},
	{
		path: '/user/rule',
		component: () => import('../page/user/info/rule'),
		meta: {
			title: '会员规则'
		}
	},
	{
		path: '/user/coupon',
		component: () => import('../page/user/coupon/list'),
		meta: {
			title: '我的优惠券'
		}
	},
	{
		path: '/user/order/:tabId?',
		component: () => import('../page/user/order/list'),
		name:'orderlist',
		meta: {
			title: '我的订单列表',
			type: 'login',
		}
	},
	{
		path: '/user/order/info/:id',
		name:'orderinfo',
		component: () => import('../page/user/order/info'),
		meta: {
			title: '订单详情',
			type: 'login'
		}
	},
	{
		path: '/user/order/logistics/:orderNo',
		component: () => import('../page/user/order/logistics'),
		meta: {
			title: '订单追踪',
			type: 'login'
		}
	},
	{
		path: '/user/aftersale',
		component: () => import('../page/user/aftersale/list'),
		meta: {
			title: '售后'
		}
	},
	{
		path: '/user/aftersale/apply',
		component: () => import('../page/user/aftersale/apply'),
		meta: {
			title: '申请售后'
		}
	},
	{
		path: '/user/aftersale/detail',
		component: () => import('../page/user/aftersale/detail'),
		meta: {
			title: '服务单详情'
		}
	},
	{
		path: '/user/aftersale/track/:id',
		component: () => import('../page/user/aftersale/track'),
		meta: {
			title: '进度详情'
		}
	},
	{
		path: '/product/:id',
		name:'productdetail',
		component: () => import('../page/product/detail'),
		meta: {
			title: '商品详情'
		}
	},
	{
		path: '/search',
		component: () => import('../page/product/list'),
		meta: {
			title: '商品列表'
		}
	},
	{
		name: 'cart',
		component: () => import('../page/cart/index'),
		meta: {
			title: '购物车'
		}
	},
	{
		path: '/order',
		name: 'submitorder',
		component: () => import('../page/shipping/order'),
		meta: {
			title: '确认订单',
			type: 'login',
			keepAlive: true, //该字段表示该页面需要缓存
			isBack: false, //用于判断上一个页面是哪个
		},
		beforeEnter: (to, from, next) => {
			 if (!from.name||(from.name&&from.name != 'orderinfo')) {
				next();
			 }else{
				next({
					name: "cart",
					replace: true
				});
			 }
		 }
	},
	{
		name:'wechatauthcallback',
		path:'/wechatauthcallback',
		component:()=>import('../page/account/wechatauthcallback'),
		meta:{}
	},
	{
		name: 'category',
		component: () => import('../page/category/index'),
		meta: {
			title: '分类'
		}
	},
];

// add route path
routes.forEach(route => {
	route.path = route.path || '/' + (route.name || '');
});

const router = new Router({
	mode:'history',
	routes
});

router.beforeEach((to, from, next) => {

	const title = to.meta && to.meta.title;
	if (title) {
		document.title = title;
	}
	const type = to.meta && to.meta.type;
	//登录校验,如果已经登录,如果不是从切换账号入口再次进入登录页面直接跳转到个人中心

	if (type === 'login') {	
		//re-login if both of tokens doesn't exist.
		if (hasToken()) {
			next();
		} else {
			relogin(to, next);
		}
	} else {
		next();
	}

});

function relogin(to, next) {
	next({
		name: 'passwordlogin',
		query: {
			redirect: to.fullPath
		}
	});
}

export {
	router
};
