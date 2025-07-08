import * as React from "react";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { ConfigProvider, message, Table as Table2 } from "antd";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_RECENTLY_UPLOADED_IMAGES } from "../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { selectRecentUploads, setRecentUploads } from "../store/photosSlice";

function formatTimestamp(timestamp) {
  // Create a Date object from the timestamp (timestamp is in milliseconds)
  const date = new Date(parseInt(timestamp));

  // Options for formatting
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 12-hour time
  };

  // Format date into a string
  const formattedDate = date.toLocaleString("en-US", options);

  // Adjust the format to match "YYYY-MM-DD hh:mm AM/PM"
  const [datePart, timePart] = formattedDate.split(", ");
  const [month, day, year] = datePart.split("/");
  const [hour, minute, second] = timePart.split(":");

  // Determine AM or PM
  const amPm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12; // Convert 24-hour time to 12-hour time

  // Construct final formatted date string
  const finalFormattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${formattedHour}:${minute} ${amPm}`;

  return finalFormattedDate;
}

const renderRow = (record, text) => {
  return <span>{text}</span>;
};

const _columns = [
  {
    title: "#",
    dataIndex: "#",
    key: "index",
    width: 50,
    render: (text, record, index) => renderRow(record, index + 1),
  },
  // {
  //   title: "Student Number",
  //   dataIndex: "student_no",
  //   ellipsis: true,
  //   // render: (text, record, index) => (
  //   //   <span>{formatDateString(parseInt(text))}</span>
  //   // ),
  //   render: (text, record, index) => renderRow(record, text),
  //   width: 120,
  // },
  {
    title: "Student Name",
    ellipsis: true,
    dataIndex: "name",
    render: (text, record, index) => (
      <span>
        {record.student.biodata.surname +
          " " +
          record.student.biodata.other_names}
      </span>
    ),
    width: 180,
  },
  {
    title: "Uploaded By",
    ellipsis: true,
    dataIndex: "uploaded_by",
    render: (text, record, index) => {
      if (record.modified_user) {
        return (
          <span>
            {record.modified_user.title + " " + record.modified_user.staff_name}
          </span>
        );
      } else {
        return (
          <span>
            {record.added_user.title + " " + record.added_user.staff_name}
          </span>
        );
      }
    },
    width: 150,
  },
  {
    title: "Date",
    ellipsis: true,
    dataIndex: "date",
    render: (text, record, index) => {
      if (record.modified_on) {
        return <span>{formatTimestamp(parseInt(record.modified_on))}</span>;
      } else {
        return <span>{formatTimestamp(parseInt(record.uploaded_on))}</span>;
      }
    },
    width: 150,
  },
  {
    title: "Photo Status",
    dataIndex: "photo_status",
    ellipsis: true,
    width: 100,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => <span>{record.upload_status}</span>,
    // sorter: (a, b) => a.age - b.age,
  },
];

const rows = [
  {
    student_no: "2000100121",
    name: "Musiitwa Joel",
    // system_role: "Yes",
    uploaded_by: "Joel Musiitwa",
    date: "2024-08-23 10:00 AM",
    photo_status: "New",
    updated_by: "Lubega Tasha",
    updated_when: "23-02-14",
  },
  {
    student_no: "2000100567",
    name: "Akampereza Darlington",
    date: "2024-08-23 10:00 AM",
    // system_role: "Yes",
    uploaded_by: "John Doe",
    uploaded_when: "22-10-06",
    photo_status: "updated",
    updated_by: "Jane Smith",
    updated_when: "23-02-14",
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
};

function Phototable() {
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(true); // Step 2
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const recentUploads = useSelector(selectRecentUploads);
  const {
    error,
    loading: loadingImages,
    data,
  } = useQuery(GET_RECENTLY_UPLOADED_IMAGES, {
    notifyOnNetworkStatusChange: true,
  });

  // console.log("the data", recentUploads);

  React.useEffect(() => {
    if (data) {
      dispatch(setRecentUploads(data.getRecentlyUploadedImages));
    }
  }, [data]);

  if (error) {
    dispatch(
      showMessage({
        message: error.message,
        variant: "error",
      })
    );
  }

  // if (data) {
  //   console.log("res", data);
  // }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  React.useEffect(() => {
    // Simulate loading delay (You can replace this with your actual data fetching logic)
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup function to clear the timeout if the component is unmounted
    return () => clearTimeout(delay);
  }, []);

  return (
    <motion.div>
      <Box
        sx={{
          backgroundColor: "#fff",
          // borderColor: "lightgray",
          // borderWidth: 1,
          marginTop: 1,
          // marginBottom: 1,
        }}
        // className="p-5"
        style={{
          paddingLeft: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 15,
          marginBottom: 7,
          // height: 32,
        }}
      >
        <Typography
          variant="h6"
          color="inherit"
          component="div"
          style={{
            //   opacity: 0.7,
            // color: "white",
            fontSize: "1.7rem",
            // padding: 5,
            // visibility: selectedItem ? "visible" : "hidden",
            // fontWeight: "bold",
          }}
        >
          {`Uploads Made Today`}
        </Typography>
      </Box>
      <div
        className="flex-auto p-0 sm:p-0 h-full"
        style={{
          paddingRight: 10,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  // headerBg: "rgba(0, 0, 0, 0.04)",
                  borderColor: "lightgray",
                  borderRadius: 0,
                  headerBorderRadius: 0,
                  cellFontSize: 10,
                  fontSize: 13,
                  lineHeight: 0.8,
                },
              },
            }}
          >
            <Table2
              columns={_columns}
              dataSource={recentUploads}
              loading={loadingImages}
              rowKey="id"
              bordered
              sticky
              // rowSelection={rowSelection}
              rowHoverable
              rowSelection={{
                type: "radio",
                ...rowSelection,
              }}
              // expandable={defaultExpandable}
              showHeader={true}
              tableLayout="fixed"
              size="middle"
              pagination={{
                position: ["bottomRight"],
              }}
              scroll={{
                y: "calc(100vh - 200px)", // Set the same height as in the style to ensure content scrolls
                // x: "100vw",
              }}

              // scroll={{
              //   y: "calc(100vh - 370px)",
              //   x: "100vw",
              // }}
            />
          </ConfigProvider>
        </Box>
      </div>
    </motion.div>
  );
}

export default Phototable;
