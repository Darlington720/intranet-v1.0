import { Edit, Info } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Space, Button, Tooltip, ConfigProvider, Table, Progress } from "antd";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedInvoice,
  selectStudentData,
  setInvoiceDetailsModalVisible,
  setPaymentModalVisible,
  setSelectedInvoice,
} from "../../../../store/registrationSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import InvoiceDetailsModal from "./InvoiceDetailsModal";

const formatInvoiceData = (invoices = []) => {
  // Create a map to store unique groups based on (study_year, semester, academic_year)

  if (!invoices) return [];
  const uniqueGroups = new Map();

  // Iterate through the invoices
  invoices.forEach((invoice) => {
    const { study_year, semester, academic_year } = invoice;

    // Create a unique key based on the 3 properties
    const uniqueKey = `${study_year}-${semester}-${academic_year}`;

    // Only add to the map if the unique key doesn't already exist
    if (!uniqueGroups.has(uniqueKey)) {
      // Create the display text
      const displayText = `Year ${study_year}, Semester ${semester} (${academic_year})`;

      // Add the unique group to the map
      uniqueGroups.set(uniqueKey, {
        key: uniqueKey,
        name: displayText,
        data: {
          study_year,
          semester,
          academic_year,
        },
      });
    }
  });

  // Convert the map values to an array to return the final data
  return Array.from(uniqueGroups.values());
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

function Invoices() {
  const studentFile = useSelector(selectStudentData);
  const dispatch = useDispatch();
  const groups = formatInvoiceData(studentFile?.invoices);
  const selectedInvoice = useSelector(selectSelectedInvoice);

  // console.log("groups", groups);
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
        title: "Invoice No",
        dataIndex: "invoice_no",
        width: "30%",
        key: "invoice_no",
        ellipsis: true,
      },
      {
        title: "Curr",
        dataIndex: "currency_code",
        key: "item_name",
        width: "10%",
        ellipsis: true,
      },
      {
        title: "Amount",
        dataIndex: "total_amount",
        key: "amount",
        ellipsis: true,

        render: (text, record, index) => parseInt(text).toLocaleString(),
        width: "15%",
      },
      {
        title: "Paid",
        key: "paid",
        dataIndex: "amount_paid",
        width: "15%",
        render: (text, record, index) => parseInt(text).toLocaleString(),
        // render: (text, record, index) => record.category.category_name,
      },
      {
        title: "Due",
        dataIndex: "amount_due",
        key: "due",
        width: "15%",
        render: (text, record, index) => parseInt(text).toLocaleString(),
      },

      {
        title: "Narration",
        dataIndex: "narration",
        key: "narration",
        width: "20%",
      },
      {
        title: "Percentage Paid",
        dataIndex: "percentage",
        key: "percentage",
        width: "23%",
        render: (text, record, index) => (
          <ConfigProvider
            theme={{
              components: {
                Progress: {
                  lineBorderRadius: 0,
                },
              },
            }}
          >
            <Progress
              percent={parseInt(
                (record.amount_paid / record.total_amount) * 100
              )}
              style={
                {
                  // width: 100,
                }
              }
              percentPosition={{
                // align: "center",
                type: "outer",
              }}
              strokeColor="dodgerblue"
              format={(percent) => `${percent}% `}
              size={["100%", 20]}
            />
          </ConfigProvider>
        ),
      },
    ];

    // const data = [
    //   {
    //     invoice_no: "2000101041-T676732673267",
    //     currency: "UGX",
    //     amount: "2093930",
    //     paid: "3399993",
    //     due: "87387387",
    //     narration: "Tuition",
    //     percentage: "30",
    //   },
    //   {
    //     invoice_no: "2000101041-T676732673267",
    //     currency: "UGX",
    //     amount: "2093930",
    //     paid: "3399993",
    //     due: "87387387",
    //     narration: "Functional",
    //     percentage: "30",
    //   },
    // ];

    // console.log("data2", filteredFeesItems);
    const data2 = studentFile?.invoices.filter(
      (inv) =>
        inv.study_year == row.data.study_year &&
        inv.semester == row.data.semester &&
        inv.academic_year == row.data.academic_year
    );

    const handleSelect = (record) => {
      // console.log("selected inv", record);
      dispatch(setSelectedInvoice(record));
    };

    return (
      <Table
        size="small"
        // bordered
        columns={columns2}
        dataSource={data2}
        pagination={false}
        rowKey={"invoice_no"}
        rowHoverable
        rowSelection={{
          type: "radio",
          onSelect: handleSelect,
          selectedRowKeys: selectedInvoice
            ? [selectedInvoice.invoice_no]
            : null,
        }}
        // rowSelection={{
        //   type: "radio",
        // }}
        summary={(pageData) => {
          // console.log("page data", pageData);
          let totalAmount = 0;
          let totalDue = 0;
          let totalPaid = 0;
          pageData.map((data) => {
            totalAmount += parseInt(data.total_amount);
            totalPaid += parseInt(data.amount_paid);
            totalDue += parseInt(data.amount_due);
          });
          return (
            <>
              <Table.Summary.Row
                style={{
                  borderBottom: "none",
                }}
              >
                {/* Adjust the colSpan to leave the first 3 columns empty */}
                <Table.Summary.Cell
                  colSpan={3}
                  style={{
                    borderBottom: "none",
                  }}
                ></Table.Summary.Cell>
                <Table.Summary.Cell
                  style={{
                    borderBottom: "none",
                  }}
                >
                  <span
                    style={{
                      color: "green",
                      fontWeight: "bold",
                    }}
                  >
                    TOTAL
                  </span>{" "}
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
                    {parseInt(totalAmount).toLocaleString()}
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
                    {parseInt(totalPaid).toLocaleString()}
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
                    {parseInt(totalDue).toLocaleString()}
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

  // const data = [
  //   {
  //     key: "2",
  //     name: (
  //       <span
  //         style={{
  //           color: "dodgerblue",
  //         }}
  //       >
  //         {"Year 1, Semester 1, Accademic Year 2020/2021"}
  //       </span>
  //     ),
  //   },
  //   {
  //     key: "1",
  //     name: (
  //       <span
  //         style={{
  //           color: "dodgerblue",
  //         }}
  //       >
  //         {"Year 1, Semester 2, Accademic Year 2020/2021"}
  //       </span>
  //     ),
  //   },
  // ];

  const data = groups.map((group) => ({
    key: group.key,
    name: (
      <span
        style={{
          color: "#0076eb",
          // fontWeight: "normal",
        }}
      >
        {group.name}
      </span>
    ),
    data: group.data,
  }));

  const handleInvoiceDetails = () => {
    if (!selectedInvoice) {
      dispatch(
        showMessage({
          message: "Please select an invoice!!!",
          variant: "info",
        })
      );

      return;
    }
    // console.log("selected invoice", selectedInvoice);
    dispatch(setInvoiceDetailsModalVisible(true));
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
          // style={{
          //   backgroundColor: "dodgerblue",
          // }}
          disabled={!studentFile}
          onClick={() => dispatch(setPaymentModalVisible(true))}
        >
          Generate Payment Reference Token
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Space>
            <Button
              disabled={!studentFile}
              size="small"
              // type="primary"
              // ghost
              icon={<Edit />}
            >
              Edit
            </Button>

            <Button
              disabled={!studentFile}
              size="small"
              // type="primary"
              // ghost
              onClick={handleInvoiceDetails}
              icon={<Info />}
            >
              Details
            </Button>
          </Space>
        </div>
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

      <InvoiceDetailsModal />
    </div>
  );
}

export default Invoices;
