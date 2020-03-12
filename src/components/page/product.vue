<template>
	<router-link class="cap-goods-list__item cap-goods-list__item--small simple  cap-goods-list__item--btn1 cap-goods-list__item--padding"
	 :to="'/product/'+item.id">
		<div class="cap-goods-list__photo">
			<img class="cap-goods-list__img lazy lazyload" v-lazy="item.imageURL+'?w=375'"/>
		</div>
		<div class="cap-goods-list__info has-title has-price">
			<h3 class="title">{{item.title}}</h3>
			<van-row class="sale-count-info">
				<van-col span="12"><span class="sale-info"> ¥ {{item.price}}</span></van-col>
				<van-col span="12"><span class="goods-market-price"> ¥ {{item.originPrice}}</span></van-col>
			</van-row>
			<van-row class="sale-count-info">
				<van-col span="14"><span class="">{{item.salesVolume}}人付款</span></van-col>
				<van-col span="6"><span class="">
						<van-icon name="shopping-cart-o" color="#da0000" /></span></van-col>
			</van-row>
		</div>
	</router-link>
</template>

<script>
	export default {
		name: 'product',
		props: {
			item: Object
		},
		methods: {
			setStyle(data) {
				var classname = "big";
				var aclass = "";
				switch (data.type) {
					case 1:
						aclass = "cap-goods-list__item--btn1 cap-goods-list__item--ratio-3-2 cap-goods-list__item--whitespace";
						break;
					case 2:
						classname = "small";
						aclass = "cap-goods-list__item--btn1 cap-goods-list__item--padding";
						break;
					case 3:
						classname = "hybrid";
						aclass =
							"cap-goods-list__item--big cap-goods-list__item--hybrid-big cap-goods-list__item--btn1 cap-goods-list__item--padding";
						break;
					case 4:
						classname = "list";
						aclass = "cap-goods-list__item--btn4 cap-goods-list__item--padding";
						break;
					case 5:
						classname = "three";
						aclass = "cap-goods-list__item--btn4 cap-goods-list__item--padding";
						break;
					case 6:
						classname = "three";
						break;
				}
				data.classname = classname;
				data.aclass = aclass;
			}
		}
	}
</script>

<style>

</style>
