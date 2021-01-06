<template>
  <div class="app-container" style="width:100%;">
    <el-button type="primary" @click="dialogVisible2=true">+新建管理员</el-button>
    <el-table :data="tableData" style="width: 100%;margin-top: 30px;" highlight-current-row border>
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <i class="el-icon-s-custom" />
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="帐户名" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="管理员姓名" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span>
              {{ scope.row.realName }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatDate1" />
      <el-table-column prop="updateTime" label="更新时间" align="center" :formatter="formatDate2" />
      <el-table-column label="状态" style="width: 20%" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 0" style="color: red;">禁用</div>
          <div v-else-if="scope.row.status === 1" style="color: #409EFF;">正常</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-popconfirm title="确定删除此管理员吗？" @onConfirm="handleDelete(scope.$index, scope.row)">
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="信息修改" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="真实姓名" prop="realName" style="width:400px">
          <el-input v-model="ruleForm.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="新密码" prop="password" style="width:400px">
          <el-input v-model="ruleForm.password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item style="width:400px">
          <el-button type="primary" @click="submitForm1('ruleForm')">修改</el-button>
          <el-button @click="resetForm1('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="新建管理员"
      :visible.sync="dialogVisible2"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm2"
        :model="ruleForm2"
        :rules="rules2"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="登录名" prop="name" style="width:400px">
          <el-input v-model="ruleForm2.name" placeholder="请输入登录名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" style="width:400px">
          <el-input v-model="ruleForm2.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName" style="width:400px">
          <el-input v-model="ruleForm2.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item style="width:400px">
          <el-button type="primary" @click="submitForm2('ruleForm2')">创建</el-button>
          <el-button @click="resetForm2('ruleForm2')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="block" style="text-align:center;margin-top:20px">
      <el-pagination
        :hide-on-single-page="true"
        :page-size="List.per_page"
        layout="total, prev, pager, next, jumper"
        :page-count="List.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { pagination, Delete, Create, Modify } from '@/api/admin'
export default {
  data() {
    return {
      currentPage4: 4,
      List: [],
      dialogVisible2: false,
      page: 1,
      dialogVisible: false,
      tableData: [],
      DataList: [],
      ruleForm: {
        realName: null,
        password: null,
        id: null
      },
      ruleForm2: {
        name: '',
        password: '',
        realName: ''
      },
      rules2: {
        name: [{ required: true, message: '请输入帐户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      options: [
        {
          value: 1,
          label: '正常'
        },
        {
          value: 0,
          label: '禁用'
        }
      ]
    }
  },
  created() {
    this.request()
  },
  methods: {
    request() {
      pagination(this.page).then(res => {
        console.log(res)
        this.tableData = res.data
        this.List = res
      })
    },
    handleEdit(index, row) {
      this.dialogVisible = true
      this.ruleForm.realName = row.realName
      this.ruleForm.id = row.id
    },
    handleDelete(index, row) {
      Delete(row.id).then(res => {
        console.log(res)
        this.request()
      });
      console.log(index, row.id);
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    submitForm1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('password:' + this.ruleForm.password)
          Modify(this.ruleForm).then(res => {
            console.log(res)
            if (res.code === 0) {
              this.request()
              this.$refs[formName].resetFields()
              this.dialogVisible = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm1(formName) {
      this.$refs[formName].resetFields()
    },
    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          Create(this.ruleForm2).then(res => {
            if (res.code === 0) {
              this.$refs[formName].resetFields()
              this.request()
              this.dialogVisible2 = false
            }
            console.log(res)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm2(formName) {
      this.$refs[formName].resetFields()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.page = val
      pagination(val).then(res => {
        console.log(res)
        this.tableData = res.results
        this.List = res
      })
      console.log(val)
    },
    formatDate1(row) {
      if (row.createTime === null) {

      } else {
        const date = new Date(parseInt(row.createTime) * 1000)
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
    formatDate2(row) {
      if (row.updateTime === null) {

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
    }
  }
}
</script>
<style lang="scss" scoped>
  .app-container {
    min-width: 1500px;
    .roles-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }

    .red {
      color: red;
    }
  }
</style>
