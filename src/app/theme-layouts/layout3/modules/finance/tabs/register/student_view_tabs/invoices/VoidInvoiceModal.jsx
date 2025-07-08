import React, { useEffect, useState } from "react";
import {
  ConfigProvider,
  Form,
  Input,
  Modal,
  Table,
  Typography,
  message,
} from "antd";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedInvoice,
  selectVoidInvoiceModalVisible,
  setVoidInvoiceModalVisible,
} from "../../../../store/financeSlice";
import { useMutation } from "@apollo/client";
import { VOID_INVOICE } from "../../../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

function VoidInvoiceModal() {
  const dispatch = useDispatch();
  const voidInvoiceModalVisible = useSelector(selectVoidInvoiceModalVisible);
  const selectedInvoice = useSelector(selectSelectedInvoice);
  const [form] = Form.useForm();
  const [voidInvoice, { error, loading }] = useMutation(VOID_INVOICE, {
    refetchQueries: ["loadStudentFileWithVoid"],
  });


  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error?.message || "Failed to void invoice",
          variant: "error",
        })
      );
    }
  }, [error]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        invoiceNo: selectedInvoice?.invoice_no,
        voidedReason: values.voidReason,
      };

      const res = await voidInvoice({
        variables: payload,
      });

      if (res?.data?.voidInvoice?.success) {
        dispatch(
          showMessage({
            message: res?.data?.voidInvoice.message,
            variant: "success",
          })
        );
      }

      form.resetFields();
      dispatch(setVoidInvoiceModalVisible(false));
    } catch (error) {
      message.error(error?.message || "Failed to void invoice");
    } finally {
    }
  };

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
            VOID INVOICE - {selectedInvoice?.invoice_no}
          </Typography.Title>
        }
        maskClosable={false}
        open={voidInvoiceModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields();
          dispatch(setVoidInvoiceModalVisible(false));
        }}
        okText="Save"
        okButtonProps={{
          disabled: loading,
          loading,
        }}
        centered={true}
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
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="voidReason"
            label="Void Reason"
            rules={[{ required: true, message: "Please enter void reason" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter void reason" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default VoidInvoiceModal;
