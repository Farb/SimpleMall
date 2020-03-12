<template>
	<div>
		<van-cell-group>
			<van-field v-model="generateNumber" type="digit" required clearable label="生成数量" placeholder="请输入生成数量" />
			<van-field v-model="password" clearable type="password" label="密码" placeholder="请输入密码" required />
		</van-cell-group>
		<van-button type="info" @click='viewCode' block>查看注册码</van-button>
		<van-divider></van-divider>
		<van-button type="primary" @click='makeCode' block>确认生成</van-button>
		<div v-if="this.list.length">
			<van-row class="code-title" type='flex' justify="space-around">
				<van-col span="3">序号</van-col>
				<van-col span="10">注册码</van-col>
				<van-col span="6">是否已分发</van-col>
			</van-row>
			<van-row class="code-row" v-for="(item,index) in list" :key="item.Id" type='flex' justify="space-around">
				<van-col span="3">{{index+1}}</van-col>
				<van-col span="10">{{item.RegisterCode}}</van-col>
				<van-col span="6">未分发</van-col>
			</van-row>
		</div>

		<van-pagination v-if="this.list.length" v-model="currentPage" :total-items="pageCount" :items-per-page="pageSize"
		 @change='pageChange' />
		<van-divider></van-divider>
		<van-button type="danger" @click='dispatchCode' block>确认分发</van-button>
	</div>
</template>

<script>
	import {
		GenerateCode,
		GetGenerateCodeList,
		DispatchCode
	} from '../../../api/user.js';
	export default {
		data() {
			return {
				generateNumber: '',
				password: '',
				list: [],
				error: false,
				loading: false,
				finished: false,
				currentPage: 1,
				pageCount: 0,
				pageSize: 20,
				showList: false
			};
		},

		methods: {
			viewCode() {
				if(!this.checkPassword()){
					return;
				}
				this.getData(1);
			},
			dispatchCode() {
				if(!this.checkPassword()){
					return;
				}
				this.$dialog.confirm({
					title: '温馨提示',
					message: '你确定要分发' + this.list.length + '个注册码吗？'
				}).then(() => {
					var page = {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
						password: this.password,
					};
					DispatchCode(page).then(res => {
						if (res.CodeMsg.Code == 1) {
							this.$toast.success('共分发了' + res.Content + '个注册码');
							this.getData(1);
						}
					}).catch();
				}).catch();

			},
			makeCode() {
				if(!this.generateNumber||(this.generateNumber&&this.generateNumber<=0)){
					this.$toast.fail('生成数量不能为空');
					return;
				}
				if(!this.checkPassword()){
					return;
				}
				var data = {
					password: this.password,
					generateNumber: this.generateNumber
				};
				GenerateCode(data).then(res => {
					if (res.CodeMsg.Code == 1) {
						this.list = res.Content;
					}else{
						this.$toast.fail(res.CodeMsg.Description);
					}
				}).catch(e => console.log(e));
			},
			pageChange() {
				this.getData(this.currentPage);
			},
			getData(pageIndex) {
				var page = {
					currentPage: pageIndex,
					pageSize: this.pageSize,
					password: this.password,
				};
				GetGenerateCodeList(page).then(res => {
					this.list = res.Content.List;
					this.pageCount = res.Content.TotalCount;
					if(this.pageCount<=0){
						this.$toast.fail('当前还没有未使用的注册码');
					}
				}).catch(() => {
					this.error = true;
				})
			},
			checkPassword(){
				if(!this.password){
					this.$toast.fail('密码不能为空');
					return false;
				}
				return true;
			}
		}
	}
</script>

<style language="less">
	.code-title {
		font-size: 16px;
		font-weight: bolder;
		text-align: center;
	}

	.code-row {
		font-size: 14px;
		text-align: center;
	}
</style>
