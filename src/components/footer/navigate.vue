<template>
	<div style="height:50px;">
		<van-tabbar v-model="active" active-color="#e80000" inactive-color="#000">
			<van-tabbar-item  icon="wap-home" replace to="/home">首页</van-tabbar-item>
			<!-- <van-tabbar-item icon="wap-nav" to="/category" >分类</van-tabbar-item> -->
			<van-tabbar-item icon="cart" replace to="/cart">购物车</van-tabbar-item>
			<van-tabbar-item icon="manager" replace to="/user/index">我的</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	import {
		Tabbar,
		TabbarItem
	} from "vant";
	export default {
		name: 'navigate',
		components: {
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
		},
		computed:{
			active:{
				get(){
					const map={
						'home':0,
						'cart':1,
						'userindex':2
					};
					return map[this.$route.name];
				},
				set(val){
					
				}
			}
		}
	}
</script>
