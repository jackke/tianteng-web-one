<!-- 栏目配置 无接口，废弃-->
<template>
    <div class="columnConfiguration">
        <el-form class="element-input" :inline="true" ref="params" :model="params" size="medium">
            <el-form-item label="站点别名：">
                <el-input v-model="params.name" placeholder="请输入站点别名"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button icon="el-icon-search" type="primary">查 询</el-button>
                <el-button icon="el-icon-plus" type="warning" @click="siteAdd">增加</el-button>
            </el-form-item>
        </el-form>

       <div style="flex: 1;display: flex; flex-direction: column;">
            <el-table id="tablePrint" class="element-table" height="100%" :data="tableData" v-loading="tableLoading" element-loading-text="努力加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(4,42,75, 0.5)">
                <el-table-column type="index" label="顺序"> </el-table-column>
                <el-table-column prop="date" label="站点名称"> </el-table-column>
                <el-table-column prop="date" label="站点别名"> </el-table-column>
                <el-table-column prop="date" label="创建时间"> </el-table-column>
                <el-table-column prop="date" label="更新时间"> </el-table-column>
                <el-table-column label="操作"  width="50">
                    <template slot-scope="scope">
                        <el-button size="medium"  type="text" @click="edit(scope.row)">保 存</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <ComPagination style="margin-top: 20px;"></ComPagination>
        </div>

        <el-dialog title="选择站点：" class="column-dialog" :visible.sync="dialogVisible" width="50%" top="3px" :before-close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false">
            <div>
                <el-form class="element-input" :inline="true" ref="ruleForm" :model="ruleForm" size="medium">
                    <el-form-item label="站点编号：">
                        <el-input v-model="ruleForm.site" placeholder="请输入站点号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="站点名称：">
                        <el-input v-model="ruleForm.name" placeholder="请输入站点名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-button icon="el-icon-search" type="primary" @click="siteInitData">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-table ref="siteTableDataRef" tooltip-effect="dark" @selection-change="handleSelectionChange" class="element-table" :data="siteTableData" v-loading="tableLoading" element-loading-text="努力加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(4,42,75, 0.5)">
                    <el-table-column type="selection" width="55"> </el-table-column>
                    <el-table-column type="index" label="顺序" width="55"> </el-table-column>
                    <el-table-column prop="code" label="站点编号"> </el-table-column>
                    <el-table-column prop="name" label="站点名称"> </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="$changeTime.createTimeFn"> </el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" :formatter="$changeTime.createTimeFn"> </el-table-column>
                    <el-table-column prop="state" label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1" style="color: #23D26D;">已启用</span>
                            <span type="text" v-if="scope.row.status == 2" style="color: #F95555">已禁用</span>
                        </template>
                    </el-table-column>
                </el-table>
                <ComPagination style="margin-top: 20px;" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></ComPagination>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="submitSiteData">确 认</el-button>
            </div>
        </el-dialog>

        <el-dialog title="站点设置：" class="column-dialog" :visible.sync="dialogVisibleSet" width="30%" top="3px" :before-close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false">
            <div>
                <el-table class="element-table" :data="siteSetTableData">
                    <el-table-column type="index" label="顺序" width="55"> </el-table-column>
                    <el-table-column prop="code" label="站点编号"> </el-table-column>
                    <el-table-column prop="name" label="站点名称"> </el-table-column>
                    <el-table-column prop="state" label="站点别名"> 
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.siteAlias" placeholder="请输入站点别名"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import ComPagination from '@/components/comPagination.vue'

export default {
    name: 'columnConfiguration',
    components: {ComPagination},
    data() {
        return {
            params:{
                channelName: '',
                channelId: '',
                type: []
            },
            tableData: [],
            siteTableData:[],
            siteSetTableData: [],
            ruleForm:{
                site: '',
                name: "",
                status: '',
                pageNum: 1,
                pageSize: 10,
            },
            rules:{

            },
            tableLoading: false,
            dialogVisible: false,
            dialogVisibleSet: false,
        }
    },
    mounted(){
       
    },
    methods: {
        siteAdd(value){
            this.dialogVisible = true;
            this.siteInitData()
        },
        siteInitData(){
            this.tableLoading = true
            this.$http.post(`${this.$api.server}/site/page`, this.ruleForm).then(res => {
                this.tableLoading = false
                if(res.code == 200) {
                    this.siteTableData = res.data.records || []
                    this.siteTotal = res.data.total || 0
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        handleSelectionChange(){

        },
        submitForm(){

        },
        submitSiteData(){

        },
        handleClose(){
            this.dialogVisible = false
        }
    }
}
</script>
<style lang="scss">
.column-dialog{
    .column-trans .el-transfer-panel{
        border: 1px solid #ccc;
    }
    .el-form--inline .form-item-flex{
        display: flex;
    }
    .form-item-flex .el-form-item__content{
        display: flex;
    }
    .button-trans{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .el-button{
            margin-left: 30px;
        }
        
    }
}
  
</style>
<style lang="scss" scoped>
.columnConfiguration{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    .title-text >div{
        display: flex;
        padding: 10px 0;
        color: #fff;
        font-size: 16px;
        border-bottom: 1px solid #6EA4B2;
        >div{
            width: 200px;
        }
        p{
            color: aqua;
            opacity: 0.8;
        }
    }
    .title-text >div:nth-last-child(1){
        border-bottom: 0;
    }

  
}

</style>