<template>
  <div>
    <el-table ref="singleTable" :data="tableData" highlight-current-row border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="成功次数"> <span>{{ props.row.totalSuccess}}次</span> </el-form-item>
            <el-form-item label="教学经验"> <span>{{ props.row.experience}}年</span> </el-form-item>
            <el-form-item label="年龄"> <span>{{ props.row.age}}岁</span> </el-form-item>
            <el-form-item label="课时费用"> <span>{{ props.row.hourPrice }}元</span> </el-form-item>
            <el-form-item label="擅长科目"> <span>{{ props.row.goodAt}}</span> </el-form-item>
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
      <el-table-column property="User.nickName" label="用户昵称" align="center" />
      <el-table-column property="User.realName" label="姓名" align="center" />
      <el-table-column property="User.phone" label="电话号码" align="center" />
      <el-table-column property="User.email" label="邮箱" align="center" />
      <el-table-column property="User.qq" label="QQ" align="center" />
      <el-table-column property="User.wechat" label="微信号" align="center" />
      <el-table-column label="性别" align="center">
        <template slot-scope="props">
          <span v-if="props.row.User.gender === 1">男</span>
          <span v-else-if="props.row.User.gender === 2">女</span>
          <span v-else>不知</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" :formatter="formatDate" />
      <el-table-column align="center" property="User.loginTime" label="最后一次登录时间" :formatter="formatDate1" />
      <el-table-column align="center" label="审核状态">
        <template slot-scope="props">
          <span v-if="props.row.state === 2 ">不通过</span>
          <span v-else-if="props.row.state === 3">通过</span>
          <span v-else>已提交</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="props">
          <el-button size="mini" @click="handleAgree(props.$index, props.row)">通过</el-button>
          <el-popconfirm title="确定审核不通过嘛？" @onConfirm="handleDelete(scope.$index, scope.row)">
            <el-button slot="reference" size="mini" type="danger" @click="handleDisagree(props.$index, props.row)">不通过</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="block" style="text-align:center;margin-top:20px">
      <el-pagination
        :page-size="List.per_page"
        :hide-on-single-page="true"
        layout="total, prev, pager, next, jumper"
        :page-count="List.total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { teacher, Agree, Disagree } from '@/api/user'
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
    handleCurrentChange(val) {
      this.page = val
      teacher(val).then(res => {
        console.log(res)
        this.tableData = res.results
        this.List = res
      })
      console.log(val)
    },
    handleAgree(index, row) {
      Agree(row.id).then(res => {
        console.log(res)
        this.request()
      })
      console.log(index, row.id)
    },
    handleDisagree(index, row) {
      Disagree(row.id).then(res => {
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .red {
    color: red;
  }
</style>
