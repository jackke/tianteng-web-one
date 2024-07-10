<!-- 用户管理 -->
<template>
    <div class="userManage">
        <el-form class="element-input" :inline="true" ref="params" :model="params" label-width="100px" size="medium">
            <el-form-item label="工号ID：">
                <el-input v-model="params.cardId" placeholder="请输入工号ID" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户名称：">
                <el-input v-model="params.name" placeholder="请输入用户名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="角色：" >
                <el-select v-model="params.roleId" placeholder="请选择" popper-class="mars-select" style="width: 100px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="item.name" :value="item.roleId" v-for="(item, index) in roleOptions" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="params.state" placeholder="请选择" popper-class="mars-select" style="width: 100px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="禁用" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-button icon="el-icon-search" type="primary" @click="initData">查 询</el-button>
                <el-button icon="el-icon-plus" type="warning" @click="userAdd">添 加</el-button>
            </el-form-item>
        </el-form>

       <div style="flex: 1;display: flex; flex-direction: column;">
            <el-table id="tablePrint" class="element-table" height="100%" v-loading="tableLoading" :data="tableData" element-loading-text="努力加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(4,42,75, 0.5)">
                <el-table-column type="index" label="顺序" style="text-align: center;"> </el-table-column>
                <el-table-column prop="cardId" label="工号ID"> </el-table-column>
                <el-table-column prop="name" label="用户名称"> </el-table-column>
                <el-table-column prop="roleId" label="角色" :formatter="roleIdFn"></el-table-column>
                <el-table-column prop="sex" label="性别">
                    <template slot-scope="scope">
                        {{ ['', '男', '女'][scope.row.sex] }}
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号"> </el-table-column>
                <el-table-column prop="email" label="邮箱"> </el-table-column>
                <el-table-column prop="state" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state == 1" style="color: #23D26D;">已启用</span>
                        <span type="text" v-if="scope.row.state == 2" style="color: #F95555">已禁用</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="280">
                    <template slot-scope="scope">
                        <el-button size="medium"  type="primary" @click="userInfo(scope.row)">重置密码</el-button>
                        <!-- <el-button size="medium"  type="success" @click="userEnDis(scope.row, 1)" v-if="scope.row.state == 2">启用</el-button> -->
                        <!-- <el-button size="medium"  type="danger" @click="userEnDis(scope.row, 2)" v-if="scope.row.state == 1">禁用</el-button> -->
                        <el-button size="medium"  type="primary" @click="userEdit(scope.row)">编辑</el-button>
                        <el-button size="medium"  type="danger" @click="userDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <ComPagination style="margin-top: 20px;" @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="total"></ComPagination>
        </div>

        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="35%" top="5%" :before-close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false">
            <!-- <span>这是一段信息</span> -->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="element-input" size="medium">
                <el-form-item label="工号ID：" prop="cardId">
                    <el-input v-model="ruleForm.cardId" placeholder="请输入工号ID"></el-input>
                </el-form-item>
                <el-form-item label="账户：" prop="account">
                    <el-input v-model="ruleForm.account" placeholder="请输入账户"></el-input>
                </el-form-item>
                <el-form-item label="用户名称：" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入用户名称"></el-input>
                </el-form-item>
                <el-form-item label="用户角色：" prop="roleId">
                    <el-select v-model="ruleForm.roleId" placeholder="请选择角色" style="width: 100%;"  popper-class="mars-select">
                        <el-option :label="item.name" :value="item.roleId" v-for="(item, index) in roleOptions" :key="index"></el-option>
                    </el-select>
                </el-form-item>
              
                <el-form-item label="手机号：" prop="mobile">
                    <el-input v-model="ruleForm.mobile" placeholder="请输入用户名称"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="ruleForm.email" placeholder="请输入用户名称"></el-input>
                </el-form-item>
                <el-form-item label="是否是审核人员：" required>
                    <el-radio-group v-model="ruleForm.review">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="2">不是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="性别：" required>
                    <el-radio-group v-model="ruleForm.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="用户状态：" required>
                    <el-radio-group v-model="ruleForm.state">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="ruleForm.email" placeholder="备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="handleClose">取 消</el-button>
                <el-button size="medium"  type="primary" @click="submitForm" :loading="dialogLoading">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ComPagination from '@/components/comPagination.vue'

export default {
    name: 'urbanForecasting',
    components: {ComPagination},
    data() {
        return {
            params:{
                cardId: '',
                account: "",
                name: "",
                pageNum: 1,
                pageSize: 15,
                review: '',
                roleId: '',
                state: ''
            },
            submitType: 'add',
            tableLoading:false,
            roleOptions: [],
            dialogLoading: false,
            ruleForm:{
                cardId: "",
                account: "",
                name: "",
                mobile: '',
                email: '',
                review: 1,
                roleId: '',
                sex: 1,
                state: 1
            },
            rules:{
                cardId: [
                    { required: true, message: '请输入工号 ID', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                ],
                roleId: [
                    { required: true, message: '请选择角色', trigger: 'change' },
                ],
            },
            dialogVisible: false,
            total:0,
            tableData: [],
        }
    },
    created(){
        this.initData()
        this.initType()
    },
    mounted(){
       
    },
    methods: {
        userAdd(){
            this.submitType = 'add'
            this.dialogVisible = true
        },
        initType(){
            this.$http.get(`${this.$api.server}/user/list`).then(res => {
                    if(res.code == 200) {
                       this.roleOptions = res.data || []
                    } else {
                        this.$message.error(res.message)
                    }
                })
        },
        initData(){
            this.tableLoading = true
            this.$http.post(`${this.$api.server}/user/page`, this.params).then(res => {
                this.tableLoading = false
                    if(res.code == 200) {
                        this.tableData = res.data.records || []
                        this.total = res.data.total || 0
                    } else {
                        this.$message.error(res.message)
                    }
                })
        },
        userEdit(row){
            this.dialogVisible = true
            this.submitType = 'edit'
            this.ruleForm = {...row}
            this.ruleForm.sex = this.ruleForm.sex || 1
            this.ruleForm.review = this.ruleForm.review || 1
            this.ruleForm.state = this.ruleForm.state || 1
        },
        userEnDis(row, value){
            let title = value == 1 ? '启用' : '禁用'
            this.$confirm(`是否确认${title}该用户？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    id: row.id,
                    state: value
                }
                this.$http.post(`${this.$api.server}/user/mod`, data).then(res => {
                    if(res.code == 200) {
                        this.initData()
                        this.$message({ message: `${title}成功`, type: 'success' })
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }).catch(err => {})
        },
        userInfo(row){
            this.$confirm('是否确认该用户重置密码？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    id: row.id,
                    password: '000000',
                }
                this.$http.post(`${this.$api.server}/user/mod`, data).then(res => {
                    if(res.code == 200) {
                        this.$message({ message: '重置密码成功', type: 'success' })
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }).catch(err => {})
        },
        userDelete(row){
            this.$confirm('确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(`${this.$api.server}/user/del?id=${row.id}`).then(res => {
                    if(res.code == 200) {
                        this.initData()
                        this.$message({  message: '删除成功',  type: 'success' })
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }).catch(err => {})
        },
        submitForm(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.dialogLoading = true
                    if(this.submitType == 'add'){
                        this.ruleForm.password = '000000'
                        this.$http.post(`${this.$api.server}/user/save`, this.ruleForm).then(res => {
                            this.dialogLoading = false
                            if (res.code == 200){
                                this.handleClose()
                                this.$alert('用户初始密码为6个连续的数字 0', '创建成功', {
                                    confirmButtonText: '确定',
                                    type: 'success',
                                    center: true,
                                    callback: action => {
                                        this.initData()
                                    }
                                });
                            } else {
                                this.$message.error(res.message)
                            }
                        }).catch((error) => {
                            this.dialogLoading = false
                            this.$message.error(error)
                        })
                    }
                    if(this.submitType == 'edit'){
                        this.$http.post(`${this.$api.server}/user/mod`, this.ruleForm).then(res => {
                            this.dialogLoading = false
                            if (res.code == 200){
                                this.handleClose()
                                this.initData()
                                this.$message({ message: '用户编辑成功', type: 'success' })
                            } else {
                                this.$message.error(res.message)
                            }
                        }).catch((error) => {
                            this.dialogLoading = false
                            this.$message.error(error)
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(){

        },
        handleClose(){
            this.dialogVisible = false
        },
        handleCurrentChange(num){
            this.params.pageNum = num
            this.initData()
        },
        handleSizeChange(size){
            this.params.pageSize = size;
            this.initData()
        },
        roleIdFn(row, el, value){
            if (value){
                return this.roleOptions.find(item => item.roleId == value).name
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.userManage{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .title-text >div{
        display: flex;
        padding: 10px 0;
        color: #fff;
        font-size: 16px;
        border-bottom: 1px solid #6EA4B2;
        >div{
            width: 200px;
        }
        p{
            color: aqua;
            opacity: 0.8;
        }
    }
    .title-text >div:nth-last-child(1){
        border-bottom: 0;
    }
}

</style>