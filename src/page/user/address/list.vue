<template>
	<div>
		<van-address-list v-model="chosenAddressId" default-tag-text="默认"  :list="list" @add="onAdd"
			@edit="onEdit" @select="onSelect"/>
	</div>
</template>

<script>
	import {
		GetAddressList
	} from "../../../api/user.js";
	import {
		AddressList
	} from 'vant';

	export default {
		components: {
			[AddressList.name]: AddressList,
		},
		data() {
			return {
				chosenAddressId: 0,
				selectAddress:{},
				list: [],
			}
		},
		methods: {
			onAdd() {
				this.$router.push({name:'useraddressedit'});
			},
			onEdit(item, index) {
				this.$router.push({name:'useraddressedit',query:{'id':item.id}});
			},
			onSelect(item, index) {
					this.selectAddress=item;
					this.chosenAddressId=item.id;
					var queryString=this.$route.query.from;
					if(queryString&&queryString=='submitorder'){
						this.bus.$emit('selectAddress', this.selectAddress);
						this.$router.go(-1);
					}
			},
		},
		created: function() {
			GetAddressList().then(response => {
				if (response.CodeMsg.Code == 1) {
					if(response.Content.length>0){
						this.list = response.Content;
						this.chosenAddressId=this.list[0].id;
					}
				}
			}).catch(err => console.log(err));
		},
	}
</script>

<style lang="less">
	.hideselect {
		.van-radio__input {
			display: none;
		}
	}
</style>
