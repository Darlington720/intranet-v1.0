import React, { useEffect } from "react";

import {
  Button,
  ConfigProvider,
  Popconfirm,
  Space,
  Table,
  Input,
  Tooltip,
} from "antd";
import { Delete, Download, Edit } from "@mui/icons-material";
import { useMutation, useQuery } from "@apollo/client";
import { GET_FEES_ITEMS } from "../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFeesCategories,
  selectFeesItems,
  selectFilteredFeesItems,
  setFeesItems,
  setFilteredFeesItems,
  setSelectedFeeItemRow,
} from "../../store/feesMgtSlice";
import { DELETE_FEES_ITEM } from "../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { Box } from "@mui/material";

const { Search } = Input;

function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const items = [
  {
    key: "1",
    label: "Action 1",
  },
  {
    key: "2",
    label: "Action 2",
  },
];

function searchFeesItemsByTerm(data, term) {
  const lowerTerm = term.toLowerCase();

  return data.filter((item) => {
    // Check top-level properties
    const topLevelMatch = Object.keys(item).some((key) => {
      if (typeof item[key] === "string" || typeof item[key] === "number") {
        return String(item[key]).toLowerCase().includes(lowerTerm);
      }
      return false;
    });

    // Check nested category properties
    const categoryMatch =
      item.category &&
      Object.keys(item.category).some((key) => {
        if (
          typeof item.category[key] === "string" ||
          typeof item.category[key] === "number"
        ) {
          return String(item.category[key]).toLowerCase().includes(lowerTerm);
        }
        return false;
      });

    return topLevelMatch || categoryMatch;
  });
}

const DataTable = React.memo(() => {
  const dispatch = useDispatch();
  const feesItems = useSelector(selectFeesItems);
  const feesCategories = useSelector(selectFeesCategories);
  const filteredFeesItems = useSelector(selectFilteredFeesItems);
  const {
    error,
    loading,
    data: itemRes,
  } = useQuery(GET_FEES_ITEMS, {
    notifyOnNetworkStatusChange: true,
  });

  // console.log("feesCategories", feesCategories);

  const [
    deleteFeesItem,
    { error: deleteErr, loading: deletingItem, data: deleteRes },
  ] = useMutation(DELETE_FEES_ITEM, {
    refetchQueries: ["getFeesItems"],
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

    if (deleteErr) {
      dispatch(
        showMessage({
          message: deleteErr.message,
          variant: "error",
        })
      );
    }
  }, [error, deleteErr]);

  useEffect(() => {
    if (itemRes) {
      // console.log("items", itemRes);
      dispatch(setFeesItems(itemRes.fees_items));
      dispatch(setFilteredFeesItems(itemRes.fees_items));
    }
  }, [itemRes]);

  const expandedRowRender = (row) => {
    // console.log("details", row);

    const columns2 = [
      {
        title: "#",
        dataIndex: "index",
        key: "date",
        render: (text, record, index) => index + 1,
        width: 50,
      },
      {
        title: "Item Code",
        dataIndex: "item_code",
        width: 100,
        key: "item_name",
      },
      {
        title: "Item Name",
        dataIndex: "item_name",
        key: "item_name",
        width: 200,
        ellipsis: true,
      },
      {
        title: "Description",
        dataIndex: "item_description",
        key: "item_description",
        ellipsis: true,
        width: 150,
      },
      {
        title: "Category",
        key: "category",
        dataIndex: "category",
        render: (text, record, index) => record.category.category_name,
      },
      {
        title: "Fee Type",
        dataIndex: "fee_type",
        key: "fee_type",
        render: (text, record, index) =>
          record.mandatory ? "MANDATORY" : "OPTIONAL",
      },

      {
        title: "Action",
        key: "operation",
        render: (text, record, index) => (
          <Space size="middle">
            <Button
              size="small"
              type="primary"
              ghost
              onClick={() => handleRowClick(record)}
              icon={<Edit />}
            />
            <Popconfirm
              title="Delete Fees Item"
              description="Are you sure to delete this item?"
              onConfirm={(e) => confirm(e, record)}
              // onCancel={cancel}
              okText="Yes"
              okButtonProps={{
                style: {
                  backgroundColor: "dodgerblue",
                },
              }}
              cancelText="No"
            >
              <Button
                size="small"
                danger
                // onClick={() => handleRowDelete(record)}
                icon={<Delete color="red" />}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ];

    const confirm = (e, row) => {
      // console.log("the row", row);
      handleRowDelete(row);
    };

    const handleRowDelete = async (row) => {
      const payload = {
        feesItemId: row.id,
      };

      // console.log("delete", payload);

      const res = await deleteFeesItem({
        variables: payload,
      });

      dispatch(
        showMessage({
          message: res.data.deleteFeesItem.message,
          variant: "success",
        })
      );
    };

    const handleRowClick = (row) => {
      // console.log(row);
      dispatch(setSelectedFeeItemRow(row));
    };

    const data = [
      {
        key: "1",
        name: "TUITION",
        category: "TUTION",
        fee_type: "MANDATORY",
        is_variable: true,
      },
      {
        key: "2",
        name: "GUILD FEE",
        category: "FUNCTIONAL",
        amount: "5000",
        fee_type: "MANDATORY",
        is_variable: false,
      },
      {
        key: "3",
        name: "ANNUAL REPORT",
        category: "OTHER FEES",
        amount: "5000",
        fee_type: "OPTIONAL",
        is_variable: false,
      },
      {
        key: "4",
        name: "GUILD FEE",
        category: "FUNCTIONAL",
        amount: "5000",
        fee_type: "MANDATORY",
        is_variable: false,
      },
      {
        key: "5",
        name: "ANNUAL REPORT",
        category: "OTHER FEES",
        amount: "5000",
        fee_type: "OPTIONAL",
        is_variable: false,
      },
    ];

    const items = filteredFeesItems.filter(
      (item) => item.category?.id == row.key
    );

    // console.log("data2", filteredFeesItems);

    return <Table columns={columns2} dataSource={items} pagination={false} />;
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

  const data = feesCategories
    .filter((cat) => {
      const items = filteredFeesItems.filter(
        (item) => item.category?.id == cat.id
      );
      return items.length > 0; // Only keep categories with matching items
    })
    .map((cat) => {
      return {
        key: cat.id,
        name: (
          <span
            style={{
              color: "maroon",
            }}
          >
            {`Category: ${cat.category_name}`}
          </span>
        ),
      };
    });
  // const data = [
  //   {
  //     key: "2",
  //     name: (
  //       <span
  //         style={{
  //           color: "maroon",
  //         }}
  //       >
  //         {"Category: FUNCTIONAL"}
  //       </span>
  //     ),
  //   },
  //   {
  //     key: "1",
  //     name: (
  //       <span
  //         style={{
  //           color: "maroon",
  //         }}
  //       >
  //         {"Category: Tuition"}
  //       </span>
  //     ),
  //   },
  // ];

  const onSearch = (value) => {
    console.log("search:", value);
    if (value == "") dispatch(setFilteredFeesItems(feesItems));

    const filtered = searchFeesItemsByTerm(feesItems, value);

    console.log(filtered);

    dispatch(setFilteredFeesItems(filtered));
  };

  return (
    <>
      <div
        style={{
          padding: 10,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            borderColor: "lightgray",
            borderWidth: 1,
            // marginBottom: 1,
          }}
          className="p-5"
          style={{
            paddingLeft: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 10,
            marginBottom: 8,
            // backgroundColor: "red",

            // height: 40,
          }}
        >
          <div>
            <span
              variant="h6"
              color="inherit"
              component="div"
              style={{
                fontSize: "2rem",

                fontWeight: "500",
                // visibility: selectedTreeItem ? "visible" : "hidden",
              }}
            >
              Fees Items
            </span>
          </div>

          <div>
            <Space>
              <Search
                placeholder="Search Fees item..."
                // onSearch={onSearch}
                onChange={(e) => onSearch(e.target.value)}
                size="middle"
                width={500}
                style={{
                  width: 250,
                }}
              />

              <Tooltip title="Download Fees Items">
                <Download
                  style={{
                    fontSize: 25,
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
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
            loading={loading || deletingItem}
            size="small"
            columns={columns}
            expandable={{
              expandedRowRender,
              defaultExpandedRowKeys: [...feesCategories.map((cat) => cat.id)],
              expandedRowKeys: [...feesCategories.map((cat) => cat.id)],
            }}
            dataSource={data}
            scroll={{
              y: "calc(100vh - 190px)",
            }}
          />
        </ConfigProvider>
      </div>
    </>
  );
});
export default DataTable;





