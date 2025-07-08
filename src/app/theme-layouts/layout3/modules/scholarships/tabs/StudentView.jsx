import * as React from "react";
import { useState, useCallback } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { SyncOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Avatar from "@mui/material/Avatar";
import {
  Checkbox,
  Col,
  ConfigProvider,
  Descriptions,
  Form,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import { Input as Input2, Space, Button as Button2 } from "antd";

import { useDispatch, useSelector } from "react-redux";

import { selectUser } from "app/store/userSlice";
import StudentViewTabs from "./StudentViewTabs";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectStudentNo,
  setStudentNo,
  selectStudentFile,
  setStudentFile,
} from "../store/scholarshipSlice";

const { Search } = Input2;

function StudentView() {
  const studentFile = useSelector(selectStudentFile);
  const studentNo = useSelector(selectStudentNo);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const scrollContainerRef = React.useRef(null);
  const psRef = React.useRef(null);

  //   React.useEffect(() => {
  //     dispatch(setLoadingStudentData(loadingStudentFile));
  //   }, [loadingStudentFile]);

  // if (data) {
  //   console.log("data", data);
  // }

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: false,
        minScrollbarLength: 20,
      });

      return () => {
        if (psRef.current) {
          psRef.current.destroy();
          psRef.current = null;
        }
      };
    }
  }, []);

  React.useEffect(() => {
    form2.setFieldsValue({
      study_yr: studentFile?.current_info.true_study_yr,
    });
  }, [studentFile]);

  const onFinish = async (values) => {
    // console.log("values", values);
    dispatch(setStudentNo(values.student_no));
    // dispatch(setSelectedInvoice(null));

    const res = await loadStudentFile({
      variables: {
        studentNo: values.student_no,
      },
    });

    // console.log("response", res.data);
    if (!res.data.loadStudentFile) {
      Modal.info({
        title: "Student Not Found",
        style: {
          top: "32%",
        },
        content: (
          <div>
            <p>{`Student with Student Number ${values.student_no} not found`}</p>
          </div>
        ),
        onOk() {},
      });
    } else {
      dispatch(setStudentFile(res.data.loadStudentFile));

      let newArr = [];
      // reset the student enrollment statuses
      if (res.data.loadStudentFile.enrollment_history.length == 0) {
        // lets first consider freshmen
        newArr.push(enrollmentTypes[0]); // new student
      } else {
        if (
          parseInt(res.data.loadStudentFile.enrollment_history[0].study_yr) ==
          res.data.loadStudentFile.course_details.course.course_duration
        ) {
          newArr.push(enrollmentTypes[1]); // continuing
          newArr.push(enrollmentTypes[2]); // Finalist
          newArr.push(enrollmentTypes[3]); // completed with retakes
        } else {
          newArr.push(enrollmentTypes[1]); // continuing
        }
      }
    }
  };

  // console.log("selected option", selectedStd);
  return (
    <div
      className="flex-auto p-10 sm:p-24"
      style={{
        height: "calc(100vh - 100px)",
        // backgroundColor: "#F0F8FF",
        backgroundColor: "#dfe5ef",
      }}
    >
      <div
        // className="border-2 border-dashed rounded-2xl"
        style={{
          height: "calc(100vh - 138px)",
          borderColor: "lightgray",
          //   backgroundColor: "red",
        }}
      >
        <motion.div
          // className="flex flex-wrap p-24"
          //  variants={container}
          initial="hidden"
          animate="show"
          // initial={{ scale: 0 }}
          // animate={{ scale: 1, transition: { delay: 0.1 } }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid xs={3.3}>
                <Card
                  className="flex flex-col shadow"
                  style={{
                    borderRadius: 0,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    // backgroundColor: "red",
                    borderColor: "lightgray",
                    borderWidth: 0.5,
                  }}
                >
                  <CardContent
                    className="flex flex-col flex-auto p-0"
                    style={{
                      height: "calc(100vh - 140px)",
                      backgroundColor: "white",
                      overflowY: "hidden",
                      padding: 10,
                      paddingTop: 20,
                    }}
                  >
                    <ConfigProvider
                      theme={{
                        token: {
                          colorBorder: "lightgray",
                        },
                      }}
                    >
                      <Form
                        name="basic"
                        form={form}
                        layout="vertical"
                        initialValues={{
                          student_no: studentNo,
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                      >
                        <Form.Item
                          name="student_no"
                          rules={[
                            {
                              required: true,
                              message: "Please input a student number",
                            },
                          ]}
                          style={{
                            // backgroundColor: "red",
                            padding: 0,
                            marginBottom: 10,
                          }}
                        >
                          <Search
                            style={{ marginBottom: 0, borderColor: "black" }}
                            // loading={loading}
                            placeholder="Enter Student No."
                            variant="outlined"
                            // loading={loadingStudentFile}
                            // enterButton={
                            //   loadingStudentFile ? (
                            //     <Button2 disabled={true}>
                            //       <SyncOutlined
                            //         style={{
                            //           fontSize: 19,
                            //         }}
                            //         spin
                            //       />
                            //     </Button2>
                            //   ) : (
                            //     <Button2
                            //       htmlType="submit"
                            //       onClick={() => console.log("search..")}
                            //     >
                            //       <SearchOutlined />
                            //     </Button2>
                            //   )
                            // }
                            enterKeyHint="search"
                            // width={100}

                            size="large"
                            //   onChange={onSearchChange}
                          />
                        </Form.Item>
                      </Form>
                    </ConfigProvider>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // marginTop: -2,
                        marginBottom: 10,
                        // height: "100vh",
                      }}
                    >
                      <motion.div animate={{ x: [0, 30, 0] }}>
                        <Avatar
                          //   sx={{ borderColor: studentFile ? "red" : "purple" }}
                          className="w-200 h-200 border-4"
                          src={` https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=783783`}
                          alt="User avatar"
                        />
                      </motion.div>
                    </div>
                    <Checkbox>Enable Auto Reconciliation</Checkbox>
                    <div
                      ref={scrollContainerRef}
                      style={{
                        marginTop: 10,
                        position: "relative",
                      }}
                    >
                      <div>
                        <Descriptions
                          column={2}
                          //   title="User Info"
                          bordered
                          labelStyle={{
                            color: "#0f2ca2",
                            fontWeight: "bold",
                            backgroundColor: "#e8edff",
                            width: "45%",
                          }}
                          size="small"
                          items={[
                            {
                              key: "8",
                              label: "Surname",
                              children: "AKAMPA",
                              span: 3,
                            },
                            {
                              key: "7",
                              label: "Other Names",
                              //   children: studentFile ? studentFile?.biodata?.other_names : null,
                              children: "DARLINGTON",
                              span: 3,
                            },
                            {
                              key: "9",
                              label: "Account Balance",
                              children: (
                                <Typography.Title
                                  level={4}
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    color: "green",
                                  }}
                                >{`UGX 6000`}</Typography.Title>
                              ),
                              span: 3,
                            },
                            {
                              key: "5",
                              label: "Progress",
                              children: "NORMAL",
                              span: 3,
                              // contentStyle: {
                              //   color:
                              //     studentFile?.current_info.progress == "NORMAL"
                              //       ? ""
                              //       : "red",
                              // },
                            },
                            {
                              key: "2",
                              label: "Enrollment Status",
                              children: "Not Enrolled",
                              span: 3,
                            },
                            {
                              key: "1",
                              label: "Registration Status",
                              children: "Not Registered",
                              span: 3,
                            },

                            {
                              key: "3",
                              label: "Study Year",
                              children: "1",
                              span: 3,
                            },
                            {
                              key: "6",
                              label: "Semester",
                              children: "2",
                              span: 3,
                            },
                            {
                              key: "4",
                              label: "Accademic Year",
                              children: "2024/2025",
                              span: 3,
                            },
                            {
                              key: "10",
                              label: "Course Code",
                              children: "BSCCS",
                              span: 3,
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={8.7}>
                <StudentViewTabs />
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </div>
    </div>
  );
}

export default StudentView;
