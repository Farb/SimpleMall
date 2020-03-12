<template>
	<div>
		<headerNav />
		<p class="title">绑定手机</p>
		<van-cell-group>
			<van-field v-if="isAdd" clearable v-model="phone" type="tel" label="手机号码" placeholder="请输入要绑定的手机号" required />
		
		</van-cell-group>
		<p style="font-size: medium;text-align: center;color: red;" v-if="bindedPhone.length">您当前已绑定手机：{{bindedPhone}}
		<a @click="showAdd" style="color: #0570DB;margin-left: 10px;">修改</a>
		</p>
		<div style="margin: 10px;margin-top: 10px;">
			<van-button v-if='isAdd' size="large" type="primary" :disabled="!isAdd" style="height: 45px;line-height:45px;" @click="bindUserPhone">确认绑定</van-button>
		</div>
	</div>

</template>

<script>
	import {GetUserBindedPhone,BindPhone} from '../../../api/user.js';
	
	export default {
		data() {
			return {
				phone: "",
				bindedPhone:'',
				updated: false,
				isAdd:true
			}
		},
		created(){
			this.getBindedPhone();
		},
		methods:{
			getBindedPhone(){
				GetUserBindedPhone().then(res=>{
					if(res.CodeMsg.Code==1){
						this.bindedPhone=res.Content;
						this.isAdd=!res.Content;
					}
				}).catch(err=>console.log(err));
			},
			showAdd(){
				this.isAdd=true;
			},
			bindUserPhone(){
				if(!this.phone.length){
					this.$toast.fail('手机号不能为空！');
					return;
				}
				if(this.phone.length!=11){
					this.$toast.fail('手机号格式不正确！');
					return;
				}
				BindPhone(this.phone).then(res=>{
					if(res.CodeMsg.Code==1){
						this.isAdd=false;
						this.updated=true;
						this.bindedPhone=this.phone;
						this.$toast.success('绑定成功！');
					}else{
						this.$toast.fail('绑定失败！');
					}
				}).catch(err=>console.log(err));
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
