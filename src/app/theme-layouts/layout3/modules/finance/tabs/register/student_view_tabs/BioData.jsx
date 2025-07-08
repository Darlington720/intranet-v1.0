import React, { useRef } from "react";
import { Badge, Descriptions, Spin, Tooltip } from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import { useSelector } from "react-redux";
import { selectStudentData } from "../../../store/financeSlice";

const BioData = () => {
  const scrollContainerRef = useRef(null);
  const psRef = React.useRef(null);
  const studentFile = useSelector(selectStudentData);

  let items = [
    {
      key: "1",
      label: "Surname",
      children: studentFile?.biodata.surname && studentFile?.biodata.surname,
      span: 1,
    },
    {
      key: "2",
      label: "Other Names",
      children: studentFile?.biodata && studentFile?.biodata.other_names,
      span: 1,
    },
    {
      key: "3",
      label: "Student Number",
      children: studentFile?.student_no && studentFile?.student_no,
      span: 1,
    },
    {
      key: "4",
      label: "Status",
      children: studentFile?.status ? (
        <Badge
          status={studentFile?.status ? "processing" : "error"}
          text={studentFile?.status ? "Active" : "Inactive"}
        />
      ) : null,
      span: 1,
    },
    {
      key: "5",
      label: "Registration No",
      children: studentFile?.registration_no && studentFile?.registration_no,
      span: 1,
    },

    {
      key: "7",
      label: "Gender",
      children: studentFile?.biodata.gender
        ? studentFile?.biodata.gender.toUpperCase()
        : null,
      span: 1,
    },
    {
      key: "8",
      label: "Entry Accademic Year",
      children:
        studentFile?.entry_acc_yr_title && studentFile?.entry_acc_yr_title,
      span: 1,
    },
    {
      key: "9",
      label: "Entry Study Year",
      children: studentFile?.entry_study_yr && studentFile?.entry_study_yr,
      span: 1,
    },
    {
      key: "10",
      label: "Nationality",
      children:
        studentFile?.biodata.nationality &&
        studentFile?.biodata.nationality.nationality_title,
      span: 1,
    },
    {
      key: "11",
      label: "Billing Nationality",
      children:
        studentFile?.biodata.nationality &&
        studentFile?.biodata.nationality.nationality_category.toUpperCase(),
      span: 1,
    },

    {
      key: "12",
      label: "Campus",
      children: studentFile?.campus_title && studentFile?.campus_title,
      span: 1,
    },
    {
      key: "13",
      label: "Sponsorship",
      children: studentFile
        ? studentFile?.is_on_sponsorship
          ? studentFile?.is_on_sponsorship
          : "PRIVATE"
        : null,
      span: 1,
    },

    {
      key: "14",
      label: "Email",
      children: studentFile?.biodata.email && studentFile?.biodata.email,
      span: 1,
    },
    {
      key: "15",
      label: "Phone No",
      children: studentFile?.biodata.phone_no && studentFile?.biodata.phone_no,
      span: 1,
    },

    {
      key: "16",
      label: "Intake",
      children: studentFile?.intake_title && studentFile?.intake_title,
      span: 1,
    },
    {
      key: "17",
      label: "Study Time",
      children: studentFile?.study_time_title && studentFile?.study_time_title,
      span: 1,
    },

    {
      key: "18",
      label: "Course",
      children: (
        <Tooltip
          title={
            studentFile?.course_details &&
            studentFile?.course_details.course.course_title
          }
        >
          <span
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              width: 320,
              display: "inline-block",
            }}
          >
            {studentFile?.course_details &&
              studentFile?.course_details.course.course_title}
          </span>
        </Tooltip>
      ),
      span: 1,
    },
    {
      key: "17",
      label: "Course Code",
      children:
        studentFile?.course_details &&
        studentFile?.course_details.course.course_code,
      span: 1,
    },

    {
      key: "18",
      label: "Course Duration",
      children:
        studentFile?.course_details &&
        studentFile?.course_details.course.course_duration,
      span: 1,
    },
    {
      key: "19",
      label: "Course Version",
      children: (
        <span
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {studentFile?.course_details &&
            studentFile?.course_details.version_title}
        </span>
      ),
      span: 1,
    },

    {
      key: "20",
      label: "School",
      children: (
        <Tooltip
          title={
            studentFile?.course_details &&
            studentFile?.course_details.course.school.school_title
          }
        >
          <span
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              width: 320,
              display: "inline-block",
            }}
          >
            {studentFile?.course_details &&
              studentFile?.course_details.course.school.school_title}
          </span>
        </Tooltip>
      ),
      span: 1,
    },
    {
      key: "21",
      label: "School Code",
      children:
        studentFile?.course_details &&
        studentFile?.course_details.course.school.school_code,
      span: 1,
    },

    {
      key: "22",
      label: "College",
      children: (
        <Tooltip
          title={
            studentFile?.course_details &&
            studentFile?.course_details.course.school.college.college_title
          }
        >
          <span
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              width: 320,
              display: "inline-block",
            }}
          >
            {studentFile?.course_details &&
              studentFile?.course_details.course.school.college.college_title}
          </span>
        </Tooltip>
      ),
      span: 1,
    },
    {
      key: "23",
      label: "College Code",
      children:
        studentFile?.course_details &&
        studentFile?.course_details.course.school.college.college_code,
      span: 1,
    },

    {
      key: "22",
      label: "Residence Status",
      children: studentFile
        ? studentFile?.is_resident
          ? "RESIDENT"
          : "NON-RESIDENT"
        : null,
      span: 1,
    },
    {
      key: "23",
      label: "Religion",
      children:
        studentFile?.biodata.religion &&
        studentFile?.biodata.religion?.toUpperCase(),

      span: 1,
    },
  ];

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: false,
        minScrollbarLength: 20,
      });

      return () => {
        if (psRef.current) {
          psRef.current.destroy();
          psRef.current = null;
        }
      };
    }
  }, []);
  return (
    <div
      ref={scrollContainerRef}
      style={{
        // marginTop: 10,
        // backgroundColor: "red",
        overflow: "hidden",
        position: "relative",
        height: "calc(100vh - 230px)",
      }}
    >
      <Descriptions
        size="small"
        column={2}
        bordered
        items={items}
        labelStyle={{
          color: "#0f2ca2",
          fontWeight: "bold",
          backgroundColor: "#e8edff",
          width: "20%",
        }}
        contentStyle={{
          //   backgroundColor: "red",
          width: "38%",
        }}
      />
    </div>
  );
};
export default BioData;
