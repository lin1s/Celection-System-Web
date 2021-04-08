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
      <el-table-column label="课号" align="center">
        <template slot-scope="scope">
          {{ scope.row.courseID }}
        </template>
      </el-table-column>
      <el-table-column label="课程名" align="center">
        <template slot-scope="scope">
          {{ scope.row.courseName }}
        </template>
      </el-table-column>
      <el-table-column label="教师" align="center">
        <template slot-scope="scope">
          {{ scope.row.teacherName }}
        </template>
      </el-table-column>
      <el-table-column label="最大人数" align="center">
        <template slot-scope="scope">
          {{ scope.row.maxNum }}
        </template>
      </el-table-column>
      <el-table-column label="已选人数" align="center">
        <template slot-scope="scope">
          {{ scope.row.haveStu }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope, $index">
          <el-button
            size="mini"
            type="primary"
            @click="handleGetStudent(scope.row)"
          >
            查看选课学生
          </el-button>
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
        <el-form-item label="课号" prop="title">
          <el-input v-model="temp.courseID" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="课程名" prop="title">
          <el-input v-model="temp.courseName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="教师">
          <el-select
            v-model="temp.teacherName"
            class="filter-item"
            placeholder="请选择授课老师"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.teacherName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="最大人数" prop="title">
          <el-input v-model="temp.MaxNum" placeholder="请输入最大人数" />
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

    <el-dialog :visible.sync="dialogFormVisible2" :title="textMap[dialogStatus]">
      <el-table
        v-loading="listLoading"
        :data="studentList"
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
      </el-table>
    </el-dialog>
  </div>
</template>



<script>
import { getTeacherList } from "@/api/teacher";
import {
  getCourseList,
  addCourse,
  delCourse,
  updateCourse,
  getStudentListByCourse,
} from "@/api/course";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      allList: null,
      teacherList: null,
      studentList: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      temp: {
        courseID: undefined,
        courseName: undefined,
        teacherid: undefined,
        teacherName: undefined,
        MaxNum: undefined,
        HaveStu: undefined,
        userKey: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      },
      searchOptions: [
        { label: "", key: "" },
        { label: "课号", key: "courseID" },
        { label: "课程名", key: "courseName" },
        { label: "教师", key: "teacherName" },
      ],
      searchKey: null,
      searchValue: null,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新建",
        check:"查看选课学生",
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
      getCourseList().then((response) => {
        this.list = response.data;
        this.allList = response.data;
        this.listLoading = false;
      });
    },

    fetchTeacherData() {
      getTeacherList().then((response) => {
        this.teacherList = response.data;
      });
    },

    //前端搜索
    handleFilter() {
      if (this.checkNull(this.searchKey) && this.checkNull(this.searchValue)) {
        this.listLoading = true;
        let searchValue = this.searchValue;
        this.list = this.allList.filter(function (allList) {
          let searchField = {
            courseID: allList.courseID,
            courseName: allList.courseName,
            teacherName: allList.teacherName,
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
      this.fetchTeacherData();
      this.temp = Object.assign({}, row); // copy obj
      console.log(this.temp);
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
          updateCourse(tempData)
            .then((response) => {
              if (response.code === 20000) {
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                  duration: 2000,
                });
                this.fetchData();
                this.dialogFormVisible = false;
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
        courseID: undefined,
        courseName: undefined,
        teacherid: undefined,
        teacherName: undefined,
        MaxNum: undefined,
        HaveStu: 0,
        LastUpdateBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      };
    },
    handleCreate() {
      this.fetchTeacherData();
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
          this.temp.teacherid = this.temp.teacherName;
          addCourse(this.temp)
            .then((response) => {
              if (response.code === 20000) {
                this.$notify({
                  title: "成功",
                  message: "添加成功",
                  type: "success",
                  duration: 2000,
                });
                this.fetchData();
                this.dialogFormVisible = false;
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

    //删除信息
    handleDelete(row) {
      this.temp = Object.assign({}, row); // copy obj
      delCourse(this.temp.courseID)
        .then((response) => {
          if (response.code === 20000) {
            this.$notify({
              title: "成功",
              message: "删除成功",
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

    //获得选课学生
    handleGetStudent(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogFormVisible2 = true;
      this.dialogStatus = "check";
      getStudentListByCourse(this.temp.id).then((response) => {
        this.studentList=response.data;
      });
    },
  },
};
</script>
