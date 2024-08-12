<!-- 频道配置 -->
<template>
    <div class="channeAllocation">
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card class="box-card" style="margin: 0 20px 0 0; flex: 1; ">
                    <div style="padding-bottom: 20px; max-height: 80vh; overflow: auto;">
                        <el-tree class="card-tree" :data="userData"  :props="treeProps" lazy :load="loadNode" default-expand-all></el-tree>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card class="box-card" style="margin: 0 20px 0 0; flex: 1; ">
                    <div slot="header" class="clearfix">
                        <span>用户频道栏目配置</span>
                    </div>
                    <div style="padding-bottom: 20px;">
                        <div style="font-size: 14px;">
                            <div>操作提示：</div>
                            <div>1. 展开左侧树形结构可查看系统现有的用户频道栏目配置</div>
                            <div>2. 选择频道列表或点击频道名称可配置管理该频道的用户</div>
                            <div>3. 点击用户名可配置该用户可管理的频道栏目</div>
                        </div>
                        <div class="title" style="margin-top: 50px;">您已选择频道栏目：<span style="display: inline-block; width: 120px;">{{ selectChannelName }}</span></div>
                        <div style="font-size: 14px;text-align: center;" class="element-input">
                            <el-autocomplete
                                class="inline-input"
                                v-model="params.channelName"
                                :fetch-suggestions="initChannelOption"
                                @change="channelChange"
                                placeholder="请输入内容"
                                popper-class="mars-autocomplete"
                                @select="handleSelect">
                                <template slot-scope="{ item }">
                                    <div :class="item.status == 2 ? 'EnDis' : ''">{{ item.name }} <span>{{ item.status == 2 ? '（已禁用）' : '' }}</span></div>
                                </template>
                            </el-autocomplete>
                            <span style="margin-left: 20px;">可选用户数： {{ this.transferData.length }}</span>
                            <span style="margin-left: 20px;">已选用户数： {{ this.transferValue.length }}</span>
                        </div>
                        <div style="margin-top: 20px;">
                            <el-transfer
                            class="element-transfer"
                            v-model="transferValue" 
                            :data="transferData"
                            :titles="['可选用户列表', '已选用户列表']"
                            ></el-transfer>
                        </div>
                        <div style="margin-top: 20px; text-align: center;">
                            <el-button size="medium"  type="primary" @click="saveData">设 置</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>

export default {
    name: 'channeAllocation',
    components: {},
    data() {
        return {
            params:{
                channelName:'',
                channelId: '',
                type: []
            },
            selectChannelName: '',
            channelTitle: '',
            channelOption: [],
            transferValue: [],
            treeDefaultKeys: [],
            ruleForm:{
                name: ''
            },
            treeProps:{
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
            userData: [
                {
                    label: '一级 1',
                    value: 1,
                    key: 1,
                    children: [
                        {
                            label: '二级 1-1',
                            preLabel: '一级 1',
                            value: 2,
                            key: 2,
                        }]
                },
                
            ],
            transferData:[
                // {label:'立刻就会官方', key:1},
            ],
            rules:{

            },
        }
    },
    mounted(){
       this.initUsetData()
    },
    methods: {
        initUsetData(){
            this.tableLoading = true
            let params = {
                cardId: '',
                account: "",
                name: "",
                pageNum: 1,
                pageSize: 10000,
                review: '',
                roleId: '',
                state: 1
            }
            this.$http.post(`${this.$api.server}/user/page`,params).then(res => {
                this.tableLoading = false
                if(res.code == 200) {
                    this.userData = res.data.records || []
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        loadNode(node, resolve){
            let data = node.data
            if (node.level == 1){
                this.$http.get(`${this.$api.server}/channel/userchannel/${data.id}`).then(res => {
                    if(res.code == 200) {
                        if (res.data && res.data.length == 0){
                            resolve([])
                        }
                        if (res.data){
                            resolve([...res.data])
                        }
                        // this.data = res.data.records
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }
            resolve([])
            // console.log(node, 'loadNode');
        },
        handleNodeClick(data){
            // console.log(data, 'handleNodeClick');
            // if (data.children && data.children.length) {
            //     this.channelTitle = data.label
            // } else {
            //     this.ruleForm.name = data.label
            //     this.channelTitle = data.preLabel
            // }
        },
        saveData(){
            console.log(this.transferValue);
            if (!this.params.channelId){
                this.$message.error('请您选择频道')
                return false
            }
            this.$confirm(`是否确认保存该设置？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    name: this.params.channelName,
                    id: this.params.channelId,
                    userId: this.$store.state.userId,
                    userList: this.transferValue,
                }
                this.$http.post(`${this.$api.server}/channel/adduser`, data).then(res => {
                    if(res.code == 200) {
                        this.initUsetData()
                        this.treeDefaultKeys = this.transferValue
                        this.$message({ message: `设置成功`, type: 'success' })
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }).catch(err => {})
        },
        // ----------- 频道搜索框 start----------
        handleSelect(value){
            this.params.channelName = value.name;
            this.params.channelId = value.id;
            this.selectChannelName = value.name
            this.transferData = this.userData.map(item =>{
                return {
                    label: item.name,
                    key: item.id
                }
            })
            this.initChannelUser(value.id)
        },
        initChannelUser(id){
            this.$http.get(`${this.$api.server}/channel/channeluser/${id}`).then(res => {
                if(res.code == 200) {
                    let list = res.data || []
                    this.transferValue = list.map(item => item.id)
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        channelChange(){
            // this.params.channelId = ''
        },
        initChannelOption(value, cd){
            let params = {
                name: value,
                status: 1,
                pageNum: 1,
                pageSize: 10,
            }
            this.$http.post(`${this.$api.server}/channel/page`, params).then(res => {
                let records = []
                if(res.code == 200) {
                    records = res.data.records || []
                    // 调用 callback 返回建议列表的数据
                    cd(records);
                } else {
                    this.$message.error(res.message)
                }
            })
        }
        // ----------- 频道搜索框 end----------
    }
}
</script>
<style lang="scss" scoped>
.channeAllocation{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .title{
        text-align: center;
        padding-bottom: 20px;
        color: #FFFFFF;
    }
    .el-card{
        /deep/ .el-card__header{
            background-color: rgba(#00F6FF, 0.3);
            color: #D8FBFD;
            border-color: #00F0FF;
            font-size: 18px;
            padding: 10px 20px;
        }
        background-color:  rgba(#031230, 0.3);
        border-color: rgba(#00F0FF, 0.5);
        color: #D8FBFD;
        display: flex;
        flex-direction: column;
    }
    .card-tree{
        background-color: transparent;
        color: #FFFFFF;
        /deep/ .is-current{
            color: #00F0FF;
            background-color: rgba(#031230, 1);
        }
        /deep/ .el-tree-node > div:hover{
            background-color: transparent;
        }
        /deep/ .el-tree-node__content{
            background-color: transparent
        }
    }
    .element-transfer{
        display: flex;
        justify-content: center;
        align-items: center;
        /deep/ .el-transfer-panel{
            // width: 300px
            flex: 1;
        }
    }
}

</style>