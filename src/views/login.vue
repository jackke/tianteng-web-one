<template>
    <div class="login-box">
        <div class="nav">
            <!-- <canvas class="background" id="snowCanvas" style="width: 100vw;height: 100vh;"></canvas> -->
            <!-- <div style="height: 65%"> </div>
            <div style="height: 35%;" class="reflection"> </div>
            <svg><filter id="fractal" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%"><feTurbulence id="turbulence" type="fractalNoise" baseFrequency="0.005 0.005" numOctaves="10"><animate attributeName="baseFrequency" dur="30s" values="0.005 0.005;0.05 0.3;0.005 0.005" repeatCount="indefinite"></animate></feTurbulence><feDisplacementMap in="SourceGraphic" scale="15"></feDisplacementMap></filter></svg> -->
        </div>
        <div class="text">
            <h1>气象影视数据服务系统</h1>
        </div>
        <div class="form-login">
            <div style="text-align: center;">
                <span class="title">Login</span>
            </div>
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item  prop="username" class="username">
                    <div class="input-box">
                        <input type="account" v-model="form.username" required>
                        <label>Account</label>
                    </div>
                </el-form-item>
                <el-form-item  prop="password" class="password">
                    <div class="input-box">
                        <input type="password" v-model="form.password" required @keydown.enter="onSubmit">
                        <label>Password</label>
                    </div>
                </el-form-item>
                <!-- <div class="remember-forgot">
                    <label><input type="checkbox">记住我</label>
                </div> -->
                <el-form-item class="login-button">
                    <el-button  @click="onSubmit" :loading="loading">登 录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

import "../utils/vendors.js"
import demo5 from "../utils/demo5.js"
import $ from 'jquery'
// import Particles from "@/assets/js/particles.js"
    export default {
      name: 'login',
      data() {
        return {
            loading:false,
            form:{
                username: "",
                password: "",
                API: 0,
            },
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
            }
        }
      },
      beforeDestroy(){
        console.log("销毁 login");
        // 销毁 dom 元素，防止性能损耗
        if ($('body > canvas')[0]){
            $('body > canvas')[0].remove();
        }
      },
      created(){},
      mounted(){
        demo5()
      },
      methods: {
        onSubmit(){
            // this.$router.replace({path:'/meteorologicalDataSystem'})
            // return false
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.loading = true
                    let data = {
                        account: this.form.username,
                        // password: (CryptoJS.MD5(this.form.password).toString()).toUpperCase()
                        password: this.form.password
                    }
                    this.$http.post(`${this.$api.server}/user/login`, data).then(res => {
                        this.loading = false
                        if (res.code == 200){
                            let menuList = res.data.menuList
                            this.$store.commit('setToken', res.data.token)
                            this.$store.commit('setUser', {id: res.data.id, username: res.data.name, account: res.data.account})
                            menuList.forEach(item => {
                                if (item.menuEnum == 'data_service_p' && item.name == '数据服务子系统'){
                                    item.path = 'meteorologicalDataSystem'
                                    this.$router.replace({path:'/meteorologicalDataSystem'})
                                    return false
                                }
                         
                            });
                            this.$store.commit('setMenu', menuList)
                        } else {
                            this.$message.error(res.message)
                        }
                    }).catch((error) => {
                        this.loading = false
                        this.$message.error(error)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
}
</script>
<!-- <style src="../style/login.css"> </style> -->
<style scoped lang="scss">
// $--color: #efd28e;
$--color: rgba(#00F0FF, 0.6);
.login-box{
    width: 100%;
    height: 100%;
    /* background-image: url('@/assets/login/xingkong.jpeg'); */
    .text{
        width: 100%;
        text-align: center;
        position:absolute;
        z-index: 9;
        top: 10%;
        left: 0;
        font-size: 2vw;
        color: #00F0FF;
    }
    /deep/ .el-input__inner{
        padding-left: 65px;
    }
    .username .text{
        clear: both;
        width: 80px;
        top:0;
        z-index: 10;
        color: #1e1f26;
        font-size: 15px;
    }
    .password .text{
        clear: both;
        width: 80px;
        top:0;
        z-index: 10;
        color: #1e1f26;
        font-size: 15px;
    }
}

.title{
    display: inline-block;
    padding: 10px 0;
    font-size: 30px;
    // margin-bottom: 20px;
    color: $--color;
}
.form-login{
    width: 22%;
    margin: 20% auto;
    padding: 10px 50px;
    backdrop-filter: blur(3px);
    background: rgba(#FFF, .3);
   /**  background-image: linear-gradient(to top right, rgba(#5a95cf80, 1), rgba(#3a4c63cc, 1)); **/
    border-bottom: 1px solid #fff6;
    border-left: 1px solid #fff6;
    border-radius: 20px;
    box-shadow: 10px -10px 20px #0003, -10px 10px 20px #ffffff1a;
    font-family: "Poppins", sans-serif;
    color: $--color;
    .input-box {
        position: relative;
        width: auto;
        // margin: 30px 0;
        border-bottom: 2px solid $--color;
        margin-top: 20px;
        label {
            position: absolute;
            top: 50%;
            left: 5px;
            transform: translateY(-50%);
            font-weight: 300;
            font-size: 1rem;
            pointer-events: none;
            transition: .5s;
        }
        input:focus~label,
        input:valid~label{
            top: -5px;
        }
        input {
            width: 100%;
            height: 40px;
            background: transparent;
            border: none;
            outline: none;
            color: #fff;
            // font-size: 1rem;
            padding: 0 35px 0 5px;
        }
        .icon {
            position: absolute;
            right: 8px;
            font-size: 1.2rem;
            line-height: 57px;
        }

    }
    .remember-forgot {
        margin: -15px 0 15px;
        font-size: 12px;
        color: $--color;
        display: flex;
        justify-content: space-between;
        label{
            display: flex;
            align-items: center;
        }
        label input {
            margin-right: 3px ;
        }
    }
  
}
.login-button{
    text-align: center;
}
.el-form-item__content > button{
    height: 40px;
    width: 100%;
    background-color: $--color;
    border-color: $--color;
    color: #000;
    margin-top: 20px;

}

// .nav{
//     position: fixed;
//     width: 100%;
//     height: 100%;
//     z-index: 1;
//     background: url(../assets/image/login-bg.jpeg);
//     background-size: cover;
//     >div{
//         width: 100%;
//     }
//     .reflection{
//         filter: url(#fractal);
//         background: url(../assets/image/login-bg.jpeg);
//         background-size: cover;
//         background-repeat: no-repeat;
//         background-position-y: 92%;
//     }
// }
</style>