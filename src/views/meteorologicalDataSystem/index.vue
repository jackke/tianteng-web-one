<template>
    <div class="meteorologicalDataSystem">
            <!-- 左侧选择框 -->
            <div class="menu-list">
                <el-menu
                    :default-active="actionIndex"
                    :default-openeds="defaultOpeneds"
                    class="el-menu-vertical-demo"
                    >
                    <el-submenu :index="`${index}`" v-for="(item, index) in transData" :key="index">
                        <template slot="title">
                            <i class="el-icon-caret-right"></i>
                            <span>{{ item.name }}</span>
                        </template>
                        <el-menu-item :class="actionIndex == menu.id ? 'is-current' : ''" :index="menu.index" v-for="(menu, key) in item.children" :key="key" @click="goPath(menu, index)"> <span></span>{{ menu.name }}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
            <!-- <div class="menu-list">
                <el-tree class="menu-tree" :data="transData" node-key="id" :default-expanded-keys="defaultExpandedKeys" :default-checked-keys="defaultCheckedKeys" @node-click="handleNodeClick"></el-tree>
            </div> -->
            <!-- 右侧 -->
            <div class="content-right">
                <div class="content-right-box" >
                    <component v-bind:is="componentName"></component>
                </div>
            </div>
    </div>
</template>
<script>
// 城市预报
import UrbanForecasting from './pages/programPrediction/urbanForecasting.vue'
import ProgramPrediction from './pages/programPrediction/programPrediction.vue'
// 用户管理
import UserManage from './pages/userManage/userManage.vue'
// 节目管理
import ChannelManage from './pages/programManagement/channelManage.vue'
import columnManage from './pages/programManagement/columnManage.vue'
import ChanneAllocation from './pages/programManagement/channeAllocation.vue'
// 内容管理
import SiteManage from './pages/contentManage/siteManage.vue'
import ColumnConfiguration from './pages/contentManage/columnConfiguration.vue'
import DataTypeManage from './pages/contentManage/dataTypeManage.vue'
import UserMenu from './pages/contentManage/userMenu.vue'


export default {
    name: 'meteorologicalDataSystem',
    components: {
        UrbanForecasting,
        ProgramPrediction, 
        UserManage, 
        ChannelManage, 
        columnManage, 
        ChanneAllocation, 
        SiteManage,
        ColumnConfiguration,
        DataTypeManage,
        UserMenu,
    },
    data() {
        return {
            componentName: sessionStorage.getItem('component') || 'programPrediction',
            actionIndex: sessionStorage.getItem('menuId') || '1',
            defaultOpeneds: ['0'],
            typeList: [
                { 
                    name: '城市预报',
                    show: true,
                    sort:1,
                    module: "town_forecast_p", 
                    children:[
                        {name: '城市预报', id: '1',  page: 'programPrediction',},
                        {name: '总表数据', id: '2',  page: 'urbanForecasting',},
                    ]
                },
            ],
            transData: [],
            listChildren:{
                height:0,
            }
        }
    },
    beforeDestroy(){
        sessionStorage.setItem('component', '')
        sessionStorage.setItem('menuIndex', '')
        console.log('数据服务， 已销毁。   beforeDestroy');
    },
    created(){
        this.defaultOpeneds = sessionStorage.getItem('menuIndex') ? [sessionStorage.getItem('menuIndex')] : ['0'];
        // this.transData = Menu[2].children
        this.initMenu()
    },
    methods: {
        // 渲染权限列表
        initMenu(){
           let list = []
            if (sessionStorage.getItem('userId') && JSON.parse(sessionStorage.getItem('menuList')).length !== 0){
                let childList = []
                let menuList = JSON.parse(sessionStorage.getItem('menuList'))
                menuList.forEach(item => {
                    if (item.name == '数据服务子系统') {
                        childList = item.child
                    }
                })
                childList.forEach(item => {
                    item.children = item.child.sort((a,b) => a.sort - b.sort)
                })
                this.transData = childList.sort((a,b) => a.sort - b.sort)
            } else {
                // 未登录的时候， 显示的页面
                this.transData = this.typeList
            }
        },
        menulistClick(index){
            this.typeList[index].checked = !this.typeList[index].checked
        },
        goPath(menu, index){
            sessionStorage.setItem('menuIndex', index)
            sessionStorage.setItem('menuId', menu.id)
            this.actionIndex = `${menu.id}`;
            this.defaultOpeneds = [`${index}`]
            sessionStorage.setItem('component', menu.page)
            this.componentName = menu.page
        },
    }
}
</script>
<style lang="scss" scoped>
$_color: #00E4FF;
.meteorologicalDataSystem{
    width: 100%;
    height: 100%;
    display: flex;
    .content-right{
        background-image: url(@/assets/image/manage-bg.png);
        background-size: 100% 100%;
        margin-left: 20px;
        text-align: left;
        box-sizing: border-box;
        width: 80%;
        flex: 1;
        .content-right-box{
            margin: 20px;
            height: 95%;
        }
    }
    // menu
    .menu-list{
        width: 16%;
        text-align: left;
        background-color: rgba(#0B192E, .5);
        border: 1px solid rgba(0, 241, 251, 0.3);
        font-size: 14px;
        overflow: hidden;
        overflow-y: auto;
        /deep/ .el-menu{
            background-color: transparent;
            border: 0;
        }

        /deep/ .el-menu .el-submenu__title:hover{
            background: rgba($_color, .1);
        }
        /deep/ .el-menu .el-submenu__title i{
            color: rgba($_color, .8) !important;
        }
        /deep/ .el-menu .el-submenu__title{
            background: rgba($_color, .1);
            border-top: 1px solid rgba($_color, .5);
        }
        /deep/ .el-menu .el-submenu__title span{
            color: #FFFFFF;
            text-shadow: 0px 8px 10px rgba(14,23,47,0.56);
            background: linear-gradient(180deg, #FFFFFF 0.537109375%, #89EBF4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        /deep/ .el-menu .el-menu-item{
            color: #FFFFFF;
            border-bottom: 1px solid #3E899D;
            display: flex;
            align-items: center;
            background-color: transparent;
            position: relative;
            ::after{
                transition: all .3s;
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 100%;
                background-image: url(@/assets/image/menu-bg.png);
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }
        }
        /deep/ .el-menu .el-menu-item span{
           width: 6px;
           height: 6px;
           background-color: #6D7484;
           margin: 0 15px 0 15px;
        }
        /deep/ .el-menu .el-menu-item:hover{
            background-color: transparent;
        }
        /deep/ .el-menu-item.is-current{
                color: $_color;
                // background-image: url(@/assets/image/menu-bg.png);
                // background-size: 100% 100%;
                span{
                    background-color: rgba($_color, .8);
                }
                ::after{
                    width: 100%;
                }
        }
        /deep/ .el-menu .el-submenu__title{
            height: 55px;
            line-height: 55px;
        }
        /deep/ .el-menu .el-submenu__icon-arrow{
            -webkit-text-fill-color: transparent;
        }
       
    }
}





</style>