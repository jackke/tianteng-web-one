<!-- 站点管理 -->
<template>
    <div class="siteManage">
        <el-form class="element-input" :inline="true" ref="params" :model="params" size="medium">
            <el-form-item label="站点编号：">
               <el-input v-model.trim="params.code" placeholder="请输入站点号" clearable></el-input>
            </el-form-item>
            <el-form-item label="站点名称：">
               <el-input v-model.trim="params.name" placeholder="请输入站点名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="params.status" placeholder="请选择" popper-class="mars-select" style="width: 100px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="启用" :value="1"></el-option>
                    <el-option label="禁用" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item >
                <div style="display: flex;">
                    <el-button icon="el-icon-search" type="primary" @click="initData">查询</el-button>
                    <el-button icon="el-icon-plus" type="warning" @click="siteAdd">增加</el-button>
                    <el-button icon="el-icon-download" type="success" @click="dialogVisibleFile = true">导 入</el-button>
                    
                </div>
            </el-form-item>
        </el-form>
        <el-form class="element-input" :inline="true" ref="params" :model="params" size="medium">
            <el-form-item label="导出选项：">
                <el-radio-group v-model="exportStatue" @change="exportArray = []">
                    <el-radio :label="1">按结果</el-radio>
                    <el-radio :label="2">按配置</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="频道栏目：" v-if="exportStatue == 2">
                <el-cascader v-model="exportArray" :props="cascaderProps" style="width: 200px;" collapse-tags popper-class="element-cascader"></el-cascader>
            </el-form-item>
            <el-form-item >
                <el-popover
                    placement="top-start"
                    title="提示:"
                    width="200"
                    trigger="hover"
                    content="若需要栏目配置的站点序号请选择“按配置”导出">
                    <el-button slot="reference" icon="el-icon-printer" type="primary" @click="exportText">导 出</el-button>
                </el-popover>
            </el-form-item>
            <el-form-item >
                
                <!-- <el-button icon="el-icon-printer" style="margin-left: 20px" type="success">导 入</el-button> -->
            </el-form-item>
        </el-form>
       <div style="flex: 1;display: flex; flex-direction: column;">
            <el-table id="tablePrint" class="element-table" height="100%" v-loading="tableLoading" :data="tableData" element-loading-text="努力加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(4,42,75, 0.5)">
                <el-table-column type="index" label="序号"> </el-table-column>
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
                <el-table-column label="操作" width="260">
                    <template slot-scope="scope">
                        <el-button size="medium" type="primary" @click="siteExport(scope.row)">导出</el-button>
                        <el-button size="medium" type="primary" @click="siteEdit(scope.row)">编辑</el-button>
                        <el-button size="medium" type="danger" @click="siteDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <ComPagination style="margin-top: 20px;" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></ComPagination>
       </div>
       <el-dialog title="导入文件" :visible.sync="dialogVisibleFile" width="35%" :before-close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false">
            <el-form :model="ruleFormFile" :rules="rules" ref="ruleFormFile" label-width="100px"  class="element-input">
                <el-form-item label="文件类型：" required>
                    <el-radio-group v-model="ruleFormFile.fileType">
                        <el-radio label="site" style="margin-bottom: 10px;">导入站点表</el-radio><br/>
                        <el-radio label="minMaxT" style="margin-bottom: 10px;">月最低温最大极值</el-radio>
                        <el-radio label="maxMaxT" style="margin-bottom: 10px;">月最高温最大极值</el-radio>
                        <el-radio label="minMinT">月最低温最小极值</el-radio>
                        <el-radio label="maxMinT">月最高温最小极值</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文件列表：" prop="fileList">
                    <!-- `${this.$api.server}/site/import` -->
                    <el-upload
                        style="margin: 0 10px;"
                        ref="formFile"
                        class="upload-demo"
                        action="#"
                        :auto-upload="false"
                        :limit="1"
                        :file-list="ruleFormFile.fileList"
                        :on-change="handleAvatarSuccess"
                        :on-remove="handleAvatarRemove"
                        >
                        <el-button icon="el-icon-folder-opened" type="success">选取文件</el-button>
                        <div slot="tip" class="el-upload__tip" style="color: #eee;">站点只能上传xls/xlsx文件，且最大上传数量 1</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="handleClose">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitFormFile('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
       <el-dialog title="添加站点" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :close-on-click-modal="false" :modal-append-to-body="false" :append-to-body="false">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"  class="element-input">
                <el-form-item label="站点编号：" prop="code">
                    <el-input v-model="ruleForm.code" placeholder="请输入站点编号"></el-input>
                </el-form-item>
                <el-form-item label="站点名称：" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入站点名称"></el-input>
                </el-form-item>
                <!-- <el-form-item label="站点编号：" prop="resource">
                    <el-input v-model="ruleForm.name" placeholder="请输入站点编号"></el-input>
                </el-form-item>
                <el-form-item label="站点名称：" prop="resource">
                    <el-input v-model="ruleForm.name" placeholder="请输入站点名称"></el-input>
                </el-form-item> -->
                <el-form-item label="站点状态：" required>
                    <el-radio-group v-model="ruleForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注：">
                    <div style="line-height: 22px; color:#fff">如果新添加的站点已存在，将仅关联该站点和栏目一个栏目可以多次关联同一站点，解除关联请转到栏目配置</div>
                </el-form-item>
                <!-- <el-form-item label="用户备注：">
                    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item> -->
            </el-form>
            <div slot="footer" style="text-align: center;">
                <el-button size="medium" @click="handleClose">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { Loading } from 'element-ui';
import ComPagination from '@/components/comPagination.vue'

export default {
    name: 'siteManage',
    components: {ComPagination},
    data() {
        let _this = this
        return {
            dialogVisible: false,
            dialogVisibleFile: false,
            tableLoading: false,
            params:{
                name: "",
                code: '',
                status: '',
                pageNum: 1,
                pageSize: 10,
            },
            submitType: '',
            exportStatue: 1,
            exportArray: [],
            cascaderProps: { 
                multiple: true,
                lazy: true,
                multiple: true, 
                checkStrictly: false,
                lazyLoad (node, resolve) {
                    const { level } = node;
                    if (level == 0){
                        let params = {
                            name: '',
                            status: 1,
                            pageNum: 1,
                            pageSize: 9999,
                        }
                        _this.$http.post(`${_this.$api.server}/channel/page`, params).then(res => {
                            if(res.code == 200) {
                                let data = res.data.records || []
                                let records = data.map(item => ({
                                    value: item.id,
                                    label: item.name,
                                    ...item
                                }))
                                // 调用 callback 返回建议列表的数据
                                resolve(records);
                            } else {
                                _this.$message.error(res.message)
                            }
                        })
                    }
                    if (level == 1){
                        let params = {
                            channelName: '',
                            channelId: node.data.id,
                            name: "",
                            status: 1,
                            pageNum: 1,
                            pageSize: 9999,
                        }
                        _this.$http.post(`${_this.$api.server}/column/page`, params).then(res => {
                            if(res.code == 200) {
                                let data = res.data.records || []
                                let records = data.map(item => ({
                                    value:  item.id,
                                    label: item.name,
                                    ...item,
                                    leaf: 1
                                }))
                                // 调用 callback 返回建议列表的数据
                                resolve(records);
                            } else {
                                _this.$message.error(res.message)
                            }
                        })
                    }
                    if (level == 2){
                        resolve();
                    }

                }
            },
            ruleForm:{
                code: '',
                name: '',
                status: 1,
            },
            ruleFormFile:{
                fileType: 'site',
                fileList:[],
            },
            tableData: [],
            total: 0,
            rules:{
                code: [
                    { required: true, message: '请输入站点编号', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入站点名称', trigger: 'blur' },
                ],
                fileList:[
                    { required: true, 
                        validator: (rule, value, callback) => {
                            console.log(this.ruleFormFile);
                            
                            if (this.ruleFormFile.fileList.length == 0){
                                callback(new Error("请选择文件"))
                            }
                            callback();
                        }, 
                    trigger: 'change' },
                ]
            }
        }
    },
    created(){
        this.initData()
    },
    methods: {
        initData(){
            this.tableLoading = true
            this.$http.post(`${this.$api.server}/site/page`, this.params).then(res => {
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
            }
        },
        handleClose(){
            this.dialogVisible = false
            this.dialogVisibleFile = false
        },
        siteExport(row){
            const h = this.$createElement;
            this.$msgbox({
                title: '提示',
                message: h('p', null, [
                    h('span', null, '是否确认导出 '),
                    h('span', { style: 'color: #F56C6C' }, `${row.name}（${row.code}）`),
                    h('span', null, '站点？'),
                ]),
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.postFile(`${this.$api.server}/columnsite/exportsite`, {id: row.id}).then(res => {
                    // console.log(res);
                    if (res.status == 200){
                        let data = res.data
                        let blob = new Blob([data], {type: 'application/vnd.ms-excel;charset=utf-8'})
                        let fileName = decodeURI(res.headers['content-disposition'])
                        console.log(fileName, res);
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
            }).catch(err => {})
           
        },
        siteEdit(row){
            this.dialogVisible = true
            this.submitType = 'edit'
            this.ruleForm = {...row}
        },
        siteDelete(row){
            this.$confirm(`是否确认删除该站点？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(`${this.$api.server}/site/del?id=${row.id}`).then(res => {
                    if(res.code == 200) {
                        this.initData()
                        this.$message({ message: `删除成功`, type: 'success' })
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
                    this.dialogLoading = true
                    if(this.submitType == 'add'){
                        this.$http.post(`${this.$api.server}/site/save`, this.ruleForm).then(res => {
                            this.dialogLoading = false
                            if (res.code == 200){
                                this.handleClose()
                                this.initData()
                                this.$message({ message: '添加站点成功', type: 'success' })
                            } else {
                                this.$message.error(res.message)
                            }
                        }).catch((error) => {
                            this.dialogLoading = false
                            this.$message.error(error)
                        })
                    }
                    if(this.submitType == 'edit'){
                        this.$http.post(`${this.$api.server}/site/mod`, this.ruleForm).then(res => {
                            this.dialogLoading = false
                            if (res.code == 200){
                                this.handleClose()
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
        handleAvatarRemove(){
            this.ruleFormFile.fileList = []
        },
        handleAvatarSuccess(file, fileList){
            // console.log(file, fileList);
            this.ruleFormFile.fileList = fileList
        },
        // 导入确认
        submitFormFile(){
            this.$refs['ruleFormFile'].validate((valid) => {
                if (valid) {
                    this.dialogLoading = true
                    let {fileList, fileType} = this.ruleFormFile
                    let fileName = fileList[0]
                    let formData = new FormData()
                    formData.append('file', fileName.raw)
                    if(this.ruleFormFile.fileType == 'site'){
                        this.$http.post(`${this.$api.server}/site/import`, formData).then(res => {
                            this.dialogLoading = false
                            if (res.code == 200){
                                this.handleClose()
                                this.initData()
                                this.$message({ message: "站点导入成功", type: 'success' })
                            } else {
                                this.$message.error(res.message)
                            }
                        }).catch((error) => {
                            this.dialogLoading = false
                            this.$message.error(error)
                        })
                    } else {
                        formData.append('type',fileType)
                        this.$http.post(`${this.$api.server}/site/importMMT`, formData).then(res => {
                            this.dialogLoading = false
                            if (res.code == 200){
                                this.handleClose()
                                this.initData()
                                this.$message({ message: res.data, type: 'success' })
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
        // 导出
        exportText(){
            if (this.exportArray.length == 0 && this.exportStatue == 2) {
                this.$message.error('请选择频道和栏目')
                return false
            }
            let dataUrl = []
            if (this.exportStatue == 1) {
                let params = {...this.params, typeId: this.exportStatue}
                dataUrl = [`${this.$api.server}/site/export`, params]
            }
            if (this.exportStatue == 2) {
                let arr = this.exportArray.map(item => item[1])
                dataUrl = [`${this.$api.server}/column/export`,{ arr: String(arr) }]
            }
            
            this.$confirm(`是否确认导出？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.getFile(...dataUrl).then(res => {
                    console.log(res);
                    if (res.status == 200) {
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
            }).catch(err => {})
        },
        // 导入
        siteImport(){

        }
    }
}
</script>
<style lang="scss" scoped>
.siteManage{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    /deep/ .el-upload-list__item{
       background-color: #fff;
       padding: 10px 0;
    }
}

</style>