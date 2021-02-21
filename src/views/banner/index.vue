<template>
  <div class="div">
    <el-button type="primary" @click="dialogVisible=true">+上传轮播图</el-button>
    <el-table :data="tableData" style="width: 100%;margin-top:10px" border>
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="图片" align="center">
        <template slot-scope="scope" class="demo-image__preview">
          <el-image style="width:200px;height:100px" :src="scope.row.carousel" fit="cover" lazy />
        </template>
      </el-table-column>
      <el-table-column label="banner显示的序号" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span>{{ scope.row.sequence }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="图片上传" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <el-form
        ref="ruleForm1"
        :model="ruleForm1"
        :rules="rules1"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="图片" prop="file" style="width:400px">
          <el-upload
            class="upload-demo"
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :auto-upload="false"
            :limit="1"
            :on-change="change1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="序号" prop="sequence" style="width:400px">
          <el-input v-model="ruleForm1.sequence" placeholder="图片显示的序号" />
        </el-form-item>
        <el-form-item style="width:400px">
          <el-button type="primary" @click="submitForm1('ruleForm1')">立即创建</el-button>
          <el-button @click="resetForm1('ruleForm1')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible1">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>

<script>
import { banners, createbanners, delbanners } from '@/api/banner'
export default {
  data() {
    return {
      disabled: false,
      dialogImageUrl: '',
      dialogVisible: false,
      dialogVisible1: false,
      tableData: [],
      ruleForm1: {
        file: '',
        sequence: ''
      },
      rules1: {
        sequence: [{ required: true, message: '请填写轮播图序号', trigger: 'blur' }]
      },
      imageUrl: ''
    }
  },
  created() {
    this.request()
  },
  methods: {
    request() {
      banners().then(res => {
        this.tableData = res.data
        console.log(res.results)
      })
    },
    handleDelete(index, row) {
      console.log(index, row.sequence)
      delbanners(row.sequence).then(res => {
        console.log(res)
        this.request()
      })
      console.log(index, row)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleRemove(file) {
      console.log(file)
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible1 = true
    },
    change1(file, fileList) {
      this.ruleForm1.file = file.raw
      console.log(this.ruleForm1.file)
    },
    submitForm1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var formData = new FormData()
          formData.append('files', this.ruleForm1.file)
          formData.append('sequence', this.ruleForm1.sequence)
          console.log(formData)
          createbanners(formData).then(res => {
            // console.log(res.errCode)
            if (res.code === 0) {
              this.request()
              this.$refs[formName].resetFields()
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '轮播图创建成功'
              })
            } else {
              // alert('管理员:'+this.ruleForm1.name+'创建失败')
            }
            console.log(res)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm1(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
  .div {
    min-width: 1000px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .disabled .el-upload--picture-card {
    display: none;
  }
</style>
