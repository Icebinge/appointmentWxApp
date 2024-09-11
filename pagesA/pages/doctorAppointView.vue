<template>
  <view class="page-background">
    <!-- 今天之前的预约记录，默认折叠 -->
    <view class="past-appointments">
      <view class="top-title" @click="togglePastRecords">
        <text class="left">之前的预约记录</text>
        <text class="right toggle-text">{{ showPastRecords ? '折叠' : '展开' }}</text>
      </view>
      
      <view v-if="showPastRecords">
        <view 
          class="appoint-record-box past-record-box" 
          v-for="(item, index) in pastRecords" 
          :key="item.appointmentId"
        >
          <view class="appoint-info">
            <text class="left black-text">日期：</text>
            <text class="right">{{ item.day | getDate }}</text>
          </view>
          <view class="appoint-info">
            <text class="left black-text">时间：</text>
            <text class="right">{{ item.queueNum | getTimePeriod }}</text>
          </view>
          <view class="appoint-info">
            <text class="left black-text">患者：</text>
            <text class="right">{{ item.name }} (排队号：<text style="color: #7EC0EE;">{{ item.queueNum }}</text>)</text>
          </view>
          <view class="appoint-info">
            <text class="left black-text">费用：</text>
            <text class="right">10元</text>
          </view>
          <view class="appoint-info">
            <text class="left black-text">状态：</text>
            <view class="right">
              <text @click="openStatusModal(item)" class="status-text">{{ getStatusText(item.status) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 今天的预约记录，按排队号递增排序 -->
    <view v-if="todayRecords.length > 0" class="today-appointments">
      <view class="top-title">
        <text class="left">今天的预约记录</text>
      </view>
      <view 
        class="appoint-record-box" 
        v-for="(item, index) in sortedTodayRecords" 
        :key="item.appointmentId"
      >
        <view class="appoint-info">
          <text class="left black-text">时间：</text>
          <text class="right">{{ item.queueNum | getTimePeriod }}</text>
        </view>
        <view class="appoint-info">
          <text class="left black-text">患者：</text>
          <text class="right">{{ item.name }} (排队号：<text style="color: #7EC0EE;">{{ item.queueNum }}</text>)</text>
        </view>
        <view class="appoint-info">
          <text class="left black-text">费用：</text>
          <text class="right">10元</text>
        </view>
        <view class="appoint-info">
          <text class="left black-text">状态：</text>
          <view class="right">
            <text @click="openStatusModal(item)" class="status-text">{{ getStatusText(item.status) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 今天之后的预约记录，默认折叠 -->
    <view class="future-appointments">
      <view class="top-title" @click="toggleFutureRecords">
        <text class="left">之后的预约记录</text>
        <text class="right toggle-text">{{ showFutureRecords ? '折叠' : '展开' }}</text>
      </view>
      
      <view v-if="showFutureRecords">
        <view 
          class="appoint-record-box future-record-box" 
          v-for="(item, index) in futureRecords" 
          :key="item.appointmentId"
        >
          <view class="appoint-info">
            <text class="left black-text">日期：</text>
            <text class="right">{{ item.day | getDate }}</text>
          </view>
          <view class="appoint-info">
            <text class="left black-text">时间：</text>
            <text class="right">{{ item.queueNum | getTimePeriod }}</text>
          </view>
          <view class="appoint-info">
            <text class="left black-text">患者：</text>
            <text class="right">{{ item.name }} (排队号：<text style="color: #7EC0EE;">{{ item.queueNum }}</text>)</text>
          </view>
          <view class="appoint-info">
            <text class="left black-text">费用：</text>
            <text class="right">10元</text>
          </view>
          <view class="appoint-info">
            <text class="left black-text">状态：</text>
            <view class="right">
              <text @click="openStatusModal(item)" class="status-text">{{ getStatusText(item.status) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="loading">{{ loadingText }}</view>
  </view>
</template>

<script>
import { getTreatRecord, updateAppointmentStatus } from '@/common/api/appointment.js';
import { error } from '@/common/js/errorTips.js';

export default {
  data() {
    return {
      appointRecordList: [],
      loadingText: '加载中...',
      page: 1,
      total: 15,
      currentAppointment: null,  // 当前正在操作的预约
      showPastRecords: false,  // 是否显示之前的记录
      showFutureRecords: false,  // 是否显示之后的记录
    };
  },
  computed: {
    // 今天的记录
    todayRecords() {
      return this.appointRecordList.filter(item => this.isToday(item.day));
    },
    // 今天及未来的记录
    sortedTodayRecords() {
      return this.todayRecords.sort((a, b) => a.queueNum - b.queueNum);
    },
    // 今天之前的记录
    pastRecords() {
      return this.appointRecordList.filter(item => this.isBeforeToday(item.day));
    },
    // 今天之后的记录
    futureRecords() {
      return this.appointRecordList.filter(item => this.isAfterToday(item.day));
    }
  },
  methods: {
    // 获取预约记录
    getAllAppointRecord() {
      getTreatRecord('10009', this.page, 3)
        .then(res => {
          if (res.data.code === 200) {
            this.appointRecordList = res.data.data.list;
            this.loadingText = this.total > this.appointRecordList.length ? '加载更多' : '已加载全部';
          }
        })
        .catch(() => {
          error('获取预约记录失败');
        });
    },
    // 打开状态选择弹窗
    openStatusModal(item) {
      this.currentAppointment = item;
      uni.showActionSheet({
        itemList: ['超时违约', '已赴约'],
        success: (res) => {
          let selectedStatus;
          switch (res.tapIndex) {
            case 0:
              selectedStatus = 1;
              break;
            case 1:
              selectedStatus = 3;
              break;
            default:
              return;
          }
          this.updateAppointStatus(selectedStatus);
        },
        fail: (err) => {
          console.log('ActionSheet failed', err);
        }
      });
    },
    // 更新预约状态
    updateAppointStatus(status) {
      if (this.currentAppointment) {
        const item = this.currentAppointment;
        
        updateAppointmentStatus(item.appointmentId, status)
          .then(res => {
            if (res.data.code === 200) {
              uni.showToast({
                title: '状态更新成功',
              });
              item.status = status;
            } else {
              uni.showToast({
                title: '状态更新失败',
                icon: 'none',
              });
            }
          })
          .catch(() => {
            error('更新预约状态失败');
          });
      }
    },
    // 获取状态文本
    getStatusText(status) {
      switch (status) {
        case 0:
          return '等待赴约';
        case 1:
          return '超时违约';
        case 2:
          return '已取消';
        case 3:
          return '已赴约';
        default:
          return '未知状态';
      }
    },
    // 切换之前的预约记录折叠状态
    togglePastRecords() {
      this.showPastRecords = !this.showPastRecords;
    },
    // 切换之后的预约记录折叠状态
    toggleFutureRecords() {
      this.showFutureRecords = !this.showFutureRecords;
    },
    // 判断是否是今天
    isToday(day) {
      const today = new Date().setHours(0, 0, 0, 0);
      const recordDate = new Date(day).setHours(0, 0, 0, 0);
      return recordDate === today;
    },
    // 判断日期是否在今天之前
    isBeforeToday(day) {
      const today = new Date().setHours(0, 0, 0, 0);
      const recordDate = new Date(day).setHours(0, 0, 0, 0);
      return recordDate < today;
    },
    // 判断日期是否在今天之后
    isAfterToday(day) {
      const today = new Date().setHours(0, 0, 0, 0);
      const recordDate = new Date(day).setHours(0, 0, 0, 0);
      return recordDate > today;
    }
  },
  onLoad() {
    this.getAllAppointRecord();
  },
};
</script>

<style lang="scss">
@import '@/common/scss/common.scss';

.page-background {
  padding: 20rpx;
}

.appoint-record-box {
  background-color: #ffffff;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  padding: 20rpx;
}

.past-record-box {
  background-color: #f0f0f0;  // 设置之前记录的背景为灰色
}

.future-record-box {
  background-color: #f0f0f0;  // 设置之后记录的背景为灰色
}

.top-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
  font-weight: bold;
  cursor: pointer;
}

.toggle-text {
  color: #7EC0EE;
  margin-left: 10rpx;
}

.appoint-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.status-text {
  color: #7EC0EE;
  cursor: pointer;
}

.loading {
  text-align: center;
  margin-top: 20rpx;
}
</style>
