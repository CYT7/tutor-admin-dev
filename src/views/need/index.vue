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
      <div style="margin: 15px 0;"></div>
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
            <el-form-item label="同学称呼"> <span>{{ props.row.nickName}}</span> </el-form-item>
            <el-form-item label="科目"> <span>{{ props.row.subject}}</span> </el-form-item>
            <el-form-item label="同学QQ联系方式"> <span>{{ props.row.qq}}</span> </el-form-item>
            <el-form-item label="同学wechat联系方式"> <span>{{ props.row.wechat}}</span> </el-form-item>
            <el-form-item label="同学性别">
              <span v-if="props.row.gender === 1" style="font-weight: bolder">男</span>
              <span v-else-if="props.row.gender === 2" style="color: #F56C6C; font-weight: bolder">女</span>
              <span v-else>不限</span>
            </el-form-item>
            <el-form-item label="教师性别要求">
              <span v-if="props.row.teacherGender === 1" style="font-weight: bolder">男</span>
              <span v-else-if="props.row.teacherGender === 2" style="color: #F56C6C; font-weight: bolder">女</span>
              <span v-else>不限</span>
            </el-form-item>
            <el-form-item label="上课时间"> <span>{{ props.row.teach_date}}</span> </el-form-item>
            <el-form-item label="地址"> <span>{{ props.row.address}}</span> </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="需求 ID" prop="id" align="center" />
      <el-table-column label="需上课几次" prop="frequency" align="center" />
      <el-table-column label="每次上课几小时" prop="timeHour" align="center" />
      <el-table-column label="每小时几元" align="center"><template slot-scope="scope"><p>{{ scope.row.hourPrice }}元</p></template></el-table-column>
      <el-table-column label="需求总报价" align="center"><template slot-scope="scope"><p>{{ scope.row.totalPrice }}元</p></template></el-table-column>
<!--      <el-table-column label="需求创建人" prop="User" align="center" />-->
      <el-table-column label="需求创建时间" prop="createTime" :formatter="formatDate" align="center" />
      <el-table-column label="需求更新时间" prop="updateTime" :formatter="formatDate1" align="center" />
      <el-table-column label="需求状态" prop="state" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.state === 1" style="font-weight: bolder">审核中</div>
          <div v-else-if="scope.row.state === 2" style="color: #F56C6C; font-weight: bolder">审核不通过</div>
          <div v-else-if="scope.row.state === 3" style="color: #409EFF; font-weight: bolder">审核通过</div>
          <div v-else-if="scope.row.state === 4" style="color: #E6A23C; font-weight: bolder">已选定</div>
          <div v-else-if="scope.row.state === 5" style="color: #67C23A; font-weight: bolder">已完成</div>
          <div v-else style="color: #F56C6C; font-weight: bolder">已关闭</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-popconfirm title="确定审核通过吗？" @onConfirm="handleAgree(scope.$index, scope.row)">
            <el-button slot="reference" size="mini">通过</el-button>
          </el-popconfirm>
          <el-popconfirm title="确定审核不通过吗？" @onConfirm="handleDisagree(scope.$index, scope.row)">
            <el-button slot="reference" size="mini" type="danger">不通过</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align:center;margin-top:20px">
      <el-pagination
        :hide-on-single-page="true"
        :page-size="tableData.per_page"
        layout="total, prev, pager, next, jumper"
        :page-count="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
const cityOptions = [
  { type: 'warning', label: '需求待审核', value: 1 },
  { type: 'danger', label: '需求审核不通过', value: 2 },
  { type: '', label: '需求审核通过', value: 3 },
  { type: 'info', label: '需求已选定老师', value: 4 },
  { type: 'success', label: '需求已完成', value: 5 },
  { type: 'danger', label: '需求已关闭', value: 6 }
]
import { getNeedList, getNeedListForType, agreeNeed, disagreeNeed } from '@/api/need'
export default {
  data() {
    return {
      tableData: [],
      arr: [1, 2, 3, 4, 5, 6],
      checkAll: false,
      checkedCities: [1, 2, 3, 4, 5, 6],
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
      getNeedList(this.page)
        .then(response => {
          console.log('orders: ', response)
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
    handleAgree(index, row) {
      this.loading = true
      agreeNeed(row.id).then(res => {
        this.$notify({
          title: '成功',
          message: res.msg,
          type: 'success'
        })
        this.getList()
      })
    },
    handleDisagree(index, row) {
      this.loading = true
      disagreeNeed(row.id).then(res => {
        this.$notify({
          title: '成功',
          message: res.msg,
          type: 'success'
        })
        this.getList()
      })
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
      getNeedListForType(this.page, value)
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
      getNeedList(this.page).then(res => {
        console.log(res)
        this.list = res.results
      })
      console.log(val)
      // console.log(`当前页: ${val}`);
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
    formatFee(row, column) {
      if (!row.cashFee) {
        return
      } else {
        return row.cashFee / 100 + '元'
      }
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
