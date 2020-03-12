<template>
	<van-cell-group class="additional">
		<van-card :title="product.title" :desc="product.desc" :num="(iscard?null:product.quantity)" :origin-price="product.originPrice"
		:thumb="product.imageURL" style="background:#fff">
			<template slot="tags">
				<p class="price" v-if="product.price!=null&&product.price!=''">
					￥<span>{{product.price}}</span>
					<van-tag v-if="product.tags!=null" v-for="tag in product.tags" :key="tag" plain type="danger">{{tag}}</van-tag>
				</p>
				<van-stepper integer v-if="iscard" v-model="product.quantity" :max="product.max" :min="product.min" @overlimit="getLimitTip"/>
			</template>

		</van-card>
		<slot />
	</van-cell-group>
</template>

<script>
	export default {
		name: 'product-card',
		props: {
			product: Object,
			iscard: {
				type: Boolean,
				default: false
			},
		},
		methods:{
			getLimitTip(){
				if(this.product.quantity<=1){
					this.$toast({message:'受不了啦,宝贝不能再少啦',icon:'warn-o'});
				}else{
					this.$toast({message:'莫贪心哦,宝贝不能再多啦',icon:'warn-o'});
				}
			}
		}
	}
</script>

<style lang="less">
	.additional {
		.van-cell {
			padding: 0 15px;
			font-size: 12px;
		}

		.van-cell:not(:last-child)::after {
			border: 0;
		}

		.van-card__title {
			font-size: 14px;
		}

		.van-cell__title {
			flex: 10;
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
			overflow: hidden;
			height: 18px;

			span {
				font-size: 16px;
				margin-right: 5px;
			}

			.van-tag {
				font-size: 12px;
			}
		}

		.van-stepper {
			position: absolute;
			bottom: 5px;
			right: 5px;

			&__plus {
				width: 30px;
			}

			&__minus {
				width: 30px;
			}
		}

		.image_tag {
			position: absolute;
			bottom: 0;
			width: 90px;
			height: 20px;
			line-height: 20px;
			font-size: 10px;
			color: #fff;
			text-align: center;
			background-color: rgba(0, 0, 0, .7);
		}
	}

	.additional::after {
		border-color: #f7f7f7;

	}
</style>
