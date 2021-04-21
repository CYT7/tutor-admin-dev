<template>
  <div>
    <el-table ref="singleTable" :data="tableData" highlight-current-row border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="学生证">
              <el-image style="width: 200px; height: 200px" :src="props.row.StudentCard" fit="cover" />
            </el-form-item>
            <el-form-item label="身份证">
              <el-image style="width: 200px; height: 200px" :src="props.row.identityCard" fit="cover" />
            </el-form-item>
            <el-form-item label="成功次数">
              <span>{{ props.row.totalSuccess }}次</span>
            </el-form-item>
            <el-form-item label="评分">
              <span>{{ props.row.satisfaction}}分</span>
            </el-form-item>
            <el-form-item label="总评论次数">
              <span>{{ props.row.totalComment }}次</span>
            </el-form-item>
            <el-form-item label="教学经验">
              <span>{{ props.row.experience }}年</span>
            </el-form-item>
            <el-form-item label="年龄">
              <span>{{ props.row.age }}岁</span>
            </el-form-item>
            <el-form-item label="课时费用">
              <span>{{ props.row.hourPrice}}元</span>
            </el-form-item>
            <el-form-item label="擅长科目">
              <span>{{ props.row.goodAt }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" width="30" align="center" />
      <el-table-column property="id" label="老师ID" align="center" />
      <el-table-column label="头像路径" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-image
              style="height: 50px;width:50px"
              :src="scope.row.User.image_url"
              fit="cover"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column property="realName" label="姓名" align="center" />
      <el-table-column property="User.phone" label="电话号码" align="center" />
      <el-table-column property="school" label="就读学校" align="center" />
      <el-table-column label="性别" align="center">
        <template slot-scope="props">
          <span v-if="props.row.User.gender === 2">男</span>
          <span v-else-if="props.row.User.gender === 3">女</span>
          <span v-else>保密</span>
        </template>
      </el-table-column>
      <el-table-column property="city" label="所在区域" align="center" :formatter="formatAddress" />
      <el-table-column align="center" prop="createTime" label="创建时间" :formatter="formatDate" />
      <el-table-column align="center" property="User.loginTime" label="最后一次登录时间" :formatter="formatDate1" />
      <el-table-column align="center" label="审核状态">
        <template slot-scope="props">
          <span v-if="props.row.state === 2 " style="color: #F56C6C; font-weight: bolder">不通过</span>
          <span v-else-if="props.row.state === 3" style="color: #67C23A; font-weight: bolder">通过</span>
          <span v-else>已提交</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-if="props.row.state === 1" slot-scope="props">
          <el-button size="mini" @click="handleAgree(props.$index, props.row)">通过</el-button>
          <el-popconfirm title="确定审核不通过嘛？" @onConfirm="handleDisagree(props.$index, props.row)">
            <el-button slot="reference" size="mini" type="danger">不通过</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align:center;margin-top:20px">
      <el-pagination
        :hide-on-single-page="true"
        :page-size="List.per_page"
        layout="total, prev, pager, next, jumper"
        :page-count="List.totals"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { teacher, Agree, Disagree } from '@/api/user'
import { CodeToText } from 'element-china-area-data'
export default {
  data() {
    return {
      page: 1,
      tableData: [],
      List: []
    }
  },
  created() {
    this.request()
  },
  methods: {
    request() {
      teacher(this.page).then(res => {
        console.log(res)
        this.tableData = res.data
        this.List = res
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.page = val
      teacher(val).then(res => {
        console.log(res)
        this.tableData = res.data
        this.List = res
      })
      console.log(val)
    },
    handleAgree(index, row) {
      Agree(row.id).then(res => {
        console.log(res)
        this.$notify({
          title: '成功',
          message: res.msg,
          type: 'success'
        })
        this.request()
      })
      console.log(index, row.id)
    },
    handleDisagree(index, row) {
      Disagree(row.id).then(res => {
        this.$notify({
          title: '成功',
          message: res.msg,
          type: 'success'
        })
        console.log(res)
        this.request()
      })
      console.log(index, row.id)
    },
    formatDate(row) {
      const date = new Date(parseInt(row.createTime) * 1000)
      const Y = date.getFullYear() + '-'
      const M =
          date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1) + '-'
            : date.getMonth() + 1 + '-'
      const D =
          date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + ''
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
      return Y + M + D + ' ' + h + m + s
    },
    formatDate1(row) {
      const date = new Date(parseInt(row.User.loginTime) * 1000)
      const Y = date.getFullYear() + '-'
      const M =
          date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1) + '-'
            : date.getMonth() + 1 + '-'
      const D =
          date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + ''
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
      return Y + M + D + ' ' + h + m + s
    },
    formatAddress(row) {
      if (row.city === null) {
        return null
      }
      let area = ''
      switch (row.city.length) {
        case 1:
          area += CodeToText[row.city[0]]
          break
        case 2:
          area += CodeToText[row.city[0]] + '/' + CodeToText[row.city[1]]
          break
        case 3:
          area += CodeToText[row.city[0]] + '/' + CodeToText[row.city[1]] + '/' + CodeToText[row.city[2]]
          break
        default:
          break
      }
      return area
    }
  }
}
</script>
<style lang="scss" scoped>
  .red { color: red;}
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
