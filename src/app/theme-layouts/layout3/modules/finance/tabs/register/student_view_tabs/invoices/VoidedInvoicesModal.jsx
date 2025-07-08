import React from "react";
import { ConfigProvider, Modal, Table, Typography } from "antd";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectVoidedInvoicesVisible,
  setVoidedInvoicesVisible,
  selectVoidedInvoices
} from "../../../../store/financeSlice";
import { parse } from "crypto-js/enc-base64";
import formatDateToYYYYMMDD from "app/theme-layouts/layout3/utils/convertDateToYYMMDD";

const columns = [
  {
    title: "#",
    dataIndex: "#",
    key: "#",
    width: 20,
    render: (text, record, index) => {
      return <span>{index + 1}</span>;
    },
    ellipsis: true,
  },
  {
    title: "Invoice No",
    dataIndex: "invoice_no",
    key: "invoice_no",
    width: 100,
    ellipsis: true,
  },
  {
    title: "Invoice Date",
    dataIndex: "invoice_date",
    key: "invoice_date",
    render: (text) => formatDateToYYYYMMDD(new Date(parseInt(text))),
    width: 100,
    ellipsis: true,
  },
  {
    title: "Curr",
    dataIndex: "currency_code",
    key: "currency_code",
    width: 40,
    ellipsis: true,
  },
  {
    title: "Amount",
    dataIndex: "total_amount",
    key: "total_amount",
    render: (text) => parseInt(text)?.toLocaleString(), 
    width: 100,
    ellipsis: true,
  },
  {
    title: "Voided On",
    dataIndex: "voided_on",
    key: "voided_on",
    width: 100,
    ellipsis: true,
  },
  {
    title: "Void By",
    dataIndex: "voided_by_name",
    key: "voided_by",
    width: 100,
    ellipsis: true,
  },
  {
    title: "Void Reason",
    dataIndex: "voided_reason",
    key: "voided_reason",
    width: 100,
    ellipsis: true,
  },
];

function VoidedInvoicesModal() {
  const dispatch = useDispatch();
  const voidedInvoicesModalVisible = useSelector(selectVoidedInvoicesVisible);
  const voidedInvoices = useSelector(selectVoidedInvoices)

  return (
    <div>
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
            Voided Invoices - {voidedInvoices?.length}
          </Typography.Title>
        }
        maskClosable={false}
        open={voidedInvoicesModalVisible}
        onOk={() => dispatch(setVoidedInvoicesVisible(false))}
        onCancel={() => dispatch(setVoidedInvoicesVisible(false))}
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
          },
          content: {
            padding: 0,
            height: "auto",
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
        <ConfigProvider
          theme={{
            components: {
              Table: {
                borderColor: "lightgray",
                borderRadius: 0,
                headerBorderRadius: 0,
              },
            },
          }}
        >
          <Table
            bordered
            pagination={false}
            // loading={loading || deletingItem}
            size="small"
            columns={columns}
           
            dataSource={voidedInvoices}
            scroll={{
              y: "calc(100vh - 250px)",
            }}
          />
        </ConfigProvider>
      </Modal>
    </div>
  );
}

export default VoidedInvoicesModal;
