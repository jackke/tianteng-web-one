<!-- 数据类型管理 -->
<template>
    <div class="dataTypeManage">
        <el-form class="element-input" :inline="true" ref="params" :model="params" size="medium">
            <el-form-item label="数据名称：">
               <el-input v-model.trim="params.typeName" placeholder="请输入站点号" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="params.status" placeholder="请选择" popper-class="mars-select" style="width: 100px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="禁用" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-button icon="el-icon-search" type="primary" @click="initData">查询</el-button>
                <!-- <el-button icon="el-icon-plus" type="warning" @click="siteAdd">增加</el-button> -->
            </el-form-item>
        </el-form>
       <div style="flex: 1;display: flex; flex-direction: column;">
            <el-table id="tablePrint" class="element-table" height="100%" v-loading="tableLoading" :data="tableData" element-loading-text="努力加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(4,42,75, 0.5)">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="typeName" label="数据名称"> </el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="$changeTime.createTimeFn"> </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" :formatter="$changeTime.createTimeFn"> </el-table-column>
                <el-table-column prop="state" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1" style="color: #23D26D;">已启用</span>
                        <span type="text" v-if="scope.row.status == 2" style="color: #F95555">已禁用</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="340">
                    <template slot-scope="scope">
                        <el-button size="medium" type="primary" @click="dataRecalculate(scope.row)">回算</el-button>
                        <el-button size="medium" type="primary" @click="datalog(scope.row)">日志</el-button>
                        <el-button size="medium" type="primary" @click="dataEdit(scope.row)">编辑</el-button>
                        <el-button size="medium" type="danger" @click="dataDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <ComPagination style="margin-top: 20px;" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></ComPagination>
       </div>
       <el-dialog title="编辑站点" :visible.sync="dialogVisible" width="40%" :before-close="dataDialogClose" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"  class="element-input">
                <el-form-item label="数据名称：" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入数据名称"></el-input>
                </el-form-item>
                <el-form-item label="cron: " prop="cron">
                    <div style="display:flex;">
                        <el-input v-model="ruleForm.cron" placeholder="请输入cron" readonly clearable></el-input> 
                        <el-button icon="el-icon-coin" size="small" type="primary" @click="openCron = true" style="margin-left:10px">生 成</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="元素名称：" prop="elementList" >
                    <div class="tag-element">
                        <el-tag
                        class="input-new-tag"
                        :key="tag"
                        v-for="tag in ruleForm.elementList">{{tag}}</el-tag>
                    </div>
                </el-form-item>
               
                <!-- <el-form-item label="元素名称：" prop="elementList" >
                    <div class="tag-element">
                        <draggable v-model="ruleForm.elementList">
                            <el-tag
                                :key="tag"
                                v-for="tag in ruleForm.elementList"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(tag)">
                                {{tag}}
                            </el-tag>
                        </draggable>
                        <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="medium"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                            >
                        </el-input>
                        <el-button v-else type="primary" size="medium" @click="showInput">+ 添加元素名称</el-button>
                    </div>
                </el-form-item> -->
                <!-- <el-form-item label="站点名称：" prop="resource">
                    <el-input v-model="ruleForm.name" placeholder="请输入站点名称"></el-input>
                </el-form-item> -->
                <el-form-item label="状态：" required>
                    <el-radio-group v-model="ruleForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="dataDialogClose">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="Cron表达式生成器" :center="true" top="1%" :visible.sync="openCron" destroy-on-close :modal-append-to-body="false" :append-to-body="false" :close-on-click-modal="false">
            <cron @close="openCron=false" @fill="crontabFill" :expression="cronValue" :hideComponent="tabTitlesKey"></cron>
        </el-dialog>
        <el-dialog title="回算" top="5%" width="500px" :visible.sync="openRecalculate" :modal-append-to-body="false" :append-to-body="false" :close-on-click-modal="false">
            <el-form :model="recalculateForm" :rules="rules" ref="ruleForm" label-width="100px"  class="element-input">
                <el-form-item label="数据名称：">
                    {{ recalculateForm.typeName }}
                </el-form-item>
                <el-form-item label="开始时间：" prop="startTime">
                    <el-date-picker
                        v-model="recalculateForm.startTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        align="right"
                        popper-class="mars-date"
                        value-format="yyyyMMddHH"
                        default-time="00:00:00"
                        >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间：" prop="endTime">
                    <el-date-picker
                        v-model="recalculateForm.endTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        align="right"
                        popper-class="mars-date"
                        value-format="yyyyMMddHH"
                        default-time="23:00:00"
                        >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="openRecalculateClose">取 消</el-button>
                <el-button size="medium" type="primary" :loading="dialogLoading" @click="submitRecalculate">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="查看日志" top="5%" width="800px" :visible.sync="openlog" :modal-append-to-body="false" :append-to-body="false" :close-on-click-modal="false">
            <el-form :model="logForm" :rules="rules" ref="ruleForm" :inline="true" label-width="100px"  class="element-input" size="medium">
                <el-form-item label="开始时间：" prop="startTime">
                    <el-date-picker
                        v-model="logForm.startTime"
                        type="date"
                        placeholder="选择日期时间"
                        popper-class="mars-date"
                        >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间：" prop="endTime">
                    <el-date-picker
                        v-model="logForm.endTime"
                        type="date"
                        placeholder="选择日期时间"
                        popper-class="mars-date"
                        >
                    </el-date-picker>
                </el-form-item>
                <el-form-item >
                    <el-button  type="primary" :loading="dialogLoading" @click="initLog">查询</el-button>
                </el-form-item>
            </el-form>
            <div>
                <el-table id="tablePrint" class="element-table" v-loading="tableLogLoading" :data="tableLog" element-loading-text="努力加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(4,42,75, 0.5)">
                    <el-table-column type="index" label="序号"> </el-table-column>
                    <el-table-column prop="parseSteps" label="解析内容">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="点击查看" placement="top">
                                <div class="parseSteps" @click="parseStepsClick(scope.row)">
                                    {{ scope.row.parseSteps }}
                                </div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="recordsInserted" label="入库总数"> </el-table-column>
                    <el-table-column prop="recordsParsed" label="解析总数"> </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="$changeTime.createTimeFn" width="150"> </el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" :formatter="$changeTime.createTimeFn" width="150"> </el-table-column>
                    <el-table-column prop="state" label="状态" width="80">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1" style="color: #23D26D;">成功</span>
                            <span type="text" v-if="scope.row.status == 2" style="color: #F95555">失败</span>
                        </template>
                    </el-table-column>
                </el-table>
                <ComPagination style="margin-top: 20px;" :total="totalLog" @current-change="logCurrentChange" @size-change="logSizeChange"></ComPagination>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="openTitle" destroy-on-close :modal-append-to-body="false" :append-to-body="false" :close-on-click-modal="false">
            <div>
                {{ titleParseSteps }}
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" type="primary" @click="openTitle = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ComPagination from '@/components/comPagination.vue'
import draggable from 'vuedraggable';
import {cron} from 'wz-vue-cron-tab'

export default {
    name: 'siteManage',
    components: {ComPagination, draggable, cron},
    data() {
        return {
            dialogVisible: false,
            tableLoading: false,
            inputVisible: false,
            openCron: false,
            cronValue: '',
            tabTitlesKey: ["second", "week","year"],
            openRecalculate: false,
            dialogLoading: false,
            params:{
                typeName: "",
                status: '',
                pageNum: 1,
                pageSize: 10,
            },
            submitType: '',
            inputValue: '',
            ruleForm:{
                code: '',
                name: '',
                cron: '',
                status: 1,
                elementList: [],
            },
            recalculateForm:{
                startTime:'',
                endTime: '',
            },
            openTitle: false,
            titleParseSteps: '',
            tableLogLoading: false,
            openlog: false,
            logForm:{
                endTime: "",
                pageNum: 0,
                pageSize: 10,
                startTime: "",
                typeId: 0
            },
            tableLog: [],
            totalLog: 0,
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            total: 0,
            rules:{
                code: [
                    { required: true, message: '请输入站点编号', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入站点名称', trigger: 'blur' },
                ],
                cron: [
                    { required: true, message: '请输入cron', trigger: 'blur' },
                ],
                elementList: [
                    { required: true, 
                        validator: (rule, value, callback) => {
                            if (this.ruleForm.elementList.length == 0){
                                callback(new Error("请添加元素类型"))
                            }
                            callback();
                        },
                        trigger: 'change'
                    },
                ],
                startTime: [
                    { required: true, message: '请选择开始时间', trigger: 'change' },
                ],
                endTime: [
                    { required: true, message: '请选择结束时间', trigger: 'change' },
                ],
            }
        }
    },
    created(){
        this.initData()
    },
    methods: {
        initData(){
            this.tableLoading = true
            this.$http.post(`${this.$api.server}/town/type/page`, this.params).then(res => {
                this.tableLoading = false
                if(res.code == 200) {
                    this.tableData = res.data.records || []
                    this.total = res.data.total || 0
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        siteAdd(){
            this.dialogVisible = true
            this.submitType = 'add'
            this.ruleForm = {
                code: '',
                name: '',
                status: 1,
                elementList: [],
            }
        },
        dataDialogClose(){
            this.dialogVisible = false
        },
        dataEdit(row){
            this.dialogVisible = true
            this.submitType = 'edit'
            let reg = new RegExp(/ele\d+Name/)
            let tagList = []
            for (const key in row) {
                if (key.match(reg) && row[key]){
                    tagList.push(row[key])
                }
            }
            this.ruleForm = {
                name: row.typeName,
                status: row.status || 1,
                elementList: tagList,
                id: row.id
            }
        },
        dataDelete(row){
            this.$confirm(`是否确认删除该站点？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(`${this.$api.server}/town/type/del?id=${row.id}`).then(res => {
                    if(res.code == 200) {
                        this.initData()
                        this.$message({ message: `删除成功`, type: 'success' })
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }).catch(err => {})
        },
        parseStepsClick(row){
            this.titleParseSteps = row.parseSteps
            this.openTitle = true
            // this.$notify({
            //     title: '提示',
            //     message: row.parseSteps,
            //     duration: 0
            // });
            // this.$confirm(row.parseSteps, '', {
            //     confirmButtonText: '确定',
            // }).then(() =>{});
        },
        datalog(row){
            this.openlog = true
            var year = new Date().getFullYear();  //获取年
            var month = new Date().getMonth()+1; //月,因为是从0开始的,所以要加一
            var date = new Date().getDate();      //日
            this.logForm.typeId = row.id
            this.logForm.startTime = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`
            this.logForm.endTime = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`
            this.initLog()
        },
        initLog(){
            this.tableLogLoading = true
            this.$http.post(`http://192.168.1.61:8004/hfFileParsingLogsPO/page`, this.logForm).then(res => {
                if(res.code == 200) {
                    this.tableLog = res.data.records || []
                    this.totalLog = res.data.total
                } else {
                    this.$message.error(res.message)
                }
                this.tableLogLoading = false
            })
        },
        // ------------------ 添加元素类型  start--------------------------------
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
            this.ruleForm.elementList.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        handleClose(tag) {
            this.ruleForm.elementList.splice(this.ruleForm.elementList.indexOf(tag), 1);
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => { 
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // ------------------ 添加元素类型  end --------------------------------
        handleCurrentChange(page){
            this.params.pageNum = page
            this.initData()
        },
        handleSizeChange(size){
            this.params.pageSize = size
            this.initData()
        },
        logCurrentChange(page){
            this.logForm.pageNum = page
            this.initLog()
        },
        logSizeChange(size){
            this.logForm.pageSize = size
            this.initLog()
        },
        /** 确定后回传值 */
         crontabFill(value) {
            // this.ruleForm.dataList[this.cronListIndex].cron = value
            
        },
        dataRecalculate(row){
            this.recalculateForm = {
                typeName: row.typeName,
                id: row.id,
                startTime: '',
                endTime: '',
            }
            this.openRecalculate = true
        },
        openRecalculateClose(){
            this.$refs['ruleForm'].clearValidate()
            this.openRecalculate = false
        },
        submitRecalculate(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.dialogLoading = true
                    this.$http.post(`${this.$api.server}/town/call`, this.recalculateForm).then(res => {
                        this.dialogLoading = false
                        if (res.code == 200){
                            this.$message({ message: '回算成功', type: 'success' })
                            this.openRecalculateClose()
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
        // ------------------ 弹框  start--------------------------------
        submitForm(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.dialogLoading = true
                    let data = {
                        typeName: this.ruleForm.name,
                        status: this.ruleForm.status,
                        id: this.ruleForm.id
                    }
                    this.ruleForm.elementList.forEach((item, index) => {
                        data[`ele${index + 1}Name`] = item
                    })
                    if(this.submitType == 'add'){
                        this.$http.post(`${this.$api.server}/town/type/save`, data).then(res => {
                            this.dialogLoading = false
                            if (res.code == 200){
                                this.dataDialogClose()
                                this.initData()
                                this.$message({ message: '添加成功', type: 'success' })
                            } else {
                                this.$message.error(res.message)
                            }
                        }).catch((error) => {
                            this.dialogLoading = false
                            this.$message.error(error)
                        })
                    }
                    if(this.submitType == 'edit'){
                        this.$http.post(`${this.$api.server}/site/mod`, data).then(res => {
                            this.dialogLoading = false
                            if (res.code == 200){
                                this.dataDialogClose()
                                this.initData()
                                this.$message({ message: '编辑站点成功', type: 'success' })
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
    }
}
</script>
<style lang="scss" scoped>
.dataTypeManage{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
   
}
.tag-element{
    .el-tag{
        background-color: #16395A;
        border: 1px solid #00F0FF;
        color: #fff;
        margin-right: 10px;
        .el-tag__close{
            color: #F95555;
        }
    }
}
.parseSteps{
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:2;
}

/deep/ .el-descriptions-item__content{
    // display: none;
}
/deep/ .el-tabs--border-card{
    background-color: transparent;
    border-color: transparent;
    color:#fff;
}
/deep/ .el-tabs--border-card>.el-tabs__header{
    background-color: transparent;
}
/deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
    background-color: transparent;
    border:0;
}
/deep/ .el-dialog__body {
    color: #fff;
}
/deep/ .popup-result .title{
    text-shadow: 0px 8px 10px rgba(14,23,47,0.56);
    background: linear-gradient(180deg, #FFFFFF 0.537109375%, #89EBF4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-color: transparent;
}
/deep/ .el-radio .el-radio__label{
    color: #fff;
}
/deep/ .popup-main{
    background: transparent;
    color: #fff;
}

</style>