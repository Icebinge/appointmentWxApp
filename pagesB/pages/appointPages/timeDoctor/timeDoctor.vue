<template>
  <view>
    <view class="top-select-date">
      <view 
        class="box" 
        v-for="(item, index) in dateList" 
        :key="index" 
        v-if="index < 3" 
        @click="changeDate(index)"
      > 
	  <text class="date" :class="{ 'visited-color': visitedIndex === index }">
          {{ index === 0 ? '今' : item.date }}
    </text>
        <text class="day" :class="{ 'visited-color': visitedIndex === index }">周{{ item.day }}</text>

      </view>
      <view class="box" @click="toggleShowMoreDate">
        <image class="icon" :src="toggleIcon"></image>
        <text class="day">{{ toggleText }}</text>
      </view>
    </view>

    <transition name="slide-fade">
      <view class="top-select-date" v-if="isShowMoreDate">
        <view 
          class="box" 
          v-for="(item, index) in dateList" 
          :key="index" 
          v-if="index >= 3" 
          @click="changeDate(index)"
        >
		<text class="date" :class="{ 'visited-color': visitedIndex === index }">{{ item.date }}</text>
          <text class="day" :class="{ 'visited-color': visitedIndex === index }">周{{ item.day }}</text>
          
        </view>
      </view>
    </transition>

    <view class="tips-positon" @tap="showModal">
      <view class="tips-inbox">
        <image class="icon" src="/static/appointment/tips.png"></image>
        <text class="tips-text">
          预约前请仔细阅读
          <text style="color: #7EC0EE;">预约须知</text>
        </text>
      </view>
    </view>

    <view 
      class="doctor-outbox" 
      @click="toDoctorAppointDetail(item, index)" 
      v-if="isGetData"
      v-for="(item, index) in doctorList" 
      :key="item.doctorInfo.id"
    >
      <image class="doctor-icon" :src="getDoctorIcon(item.doctorInfo.gender)"></image>
      <view class="doctor-info">
        <view class="doctor-job-box">
          <text class="doctor-name">{{ item.doctorInfo.name }}</text>
          <!-- <text class="gray-text">{{ item.doctorInfo.jobTitle }}</text> -->
        </view>
        <text class="gray-text">
          出诊：
          <text style="color: #7EC0EE;">{{ item.outCallList.time | getVisitPlanTime }}</text>
        </text>
      </view>

    </view>
	<doctor-treatment-time v-if="isTreatmentTime == 1"></doctor-treatment-time>
	<!-- <doctor-detial :introduce="doctorInfo.specialty"></doctor-detial> -->
    <noDataPage :message="message" v-if="!isGetData"></noDataPage>

    <view class="cu-modal bottom-modal" :class="{ show: isShowModal }">
      <view class="cu-dialog">
        <view class="cu-bar bg-white">
          <view class="action text-blue" @tap="hideModal">关闭</view>
        </view>
        <view class="bottom-hospital-box">
          <view class="tips-item" v-for="(tip, index) in tipsList" :key="index">
            <text>{{ tip }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
	formDate
} from '@/common/js/formDate.js';
import {getOutCall} from '@/common/api/outCall.js';
import {getDoctorInfoById} from '@/common/api/doctor.js';
import {
	getAllHospital
} from '@/common/api/hospital.js'
import doctorTreatmentTime from '../doctorAppointDetail/component/doctorTreatmentTime';

export default {
	components: {
		doctorTreatmentTime,
	},
  data() {
    return {
      isShowMoreDate: true,
      visitedIndex: 0,
      dateList: [],
      isShowModal: false,
      hospitalList: [],
      visitedHospital: 0,
      showVisited: 0,
      showName: '',
      doctorList: [],
      sentDate: '',
      iconURL: '/static/appointment/',
      isGetData: false,
      message: '医生出诊',
      hospitalData: {},
      tipsList: [
        '1.七天后的号源将在今天19:00准时开放，敬请关注。',
        // '2.上午和下午每个用户均最多预约一个时间段，后续预约无效。',
        '2.预约后要及时赴约哦',
        '3.取消预约可以在一个小时前从主页我的--预约记录中取消。',
      ],
    };
  },
  computed: {
    toggleIcon() {
      return this.isShowMoreDate
        ? '/static/appointment/icon-up.png'
        : '/static/appointment/icon-down.png';
    },
    toggleText() {
      return this.isShowMoreDate ? '收起' : '展示';
    },
  },
  methods: {
    toggleShowMoreDate() {
      this.isShowMoreDate = !this.isShowMoreDate;
    },
    getCurrentDate() {
      const currentDate = new Date();
      this.dateList = formDate(currentDate, 'week-date');
    },
    changeDate(index) {
      this.visitedIndex = index;
      const date = `${this.dateList[index].year}-${this.dateList[index].month}-${this.dateList[index].date}`;
      this.hospitalData.date = date;
      this.getOutCall(date, this.hospitalData.hospitalId, this.hospitalData.departmentId, this.hospitalData.outpatientId);
    },
    showModal() {
      this.isShowModal = true;
    },
    hideModal() {
      this.isShowModal = false;
      this.showVisited = this.visitedHospital;
    },
	getAllDetail(){
		
	},
    toDoctorAppointDetail(doctorInfo, index) {
      uni.setStorageSync('doctorInfo', JSON.stringify(doctorInfo));
      uni.setStorageSync('visitPlan', JSON.stringify(this.doctorList[index]));
      uni.redirectTo({
        url: '/pagesB/pages/appointPages/doctorAppointDetail/doctorAppointDetail?isTreatmentTime=1',
      });
    },
    getDoctorIcon(gender) {
      return `${this.iconURL}${gender === 1 ? 'man-doctor.png' : 'women-doctor.png'}`;
    },
    async getOutCall(today, hospitalId, departmentId, outpatientId) {
      this.doctorList = [];
      uni.showLoading({ title: '加载中' });
      try {
        const res = await getOutCall(today, 1, 50, hospitalId, departmentId, outpatientId);
        if (res.data.code === 200) {
          const data = res.data.data.list;
          this.isGetData = data.length > 0;
          if (this.isGetData) {
            await Promise.all(
              data.map(async (item) => {
                const doctorRes = await getDoctorInfoById(item.doctorId);
                if (doctorRes.data.code === 200) {
                  this.doctorList.push({
                    outCallList: item,
                    doctorInfo: doctorRes.data.data,
                  });
                }
              })
            );
          }
        }
      } catch {
        error('获取出诊列表信息失败');
      } finally {
        uni.hideLoading();
      }
    },
  },
  async onLoad(e) {
    this.getCurrentDate();
    let today;
    if (uni.getStorageSync('dateInfo')) {
      const date = JSON.parse(uni.getStorageSync('dateInfo'));
      today = `${date.dateInfo.year}-${date.dateInfo.month}-${date.dateInfo.date}`;
      this.visitedIndex = date.index;
    } else {
      today = `${this.dateList[0].year}-${this.dateList[0].month}-${this.dateList[0].date}`;
    }
    await this.getOutCall(today, e.hospitalId, e.departmentId, e.outpatientId);
    this.showVisited = e.hospitalId;
    this.visitedHospital = this.showVisited;
    this.hospitalData = {
      hospitalId: e.hospitalId,
      departmentId: e.departmentId,
      outpatientId: e.outpatientId,
      date: today,
    };
    uni.removeStorageSync('dateInfo');
  },
  onShow() {
    getAllHospital(1, 50, '')
      .then((res) => {
        if (res.data.code === 200) {
          this.hospitalList = res.data.data.list;
        }
      })
      .catch(() => {
        error('网络');
      });
  },
};
</script>

<style lang="scss">
@import '@/common/scss/doctor.scss';
@import '@/common/scss/common.scss';

.top-select-date {
  width: 100%;
  height: 120rpx;
  display: flex;
  align-items: center;
  border-bottom: 1px solid $border-color;

  .box {
    width: 25%;
    height: 85%;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;

    .day {
      align-items: flex-start;
      font-size: 16px;
      font-weight: 500;
      color: $gray-color;
    }

    .date {
      align-items: flex-end;
      font-size: 16px;
      font-weight: 500;
      color: #000;
    }

    .icon {
      width: 50rpx;
      height: 50rpx;
    }
  }

  .box:not(:last-child) {
    border-right: 1px solid $border-color;
  }
}

.tips-positon {
  margin-top: 30rpx;
  @extend .tips-box;
  margin-bottom: 10rpx;
}

.doctor-job-box {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;

  .doctor-name {
    width: 50%;
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
}

.gray-text {
  width: 100%;
  height: 50%;
  font-size: 16px;
  font-weight: 500;
  color: $gray-color;
  display: flex;
  align-items: center;
}

.cu-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: none;
  justify-content: center;
  align-items: flex-end;
  background-color: rgba(0, 0, 0, 0.5);

  &.show {
    display: flex;
  }
}

.cu-dialog {
  width: 100%;
  background-color: white;
  border-radius: 10px 10px 0 0;
  padding: 20rpx;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.bottom-hospital-box {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-wrap: wrap;

  .hospital-box {
    width: 33%;
    height: 80rpx;
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .hospital {
      width: 85%;
      margin: 0 auto;
      border-radius: 10px;
      text-align: center;
      display: table;

      .text {
        width: 100%;
        height: 100%;
        font-size: 16px;
        font-weight: 500;
        color: #fff;
        display: table-cell;
        vertical-align: middle;
      }
    }

    .visited-background {
      background: $major-color;
    }

    .invisited-background {
      background: #d1d1d1;
    }
  }
}
</style>
