import { Refresh } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Space, Tooltip, Button, ConfigProvider, Table } from "antd";
import React from "react";

const columns = [
  {
    title: "#",
    dataIndex: "#",
    key: "#",
    width: 40,
  },
  {
    title: "Credit Note ID",
    dataIndex: "credit_note_id",
    key: "credit_note_id",
  },
  {
    title: "Invoice Number",
    dataIndex: "invoice_no",
    key: "invoice_no",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Created By",
    dataIndex: "created_by",
    key: "created_by",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
  },
];

function CreditNotes() {
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
          justifyContent: "flex-end",
        }}
      >
        <Space>
          <Tooltip title="Reload">
            <Button
              size="small"
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
          </Tooltip>
        </Space>
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
          showHeader={true}
          // loading={loading || deletingItem}
          size="small"
          columns={columns}
          dataSource={[]}
          scroll={{
            y: "calc(100vh - 300px)",
          }}
        />
      </ConfigProvider>
    </div>
  );
}

export default CreditNotes;
