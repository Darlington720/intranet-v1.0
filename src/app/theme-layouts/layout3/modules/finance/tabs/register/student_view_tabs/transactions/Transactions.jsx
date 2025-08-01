import { Close, Edit, Info, Refresh } from "@mui/icons-material";
import { Box } from "@mui/material";
import { borderBottom } from "@mui/system";
import {
  Space,
  Button,
  Tooltip,
  ConfigProvider,
  Table,
  Progress,
  Modal,
  Tag,
  Divider,
  Select,
  DatePicker,
  Form,
  Input,
  Typography,
  InputNumber,
  Flex,
} from "antd";
import React, { useEffect, useState } from "react";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStudentData,
  setPaymentModalVisible,
} from "../../../../store/financeSlice";
import { useLazyQuery, useMutation } from "@apollo/client";
import { LOAD_STUDENT_TRANSACTIONS } from "app/theme-layouts/layout3/modules/setup/gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";
import { CloseOutlined } from "@ant-design/icons";
import { RECORD_MANUAL_TXN } from "../../../../gql/mutations";

const { Option } = Select;

const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const onChange = (date, dateString) => {
  console.log(date, dateString);
};

// Sample data for dropdowns (replace with your actual data)
const paymentModes = [
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "credit_card", label: "Credit Card" },
];

const currencies = [
  { value: "UGX", label: "UGX (Ugandan Shilling)" },
  { value: "USD", label: "USD (US Dollar)" },
  { value: "KES", label: "KES (Kenyan Shilling)" },
];

const banks = [
  { value: "stanbic", label: "Stanbic Bank" },
  { value: "centenary", label: "Centenary Bank" },
  { value: "dfcu", label: "DFCU Bank" },
  { value: "absa", label: "Absa Bank" },
];

const branches = [
  { value: "kampala_road", label: "Kampala Road Branch" },
  { value: "garden_city", label: "Garden City Branch" },
  { value: "entebbe", label: "Entebbe Branch" },
];

const studyYears = [1, 2, 3, 4, 5];
const semesters = [
  "Semester 1",
  "Semester 2",
  "Trimester 1",
  "Trimester 2",
  "Trimester 3",
  "Annual",
];
const academicYears = ["2022/2023", "2023/2024", "2024/2025"];

const columns = [
  {
    title: "Row Name",
    dataIndex: "name",
    key: "name",
    render: (text, record, index) => (
      <span
        style={{
          // color: "dodgerblue",
          fontWeight: "500",
        }}
      >
        {text}
      </span>
    ),
  },
];

function Transactions() {
  const [amount, setAmount] = useState("");
  const [form] = Form.useForm();
  const formatAmount = (value) => {
    const cleanedValue = value.replace(/[^\d]/g, ""); // Remove all non-numeric characters
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    return `UGX ${formattedValue}`;
  };

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();
  const studentFile = useSelector(selectStudentData);
  const [transactions, setTransations] = useState([]);
  const [loadStudentTransactions, { error, loading, data: txnRes, refetch }] =
    useLazyQuery(LOAD_STUDENT_TRANSACTIONS, {
      notifyOnNetworkStatusChange: true,
    });

  const [recordManualTxn, { loading: recordingManualTxn, error: recordErr }] =
    useMutation(RECORD_MANUAL_TXN, {
      refetchQueries: ["loadStudentFileWithVoid"],
      notifyOnNetworkStatusChange: true,
    });
  // const [modalText, setModalText] = useState("Content of the modal");

  const handleAmountChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatAmount(value);
    setAmount(formattedValue);
  };

  const showModal = () => {
    setOpen(true);
  };

  const showModal1 = () => {
    setOpen1(true);
  };

  const handleOk = async () => {
    // setModalText("The modal will be closed after two seconds");
    try {
      // setConfirmLoading(true);
      await form.validateFields();

      const values = await form.getFieldsValue();

      console.log("values", values);
      const payload = {
        payload: {
          stdno: studentFile?.student_no,
          ...values,
        },
      };

      const res = await recordManualTxn({
        variables: payload,
      });

      form.resetFields();
      setOpen(false);
      setOpen1(false);
      dispatch(
        showMessage({
          message: "Transaction Submitted Successfully",
          variant: "success",
        })
      );
      // setTimeout(() => {
      //   setOpen(false), setOpen1(false);
      //   setConfirmLoading(false);
      // }, 2000);
      // setConfirmLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
    setOpen1(false);
  };

  const expandedRowRender = (row, record) => {
    // console.log("details", row, record);

    const columns2 = [
      {
        title: "#",
        dataIndex: "index",
        key: "date",
        render: (text, record, index) => index + 1,
        width: "5%",
      },
      {
        title: "Reference Token",
        dataIndex: "prt",
        // width: "15%",
        key: "prt",
        ellipsis: true,
        render: (text, record) => <div>{text}</div>,
        onCell: (record) => ({
          style: {
            backgroundColor:
              parseInt(record.unallocated) > 0 ? "#04b3fa" : "#d9f3d9",
            padding: "3px", // You can adjust the padding as needed
            borderRadius: "0px", // Optional: Add border radius
            boxSizing: "border-box", // Ensures padding is included in the width
          },
        }),
      },
      {
        title: "Bank",
        dataIndex: "bank_name",
        key: "bank_name",
        width: "16%",
        ellipsis: true,
      },
      {
        title: "Branch",
        dataIndex: "bank_branch",
        key: "bank_branch",
        ellipsis: true,

        // render: (text, record, index) => parseInt(text).toLocaleString(),
        width: "10%",
      },
      {
        title: "Date",
        key: "payment_date",
        dataIndex: "payment_date",
        width: "20%",
        ellipsis: true,
        render: (text, record, index) => formatDateString(text),
        // render: (text, record, index) => record.category.category_name,
      },
      {
        title: "Amount",

        key: "amount",
        dataIndex: "amount",
        width: "10%",
        render: (text, record, index) => parseInt(text).toLocaleString(),
        // render: (text, record, index) => record.category.category_name,
      },
      {
        title: "Unallocated",
        dataIndex: "unallocated",
        key: "unallocated",
        width: "10%",
        render: (text, record, index) => parseInt(text).toLocaleString(),
      },
    ];

    const data = [
      {
        payment_ref: "2000101041-T676732673267",
        bank: "CENTENARY",
        branch: "KAWUKU",
        date: "THUR 10TH AUG, 2023 03:23pm",
        amount: "1003000",
        unallocated: "0",
        is_dp: 1,
      },
      {
        payment_ref: "2000101041-T676732673267",
        bank: "CENTENARY BANK",
        branch: "KAWUKU",
        date: "THUR 10TH AUG, 2023 03:23pm",
        amount: "1003000",
        unallocated: "0",
        is_dp: 0,
      },
    ];

    const newData = transactions.filter((txn) => row.is_dp == txn.is_dp);

    // console.log("txns", transactions);

    // console.log("data2", filteredFeesItems);

    return (
      <Table
        size="small"
        // bordered
        columns={columns2}
        dataSource={newData}
        pagination={false}
        rowHoverable
        // rowSelection={{
        //   type: "radio",
        // }}
      />
    );
  };

  const data = [
    {
      key: "2",
      name: (
        <span
          style={{
            color: "dodgerblue",
          }}
        >
          {"Live Transactions"}
        </span>
      ),
      is_dp: 0,
    },
    {
      key: "1",
      name: (
        <span
          style={{
            color: "dodgerblue",
          }}
        >
          {"Manually Posted Transactions"}
        </span>
      ),
      is_dp: 1,
    },
  ];

  const loadTransactions = async (stdno) => {
    const res = await loadStudentTransactions({
      variables: {
        studentNo: stdno,
      },
    });

    setTransations(res.data.student_transactions);
  };

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (recordErr) {
      dispatch(
        showMessage({
          message: recordErr.message,
          variant: "error",
        })
      );
    }
  }, [error, recordErr]);

  useEffect(() => {
    if (studentFile) {
      loadTransactions(studentFile?.student_no);
      form.setFieldsValue({
        studyYear:
          studentFile?.current_info?.recent_enrollment?.study_yr || "1",
        semester: studentFile?.current_info?.recent_enrollment?.sem || "1",
        academicYear:
          studentFile?.current_info?.recent_enrollment?.acc_yr_title ||
          studentFile?.current_info?.current_acc_yr,
      });
    }
  }, [studentFile]);

  // console.log("txns", transactions);

  return (
    <div>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderColor: "lightgray",
          borderWidth: 1,
          borderBottom: "none",
          // marginBottom: 1,
        }}
        className="p-5"
        style={{
          // paddingLeft: 10,
          display: "flex",
          justifyContent: "space-between",
          // alignItems: "center",
          // paddingRight: 10,
          //   marginBottom: 8,
          // backgroundColor: "red",

          // height: 40,
        }}
      >
        <Button
          size="small"
          type="primary"
          ghost
          // type="primary"

          onClick={() => dispatch(setPaymentModalVisible(true))}
        >
          Generate PRT
        </Button>

        <Space>
          <Button
            size="small"
            type="primary"
            ghost
            // type="primary"

            // onClick={() => dispatch(setPaymentModalVisible(true))}
          >
            Print Receipt
          </Button>
          <Button
            onClick={showModal}
            size="small"
            type="primary"
            ghost
            // type="primary"

            // onClick={() => dispatch(setPaymentModalVisible(true))}
          >
            Add a Prepayment
          </Button>
          <Button
            onClick={showModal1}
            size="small"
            type="primary"
            ghost
            // type="primary"

            // onClick={() => dispatch(setPaymentModalVisible(true))}
          >
            Move transaction to another student
          </Button>
          <Button
            size="small"
            onClick={async () =>
              refetch({
                variables: {
                  studentNo: studentFile?.student_no,
                },
              })
            }
            icon={
              <Refresh
                style={{
                  color: "gray",
                }}
              />
            }
          >
            Reload
          </Button>
        </Space>
        <Modal
          width={680}
          title={
            <Typography.Text strong style={{ color: "#fff" }}>
              Add Prepayment Transaction
            </Typography.Text>
          }
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={recordingManualTxn}
              onClick={handleOk}
            >
              Submit Transaction
            </Button>,
          ]}
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
              backgroundColor: "#f4f6f9",
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
          <Form form={form} layout="vertical" size="middle">
            {/* Context Section */}
            <div style={{ marginBottom: 8, marginTop: 16 }}>
              <Flex gap="middle" align="center" style={{ width: "100%" }}>
                <Form.Item
                  label="Study Year"
                  name="studyYear"
                  style={{ flex: "none", width: "32%" }} // Prevent growing, fixed width
                  layout="horizontal"
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  label="Semester"
                  name="semester"
                  style={{ flex: "none", width: "32%" }} // Prevent growing, fixed width
                  layout="horizontal"
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  label="Academic Year"
                  name="academicYear"
                  style={{ flex: "none", width: "32%" }} // Prevent growing, fixed width
                  layout="horizontal"
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Flex>
            </div>

            <Divider style={{ margin: "12px 0", borderColor: "#d9d9d9" }} />

            {/* Payment Details Section */}
            <div style={{ marginBottom: 16 }}>
              <Flex gap="middle" align="flex-start" style={{ width: "100%" }}>
                <Form.Item
                  label="Payment Mode"
                  name="paymentMode"
                  rules={[
                    { required: true, message: "Please select payment mode" },
                  ]}
                  style={{ width: "100%" }}
                >
                  <Select
                    placeholder="Select payment mode"
                    style={{ width: "100%" }}
                  >
                    {paymentModes.map((mode) => (
                      <Option key={mode.value} value={mode.value}>
                        {mode.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Mode Reference"
                  name="referenceNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please enter reference number",
                    },
                  ]}
                  style={{ width: "100%" }}
                >
                  <Input
                    placeholder="e.g. CHQ12345"
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  label="Currency"
                  name="currency"
                  initialValue="UGX"
                  style={{ width: "50%" }}
                >
                  <Select style={{ width: "100%" }}>
                    {currencies.map((currency) => (
                      <Option key={currency.value} value={currency.value}>
                        {currency.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Amount"
                  name="amount"
                  rules={[
                    { required: true, message: "Please enter amount" },
                    {
                      type: "number",
                      min: 0,
                      message: "Amount must be positive",
                    },
                  ]}
                  style={{ width: "100%" }}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    // step={1000}
                    // formatter={(value) =>
                    //   `UGX ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    // }
                  />
                </Form.Item>
              </Flex>
            </div>

            <Divider style={{ margin: "12px 0", borderColor: "#d9d9d9" }} />

            {/* Bank Details Section */}
            <div>
              <Flex gap="middle" align="flex-start" style={{ width: "100%" }}>
                <Form.Item label="Bank" name="bank" style={{ flex: 1 }}>
                  <Select placeholder="Select bank" style={{ width: "100%" }}>
                    {banks.map((bank) => (
                      <Option key={bank.value} value={bank.value}>
                        {bank.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Branch" name="branch" style={{ flex: 1 }}>
                  <Input style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  label="Date"
                  name="date"
                  rules={[{ required: true, message: "Please select date" }]}
                  style={{ flex: 1 }}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Flex>
            </div>
          </Form>
        </Modal>

        <Modal
          width={600}
          title="Move transaction from one student to another"
          open={open1}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ flex: 1, marginRight: "10px" }}>
              <div style={{ marginBottom: 5 }}>
                From: <strong>Student Number</strong>
              </div>
              <Form.Item
                style={{ width: "100%" }}
                name="student_no_1"
                rules={[
                  {
                    required: true,
                    message: "Please input the student number!",
                  },
                ]}
              >
                <Input placeholder="Enter your student number" />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 5 }}>
                Amount: <strong>to be moved</strong>
              </div>
              <Form.Item
                style={{ width: "100%" }}
                name="amount"
                rules={[
                  {
                    required: true,
                    message: "Please input the amount!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter the amount to be moved"
                  value={amount}
                  onChange={handleAmountChange}
                />
              </Form.Item>
            </div>
          </div>

          <Divider>move transaction to</Divider>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, marginRight: "10px" }}>
              <div style={{ marginBottom: 5 }}>
                From: <strong>Student Number</strong>
              </div>
              <Form.Item
                style={{ width: "100%" }}
                name="student_no_1"
                rules={[
                  {
                    required: true,
                    message: "Please input the student number!",
                  },
                ]}
              >
                <Input placeholder="Enter your student number" />
              </Form.Item>
            </div>
            <div style={{ flex: 1, marginRight: "10px" }}>
              <div style={{ marginBottom: 5 }}>
                Reason: <strong>for transaction move</strong>
              </div>
              <Form.Item
                // label="TextArea"
                name="TextArea"
                rules={[
                  {
                    required: true,
                    message: "Please input!",
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
            </div>
          </div>
        </Modal>
      </Box>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              // headerBg: "rgba(0, 0, 0, 0.04)",
              borderColor: "lightgray",
              borderRadius: 0,
              headerBorderRadius: 0,
              // cellFontSize: 10,
              // fontSize: 13,
              // lineHeight: 0.8,
            },
          },
        }}
      >
        <Table
          bordered
          showHeader={false}
          loading={loading}
          size="small"
          columns={columns}
          expandable={{
            expandedRowRender,
            defaultExpandAllRows: true,
            //   defaultExpandedRowKeys: [...feesCategories.map((cat) => cat.id)],
            //   expandedRowKeys: [...feesCategories.map((cat) => cat.id)],
          }}
          dataSource={data}
          scroll={{
            y: "calc(100vh - 300px)",
          }}
        />
      </ConfigProvider>
    </div>
  );
}

export default Transactions;
