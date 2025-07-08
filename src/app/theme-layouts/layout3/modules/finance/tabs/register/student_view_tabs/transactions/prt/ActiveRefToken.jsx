import React from "react";
import { Table, Empty } from "antd";
import "./PRT.css";

const columns = [
  {
    title: "TOKEN",
    dataIndex: "token",
    key: "token",
  },
  {
    title: "DATE CREATED",
    dataIndex: "date_created",
    key: "date_created",
  },
  {
    title: "CREATED BY",
    dataIndex: "created_by",
    key: "created_by",
  },
  {
    title: "AMOUNT TO PAY",
    key: "amount_to_pay",
    dataIndex: "amount_to_pay",
  },
  {
    title: "EXPIRY DATE",
    key: "expiry_date",
    dataIndex: "expiry_date",
  },
];

const data = [
  {
    key: "1",
    token: "2250001512200",
    date_created: "Tuition Fees",
    created_by: "1,380,000 UGX",
    amount_to_pay: "45 UGX",
    expiry_date: "1,379,955 UGX",
  },
];

const ActiveRefToken = () => {
  //   const handleGenerateToken = () => {
  //     Modal.success({
  //       title: (
  //         <div style={{ textAlign: "center" }}>
  //           PAYMENT REFERENCE TOKEN GENERATED SUCCESSFULLY 🎉
  //         </div>
  //       ), // Centering the title
  //       content: (
  //         <div
  //           style={{
  //             display: "flex",
  //             flexDirection: "column",
  //             alignItems: "center",
  //             margin: 0,
  //           }}
  //         >
  //           <p style={{ marginTop: "-10px" }}>
  //             PAYMENT REFERENCE TOKEN:{" "}
  //             <span style={{ color: "blue", fontWeight: "bold" }}>
  //               2250001512200
  //             </span>
  //           </p>
  //           <p style={{ marginTop: "-10px" }}>
  //             TOTAL AMOUNT TO PAY:{" "}
  //             <span style={{ color: "blue", fontWeight: "bold" }}>
  //               {" "}
  //               {totalAmountDue.toLocaleString()}
  //             </span>{" "}
  //             <span style={{ color: "blue", fontWeight: "bold" }}> UGX</span>
  //           </p>
  //           <p style={{ marginTop: "-10px" }}>
  //             EXPIRY DATE:{" "}
  //             <span style={{ color: "blue", fontWeight: "bold" }}>
  //               2024.08.24
  //             </span>
  //           </p>
  //           <Alert
  //             message="Copy this reference number and visit your bank to pay."
  //             type="info"
  //             showIcon
  //           />
  //         </div>
  //       ),
  //       width: 600, // Set your desired width here
  //       onOk() {},
  //     });
  //   };

  return (
    <div>
      <Table
        pagination={false}
        className="custom-table"
        size="small"
        columns={columns}
        dataSource={data}
        locale={{
          emptyText: <Empty />,
        }}
        // summary={() => (
        //   <Table.Summary.Row>
        //     <Table.Summary.Cell index={0} colSpan={4}>
        //       <strong>TOTAL AMOUNT TO PAY</strong>
        //     </Table.Summary.Cell>
        //     <Table.Summary.Cell index={4}>
        //       <strong>{totalAmountDue.toLocaleString()} UGX</strong>
        //     </Table.Summary.Cell>
        //   </Table.Summary.Row>
        // )}
      />
    </div>
  );
};

export default ActiveRefToken;
