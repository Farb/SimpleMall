<template>
	<div>
		<van-address-edit :area-list="areaList" :showDelete="showDelete" :is-saving="isSaving" show-set-default @save="onSave"
		 @delete="onDelete" :addressInfo="addressInfo" />
	</div>
</template>

<script>
	import areaList from '../../../data/area';
	import {
		GetUserAddress,
		SaveUserAddress,
		DeleteUserAddress
	} from "../../../api/user.js";

	import {
		AddressEdit
	} from 'vant';
	export default {
		components: {
			[AddressEdit.name]: AddressEdit,
		},
		data() {
			return {
				areaList,
				showDelete: false,
				addressInfo: {},
				isSaving: false
			}
		},

		methods: {
			onSave(data) {
				this.isSaving = true;
				SaveUserAddress(data).then(response => {
					if (response.CodeMsg.Code == 1) {
						this.$toast('保存成功');
						this.$router.go(-1);
					} else {
						this.$toast(response.Content);
					}
					this.isSaving = false;
				})
			},
			onDelete() {
					var addressId = this.$route.query.id;
					DeleteUserAddress(addressId).then(response => {
						if (response.CodeMsg.Code == 1) {
							this.$toast.success('删除成功');
						}
						this.$router.go(-1);
					});
			},
		},
		created: function() {
			var id = this.$route.query.id;
			if (id > 0) {
				this.showDelete = true;
				GetUserAddress(id).then(response => {
					if (response.CodeMsg.Code == 1) {
						this.addressInfo = response.Content;
					}
				})
			}
		}

	}
</script>

<style>
	.van-picker__toolbar {
		font-size: 16px;
	}
</style>
