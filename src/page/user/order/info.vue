<template>
	<div style="background: #f7f7f7;">
		<van-steps :active="active" v-if="order.orderState>=10">
			<van-step>已下单</van-step>
			<van-step>待支付</van-step>
			<van-step>待发货</van-step>
			<van-step>配送中</van-step>
			<van-step>已签收</van-step>
		</van-steps>
		<van-cell v-if="order.shipState==30" class="logistics" :to="'/user/order/logistics/'+order.orderNo" :title="order.lastQueryArrival"
		 :label="order.lastQueryTime" icon="logistics" is-link />
		<van-cell-group>
			<van-cell center :border="false">
				<template>
					<div>{{order.name}} {{order.tel}}</div>
					<div>{{order.address}} </div>
				</template>
			</van-cell>
		</van-cell-group>
		<div v-for="(product,i) in order.products" :key="i">
			<product-card :product='product' />
		</div>
		<van-cell-group>
			<van-cell title="订单编号" :value="order.orderNo" />
			<van-cell title="下单时间" :value="order.makeOrderTime" />
			<van-cell title="订单状态" :value="order.orderStateDesc" />
		</van-cell-group>
		<div>
			<van-count-down style="color: red;font-size: small;text-align: center;" v-if="order.orderState==10" :time="order.autoCloseLeftTime"
			 format="剩 HH 时 mm 分 ss 秒自动关闭" />
		</div>
		<van-cell-group class="total">
			<van-cell title="商品总额" :value="order.productsAmount" />
			<van-cell title="快递运费" :value="'+'+ order.expressFee" v-if="order.expressFee>0" />
			<van-cell title="实付金额" :value="order.orderAmount" style="font-weight: 700;" />
		</van-cell-group>
		<div style="height: 15px;"></div>
		<van-button v-if="order.orderState==10" @click="goToPay(order.id)" :loading="isPaying" loading-text="请稍等..." type="danger"
		 round block>去支付</van-button>
		<div style="height: 5px;"></div>
		<van-button v-if="order.orderState==10" @click="cancelOrder(order.id)" type="info" round plain block>取消</van-button>
		<van-divider>这里是底线</van-divider>
	</div>
</template>

<script>
	import {
		GetOrder,
		CancelOrder,
		JsApiPay
	} from '../../../api/user.js';
	import WxPay from '../../../lib/WeChatPay.js';
	export default {
		data() {
			return {
				active: 1,
				order: {},
				isPaying: false
			}
		},
		created: function() {
			let params = this.$route.params;
			if (params) {
				let orderId = params["id"];
				GetOrder(orderId).then(res => {
					if (res.CodeMsg.Code == 1) {
						this.order = res.Content;
						this.setActive();
					} else {
						this.$toast.fail(res.Content);
					}
				}).catch(e => console.log(e));
			}
		},
		computed: {
			setCurrentActive: function() {
				this.setActive();
			}
		},
		methods: {
			cancelOrder(orderId) {
				this.$dialog.confirm({
					title: '温馨提示',
					message: '确认要取消这个订单吗',
					confirmButtonText: '暂时不买',
					cancelButtonText: '容我考虑考虑',
				}).then(() => {
					CancelOrder(orderId).then(res => {
						if (res.CodeMsg.Code == 1) {
							this.$toast.success('订单已取消');
							this.$router.replace({
								name: 'orderlist',
								params: {
									'tabId': 4
								}
							});
						}
					}).catch(e => console.log(e));
				}).catch(() => {
					// on cancel
				});

			},
			goToPay(orderId) {
				this.isPaying = true;
				JsApiPay({
					orderId: orderId
				}).then(res => {
					if (res.CodeMsg.Code == 1) {
						WxPay(res.Content,
							//支付成功跳转页面
							succ => {
								this.$toast.success('支付成功');
								this.$router.push({
									name: "orderlist",
									params:{tabId:2}
								});
							},
							//err callback
							err => {
								this.$toast.fail('支付失败');
								console.log(err);
							}
						);
					} else {
						this.$dialog.alert({
							title: '支付失败',
							message: res.CodeMsg.Description
						});
					}
					this.isPaying = false;
				}).catch(e => console.log(e));

			},
			setActive() {
				if (this.order.orderState == 10) {
					this.active = 1;
				} else if (this.order.shipState == 20) {
					this.active = 2;
				} else if (this.order.shipState == 30) {
					this.active = 3;
				} else if (this.order.shipState == 40) {
					this.active = 4;
				}
			}
		}
	}
</script>

<style lang="less">
	.logistics {
		margin-top: 15px;

		i {
			line-height: 60px;
			font-size: 20px;
		}

		.van-cell__title span {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.van-cell__label {
			color: #999;
		}
	}

	.total {
		.van-cell__value {
			color: red;
		}
	}

	.footer {
		height: 50px;

		.munu {
			position: fixed;
			height: 49px;
			border-top: 1px solid #e5e5e5;
			bottom: 0;
			background: #fff;
			width: 100%;
			line-height: 24px;
			text-align: right;

			.van-button {
				margin-right: 10px;
			}
		}
	}
</style>
