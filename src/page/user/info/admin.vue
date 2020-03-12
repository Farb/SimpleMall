<template>
	<div>
		<van-button @click='doClearCache()' type="primary">清除api缓存</van-button>
	</div>
</template>

<script>
	import {ClearCache} from "../../../api/user.js";
	export default{
		methods:{
			doClearCache(){
				ClearCache().then(res=>{
					this.$toast.success('缓存清理成功！');
				});
			}
		}
	}
</script>

<style>
</style>
