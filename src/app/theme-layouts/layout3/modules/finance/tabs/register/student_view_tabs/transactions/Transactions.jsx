import { Edit, Info, Refresh } from "@mui/icons-material";
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
} from "antd";
import React, { useEffect, useState } from "react";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStudentData,
  setPaymentModalVisible,
} from "../../../../store/financeSlice";
import { useLazyQuery } from "@apollo/client";
import { LOAD_STUDENT_TRANSACTIONS } from "app/theme-layouts/layout3/modules/setup/gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";

const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const onChange = (date, dateString) => {
  console.log(date, dateString);
};
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

  const formatAmount = (value) => {
    const cleanedValue = value.replace(/[^\d]/g, ""); // Remove all non-numeric characters
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    return `UGX ${formattedValue}`;
  };

  const handleAmountChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatAmount(value);
    setAmount(formattedValue);
  };

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // const [modalText, setModalText] = useState("Content of the modal");
  const showModal = () => {
    setOpen(true);
  };
  const showModal1 = () => {
    setOpen1(true);
  };
  const handleOk = () => {
    // setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false), setOpen1(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false), setOpen1(false);
  };

  const dispatch = useDispatch();
  const studentFile = useSelector(selectStudentData);
  const [transactions, setTransations] = useState([]);
  const [loadStudentTransactions, { error, loading, data: txnRes, refetch }] =
    useLazyQuery(LOAD_STUDENT_TRANSACTIONS, {
      notifyOnNetworkStatusChange: true,
    });
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
        width: "15%",
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
        render: (text, record, index) => formatDateString(parseInt(text)),
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
  }, [error]);

  useEffect(() => {
    if (studentFile) {
      loadTransactions(studentFile?.student_no);
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
          width={600}
          title="Commit a Prepayment Transaction"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "10px" }}>
              Study Year&nbsp;<Tag color="processing">1</Tag>
            </div>
            <div style={{ marginRight: "10px" }}>
              Semester&nbsp;<Tag color="processing">2</Tag>
            </div>
            <div>
              Academic Year&nbsp;<Tag color="processing">2023/2024</Tag>
            </div>
          </div>
          <Divider
            style={{
              marginTop: 10,
              borderColor: "#0832b7",
              borderStyle: "dashed",
              borderWidth: 1,
            }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "10px" }}>
              <div style={{ marginBottom: 5 }}>Payment Mode</div>
              <Select
                size="small"
                defaultValue="Select Payment Mode"
                style={{
                  width: 200,
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </div>
            <div style={{ marginRight: "10px" }}>
              <div style={{ marginBottom: 5 }}>Mode Reference</div>
              <Select
                size="small"
                defaultValue="Select Mode Reference"
                style={{
                  width: 120,
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </div>
            <div style={{ marginRight: "10px" }}>
              <div style={{ marginBottom: 5 }}>Currency</div>
              <Select
                size="small"
                defaultValue="Currency"
                style={
                  {
                    // width: 120,
                  }
                }
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </div>
            <div style={{ marginRight: "10px" }}>
              <div style={{ marginBottom: 5 }}>Amount</div>
              <Select
                size="small"
                defaultValue="Amount"
                style={{
                  width: 105,
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </div>
          </div>
          <Divider style={{ marginBottom: 5 }} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flexGrow: 1, marginRight: "10px" }}>
              <div style={{ marginBottom: 5 }}>Bank</div>
              <Select
                size="small"
                defaultValue="Select Bank"
                style={{
                  width: "100%", // Make the Select component fill the available width
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </div>
            <div style={{ flexGrow: 1, marginRight: "10px" }}>
              <div style={{ marginBottom: 5 }}>Branch</div>
              <Select
                size="small"
                defaultValue="Select Branch"
                style={{
                  width: "100%", // Make the Select component fill the available width
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ marginBottom: 5 }}>Date</div>
              <DatePicker
                size="small"
                onChange={onChange}
                style={{
                  width: "100%", // Make the Select component fill the available width
                }}
              />
            </div>
          </div>
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
