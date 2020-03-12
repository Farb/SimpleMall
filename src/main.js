import Vue from 'vue';
import {
	router
} from './config/router';
import VueCookies from 'vue-cookies'
import jwt from 'jsonwebtoken';
import './config/rem';
import App from './App.vue';
import { Lazyload } from 'vant';
import components from './config/components.js';

Vue.use(VueCookies);
Vue.use(jwt);
Vue.use(components);
Vue.use(Lazyload);

new Vue({
	router,
	el: '#app',
	render: h => h(App),
});

Vue.prototype.bus = new Vue({});
