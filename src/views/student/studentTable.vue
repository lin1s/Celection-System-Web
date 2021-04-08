<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="searchKey" placeholder="请选择">
        <el-option
          v-for="item in searchOptions"
          :value="item.key"
          :label="item.label"
          :key="item.key"
        />
      </el-select>
      <el-input
        v-model="searchValue"
        placeholder="请输入搜索内容"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="学号" align="center">
        <template slot-scope="scope">
          {{ scope.row.studentID }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.studentName }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope, $index">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible" :title="textMap[dialogStatus]">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="学号" prop="title">
          <el-input v-model="temp.studentID" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="姓名" prop="title">
          <el-input v-model="temp.studentName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            v-model="temp.sex"
            class="filter-item"
            placeholder="请选择性别"
          >
            <el-option
              v-for="item in SexTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码" prop="title">
          <el-input v-model="temp.phone" placeholder="请输入电话号码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script>
import {
  getStudentList,
  addStudent,
  delStudent,
  updateStudent,
} from "@/api/student";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const SexTypeOptions = [
  { key: "男", display_name: "男" },
  { key: "女", display_name: "女" },
];

const SexTypeKeyValue = SexTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      allList: null,
      listLoading: true,
      dialogFormVisible: false,
      SexTypeOptions,
      temp: {
        studentID: undefined,
        studentName: undefined,
        sex: "",
        phone: undefined,
        LastUpdateBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      },
      searchOptions: [
        { label: "", key: "" },
        { label: "学号", key: "studentID" },
        { label: "姓名", key: "studentName" },
      ],
      searchKey: null,
      searchValue: null,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新建",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //初始化数据
    fetchData() {
      this.listLoading = true;
      getStudentList().then((response) => {
        this.list = response.data;
        this.allList = response.data;
        this.listLoading = false;
      });
    },

    //前端搜索
    handleFilter() {
      if (this.checkNull(this.searchKey) && this.checkNull(this.searchValue)) {
        this.listLoading = true;
        let searchValue = this.searchValue;
        this.list = this.allList.filter(function (allList) {
          let searchField = {
            studentID: allList.studentID,
            studentName: allList.studentName,
          };
          return Object.keys(searchField).some(function (key) {
            return String(allList[key]).toLowerCase().indexOf(searchValue) > -1;
          });
        });
        this.listLoading = false;
      } else if (
        this.checkNull(this.searchKey) ||
        this.checkNull(this.searchValue)
      ) {
        this.$notify({
          title: "错误",
          message: "请输入查询内容",
          type: "error",
          duration: 2000,
        });
      } else {
        this.list = this.allList;
      }
    },

    checkNull(value) {
      if (value === "" || value === null || value === undefined) {
        return false;
      } else {
        return true;
      }
    },

    //创建弹窗并设置为更新
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateStudent(tempData)
            .then((response) => {
              if (response.code === 20000) {
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                  duration: 2000,
                });
                this.fetchData();
              }
            })
            .catch((response) => {
              this.$notify({
                title: "错误",
                message: response.message,
                type: "error",
                duration: 2000,
              });
            });
        }
      });
    },

    //添加信息
    resetTemp() {
      this.temp = {
        studentID: undefined,
        studentName: undefined,
        sex: "",
        phone: undefined,
        LastUpdateBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          addStudent(this.temp)
            .then((response) => {
              if (response.code === 20000) {
                this.$notify({
                  title: "成功",
                  message: "添加成功",
                  type: "success",
                  duration: 2000,
                });
                this.fetchData();
              }
            })
            .catch((response) => {
              this.$notify({
                title: "错误",
                message: response.message,
                type: "error",
                duration: 2000,
              });
            });
        }
      });
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row); // copy obj
      delStudent(this.temp.studentID)
        .then((response) => {
          if (response.code === 20000) {
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000,
            });
            this.fetchData();
          }
        })
        .catch((response) => {
          this.$notify({
            title: "错误",
            message: response.message,
            type: "error",
            duration: 2000,
          });
        });
    },
  },
};
</script>
