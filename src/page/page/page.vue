<template>
	<div :style="'background-color:'+((page.BackgroundColor==undefined||page.BackgroundColor=='')?'#fff':page.BackgroundColor)">
		<div :style="'height:'+topheight+'px'"></div>
		<div>
			<my-loading v-if="!banners.type" text='加载中...'></my-loading>
			<!-- v-if的作用是防止出现在父组件没有数据时，子组件就开始渲染 -->
			<imageAd v-if="banners.type>=1" :data="banners"></imageAd>
			<div v-if="imageTexts.type>=1" :class='(imageTexts.type == "1" ? "cap-image-ad__image-nav" : "cap-image-ad__slide cap-image-ad__text-nav")' :style='"overflow-x:"+(imageTexts.showtype == "1" ? "hidden" : "scroll")+"; background-color:"+imageTexts.backgroundcolor'>
				<div v-if="imageTexts.type == '1'" v-for="(item,index)  in imageTexts.imagelist" :key="index" class="image-wrapper" :style="'width:'+ getImageTextsWidth+'%; margin-right: 0px;'">
					<a :href="item.link" @click='getProductsByCategoryId(item.categoryId)' class="cap-image-ad__link cap-image-ad__link--image-nav" :style="'color:'+imageTexts.color">
						<div class="cap-image-ad__image">
							<img v-lazy="item.src+'?w=320'" style="width: 100%; " />
						</div>
						<!-- <h3 v-if="item.title!=''" class="cap-image-ad__nav-title">{{item.title}}</h3> -->
					</a>
				</div>
			</div>
			
			<div v-if="products.type>=1">
				<ul class='cap-goods-list__container cap-goods-list__container--small cap-goods-list__container--simple'>
					<li v-if="products.list.length==0" style="width:100%;height:150px;border:0px;">
						<div style="width:100%;height:150px;"></div>
					</li>
					<van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="已经到底了" @load="onLoad" :offset="1">
					<li v-for="(item,index) in products.list" :key="index" class='cap-goods-list__wrapper'>
						<product :item='item'></product>
					</li>
					</van-list>

				</ul>
				<div style="clear:both;"></div>
			</div>
		</div>

	</div>
</template>
<script>
	import "../../assets/style/index.css";
	import whitespace from "../../components/page/whitespace.vue";
	import pageLine from "../../components/page/line.vue";
	import pageText from "../../components/page/text.vue";
	import notice from "../../components/page/notice.vue";
	import search from "../../components/page/search.vue";
	import pageTitle from "../../components/page/title.vue";
	import cube from "../../components/page/cube.vue";
	import imageAd from "../../components/page/imageAd.vue";
	import product from "../../components/page/product.vue";
	import {
		getProducts,
		getBanners,
		getImageTexts
	} from "../../api/page.js";

	export default {
		name: "page",
		components: {
			whitespace,
			pageLine,
			pageText,
			notice,
			search,
			pageTitle,
			cube,
			[imageAd.name]: imageAd,
			product
		},
		data: function() {
			return {
				topheight: 0,
				page: {},
				banners: {},
				imageTexts: {},
				products: {
					showType:'simple',
					type:2,
					list:[]
				},
				categoryId:0,
				loading: false,
				finished: false,
				pageIndex: 1, //请求第几页
				pageSize: 6, //每页请求的数量
				total: 0, //总共的数据条数
			}
		},
		created: function() {
			getBanners().then(res => {
				if (res.CodeMsg.Code == 1) {
					this.banners = res.Content;
				}
			});

			getImageTexts().then(res => {
				if (res.CodeMsg.Code == 1) {
					this.imageTexts = res.Content;
				}
			});
			getProducts({
					page: this.pageIndex,
					pageSize: this.pageSize
				}).then(res => {
				if (res.CodeMsg.Code == 1) {
					this.products.list = res.Content.productlist;
					this.total=res.Content.total;
				}
			});

		},
		computed:{
			getImageTextsWidth:function(){
				var width = 0;
				if (this.imageTexts.showtype == "1") {
					width = 100 / this.imageTexts.imagelist.length;
				} else {
					width = (100 * 0.95) / (this.imageTexts.shownumber - 1);
				}
				return width;
			}
		},
		methods: {
			initPaging(categoryId){
				this.pageIndex=1;
				this.finished=false;
				this.total=0;
				this.categoryId=categoryId;
				this.products.list=[];
			},
			getData() {
				let params = {
					page: this.pageIndex,
					pageSize: this.pageSize,
					categoryId: this.categoryId
				};
			
				getProducts(params).then(res => {
					if (res.CodeMsg.Code == 1) {
			
						if (res.Content == null || res.Content.length === 0) {
							// 加载结束
							this.finished = true;
							return;
						}
						let newRows = res.Content.productlist;
						this.loading = false;
						this.total = res.Content.total;
			
						if (newRows.length === 0) {
							// 加载结束
							this.finished = true;
							return;
						}
			
						// 将新数据与老数据进行合并
						this.products.list = this.products.list.concat(newRows);
			
						//如果列表数据条数>=总条数，不再触发滚动加载
						if (this.products.list.length >= this.total) {
							this.finished = true;
						}
					} else {
						this.$toast.fail(res.CodeMsg.Title + ":" + res.CodeMsg.Description);
					}
				}).catch(e => console.log(e));
			},
			onLoad() {
				this.pageIndex++;
				this.getData();
			},
			getProductsByCategoryId(categoryId){
				this.initPaging(categoryId);
				this.loading=true;
				this.getData();
			},
			settopheight: function(value) {
				this.topheight = value;
			}
		}
	}
</script>
