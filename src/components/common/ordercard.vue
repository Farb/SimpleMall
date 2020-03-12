<template>
	<!-- 	订单状态转移 1-已下单， 10-待支付,44-已取消，100-已支付,110-待发货，120-已发货,200-已完成-->
	<van-cell-group class="order-item">
		<van-panel :title="'订单编号：'+order.orderNo">
			<div slot="header">
				<van-cell class="title" :title="'订单编号：'+order.orderNo" :value="order.orderStateDesc" :to="'/user/order/info/'+order.id" />
			</div>
			<div>
				<router-link :to="'/user/order/info/'+order.id">
					<div v-for="(product,i) in order.products" :key="i">
						<product-card :product='product' />
					</div>
				</router-link>
			</div>
			<div slot="footer" style="height: 25px;">
				<span class="total">总价：￥{{order.orderAmount}}</span>
				<van-button size="small" v-if="order.orderState==120" type="danger" :plain="true" @click="sureReceiveGoods(order.id)">确认收货</van-button>
				<van-button size="small" v-if="order.orderState<=10" @click="cancelOrder(order.id)" plain>取消</van-button>
				<van-button size="small" v-if="order.orderState<=10" type="danger" :loading="isPaying" loading-text="请稍等..." @click="goToPay(order.id)">支付</van-button>
			</div>
		</van-panel>
	</van-cell-group>
</template>

<script>
	import {CancelOrder,MakeSureToReceiveOrder,JsApiPay} from '../../api/user.js';
	import  WxPay from '../../lib/WeChatPay.js';
	export default {
		name: "order-card",
		props: {
			order: Object
		},
		data(){
			return {
				isPaying:false
			};
		},
		methods: {
			sureReceiveGoods(orderId) {
				this.$dialog.confirm({
					title: "温馨提醒",
					message: "您确认已经收货了吗？"
				}).then(()=>{
						//后端修改订单为已收货
						MakeSureToReceiveOrder(orderId).then(res=>{
							if(res.CodeMsg.Code==1){
								this.order.orderState=200;
								this.order.orderStateDesc='已完成';
								this.$toast.success("确认成功，祝购物愉快^_^");
							}
						}).catch(e=>console.log(e));
					}
				).catch((err) => {
					console.log(err);
				});
			},
			cancelOrder(orderId) {
				this.$dialog.confirm({
					title: '温馨提示',
					message: '确认要取消这个订单吗',
					confirmButtonText: '暂时不买',
					confirmButtonColor:'#323233',
					cancelButtonText: '容我考虑考虑',
					cancelButtonColor:'#ee0a24'
				}).then(() => {
					CancelOrder(orderId).then(res=>{
						if(res.CodeMsg.Code==1){
							this.order.orderState=44;
							this.order.orderStateDesc='已取消';
							this.$toast.success('订单已取消');
						}
					}).catch(e=>console.log(e));
				});
			},
			goToPay(orderId) {
				this.isPaying=true;
				JsApiPay({orderId:orderId}).then(res => {
					if (res.CodeMsg.Code == 1) {
						WxPay(res.Content,
							//支付成功跳转页面
							succ=> {
								this.$toast.success('支付成功');
								this.$router.push({
									name: "orderinfo",
									params: { id: orderId }
								});
							},
							//err callback
							err=> {
								this.$toast.fail('支付失败');
								console.log(err);
							}
						);
					} else {
						 this.$dialog.alert({
							 title:'支付失败',
						      message: res.CodeMsg.Description
						    });
					}
					this.isPaying=false;
				}).catch(e => console.log(e));
			}
		}
	}
</script>

<style>
</style>
