import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import * as yup from "yup";

import _ from "lodash";
import { lighten } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { Button as Button2, Form, Input, Space } from "antd";
import {
  selectSelectedCategoryRow,
  setSelectedCategoryRow,
} from "../../store/feesMgtSlice";
import formatToShortDate from "app/theme-layouts/layout3/utils/formatToShortDate";
import { SAVE_FEES_CATEGORY } from "../../gql/mutations";
import { useMutation } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const schema = yup.object().shape({
  intake_title: yup.string().required("You must enter the intake title"),
});

const defaultValues = {
  id: null,
  intake_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

function CategoryForm() {
  const user = useSelector((state) => state.user.user);
  const selectedCategory = useSelector(selectSelectedCategoryRow);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [saveFeesCategory, { loading: savingCategory, error, data }] =
    useMutation(SAVE_FEES_CATEGORY, {
      refetchQueries: ["getFeesCategories"],
    });

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

  const onFinish = async (values) => {
    // console.log("Success:", values);
    const payload = {
      category: values.category,
      addedBy: user.user_id,
      saveFeesCategoryId: selectedCategory?.id,
    };

    // console.log("the payload", payload);
    const res = await saveFeesCategory({
      variables: payload,
    });

    form.resetFields();
    form2.resetFields();

    dispatch(
      showMessage({
        message: res.data.saveFeesCategory.message,
        variant: "success",
      })
    );
  };

  // console.log("selected row", selectedCategory);

  useEffect(() => {
    if (selectedCategory) {
      form.setFieldsValue({
        category: selectedCategory.category_name,
      });

      form2.setFieldsValue({
        added_by: `${selectedCategory.added_user?.title} ${selectedCategory.added_user?.staff_name}`,
      });

      if (selectedCategory.modified_user) {
        form2.setFieldsValue({
          modified_by: `${selectedCategory.modified_user?.title} ${selectedCategory.modified_user?.staff_name}`,
        });
        form2.setFieldsValue({
          modified_on: formatToShortDate(
            parseInt(selectedCategory?.modified_on)
          ),
        });
      } else {
        form2.setFieldsValue({
          modified_by: ``,
        });
        form2.setFieldsValue({
          modified_on: "",
        });
      }
    }
  }, [selectedCategory]);

  const handleClear = () => {
    form.resetFields();
    form2.resetFields();
    dispatch(setSelectedCategoryRow(null));
  };

  return (
    <div className="p-16">
      <Box
        className="p-8 w-full rounded-16 border"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.001)
              : lighten(theme.palette.background.default, 0.02),
          marginRight: 10,
          overflow: "auto",
        }}
      >
        <Divider
          textAlign="left"
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Typography className="font-medium text-20 bold">
            {"Add Fees Category"}
          </Typography>
        </Divider>

        <div className="max-w-full relative">
          <Box
            // component="form"
            sx={{
              "& .MuiTextField-root": { m: 0, width: "100%" },
            }}
            autoComplete="off"
            className={"max-w-full"}
            style={{
              padding: 8,
              //   backgroundColor: "red",
            }}
          >
            <Form
              name="basic"
              form={form}
              labelCol={
                {
                  // span: 8,
                }
              }
              // wrapperCol={{
              //   span: 16,
              // }}
              layout="vertical"
              style={
                {
                  // maxWidth: 600,
                }
              }
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please input the category",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Space
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Form.Item
                // wrapperCol={{
                //   offset: 8,
                //   span: 16,
                // }}
                >
                  <Button2 onClick={handleClear}>Clear</Button2>
                </Form.Item>
                <Form.Item
                // wrapperCol={{
                //   offset: 8,
                //   span: 16,
                // }}
                >
                  <Button2
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: savingCategory ? "" : "dodgerblue",
                    }}
                    loading={savingCategory}
                    disabled={savingCategory}
                  >
                    Save
                  </Button2>
                </Form.Item>
              </Space>
            </Form>
          </Box>
        </div>
      </Box>

      <Box
        className="p-8 w-full rounded-16 border"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.001)
              : lighten(theme.palette.background.default, 0.02),
          marginRight: 10,
          overflow: "auto",
          marginTop: 3,
        }}
      >
        <Divider
          textAlign="left"
          style={{
            marginTop: 10,
          }}
        >
          {" "}
          <Typography className="font-medium text-20 bold">{"Logs"}</Typography>
        </Divider>
        <div className="max-w-full relative">
          <Box
            // component="form"
            sx={{
              "& .MuiTextField-root": { m: 0, width: "100%" },
            }}
            autoComplete="off"
            className={"max-w-full"}
            style={{
              padding: 8,
              //   backgroundColor: "red",
            }}
          >
            <Form
              name="logs"
              form={form2}
              labelCol={
                {
                  // span: 8,
                }
              }
              // wrapperCol={{
              //   span: 16,
              // }}
              layout="vertical"
              style={
                {
                  // maxWidth: 600,
                }
              }
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item label="Added By" name="added_by">
                <Input readOnly />
              </Form.Item>

              <Form.Item label="Modified By" name="modified_by">
                <Input readOnly />
              </Form.Item>

              <Form.Item label="Modified On" name="modified_on">
                <Input readOnly />
              </Form.Item>
            </Form>
          </Box>
        </div>
      </Box>
    </div>
  );
}

export default CategoryForm;
