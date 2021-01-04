<template>
  <div class="app-container" style="width:100%;">
    <el-row>
      <el-col :span="16">
        <div class="grid-content bg-purple" style="margin-top: 15px;margin-left:20px">
          <el-button type="primary" @click="dialogVisible2=true">+新建分类科目</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%;margin-top: 30px;" highlight-current-row border>
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="父级ID" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.parentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类科目ID" style="width: 20%" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类科目名" style="width: 20%" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" :formatter="formatDate" />
      <el-table-column label="状态" style="width: 20%" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span
              :class="{red:scope.row.status != 1}"
            >{{ scope.row.status == 1?'正常':'禁用' }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-popconfirm title="确定删除此分类吗？" @onConfirm="handleDelete(scope.$index, scope.row)">
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新建分类" :visible.sync="dialogVisible2" width="30%" :before-close="handleClose">
      <span slot="footer" class="dialog-footer">
        <template>
          <div>
            <el-form
              ref="ruleForm2"
              :model="ruleForm2"
              :rules="rules2"
              label-width="140px"
              class="demo-ruleForm"
            >
              <el-form-item label="分类科目名" prop="name">
                <el-input v-model="ruleForm2.name" />
              </el-form-item>
               <el-form-item label="父级id" prop="parentId">
                <el-input v-model="ruleForm2.parentId" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm2('ruleForm2')">立即创建</el-button>
                <el-button @click="resetForm2('ruleForm2')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </span>
    </el-dialog>

    <div class="block" style="text-align:center;margin-top:20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :hide-on-single-page="true"
        :page-size="List.per_page"
        layout="total, prev, pager, next, jumper"
        :page-count="List.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { category, remove, add } from '@/api/classify'
export default {
  data() {
    return {
      List: [],
      dialogVisible2: false,
      page: 1,
      tableData: [],
      ruleForm: {
        name: '',
        pass: '',
        region: '',
        Id: ''
      },
      rules: {
        pass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入帐户名', trigger: 'blur' }],
        region: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      ruleForm2: {
        name: ''
      },
      rules2: {
        name: [{ required: true, message: '请输入分类名', trigger: 'blur' }]
      },
      input3: null
    }
  },
  created() {
    this.request()
  },
  methods: {
    request() {
      category(this.page).then(res => {
        console.log(res)
        this.tableData = res.data
        this.List = res
      })
    },

    handleDelete(index, row) {
      console.log(row.id)
      remove(row.id).then(res => {
        console.log(res)
        this.request()
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          add(this.ruleForm2.name).then(res => {
            if (res.errCode === 0) {
              this.request()
              this.$refs[formName].resetFields()
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
    search() {
      if (this.input3 === null) {
        this.request()
      } else {
        var str = this.input3.replace(/\s+/g, '')
        if (str === '') {
          this.request()
        } else {
          // categoryquery(str).then(res => {
          //   this.tableData = res.results
          // }).catch(res => {
          //   this.tableData = []
          // })
        }
      }
    },
    reset() {
      this.input3 = null
      this.request()
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
