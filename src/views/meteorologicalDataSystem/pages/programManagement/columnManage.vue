<!-- 栏目管理 -->
<template>
    <div class="columnManage">
        <el-form class="element-input" :inline="true" ref="params" :model="params" label-width="100px" size="medium">
            <el-form-item label="频道名称：">
                <el-autocomplete
                    class="inline-input"
                    v-model="params.channelName"
                    :fetch-suggestions="querySearch"
                    @change="channelChange"
                    placeholder="请输入内容"
                    popper-class="mars-autocomplete"
                    @select="handleSelect">
                    <template slot-scope="{ item }">
                        <div :class="item.status == 2 ? 'EnDis' : ''">{{ item.name }} <span>{{ item.status == 2 ? '（已禁用）' : '' }}</span></div>
                    </template>
                </el-autocomplete>
                <!-- <el-input v-model="params.description" placeholder="请输入频道名称" clearable></el-input> -->
            </el-form-item>
            <el-form-item label="栏目名称：">
                <el-input v-model="params.name" placeholder="请输入栏目名称" clearable></el-input>
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
                <el-button icon="el-icon-plus" type="warning" @click="onAdd">添 加</el-button>
            </el-form-item>
        </el-form>
        <div style="flex: 1;display: flex; flex-direction: column;">
            <el-table class="element-table" height="100%" v-loading="tableLoading" :data="tableData" empty-text="请先切换“频道名称”进行查询数据" element-loading-text="努力加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(4,42,75, 0.5)">
                <el-table-column prop="sort" label="顺序" style="text-align: center;"> </el-table-column>
                <el-table-column prop="channelName" label="所属频道"> </el-table-column>
                <el-table-column prop="name" label="栏目名称"> </el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column prop="state" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1" style="color: #23D26D;">已启用</span>
                        <span type="text" v-if="scope.row.status == 2" style="color: #F95555">已禁用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="$changeTime.createTimeFn"> </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-dropdown @command="(val) =>handleCommand(val, scope.row)">
                            <el-button type="primary" >
                                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="dialogVisible">编辑栏目</el-dropdown-item>
                                <el-dropdown-item command="dialogVisibleOne" >编辑列表</el-dropdown-item>
                                <el-dropdown-item command="dialogVisibleElement" divided>要 素</el-dropdown-item>
                                <el-dropdown-item command="dialogVisibleSite">站 点</el-dropdown-item>
                                <el-dropdown-item command="columnTransfer">转 移</el-dropdown-item>
                                <el-dropdown-item command="columnDelete">删 除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!-- <el-button size="small"  type="success" @click="userEnDis(scope.row, 1)" v-if="scope.row.state == 2">启用</el-button>
                        <el-button size="small"  type="danger" @click="userEnDis(scope.row, 2)" v-if="scope.row.state == 1">禁用</el-button> -->
                        <!-- <el-button size="medium" type="primary" @click="columnEdit(scope.row, 'dialogVisible', 1)">编辑</el-button>
                        <el-button size="medium" type="primary" @click="columnEdit(scope.row, 'dialogVisibleOne', 2)">编辑1</el-button>
                        <el-button size="medium" type="primary" @click="columnEdit(scope.row, 'dialogVisibleElement', 3)">要素</el-button>
                        <el-button size="medium" type="primary" @click="columnEdit(scope.row, 'dialogVisibleSite', 4)">站点</el-button>
                        <el-button size="medium" type="primary" @click="columnTransfer(scope.row)">转移</el-button>
                        <el-button size="medium" type="danger" @click="columnDelete(scope.row)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <ComPagination style="margin-top: 20px;" @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="total"></ComPagination>
        </div>
         <!--  编辑栏目 -->
        <el-dialog class="columnDialog" :title="type == 'add' ? '添加栏目' : '编辑栏目'" :visible.sync="dialogVisible" width="90%" :before-close="handleClose" :close-on-click-modal="false" :append-to-body="true">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  :inline="true" label-width="100px" class="element-input">
                <el-form-item label="频道名称：" prop="channelName" >
                    <el-autocomplete
                        v-show="type == 'add'"
                        style="width: 100%;"
                        class="inline-input"
                        v-model="ruleForm.channelName"
                        :fetch-suggestions="querySearch"
                        placeholder="请选择频道"
                        popper-class="mars-autocomplete"
                        @select="handleSelectChannel">
                        <template slot-scope="{ item }">
                            <div>{{ item.name }}</div>
                        </template>
                    </el-autocomplete>
                    <div v-show="type =='edit'" style="color: #fff">{{ ruleForm.channelName }}</div>
                </el-form-item>
                <el-form-item label="栏目名称：" prop="name" >
                    <el-input v-model="ruleForm.name" placeholder="请输入频道名称"></el-input>
                </el-form-item>
                <el-form-item label="数据类型：" prop="townTypeId">
                    <el-select v-model="ruleForm.townTypeId" @change="townTypeChange" placeholder="请选择" popper-class="mars-select" style="width: 100%;">
                        <el-option v-for="(item, index) in typeOption" :key="index" :label="item.typeName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时次：" prop="timeType">
                    <el-select v-model="ruleForm.timeType" placeholder="请选择" popper-class="mars-select" style="width: 100%;">
                        <el-option v-for="(item, index) in timeOption" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" required>
                    <el-radio-group v-model="ruleForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item label="项目列表：" prop="element" style="width: 45%">
                    <div style="color: #fff;">提示：请选择数据类型。</div>
                    <!-- <el-checkbox-group v-model="ruleForm.element">
                        <el-checkbox v-for="(item, index) in listElement" :key="index" :label="item.value" name="type">{{ item.name }}</el-checkbox>
                    </el-checkbox-group> -->
                    <div>
                        <el-button class="button-s"  size="small" icon="el-icon-arrow-up" type="primary" :disabled="rightTransferValue.length == 0" @click="arrowUp('rightTransferValue','element')"></el-button>
                        <el-button class="button-x"  size="small" icon="el-icon-arrow-down" :disabled="rightTransferValue.length == 0"  type="primary" @click="arrowDown('rightTransferValue', 'element')"></el-button>
                    </div>
                    <el-transfer
                        class="column-trans"
                        v-model="ruleForm.element" 
                        :data="transferEleList"
                        target-order="unshift"
                        @right-check-change="(value) => transRightChange(value, 'rightTransferValue')"
                        :titles="['可选项目', '已选项目']"
                    ></el-transfer>
                </el-form-item>
                <el-form-item label="城市列表：" prop="element" style="width: 52%;">
                    <div style="display: flex;">
                        <el-form-item   style="width: 50%;">
                            <el-input v-model="siteValue" placeholder="请输入城市站点" clearable style="width: 260px;" @change="siteData(siteValue)">
                                <el-button slot="append" size="small" @click="siteData(siteValue)">查询</el-button>
                                <el-button slot="append" size="small" type="primary" >导入</el-button>
                            </el-input>
                            <div style="color: #fff;"> 提示：请选择数据类型。 </div>
                        </el-form-item>
                        <el-form-item  label="设置别名：" style="width: 50%">
                            <el-input v-model="propsName" placeholder="请输入设置别名" clearable style="width:180px">
                                <el-button slot="append" size="small" type="primary" :disabled="siteRightTransferValue.length == 0" @click="propsClick">确定</el-button>
                            </el-input> 
                        </el-form-item>
                    </div>
                    <div>
                        <el-button  class="button-s-one" size="small" icon="el-icon-arrow-up" type="primary" :disabled="siteRightTransferValue.length == 0" @click="arrowUp('siteRightTransferValue', 'siteRef')"></el-button>
                        <el-button  class="button-x-one" size="small" icon="el-icon-arrow-down" :disabled="siteRightTransferValue.length == 0"  type="primary" @click="arrowDown('siteRightTransferValue', 'siteRef')"></el-button>
                    </div>
                    <el-transfer
                        class="column-trans"
                        v-model="ruleForm.siteList" 
                        :data="transferSiteList"
                        target-order="unshift"
                        ref="refTransfer"
                        :props="{
                            key: 'id',
                        }"
                        @right-check-change="(value) => transRightChange(value, 'siteRightTransferValue')"
                        :titles="['可选城市', '已选城市']"
                        >
                        <span slot-scope="{ option }">{{ option.name }}{{ option.siteAlias ? `(${option.siteAlias})` : '' }}</span>
                </el-transfer>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input type="textarea" v-model="ruleForm.description" placeholder="描述"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center;">
                <el-button size="small" @click="handleClose">取 消</el-button>
                <el-button size="small" type="primary" @click="submitForm" :loading="dialogLoading">确 认</el-button>
            </div>
        </el-dialog>
        <!--  排序 -->
        <el-dialog title="频道排序" :visible.sync="dialogVisibleSort" width="30%" :before-close="handleClose" :close-on-click-modal="false" :append-to-body="true">
            <div style="color: #6EA4B2;position: relative; top: -15px;z-index: 10;">提示：拖动下方列表进行排序。</div>
            <div style="display: flex; max-height: 600px; overflow: auto">
                <div style="width: 50px;">
                    <div  v-for="(item, index) in tableDataSort" :key="index" class="list-sort"> {{ index + 1 }}</div>
                </div>
                <draggable style="flex: 1;" v-model="tableDataSort" @start="drag=true" @end="drag=false">
                    <div v-for="(item, index) in tableDataSort" :key="index" class="list-sort"> {{ item.name}}</div>
                </draggable>
            </div>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="handleClose">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitSort" :loading="dialogLoading">确 认</el-button>
            </div>
        </el-dialog>
        <!-- 转移栏目 -->
        <el-dialog title="转移栏目" :visible.sync="dialogVisibleTransfer" width="40%" :before-close="handleClose" :close-on-click-modal="false" :append-to-body="true">
            <el-form :model="transferForm" :rules="rules" ref="ruleForm" label-width="100px" class="element-input">
                <el-form-item label="栏目名称：" prop="name">
                    <div style="color: #fff">{{ transferForm.name}}</div>
                </el-form-item>
                <el-form-item label="频道名称：" prop="name">
                    <el-autocomplete
                        style="width: 100%;"
                        class="inline-input"
                        v-model="transferForm.channelName"
                        :fetch-suggestions="querySearch"
                        placeholder="请选择频道"
                        popper-class="mars-autocomplete"
                        @select="handleSelectTransfer">
                        <template slot-scope="{ item }">
                            <div>{{ item.name }}</div>
                        </template>
                    </el-autocomplete>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="handleClose">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitTransfer" :loading="dialogLoading">确 认</el-button>
            </div>
        </el-dialog>
         <!-- 添加要素 -->
         <el-dialog title="项目列表" :visible.sync="dialogVisibleElement" width="40%" :before-close="handleClose" :close-on-click-modal="false" :append-to-body="true">
                <el-descriptions>
                    <el-descriptions-item label="频道名称">{{ ruleForm.channelName}}</el-descriptions-item>
                    <el-descriptions-item label="栏目名称">{{  ruleForm.name}}</el-descriptions-item>
                    <el-descriptions-item label="数据类型"> 
                        <el-form :model="ruleForm" class="element-input">
                            <el-form-item>
                                <el-select v-model="ruleForm.townTypeId" @change="townTypeChange" placeholder="请选择" popper-class="mars-select" style="width: 100%;">
                                    <el-option v-for="(item, index) in typeOption" :key="index" :label="item.typeName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-descriptions-item>
                </el-descriptions>
                 <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="element-input">
                    <el-form-item prop="element">
                         <div style="color:#fff" >
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                            <div style="margin: 15px 0;"></div>
                            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="city in transferEleList" :label="city" :key="city.key">{{city.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>
                </el-form>
                <el-divider></el-divider>
                <div>
                    <div style="color:#fff;margin: 10px 0;">提示：可拖动下方标签进行排序。</div>
                    <div>
                        <draggable>
                            <el-tag
                                v-for="tag in checkedCities"
                                :key="tag.label"
                                style="margin: 0 10px 10px 0; background-color:#193454; color:#00F0FF;border-color: #00F0FF;"
                                >
                                {{tag.label}}
                            </el-tag>
                        </draggable>
                    </div>
                </div>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="handleClose">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitForm" :loading="dialogLoading">确 认</el-button>
            </div>
        </el-dialog>
         <!-- 城市站点 -->
         <el-dialog title="项目列表" :visible.sync="dialogVisibleSite" width="50%" :before-close="handleClose" :close-on-click-modal="false" :append-to-body="true">
                <el-descriptions :column="2">
                    <el-descriptions-item label="频道名称">{{ ruleForm.channelName}}</el-descriptions-item>
                    <el-descriptions-item label="栏目名称">{{ ruleForm.name}}</el-descriptions-item>
                    <el-descriptions-item label="数据类型"> {{ townTypeIdFn('', '', ruleForm.townTypeId)}} </el-descriptions-item>
                    <el-descriptions-item label="时次">{{ ruleForm.timeType }}</el-descriptions-item>
                </el-descriptions>
                 <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="element-input" size="medium">
                    <el-form-item label="城市站点：">
                        <el-input v-model="siteValue" placeholder="请输入站点名称" clearable style="width: 240px;" @change="siteData"> </el-input>
                        <el-input v-model="siteCode" placeholder="请输入站点编号" clearable style="width: 240px;" @change="siteData"> </el-input>
                        <el-button type="primary" @click="siteData" style="margin-left: 10px;">查 询</el-button>
                        <el-button type="primary" >导 入</el-button>
                    </el-form-item>
                    <el-form-item >
                        <el-table ref="tableSiteList" class="element-table" max-height="300px" v-loading="tableLoading" :data="transferSiteList" element-loading-text="努力加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(4,42,75, 0.5)">
                            <el-table-column type="index" label="顺序" width="55"> </el-table-column>
                            <el-table-column prop="name" label="名称"> </el-table-column>
                            <!-- <el-table-column prop="code" label="编码"> </el-table-column> -->
                            <el-table-column prop="siteAlias" label="别名">
                                <template slot-scope="props">
                                    <el-input v-model="props.row.siteAlias" placeholder="请输入站点别名" clearable> </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="props">
                                    <el-button type="primary" @click="siteSave(props.row)" :loading="dialogLoading">添加</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-form>
                <el-divider></el-divider>
                <div>
                    <div style="color:#fff;margin: 10px 0;">提示：可拖动下方标签进行排序。</div>
                    <div>
                        <draggable>
                            <el-tag
                                v-for="tag in multipleSelection"
                                :key="tag.label"
                                closable
                                @close="tagDelete(tag)"
                                style="margin: 0 10px 10px 0; background-color:#193454; color:#00F0FF;border-color: #00F0FF;"
                                >
                                {{tag.siteAlias}}
                            </el-tag>
                        </draggable>
                    </div>
                </div>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="handleClose">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitSiteSort" :loading="dialogLoading">确 认</el-button>
            </div>
        </el-dialog>
        <!--  编辑栏目1 -->
        <el-dialog class="columnDialog" :title="type == 'add' ? '添加栏目' : '编辑栏目'" :visible.sync="dialogVisibleOne" width="30%" :before-close="handleClose" :close-on-click-modal="false" :append-to-body="true">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="100px" class="element-input">
                <el-form-item label="频道名称：" prop="channelName" >
                    <el-autocomplete
                        style="width: 100%;"
                        class="inline-input"
                        v-model="ruleForm.channelName"
                        :fetch-suggestions="querySearch"
                        placeholder="请选择频道"
                        popper-class="mars-autocomplete"
                        @select="handleSelectChannel">
                        <template slot-scope="{ item }">
                            <div>{{ item.name }}</div>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item label="栏目名称：" prop="name" >
                    <el-input v-model="ruleForm.name" placeholder="请输入频道名称"></el-input>
                </el-form-item>
                <el-form-item label="数据类型：" prop="townTypeId">
                    <el-select v-model="ruleForm.townTypeId" @change="townTypeChange" placeholder="请选择" popper-class="mars-select" style="width: 100%;">
                        <el-option v-for="(item, index) in typeOption" :key="index" :label="item.typeName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时次：" prop="timeType">
                    <el-select v-model="ruleForm.timeType" placeholder="请选择" popper-class="mars-select" style="width: 100%;">
                        <el-option v-for="(item, index) in timeOption" :key="index" :label="item" :value="item"></el-option>
                        <!-- <el-option label="12小时" value="12"></el-option>
                        <el-option label="24小时" value="24"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" required>
                    <el-radio-group v-model="ruleForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item label="描述：">
                    <el-input type="textarea" v-model="ruleForm.description" placeholder="描述"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="handleClose">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitForm" :loading="dialogLoading">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
import ComPagination from '@/components/comPagination.vue'

export default {
    name: 'columnManage',
    components: {draggable,ComPagination,},
    data() {
        return {
            type: 'add',
            channelOptions:[],
            params:{
                channelName: '',
                channelId: '',
                name: "",
                status: '',
                pageNum: 1,
                pageSize: 10,
            },
            checkAll: false,
            checkedCities: [],
            total: 0,
            tableLoading: false,
            dialogLoading: false,
            typeOption: [],
            timeOption: [],
            tableData: [],
            tableDataSort: [],
            multipleSelection: [],
            dialogVisible: false,
            dialogVisibleSort: false,
            dialogVisibleTransfer: false,
            dialogVisibleOne: false,
            dialogVisibleElement: false,
            dialogVisibleSite: false,
            isIndeterminate: false,
            ruleForm:{
                channelName: '',
                channelId: '',
                description: "",
                name: "",
                timeType: '',
                element: [],
                siteList: [],
                townType: [],
                townTypeId: '',
                status: 1,
                userId: this.$store.state.userId
            },
            transferForm:{
                channelName: '',
                channelId: '',
            },
            transferEleList:[],
            transferSiteList:[],
            rightTransferValue: [],
            siteRightTransferValue: [],
            propsName: '',
            siteValue: '',
            siteCode: '',
            rules:{
                channelName: [
                    { required: true, message: '请选择频道', trigger: 'change' },
                ],
                name: [
                    { required: true, message: '请输入栏目名称', trigger: 'blur' },
                ],
                townTypeId: [
                    { required: true, message: '请选择数据类型', trigger: 'change' },
                ],
                timeType: [
                    { required: true, message: '请选择时次', trigger: 'change' },
                ],
                // element: [
                //     { required: true, message: '请选择项目', trigger: 'change' },
                // ],
                element: [
                    { required: true,
                        validator: (rule, value, callback) => {
                            if (this.checkedCities.length == 0){
                                callback(new Error('请选择项目'))
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
        this.townTypeOption()
        this.querySearch('', (list) => {
            this.params.channelId = list[0].id
            this.params.channelName = list[0].name
            this.initData()
        })
    },
    mounted(){
       
    },
    methods: {
       
        initData(){
            if (!this.params.channelId){
                this.$alert('请先选择“频道名称”进行查询数据', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {})
                return false
            }
            this.tableLoading = true
            this.$http.post(`${this.$api.server}/column/page`, this.params).then(res => {
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
                channelName: '',
                channelId: '',
                description: "",
                name: "",
                timeType: '',
                element: [],
                siteList: [],
                townType: [],
                townTypeId: '',
                status: 1,
            }
            this.transferEleList = []
        },
        onDataSort(){
            this.dialogVisibleSort = true
            this.tableDataSort = [...this.tableData]
        },
        handleClose(){
            this.dialogVisible = false
            this.dialogVisibleSort = false
            this.dialogVisibleTransfer = false
            this.dialogVisibleOne = false
            this.dialogVisibleElement = false
            this.dialogVisibleSite = false
            this.checkAll = false
            this.checkedCities = []
        },
        columnEdit(row, dialogVisible, num){
            this.type = 'edit'
            this.townTypeChange(row.townTypeId)
            this[dialogVisible] = true
            this.$http.get(`${this.$api.server}/column/info/${row.id}`).then(res => {
                if(res.code == 200) {
                    // 找到transferEleList 原型对象 才能返显
                    // 1、 项目
                    let keyList = []
                    let checkedCities = []
                    let keyArr = (res.data.element).split(',')
                    keyArr.forEach(items => {
                        this.transferEleList.forEach(item => {
                            if (item.key == items){
                                keyList.push(item.key)
                                checkedCities.push(item)
                            }
                        })
                    })
                     // 2、城市
                    let siteList = res.data.siteList.map(item => item.siteId)
                    
                    this.ruleForm = {
                        ...res.data,
                        siteList,
                        element: keyList
                    }
                    // 3、项目 2
                    this.checkedCities = checkedCities
                    this.handleCheckedCitiesChange(checkedCities)

                    // setTimeout(() => {
                    //     this.transferSiteList.forEach(item => {
                    //         res.data.siteList.forEach(sitem => {
                    //             if (item.id == sitem.siteId){
                    //                 item.siteAlias = sitem.siteAlias
                    //             }
                    //         })
                    //     })
                    // },1000)

                    // 站点
                    if (num == 4){
                        this.siteData()
                        this.columnsiteList(row)
                    }
                } else {
                    this.$message.error(res.message)
                }
            })
        },

        // 全选
        handleCheckAllChange(val) {
            let cityOptions = this.transferEleList
            this.checkedCities = val ? cityOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.checkedCities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.transferEleList.length;
        },
        columnsiteList(row){
            let data = {
                columnId: row.id,
                siteAlias: '',
            }
            this.$http.post(`${this.$api.server}/columnsite/list`, data).then(res => {
                if(res.code == 200) {
                    this.multipleSelection = res.data || []
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        tagDelete(row){
            this.$confirm('确认删除该站点吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(`${this.$api.server}/columnsite/del?id=${row.id}`).then(res => {
                    if(res.code == 200) {
                        this.columnsiteList(this.ruleForm)
                        this.$message({ message: '删除成功', type: 'success' })
                    } else {
                        this.$message.error(res.message)
                    }
                })
            }).catch(err => {})
        },
        siteSave(row){
            if (!String(row.siteAlias).trim()){
                this.$message.error('请输入站点别名');
                return false
            }
            console.log(this.ruleForm);
            this.dialogLoading = true
            let params = {
                ...row,
                siteId: row.id,
                columnId: this.ruleForm.id,
            }
            this.$http.post(`${this.$api.server}/columnsite/save`, params).then(res => {
                this.dialogLoading = false
                if(res.code == 200) {
                    this.multipleSelection.push(row);
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        columnTransfer(row){
            this.dialogVisibleTransfer = true
            this.transferForm = {...row}
        },
        columnDelete(row){
            this.$confirm('确认删除该频道吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(`${this.$api.server}/column/del?id=${row.id}`).then(res => {
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
        // transfer 右边选中的结果
        transRightChange(value, dataType){
            console.log(value, 'rightPanel');
            this[dataType] = value
        },
        // 上升排序
        arrowUp(dataType, ruleType){
            let arr = []
            let indexArr = []
            this[dataType].forEach((items) => {
                this.ruleForm[ruleType].forEach((item, index) => {
                    if (items === item){
                        arr.push(...this.ruleForm[ruleType].splice(index, 1))
                        indexArr.push(index)
                    }
                })
            })
            let sortIndexArr = indexArr.sort((a,b) => a - b)
            this.ruleForm[ruleType].splice(sortIndexArr[0] - 1, 0, ...arr)
        },
        // 下降排序
        arrowDown(){
            let arr = []
            let indexArr = []
            this.rightTransferValue.forEach((items) => {
                this.ruleForm.element.forEach((item, index) => {
                    if (items === item){
                        arr.push(...this.ruleForm.element.splice(index, 1))
                        indexArr.push(index)
                    }
                })
            })
            let sortIndexArr = indexArr.sort((a,b) => a - b)
            this.ruleForm.element.splice(sortIndexArr[0] + 1, 0, ...arr)
        },
        // 更多操作
        handleCommand(val, row){
            console.log(val, row);
            if (val == 'columnDelete' || val == 'columnTransfer') {
                this[val](row)
            } else {
                let column = {
                    dialogVisible: 1,
                    dialogVisibleOne: 2,
                    dialogVisibleElement: 3,
                    dialogVisibleSite: 4
                }
                this.columnEdit(row, val, column[val])
            }
        },
        // 编辑新建 按钮
        submitForm(){
            // console.log(this.$refs.refTransfer.$refs.rightPanel.data);
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    let data = {...this.ruleForm,  userId: this.$store.state.userId}
                    // 项目要素 参数
                    let checkedCitiesList = this.checkedCities.map(item => item.key)
                    data.element = String(checkedCitiesList)

                    // let siteList = this.$refs.refTransfer.$refs.rightPanel.data
                    let siteList = []
                    let siteRef = siteList.map((item, index) => {
                        return {
                            sort: index + 1,
                            siteId: item.id,
                            siteAlias: item.siteAlias
                        }
                    })
                    data.siteList = siteRef
                    this.dialogLoading = true
                    if (this.type == 'edit'){
                        this.$http.post(`${this.$api.server}/column/mod`, data).then(res => {
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
                        this.$http.post(`${this.$api.server}/column/save`, data).then(res => {
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
        // 城市站点添加
        submitSiteSort(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    console.log(123123,  this.multipleSelection, this.ruleForm);
                    let data = {
                        columnId: this.ruleForm.id,
                        sortIds: this.multipleSelection.map(item => item.id)
                    }

                    this.dialogLoading = true
                    this.$http.post(`${this.$api.server}/columnsite/sort`, data).then(res => {
                        this.dialogLoading = false
                        if(res.code == 200) {
                            this.initData()
                            this.handleClose()
                            this.$message({ message: '修改成功', type: 'success' })
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                } 
            })
        },
        // 获取项目列表
        townTypeChange(value){
            // this.ruleForm.townType = this.typeOption.find(item => item.id == value).typeName
            /** 项目类型 **/
            this.ruleForm.element = []
            let typeItem = this.typeOption.filter((item) => {
                if (item.id == value){
                    return item
                }
            })
            this.ruleForm.townType = typeItem[0].typeName
            let reg = new RegExp(/ele\d+Name/, 'i')
            let listKey = []
            for (const key in typeItem[0]) {
                if (key.match(reg)){
                    listKey.push(key)
                }
            }
            let listElement = []
            listKey.forEach(item => {
                if (typeItem[0][item]){
                    listElement.push({value: item, label: typeItem[0][item], key: item})
                }
            })
            this.transferEleList = listElement
            /** 项目类型 end **/
            // this.siteData('')
            /** 时次类型 **/
            let obj = this.typeOption.find(item => item.id == value)
            this.ruleForm.timeType = ''
            if (obj.time){
                this.timeOption = obj.time.split(',')
            }
            //初始化
            this.checkedCities = []
            this.checkAll = false
            this.isIndeterminate = false
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
        // 转移栏目
        submitTransfer(){
            this.dialogLoading = true;
            let data = {
                columnId: this.transferForm.id,
                newChannelId: this.transferForm.channelId
            }
            this.$http.post(`${this.$api.server}/column/transfer`, data).then(res => {
                this.dialogLoading = false
                if(res.code == 200) {
                    this.initData()
                    this.handleClose()
                    this.$message({ message: '转移栏目成功', type: 'success' })
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        // 数据类型
        townTypeOption(){
            let params = {
                pageNum: 1,
                pageSize: 99,
                typeName: ""
            }
            this.$http.post(`${this.$api.server}/town/type/page`, params).then(res => {
                if(res.code == 200) {
                    this.typeOption = res.data.records || []
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        // 频道查询
        querySearch(queryString, cb) {
            let params = {
                name: queryString,
                status: 1,
                pageNum: 1,
                pageSize: 99,
            }
            let records = []
            this.$http.post(`${this.$api.server}/channel/page`, params).then(res => {
                if(res.code == 200) {
                    records = res.data.records || []
                    // 调用 callback 返回建议列表的数据
                    cb(records);
                } else {
                    this.$message.error(res.message)
                }
            })
           
        },
        // 站点查询
        siteData(name){
            // console.log( this.ruleForm);
            let params = {
                name: this.siteValue,
                code: this.siteCode,
                columnId: this.ruleForm.id,
                status: 1,
                pageNum: 1,
                pageSize: 99,
            }
            this.$nextTick(() => {
                // this.transferSiteList = [...this.$refs.refTransfer.$refs.rightPanel.data]
                this.$http.post(`${this.$api.server}/site/page`, params).then(res => {
                    if(res.code == 200) {
                        let list = res.data.records || []
                        let transferSiteList = list.map(item => {
                            item.siteAlias = '';
                            return item;
                        })
                        this.transferSiteList = transferSiteList
                    } else {
                        this.$message.error(res.message)
                    }
                })
            })
            
        },
        // 站点别名
        propsClick(){
            let rightList = this.$refs.refTransfer.$refs.rightPanel.data || []
            rightList.forEach(item => {
                this.siteRightTransferValue.forEach(siteItem => {
                    if (item.id == siteItem){
                        item.siteAlias = this.propsName
                    }
                })
            })
        },
        channelChange(){
            this.params.channelId = '';
        },
        handleSelect(value){
                this.params.channelName = value.name;
                this.params.channelId = value.id;
                this.initData()
        },
        handleSelectChannel(value){
                this.ruleForm.channelName = value.name;
                this.ruleForm.channelId = value.id;
        },
        handleSelectTransfer(value){
                this.transferForm.channelName = value.name;
                this.transferForm.channelId = value.id;
        },
        townTypeIdFn(row, props, value){
            // console.log(this.typeOption, this.typeOption.find(item => item.id == value));
            if (value){
                return this.typeOption.find(item => item.id == value).typeName
            }
        },
        // timeTypeFn(row, props, value){
        //     console.log(this.timeOption, this.timeOption.find(item => item == value));
        //     if (value){

        //         return this.timeOption.filter(item => item == value)
        //     }
        // },
        
    }
}
</script>
<style lang="scss" scoped>
.columnManage{
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
/deep/ .el-checkbox{
    color: #fff;
}
/deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
    color: rgba(0, 240, 255, 0.8);;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: rgba(0, 240, 255, 0.8);;
    border-color: rgba(0, 240, 255, 0.8);;
}
.columnDialog{
    /deep/ .el-transfer-panel .el-transfer-panel__header{
        background-color:#327278;
        color: #fff;
    }
    /deep/ .el-transfer-panel{
        background-color: transparent;
        border: 1px solid rgba(#00F0FF, 0.5);
    }
    /deep/ .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label{
        span{
            color: #fcfcfc;
        }
        color: #fff;
    }
    /deep/ .el-transfer-panel__item.el-checkbox{
        color: #fcfcfc;
    }
    .button-s{
        width: 50px;
        position: absolute;
        top: 34%;
        left: 51.5%;
    }
    .button-x{
        width: 50px;
        margin: 0;
        position: absolute;
        top: 66%;
        left: 51.5%;
    }
    .button-s-one{
        width: 50px;
        position: absolute;
        top: 40%;
        left: 51.5%;
    }
    .button-x-one{
        width: 50px;
        margin: 0;
        position: absolute;
        top: 70%;
        left: 51.5%;
    }
  
}

</style>