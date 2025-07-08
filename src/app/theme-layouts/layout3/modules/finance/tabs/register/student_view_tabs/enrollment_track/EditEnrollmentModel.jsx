import { Modal, Form, Select, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEditEnrollmentModelVisible,
  selectEnrollmentStatuses,
  selectSelectedEnrollment,
  selectStudentData,
  setEditEnrollmentVisible,
  setSelectedEnrollment,
} from "../../../../store/financeSlice";
import { gql, useMutation } from "@apollo/client";
import { selectAccYrs } from "app/theme-layouts/layout3/modules/setup/store/setUpSlice";
import { EDIT_ENROLLMENT } from "../../../../gql/mutations";
import { selectUser } from "app/store/userSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useEffect } from "react";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    // span: 8,
  },
};

const EditEnrollmentModel = () => {
  const dispatch = useDispatch();
  const modalVisible = useSelector(selectEditEnrollmentModelVisible);
  const [form] = Form.useForm();
  const acc_yrs = useSelector(selectAccYrs);
  const enrollmentStatuses = useSelector(selectEnrollmentStatuses);
  const user = useSelector(selectUser);
  const selectedEnrollment = useSelector(selectSelectedEnrollment);
  const studentFile = useSelector(selectStudentData);

  //   console.log("selected en", selectedEnrollment);
  const [editEnrollment, { error, loading, data }] = useMutation(
    EDIT_ENROLLMENT,
    {
      refetchQueries: ["loadStudentFile"],
    }
  );

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [error]);

  const handleOk = () => {
    // setIsModalOpen(false);
    dispatch(setEditEnrollmentVisible(false));
  };
  const handleCancel = () => {
    // setIsModalOpen(false);
    dispatch(setEditEnrollmentVisible(false));
  };

  useEffect(() => {
    if (selectedEnrollment) {
      form.setFieldsValue({
        acc_yr: selectedEnrollment.acc_yr,
        study_yr: parseInt(selectedEnrollment.study_yr),
        semester: parseInt(selectedEnrollment.sem),
        enrollment_status: selectedEnrollment.enrollment_status.id,
        add_invoice: 0,
      });
    }
  }, [selectedEnrollment]);

  const onSave = async (values) => {
    // console.log("Received values of form: ", values);
    // console.log(studentFile);
    // console.log(user);
    const payload = {
      enrollmentId: selectedEnrollment.id,
      accYr: values.acc_yr,
      studyYr: values.study_yr,
      semester: values.semester,
      invoice: values.add_invoice,
      enrollmentStatus: values.enrollment_status,
      enrolledBy: `${user.user.biodata.title} ${user.user.biodata.staff_name}`,
    };

    // console.log("payload", payload);
    const res = await editEnrollment({
      variables: payload,
    });

    // console.log("res...", res.data);
    form.resetFields();
    dispatch(setSelectedEnrollment(null));
    dispatch(setEditEnrollmentVisible(false));
    dispatch(
      showMessage({
        message: res.data.editEnrollment.message,
        variant: "success",
      })
    );
  };
  return (
    <>
      {studentFile && (
        <Modal
          title="Edit Enrollment"
          style={{ top: "25%" }}
          open={modalVisible}
          //   onOk={handleOk}
          onCancel={handleCancel}
          maskClosable={false}
          okText="Save"
          okButtonProps={{
            autoFocus: true,
            htmlType: "submit",
            // danger: true,
            loading: loading,
            disabled: loading,
          }}
          modalRender={(dom) => (
            <Form
              //   layout="vertical"
              {...layout}
              form={form}
              name="form_in_modal"
              initialValues={{
                add_invoice: 1,
              }}
              clearOnDestroy
              onFinish={(values) => onSave(values)}
            >
              {dom}
            </Form>
          )}
        >
          <Form.Item
            name="acc_yr"
            label="Academic Year"
            rules={[
              {
                required: true,
                message: "Academic Year is required",
              },
            ]}
            // style={{
            //   marginBottom: 15,
            // }}
          >
            <Select
              placeholder="Select Academic Year"
              //   onChange={onGenderChange}
              allowClear
            >
              {acc_yrs.map((acc_yr) => (
                <Option value={acc_yr.id}>{acc_yr.acc_yr_title}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="study_yr"
            label="Study Year"
            rules={[
              {
                required: true,
                message: "Please select the Study Year",
              },
            ]}
          >
            <Select placeholder="Select Study Year" allowClear>
              {Array.from(
                { length: studentFile?.course_details.course.course_duration },
                (_, i) => (
                  <Option value={i + 1}>{i + 1}</Option>
                )
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="semester"
            label="Semester"
            rules={[
              {
                required: true,
                message: "Please select the semester",
              },
            ]}
            // style={{
            //   marginBottom: 15,
            // }}
          >
            <Select
              placeholder="Select Semester"
              //   onChange={onGenderChange}
              allowClear
            >
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="enrollment_status"
            label="Enrollment Status"
            rules={[
              {
                required: true,
                message: "Please select the enrollment status",
              },
            ]}
          >
            <Select placeholder="Select Enrollment Status" allowClear>
              {enrollmentStatuses?.map((status) => (
                <Option value={status.id}>{status.title}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="add_invoice"
            label="Add Invoice"
            layout="horizontal"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Modal>
      )}
    </>
  );
};
export default EditEnrollmentModel;
