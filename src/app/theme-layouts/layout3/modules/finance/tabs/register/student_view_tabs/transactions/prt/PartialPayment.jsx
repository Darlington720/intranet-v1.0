import React, { useEffect, useState } from "react";
import { Table, Button, InputNumber, Modal, Alert } from "antd";
import "./PRT.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStudentData,
  setPaymentSlipVisible,
  setTokenRes,
} from "app/theme-layouts/layout3/modules/registration/store/registrationSlice";
import { selectUser } from "app/store/userSlice";
import { GENERATE_PRT } from "app/theme-layouts/layout3/modules/registration/gql/mutations";
import { useMutation } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const columns = [
  {
    title: "INVOICE NO",
    dataIndex: "invoice_no",
    key: "invoice_no",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "narration",
    key: "narration",
  },
  {
    title: "AMOUNT",
    dataIndex: "total_amount",
    render: (text) => text.toLocaleString(),
    key: "total_amount",
  },
  {
    title: "PAID",
    dataIndex: "paid",
    render: (text) => text.toLocaleString(),
    key: "paid",
  },
  {
    title: "AMOUNT DUE",
    dataIndex: "amount_due",
    render: (text) => text.toLocaleString(),
    key: "amount_due",
  },
  {
    title: "AMOUNT TO PAY",
    key: "amount_to_pay",
    // render: (text, record, index) => (
    //   <InputNumber
    //     min={0}
    //     type="number"
    //     value={record.amount_to_pay}
    //     onChange={(value) => handleAmountChange(value, index)}
    //   />
    // ),
  },
];

const PartialPayment = () => {
  const studentFile = useSelector(selectStudentData);
  const userObj = useSelector(selectUser);
  const [totalAmountToPay, setTotalAmountToPay] = useState(0);
  const dispatch = useDispatch();
  const [generatePRT, { loading, error, data: prtRes }] =
    useMutation(GENERATE_PRT);

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

  const _unpaidInvoices = studentFile?.invoices.filter(
    (inv) => inv.amount_due > 0
  );

  const [data, setData] = useState(_unpaidInvoices);

  useEffect(() => {
    setData(_unpaidInvoices);
  }, [studentFile]);

  const handleAmountChange = (value, index) => {
    let newData = [...data];

    // Create a new object with the existing properties and add the new property
    newData[index] = {
      ...newData[index],
      allocate_amount: value,
    };

    // console.log("new Data", newData);

    setData(newData);
    // newData.map((inv) => {

    setTotalAmountToPay(
      newData.reduce(
        (total, item) => total + parseInt(item.allocate_amount || 0),
        0
      )
    );
    // });
  };

  // console.log("total amount", totalAmountToPay);

  const handleGenerateToken = async (unpaidInvoices) => {
    const allocatedInvs = unpaidInvoices.filter((inv) => inv.allocate_amount);
    console.log("allocated invoices", allocatedInvs);
    const payload = {
      studentNo: studentFile?.student_no,
      amount: totalAmountToPay,
      type: "invoice_ref",
      generatedBy: userObj.user.user_id,
      invoices: JSON.stringify(allocatedInvs),
    };

    console.log("payload", payload);

    const res = await generatePRT({
      variables: payload,
    });

    dispatch(setTokenRes(res.data.generatePRT));

    dispatch(setPaymentSlipVisible(true));

    setData(_unpaidInvoices);
    setTotalAmountToPay(0);

    // setData(unpaidInvoices);

    // console.log("res", res.data);
    // Modal.success({
    //   title: (
    //     <div style={{ textAlign: "center" }}>
    //       PAYMENT REFERENCE TOKEN GENERATED SUCCESSFULLY 🎉
    //     </div>
    //   ), // Centering the title
    //   content: (
    //     <div
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //         margin: 0,
    //       }}
    //     >
    //       <p style={{ marginTop: "-10px" }}>
    //         PAYMENT REFERENCE TOKEN:{" "}
    //         <span style={{ color: "blue", fontWeight: "bold" }}>
    //           2250001512200
    //         </span>
    //       </p>
    //       <p style={{ marginTop: "-10px" }}>
    //         TOTAL AMOUNT TO PAY:{" "}
    //         <span style={{ color: "blue", fontWeight: "bold" }}>
    //           {" "}
    //           {totalAmountToPay.toLocaleString()}
    //         </span>{" "}
    //         <span style={{ color: "blue", fontWeight: "bold" }}> UGX</span>
    //       </p>
    //       <p style={{ marginTop: "-10px" }}>
    //         EXPIRY DATE:{" "}
    //         <span style={{ color: "blue", fontWeight: "bold" }}>
    //           2024.08.24
    //         </span>
    //       </p>
    //       <Alert
    //         message="Copy this reference number and visit your bank to pay."
    //         type="info"
    //         showIcon
    //       />
    //     </div>
    //   ),
    //   width: 600, // Set your desired width here
    //   onOk() {},
    // });
  };

  return (
    <div style={{}}>
      <Table
        pagination={false}
        className="custom-table"
        size="small"
        columns={columns.map((col) => ({
          ...col,
          render:
            col.key === "amount_to_pay"
              ? (text, record, index) => (
                  <InputNumber
                    min={0}
                    max={data[index]?.amount_due}
                    value={
                      data[index]?.allocate_amount
                        ? data[index]?.allocate_amount
                        : 0
                    }
                    type="number"
                    style={{
                      width: "100%",
                    }}
                    onChange={(value) => handleAmountChange(value, index)}
                  />
                )
              : col.render,
        }))}
        dataSource={studentFile?.invoices.filter((inv) => inv.amount_due > 0)}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell
              index={0}
              colSpan={5}
              style={{ textAlign: "right" }}
            >
              <strong>TOTAL AMOUNT TO PAY</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={5}>
              <strong>{totalAmountToPay.toLocaleString()} UGX</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <div style={{ margin: 16, textAlign: "right" }}>
        <Button
          style={{}}
          type="primary"
          onClick={() => handleGenerateToken(data)}
          disabled={totalAmountToPay == 0}
          loading={loading}
        >
          GENERATE TOKEN
        </Button>
      </div>
    </div>
  );
};

export default PartialPayment;
