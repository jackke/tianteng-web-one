<template>
    <div class="commonTitle">
        <div class="titleContent">
            <div class="date">
                <div>{{ BjTime }}</div>
            </div>
            <div class="middle">
                <div class="titleText"><h2>“天腾”气象影视数据产品生产系统</h2></div>
                <!-- 左侧导航 -->
                <div class="leftNav" v-show="token">
                    <div v-for="(item, index) in leftNavList" :key="index">
                        <div class="navTextStyle" :class="item.id == checkedId? 'leftChecked': 'leftNormal'" @click="goPage(item, index)">{{ item.name }}</div>
                    </div>
                </div>
                <!-- 右侧导航 -->
                <div class="rightNav" v-show="token">
                    <div v-for="(item, index) in rightNavList" :key="index">
                        <div class="navTextStyle" :class="item.id == checkedId? 'rightChecked': 'rightNormal'" @click="goPage(item, index)">{{ item.name }}</div>
                    </div>
                </div>
            </div>
            <div class="user">
                <img src="@/assets/image/userImg.png" alt="">
                <el-button type="text" style="font-size: 18px;color: #00D3EF;" v-show="loginShow" @click="login">登录</el-button>
                <el-dropdown trigger="click"  @command="handleCommand" v-show="!loginShow">
                    <span class="el-dropdown-link">
                        {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" style="text-align: center;">
                        <el-dropdown-item command="mod">修改密码</el-dropdown-item>
                        <el-dropdown-item command="out">退 出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="原密码：" prop="oldPass">
                    <el-input v-model="ruleForm.oldPass" placeholder="请输入原密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newPass">
                    <el-input v-model="ruleForm.newPass" placeholder="请输入新密码" type="password">
                        <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
                    </el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="newPassRepeat">
                    <el-input v-model="ruleForm.newPassRepeat" placeholder="请输入确认密码" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center;">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="submitForm" :loading="dialogLoading">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'CommonTitle',
    props: {
        categoryName: String,
        categoryPage: String,
    },
    data() {
        return {
            token: sessionStorage.getItem('token'),
            loginShow: true,
            nowTime: '',
            BjTime: '',
            timer: null,
            userName: this.$store.state.userName,
            checkedId: 1,
            leftNavList: [
                // { name: '产品收发', url: 'productSendingAndReceiving', id: 1, position: 'left' },
                // { name: '算法调度', url: 'algorithmManagement', id: 2, position: 'left' },
            ],
            rightNavList: [
                // { name: '数据服务', url: 'meteorologicalDataSystem', id: 3, position: 'left' },
                // { name: '系统配置', url: 'index3', id: 4, position: 'left' },
            ],
            backHomeStatus: true,
            dialogVisible: false,
            dialogLoading: false,
            ruleForm:{
                oldPass:'',
                newPass:'',
                newPassRepeat:'',
            },
            rules:{
                oldPass: [
                    { required: true, message: '请输入原密码', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                newPassRepeat: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value !== this.ruleForm.newPass) {
                                return callback(new Error("输入的密码不一致，请重新输入"));
                            }
                            callback();
                        },
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        goPage(item, index) {
            console.log(item.url, 'algorithmManagement');
            this.checkedId = item.id;
            this.$router.push(`/${item.url}`)
        },
        getLocalTime() {
            // 北京时间
            this.BjTime = new Date().toLocaleTimeString()

            //时间计算
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                // 北京时间
                this.BjTime = new Date().toLocaleTimeString()
            }, 1000)

        },
     
        handleClose(){
            this.dialogVisible = false
            this.$refs['ruleForm'].resetFields()
        },
        submitForm(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.dialogLoading = true
                    let data = {...this.ruleForm}
                    data.id = this.$store.state.userId
                    this.$http.post(`/user/mypwd/mod`, data).then(res => {
                        this.dialogLoading = false
                        if (res.code == 200){
                            this.handleClose()
                            this.$message({ message: '修改成功', type: 'success' })
                        } else {
                            this.$message.error(res.message)
                        }
                    }).catch((error) => {
                        this.dialogLoading = false
                        this.$message.error(error)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleCommand(value){
            if (value == 'mod'){
                this.dialogVisible = true
            }
            if (value == 'out'){
                // sessionStorage.clear()
                // localStorage.clear()
                // this.$router.push('/login')
                this.$http.post(`/user/exit`, {account: this.$store.state.userAccount}).then(res => {
                    if(res.code == 200) {
                        this.$router.push('/login')
                        sessionStorage.clear()
                        localStorage.clear()
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }
        },
        login(){
            this.$router.replace('/login')
        }
    },
    created(){
    //    let path = this.$route.path
    //    if (path == '/meteorologicalDataSystem') {
    //         this.checkedId = 3
    //    }
       if (sessionStorage.getItem('userName')) {
            this.loginShow = false
       }
    },
    mounted() {
        this.getLocalTime()
    },
}
</script>
<style lang="scss">


.commonTitle {
    height: 100%;
    .titleContent {
        height: 90%;
        background-image: url('@/assets/image/commonTitle/heder-bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: space-between;
        position: relative;
        .date {
            position: absolute;
            left: 40px;
            top: 40px;
            color: #00D3EF;
            font-size: 26px;
        }
        .user{
            position: absolute;
            right: 40px;
            top: 40px;
            color: #FFFFFF;
            font-size: 26px;
            display: flex;
            // justify-content: center;
            align-items: center;
            img{
                width: 34px;
                margin-right: 8px;
            }
            .el-dropdown{
                color: #FFFFFF;
            }
        }
        .middle{
            margin: 0 auto;
            display: flex;
            justify-content: center;
            position: relative;
        }
        .titleText {
            // width: 500px;
            text-align: center;
            // font-size: 31px;
            font-weight: bold;
            // color: #FFFFFF;
            background: linear-gradient(0deg, #00F6FF 20%, #FFFFFF 60%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            padding-top: 12px;
            padding-right: 25px;
        }
        .navTextStyle {
            width: 200px;
            text-align: center;
            font-size: 16px;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 35px;
            text-shadow: 2px 2px 2px rgba(0,0,0,0.49);
        }
        /* 左侧导航 */
        .leftNav {
            display: flex;
            justify-content: right;
            position: absolute;
            top: 38px;
            left: -440px;
            height: 35px;
            .leftNormal{
                height: 35px;
                background-image: url('@/assets/image/commonTitle/left-menu.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                text-align: center;
            }
            .leftChecked{
                height: 35px;
                background-image: url('@/assets/image/commonTitle/action-left-menu.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                font-weight: bold;
                color: #F4AC00;
            }
            &:hover {
                cursor: pointer;
            }
        }
        /* 右侧导航 */
        .rightNav {
            display: flex;
            justify-content: left;
            position: absolute;
            top: 38px;
            right: -420px;
            height: 35px;
            .rightNormal {
                height: 35px;
                background-image: url('@/assets/image/commonTitle/right-menu.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            .rightChecked {
                height: 35px;
                background-image: url('../assets/image/commonTitle/action-right-menu.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                font-weight: bold;
                color: #F4AC00;
            }
            &:hover {
                cursor: pointer;
            }
        }
    }
}
</style>