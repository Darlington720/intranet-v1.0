import React from "react";
import { Modal, Button, Divider, QRCode, Row, Col, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPaymentSlipVisible,
  selectStudentData,
  selectTokenRes,
  setPaymentSlipVisible,
} from "app/theme-layouts/layout3/modules/registration/store/registrationSlice";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";
const { Title, Text } = Typography;

const PaymentSlip = () => {
  const paymentSlipVisible = useSelector(selectPaymentSlipVisible);
  const studentFile = useSelector(selectStudentData);
  const tokenRes = useSelector(selectTokenRes);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(setPaymentSlipVisible(false));
  };
  return (
    <Modal
      //   style={{ top: 0 }}
      title="Generate a Payment Reference"
      maskClosable={false}
      open={paymentSlipVisible}
      to
      onCancel={onClose}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button style={{ marginRight: 10 }} key="close" onClick={onClose}>
            Close
          </Button>
          <Button key="print" type="primary" style={{ marginRight: 5 }}>
            Print
          </Button>
          <Button
            key="mobile"
            type="primary"
            danger
            style={{ marginLeft: "auto" }}
          >
            Pay via Mobile Money
          </Button>
        </div>
      }
      width={800}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <img
            src="https://cdn.worldvectorlogo.com/logos/nkumba-uninersity.svg"
            alt="University Logo"
            style={{ height: 50 }}
          />
          <QRCode bordered={false} size={50} value="https://ant.design/" />
        </div>
      </div>

      <Divider
        variant="dashed"
        style={{
          //   color: "red",
          borderColor: "lightgray",
          marginTop: 10,
          marginBottom: 5,
        }}
      />

      <Title level={5} style={{ textAlign: "center" }}>
        Trepay Payment Slip
      </Title>

      <Divider
        variant="dashed"
        // type="vertical"
        style={{
          //   color: "red",
          borderColor: "lightgray",
          marginTop: 5,
          marginBottom: 0,
          height: "100%",
        }}
      />

      <Row gutter={16} style={{ marginTop: 0 }}>
        <Col span={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              //   backgroundColor: "red",
            }}
          >
            <Text strong>Student Name:</Text>
            <Text>{`${studentFile?.biodata.surname} ${studentFile?.biodata.other_names}`}</Text>
          </div>
          {/* <br /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              //   backgroundColor: "red",
            }}
          >
            <Text strong>Student ID:</Text>
            <Text> {studentFile?.student_no}</Text>
          </div>
          {/* <br /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              //   backgroundColor: "red",
            }}
          >
            <Text strong>Amount:</Text>
            <Text>{tokenRes?.amount.toLocaleString()} UGX</Text>
          </div>
          {/* <br /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              //   backgroundColor: "red",
            }}
          >
            <Text strong>Expiry:</Text>
            <Text> {formatDateString(parseInt(tokenRes?.prt_expiry))}</Text>
          </div>

          <br />
          {/* <Divider
            variant="dashed"
            style={{
              //   color: "red",
              borderColor: "lightgray",
              marginTop: 10,
              marginBottom: 10,
            }}
          /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              //   backgroundColor: "red",
            }}
          >
            <Text
              strong
              style={
                {
                  // marginRight: 10,
                }
              }
            >
              Payable from:
            </Text>
            <ul>
              <li>CENTENARY BANK</li>
              <li>DFCU BANK</li>
              <li>STANBIC BANK</li>
            </ul>
          </div>
        </Col>
        <Col span={2}>
          <Divider
            variant="dashed"
            type="vertical"
            style={{
              //   color: "red",
              borderColor: "lightgray",
              marginTop: 0,
              marginBottom: 0,
              height: "100%",
            }}
          />
        </Col>
        <Col span={10} style={{ textAlign: "right" }}>
          <Text strong>Payment Token:</Text> {tokenRes?.prt}
          <br />
          <Text strong>Amount:</Text> UGX. {tokenRes?.amount.toLocaleString()}/-
        </Col>
      </Row>

      <Divider
        variant="dashed"
        style={{
          //   color: "red",
          borderColor: "lightgray",
          marginTop: 0,
          marginBottom: 10,
        }}
      />
      <Text>Allocations.</Text>
      <br />
      <Text>{tokenRes?.allocations}</Text>
    </Modal>
  );
};

export default PaymentSlip;
