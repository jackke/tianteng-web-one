<!-- 总表数据 -->
<template>
    <div class="urbanForecasting">
        <el-form class="element-input" :inline="true" ref="params" :model="params" label-width="100px" size="medium">
            <el-form-item label="数据类型：">
                <el-select v-model="params.type" placeholder="请选择数据类型" @change="typeChange" popper-class="mars-select">
                    <el-option v-for="(item, index) in typeOption" :key="index" :label="item.typeName" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间类型：">
                <el-select v-model="params.time" placeholder="请选择时间类型" popper-class="mars-select">
                    <el-option label="全部"  :value="timeOptions.map(item => item).join(',')"></el-option>
                    <el-option v-for="(item, index) in timeOptions" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时效：">
                <el-select v-model="params.allItem" placeholder="请选择时效" popper-class="mars-select">
                    <el-option label="全部" :value="reportTime.map(item => item)"></el-option>
                    <el-option v-for="(item, index) in reportTime" :key="index" :label="item" :value="[item]"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-button icon="el-icon-search" type="primary" @click="initData">查询</el-button>
                <el-button icon="el-icon-printer" type="warning" @click="dialogVisible = true">打印</el-button>
            </el-form-item>
        </el-form>
       <div class="title-text">
            <div> 
                <div>时间：</div> <p>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；/n 与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；/n 与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；/n 与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；/n 与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；/n 与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念</p>
            </div>
            <div> 
                <div>数据：</div> <p></p>
            </div>
            <!-- <el-collapse v-model="activeNames" class="element-collapse">
                <el-collapse-item title="时间：" name="1">
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
                <el-collapse-item title="数据：" name="2">
                    <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                    <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                </el-collapse-item>
            </el-collapse> -->
       </div>
       <div style="flex: 1;display: flex; flex-direction: column;">
            <el-table class="element-table"  :data="tableData" height="600" style="width: 100%">
                <el-table-column type="index" label="顺序" width="55" v-if="tableDatakey.ele1" fixed></el-table-column>
                <el-table-column v-for="(item, index) in Object.keys(tableDatakey)" :key="index" :prop="item" :label="tableDatakey[item]"></el-table-column>
            </el-table>
       </div>
       <ComPagination style="margin-top: 20px;" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></ComPagination>
       <div class="el-dialog dialog-print" v-show="dialogVisible">
            <div id="tablePrint">
                <div class="title-text">
                        <div> 
                            <div>时间：</div> <p>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；/n 与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；/n 与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；/n 与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；/n 与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；/n 与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念</p>
                        </div>
                        <div>
                            <div>数据：</div> <p></p>
                        </div>
                </div>
                <el-table class="element-table" height="600" :data="tableData" style="width: 100%">
                    <el-table-column type="index" label="顺序" width="55"  v-if="tableDatakey.ele1" fixed></el-table-column>
                    <el-table-column v-for="(item, index) in Object.keys(tableDatakey)" :key="index" :prop="item" :label="tableDatakey[item]"></el-table-column>
                </el-table>
            </div>
            <div style="text-align: center;margin-top: 20px;">
                <el-button  size="medium" @click="handleClose">取 消</el-button>
                <el-button  size="medium" type="primary" @click="tablePrint">打 印</el-button>
            </div>
       </div>
    </div>
</template>
<script>
import printJS from 'print-js'
import ComPagination from '@/components/comPagination.vue'

export default {
    name: 'urbanForecasting',
    components: {ComPagination},
    data() {
        return {
            params:{
                pageNum: 1,
                pageSize: 10,
                allItem: '',
                time: '',
                type: '',
            },
            activeNames:['1', '2'],
            dialogVisible: false,
            timeOptions:[],
            reportTime: [],
            tableShow: false,
            tableDatakey: {},
            tableData: [],
            total: 0,
            typeOption:[],
        }
    },
    created(){
        this.townTypeOption()
        // this.initData()
    },
    methods: {
        initData(){
            let params = {...this.params}
            params.reportTimeList = [...this.params.allItem]
            this.tableLoading = true
            this.$http.post(`${this.$api.server}/town/table/page`, params).then(res => {
                this.tableLoading = false
                if(res.code == 200) {
                    this.tableData = res.data.records || []
                    this.total = res.data.total || 0
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        townTypeOption(){
            let params = {
                "pageNum": 1,
                "pageSize": 99,
                "typeName": ""
            }
            this.$http.post(`${this.$api.server}/town/type/page`, params).then(res => {
                if(res.code == 200) {
                    this.typeOption = res.data.records || []
                    // this.reportTime = JSON.parse(res.data.reportTime)
                    // this.timeOptions = JSON.parse(res.data.time)
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        typeChange(value){
            let list = this.typeOption.filter(item => item.id == value.id)
            this.reportTime = list[0].reportTime ?  list[0].reportTime.split(',') : []
            this.timeOptions = list[0].time ? list[0].time.split(',') : []
            this.params.type = value.typeName
            this.$http.get(`${this.$api.server}/town/type/info/${value.id}`).then(res => {
                if(res.code == 200) {
                    this.tableDatakey = res.data.eleName || {}
                } else {
                    this.$message.error(res.message)
                }
            })

        },
        handleCurrentChange(page){
            this.params.pageNum = page
            this.initData()
        },
        handleSizeChange(size){
            this.params.pageSize = size
            this.initData()
        },
        handleClose(){
            this.dialogVisible = false
        },
        // 打印 
        tablePrint(){
            // this.dialogVisible = true;
            // return false
            window.print()
            // let style = '@page {}  @media print {.el-table__cell {text-align: left;padding:10px 0} .el-table .el-table__header tr th{padding-left:10px}'
            // printJS({
            //     printable: 'tablePrint',
            //     type: 'html',
            //     // style
            //     // ignoreElements: 'elementButton'
            //     // gridHeaderStyle: 'border: 1px solid #000;text-align:center',
            //     // gridStyle: 'border: 1px solid #000;text-align:center'
            // })
        }
    }
}
</script>
<style lang="scss" scoped>
.urbanForecasting{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .element-button{
        padding: 20px;
        text-align: end;
    }
    .title-text >div{
        display: flex;
        padding: 10px 0;
        color: #fff;
        font-size: 16px;
        >div{
            width: 200px;
        }
        p{
            color: aqua;
            opacity: 0.8;
        }
    }
    .title-text >div:nth-child(1){
        border-bottom: 1px solid #6EA4B2;
    }
    .dialog-print{
        position: fixed;
        z-index: 99;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        padding: 30px;
    }
}

</style>