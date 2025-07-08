import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { lighten } from "@mui/material/styles";
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
import RegisterTabs from "./register_tabs/RegisterTabs";
import { Close, SearchOutlined } from "@mui/icons-material";
import { useLazyQuery, useMutation } from "@apollo/client";
import { LOAD_STUDENT_FILE } from "../../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectEnrollmentStatuses,
  selectEnrollModalVisible,
  selectSpecificEnrollmentStatuses,
  selectStudentData,
  selectStudentNo,
  setEnrollModalVisible,
  setLoadingStudentData,
  setProvisionalRegModalVisible,
  setRegistrationModalVisible,
  setSelectedInvoice,
  setSpecificEnrollmentStatuses,
  setStudentData,
  setStudentNo,
} from "../../store/registrationSlice";
import { ENROLL_STUDENT } from "../../gql/mutations";
import PaymentModal from "./register_tabs/transactions/PaymentModal";
import PaymentSlip from "./register_tabs/transactions/prt/PaymentSlip";
import ModulesEnrollmentModal from "./modules_enrollment_modal/ModulesEnrollmentModal";
import RegistrationModal from "./RegistrationModal";
import ProvisionalRegistrationModal from "./ProvisionalRegistrationModal";

const { Search } = Input2;

function getTotalAmountDue(invoices) {
  if (!invoices) return 0;
  return invoices.reduce((total, invoice) => total + invoice.amount_due, 0);
}

function Register() {
  const studentFile = useSelector(selectStudentData);
  const enrollModalVisible = useSelector(selectEnrollModalVisible);
  const enrollmentTypes = useSelector(selectEnrollmentStatuses);
  const specificEnrollmentTypes = useSelector(selectSpecificEnrollmentStatuses);
  const studentNo = useSelector(selectStudentNo);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const totalAmountDue = React.useMemo(
    () => getTotalAmountDue(studentFile?.invoices || []),
    [studentFile?.invoices]
  );
  const scrollContainerRef = React.useRef(null);
  const psRef = React.useRef(null);
  const userObj = useSelector(selectUser);
  const [loadStudentFile, { error, loading: loadingStudentFile, data }] =
    useLazyQuery(LOAD_STUDENT_FILE, {
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
      }
    }
  }, [data]);

  // console.log("student file", studentFile);

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
          newArr.push(enrollmentTypes[4]);
        } else {
          newArr.push(enrollmentTypes[1]); // continuing
        }
      }

      // console.log("enrollment types", res.data.loadStudentFile);

      dispatch(
        setSpecificEnrollmentStatuses(
          res.data.loadStudentFile.current_info.enrollment_types
        )
      );
    }
  };

  const handleEnroll = () => {
    dispatch(setEnrollModalVisible(true));
  };

  const handleProvisionalReg = () => {
    dispatch(setProvisionalRegModalVisible(true));
  };

  const handleRegister = () => {
    dispatch(setRegistrationModalVisible(true));
  };

  const onEnroll = async (values) => {
    // console.log("the values", values);

    const payload2 = {
      studentId: studentFile?.id,
      studentNo: studentFile?.student_no,
      studyYr: parseInt(values.study_yr),
      semester: parseInt(studentFile?.current_info.true_sem),
      enrollmentStatus: values.enrollment_status
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

  return (
    <div
      className="flex-auto p-10 sm:p-24"
      style={{
        height: "calc(100vh - 99.2px)",
        // backgroundColor: "red",
        backgroundColor: "#dfe5ef",
      }}
    >
      <div
        // className="border-2 border-dashed rounded-2xl"
        style={{
          height: "calc(100vh - 138px)",
          borderColor: "lightgray",
          // backgroundColor: "red",
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
                      height: "calc(100vh - 187px)",
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

                            size="middle"
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
                          sx={{
                            borderColor:
                              studentFile?.current_info.registration_status ==
                              "Registered"
                                ? "#4d4dff"
                                : studentFile?.current_info
                                      .registration_status == "Not Registered"
                                  ? "#ff4d4d"
                                  : studentFile?.current_info
                                        .registration_status ==
                                      "Provisionally Registered"
                                    ? "green"
                                    : "purple",
                          }}
                          className="w-200 h-200 border-4"
                          // src={`https://tredumo.nkumbauniversity.ac.ug:2222/api/student_image/${studentFile?.student_no}`}
                          src={` https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${studentFile?.student_no}`}
                          alt="User avatar"
                        />
                      </motion.div>
                    </div>
                    <Checkbox>Enable Auto Allocation</Checkbox>
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
                            backgroundColor: "#e7edfe",
                            color: "#0832b7",
                            fontWeight: "bold",
                            width: "45%",
                          }}
                          size="small"
                          items={[
                            {
                              key: "6",
                              label: "Account Balance",
                              children: studentFile?.current_info
                                ? `UGX ${studentFile?.current_info.account_balance.toLocaleString()}`
                                : null,
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
                                studentFile?.current_info.registration_status,
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
                              label: "Academic Year",
                              children:
                                studentFile?.current_info.recent_enrollment &&
                                `${studentFile?.current_info.recent_enrollment?.acc_yr_title}`,
                              span: 3,
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </CardContent>
                  {/* <CourseProgress className="" course={course} /> */}
                  <CardActions
                    className="justify-start py-8 px-24"
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                          ? lighten(theme.palette.background.default, 0.01)
                          : lighten(theme.palette.background.default, 1),
                    }}
                  >
                    <Space>
                      <Button2
                        type="primary"
                        danger
                        disabled={!studentFile}
                        //   disabled={!selectedStd || !image}
                        // onClick={handleSave}
                      >
                        Block
                      </Button2>
                      {/* {studentFile?.current_info.enrollment_status ==
                      "Enrolled" ? (
                        <>
                          {totalAmountDue > 0 ? (
                            <Button2
                              type="primary"
                              // disabled={!studentFile}
                              style={{
                                backgroundColor:
                                  studentFile &&
                                  studentFile?.current_info
                                    .registration_status !=
                                    "Provisionally Registered"
                                    ? "green"
                                    : null,
                              }}
                              disabled={
                                !studentFile ||
                                studentFile?.current_info.registration_status ==
                                  "Provisionally Registered"
                              }
                              onClick={handleProvisionalReg}
                            >
                              Register Provisionally
                            </Button2>
                          ) : (
                            <Button2
                              type="primary"
                              // disabled={
                              //   !studentFile ||
                              //   studentFile?.current_info.enrollment_status ==
                              //     "Enrolled"
                              // }
                              disabled={
                                studentFile?.current_info.registration_status ==
                                "Registered"
                              }
                              onClick={handleRegister}
                            >
                              Register
                            </Button2>
                          )}
                        </>
                      ) : (
                        <Button2
                          type="primary"
                          disabled={
                            !studentFile ||
                            studentFile?.current_info.enrollment_status ==
                              "Enrolled"
                          }
                          //   disabled={!selectedStd || !image}
                          onClick={handleEnroll}
                        >
                          Enroll
                        </Button2>
                      )} */}

                      {studentFile?.current_info.enrollment_status ==
                      "Enrolled" ? (
                        <>
                          {studentFile?.current_info.registration_status ==
                            "Not Registered" ||
                          studentFile?.current_info.registration_status ==
                            "Provisionally Registered" ? (
                            <Button2
                              type="primary"
                              // disabled={!studentFile}
                              style={{
                                backgroundColor:
                                  studentFile &&
                                  studentFile?.current_info
                                    .registration_status !=
                                    "Provisionally Registered"
                                    ? "green"
                                    : null,
                              }}
                              disabled={
                                !studentFile ||
                                studentFile?.current_info.registration_status ==
                                  "Provisionally Registered"
                              }
                              onClick={handleProvisionalReg}
                            >
                              Register Provisionally
                            </Button2>
                          ) : (
                            <Button2
                              type="primary"
                              // disabled={
                              //   !studentFile ||
                              //   studentFile?.current_info.enrollment_status ==
                              //     "Enrolled"
                              // }
                              disabled={
                                studentFile?.current_info.registration_status ==
                                "Registered"
                              }
                              onClick={handleRegister}
                            >
                              Register
                            </Button2>
                          )}
                        </>
                      ) : (
                        <Button2
                          type="primary"
                          disabled={
                            !studentFile ||
                            studentFile?.current_info.enrollment_status ==
                              "Enrolled"
                          }
                          //   disabled={!selectedStd || !image}
                          onClick={handleEnroll}
                        >
                          Enroll
                        </Button2>
                      )}
                    </Space>
                  </CardActions>
                </Card>
              </Grid>
              <Grid xs={8.7}>
                <RegisterTabs />
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </div>
      {studentFile && (
        <Modal
        title={
          <Typography.Text
            style={{
              color: "#fff",
            }}
          >
            ENROLL{" "}
                {`${studentFile?.biodata.surname} ${studentFile?.biodata.other_names}`}{" "}
                - {studentFile?.student_no}
          </Typography.Text>
        }
          
          style={{ top: "25%" }}
          open={enrollModalVisible}
          onOk={() => form2.submit()}
          closeIcon={
            <Close
              style={{
                color: "#fff",
                marginTop: -15
              }}
            />
          }
          onCancel={() => dispatch(setEnrollModalVisible(false))}
          okText="Enroll"
          okButtonProps={{
            danger: true,
            loading: enrollingStudent,
            disabled: enrollingStudent,
          }}
          maskClosable={false}
          styles={{
            body: {
              paddingLeft: 10,
              paddingRight: 10,
              height: "auto",
    
              // Ensure the content is not clipped
            },
            content: {
              padding: 0,
              height: "auto",
              // Ensure the content is not clipped
            },
            footer: {
              padding: 10,
            },
            header: {
              backgroundColor: "#2f405d",
              padding: "7px 10px",
            },
          }}
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
                      message: "Please input the enrollment status",
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
      <ProvisionalRegistrationModal />
      <RegistrationModal />
      <PaymentModal />
      <PaymentSlip />
      <ModulesEnrollmentModal />
    </div>
  );
}

export default Register;
