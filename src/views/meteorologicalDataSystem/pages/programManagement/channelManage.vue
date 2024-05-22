<!-- 频道管理 -->
<template>
    <div class="channelManage">
        <el-form class="element-input" :inline="true" ref="params" :model="params" label-width="100px" size="medium">
            <el-form-item label="频道名称：">
                <el-input v-model="params.description" placeholder="请输入频道名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="params.status" placeholder="请选择" popper-class="mars-select" style="width: 100px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="禁用" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="initData">查 询</el-button>
                <el-button icon="el-icon-sort" type="primary" @click="onDataSort">排 序</el-button>
                <el-button size="medium" icon="el-icon-plus" type="warning" @click="onAdd">添 加</el-button>
            </el-form-item>
        </el-form>
        <div style="flex: 1;display: flex; flex-direction: column;">
            <!-- <div class="element-button"> <el-button size="medium" icon="el-icon-printer" type="primary" @click="tablePrint">打印</el-button></div> -->
            <el-table id="tablePrint" class="element-table" v-loading="tableLoading" :data="tableData" max-height="850" element-loading-text="努力加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(4,42,75, 0.5)">
                <el-table-column prop="sort" label="顺序" style="text-align: center;"> </el-table-column>
                <el-table-column prop="name" label="频道名称"> </el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column prop="state" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1" style="color: #23D26D;">已启用</span>
                        <span type="text" v-if="scope.row.status == 2" style="color: #F95555">已禁用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="$changeTime.createTimeFn"> </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <!-- <el-button size="medium"  type="success" @click="userEnDis(scope.row, 1)" v-if="scope.row.status == 2">启用</el-button>
                        <el-button size="medium"  type="danger" @click="userEnDis(scope.row, 2)" v-if="scope.row.status == 1">禁用</el-button> -->
                        <el-button size="medium"  type="primary" @click="userEdit(scope.row)">编辑</el-button>
                        <el-button size="medium"  type="danger" @click="userDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <ComPagination style="margin-top: 20px;" @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="total"></ComPagination>
        </div>
         <!--  编辑频道 -->
        <el-dialog :title="type == 'add' ? '添加频道' : '编辑频道'" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false" :append-to-body="true">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="element-input">
                <el-form-item label="频道名称：" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入频道名称"></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-radio-group v-model="ruleForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input type="textarea" v-model="ruleForm.description" placeholder="描述"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="handleClose">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitForm" :loading="dialogLoading">确 认</el-button>
            </div>
        </el-dialog>
        <!--  排序 -->
        <el-dialog title="频道排序" :visible.sync="dialogVisibleSort" width="40%" :before-close="handleClose" :close-on-click-modal="false" :append-to-body="true">
            <div style="display: flex; max-height: 600px; overflow: auto">
                <el-table class="element-table" v-loading="tableLoading" :data="tableDataSort" @selection-change="handleSelectionChange" max-height="600" element-loading-text="努力加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(4,42,75, 0.5)">
                    <!-- <el-table-column prop="sort" label="顺序" style="text-align: center;" width="55"> </el-table-column> -->
                    <el-table-column type="selection" width="55">  </el-table-column>
                    <el-table-column prop="name" label="频道名称"> </el-table-column>
                    <el-table-column prop="description" label="描述"></el-table-column>
                </el-table>
                <div class="sort-button" >
                    <div><el-button type="primary" icon="el-icon-d-arrow-left" circle @click="arrowOneUp" style="transform: rotate(90deg);"></el-button></div>
                    <div><el-button type="primary" icon="el-icon-arrow-up" circle @click="arrowUp"></el-button></div>
                    <div><el-button type="primary" icon="el-icon-arrow-down" circle @click="arrowDown"></el-button></div>
                    <div><el-button type="primary" icon="el-icon-d-arrow-left" circle @click="arrowLast" style="transform: rotate(-90deg);"></el-button></div>
                </div>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="handleClose">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitSort" :loading="dialogLoading">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
import ComPagination from '@/components/comPagination.vue'

export default {
    name: 'channelManage',
    components: {draggable,ComPagination,},
    data() {
        return {
            type: 'add',
            params:{
                name: "",
                status: '',
                pageNum: 1,
                pageSize: 10,
            },
            total: 0,
            tableLoading: false,
            dialogLoading: false,
            // tableData: [],
            tableDataSort: [],
            multipleSelection: [],
            dialogVisible: false,
            dialogVisibleSort: false,
            ruleForm:{
                description: "",
                name: "",
                status: 1,
                userId: this.$store.state.userId
            },
            rules:{
                name: [
                    { required: true, message: '请输入频道名称', trigger: 'blur' },
                ],
                status: [
                    { required: true, message: '请输入状态', trigger: 'change' },
                ],
            },
            tableData: []
        }
    },
    created(){
        this.initData()
    },
    mounted(){
       
    },
    methods: {
        initData(){
            this.tableLoading = true
            this.$http.post(`${this.$api.server}/channel/page`, this.params).then(res => {
                this.tableLoading = false
                    if(res.code == 200) {
                        this.tableData = res.data.records || []
                        this.total = res.data.total || 0
                    } else {
                        this.$message.error(res.message)
                    }
                })
        },
        onAdd(){
            this.type = 'add'
            this.dialogVisible = true
            this.ruleForm = {
                description: "",
                name: "",
                status: 1,
                userId: ''
            }
        },
        onDataSort(){
            this.dialogVisibleSort = true
            let params = {
                name: "",
                status: '',
                pageNum: 1,
                pageSize: 999,
            }
            this.$http.post(`${this.$api.server}/channel/page`, params).then(res => {
                this.tableLoading = false
                if(res.code == 200) {
                    this.tableDataSort = res.data.records || []
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        handleClose(){
            this.dialogVisible = false
            this.dialogVisibleSort = false
        },
        userEdit(row){
            this.type = 'edit'
            this.dialogVisible = true
            this.ruleForm = {...row}
        },
        userDelete(row){
            this.$confirm('确认删除该频道吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(`${this.$api.server}/channel/del?id=${row.id}`).then(res => {
                    if(res.code == 200) {
                        this.initData()
                        this.$message({ message: '删除成功', type: 'success' })
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }).catch(err => {})
            
        },

        handleCurrentChange(page){
            this.params.pageNum = page
            this.initData()
        },
        handleSizeChange(size){
            this.params.pageSize = size
            this.initData()
        },

        submitForm(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.ruleForm.userId = this.$store.state.userId
                    this.dialogLoading = true
                    if (this.type == 'edit'){
                        this.$http.post(`${this.$api.server}/channel/mod`, this.ruleForm).then(res => {
                            this.dialogLoading = false
                            if(res.code == 200) {
                                this.initData()
                                this.handleClose()
                                this.$message({ message: '修改成功', type: 'success' })
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                    } else {
                        this.$http.post(`${this.$api.server}/channel/save`, this.ruleForm).then(res => {
                            this.dialogLoading = false
                            if(res.code == 200) {
                                this.initData()
                                this.handleClose()
                                this.$message({ message: '添加成功', type: 'success' })
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                    }
                }
            })
            
        },
        submitSort(){
            let data = this.tableDataSort.map(item => item.id)
            this.dialogLoading = true;
            this.$http.post(`${this.$api.server}/channel/sort`, data).then(res => {
                this.dialogLoading = false
                if(res.code == 200) {
                    this.initData()
                    this.handleClose()
                    this.$message({ message: '排序修改成功', type: 'success' })
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        // ------------------------- 排序  start --------------------------------
        arrowOneUp(){ // 上升顶部
            let list = []
            this.tableDataSort.forEach((item, index) => {
                this.multipleSelection.forEach(items => {
                    if (item.id == items.id){
                        list.push(...this.tableDataSort.splice(index, 1))
                    }
                })
            })
            this.tableDataSort.splice(0, 0, ...list)
        },
        arrowUp(){ //上升
            let list = []
            let listIndex = []
            this.multipleSelection.forEach((items) => {
                this.tableDataSort.forEach((item, index) => {
                    if (item.id == items.id){
                        list.push(...this.tableDataSort.splice(index, 1))
                        listIndex.push(index)
                    }
                })
            })
            let arr = listIndex.sort((a,b) => a - b)
            if (arr[0] <= 0){
                this.tableDataSort.splice(0, 0, ...list)
            } else {
                this.tableDataSort.splice(arr[0] - 1, 0, ...list)
            }
            // console.log(this.multipleSelection, arr[0]);
        },
        arrowDown(){ // 下降
            let list = []
            let listIndex = []
            this.multipleSelection.forEach((items) => {
                this.tableDataSort.forEach((item, index) => {
                    if (item.id == items.id){
                        list.push(...this.tableDataSort.splice(index, 1))
                        listIndex.push(index)
                    }
                })
            })
            let arr = listIndex.sort((a,b) => b - a)
            this.tableDataSort.splice(arr[0] + 1, 0, ...list)
        },
        arrowLast(){ //下降底部
            let list = []
            let length = this.tableDataSort.length;
            this.tableDataSort.forEach((item, index) => {
                this.multipleSelection.forEach(items => {
                    if (item.id == items.id){
                        list.push(...this.tableDataSort.splice(index, 1))
                    }
                })
            })
            this.tableDataSort.splice(length, 0, ...list)
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
         // ------------------------- 排序  end --------------------------------
    }
}
</script>
<style lang="scss" scoped>
.channelManage{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
 
}
.list-sort{
    text-align: center;
    padding: 15px 0;
    color: #00E4FF;
    border-top: 1px solid #00E4FF;
}
.list-sort:nth-last-child(1){
    border-bottom: 1px solid #00E4FF;
}
.sort-button{
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}
</style>