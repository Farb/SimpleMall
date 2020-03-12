<template>
	<div style="background: #f7f7f7;">
		<headerNav title="订单追踪" />
		<van-cell-group>
			<van-cell title="订单编号" :value="orderNo" />
			<van-cell title="快递单号" :value="expressInfo.ExpressNo" />
		</van-cell-group>
		<van-divider :style="{color: '#1989fa', borderColor: '#1989fa', padding: '0 16px'}">快递详情</van-divider>
		<van-steps direction="vertical" :active="0" active-color="#f60" style="margin-top: 15px;">
			<van-step v-for='item in expressInfo.Context'>
				<h3>{{item.Desc}}</h3>
				<p>{{formatTime(item.Time)}}</p>
			</van-step>
		</van-steps>
	</div>
</template>

<script>
	import {
		GetOrderExpressInfo
	} from '../../../api/user.js';
	import {
		FormatLocalTime
	} from '../../../lib/helper.js';
	export default {
		data() {
			return {
				orderNo:'',
				expressInfo: {}
			}
		},
		created: function() {
			let params = this.$route.params;
			if (params) {
				let no = params["orderNo"];
				this.orderNo=no;
				GetOrderExpressInfo(no).then(res => {
					if(res.CodeMsg.Code==1){
						this.expressInfo=res.Content;
					}
				}).catch(e => console.log(e));
			}

		},
		methods: {
			formatTime(unixTime) {
				return FormatLocalTime(unixTime * 1000);
			}
		}
	}
</script>

<style>

</style>
