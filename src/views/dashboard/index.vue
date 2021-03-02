<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎您！{{ name }}</div>
    <div class="dashboard-editor-container">
      <el-row :gutter="25" class="panel-group">
        <el-col :xs="16" :sm="16" :lg="8" class="card-panel-col">
          <div class="card-panel" style="background-image: linear-gradient(to right, #0493fc , #03bef5);" @click="handleSetLineChartData('newVisitis')">
            <div class="card-panel-icon-wrapper icon-people" style="display:flex;">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
              <div class="card-panel-text">用户</div>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">{{ data.userCount }}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="16" :sm="16" :lg="8" class="card-panel-col">
          <div class="card-panel" style="background-image: linear-gradient(to right, #FF8C00 , #FFA500);" @click="handleSetLineChartData('newVisitis')">
            <div class="card-panel-icon-wrapper icon-people" style="display:flex;">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
              <div class="card-panel-text">教师</div>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">{{ data.teacherCount }}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="16" :sm="16" :lg="8" class="card-panel-col">
          <div class="card-panel" style="background-image: linear-gradient(to right, #11d597 , #30ebc0);" @click="handleSetLineChartData('messages')">
            <div class="card-panel-icon-wrapper icon-business" style="display:flex;">
              <svg-icon icon-class="message" class-name="card-panel-icon" />
              <div class="card-panel-text">需求</div>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">{{ data.needCount }}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="16" :sm="16" :lg="8" class="card-panel-col">
          <div class="card-panel" style="background-image: linear-gradient(to right, #fc5252 , #ff8c67);" @click="handleSetLineChartData('shoppings')">
            <div class="card-panel-icon-wrapper icon-business" style="display:flex;">
              <svg-icon icon-class="business" class-name="card-panel-icon" />
              <div class="card-panel-text">预约</div>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">{{ data.appointCount }}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="16" :sm="16" :lg="8" class="card-panel-col">
          <div class="card-panel" style="background-image: linear-gradient(to right, #ffbf37 , #fed23d);" @click="handleSetLineChartData('purchases')">
            <div class="card-panel-icon-wrapper icon-people" style="display:flex;">
              <svg-icon icon-class="admin" class-name="card-panel-icon" />
              <div class="card-panel-text">管理员</div>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">{{ data.adminCount }}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="16" :sm="16" :lg="8" class="card-panel-col">
          <div class="card-panel" style="background-image: linear-gradient(to right, #FFC1C1 , #EEB4B4);" @click="handleSetLineChartData('purchases')">
            <div class="card-panel-icon-wrapper icon-people" style="display:flex;">
              <svg-icon icon-class="admin" class-name="card-panel-icon" />
              <div class="card-panel-text">轮播图</div>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-num">{{ data.adminCount }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { index } from '@/api/dashboard'
export default {
  name: 'Dashboard',
  data() {
    return {
      data: ''
    }
  },
  computed: { ...mapGetters(['name']) },
  created() {
    this.request()
  },
  methods: {
    request() {
      index().then(res => {
        console.log(res.data)
        this.data = res.data
      }).catch(res => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .dashboard {
    min-width: 1000px;
    &-container {
      margin: 30px;
    }
    &-text {
      line-height: 46px;
    }
  }
  .dashboard-text{
    font-size: 20px;
    color: grey;
    padding: 10px 0 10px 20px;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.05);
    border-left: 6px solid skyblue;
  }
  .panel-group {
    margin-top: 18px;
    min-width: 1000px;
    .card-panel {
      height: 138px;
      cursor: pointer;
      margin-bottom: 20px;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      border-radius: 8px;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.05);
      .icon-people {
        color: #fff;
      }
      .icon-message {
        color: #fff;
      }
      .icon-money {
        color: #fff;
      }
      .icon-business {
        color: #fff;
      }
      .card-panel-icon-wrapper {
        .card-panel-text {
          line-height: 30px;
          color: #fff;
          font-size: 30px;
          padding-left: 10px;
        }
        float: left;
        margin: 55px 0 0 50px;
        padding: 1px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 30px;
      }
      .card-panel-description {
        float: right;
        .card-panel-num {
          font-size: 25px;
          color: #fff;
          margin: 55px 60px 0 0;
        }
      }
    }
  }
  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }
    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;
      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
