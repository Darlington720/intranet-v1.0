import { Edit, Info } from "@mui/icons-material";
import { Box } from "@mui/material";
import { borderBottom } from "@mui/system";
import { Space, Button, Tooltip, ConfigProvider, Table, Progress } from "antd";
import React from "react";
import "./styles.css";

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

const data = [
  {
    key: "2",
    name: (
      <span
        style={{
          color: "dodgerblue",
        }}
      >
        {"Year 1, Semester 1"}
      </span>
    ),
  },
  {
    key: "1",
    name: (
      <span
        style={{
          color: "dodgerblue",
        }}
      >
        {"Year 1, Semester 2"}
      </span>
    ),
  },
];

function FeesStructure() {
  const expandedRowRender = (row) => {
    // console.log("details", row);

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
        dataIndex: "code",
        width: "10%",
        key: "code",
        ellipsis: true,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: "40%",
        ellipsis: true,
      },
      {
        title: "Category",
        key: "category",
        dataIndex: "category",
        width: "15%",
        // render: (text, record, index) => parseInt(text).toLocaleString(),
        // render: (text, record, index) => record.category.category_name,
      },
      {
        title: "Type",
        key: "type",
        dataIndex: "type",
        width: "15%",
        // render: (text, record, index) => parseInt(text).toLocaleString(),
        // render: (text, record, index) => record.category.category_name,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        ellipsis: true,

        render: (text, record, index) => parseInt(text).toLocaleString(),
        width: "15%",
      },
    ];

    const data = [
      {
        code: "201",
        name: "Tuition",
        category: "Tuition",
        type: "Mandatory",
        amount: "24370000",
      },
      {
        code: "201",
        name: "REGISTRATION FEE",
        category: "functional",
        type: "Mandatory",
        amount: "50000",
      },
    ];

    // console.log("data2", filteredFeesItems);

    return (
      <Table
        size="small"
        // bordered
        columns={columns2}
        dataSource={data}
        pagination={false}
        rowHoverable
        // rowSelection={{
        //   type: "radio",
        // }}
        summary={(pageData) => {
          return (
            <>
              <Table.Summary.Row
                style={{
                  borderBottom: "none",
                }}
              >
                {/* Adjust the colSpan to leave the first 3 columns empty */}
                <Table.Summary.Cell
                  colSpan={2}
                  style={{
                    borderBottom: "none",
                  }}
                ></Table.Summary.Cell>
                <Table.Summary.Cell
                  style={{
                    borderBottom: "none",
                  }}
                >
                  {/* Place the "Tot" label in the fourth column */}
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  style={{
                    borderBottom: "none",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {/* {parseInt(12000000).toLocaleString()} */}
                  </span>{" "}
                  {/* Place the total value in the fifth column */}
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  style={{
                    borderBottom: "none",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {/* {parseInt(12000000).toLocaleString()} */}
                  </span>{" "}
                  {/* Place the total value in the fifth column */}
                </Table.Summary.Cell>
                <Table.Summary.Cell
                  style={{
                    borderBottom: "none",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {parseInt(12000000).toLocaleString()}
                  </span>{" "}
                  {/* Place the total value in the fifth column */}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    );
  };

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
          // alignItems: "center",
          // paddingRight: 10,
          //   marginBottom: 8,
          // backgroundColor: "red",

          // height: 40,
        }}
      >
        <Space>
          <Tooltip title="Edit Invoice">
            <Button size="small" type="primary" ghost icon={<Edit />}>
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="View Invoice details">
            <Button
              size="small"
              icon={
                <Info
                  style={{
                    color: "gray",
                  }}
                />
              }
            >
              Details
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
          showHeader={false}
          // loading={loading || deletingItem}
          size="small"
          columns={columns}
          expandable={{
            expandedRowRender,
            defaultExpandAllRows: true,
            // defaultExpandedRowKeys: [...feesCategories.map((cat) => cat.id)],
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

export default FeesStructure;
