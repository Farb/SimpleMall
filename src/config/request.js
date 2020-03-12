import Vue from 'vue';
import axios from 'axios';
import {
	baseUrl,
	dataSources
} from './env';
import datas from '../data/data';
import VueCookies from 'vue-cookies';
import myconstants from "./constants.js";
import {
	refreshtoken
} from "../api/user.js";
import {router} from './router.js';
import {hasToken} from '../lib/helper.js';

Vue.use(VueCookies);

axios.defaults.headers.post['Content-Type'] = 'application/json';

const service = axios.create({
	baseURL: baseUrl, // api 的 base_url
	timeout: 60000, // request timeout
	headers: {}
});

const servicef = function(parameter) {
	if (dataSources == 'local') {
		//定义回调函数和axios一致
		const promist = new Promise(function(resolve, reject) {
			var data = datas[parameter.url];
			if (typeof data == 'string') {
				data = JSON.parse(data);
			}
			resolve(data);
		})
		return promist;
	}
	return service(parameter);
}


service.interceptors.request.use(
	config => {
		// Do something before request is sent
		var tokenData = Vue.$cookies.get(myconstants.token);
		if (tokenData&&tokenData.token) {
			// 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
			config.headers['Authorization'] = "Bearer " + tokenData.token
		}

		return config;
	},
	error => {
		// Do something with request error
		console.log('[requestErr]'+error) // for debug
		Promise.reject(error)
	}
)
//被挂起的请求数组
var pendingRequests=[];

//临时保存所有的请求到数组中
function addRequestToQueue(requestCallback){
	pendingRequests.push(requestCallback);
}

//被挂起的请求使用新token进行后续请求
function onRefresh(newToken){
	pendingRequests.map(callback=>callback(newToken));
}
// response interceptor
service.interceptors.response.use(
	//response => response,
	/**
	 * 下面的注释为通过在response里，自定义code来标示请求状态
	 * 当code返回如下情况则说明权限有问题，登出并返回到登录页
	 * 如想通过 xmlhttprequest 状态码标识 逻辑可写在下面error中
	 * 以下代码均为样例，请结合自身需求加以修改，若不需要，则可删除
	 */
	response => {
		const res = response.data;
		
		if (200 <= response.status && response.status < 300) {	
			if(response.status==200){				
				if(res.CodeMsg&&(res.CodeMsg.Code==101||res.CodeMsg.Code==102)){
					pendingRequests=[];
					router.replace({name:'passwordlogin'});
					return;
				}
			}
			return response.data;
		}else{
			return Promise.reject('error')
		}
	},
	error => {
		console.log('[responseErr]'+error);
		if(error.response.status==401){
			return reloadMessage(error.response.config);
		} 
		return Promise.reject(error)
	}
)
var isRefreshingToken=false;
/* 消息重发 */
function reloadMessage(config){
	if(!isRefreshingToken){
		getTokenWithRefreshToken();
	}
    
    /*将请求挂起*/
   let retry = new Promise((resolve, reject) => {
      /*(token) => {...}这个函数就是回调函数*/
      addRequestToQueue(token => {
        config.headers["Authorization"] ="Bearer " + token;
        axios.request(config).then(res =>{
            resolve(res.data)
        })
      });
    });
    return retry;
}

function getTokenWithRefreshToken() {
	if(!hasToken())
		return ;
	isRefreshingToken=true;
	var data = {
		AccessToken:Vue.$cookies.get(myconstants.token).token,
		RefreshToken: Vue.$cookies.get(myconstants.refreshtoken)
	};
	
	refreshtoken(data).then(response => {
		if(!response) return;
		if (response.CodeMsg.Code === '1') {
			
			var now = new Date();
			var tokenData = {
				token: response.AccessToken.Token,
				realExpiresTime: now.setTime(now.getTime() + (response.AccessToken.ExpiresIn) * 1000)
			}; 
			//如果refreshToken为空,则保存的token的有效期和原refreshToken一致
			if(!response.RefreshToken){
				var oldRefreshTokenExpire=Vue.$cookies.get(myconstants.refreshtokenExpireTime);
				Vue.$cookies.set(myconstants.token, tokenData, new Date(oldRefreshTokenExpire));
			}else{
				Vue.$cookies.set(myconstants.token, tokenData, myconstants.tokeExpires);
				Vue.$cookies.set(myconstants.refreshtoken, response.RefreshToken, myconstants.refreshtokenExpires);
				Vue.$cookies.set(myconstants.refreshtokenExpireTime, now.setTime(now.getTime()+( myconstants.refreshtokenExpires)*1000), myconstants.refreshtokenExpires);
			}
			/*执行数组里的函数,重新发起被挂起的请求*/
			onRefresh(tokenData.token);
			/*执行onRefresh函数后清空数组中保存的请求*/
			pendingRequests = [];
		}else if(response.CodeMsg.Code==101){
					pendingRequests=[];
					router.replace({name:'passwordlogin'});
					return;
				} 
	});	
	isRefreshingToken=false;
}

export default servicef
