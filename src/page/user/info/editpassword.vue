<template>
	<div>
		<headerNav />
		<p class="title">修改密码</p>
		<van-cell-group>
			<van-field clearable v-model="oldPassword" type="password" label="旧密码" placeholder="请输入旧密码" required />
			<van-field clearable v-model="newPassword" type="password" label="新密码" placeholder="请输入新密码" required />
			<van-field clearable v-model="confirmNewPassword" type="password" label="确认新密码" placeholder="请重新输入新密码" required />
		</van-cell-group>
		<div style="margin: 10px;margin-top: 10px;">
			<van-button size="large" type="primary" :disabled="updated" style="height: 45px;line-height:45px;" @click="updateNewPassword">{{!updated?'确认修改':'密码修改成功'}}</van-button>
		</div>
	</div>
</template>

<script>
	import {
		ModifyPassword
	} from '../../../api/user.js';
	export default {
		data() {
			return {
				oldPassword: "",
				newPassword: "",
				confirmNewPassword: "",
				updated: false
			}
		},
		methods: {
			updateNewPassword() {
				if (!this.oldPassword || !this.newPassword || !this.confirmNewPassword) {
					this.$toast.fail("密码不能为空！");
					return;
				}
				if (this.newPassword != this.confirmNewPassword) {
					this.$toast.fail("两次输入的新密码不一样");
					return;
				}
				if (this.oldPassword == this.confirmNewPassword) {
					this.$toast.fail("新密码不能和旧密码一样");
					return;
				}
				if (this.newPassword.length < 6) {
					this.$toast.fail("新密码长度至少要6位数");
					return;
				}

				var data = {
					oldPassword: this.oldPassword,
					newPassword: this.newPassword,
					confirmNewPassword: this.confirmNewPassword,
				};
				ModifyPassword(data).then(res => {
					if (res.CodeMsg.Code == 1) {
						this.updated = true;
						this.$toast.success('密码已修改成功');
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
