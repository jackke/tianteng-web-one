<!-- 城市预报 -->
<template>
    <div class="programPrediction">
        <el-form class="element-input" :inline="true" ref="params" :model="params" :rules="rules" label-width="60px" :hide-required-asterisk="true" size="medium">
            <el-form-item label="频道：" >
                <el-autocomplete
                        v-model="params.channelName"
                        :fetch-suggestions="channelQuerySearch"
                        placeholder="请选择频道"
                        popper-class="mars-autocomplete"
                        @change="channelChange"
                        :hide-loading="true"
                        @select="channerlSelect">
                        <template slot-scope="{ item }">
                            <div>{{ item.name }}</div>
                        </template>
                    </el-autocomplete>
            </el-form-item>
            <el-form-item label="栏目：" prop="columnId">
                <el-select :disabled="!params.channelName" v-model="columnId" value-key="id" placeholder="请选择栏目" @change="columnChange" popper-class="mars-select">
                    <el-option v-for="(item, index) in columnOptions" :key="index" :label="item.name" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时效：" prop="reportTimeList">
                <el-select v-model="params.reportTimeList"  multiple style="margin-left: 20px;width: 300px;"  placeholder="请选择">
                    <el-option v-for="item in reportTimeList" :key="item" :label="item" :value="item"> </el-option>
                </el-select>
                <!-- <el-checkbox-group v-model="params.reportTimeList">
                    <el-checkbox v-for="(item, index) in reportTimeList" :key="index" :label="item" name="type">{{ item }}</el-checkbox>
                </el-checkbox-group> -->
               
            </el-form-item> 
            <el-form-item >
                <el-button icon="el-icon-search" type="primary" @click="initData">查询</el-button>
                <el-button icon="el-icon-printer" type="warning" @click="tablePrint">打印</el-button>
                <el-button icon="el-icon-receiving" type="success" @click="exportText">导出</el-button>
            </el-form-item>
        </el-form>
        <div id="tablePrint" style="flex: 1; display: flex; flex-direction: column;overflow-y: auto;">
            <div class="title-text">
                    <div v-for="(item, index) in titleList" :key="index"> 
                        <div style="width: 120px;">{{item.title}}：</div> <p style="flex: 1;">{{ item.value}}</p>
                    </div>
            </div>
            <div style="flex: 1;display: flex; flex-direction: column">
                    <!-- <div class="element-button"> <el-button size="medium" icon="el-icon-printer" type="primary" @click="tablePrint">打印</el-button></div> -->
                    <el-table id="tablePrint" class="element-table" :data="tableData" height="100%" empty-text="请先选择“频道》栏目》时效”，数据查询" :row-class-name="tableRowClassName">
                        <el-table-column type="index" label="序号" width="55" fixed> </el-table-column>
                        <el-table-column prop="siteId" label="站点编号" fixed> </el-table-column>
                        <el-table-column v-for="(item, index) in Object.keys(tableEleName)" min-width="120" :key="index" :prop="item" :label="tableEleName[item]"></el-table-column>
                    </el-table>
                    <ComPagination style="margin-top: 20px;" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></ComPagination>
            </div>
        </div>
       <!-- <div class="el-dialog dialog-print" v-show="dialogVisible">
            <div id="tablePrint">
                <div class="title-text">
                    <div v-for="(item, index) in titleList" :key="index"> 
                        <div style="width: 120px;">{{item.title}}：</div> <p style="flex: 1;">{{ item.value}}</p>
                    </div>
                </div>
                <el-table id="tablePrint" class="element-table" height="100%"  :data="tableData" style="width: 100%;flex: 1;" empty-text="请先选择“频道》栏目》时效”，数据查询">
                    <el-table-column type="index" label="序号" width="55" fixed> </el-table-column>
                    <el-table-column prop="type" label="栏目" fixed> </el-table-column>
                    <el-table-column prop="siteId" label="站点编号" fixed> </el-table-column>
                    <el-table-column v-for="(item, index) in Object.keys(tableEleName)" min-width="120" :key="index" :prop="item" :label="tableEleName[item]"></el-table-column>
                </el-table>
            </div>
            <div style="text-align: center;margin-top: 20px;">
                <el-button  size="medium" @click="dialogVisible = false">取 消</el-button>
                <el-button  size="medium" type="primary" @click="tablePrint">打 印</el-button>
            </div>
       </div> -->
    </div>
</template>
<script>
// import printJS from 'print-js'
import ComPagination from '@/components/comPagination.vue'
import $ from 'jquery'

export default {
    name: 'urbanForecasting',
    components: {ComPagination},
    data() {
        return {
            params:{
                columnId: '',
                pageNum:1,
                pageSize: 10,
                reportTimeList: []
            },
            missSite: '',
            columnOptions: [],
            titleList: [],
            activeNames:['1', '2'],
            tableEleName: {
                name1: '温度',
                name2: '风速',
                name3: '降水量',
            },
            columnId: '',
            reportTimeList:[],
            tableLoading: false,
            dialogVisible: false,
            total: 0,
            tableData: [],
            rules:{
                columnId: [
                    { required: true, message: '请选择频道', trigger: 'change' },
                ],
                reportTimeList: [
                    { required: true, message: '请选择时效', trigger: 'change' },
                ],
            }
        }
    },
    mounted(){
        // this.$nextTick(() => {
        //     let tableAll = document.querySelectorAll('#tablePrint .el-table__row')
        //     console.log(tableAll);
        //     tableAll[3].style = 'background-color: #F95555'
        // })
        // this.initData()
    },
    methods: {
        initData(){
            let params = {...this.params}
            this.tableLoading = true
            this.$http.post(`${this.$api.server}/town/table/page`, params).then(res => {
                this.tableLoading = false
                if(res.code == 200 && res.data) {
                    // this.tableData = res.data.page.records || []
                    // this.total = res.data.page.total || 0
                    // this.titleList = res.data.processData || []
                    
                    this.missSite = res.data.missSite || ''
                    this.tableData = res.data.page.records || []
                    this.total = res.data.page.total || 0
                    this.titleList = res.data.processData || []
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        // ------------- 频道接口 start -------------
        channelQuerySearch(queryString, cb) {
            var results = [];
            let params = {
                name: queryString,
                status: 1,
                pageNum: 1,
                pageSize: 99,
            }
            this.$http.post(`${this.$api.server}/channel/page`, params).then(res => {
                if(res.code == 200 &&  res.data) {
                    results = res.data.records || []
                    // 调用 callback 返回建议列表的数据
                    cb(results);
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        channelChange(){
            // this.columnOptions = []
        },
        channerlSelect(value){
            this.params.channelName = value.name;
            this.params.columnId = '';
            // 获取频道下的栏目
            let params = {
                channelName: value.name,
                channelId: value.id,
                name: "",
                status: 1,
                pageNum: 1,
                pageSize: 999,
            }
            this.$http.post(`${this.$api.server}/column/page`, params).then(res => {
                this.tableLoading = false
                if(res.code == 200 && res.data) {
                   this.columnOptions = res.data.records || []
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
        // ------------- 频道接口 end -------------
        // 栏目选择
        columnChange(value){
            console.log(value);
            this.params.columnId = value.id
            this.$http.get(`${this.$api.server}column/info/${value.id}`).then(res => {
                if(res.code == 200) {
                    this.reportTimeList = res.data.reportTimeList || []
                    this.tableEleName = res.data.eleName || {}
                    this.params.reportTimeList = [value.defaultReportTime]
                    // this.initData()
                //    this.columnOptions = res.data.records || []
                } else {
                    this.$message.error(res.message)
                }
            })
            
        },
        // 打印 
         tablePrint(){
            $('#tablePrint').jqprint()
            // window.print()
            // let style = '@page {margin: 0 10mm}'
            // let style = '@page {}  @media print {.el-table__cell {text-align: left;padding:10px 0} .el-table .el-table__header tr th{padding-left:10px} .el-table__row:nth-child(3){background-color:red}'
            // printJS({
            //     printable: 'tablePrint',
            //     // properties: [
            //     //     { field: 'name', displayName: '学生' }, // field 要对应this.data里的字段
            //     //     { field: 'date', displayName: '年龄' },
            //     //     { field: 'address', displayName: '语文' },
            //     //     { field: 'address', displayName: '英语' },
            //     //     // { field: 'grade.math', displayName: '数学' },
            //     // ],
            //     type: 'html',
            //     targetStyle: ['*'],
            //     style
            //     // ignoreElements: 'elementButton'
            //     // gridHeaderStyle: 'border: 1px solid #000;text-align:center',
            //     // gridStyle: 'border: 1px solid #000;text-align:center'
            // })
        },
        // element表格el-table对指定行设置背景颜
        tableRowClassName({ row, rowIndex }){
            if (row.state === 2){
                return 'choose-row' 
            }
        },
        // 导出
        exportText(){
            this.$refs['params'].validate((valid) => {
                if (valid) {
                    let params = {
                        columnId: this.params.columnId,
                        reportTimeList: String(this.params.reportTimeList)
                    }
                    this.$http.getFile(`${this.$api.server}/town/export`, params).then(res => {
                        // console.log(res);
                        if (res.status == 200){
                            let data = res.data
                            let blob = new Blob([data], {type: 'application/vnd.ms-excel;charset=utf-8'})
                            let fileName = decodeURI(res.headers['content-disposition'])
                            // console.log(fileName);
                            // saveAs(blob, `${fileName}.xlsx`);

                            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                                // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
                                window.navigator.msSaveBlob(blob, `${fileName}`)
                            } else {
                                // 创建新的URL并指向File对象或者Blob对象的地址
                                const blobURL = window.URL.createObjectURL(blob)
                                // 创建a标签，用于跳转至下载链接
                                const tempLink = document.createElement('a')
                                tempLink.style.display = 'none'
                                tempLink.href = blobURL
                                tempLink.setAttribute('download', `${fileName}`)
                                // 兼容：某些浏览器不支持HTML5的download属性
                                if (typeof tempLink.download === 'undefined') {
                                    tempLink.setAttribute('target', '_blank')
                                }
                                // 挂载a标签
                                document.body.appendChild(tempLink)
                                tempLink.click()
                                document.body.removeChild(tempLink)
                                // 释放blob URL地址
                                window.URL.revokeObjectURL(blobURL)
                            }
                        } else {
                            this.$message.error(res.message)
                        }
                        
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.programPrediction{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .title-text >div{
        display: flex;
        padding: 10px 0;
        color: #fff;
        font-size: 16px;
        border-bottom: 1px solid #6EA4B2;
        >div{
            width: 80px;
        }
        p{
            color: aqua;
            opacity: 0.8;
        }
    }
    .title-text >div:nth-last-child(1){
        border-bottom: 0;
    }
    /deep/ .choose-row{
        background-color: #8C3C3C !important;
    }
    // .ul-li li {
    //     width: 50px;
    //     height: 50px;
    //     background: rgba(#000000, $alpha: .5);
    //     &:hover{
    //         cursor: text;
    //     }
    //     &:nth-child(n + 5){
    //         background-color: red;
    //     }
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