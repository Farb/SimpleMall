<template>
	<div>
		<my-loading text='登录中...'></my-loading>
	</div>
</template>

<script>
	import {
		GetQueryString
	} from '../../lib/helper.js';
	import {
		BaseCallback
	} from '../../api/user.js';
	export default {
		data() {
			return {
				code: '',
				state: '',
				userReturnUrl: ''
			}
		},
		created() {
			this.setCode();
			if (this.code && this.state) {
				if (this.userReturnUrl) {
					this.$router.push(this.userReturnUrl);
				} else {
					this.$router.push({
						name: 'userindex'
					});
				}
				this.getOpenId();
			} else {
				this.$toast.fail('微信授权失败');
			}
		},
		methods: {
			setCode() {
				const code = GetQueryString('code'); // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
				const state = GetQueryString('state');
				const userReturnUrl = GetQueryString('userReturnUrl');
				this.code = code;
				this.state = state;
				this.userReturnUrl = userReturnUrl;
			},
			getOpenId() { // 通过code获取 openId等用户信息，/api/user/wechat/login 为后台接口
				var data = {
					code: this.code,
					state: this.state,
				};

				BaseCallback(data)
					.then(res => {}).catch(e => console.log(e));
			}
		},
		beforeRouteEnter(to, from, next) {
			if (from.name) {
				next({
					name: 'userindex'
				});
			}
			next();
		}
	}
</script>

<style>
</style>
