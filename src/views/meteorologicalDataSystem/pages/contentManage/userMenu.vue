<!-- 菜单分配 -->
<template>
    <div class="userMenu">
        <el-form class="element-input" :inline="true" ref="params" :model="params" size="medium">
            <el-form-item label="角色名称：">
               <el-input v-model.trim="params.name" placeholder="请输入角色名称" clearable></el-input>
            </el-form-item>
            <el-form-item >
                <el-button icon="el-icon-search" type="primary" @click="initData">查询</el-button>
                <el-button icon="el-icon-plus" type="warning" @click="userAdd">增加</el-button>
            </el-form-item>
        </el-form>
        <div style="flex: 1;display: flex; flex-direction: column;">
            <el-table id="tablePrint" class="element-table" height="100%" v-loading="tableLoading" :data="tableData" element-loading-text="努力加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(4,42,75, 0.5)">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="name" label="角色名称"> </el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="$changeTime.createTimeFn"> </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" :formatter="$changeTime.createTimeFn"> </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="medium" type="primary" @click="dataEdit(scope.row)">编辑</el-button>
                        <el-button size="medium" type="danger" @click="dataDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <ComPagination style="margin-top: 20px;" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></ComPagination>
       </div>
       <el-dialog title="角色分配菜单" :visible.sync="dialogVisible" width="35%" :before-close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false">
            <div style="height: 500px; overflow-y: auto;">
                <el-form  class="element-input" ref="ruleForm" :model="ruleForm" :rules="rules" size="medium" label-width="100px">
                    <el-form-item label="角色名称：" v-if="type == 'add'" key="name" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入角色名称" clearable style="width: 200px;"></el-input> 
                        <el-button icon="el-icon-plus" type="warning" @click="ruleFormAdd" style="margin-left: 20px;">确认</el-button>
                    </el-form-item>
                    <el-form-item  label="菜单选择：" prop="treeData">
                        <el-tree
                            class="menu-tree"
                            :data="ruleForm.treeData"
                            :props="props"
                            :load="loadNode"
                            lazy
                            show-checkbox
                            default-expand-all
                            node-key="id"
                            ref="tree"
                            @check-change="handleCheckChange">
                        </el-tree>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="handleClose">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
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
            params:{
                name: "",
                pageNum: 1,
                pageSize: 10,
            },
            ruleForm:{
                name: '',
                treeData: [],
            },
            type: '',
            dialogVisible: false,
            tableLoading: false,
            tableData: [],
            total: 0,
            props: {
                label: 'name',
                children: 'child'
            },
            rules:{
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                ],
                treeData: [
                    { required: true, message: '请选择菜单', trigger: 'change' },
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
            // this.$http.get(`${this.$api.server}/user/list`).then(res => {
            this.$http.post(`${this.$api.server}/role/page`, this.params).then(res => {
                this.tableLoading = false
                    if(res.code == 200) {
                        this.tableData = res.data.records || []
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

        userAdd(){
            this.type = 'add';
            this.dialogVisible = true;
            this.ruleForm.treeData = []
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys([]);
            })
        },
        ruleFormAdd(){
            this.ruleForm.treeData = [
                {
                    name: this.ruleForm.name,
                    child: []
                }
            ]
            this.$refs.tree.setCheckedKeys([1]);
        },
        handleClose(){
            this.dialogVisible = false;
        },
        dataEdit(row){
            this.type = 'edit';
            this.dialogVisible = true;
            this.ruleForm.treeData = [
                {
                    name: row.name,
                    roleId: row.roleId,
                    child: []
                }
            ]
            this.getMenu(row.roleId)
        },
        dataDelete(row){
            this.$confirm(`是否确认删除该角色？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(`${this.$api.server}/role/del?id=${row.roleId}`).then(res => {
                    if(res.code == 200) {
                        this.initData()
                        this.$message({ message: `删除成功`, type: 'success' })
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }).catch(err => {})
        },
        // -------------------------       tree start         ---------------------------------------
        getMenu(id){
            this.$http.get(`${this.$api.server}/role/info/${id}`).then(res => {
                    if(res.code == 200) {
                        this.$nextTick(() => {
                            this.$refs.tree.setCheckedKeys(res.data.menuIdList || []);
                        })
                    } else {
                        this.$message.error(res.message)
                    }
                })
        },
        loadNode(node, resolve){
            let menuList = []
            if (node.level == 0) {
                resolve(this.ruleForm.treeData)
            }
            if (node.level == 1) {
                this.$http.get(`${this.$api.server}/menu/list?pId=${node.key ? node.key : ''}`).then(res => {
                    if(res.code == 200) {
                        menuList = res.data || []
                        resolve(menuList)
                    } else {
                        resolve([])
                        this.$message.error(res.message)
                    }
                })
            }
            if (node.level == 2 || node.level == 3) {
                this.$http.get(`${this.$api.server}/menu/list?pId=${node.key ? node.key : ''}`).then(res => {
                    if(res.code == 200) {
                        let list = res.data || []
                        resolve(list[0].child)
                    } else {
                        resolve([])
                        this.$message.error(res.message)
                    }
                })
            }
            if (node.level > 3) resolve([])
        },
        handleCheckChange(data, checked, indeterminate) {
            // console.log(data, checked, indeterminate);
        },
        submitForm(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.$confirm(`确定保存该配置？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    //    console.log(this.$refs.tree.getCheckedNodes());
                    let getkey = this.$refs.tree.getCheckedKeys()
                    let data = {
                            name: this.ruleForm.treeData[0].name,
                            roleId: this.ruleForm.treeData[0].roleId,
                            menuIdList: getkey
                    }
                    if (this.type == 'add'){
                            this.$http.post(`${this.$api.server}/role/save`, data).then(res => {
                                if(res.code == 200) {
                                    this.handleClose()
                                    this.params.pageNum = 1
                                    this.initData()
                                    this.$message({ message: `保存成功`, type: 'success' })
                                } else {
                                    this.$message.error(res.message)
                                }
                            })
                    } else if (this.type == 'edit'){
                            this.$http.post(`${this.$api.server}/role/mod`, data).then(res => {
                                if(res.code == 200) {
                                    this.handleClose()
                                    this.params.pageNum = 1
                                    this.initData()
                                    this.$message({ message: `修改成功`, type: 'success' })
                                } else {
                                    this.$message.error(res.message)
                                }
                            })
                    }
                    }).catch(err => {})
                }
            })
            
        },
        // -------------------------       tree end         ---------------------------------------
     
    }
}
</script>
<style lang="scss" scoped>
$_color: #00E4FF;
.userMenu{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
}
.menu-tree{
    background-color: transparent;
    color: #FFFFFF;
    font-weight: 400;
    :deep > .el-tree-node.is-focusable > .el-tree-node__content:nth-child(1){
        padding: 10px 0 10px 20px !important;
        background: rgba($_color, .1);
        border-top: 1px solid rgba($_color, .5);
        // font-weight: 400;
        height: auto;
        .el-tree-node__expand-icon{
            font-size: 20px;
            color: rgba($_color, .8);
            
        }
        .el-tree-node__label{
            color: #FFFFFF;
            text-shadow: 0px 8px 10px rgba(14,23,47,0.56);
            background: linear-gradient(180deg, #FFFFFF 0.537109375%, #89EBF4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
    /deep/ .el-tree-node__children > div{
        padding: 13px 0 13px 25px;
        // border-bottom: 1px solid #3E899D;
    }
    // /deep/ .el-tree-node__children .is-current{
            
    //         color: $_color;
    //         background-image: url(@/assets/image/menu-bg.png);
    //         background-size: 100% 100%;
    //         .el-tree-node__label::before{
    //             content: "";
    //             position: relative;
    //             display: inline-block;
    //             top: -2px;
    //             left: -14px;
    //             width: 6px;
    //             height: 6px;
    //             background-color: $_color;
    //             z-index: inherit;
    //         }
    // }
    /deep/ .is-current{
        color: none;
        background-color: transparent;
    }
    /deep/ .el-tree-node > div:hover{
        background-color: transparent;
    }
    /deep/ .el-tree-node__content{
        background-color: transparent;
    }
    /deep/ .el-tree-node__children .el-tree-node__label::before{
        content: "";
        position: relative;
        display: inline-block;
        top: -2px;
        left: -14px;
        width: 6px;
        height: 6px;
        background-color: #6D7484;
        z-index: inherit;
    }
}
.el-dialog__wrapper{
    height: 100vh;
}

</style>