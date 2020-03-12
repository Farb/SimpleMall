<template>
	<div id="app">
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive" />
		</keep-alive>
		<!--不需要缓存组件-->
		<router-view v-if="!$route.meta.keepAlive"></router-view>
	</div>
</template>

<script>
	import './assets/style/common.css';

	export default {
		name: 'app'
	}
</script>
