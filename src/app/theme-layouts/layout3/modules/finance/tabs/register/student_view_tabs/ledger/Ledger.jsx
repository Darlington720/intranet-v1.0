import { Print, Refresh } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Space, Tooltip, Button, ConfigProvider, Table } from "antd";
import React from "react";

const columns = [
  {
    title: "#",
    dataIndex: "#",
    key: "#",
    width: "5%",
  },
  {
    title: "Timestamp",
    dataIndex: "timestamp",
    key: "timestamp",
    width: "50%",
  },
  {
    title: "Debit",
    dataIndex: "debit",
    key: "debit",
    width: "10%",
  },
  {
    title: "Credit",
    dataIndex: "credit",
    key: "credit",
    width: "10%",
  },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "balance",
    width: "10%",
  },
];

function Ledger() {
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

          <Button
            size="small"
            icon={
              <Print
                style={{
                  color: "gray",
                }}
              />
            }
          >
            Print
          </Button>
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

export default Ledger;
