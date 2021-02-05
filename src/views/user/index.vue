<template>
  <div>
    <el-table ref="singleTable" :data="tableData" highlight-current-row border style="width: 100%">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column property="id" label="用户ID" align="center" />
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-image style="height: 50px;width:50px" :src="scope.row.image_url" fit="cover" />
          </div>
        </template>
      </el-table-column>
      <el-table-column property="nickName" label="用户昵称" align="center" />
      <el-table-column property="phone" label="电话号码" align="center" />
      <el-table-column property="email" label="邮箱" align="center" />
      <el-table-column property="qq" label="QQ" align="center" />
      <el-table-column property="wechat" label="微信号" align="center" />
      <el-table-column property="address" label="所在区域" align="center" :formatter="formatAddress" />
      <el-table-column label="性别" align="center">
        <template slot-scope="props">
          <span v-if="props.row.gender === 1">男</span>
          <span v-else-if="props.row.gender === 2">女</span>
          <span v-else>不知</span>
        </template>
      </el-table-column>
      <el-table-column label="是否认证老师" align="center">
        <template slot-scope="props">
          <span v-if="props.row.type === 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" :formatter="formatDate" />
      <el-table-column align="center" property="loginTime" label="最后一次登录时间" :formatter="formatDate1" />
      <el-table-column align="center" label="用户状态">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span :class="{red:scope.row.status != 1}">{{ scope.row.status == 1?'正常':'不正常' }}</span>
          </div>
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
import { user } from '@/api/user'
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
      user(this.page).then(res => {
        console.log(res)
        this.tableData = res.data
        this.List = res
      })
    },
    handleCurrentChange(val) {
      this.page = val
      user(val).then(res => {
        console.log(res)
        this.tableData = res.data
        this.List = res
      })
      console.log(val)
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
      if (row.loginTime === null) { return null }
      const date = new Date(parseInt(row.loginTime) * 1000)
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
      if (row.address === null) {
        return null
      }
      let area = ''
      switch (row.address.length) {
        case 1:
          area += CodeToText[row.address[0]]
          break
        case 2:
          area += CodeToText[row.address[0]] + '/' + CodeToText[row.address[1]]
          break
        case 3:
          area += CodeToText[row.address[0]] + '/' + CodeToText[row.address[1]] + '/' + CodeToText[row.address[2]]
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
  .red { color: red; }
</style>
