<template>
	<div>
		<div class="user-profile">
			<div class="user-profile-avatar">
				<img src="https://s2.ax1x.com/2020/01/04/l0bih4.th.png" alt="">
			</div>
			<div class="user-profile-username">
				<span class="m-nick">{{data.UserName}}</span>
			</div>
		</div>

		<van-cell-group class="user-group">
			<van-cell icon="description" title="我的订单" value="查看全部订单" is-link to="/user/order" />
			<van-row class="user-links">
				<router-link to="/user/order/1">
					<van-col span="6">
						<van-icon name="pending-payment">
							<van-info v-if="data.UnPayCount>0" :info="data.UnPayCount" />
						</van-icon>
						<div>待付款</div>
					</van-col>
				</router-link>
				<router-link to="/user/order/2">
					<van-col span="6">
						<van-icon name="logistics">
							<van-info v-if='data.UnReceiveCount>0' :info="data.UnReceiveCount" />
						</van-icon>
						<div>待发货</div>
					</van-col>
				</router-link>
				<router-link to="/user/order/3">
					<van-col span="6">
						<van-icon name="point-gift">
						</van-icon>
						<div>已完成</div>
					</van-col>
				</router-link>
				<!--        <router-link  to="/user/aftersale">
          <van-col span="6">
            <van-icon name="after-sale" >
              <van-info :info="data.AfterSaleTotal"   />
            </van-icon>
            <div>售后</div>
          </van-col>
        </router-link> -->
			</van-row>
		</van-cell-group>

		<van-cell-group class="user-group">
			<van-cell title="我的服务" icon="setting-o" />
			<van-row class="user-links">

				<!--  <router-link  to="/user/favorite">
          <van-col span="6">
            <van-icon name="like-o" />
            <div>我的收藏</div>
          </van-col>
        </router-link> -->
				<router-link to="/user/info">
					<van-col span="6">
						<van-icon name="user-circle-o" />
						<div>账号管理</div>
					</van-col>
				</router-link>
				<router-link to="/user/address">
					<van-col span="6">
						<van-icon name="location" />
						<div>收货地址</div>
					</van-col>
				</router-link>
				<router-link to="/user/rule">
					<van-col span="6">
						<van-icon name="comment-o" />
						<div>会员规则</div>
					</van-col>
				</router-link>
			</van-row>
		</van-cell-group>

		<van-cell-group>
			<van-cell icon="exchange" title="切换账号" is-link to="/login/password" />
			<van-row class="user-links">
				<router-link to="/user/generatecode" v-if="data.UserName=='admin@qq.com'||data.UserName=='admin'">
					<van-col span="6">
						<van-icon name="user-circle-o" />
						<div>生成注册码</div>
					</van-col>
				</router-link>
				<router-link to="/user/admin" v-if="data.UserName=='admin'">
					<van-col span="6" >
						<van-icon name="user-circle-o" />
						<div>超级管理员功能</div>
					</van-col>
				</router-link>
			</van-row>
		</van-cell-group>
		<navigate />
	</div>
</template>

<script>
	import {
		GetUserIndex,ClearCache
	} from "../../api/user.js";

	export default {
		data() {
			return {
				data: {}
			}
		},
		components: {},
		created: function() {

		},
		activated() {
			GetUserIndex().then(res => {
				if (res.CodeMsg.Code == 1) {
					this.data = res.Content;
				}
			});
		}
	};
</script>

<style lang="less">
	.user {
		&-profile {
			text-align: center;
			display: block;
			width: 100%;
			height: 141px;
			background-color: #f1f5fa;
			background-repeat: no-repeat;
			background-size: 100% 100%;

			img {
				width: 100%;
			}

			&-avatar {
				padding-top: 23px;
				padding-bottom: 5px;

				img {

					width: 65px;
					height: 65px;
					border-radius: 50%;
					overflow: hidden;
				}
			}

			&-username {
				font-size: 20px;
			}
		}

		&-group {
			margin-bottom: .3rem;

			.van-cell__value {
				color: #999;
				font-size: 12px;
			}
		}

		&-links {
			padding: 15px 0;
			font-size: 12px;
			text-align: center;
			background-color: #fff;

			.van-icon {
				position: relative;
				width: 24px;
				font-size: 24px;
			}
		}
	}
</style>
