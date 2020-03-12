<template>
	<div id="cart">
		<headerNav :title="'购物车共('+this.getAllProductsCount+')件宝贝'" />
		<van-cell v-if="goods.length" value="" class="head">
			<template slot="title">
				<van-checkbox v-model="checkedAll" @click="selectAll">{{isCheckAll?'取消全选':'全选'}}</van-checkbox>
			</template>
			<van-button type="danger" plain size="mini" @click="clear">清空</van-button>
		</van-cell>

		<van-checkbox-group class="card-goods" v-model="checkedGoods" ref="checkboxGroup">
			<!-- <van-checkbox class="card-goods" v-for="(item,index) in goods" :key="index" :name="item.productId">
					<product-card :product='item' :iscard='true'>
					</product-card> -->
			<van-checkbox class="card-goods__item" v-for="(item,index) in goods" :key="index" :name="item.productId">
				<van-card :title="item.title" lazy-load :desc="item.desc" :num="item.quantity" :origin-price="item.originPrice"
				 :price="formatPrice(item.price)" :thumb="item.imageURL">
					<div slot='bottom'>
						<van-stepper :name='item.productId' @change='onStepperChange' @click.native.stop integer v-model="item.quantity" :max="item.max" :min="item.min" @overlimit="getLimitTip(item.quantity)" />
					</div>
					<div slot='footer'>
						<van-button click.native.stop plain type="danger" @click="deleteGoods(item.productId)" size="mini">删除</van-button>
					</div>
				</van-card>
			</van-checkbox>
		</van-checkbox-group>

		<div v-if="!goods.length" style="margin-bottom: 1px;">
			<div style="text-align: center;padding-top:150px">
				<div class="wrap_cart">
					<van-icon name="shopping-cart" class="empty_cart"></van-icon>
				</div>
				<p class="text_empty">购物车竟然是空的</p>
				<p class="buy_text">“再忙，也要买点什么犒赏自己~”</p>
			</div>
		</div>
		<van-submit-bar style="margin-bottom: 44px;" :price="totalPrice" :disabled="!checkedGoods.length" :button-text="submitBarText"
		 @submit="onSubmit">
			<template slot>
				<van-checkbox v-if="goods.length>0" v-model="checkedAll" @click="selectAll">{{isCheckAll?'取消全选':'全选'}}</van-checkbox>
			</template>
		</van-submit-bar>
		<navigate />
	</div>
</template>

<script>
	import myconstants from "../../config/constants.js";
	import {hasToken,isValidToken} from '../../lib/helper.js';
	import {
		GetUserId,
		RemoveLocalStorageWithPrefix
	} from "../../lib/helper.js";
	export default {
		components: {},
		data() {
			return {
				checkedAll: false,
				checkedGoods: [],
				goods: [],
				userId: 0,
				limitCountPerOrder:3,
			};
		},
		created: function() {
			//是否有用户信息，有的话就解析出来
			var tokenData = this.$cookies.get(myconstants.token);
			var userId = GetUserId(tokenData);
			this.userId = userId;

			//先判断本地缓存是否有本人购物车的数据，再判断是否有匿名购物车数据，有则合并
			var currentUserCartCache = localStorage.getItem(myconstants.cartInfoWithUser + this.userId);
			var unknownUserCartCache = localStorage.getItem(myconstants.cartInfoUnknownUser);

			var currentUserCachedGoods = [];
			var unknownUserCachedGoods = [];
			if (currentUserCartCache) {
				currentUserCachedGoods = JSON.parse(currentUserCartCache);
			}
			if (unknownUserCartCache) {
				unknownUserCachedGoods = JSON.parse(unknownUserCartCache);
			}
			if (currentUserCachedGoods.length) {
				if (unknownUserCachedGoods.length) { //当前用户有购物车缓存且还有匿名用户缓存
					//将匿名缓存加到当前用户
					for (var i = 0; i < unknownUserCachedGoods.length; i++) {
						//判断是否有相同的产品,有则合并，无则追加
						var goodsIndex = currentUserCachedGoods.findIndex(item =>
							item.productId == unknownUserCachedGoods[i].productId);
						if (goodsIndex > -1) {
							currentUserCachedGoods[goodsIndex].quantity += unknownUserCachedGoods[i].quantity;
						} else {
							currentUserCachedGoods.push(unknownUserCachedGoods[i]);
						}
					}
					this.goods = currentUserCachedGoods;
				} else { //当前用户有购物车缓存，且没有匿名用户缓存
					this.goods = currentUserCachedGoods;
				}
			} else {
				if (unknownUserCachedGoods.length) { //当前用户没有购物车缓存，但是有匿名用户缓存
					this.goods = unknownUserCachedGoods;
				}
			}
		},
		computed: {
			//判断是否全部选中 https://segmentfault.com/a/1190000016313367
			isCheckAll() {
				if (this.checkedGoods.length == this.goods.length) {
					this.checkedAll = true;
					return true;
				}
				this.checkedAll = false;
				return false;
			},
			submitBarText() {
				const count = this.checkedGoods.length;
				return '结算' + (count ? `(${count})` : '');
			},
			totalPrice() {
				var centAmount = this.goods.reduce((total, item) => total + (this.checkedGoods.indexOf(item.productId) !== -1 ?
					parseFloat(
						item.price * item.quantity) : 0), 0);
				return centAmount * 100;
			},
			getAllProductsCount(){
				let productsCount=0;
				this.goods.forEach((item)=>{
					productsCount+=item.quantity;
				});
				return productsCount;
			},
			getSelectedProductsCount(){
				let productsCount=0;
				if(this.checkedGoods.length<=0)
					return productsCount;
				this.goods.forEach((item)=>{
					if(this.checkedGoods.findIndex(id=>item.productId==id)>=0){
						productsCount+=item.quantity;
					}
				});
				return productsCount;
			}
		},
		methods: {
			formatPrice(num) {
				return (num * 1.0).toFixed(2);
			},
			onStepperChange(value,detail){
				var key = myconstants.cartInfoUnknownUser;
				if (this.userId > 0) {
					key = myconstants.cartInfoWithUser + this.userId;
				}
				localStorage.setItem(key, JSON.stringify(this.goods));
			},
			getLimitTip(productQuantity) {
				if (productQuantity <= 1) {
					this.$toast({
						message: '受不了啦,宝贝不能再少啦',
						icon: 'warn-o'
					});
				} else {
					this.$toast({
						message: '莫贪心哦,宝贝不能再多啦',
						icon: 'warn-o'
					});
				}
			},
			onSubmit() {
				if(!(hasToken())){
					this.$toast.fail({
						message:"您还未登录，请先登录！",
						duration:3000
					});
					this.$router.push({
							name: 'passwordlogin',
							query: {redirect: this.$route.fullPath}});
					return;
				}
				let checkedGoodsId = JSON.parse(JSON.stringify(this.checkedGoods));
				//将要下单的商品存入localstorage
				let toBuyGoods = this.goods.filter(function(g) {
					return checkedGoodsId.findIndex(c => c == g.productId) >= 0;
				})
				if(this.getSelectedProductsCount>this.limitCountPerOrder){
					this.$toast.fail({
						message:"每月最多可领取"+this.limitCountPerOrder+"个产品！",
						duration:4000
					});
					return;
				}
				//要购买的产品加到订单缓存
				var key = myconstants.orderInfoUnknownUser;
				if (this.userId > 0) {
					key = myconstants.orderInfoWithUser + this.userId;
				}
				localStorage.setItem(key, JSON.stringify(toBuyGoods));
				this.$router.push({
					name: 'submitorder'
				});
			},
			selectAll() {
				if (this.checkedGoods.length != this.goods.length) {
					this.checkedGoods = this.goods.map(g => g.productId);
					this.checkedAll = true;
				} else {
					this.checkedGoods = [];
					this.checkedAll = false;
				}
			},
			clear() {
				this.$dialog.confirm({
					title: '温馨提示',
					message: '你确定要清空购物车吗？'
				}).then(() => {
					// on confirm
					this.goods = [];
					//清空匿名和实名购物车和订单缓存
					RemoveLocalStorageWithPrefix(myconstants.cartInfoUnknownUser);
					RemoveLocalStorageWithPrefix(myconstants.orderInfoUnknownUser);
				}).catch(() => {
					// on cancel
				});
			},
			deleteGoods(productId) {
				this.$dialog.confirm({
					title: '温馨提示',
					message: '你确定要删除这个商品吗？'
				}).then(() => {
					let item = this.goods.findIndex(item => item.id == productId);
					this.goods.splice(item, 1);
					//更新缓存
					var key = myconstants.cartInfoUnknownUser;
					if (this.userId > 0) {
						key = myconstants.cartInfoWithUser + this.userId;
					}
					localStorage.setItem(key, JSON.stringify(this.goods));
				}).catch(e => console.log(e));
			}
		}
	};
</script>

<style lang="less">
	.card-goods {
		padding: 10px 0;
		background-color: #fff;

		&__item {
			position: relative;
			background-color: #fafafa;

			.van-checkbox__label {
				width: 100%;
				height: auto; // temp
				padding: 0 10px 0 15px;
				box-sizing: border-box;
			}

			.van-checkbox__icon {
				top: 50%;
				left: 10px;
				z-index: 1;
				position: absolute;
				margin-top: -10px;
			}

			.van-card__price {
				color: #f44;
			}
		}
	}

	#cart .empty_cart {
		font-size: 85px;
		color: #ececec;
		margin-top: 15px;
	}

	#cart .wrap_cart {
		display: inline-block;
		padding: 5px;
		background: -webkit-gradient(linear, left top, right top, from(#eb9c42), to(#e8632d));
		border-radius: 50%;
		width: 106px;
		height: 106px;
	}

	#cart .text_empty {
		font-size: 16px;
		color: grey;
		font-family: '微软雅黑';
		line-height: 28px
	}

	#cart .buy_text {
		font-size: 14px;
		-webkit-transform: scale(0.9)
	}
</style>
