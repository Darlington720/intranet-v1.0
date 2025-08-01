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
import StudentViewTabs from "./student_view_tabs/StudentViewTabs";
import { SearchOutlined } from "@mui/icons-material";
import { useLazyQuery, useMutation } from "@apollo/client";
import { LOAD_STUDENT_FILE_WITH_VOID } from "../../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectEnrollmentStatuses,
  selectEnrollModalVisible,
  selectSpecificEnrollmentStatuses,
  selectStudentData,
  selectStudentNo,
  setEnrollModalVisible,
  setLoadingStudentData,
  setSelectedInvoice,
  setSpecificEnrollmentStatuses,
  setStudentData,
  setStudentNo,
  setVoidedInvoices,
} from "../../store/financeSlice";
import { ENROLL_STUDENT } from "../../gql/mutations";
import PaymentModal from "./student_view_tabs/transactions/PaymentModal";
import PaymentSlip from "./student_view_tabs/transactions/prt/PaymentSlip";

const { Search } = Input2;

const items = [
  {
    key: "6",
    label: "Account Balance",
    children: "UGX 0",
    span: 3,
  },
  {
    key: "2",
    label: "Enrollment Status",
    children: "Not Enrolled in SEM 2",
    span: 4,
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
    children: "2",
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
    children: "2023/2024",
    span: 3,
  },
];

const study_yrs = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
];

const enrollment_statuses = [
  { value: "1", label: "FRESHER" },
  { value: "2", label: "CONTINIUNIG" },
  { value: "3", label: "FINALIST" },
];

function StudentView() {
  const [loadStudentFile, { error, loading: loadingStudentFile, data }] =
    useLazyQuery(LOAD_STUDENT_FILE_WITH_VOID, {
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    });

  const [
    enrollStudent,
    { error: enrollErr, loading: enrollingStudent, data: enrollRes },
  ] = useMutation(ENROLL_STUDENT, {
    refetchQueries: ["loadStudentFile"],
  });

  React.useEffect(() => {
    if (data) {
      if (data.loadStudentFile) {
        dispatch(setStudentData(data.loadStudentFile));
        dispatch(setVoidedInvoices(data.voided_invoices));
      }
    }
  }, [data]);

  const studentFile = useSelector(selectStudentData);
  const enrollModalVisible = useSelector(selectEnrollModalVisible);
  const enrollmentTypes = useSelector(selectEnrollmentStatuses);
  const specificEnrollmentTypes = useSelector(selectSpecificEnrollmentStatuses);
  const studentNo = useSelector(selectStudentNo);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const scrollContainerRef = React.useRef(null);
  const psRef = React.useRef(null);
  const userObj = useSelector(selectUser);
  const [image, setImage] = useState(null);

  React.useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (enrollErr) {
      Modal.error({
        title: "Error",
        style: {
          top: "32%",
        },
        content: (
          <div>
            <p>{enrollErr.message}</p>
          </div>
        ),
        onOk() {},
      });
    }
  }, [error, enrollErr]);

  React.useEffect(() => {
    dispatch(setLoadingStudentData(loadingStudentFile));
  }, [loadingStudentFile]);

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
    dispatch(setSelectedInvoice(null));

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
      dispatch(setStudentData(res.data.loadStudentFile));
      dispatch(setVoidedInvoices(res.data.voided_invoices));

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

      dispatch(setSpecificEnrollmentStatuses(newArr));
    }
  };

  const handleEnroll = () => {
    dispatch(setEnrollModalVisible(true));
  };

  const onEnroll = async (values) => {
    // console.log("the values", values);

    const payload2 = {
      studentId: studentFile?.id,
      studentNo: studentFile?.student_no,
      studyYr: parseInt(values.study_yr),
      activeSemId: studentFile?.current_info.active_sem_id,
      enrollmentStatus: values.enrollment_status,
      enrolledBy: `${userObj.user.biodata.title} ${userObj.user.biodata.staff_name}`,
    };

    // console.log("payload", userObj.user);
    const res = await enrollStudent({
      variables: payload2,
    });

    // console.log("res", res.data);

    dispatch(
      showMessage({
        message: res.data.enrollStudent.message,
        variant: "success",
      })
    );
    form2.resetFields();

    dispatch(setEnrollModalVisible(false));
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
                            loading={loadingStudentFile}
                            enterButton={
                              loadingStudentFile ? (
                                <Button2 disabled={true}>
                                  <SyncOutlined
                                    style={{
                                      fontSize: 19,
                                    }}
                                    spin
                                  />
                                </Button2>
                              ) : (
                                <Button2
                                  htmlType="submit"
                                  onClick={() => console.log("search..")}
                                >
                                  <SearchOutlined />
                                </Button2>
                              )
                            }
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
                          sx={{ borderColor: studentFile ? "red" : "purple" }}
                          className="w-200 h-200 border-4"
                          // src={`http://localhost:2222/api/student_image/${studentFile?.student_no}`}
                          src={` https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${studentFile?.student_no}`}
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
                              children: studentFile
                                ? studentFile?.biodata?.surname
                                : null,
                              span: 3,
                            },
                            {
                              key: "7",
                              label: "Other Names",
                              children: studentFile
                                ? studentFile?.biodata?.other_names
                                : null,
                              span: 3,
                            },
                            {
                              key: "9",
                              label: "Account Balance",
                              children: studentFile?.current_info ? (
                                <Typography.Title
                                  level={3}
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                    color: "red",
                                  }}
                                >{`UGX ${studentFile?.current_info.account_balance.toLocaleString()}`}</Typography.Title>
                              ) : null,
                              span: 3,
                            },
                            {
                              key: "5",
                              label: "Progress",
                              children:
                                studentFile?.current_info.progress &&
                                `${studentFile?.current_info.progress}`,
                              span: 3,
                              contentStyle: {
                                color:
                                  studentFile?.current_info.progress == "NORMAL"
                                    ? ""
                                    : "red",
                              },
                            },
                            {
                              key: "2",
                              label: "Enrollment Status",
                              children:
                                studentFile?.current_info.enrollment_status &&
                                `${studentFile?.current_info.enrollment_status}`,
                              span: 4,
                            },
                            {
                              key: "1",
                              label: "Registration Status",
                              children:
                                studentFile?.current_info.recent_enrollment &&
                                "Not Registered",
                              span: 3,
                            },

                            {
                              key: "3",
                              label: "Study Year",
                              children:
                                studentFile?.current_info.recent_enrollment
                                  ?.study_yr &&
                                `${studentFile?.current_info.recent_enrollment?.study_yr}`,
                              span: 3,
                            },
                            {
                              key: "6",
                              label: "Semester",
                              children:
                                studentFile?.current_info.recent_enrollment
                                  ?.sem &&
                                `${studentFile?.current_info.recent_enrollment?.sem}`,
                              span: 3,
                            },
                            {
                              key: "4",
                              label: "Accademic Year",
                              children:
                                studentFile?.current_info.recent_enrollment &&
                                `${studentFile?.current_info.recent_enrollment?.acc_yr_title}`,
                              span: 3,
                            },
                            {
                              key: "10",
                              label: "Course Code",
                              children: studentFile
                                ? studentFile?.course_details?.course
                                    ?.course_code
                                : null,
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
      {studentFile && (
        <Modal
          title={
            <div
              style={{
                // backgroundColor: "red",
                padding: 0,
                margin: 0,
              }}
            >
              <span
                style={{
                  color: "purple",
                }}
              >
                ENROLL{" "}
                {`${studentFile?.biodata.surname} ${studentFile?.biodata.other_names}`}{" "}
                - {studentFile?.student_no}
              </span>
            </div>
          }
          style={{ top: "25%" }}
          open={enrollModalVisible}
          onOk={() => form2.submit()}
          onCancel={() => dispatch(setEnrollModalVisible(false))}
          okText="Enroll"
          okButtonProps={{
            danger: true,
            loading: enrollingStudent,
            disabled: enrollingStudent,
          }}
          maskClosable={false}
        >
          <div
            style={{
              // borderColor: "red",
              // borderWidth: 1,
              paddingTop: 10,
            }}
          >
            <Grid>
              <Row gutter={16} justify="center">
                <Col>
                  <span
                    style={{
                      color: "dodgerblue",
                      fontWeight: "bold",
                      fontSize: "1.9rem",
                    }}
                  >
                    ACADEMIC YEAR:
                  </span>
                </Col>
                <Col
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    fontSize: "1.9rem",
                  }}
                >
                  <span>{studentFile?.current_info.current_acc_yr}</span>
                </Col>

                <Col
                  style={{
                    color: "dodgerblue",
                    fontWeight: "bold",
                    fontSize: "1.9rem",
                  }}
                >
                  <span>SEMESTER:</span>
                </Col>
                <Col>
                  <span
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "1.9rem",
                    }}
                  >
                    {studentFile?.current_info.true_sem}
                  </span>
                </Col>
              </Row>
            </Grid>

            <div
              style={{
                marginTop: 15,
              }}
            >
              <Form
                name="enrollForm"
                form={form2}
                layout="vertical"
                // initialValues={{
                //   study_yr: "2",
                // }}
                onFinish={onEnroll}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Study Year"
                  name="study_yr"
                  rules={[
                    {
                      required: true,
                      message: "Please input the study year",
                    },
                  ]}
                >
                  <Select
                    // loading={loading}

                    allowClear
                    placeholder="Study Year"
                  >
                    {Array.from(
                      {
                        length:
                          studentFile?.course_details?.course.course_duration,
                      },
                      (_, i) => (
                        <Select.Option value={(i + 1).toString()}>
                          {(i + 1).toString()}
                        </Select.Option>
                      )
                    )}
                    {/* {study_yrs.map((yr) => (
                    <Select.Option value={yr.value}>{yr.label}</Select.Option>
                  ))} */}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Enrollment Status"
                  name="enrollment_status"
                  rules={[
                    {
                      required: true,
                      message: "Please input the enrollmennt status",
                    },
                  ]}
                >
                  <Select
                    // loading={loading}

                    allowClear
                    placeholder="Enrollment Status"
                  >
                    {specificEnrollmentTypes.map((status) => (
                      <Select.Option value={status?.id}>
                        {status?.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Modal>
      )}
      <PaymentModal />
      <PaymentSlip />
    </div>
  );
}

export default StudentView;
