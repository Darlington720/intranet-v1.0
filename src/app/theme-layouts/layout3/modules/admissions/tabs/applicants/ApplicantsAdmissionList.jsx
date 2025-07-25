import { useEffect, useMemo, useState } from "react";
import { Button, Modal, Progress, Typography, ConfigProvider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectApplicantsAdmissionList,
  selectApplicantsAdmissionListModal,
  setApplicanntsAdmissionList,
  setApplicanntsAdmissionListModal,
} from "../../admissionsSlice";
import { Close } from "@mui/icons-material";
import DataGrid from "react-data-grid";

import { Space } from "antd";
import { useMutation, useSubscription } from "@apollo/client";
import { ADMIT_STUDENTS } from "app/theme-layouts/layout3/graphql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { UPLOAD_PROGRESS_SUBSCRIPTION } from "../../graphql/subscriptions";

const ApplicantAdmissionList = () => {
  const [admitStudents, { error, loading }] = useMutation(ADMIT_STUDENTS, {
    refetchQueries: ["loadApplications"],
  });
  const { data } = useSubscription(UPLOAD_PROGRESS_SUBSCRIPTION);
  const dispatch = useDispatch();
  const open = useSelector(selectApplicantsAdmissionListModal);
  const applicantsAdmissionList = useSelector(selectApplicantsAdmissionList);
  const [percentage, setPercentage] = useState(0);

  const handleRemove = (record) => {
    console.log("record", record.application.id);
    const updatedList = applicantsAdmissionList.filter(
      (r) => r.application.id !== record.application.id
    );

    dispatch(setApplicanntsAdmissionList(updatedList));
  };

  const columns2 = useMemo(() => {
    return [
      {
        name: "#",
        key: "index",
        width: 40,
        renderCell({ row, rowIdx }) {
          return rowIdx + 1;
        },
      },
      {
        name: "Name",
        key: "name",
        ellipsis: true,
        renderCell({ row, rowIdx }) {
          return `${row.application.applicant.surname} ${row.application.applicant.other_names}`;
        },

        width: 200,
      },
      {
        name: "Choice",
        ellipsis: true,
        key: "prog_choice",
        renderCell({ row, rowIdx }) {
          return row.courseDetails.choice_no;
        },
        width: 120,
      },

      {
        name: "Program Code",
        key: "course_code",
        width: 120,
        renderCell({ row, rowIdx }) {
          return row.courseDetails.course.course_code;
        },
      },
      {
        name: "Campus",
        key: "campus",
        width: 150,
        ellipsis: true,
        // render: (text, record, index) => <span>{`${record.applicant.email}`}</span>,
        renderCell({ row, rowIdx }) {
          return row.campusDetails.campus_title;
        },
      },
      {
        name: "Sudy Time",
        key: "study_time",
        width: 100,
        ellipsis: true,
        // render: (text, record, index) => <span>{`${record.applicant.email}`}</span>,
        renderCell({ row, rowIdx }) {
          return row.studyTimeDetails.study_time_title;
        },
      },
      {
        name: "Entry Year",
        key: "entry_yr",
        width: 100,
        ellipsis: true,
      },
      {
        name: "Action",
        key: "action",
        ellipsis: true,
        renderCell({ row, rowIdx }) {
          return (
            <Space size="middle">
              <Typography.Link
                style={{
                  textDecoration: "none",
                  color: "red",
                }}
                onClick={() => handleRemove(row)}
              >
                Remove
              </Typography.Link>
            </Space>
          );
        },
      },
    ];
  }, []);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variantt: "error",
        })
      );
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setPercentage(data.uploadProgress.progress);
    }
  }, [data]);

  const handleAdmit = async () => {
    const applicants = applicantsAdmissionList.map((applicant) => ({
      application_id: applicant.application.id,
      campus_id: applicant.campus,
      course_id: applicant.program_choice,
      entry_yr: applicant.entry_yr,
      study_time_id: applicant.study_time,
      applicant_id: applicant.application.applicant.id,
    }));

    const payload = {
      applicants,
    };

    // console.log(applicantsAdmissionList);
    const res = await admitStudents({
      variables: payload,
    });

    // console.log("res", res);
    if (res.data) {
      dispatch(
        showMessage({
          message: res.data.admit_students.message,
        })
      );
      dispatch(setApplicanntsAdmissionList([]));
    }
  };

  return (
    <Modal
      title={
        <Typography.Text
          style={{
            color: "#fff",
          }}
        >
          {`APPLICANTS ADMISSSION LIST`}
        </Typography.Text>
      }
      open={open}
      destroyOnClose={true}
      // onOk={onFinish}
      onCancel={() => dispatch(setApplicanntsAdmissionListModal(false))}
      zIndex={1000}
      maskClosable={false}
      closeIcon={
        <Close
          style={{
            color: "#fff",
          }}
        />
      }
      styles={{
        body: {
          padding: "10px 10px",
          height: "auto",

          // Ensure the content is not clipped
        },
        content: {
          padding: 0,
          height: "auto",
          // Ensure the content is not clipped
        },
        footer: {
          padding: 10,
        },
        header: {
          backgroundColor: "#0076eb",
          padding: "7px 10px",
        },
      }}
      width={1000}
      footer={
        <div>
          <Space size="large">
            <ConfigProvider
              theme={{
                components: {
                  Progress: {
                    lineBorderRadius: 0,
                  },
                },
              }}
            >
              <Progress
                percent={percentage}
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={[500, 30]}
                style={{
                  borderRadius: 0,
                }}
              />
            </ConfigProvider>
            <Button
              type="primary"
              loading={loading}
              disabled={loading || applicantsAdmissionList.length == 0}
              onClick={handleAdmit}
            >
              ADMIT STUDENTS
            </Button>
          </Space>
        </div>
      }
    >
      <DataGrid
        className="rdg-light fill-grid"
        // rowHeight={30}
        rowKeyGetter={(row) => row.id}
        columns={columns2}
        rows={applicantsAdmissionList}
        // onSortColumnsChange={setSortColumns}
        // sortColumns={sortColumns}
        style={{
          border: "1px solid #ccc",
          height: "calc(100vh - 350px)",
        }}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        rowHeight={30}
      />
    </Modal>
  );
};
export default ApplicantAdmissionList;
