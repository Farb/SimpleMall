<template>
    <van-nav-bar
    :title="title"
    left-text="返回"
    left-arrow
    @click-left="onBack"
    />
</template>

<script>
import { NavBar  } from 'vant';
export default {
    name:'headerNav',
    components:{
         [NavBar.name]: NavBar,
    },
    props:{
        title:String,
    },
    methods: {
        onBack() {
        history.back();
        },
		onClickRight(){
			this.$router.push({name:'home'});
		}
    }
}
</script>

<style>

</style>
