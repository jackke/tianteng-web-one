<!-- 数据类型管理 -->
<template>
    <div class="dataTypeManage">
        <el-form class="element-input" :inline="true" ref="params" :model="params" size="medium">
            <el-form-item label="数据名称：">
               <el-input v-model="params.typeName" placeholder="请输入站点号" clearable></el-input>
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
                <el-button icon="el-icon-plus" type="warning" @click="siteAdd">增加</el-button>
            </el-form-item>
        </el-form>
       <div style="flex: 1;display: flex; flex-direction: column;">
            <el-table id="tablePrint" class="element-table" v-loading="tableLoading" :data="tableData" element-loading-text="努力加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(4,42,75, 0.5)">
                <el-table-column type="index" label="顺序"> </el-table-column>
                <el-table-column prop="typeName" label="数据名称"> </el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="$changeTime.createTimeFn"> </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" :formatter="$changeTime.createTimeFn"> </el-table-column>
                <el-table-column prop="state" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1" style="color: #23D26D;">已启用</span>
                        <span type="text" v-if="scope.row.status == 2" style="color: #F95555">已禁用</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="medium" type="primary" @click="dataEdit(scope.row)">编辑</el-button>
                        <el-button size="medium" type="danger" @click="dataDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <ComPagination style="margin-top: 20px;" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></ComPagination>
       </div>
       <el-dialog title="添加站点" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false" :append-to-body="true">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"  class="element-input">
                <el-form-item label="数据名称：" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入数据名称"></el-input>
                </el-form-item>
                <el-form-item label="元素名称：" prop="elementList" >
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
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                            >
                        </el-input>
                        <el-button v-else type="primary" size="small" @click="showInput">+ 添加元素名称</el-button>
                    </div>
                </el-form-item>
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
    </div>
</template>
<script>
import ComPagination from '@/components/comPagination.vue'
import draggable from 'vuedraggable';

export default {
    name: 'siteManage',
    components: {ComPagination, draggable},
    data() {
        return {
            dialogVisible: false,
            tableLoading: false,
            inputVisible: false,
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
                status: 1,
                elementList: [],
            },
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

</style>