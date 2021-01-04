<template>
  <div class="app-container" style="width:100%;min-width:1500px">
    <h2 style="margin-left:14%">个人中心</h2>
    <el-container style="border: 1px solid #eee">
      <el-aside width="40%">
        <el-card style="margin:20px" class="box-card">
          <div slot="header" class="el-dialog--center">
            <span>管理员个人信息</span>
          </div>
          <div style="padding-top:20px">
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content bg-purple">管理员ID</div>
              </el-col>
              <el-col :span="17" :offset="1">
                <div style="text-align:right" class="grid-content bg-purple">{{ resultsMap.id }}</div>
              </el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content bg-purple">管理员用户名</div>
              </el-col>
              <el-col :span="17" :offset="1">
                <div style="text-align:right" class="grid-content bg-purple">{{ resultsMap.name }}</div>
              </el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content bg-purple">管理员姓名</div>
              </el-col>
              <el-col :span="17" :offset="1">
                <div style="text-align:right" class="grid-content bg-purple">{{ resultsMap.realName }}</div>
              </el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content bg-purple">管理员状态</div>
              </el-col>
              <el-col :span="17" :offset="1">
                <div style="text-align:right" class="grid-content bg-purple">
                  <el-switch
                    v-model="values"
                    :disabled="disabled"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="正常"
                    inactive-text="禁用"
                    :on-value="1"
                    :off-value="0"
                  />
                </div>
              </el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content bg-purple">创建时间</div>
              </el-col>
              <el-col :span="17" :offset="1">
                <div style="text-align:right" class="grid-content bg-purple">{{ formatDate(resultsMap.createTime) }}</div>
              </el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content bg-purple">更新时间</div>
              </el-col>
              <el-col :span="17" :offset="1">
                <div style="text-align:right" class="grid-content bg-purple">{{ formatDate(resultsMap.updateTime) }}</div>
              </el-col>
            </el-row>
            <el-divider />
          </div>
        </el-card>
      </el-aside>
      <el-container>
        <el-main>
          <el-card class="box-card">
            <div slot="header" class="el-dialog--center">
              <span>修改</span>
            </div>
            <template>
              <el-form
                ref="ruleForm"
                :model="ruleForm"
                status-icon
                :rules="rules"
                label-width="90px"
                class="demo-ruleForm"
              >
                <el-form-item label="旧密码" prop="oldpassword" :rules="[{ required: true, message: '旧密码不能为空'}]">
                  <el-input v-model="ruleForm.oldpassword" placeholder="请输入正在使用的密码" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                  <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                  <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="管理员姓名" prop="realname">
                  <el-input v-model="ruleForm.realname" type="text" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { profile, modification } from '@/api/personal'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.ruleForm.checkPass !== '') {
        this.$refs.ruleForm.validateField('checkPass')
      }
      callback()
    }
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      CreateTime: '',
      disabled: true,
      loading: true,
      resultsMap: {},
      values: null,
      ruleForm: {
        pass: '',
        checkPass: '',
        oldpassword: '',
        realname: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    // console.log(this.CreateTime)
  },
  methods: {
    getList() {
      // this.loading = true;
      profile().then(res => {
        this.resultsMap = res.data
        console.log(this.CreateTime)
        this.resultsMap.status === 1
          ? (this.values = true)
          : (this.values = false)
          // this.loading = false;
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            realName: this.ruleForm.realname,
            oldPassword: this.ruleForm.oldpassword,
            newPassword: this.ruleForm.pass
          }
          modification(data).then(res => {
            this.$notify({
              title: '成功',
              message: res.msg,
              type: 'success'
            })
            this.loading = true
            this.getList()
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    formatDate(value) {
      if (value === null) {
        return
      } else {
        const date = new Date(parseInt(value) * 1000)
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

