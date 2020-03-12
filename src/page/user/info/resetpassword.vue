<template>
	<div>
		<headerNav />
		<p class="title">重置密码</p>
		<p style="font-size: small;color: red;text-align: center;">重置之后，默认密码为123456</p>
		<van-cell-group>
			<van-field clearable v-model="userName"  label="用户名" placeholder="请输入用户登录名" required />
			<van-field clearable v-model="bindedPhone" type="tel" label="已绑定手机号" placeholder="请输入绑定的手机号" required />
		</van-cell-group>
		<div style="margin: 10px;margin-top: 10px;">
			<van-button size="large" type="primary" :disabled="updated" style="height: 45px;line-height:45px;" @click="resetUserPassword">{{!updated?'确认重置':'密码重置成功'}}</van-button>
		</div>
	</div>
</template>

<script>
	import {
		ResetPassword
	} from '../../../api/user.js';
	export default {
		data() {
			return {
				userName:'',
				bindedPhone: "",
				updated: false
			}
		},
		methods: {
			resetUserPassword() {
				if(!this.userName){
					this.$toast.fail("用户名不能为空！");
					return;
				}
				if(!this.bindedPhone||(this.bindedPhone&&this.bindedPhone.length!=11)){
					this.$toast.fail("手机号格式不正确！");
					return;
				}

				var data = {
					userName:this.userName,
					bindedPhone: this.bindedPhone,
				};
				ResetPassword(data).then(res => {
					if (res.CodeMsg.Code == 1) {
						this.updated = true;
						this.$toast.success('密码已重置成功');
					} else {
						this.$toast.fail(res.CodeMsg.Description);
					}
				}).catch(e => console.log(e));
			}
		}
	}
</script>

<style>
	.title {
		text-align: center;
		font-size: x-large;
		margin: 50px;
	}
</style>
