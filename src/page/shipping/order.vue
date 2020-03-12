<template>
	<div class="order">
		<van-cell center :border="false" class="contact-card" is-link to="/user/address?from=submitorder">
			<template v-if="hasDefaultAddress ==false">
				<strong>选择地址</strong>
			</template>
			<template v-else>
				<strong>{{defaultAddress.name}} {{defaultAddress.tel}}</strong>
				<div>{{defaultAddress.address}} </div>
			</template>
		</van-cell>
		<div style="height:15px;"></div>
		<div class="card" v-for="(product,i) in products" :key="i">
			<product-card :product='product' />
		</div>
		<div style="height:15px;"></div>
		<van-cell-group>
			<van-field label="留言" v-model="leaveMsg" type="textarea" placeholder="请输入留言" rows="1" autosize />
		</van-cell-group>
		<div style="height:15px;"></div>
		<van-cell-group class="total">
			<van-cell title="商品总额" :value="productsTotalAmount" />
			<van-cell title="快递费用" :value="'+'+ expressFee" />
			<van-cell title="实付金额" :value="factToPayAmount" style="font-weight: 700;" />
		</van-cell-group>

		<div style="height:50px;"></div>
		<van-submit-bar :price="factToPayAmount*100" :tip="expressTip" :loading="showLoading" button-text="提交订单" label='实付金额：'
		 @submit="onSubmit" />
		<my-loading v-if='showLoading' text='正在下单,请稍等...'></my-loading>
	</div>
</template>

<script>
	import myconstants from "../../config/constants.js";
	import {
		GetUserId,
		RemoveLocalStorageWithPrefix
	} from "../../lib/helper.js";
	import {
		GetDefaultAddress,
		SubmitOrder
	} from '../../api/user.js';

	export default {
		data() {
			return {
				isFirstEnter: false,
				hasDefaultAddress: false,
				limitCountPerOrder: 3,
				defaultAddress: {
					name: "",
					tel: "",
					address: "",
					id: 0,
				},
				leaveMsg: "",
				showLoading: false,
				expressFee: 0,
				products: [],
				productsTotalAmount: 0,
				factToPayAmount: 0,
				userId: 0
			};
		},
		created: function() {

		},
		computed: {
			expressTip: function() {
				return this.expressFee > 0 ? "偏远地区需要另加快递费，请知晓！" : "免快递费";
			},
			getAllProductsCount() {
				let productsCount = 0;
				this.products.forEach((item) => {
					productsCount += item.quantity;
				});
				return productsCount;
			}
		},
		beforeRouteEnter(to, from, next) {
			if (from.name == 'useraddresslist') { // 这个name是下一级页面的路由name
				to.meta.isBack = true; // 设置为true说明是返回到这个页面，而不是通过跳转从其他页面进入到这个页面
			}
			next()
		},
		mounted() {
			this.isFirstEnter = true
		},
		activated() {
			if (!this.$route.meta.isBack || this.isFirstEnter) {
				// 这里要初始化data()中的数据
				//是否有用户信息，有的话就解析出来
				var tokenData = this.$cookies.get(myconstants.token);
				var userId = GetUserId(tokenData);
				this.userId = userId;
				this.spliceOrderInfoStorage();
				if (this.products.length <= 0) {
					this.$router.push('home');
					return;
				}
				// 这里发起数据请求，（之前是放在created或者mounted中，现在只需要放在这里就好了，不需要再在created或者mounted中请求！！）
				GetDefaultAddress().then(res => {
					if (res.CodeMsg.Code == 1) {
						let addr = res.Content;
						this.defaultAddress = addr;
						this.defaultAddress.address = addr.province + addr.city + addr.county + addr.addressDetail;
						this.hasDefaultAddress = true;
						this.getAllProductsAmount();
						this.getExpressFee();
						this.getActualPayAmount();
					}
				}).catch(err => console.log(err));
			}
			this.$route.meta.isBack = false //请求完后进行初始化
			this.isFirstEnter = false; //请求完后进行初始化
			this.bus.$on('selectAddress', (selectAddress) => {
				this.hasDefaultAddress = true;
				this.defaultAddress = selectAddress;
			});
			this.getAllProductsAmount();
			this.getExpressFee();
			this.getActualPayAmount();
		},
		methods: {
			updateSelectAddress(newAddress) {
				this.defaultAddress = newAddress;
			},
			onSubmit() {
				if (this.defaultAddress.id <= 0) {
					this.$toast.fail("先要填写收货地址哦！");
					return;
				}
				//判断订单产品数量
				if (this.getAllProductsCount > this.limitCountPerOrder) {
					//如果出错，清空订单缓存
					RemoveLocalStorageWithPrefix(myconstants.orderInfoUnknownUser);
					this.$toast.fail("每月最多可领取" + this.limitCountPerOrder + "个产品！");
					return;
				}
				this.showLoading = true;
				var order = {
					addressId: this.defaultAddress.id,
					products: this.products,
					leaveMsg: this.leaveMsg,
					expressFee: this.expressFee,
					productsTotalAmount: this.productsTotalAmount,
					factToPayAmount: this.factToPayAmount
				};
				SubmitOrder(order).then(res => {
					if (res.CodeMsg.Code == 1) {
						//跳转到订单详情页面进行支付
						this.$router.push('/user/order/info/' + res.Content);
						//1.购物车缓存整合，购物车缓存除去已下单缓存
						this.spliceCartStorage();
						this.clearData();
						//删除已下单的购物车数据和订单缓存
						RemoveLocalStorageWithPrefix(myconstants.orderInfoUnknownUser);

					} else {
						this.$dialog.alert({
							title:'下单失败',
							message: res.CodeMsg.Description,
						});
					}
					this.showLoading = false;
				}).catch(err => console.log(err));
			},
			spliceCartStorage() {
				var cartKey = myconstants.cartInfoUnknownUser;
				var userCartKey = myconstants.cartInfoWithUser + this.userId;
				var cartInfoStr = localStorage.getItem(cartKey);
				var userCartInfoStr = localStorage.getItem(userCartKey);
				if (!userCartInfoStr)
					return;
				var cartArr = JSON.parse(cartInfoStr);
				var userCartArr = JSON.parse(userCartInfoStr);
				this.products.forEach(item => {
					if (cartInfoStr) {
						var caIndex = cartArr.findIndex(ca => ca.productId == item.productId);
						if (caIndex >= 0) {
							cartArr.splice(caIndex, 1);
						}
					}

					var ucIndex = userCartArr.findIndex(uc => uc.productId == item.productId);
					if (ucIndex >= 0) {
						userCartArr.splice(ucIndex, 1);
					}
				});
				//合并购物车数据,保存到缓存，达到整理的效果
				userCartArr.push.apply(userCartArr, cartArr);
				localStorage.setItem(userCartKey, JSON.stringify(userCartArr));
				//删除匿名购物车缓存
				localStorage.removeItem(cartKey);
			},
			spliceOrderInfoStorage() {
				var orderInfoKey = myconstants.orderInfoUnknownUser;
				var userOrderInfoKey = myconstants.orderInfoWithUser + this.userId;
				var orderInfoStr = localStorage.getItem(orderInfoKey);
				var userOrderInfoStr = localStorage.getItem(userOrderInfoKey);
				var orderInfoArr = orderInfoStr ? JSON.parse(orderInfoStr) : [];
				var userOrderInfoArr = userOrderInfoStr ? JSON.parse(userOrderInfoStr) : [];
				//合并订单缓存数据,保存到缓存，达到整理的效果
				if(userOrderInfoArr.length){
					if(orderInfoArr.length){
						for(var i=0;i<orderInfoArr.length;i++){
							//判断是否有相同的产品,有则合并，无则追加
							var goodsIndex = userOrderInfoArr.findIndex(item =>
								item.productId == orderInfoArr[i].productId);
							if (goodsIndex > -1) {
								userOrderInfoArr[goodsIndex].quantity += orderInfoArr[i].quantity;
							} else {
								userOrderInfoArr.push(orderInfoArr[i]);
							}
						}
					}
					this.products = userOrderInfoArr;
				}else{
					this.products=orderInfoArr;
				}
			},
			getExpressFee: function() {
				var feeAddressArr = ['西藏', '新疆'];
				for (var index in feeAddressArr) {
					if (this.defaultAddress.address.indexOf(feeAddressArr[index]) != -1) {
						this.expressFee = 10;
					} else {
						this.expressFee = 0;
					}
				}
				return this.expressFee;
			},
			getAllProductsAmount: function() {
				let allProductsAmount = 0;
				this.products.forEach((p) => {
					allProductsAmount += p.price * p.quantity;
				})
				var amount = parseFloat(allProductsAmount).toFixed(2);
				this.productsTotalAmount = amount;
				return amount;
			},
			getActualPayAmount: function() {
				var amount = (parseFloat(this.productsTotalAmount) + parseFloat(this.expressFee)).toFixed(2);
				this.factToPayAmount = amount;
				return amount;
			},
			clearData(){
				this.leaveMsg= "";
				this.showLoading=false;
				this.expressFee=0;
				this.products=[];
				this.userId=0;
				this.factToPayAmount=0;
				this.productsTotalAmount=0;
			}
		},
		beforeRouteLeave(to, from, next) {
			if (to.name == "passwordlogin"||to.name=='useraddresslist' || to.name == 'submitorder' || to.name == "orderinfo") {
				 //正常流程
			} else {
				RemoveLocalStorageWithPrefix(myconstants.orderInfoUnknownUser);
			}
			next();
		}
	};
</script>

<style lang="less">
	.order {
		font-size: 14px;
		background: #f7f7f7;

		.contact-card::before {
			content: "";
			left: 0;
			right: 0;
			bottom: 0;
			height: 2px;
			position: absolute;
			background: -webkit-repeating-linear-gradient(135deg,
				#ff6c6c 0,
				#ff6c6c 20%,
				transparent 0,
				transparent 25%,
				#3283fa 0,
				#3283fa 45%,
				transparent 0,
				transparent 50%);
			background: repeating-linear-gradient(-45deg,
				#ff6c6c 0,
				#ff6c6c 20%,
				transparent 0,
				transparent 25%,
				#3283fa 0,
				#3283fa 45%,
				transparent 0,
				transparent 50%);
			background-size: 80px;
		}

		.total {
			.van-cell__value {
				color: red;
			}
		}

		.van-submit-bar__bar {
			border-top: 1px solid #f7f7f7;
		}

		.additional {
			.van-cell {
				padding: 0 15px;
				font-size: 12px;
			}

			.van-cell__title {
				flex: 11;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.van-tag {
				line-height: 12px;
				margin-right: 5px;
			}

			.price {
				color: #e93b3d;
				font-size: 10px;

				span {
					font-size: 16px;
				}
			}
		}
	}
</style>
