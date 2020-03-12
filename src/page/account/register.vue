<template>
	<div>
		<headerNav />
		<div style="background:url(http://huayunpp.oss-cn-shenzhen.aliyuncs.com/logos/lRmAMV.png) center 18px no-repeat;background-size:161px;">
			<div style="padding-top: 70px;">
				<van-cell-group>
					<van-field required clearable v-model='registerData.userName' placeholder="请输入用户名" />
					<van-field required clearable v-model='registerData.password' type="password" placeholder="请输入密码" />
					<van-field required clearable v-model='registerData.repassword' type="password" placeholder="请再次输入密码" />
					<van-field required clearable v-model='registerData.registerCode' placeholder="请输入注册码" />
				</van-cell-group>
				<div style="margin: 10px;">
					<van-button @click="toRegister" size="large" type="primary" style="height: 45px;line-height:45px;">注册</van-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {Register} from '../../api/user.js';
	import myconstants from "../../config/constants.js";
	
	export default {
		name: 'register',
		data() {
			return {
				registerData: {
					userName: '',
					password: '',
					repassword: '',
					registerCode: ''
				}
			};
		},
		methods: {
			toRegister() {
				if (this.registerData.userName.length <= 1) {
					this.$toast.fail('用户名长度不能小于2');
					return;
				}
				if (this.registerData.password.length < 6) {
					this.$toast.fail('密码长度不能小于6');
					return;
				}
				if (this.registerData.password != this.registerData.repassword) {
					this.$toast.fail('两次输入的密码不一致');
					return;
				}
				if (this.registerData.registerCode.length < 8) {
					this.$toast.fail('邀请码长度不能小于8');
					return;
				}
				
				Register(this.registerData).then(res=>{
					if(res.CodeMsg.Code==1){
						var now=new Date();
						var tokenData={token:res.AccessToken.Token,
							realExpiresTime:now.setTime(now.getTime()+(res.AccessToken.ExpiresIn-30)*1000)};//实际客户端token有效时间少30秒
						this.$cookies.set(myconstants.token,tokenData , myconstants.tokenExpires); 
						this.$cookies.set(myconstants.refreshtoken, res.RefreshToken, myconstants.refreshtokenExpires); 
						this.$toast.success('注册成功，正跳转向首页...');
						this.$router.replace({name:'home'});
					}else{
						this.$toast.fail(res.CodeMsg.Title+':'+res.CodeMsg.Description);
					}
				}).catch(e=>console.log(e));
			}
		},
	}
</script>

<style>

</style>
