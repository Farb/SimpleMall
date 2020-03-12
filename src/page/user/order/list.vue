<template>
	<div>
		<headerNav title="" />
		<van-tabs v-model="active" sticky swipeable @change="onChange">
			<van-tab v-for="(item,index) in titles" :title="item" :key='index'>
				<van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="已经到底了" @load="onLoad" :offset="10">
					<div v-for="(item,index) in list" :key="index">
						<order-card :order="item"></order-card>
					</div>
				</van-list>
			</van-tab>

		</van-tabs>
	</div>
</template>

<script>
	import ordercard from "../../../components/common/ordercard.vue";
	import {
		GetOrderList
	} from '../../../api/user.js';
	export default {
		components: {
			"order-card": ordercard
		},
		data() {
			return {
				titles:['全部','待支付','待收货','已完成','已取消'],
				active: 0,
				list: [],
				currentState: 0,
				loading: false,
				finished: false,
				page: 1, //请求第几页
				pageSize: 5, //每页请求的数量
				total: 0, //总共的数据条数
			}
		},
		created: function() {
			//tabId是个人页面订单状态的顺序
			//订单状态转移 已下单， 10-待支付,44-已取消，已支付,110-待发货，120-已发货,160-已收货，200-已完成
			let params = this.$route.params;
			if (params) {
				let tabId = params["tabId"];
				if (tabId == 1) {
					this.active = 1;
				} else if (tabId == 2) {
					this.active = 2;
				} else if (tabId == 3) {
					this.active = 3;
				} else if (tabId == 4) {
					this.active = 4;
				} else {
					this.active = 0;
				}
				this.setCurrentStateByActive(this.active);
				this.getData();
			}
		},
		activated() {
			
		},
		methods: {
			initData() {
				this.page = 1;
				this.total = 0;
				this.finished=false;
				this.list = [];
			},
			getData() {
				var selectedState = this.currentState;
				let params = {
					page: this.page,
					pageSize: this.pageSize,
					orderState: selectedState
				};

				GetOrderList(params).then(res => {
					if (res.CodeMsg.Code == 1) {

						if (res.Content == null || res.Content.length === 0) {
							// 加载结束
							this.finished = true;
							return;
						}
						let newRows = res.Content.orderList;
						this.loading = false;
						this.total = res.Content.total;

						if (newRows.length === 0) {
							// 加载结束
							this.finished = true;
							return;
						}

						// 将新数据与老数据进行合并
						this.list = this.list.concat(newRows);

						//如果列表数据条数>=总条数，不再触发滚动加载
						if (this.list.length >= this.total) {
							this.finished = true;
						}
					} else {
						this.$toast.fail(res.CodeMsg.Title + ":" + res.CodeMsg.Description);
					}
				}).catch(e => console.log(e));
			},
			//滚动加载时触发，list组件定义的方法
			onLoad() {
				this.page++;
				this.getData();
			},
			onChange(index, title) {
				this.setCurrentStateByActive(index);
				this.initData();
				this.loading=true;
				this.getData();
			},
			setCurrentStateByActive(active) {
				switch (active) {
					case 1:
						this.currentState = 10;
						break;
					case 2:
						this.currentState = 30;
						break;
					case 3:
						this.currentState = 200;
						break;
					case 4:
						this.currentState = 44;
						break;
					default:
						this.currentState = 0;
						break;
				}
			}

		},
	}
</script>

<style lang="less">
	.order-item {
		margin-bottom: 10px;
		font-size: 12px;

		.title {
			border-bottom: 1px solid #e5e5e5;

			.van-cell__title {
				flex: 2;
			}

			.van-cell__value {
				color: red;
			}
		}


		.van-panel__footer {
			text-align: right;
			border-bottom: 1px solid #e5e5e5;
		}

		.van-button {
			margin-left: 5px;
		}

		.total {
			position: absolute;
			top: 17px;
			left: 15px;
			font-size: 13px;
		}

		.more {
			overflow-x: scroll;
			white-space: nowrap;
			-webkit-overflow-scrolling: touch;
			margin: 5px 0 5px 15px;

			.item {
				width: 90px;
				height: 90px;
				margin-right: 10px;
				display: inline-block;

				img {
					width: 100%;
				}
			}
		}
	}
</style>
