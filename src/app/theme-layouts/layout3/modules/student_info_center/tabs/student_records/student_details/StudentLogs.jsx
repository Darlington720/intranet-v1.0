import React, { useRef, useEffect, useState } from "react";
import { Table, ConfigProvider, Button } from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import { useLazyQuery } from "@apollo/client";
import { LOAD_STUDENT_LOGS } from "../../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectLastLoadedStudentNo,
  selectStudentDetails,
  selectStudentLogs,
  setLastLoadedStudentNo,
  setStudentLogs,
} from "../../../store/infoCenterSlice";

const columns = [
  {
    title: "#",
    dataIndex: "#",
    ellipsis: true,
    render: (text, record, index) => index + 1,
    width: 40,
  },
  {
    title: "Action",
    dataIndex: "action",
    ellipsis: true,

    width: 100,
  },
  {
    title: "Description",
    ellipsis: true,
    dataIndex: "description",
    width: 180,
  },
  {
    title: "Application",
    ellipsis: true,
    dataIndex: "module",
    width: 100,
  },
  {
    title: "Action By",
    dataIndex: "action_by",
    ellipsis: true,
    width: 150,
  },
  {
    title: "Action Date",
    dataIndex: "action_date",
    render: (text, record) => {
      const formatted = new Date(text).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return formatted;
    },
    width: 150,
    ellipsis: true,
  },
];

const StudentLogs = () => {
  const dispatch = useDispatch();
  const studentDetails = useSelector(selectStudentDetails);
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const [loadStudentLogs, { error, loading, data }] =
    useLazyQuery(LOAD_STUDENT_LOGS);
  const studentLogs = useSelector(selectStudentLogs);
  const lastLoadedStudentNo = useSelector(selectLastLoadedStudentNo);

  useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
      });
    }

    return () => {
      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, []);

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

  useEffect(() => {
    // Clear logs only if studentNo has changed
    if (
      studentDetails?.student_no &&
      lastLoadedStudentNo &&
      studentDetails.student_no !== lastLoadedStudentNo
    ) {
      dispatch(setStudentLogs([]));
      dispatch(setLastLoadedStudentNo(null)); // mark logs as outdated
    }
  }, [studentDetails?.student_no]);

  const handleLoadLogs = async () => {
    const currentStudentNo = studentDetails?.student_no;
    if (!currentStudentNo || currentStudentNo === lastLoadedStudentNo) return;

    const res = await loadStudentLogs({
      variables: {
        studentNo: currentStudentNo,
      },
    });

    if (res?.data?.student_logs) {
      dispatch(setStudentLogs(res.data.student_logs));
      dispatch(setLastLoadedStudentNo(currentStudentNo));
    }
  };

  return (
    <>
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            color: "dodgerblue",
            fontSize: "1.7rem",
            fontWeight: "500",
          }}
        >
          Student Logs
        </span>

        <Button
          size="small"
          type="primary"
          loading={loading}
          onClick={handleLoadLogs}
        >
          Load Logs
        </Button>
      </div>
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
          columns={columns}
          dataSource={studentLogs}
          loading={loading}
          rowKey="std_id"
          bordered
          sticky
          // rowSelection={rowSelection}
          // expandable={defaultExpandable}
          showHeader={true}
          tableLayout="fixed"
          size="small"
          pagination={{
            position: ["bottomRight"],
          }}
          scroll={{
            y: "calc(100vh - 200px)",
          }}
        />
      </ConfigProvider>
    </>
  );
};

export default StudentLogs;
