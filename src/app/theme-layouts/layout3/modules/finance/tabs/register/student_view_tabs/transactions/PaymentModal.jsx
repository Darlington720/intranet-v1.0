import React, { useState } from "react";
import { Modal, Collapse, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPaymentModalVisible,
  selectStudentData,
  setPaymentModalVisible,
} from "../../../../store/financeSlice";
import { CaretRightOutlined } from "@ant-design/icons";
import GenerateTable from "./prt/GenerateTable";
import PartialPayment from "./prt/PartialPayment";
import Deposit from "./prt/Deposit/Deposit";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const PaymentModal = () => {
  //   const [open, setOpen] = useState(false);
  const paymentModalVisible = useSelector(selectPaymentModalVisible);
  const studentFile = useSelector(selectStudentData);
  const dispatch = useDispatch();

  const getItems = (panelStyle, invoices) => {
    if (!invoices || invoices.length == 0) {
      return [
        {
          key: "3",
          label: (
            <span
              style={{
                fontSize: 16,
              }}
            >
              {"GENERATE PRT TO DEPOSIT TO MY ACCOUNT"}
            </span>
          ),
          children: <Deposit />,
          style: panelStyle,
        },
      ];
    } else {
      return [
        {
          key: "1",
          label: (
            <span
              style={{
                fontSize: 16,
              }}
            >
              {"GENERATE PRT TO PAY FOR ALL PENDING INVOICES"}
            </span>
          ),
          children: <GenerateTable />,
          style: panelStyle,
        },
        {
          key: "2",
          label: (
            <span
              style={{
                fontSize: 16,
              }}
            >
              {"GENERATE PRT TO MAKE PARTIAL PAYMENT ON PENDING INVOICES"}
            </span>
          ),

          children: <PartialPayment />,
          style: panelStyle,
        },
        {
          key: "3",
          label: (
            <span
              style={{
                fontSize: 16,
              }}
            >
              {"GENERATE PRT TO DEPOSIT TO MY ACCOUNT"}
            </span>
          ),
          children: <Deposit />,
          style: panelStyle,
        },
      ];
    }
  };

  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 20,
    background: "#dfe6ef",
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  return (
    <>
      <Modal
        title="Generate a Payment Reference Token"
        // centered
        maskClosable={false}
        open={paymentModalVisible}
        onOk={() => dispatch(setPaymentModalVisible(false))}
        onCancel={() => dispatch(setPaymentModalVisible(false))}
        width={1000}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        cancelText="Close"
        // style={{
        //   top: 20,
        // }}
      >
        <Collapse
          bordered={false}
          accordion
          size="middle"
          //   defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              style={{
                fontSize: 19,

                marginTop: 3,
              }}
              rotate={isActive ? 90 : 0}
            />
          )}
          style={{
            background: token.colorBgContainer,
            marginTop: 15,
          }}
          items={getItems(panelStyle, studentFile?.invoices)}
        />
      </Modal>
    </>
  );
};
export default PaymentModal;
