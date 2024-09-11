<template>
  <view>
    <view class="weui-cells weui-cells_after-title mt">
      <view class="weui-cell weui-cell_input">
        <view class="weui-cell__hd">
          <view class="weui-label">与本人的关系：</view>
        </view>
        <picker @change="relateChange" :value="form.type" :range="relateArray">
          <view class="weui-cell_select">
            <view class="weui-cell__bd">
              <view class="weui-input weui-select_in-select-after">{{ relateArray[form.type] }}</view>
            </view>
          </view>
        </picker>
      </view>

      <view class="weui-cell weui-cell_input">
        <view class="weui-cell__hd">
          <view class="weui-label">姓名：</view>
        </view>
        <view class="weui-cell__bd">
          <input class="weui-input" placeholder="请输入患者姓名" v-model="form.name" @blur="checkInput('name', 'string', '姓名')" />
        </view>
      </view>

      <view class="weui-cell weui-cell_input">
        <view class="weui-cell__hd">
          <view class="weui-label">证件类型：</view>
        </view>
        <view class="weui-cell__bd">
          <text class="weui-input forbiddenInput">身份证</text>
        </view>
      </view>

      <view class="weui-cell weui-cell_input">
        <view class="weui-cell__hd">
          <view class="weui-label">证件号码：</view>
        </view>
        <view class="weui-cell__bd">
          <text class="weui-input forbiddenInput">{{ form.identify | getIdentityNum }}</text>
        </view>
      </view>

      <view class="weui-cell weui-cell_input">
        <view class="weui-cell__hd">
          <view class="weui-label">性别：</view>
        </view>
        <view class="weui-cell__bd">
          <view class="radios-button-outbox weui-input">
            <view class="radios-button-inbox" @click="form.gender = 1">
              <image class="icon" :src="form.gender === 1 ? activeRadioIcon : inactiveRadioIcon"></image>
              <text class="text">男</text>
            </view>
            <view class="radios-button-inbox" @click="form.gender = 2">
              <image class="icon" :src="form.gender === 2 ? activeRadioIcon : inactiveRadioIcon"></image>
              <text class="text">女</text>
            </view>
          </view>
        </view>
      </view>

      <view class="weui-cell weui-cell_input">
        <view class="weui-cell__hd">
          <view class="weui-label">出生日期：</view>
        </view>
        <view class="weui-cell__bd">
          <text class="weui-input forbiddenInput">{{ form.birthDate | getDate }}</text>
        </view>
      </view>

      <view class="weui-cell weui-cell_input">
        <view class="weui-cell__hd">
          <view class="weui-label">+86</view>
        </view>
        <view class="weui-cell__bd">
          <input class="weui-input" placeholder="请输入患者手机号码" v-model="form.phone" @blur="checkInput('phone', 'phone', '电话号码')" />
        </view>
      </view>

      <view class="weui-cell weui-cell_input">
        <view class="weui-cell__hd">
          <view class="weui-label">预约卡号：</view>
        </view>
        <view class="weui-cell__bd">
          <text class="weui-input forbiddenInput">{{ form.id }}</text>
        </view>
      </view>
    </view>

    <button class="button" @click="validateForm">确定</button>
  </view>
</template>

<script>
import { inputCheck } from '@/common/js/inputCheck.js';
import { updateCardInfo } from '@/common/api/userInfo.js';
import { error } from '@/common/js/errorTips.js';

export default {
  data() {
    return {
      relateArray: ['兄弟/姐妹', '表兄弟或其他'],
      form: {
        type: 0, // 初始化与本人关系类型
        name: '', // 姓名
        identify: '', // 证件号码
        gender: 1, // 默认性别为男
        birthDate: '', // 出生日期
        phone: '', // 手机号码
        id: '', // 预约卡号
        relationId: '', // 关系ID
      },
      iconURL: '/static/center/card/',
      activeRadioIcon: '/static/center/card/radio-actived.png',
      inactiveRadioIcon: '/static/center/card/radio-inactived.png',
    };
  },
  methods: {
    checkInput(value, rule, name) {
      const validationError = inputCheck(name, rule, this.form[value]);
      if (validationError !== 'ok') {
        uni.showToast({
          title: validationError,
          icon: 'none',
        });
        this.form[value] = '';
      }
    },
    validateForm() {
      if (this.form.name && this.form.phone) {
        this.updateCardInfo();
      } else {
        error('请将信息填写完整');
      }
    },
    relateChange(e) {
      this.form.type = e.detail.value;
    },
    updateCardInfo() {
      uni.showLoading({
        title: '加载中',
      });
      updateCardInfo(this.form.relationId, {
        gender: this.form.gender,
        name: this.form.name,
        phone: this.form.phone,
        type: parseInt(this.form.type) + 1,
      })
        .then((res) => {
          if (res.data.code === 200) {
            uni.showToast({
              title: '更新成功',
              icon: 'success',
            });
          }
        })
        .catch(() => {
          error('更新失败，请检查网络');
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
  },
  onLoad(e) {
    this.form = { ...JSON.parse(e.cardInfo), type: JSON.parse(e.cardInfo).type - 1 };
    uni.hideLoading();
  },
};
</script>

<style lang="scss">
@import '@/common/scss/common.scss';
@import '@/common/scss/form.scss';

.mt {
  margin-top: 50rpx;
}

.radios-button-outbox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  .radios-button-inbox {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;

    .icon {
      width: 50rpx;
      height: 50rpx;
      margin-right: 20rpx;
    }

    .text {
      font-size: 16px;
      font-weight: 400;
      color: #000;
    }
  }
}

.button {
  margin-top: 50rpx;
}
</style>
