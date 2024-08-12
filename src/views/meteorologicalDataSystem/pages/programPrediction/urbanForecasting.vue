<!-- 总表数据 -->
<template>
    <div class="urbanForecasting">
        <el-form class="element-input" :inline="true" ref="params" :model="params" size="medium">
            <el-form-item label="数据类型：">
                <el-select v-model="params.type" placeholder="请选择数据类型" value-key="id" @change="typeChange" popper-class="mars-select">
                    <el-option v-for="(item) in typeOption" :key="item.id" :label="item.typeName" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时次：">
                <el-select v-model="params.time" placeholder="请选择时间类型" popper-class="mars-select">
                    <!-- <el-option label="全部"  :value="timeOptions.map(item => item).join(',')"></el-option> -->
                    <el-option v-for="(item, index) in timeOptions" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时效：">
                <el-select v-model="params.allItem" multiple placeholder="请选择时效" popper-class="mars-select">
                    <el-option v-for="(item, index) in reportTime" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-button icon="el-icon-search" type="primary" @click="initData">查询</el-button>
                <el-button icon="el-icon-printer" type="warning" @click="dialogVisible = true">打印</el-button>
            </el-form-item>
        </el-form>
       <div style="flex: 1;display: flex; flex-direction: column;">
            <div class="title-text">
                <div v-for="(item, index) in titleList" :key="index"> 
                    <div style="width: 120px;">{{item.title}}：</div> <p style="flex: 1;">{{ item.value}}</p>
                </div>
            </div>
            <el-table class="element-table" :data="tableData" height="100%" style="width: 100%;" :header-cell-style="tableHeaderStyle">
                <el-table-column type="index" label="序号" width="55" fixed></el-table-column>
                <el-table-column prop="siteId" label="站点编号"> </el-table-column>
                <el-table-column v-for="(item, index) in Object.keys(tableDatakey)" :key="index" :prop="item" :label="tableDatakey[item]">
                </el-table-column>
            </el-table>
            <ComPagination style="margin-top: 20px;" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></ComPagination>
       </div>
       <el-dialog :visible.sync="dialogVisible" width="100%" top="0%" :fullscreen="true" :show-close="false" :close-on-click-modal="false" :modal-append-to-body="true" :append-to-body="true">
            <div style="display: flex; flex-direction: column; width: 100%;height: 100vh;">
                <div id="tablePrint" style="flex: 1;">
                    <div class="title-text">
                        <div v-for="(item, index) in titleList" :key="index"> 
                            <div style="width: 120px;">{{item.title}}：</div> <p style="flex: 1;">{{ item.value}}</p>
                        </div>
                    </div>
                    <el-table class="element-table" :data="tableData">
                        <el-table-column type="index" label="序号" width="55"  v-if="tableDatakey.ele1" fixed></el-table-column>
                        <el-table-column v-for="(item, index) in Object.keys(tableDatakey)" :key="index" :prop="item" :label="tableDatakey[item]"></el-table-column>
                    </el-table>
                </div>
                <div style="text-align: center;margin-top: 20px;">
                    <el-button  size="medium" @click="handleClose">取 消</el-button>
                    <el-button  size="medium" type="primary" @click="tablePrint">打 印</el-button>
                </div>
            </div>    
       </el-dialog>
    </div>
</template>
<script>
import ComPagination from '@/components/comPagination.vue'
import $ from 'jquery'

export default {
    name: 'urbanForecasting',
    components: {ComPagination},
    data() {
        return {
            params:{
                pageNum: 1,
                pageSize: 10,
                allItem: [],
                time: '',
                type: '',
                typeId: '',
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
            titleList: [],
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
                    this.tableData = res.data.page.records || []
                    this.total = res.data.page.total || 0
                    this.titleList = res.data.processData || []
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
            this.params.typeId = value.id
            this.$http.get(`${this.$api.server}/town/type/info/${value.id}`).then(res => {
                if(res.code == 200) {
                    this.tableDatakey = res.data.eleName || {}
                    // this.tableShow = false
                    // setTimeout(() => {
                    //     this.tableShow = true
                    // },500)
                } else {
                    this.$message.error(res.message)
                }
            })
            this.tableData = []
            this.params.tiem = ''
            this.params.allItem = []
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
            // $('#tablePrint').print()
            window.print()
            // let style = '@page {}  @media print {.el-table__cell {text-align: left;padding:10px 0} .el-table .el-table__header tr th{padding-left:10px}'
        },
        tableHeaderStyle(row, rowIndex){
            // let column = row.column
            // console.log(row, rowIndex);
            let widthStyle = row.column.label.length * 25
            return {width: widthStyle + 'px', textAlign: 'center'}
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
    overflow-y: auto;
    box-sizing: border-box;
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
    // /deep/ .el-table__header .is-leaf.el-table__cell .cell{
        
    //     // white-space: nowrap;
    //     // text-overflow: clip;
    // }
    .dialog-print{
        position: fixed;
        z-index: 99;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding: 30px;
    }
}

</style>