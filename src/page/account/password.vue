<template>
	<div>
		<headerNav />
		<div :style="'background:url('+logo+') center 40px no-repeat;background-size:258px;'">
			<div style="padding-top: 130px;">
				<van-cell-group>
					<van-field :required="true" clearable v-model="loginData.username" placeholder="请输入用户名" />
					<van-field :required="true" clearable v-model="loginData.password" type="password" placeholder="请输入密码" />
				</van-cell-group>
				<div style="margin: 10px;margin-top: 40px;">
					<van-button size="large" type="primary" :loading="logging" loading-text="登录中..." @click="passwordLogin()" style="height: 45px;line-height:45px;">登录</van-button>
					<van-divider>
						<router-link style="color: #1989FA;" to="/user/register">没有账号？注册</router-link>
					</van-divider>

				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import logoPng from '@/assets/images/logo.png';
	import {
		login,
		GetUrlForCode
	} from "../../api/user.js";
	import myconstants from "../../config/constants.js";

	export default {
		data() {
			return {
				logo: logoPng,
				logging:false,
				loginData: {
					username: "",
					password: "",
				}
			}
		},
		methods: {
			passwordLogin() {
				if (!this.loginData.username || !this.loginData.password) {
					this.$dialog.alert({
						title: "登录提示",
						message: "用户名或者密码不能为空哦"
					});
					return;
				}
				if (this.loginData.password.length < 6) {
					this.$dialog.alert({
						title: "登录提示",
						message: "密码长度至少为6位数哦"
					});
					return;
				}
				this.logging=true;
				login(JSON.stringify(this.loginData)).then(response => {
					var code = response.CodeMsg.Code;
					if (code === "1") {
						this.$toast.success("登录成功");
						var now = new Date();
						var tokenData = {
							token: response.AccessToken.Token,
							realExpiresTime: now.setTime(now.getTime() + (response.AccessToken.ExpiresIn) * 1000)
						};
						this.$cookies.set(myconstants.token, tokenData, myconstants.tokenExpires);
						this.$cookies.set(myconstants.refreshtoken, response.RefreshToken, myconstants.refreshtokenExpires);
						this.$cookies.set(myconstants.refreshtokenExpireTime, new Date(now.getTime() + (myconstants.refreshtokenExpires) *
							1000).toUTCString(), myconstants.refreshtokenExpires);
						const redirect = this.$route.query.redirect;
						//get  wechat  openid 						
						if (process.env.NODE_ENV== 'production' ) {
							//获取回跳的redirect地址
							GetUrlForCode(redirect).then(res => {
								if (res.CodeMsg.Code == 1) {
									window.location.href = res.Content;
								} else {
									this.$toast.success('微信授权失败');
									console.log(res);
								}
							}).catch(e => console.log(e));
						} else {
							if (redirect) {
								//如果redirect存在说明当前用户是进入某页面后未登陆自动跳转到登陆页面来的，所以登陆完成后得再次回跳到该地址
								this.$router.push(redirect);
							} else {
								//否则跳转到默认的页面，首页或者其他页面
								this.$router.push({
									name: "userindex"
								});
							}
						}

					} else {
						this.$dialog.alert({
							title: response.CodeMsg.Title,
							message: response.CodeMsg.Description
						}).then(() => {
							// on close
						});
					}
					this.logging=false;
				}).catch(error => console.log(error.response));
			}
		}
	}
</script>

<style>

</style>
