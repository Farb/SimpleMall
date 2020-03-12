<template>
	<div class="goods" v-if="goods.title">
		<headerNav />
		<van-swipe class="goods-swipe" :autoplay="3000">
			<van-swipe-item v-for="thumb in goods.thumbs" :key="thumb">
				<van-image :src="thumb" lazy-load>
					<template v-slot:loading>
						<van-loading type="spinner" color="#1989fa" size="20" />
					</template>
				</van-image>
			</van-swipe-item>
		</van-swipe>

		<van-cell-group>
			<van-cell>
				<span class="goods-price">{{ formatPrice(goods.price) }}</span>
				<span class="goods-market-price">{{ formatPrice(goods.originPrice) }}</span>
				<div class="goods-title">{{ goods.title }}</div>
				<div class="goods-subtit"  v-html="goods.subtitle"></div>
			</van-cell>

			<van-cell class="goods-tag">
				<template slot="title" style="font-size:10px;">
					<img lazy-load src="http://huayunpp.oss-cn-shenzhen.aliyuncs.com/logos/l0bMND.png" />
					<span>华芸品牌</span>
					<van-icon name="passed" color="red" />
					<span>当天发货</span>
					<van-icon name="passed" color="red" />
					<span>默认百世快递</span>
					<van-icon name="passed" color="red" />
					<span>省外3-5天到达</span>
					<van-icon name="passed" color="red" />
					<span>省内1天到达</span>
					<van-icon name="passed" color="red" />
					<span>新疆，西藏等偏远地区不包邮</span>

				</template>
			</van-cell>
		</van-cell-group>

		<div class="goods-info">
			<p class="goods-info-title">图文详情</p>
			<div>
				<p v-for="item in goods.infos" :key="item.id" style="text-align:center;">
					<van-image :src="item" lazy-load>
						<template v-slot:loading>
							<van-loading type="spinner" size="20" />
						</template>
					</van-image>
				</p>
			</div>
		</div>
		<van-goods-action>

			<!-- 	<van-goods-action-icon icon="like-o" @click="sorry">
				收藏
			</van-goods-action-icon> -->
			<van-goods-action-icon icon="cart" @click="onClickCart">
				购物车
			</van-goods-action-icon>
			<van-goods-action-button type="warning" @click="onAddCartClicked">
				加入购物车
			</van-goods-action-button>
			<van-goods-action-button type="danger" @click="onBuyClicked">
				立即购买
			</van-goods-action-button>
		</van-goods-action>
	</div>
</template>

<script>
	import myconstants from "../../config/constants.js";
	import {GetUserId} from "../../lib/helper.js";
	import {
		getProduct
	} from '../../api/page.js';

	export default {
		components: {},
		data: function() {
			return {
				goods: {
					title: ""
				},
				userId:0
			};
		},
		created: function() {
			let productId = this.$route.params.id;
			getProduct(productId).then(res => {
				if (res.CodeMsg.Code == 1) {
					this.goods = res.Content;
				}
			}).catch(err => console.log(err));
			
			//是否有用户信息，有的话就解析出来
			var tokenData= this.$cookies.get(myconstants.token);
			var userId= GetUserId(tokenData);
			this.userId=userId;
		},
		methods: {
			formatPrice(num) {
				return '¥' + (num*1.0).toFixed(2);
			},
			onClickCart() {
				this.$router.push('/cart');
			},
			onBuyClicked() {
				//要购买的产品加到订单缓存
				let newGoodsInfo = [{
					productId: this.goods.id,
					title: this.goods.title,
					price: (this.goods.price*1.0).toFixed(2),
					originPrice: (this.goods.originPrice*1.0).toFixed(2),
					quantity: 1,
					imageURL: this.goods.thumbs[0]
				}];
				var key=myconstants.orderInfoUnknownUser;
				if(this.userId>0){
					key=myconstants.orderInfoWithUser+this.userId;
				}
				localStorage.setItem(key,JSON.stringify(newGoodsInfo));
				this.$router.push({name:'submitorder'});
			},
			addToCart() {
				var key=myconstants.cartInfoUnknownUser;
				if(this.userId>0){
					key=myconstants.cartInfoWithUser+this.userId;
				}
				let cartInfo = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
				let isHaveGoods = cartInfo.find(cart => cart.productId == this.goods.id);
				if (!isHaveGoods) {
					let newGoodsInfo = {
						productId: this.goods.id,
						title: this.goods.title,
						price: (this.goods.price*1.0).toFixed(2),
						originPrice: (this.goods.originPrice*1.0).toFixed(2),
						quantity: 1,
						imageURL: this.goods.thumbs[0]
					};
					cartInfo.push(newGoodsInfo);
					localStorage.setItem(key,JSON.stringify(cartInfo));
					this.$toast.success("宝贝已成功添加到购物车^_^");
				} else {
					this.$toast.fail('购物车已经有这个宝贝啦~');
				}
			},
			onAddCartClicked() {
				this.addToCart();
			},

		}
	};
</script>

<style lang="less">
	.goods {
		padding-bottom: 50px;

		&-swipe {
			img {
				width: 7.5rem;
				height: 7.5rem;
				display: block;
			}
		}

		&-tag {
			font-size: 12px;
			border-top: 1px solid #e5e5e5;

			span {
				margin-right: 10px;
			}

			i {
				color: red;
				margin-right: 3px;
			}

			img {
				width: 12px;
				margin-right: 3px;
				margin-top: 6px;
			}
		}

		&-title {
			line-height: 18px;
			padding-top: 10px;
			margin-bottom: 6px;
			font-size: 14px;
			color: #333;
			font-weight: 700;
			border-top: 1px solid #f0f0f0;
		}

		&-subtit {
			font-size: 13px;
			color: #333;
			line-height: 21px;
		}

		&-price {
			color: #f44;
			font-size: 20px;
		}

		&-market-price {
			text-decoration: line-through;
			margin-left: 8px;
			font-size: 13px;
			color: #999;
		}

		&-cell-group {
			margin: 15px 0;

			.van-cell__value {
				color: #999;
			}
		}

		&-info-title {
			height: 44px;
			line-height: 44px;
			text-align: center;
			font-size: 14px;
			font-weight: 700;
			margin: 10px;
			border-top: 1px solid #e5e5e5;
		}

		&-info p {
			margin: 0;
			padding: 0;
			margin-block-end: 0;
			margin-block-start: 0;
			display: grid;
		}

		&-info img {
			width: 100%;
		}
	}
</style>
