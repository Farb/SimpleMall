<template>
	<van-loading style="left:50%;top: 50%;position: fixed;margin-left: -30px;margin-top: -30px;"  type="spinner" color="#1989fa" vertical>{{text}}</van-loading>
</template>

<script>
	export default{
		name:'my-loading',
		props:{
			text:String
		}
	}
</script>

<style>
</style>
