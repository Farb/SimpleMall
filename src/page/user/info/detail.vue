<template>
<div>
	<headerNav />
	<div style="height: 20px;"></div>
	<div>
	    <van-cell-group>
	        <van-cell title="修改登录密码"  is-link to="/user/editpassword"/>
			<van-cell title="绑定手机号码"  is-link to="/user/bindtelphone"/>
			<van-cell title="重置登录密码"  is-link to="/user/resetpassword"/>
	    </van-cell-group>
	</div>
</div>
</template>

<script>
export default {

}
</script>

<style>

</style>
