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
        <template slot-scope="scope"><span style="margin-left: 10px">{{ scope.row.parentId }}</span></template>
      </el-table-column>
      <el-table-column label="分类科目ID" style="width: 20%" align="center">
        <template slot-scope="scope"><span style="margin-left: 10px">{{ scope.row.id }}</span></template>
      </el-table-column>
      <el-table-column label="分类科目名" style="width: 20%" align="center">
        <template slot-scope="scope"><div slot="reference" class="name-wrapper"><span>{{ scope.row.name }}</span></div></template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" :formatter="formatDate" />
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
              <el-form-item label="父级id" prop="parentId">
                <el-select v-model="ruleForm2.parentId" placeholder="请选择" style="float: left">
                  <el-option v-for="item in catelist" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="分类科目名" prop="name">
                <el-input v-model="ruleForm2.name" />
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
import { category, remove, add, list } from '@/api/category'
export default {
  data() {
    return {
      List: [],
      catelist: [],
      dialogVisible2: false,
      page: 1,
      tableData: [],
      ruleForm2: {
        name: '',
        parentId: ''
      },
      rules2: {
        name: [{ required: true, message: '请输入分类名', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.request()
    this.getCateList()
  },
  methods: {
    request() {
      category(this.page).then(res => {
        console.log(res)
        this.tableData = res.data
        this.List = res
      })
    },
    getCateList() {
      list().then(res => {
        if (res.code === 0) {
          this.catelist = res.data
        }
      })
    },
    handleDelete(index, row) {
      console.log(row.id)
      remove(row.id).then(res => {
        this.$notify({
          title: '成功',
          message: res.msg,
          type: 'success'
        })
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
          add(this.ruleForm2).then(res => {
            if (res.code === 0) {
              this.request()
              this.$refs[formName].resetFields()
              this.dialogVisible2 = false
              this.$notify({
                title: '成功',
                message: res.msg,
                type: 'success'
              })
            } else {
              this.$notify({
                title: '失败',
                message: res.msg,
                type: 'error'
              })
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
      category(val).then(res => {
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
