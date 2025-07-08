import React, { useEffect } from "react";
import { Table, Button, Modal, Alert } from "antd";
import "./PRT.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStudentData,
  setPaymentSlipVisible,
  setTokenRes,
} from "app/theme-layouts/layout3/modules/registration/store/registrationSlice";
import { selectUser } from "app/store/userSlice";
import { useMutation } from "@apollo/client";
import { GENERATE_PRT } from "app/theme-layouts/layout3/modules/registration/gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const columns = [
  {
    title: "INVOICE NO.",
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
    key: "paid",
    render: (text) => text.toLocaleString(),
    dataIndex: "paid",
  },
  {
    title: "AMOUNT DUE",
    key: "amount_due",
    render: (text) => text.toLocaleString(),
    dataIndex: "amount_due",
  },
];

const data = [
  {
    key: "1",
    invoice_no: "T-INV1088619943",
    desc: "Tuition Fees",
    amount: "1,380,000 UGX",
    paid: "45 UGX",
    amount_due: "1,379,955 UGX",
  },
  {
    key: "2",
    invoice_no: "T-INV653527027",
    desc: "Tuition Fees",
    amount: "1,380,000 UGX",
    paid: "0 UGX",
    amount_due: "1,220,000 UGX",
  },
  {
    key: "3",
    invoice_no: "F-INV1628648347",
    desc: "Functional Fees",
    amount: "599,755 UGX",
    paid: "0 UGX",
    amount_due: "599,755 UGX",
  },
];

const GenerateTable = () => {
  const studentFile = useSelector(selectStudentData);
  const userObj = useSelector(selectUser);
  const dispatch = useDispatch();
  const [generatePRT, { loading, error, data }] = useMutation(GENERATE_PRT);

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

  // console.log("invoices", );
  const unpaidInvoices = studentFile?.invoices.filter(
    (inv) => inv.amount_due > 0
  );
  const totalAmountDue = unpaidInvoices.reduce(
    (total, item) => total + parseInt(item.amount_due),
    0
  );

  const handleGenerateToken = async (unpaidInvoices) => {
    let newData = [];

    unpaidInvoices.map((inv, index) => {
      newData.push({
        ...inv,
        allocate_amount: inv.total_amount,
      });
    });

    const payload = {
      studentNo: studentFile?.student_no,
      amount: totalAmountDue,
      type: "invoice_ref",
      generatedBy: userObj.user.user_id,
      invoices: JSON.stringify(newData),
    };

    // console.log("payload", payload);

    const res = await generatePRT({
      variables: payload,
    });

    // console.log("res", res.data);

    dispatch(setTokenRes(res.data.generatePRT));

    dispatch(setPaymentSlipVisible(true));

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
    //           {totalAmountDue.toLocaleString()}
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
    <div>
      <Table
        pagination={false}
        className="custom-table"
        size="small"
        columns={columns}
        dataSource={unpaidInvoices}
        summary={(records) => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4}>
              <strong>TOTAL AMOUNT TO PAY</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4}>
              <strong>
                {records
                  .reduce((total, item) => total + parseInt(item.amount_due), 0)
                  .toLocaleString()}{" "}
                UGX
              </strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <div style={{ margin: 16, textAlign: "right" }}>
        <Button
          type="primary"
          onClick={() => handleGenerateToken(unpaidInvoices)}
          loading={loading}
        >
          GENERATE TOKEN
        </Button>
      </div>
    </div>
  );
};

export default GenerateTable;
