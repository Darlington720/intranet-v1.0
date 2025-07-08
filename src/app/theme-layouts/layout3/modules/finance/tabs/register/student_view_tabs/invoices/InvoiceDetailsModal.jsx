import React, { useEffect, useRef } from "react";
import {
  Modal,
  Space,
  Alert,
  Typography,
  Table,
  ConfigProvider,
  Divider,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInvoiceDetailsModalVisible,
  selectSelectedInvoice,
  setInvoiceDetailsModalVisible,
} from "../../../../store/financeSlice";
import PerfectScrollbar from "perfect-scrollbar";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";
import formatDateToYYYYMMDD from "app/theme-layouts/layout3/utils/convertDateToYYMMDD";
import { Close } from "@mui/icons-material";

const { Text } = Typography;

function InvoiceDetailsModal() {
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const selectedInvoice = useSelector(selectSelectedInvoice);
  const psRef = useRef(null);
  const invoiceDetailsModalVisible = useSelector(
    selectInvoiceDetailsModalVisible
  );

  //   console.log("selected Invoice", selectedInvoice);

  useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
      });
    }

    return () => {
      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, [selectedInvoice]);

  const columns2 = [
    {
      title: "#",
      dataIndex: "index",
      key: "date",
      render: (text, record, index) => index + 1,
      width: "5%",
    },
    {
      title: "Code",
      dataIndex: "item_code",
      width: "10%",
      key: "item_code",
      ellipsis: true,
    },
    {
      title: "Name",
      dataIndex: "item_name",
      key: "item_name",
      width: "16%",
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "item_description",
      key: "item_description",
      width: "20%",
      ellipsis: true,

      // render: (text, record, index) => parseInt(text).toLocaleString(),
    },
    {
      title: "Qty",
      key: "quantity",
      dataIndex: "quantity",
      width: "5%",
      ellipsis: true,
      // render: (text, record, index) => parseInt(text).toLocaleString(),
      // render: (text, record, index) => record.category.category_name,
    },
    {
      title: "Unit Amount",
      key: "unit_amount",
      dataIndex: "unit_amount",
      width: "10%",
      ellipsis: true,
      render: (text, record, index) => parseInt(text).toLocaleString(),
      // render: (text, record, index) => record.category.category_name,
    },
    {
      title: "Total",
      key: "total",
      dataIndex: "total",
      width: "10%",
      render: (text, record, index) =>
        (
          parseInt(record.unit_amount) * parseInt(record.quantity)
        ).toLocaleString(),
      // render: (text, record, index) => record.category.category_name,
    },
  ];

  const paymentsColumns = [
    {
      title: "Date",
      dataIndex: "allocation_date",
      width: "20%",
      key: "allocation_date",
      ellipsis: true,
      render: (text, record, index) => formatDateString(parseInt(text)),
    },
    {
      title: "Payment Reference Token (PRT)",
      dataIndex: "prt",
      key: "prt",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "10%",
      ellipsis: true,

      render: (text, record, index) => parseInt(text).toLocaleString(),
    },
    {
      title: "Posted By",
      dataIndex: "posted_by",
      key: "posted_by",
      width: "20%",
      ellipsis: true,

      // render: (text, record, index) => parseInt(text).toLocaleString(),
    },
  ];

  const creditNotesColumns = [
    {
      title: "Date",
      dataIndex: "date",
      width: "20%",
      key: "date",
      ellipsis: true,
    },
    {
      title: "Credit Note Number",
      dataIndex: "credit_note_no",
      key: "credit_note_no",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Amount",
      dataIndex: "allocated_amount",
      key: "allocated_amount",
      width: "10%",
      ellipsis: true,

      // render: (text, record, index) => parseInt(text).toLocaleString(),
    },
    {
      title: "Allocated By",
      dataIndex: "allocated_by",
      key: "allocated_by",
      width: "20%",
      ellipsis: true,

      // render: (text, record, index) => parseInt(text).toLocaleString(),
    },
  ];

  const data = [
    {
      code: "600001",
      name: "TUITION FEES",
      desc: "TUITION FEES",
      qty: 1,
      amount: "1003000",
      total: "1003000",
    },
  ];

  const txns = [
    {
      date: "MON-09-JULY-2024",
      prt: "JKJKSKJSDKJDSB",
      amount: "1003000",
      posted_by: "TREDPAY",
    },
  ];

  const credit_notes = [
    {
      date: "TUE 21-NOV-2023 05:49 pm",
      credit_note_no: "2000101041-CN-04939500767",
      invoice_no: "2000101041-T55243413",
      credit_amount: "300000.0",
      allocated_amount: "300000.0",
      allocated_by: "MR. MALUNDA VINCENT",
      approved_by: "MR. OLEJA PATRICK",
    },
  ];

  return (
    <Modal
      title={
        <Typography.Title
          style={{
            color: "#fff",
            padding: 0,
            margin: 0,
          }}
          level={5}
        >
          Invoice Details
        </Typography.Title>
      }
      // centered
      maskClosable={false}
      open={invoiceDetailsModalVisible}
      onOk={() => dispatch(setInvoiceDetailsModalVisible(false))}
      onCancel={() => dispatch(setInvoiceDetailsModalVisible(false))}
      width={900}
      okButtonProps={{
        style: {
          display: "none",
        },
      }}
      cancelText="Close"
      closeIcon={
        <Close
          style={{
            color: "#fff",
          }}
        />
      }
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
        ref={scrollContainerRef}
        style={{
          position: "relative",
          height: "calc(100vh - 300px)", // Adjust this height as needed
          // marginTop: 10,
          //   backgroundColor: "red",

          padding: 5,
          overflowY: "hidden", // Hide default scrollbars
        }}
      >
        <div
          style={{
            paddingRight: 20,
            paddingLeft: 20,
          }}
        >
          <div
            style={{
              marginBottom: 20,
            }}
          >
            <Alert
              style={{
                padding: 0,
              }}
              message={
                <Space size={20} wrap>
                  <div style={{ padding: "7px" }}>
                    <Text strong>INVOICE NUMBER:</Text>{" "}
                    {selectedInvoice?.invoice_no}
                  </div>

                  <div style={{ padding: "7px" }}>
                    <Text strong>CREATED ON:</Text>{" "}
                    {formatDateString(parseInt(selectedInvoice?.invoice_date))}
                  </div>
                </Space>
              }
            ></Alert>
          </div>

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
              showHeader={true}
              // loading={loading || deletingItem}
              size="small"
              columns={columns2}
              pagination={false}
              dataSource={selectedInvoice?.line_items}
              scroll={{
                y: "calc(100vh - 300px)",
              }}
            />
          </ConfigProvider>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: "10px",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <Text strong style={{ marginRight: "30px" }}>
                TOTAL:
              </Text>
              <Text strong>
                {selectedInvoice?.line_items
                  .reduce((acc, item) => {
                    acc += parseInt(item.unit_amount) * parseInt(item.quantity);
                    return acc;
                  }, 0)
                  .toLocaleString()}
              </Text>
            </div>
          </div>

          {selectedInvoice?.txns.length > 0 && (
            <div
              style={{
                marginBottom: 10,
              }}
            >
              <Divider
                dashed
                style={{
                  borderColor: "lightgray",
                }}
              >
                Payments
              </Divider>
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
                  showHeader={true}
                  // loading={loading || deletingItem}
                  size="small"
                  columns={paymentsColumns}
                  pagination={false}
                  dataSource={selectedInvoice?.txns}
                  scroll={{
                    y: "calc(100vh - 300px)",
                  }}
                />
              </ConfigProvider>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingTop: "10px",
                }}
              >
                <div style={{ textAlign: "right" }}>
                  <Text strong style={{ marginRight: "30px", color: "red" }}>
                    TOTAL LESS PAYMENTS:
                  </Text>
                  <Text strong style={{ color: "red" }}>
                    {selectedInvoice?.txns
                      .reduce((acc, txn) => {
                        acc += parseInt(txn.amount);
                        return acc;
                      }, 0)
                      .toLocaleString()}
                  </Text>
                </div>
              </div>
            </div>
          )}

          {false && (
            <div>
              <Divider
                dashed
                style={{
                  borderColor: "lightgray",
                }}
              >
                Credit Notes
              </Divider>
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
                  showHeader={true}
                  // loading={loading || deletingItem}
                  size="small"
                  columns={creditNotesColumns}
                  pagination={false}
                  dataSource={credit_notes}
                  scroll={{
                    y: "calc(100vh - 300px)",
                  }}
                />
              </ConfigProvider>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingTop: "10px",
                }}
              >
                <div style={{ textAlign: "right", color: "red" }}>
                  <Text strong style={{ marginRight: "30px", color: "red" }}>
                    TOTAL CREDIT NOTES:
                  </Text>
                  <Text style={{ color: "red" }} strong>
                    2,90000
                  </Text>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: "10px",
            }}
          >
            <div style={{ textAlign: "right", color: "red" }}>
              <Divider
                dashed
                style={{
                  borderColor: "black",
                  margin: 0,
                }}
              ></Divider>
              <div
                style={{
                  padding: 10,
                }}
              >
                <Text
                  strong
                  style={{ marginRight: "30px", fontSize: "2.5rem" }}
                >
                  AMOUNT DUE (UGX):
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: "2.5rem",
                  }}
                >
                  {selectedInvoice?.amount_due.toLocaleString()}
                </Text>
              </div>
              <Divider
                dashed
                style={{
                  borderColor: "black",
                  margin: 0,
                }}
              ></Divider>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default InvoiceDetailsModal;
