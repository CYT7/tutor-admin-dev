<template>
  <div>
    <el-header style="margin-top:15px">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >
        <el-tag effect="dark">全部</el-tag>
      </el-checkbox>
      <div style="margin: 15px 0;" />
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="(city,index) in cities" :key="index" :label="city.value">
          <el-tag :type="city.type">{{ city.label }}</el-tag>
        </el-checkbox>
      </el-checkbox-group>
    </el-header>
    <el-table v-loading="loading" :data="this.list" border fit stripe style="width: 100%;margin-top:30px">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="同学称呼"> <span>{{ props.row.name}}</span> </el-form-item>
            <el-form-item label="科目"> <span>{{ props.row.subject }}</span> </el-form-item>
            <el-form-item label="联系方式"> <span>{{ props.row.phone }}</span> </el-form-item>
            <el-form-item label="同学QQ" v-if="props.row.qq?'':props.row.qq"> <span>{{ props.row.qq }}</span> </el-form-item>
            <el-form-item label="同学wechat" v-if="props.row.wechat?'':props.row.wechat"> <span>{{ props.row.wechat }}</span> </el-form-item>
            <el-form-item label="上课时间"> <span>{{ props.row.teach_date }}</span> </el-form-item>
            <el-form-item label="所在区域"> <span>{{ formatAddress(props.row.city) }}</span> </el-form-item>
            <el-form-item label="详情地址"> <span>{{props.row.address}}</span> </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="预约 ID" prop="id" align="center" />
      <el-table-column label="共上课几次" prop="frequency" align="center" />
      <el-table-column label="每次上课几小时" prop="timeHour" align="center" />
      <el-table-column label="每小时几元" align="center"><template slot-scope="scope"><p>{{ scope.row.hourPrice}}元</p></template></el-table-column>
      <el-table-column label="预约总报价" align="center"><template slot-scope="scope"><p>{{ scope.row.totalPrice}}元</p></template></el-table-column>
      <el-table-column label="预约创建时间" prop="createTime" :formatter="formatDate" align="center" />
      <el-table-column label="预约更新时间" prop="updateTime" :formatter="formatDate1" align="center" />
      <el-table-column label="预约状态" prop="state" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.state === 0" style="font-weight: bolder">未回应预约</div>
          <div v-else-if="scope.row.state === 1" style="color: #409EFF; font-weight: bolder">已预约 待付款</div>
          <div v-else-if="scope.row.state === 2" style="color: #E6A23C; font-weight: bolder">进行中</div>
          <div v-else-if="scope.row.state === 3" style="color: #67C23A; font-weight: bolder">已完成</div>
          <div v-else style="color: #F56C6C; font-weight: bolder">已关闭</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align:center;margin-top:20px">
      <el-pagination
        :hide-on-single-page="true"
        :page-size="tableData.per_page"
        layout="total, prev, pager, next, jumper"
        :page-count="tableData.totals"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
const cityOptions = [
  { type: 'info', label: '未回应预约', value: 0 },
  { type: '', label: '已预约', value: 1 },
  { type: 'success', label: '预约已完成', value: 3 },
  { type: 'warning', label: '预约进行中', value: 2 },
  { type: 'danger', label: '预约已关闭', value: 4 }
]
import { getAppointsList, getAppointsListForType } from '@/api/appoint'
import { CodeToText } from 'element-china-area-data'
export default {
  data() {
    return {
      tableData: [],
      arr: [0, 1, 2, 3, 4],
      checkAll: false,
      checkedCities: [0, 1, 2, 3, 4],
      selectionArr: [],
      allElection: [],
      cities: cityOptions,
      isIndeterminate: true,
      loading: true,
      page: 1,
      list: [],
      tmp: {},
      dialogFormVisible: false,
      dialogVisible: false
    }
  },

  created() {
    this.getList()
  },
  mounted() {
    this.allElectionFun()
    this.DefaultFullSelection()
  },
  methods: {
    getList() {
      this.loading = true
      getAppointsList(this.page)
        .then(response => {
          this.list = response.data
          this.tableData = response
          this.loading = false
        })
        .catch(response => {
          this.list = []
          this.tableData = []
          this.loading = false
        })
    },
    handleEdit(index, row) {
      this.dialogVisible = true
    },
    DefaultFullSelection() {
      this.checkedCities = this.allElection
      const checkedCount = this.checkedCities.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.cities.length
      this.selectionFun(this.checkedCities)
    },
    allElectionFun() {
      this.allElection = []
      for (var i = 0; i < this.cities.length; i++) {
        this.allElection.push(this.cities[i].value)
      }
    },
    selectionFun(selectionArr) {
      this.selectionArr = []
      for (var i = 0; i < this.cities.length; i++) {
        for (var j = 0; j < selectionArr.length; j++) {
          if (selectionArr[j] === this.cities[i].value) {
            this.selectionArr.push(this.cities[i])
          }
        }
      }
    },
    handleCheckAllChange(val) {
      this.allElectionFun()
      this.checkedCities = val ? this.arr : []
      this.isIndeterminate = false
      this.loading = true
      this.handleCheckedCitiesChange(this.checkedCities)
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.cities.length
      if (checkedCount === 0) {
        value = [-1]
      }
      this.loading = true
      getAppointsListForType(this.page, value)
        .then(res => {
          this.list = res.data
          this.tableData = res
          this.loading = false
        })
        .catch(res => {
          this.list = []
          this.tableData = res
          this.loading = false
        })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.page = val
      getAppointsList(this.page).then(res => {
        console.log(res)
        this.list = res.data
      })
      console.log(val)
    },
    formatDate(row, column) {
      const date = new Date(parseInt(row.createTime) * 1000)
      const Y = date.getFullYear() + '-'
      const M =
          date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1) + '-'
            : date.getMonth() + 1 + '-'
      const D =
          date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
      const h =
          date.getHours() < 10
            ? '0' + date.getHours() + ':'
            : date.getHours() + ':'
      const m =
          date.getMinutes() < 10
            ? '0' + date.getMinutes() + ':'
            : date.getMinutes() + ':'
      const s =
          date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    formatDate1(row, column) {
      if (!row.updateTime) {
        return
      } else {
        const date = new Date(parseInt(row.updateTime) * 1000)
        const Y = date.getFullYear() + '-'
        const M =
            date.getMonth() + 1 < 10
              ? '0' + (date.getMonth() + 1) + '-'
              : date.getMonth() + 1 + '-'
        const D =
            date.getDate() < 10
              ? '0' + date.getDate() + ' '
              : date.getDate() + ' '
        const h =
            date.getHours() < 10
              ? '0' + date.getHours() + ':'
              : date.getHours() + ':'
        const m =
            date.getMinutes() < 10
              ? '0' + date.getMinutes() + ':'
              : date.getMinutes() + ':'
        const s =
            date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return Y + M + D + h + m + s
      }
    },
    formatAddress: function(value) {
      if (value === null) {
        return null
      }
      let area = ''
      switch (value.length) {
        case 1:
          area += CodeToText[value[0]]
          break
        case 2:
          area += CodeToText[value[0]] + '/' + CodeToText[value[1]]
          break
        case 3:
          area += CodeToText[value[0]] + '/' + CodeToText[value[1]] + '/' + CodeToText[value[2]]
          break
        default:
          break
      }
      return area
    }
  }
}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
