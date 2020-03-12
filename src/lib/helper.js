import jwt from 'jsonwebtoken';
import {GetUserIndex} from '../api/user.js';
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import myconstants from "../config/constants.js";

Vue.use(VueCookies);

export function FormatLocalTime(unixTime){
	var time=new Date(unixTime);
	return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}

export function GetWeChatOpenId(){
	if(Vue.$cookies.isKey(myconstants.wxOpenId)){
		return Vue.$cookies.get(myconstants.wxOpenId);
	}
	GetUserIndex().then(res=>{
		if(res.CodeMsg.Code==1){
			return res.Content.WeChatOpenId;
		}
	}).catch(e=>console.log(e));
}

export function GetUserInfo(tokenData) {
	if (tokenData) {
		if (tokenData.token) {
			var decodeText = jwt.decode(tokenData.token);
			return decodeText;
		}
	}
}

export function GetUserId(tokenData) {
	var userInfo = GetUserInfo(tokenData);
	if (userInfo) {
		return userInfo.id;
	}
	return 0;

}

export function RemoveLocalStorageWithPrefix(prefix) {
	//https://stackoverflow.com/questions/24551578/clear-localstorage-values-with-certain-prefix
	var arr = []; // Array to hold the keys
	// Iterate over localStorage and insert the keys that meet the condition into arr
	for (var i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).substring(0, prefix.length) == prefix) {
			arr.push(localStorage.key(i));
		}
	}

	// Iterate over arr and remove the items by key
	for (var i = 0; i < arr.length; i++) {
		localStorage.removeItem(arr[i]);
	}
}

export function hasToken() {
	if (Vue.$cookies.isKey(myconstants.token) && Vue.$cookies.isKey(myconstants.refreshtoken)) {
		return true;
	}
	return false;
}

export function isValidToken() {
	var tokenData = Vue.$cookies.get(myconstants.token);
	//check token real expire time
	if (tokenData && tokenData.realExpiresTime && new Date().getTime() <= tokenData.realExpiresTime) {
		return true;
	}
	return false;
}

export function GetQueryString(name){  
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
     var r = window.location.search.substr(1).match(reg);  
     if (r != null)
		return unescape(r[2]); 
	 return null;              
}  
