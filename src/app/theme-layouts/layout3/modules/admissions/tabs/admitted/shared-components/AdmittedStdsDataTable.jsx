import { Box, Typography, Tooltip } from "@mui/material";
import {
  Cancel,
  ChangeCircle,
  Close,
  EditNoteSharp,
  Refresh,
  Send,
} from "@mui/icons-material";
import {
  Select,
  Input,
  Row,
  Col,
  Space,
  Dropdown,
  Button,
  Typography as AntTypography,
  Pagination,
  Spin,
} from "antd";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdmitStdsModalVisible,
  selectAdmittedSearchActive,
  selectAdmittedSearchValue,
  selectAdmittedStds,
  selectAdmittedStdsCurrentPage,
  selectLoadingAdmittedStds,
  selectSelectedAdmittedStds,
  selectSelectedAdmittedStdsRowKeys,
  selectSelectedAdmittedStdsSummary,
  selectTotalAdmittedStds,
  setAdmissionLetterModalVisible,
  setAdmissionLetters,
  setAdmittedSearchActive,
  setAdmittedSearchValue,
  setAdmittedStds,
  setAdmittedStdsCurrentPage,
  setEditStudentRecordsModalVisible,
  setLoadingAdmittedStds,
  setRefetchAdmittedStudents,
  setSelectedAdmittedStds,
  setSelectedAdmittedStdsRowKeys,
  setSelectedAdmittedStudent,
  setTotalAdmittedStds,
} from "../../../admissionsSlice";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GLOBAL_SEARCH_APPLICATIONS,
  LOAD_ADMITTED_STUDENTS,
  PRINT_ADMISSION_LETTERS,
} from "../../../graphql/queries";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";
import { PUSH_TO_STD_INFO_CENTER } from "../../../graphql/mutations";
import { selectUser } from "app/store/userSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import AdmissionLetterPreview from "./AdmissionLetterPreview";
import { useEffect, useMemo, useState } from "react";
import EditStudentRecordsModal from "./EditStudentRecordsModal";
import { Check, CircleCheck } from "lucide-react";
import "react-data-grid/lib/styles.css";
import "./mystyles.css";

import DataGrid, { SelectColumn, Row as GridRow } from "react-data-grid";
import { CellExpanderFormatter } from "./CellExpanderFormatter";
import { useDirection } from "./DirectionContext";

const { Search } = Input;

const renderRow = (record, text) => {
  const color = parseInt(record.is_std_verified) ? "blue" : "black"; // Conditional color based on `verified` field

  return <span style={{ color }}>{text}</span>;
};

const items = [
  {
    label: "Push to Student Information Center",
    key: "push_std_to_sic",
    icon: (
      <Send
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
  {
    label: "Edit Student Details",
    key: "edit_student_details",
    icon: (
      <EditNoteSharp
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
  {
    label: "Change of Program Request",
    key: "3",
    icon: (
      <ChangeCircle
        style={{
          fontSize: 18,
        }}
      />
    ),
    // danger: true,
  },
  {
    label: "Cancel Admission",
    key: "4",
    icon: (
      <Cancel
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
];

const filterItems = [
  {
    label: "Students Pushed to Hub",
    key: "stds_pushed_to_hub",
    icon: <CircleCheck size={18} />,
  },
  {
    label: "Students Not in Hub",
    key: "stds_not_in_hub",
    icon: (
      <Cancel
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
];

// const defaultExpandable = {
//   expandedRowRender: (record) => (
//     <>
//       <Row
//         gutter={24}
//         style={{
//           padding: 5,
//         }}
//       >
//         <Col>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <Space
//               style={{
//                 padding: "5px 0px",
//               }}
//             >
//               <AntTypography.Text strong>ADMITTED BY:</AntTypography.Text>
//               <AntTypography.Text>{record.admitted_by_user}</AntTypography.Text>
//             </Space>

//             <Space>
//               <AntTypography.Text strong>ADMITTED ON:</AntTypography.Text>
//               <AntTypography.Text>
//                 {formatDateString(parseInt(record.admitted_on))}
//               </AntTypography.Text>
//             </Space>
//           </div>
//         </Col>
//         {/* <Col>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <Space
//               style={{
//                 padding: "5px 0px",
//               }}
//             >
//               <AntTypography.Text strong>REGISTERED BY:</AntTypography.Text>
//               <AntTypography.Text></AntTypography.Text>
//             </Space>

//             <Space>
//               <AntTypography.Text strong>RESGISTERED ON:</AntTypography.Text>
//               <AntTypography.Text>""</AntTypography.Text>
//             </Space>
//           </div>
//         </Col> */}
//         <Col>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <Space
//               style={{
//                 padding: "5px 0px",
//               }}
//             >
//               <AntTypography.Text strong>REGISTRATION NO:</AntTypography.Text>
//               <AntTypography.Text>{record.registration_no}</AntTypography.Text>
//             </Space>
//           </div>
//         </Col>
//       </Row>
//     </>
//   ),
// };

function getComparator(sortColumn) {
  switch (sortColumn) {
    case "index":
    case "admitted_on":
    case "form_no":
    case "student_no":
    case "gender":
    case "expander":
    case "full_name":
      return (a, b) => {
        const nameA = a.biodata
          ? `${a.biodata.surname || ""} ${a.biodata.other_names || ""}`
          : "";
        const nameB = b.biodata
          ? `${b.biodata.surname || ""} ${b.biodata.other_names || ""}`
          : "";
        return nameA.localeCompare(nameB);
      };
    case "available":
      return (a, b) => {
        return a[sortColumn] === b[sortColumn] ? 0 : a[sortColumn] ? 1 : -1;
      };
    case "Sex":
    case "course_code":
    case "campus_title":
    case "study_time_title":
      return (a, b) => {
        return a.study_time_title.localeCompare(b.study_time_title);
      };
    case "nationality":
    case "intake_title":
      return (a, b) => {
        return a[sortColumn] - b[sortColumn];
      };
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
}

function AdmittedStdsDataTable() {
  const direction = useDirection();
  const [pageSize, setPageSize] = useState(50);
  const [current, setCurrent] = useState(1);
  const dispatch = useDispatch();
  const userObj = useSelector(selectUser);
  const selectedCourseGroup = useSelector(selectSelectedAdmittedStdsSummary);
  const loadingApplications = useSelector(selectLoadingAdmittedStds);
  const applications = useSelector(selectAdmittedStds);
  const [admittedStudents, setAdmittedStudents] = useState([]);
  const selectedAdmittedStds = useSelector(selectSelectedAdmittedStds);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState("name");
  const totalRecords = useSelector(selectTotalAdmittedStds);
  const currentPage = useSelector(selectAdmittedStdsCurrentPage);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortColumns, setSortColumns] = useState([]);
  const admittedSearchActive = useSelector(selectAdmittedSearchActive);
  const admittedSearchValue = useSelector(selectAdmittedSearchValue);

  const [
    pushToStdInfoCenter,
    { error: pushErr, loading: pushingStds, data: pushRes },
  ] = useMutation(PUSH_TO_STD_INFO_CENTER, {
    refetchQueries: ["loadAdmittedStudents"],
  });

  const [
    globalSearchApplications,
    { error: globalErr, loading: searchingGlobally, refetch: searchRefetch },
  ] = useLazyQuery(GLOBAL_SEARCH_APPLICATIONS, {
    fetchPolicy: "network-only",
  });

  const [
    loadAdmittedStudents,
    { error: loadFormsErr, loading: loadingAdmittedStds, data, refetch },
  ] = useLazyQuery(LOAD_ADMITTED_STUDENTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });

  const columns2 = useMemo(() => {
    return [
      {
        ...SelectColumn,
        cellClass(row) {
          return row.type === "DETAIL" ? "hidden-select" : "";
        },
      },
      {
        key: "expander",
        name: "",
        width: 40,
        // frozen: true,
        colSpan(args) {
          return args.type === "ROW" && args.row.type === "DETAIL"
            ? 13
            : undefined;
        },
        renderCell: ({ row, onRowChange, tabIndex }) => {
          // console.log("row", row);
          if (row.type === "DETAIL") {
            return (
              <Row
                gutter={24}
                style={{
                  padding: 5,
                }}
              >
                <Col>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Space
                      style={{
                        padding: "5px 0px",
                      }}
                    >
                      <AntTypography.Text strong>
                        ADMITTED BY:
                      </AntTypography.Text>
                      <AntTypography.Text>
                        {row.admitted_by_user}
                      </AntTypography.Text>
                    </Space>

                    <Space>
                      <AntTypography.Text strong>
                        ADMITTED ON:
                      </AntTypography.Text>
                      <AntTypography.Text>
                        {formatDateString(parseInt(row.admitted_on))}
                      </AntTypography.Text>
                    </Space>
                  </div>
                </Col>

                <Col>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Space
                      style={{
                        padding: "5px 0px",
                      }}
                    >
                      <AntTypography.Text strong>
                        REGISTRATION NO:
                      </AntTypography.Text>
                      <AntTypography.Text>
                        {row.registration_no}
                      </AntTypography.Text>
                    </Space>
                  </div>
                </Col>
              </Row>
            );
          }
          return (
            <CellExpanderFormatter
              expanded={row.expanded}
              tabIndex={tabIndex}
              onCellExpand={() => {
                onRowChange({ ...row, expanded: !row.expanded });
              }}
            />
          );
        },
      },

      {
        name: "#",
        key: "index",
        width: 40,
        renderCell({ row, rowIdx }) {
          return renderRow(row, rowIdx + 1);
        },
      },
      {
        name: "Date",
        key: "admitted_on",
        ellipsis: true,
        renderCell({ row, rowIdx }) {
          return renderRow(row, formatDateString(parseInt(row.admitted_on)));
        },

        width: 160,
      },
      {
        name: "Form No",
        ellipsis: true,
        key: "form_no",
        renderCell({ row, rowIdx }) {
          return renderRow(row, row.form_no);
        },
        width: 140,
      },
      {
        name: "Student No",
        ellipsis: true,
        key: "student_no",
        renderCell({ row, rowIdx }) {
          return renderRow(row, row.student_no);
        },
        width: 110,
      },
      {
        name: "Name",
        width: 210,
        key: "full_name",
        sortable: true,
        ellipsis: true,
        sorter: (a, b) => {
          const nameA = a.biodata
            ? `${a.biodata.surname || ""} ${a.biodata.other_names || ""}`
            : "";
          const nameB = b.biodata
            ? `${b.biodata.surname || ""} ${b.biodata.other_names || ""}`
            : "";
          return nameA.localeCompare(nameB);
        },
        renderCell({ row, rowIdx }) {
          return renderRow(
            row,
            row.biodata
              ? `${row.biodata.surname} ${row.biodata.other_names}`
              : ""
          );
        },
      },
      {
        name: "Sex",
        key: "gender",
        width: 50,
        // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,

        renderCell({ row, rowIdx }) {
          return renderRow(row, row.biodata.gender);
        },
        // sorter: (a, b) => a.age - b.age,
      },
      {
        name: "Course Code",
        key: "course_code",
        width: 100,

        renderCell({ row, rowIdx }) {
          return renderRow(row, row.course.course_code);
        },
        // sorter: (a, b) => a.age - b.age,
      },
      {
        name: "Campus",
        key: "campus_title",
        renderCell({ row, rowIdx }) {
          return renderRow(row, row.campus_title);
        },
        width: 80,
      },
      {
        name: "Study Time",
        key: "study_time_title",
        width: 100,
        renderCell({ row, rowIdx }) {
          return renderRow(row, row.study_time_title);
        },
        sorter: (a, b) => {
          return a.study_time_title.localeCompare(b.study_time_title);
        },
      },
      {
        name: "Intake",
        key: "intake_title",
        width: 80,

        renderCell({ row, rowIdx }) {
          return renderRow(row, row.intake_title);
        },
      },
      {
        name: "Nationality",
        key: "nationality",
        width: 120,

        renderCell({ row, rowIdx }) {
          return renderRow(row, row.biodata.nationality.nationality_title);
        },
        ellipsis: true,
        // sorter: (a, b) => a.age - b.age,
      },

      {
        name: "Entry Study Year",
        key: "entry_study_yr",
        width: 130,
        renderCell({ row, rowIdx }) {
          return renderRow(row, row.entry_study_yr);
        },
        // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,

        // sorter: (a, b) => a.age - b.age,
      },
    ];
  }, [direction]);

  function onRowsChange(rows, { indexes }) {
    const row = rows[indexes[0]];
    if (row.type === "MASTER") {
      if (row.expanded) {
        rows.splice(indexes[0] + 1, 0, {
          type: "DETAIL",
          id: row.std_id + 100,
          parentId: row.std_id,
          admitted_by_user: row.admitted_by_user,
          admitted_on: row.admitted_on,
          registration_no: row.registration_no,
        });
      } else {
        rows.splice(indexes[0] + 1, 1);
      }
      console.log("output rows", rows);
      setAdmittedStudents(rows);
    }
  }

  function rowKeyGetter(row) {
    return row.std_id;
  }

  const sortedRows = useMemo(() => {
    const _rows = searchResults.length > 0 ? searchResults : admittedStudents;
    if (sortColumns.length === 0) return _rows;

    return [..._rows].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey);
        const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === "ASC" ? compResult : -compResult;
        }
      }
      return 0;
    });
  }, [searchResults, admittedStudents, sortColumns]);

  useEffect(() => {
    selectedRows.clear();
    if (applications.length > 0) {
      setAdmittedStudents(
        applications.map((student) => ({
          ...student,
          expanded: false,
          type: "MASTER",
        }))
      );
    } else {
      setAdmittedStudents([]);
    }
  }, [applications]);

  const onChange = (value) => {
    // console.log(`selected ${value}`);
    setSelectedCriteria(value);
  };

  const onSearch = async (value) => {
    if (!value) {
      return;
    }

    dispatch(setAdmittedSearchActive(true));
    dispatch(setAdmittedSearchValue(value));

    const response = await globalSearchApplications({
      variables: {
        searchCriteria: selectedCriteria,
        searchValue: value,
        admissionsId: null,
        start: 0,
        limit: pageSize,
        admitted: true,
      },
    });

    if (response.data) {
      dispatch(
        setTotalAdmittedStds(
          response.data.global_search_applications.total_records
        )
      );
      dispatch(
        setAdmittedStds(
          response?.data?.global_search_applications?.students || []
        )
      );
    }
  };

  const [printAdmissionLetters, { error: printErr, loading: printingLetters }] =
    useLazyQuery(PRINT_ADMISSION_LETTERS, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    });

  const fetchAdmittedStds = async (page) => {
    const payload = {
      admissionsId: selectedCourseGroup.admissions_id,
      courseId: selectedCourseGroup.course_id,
      campusId: selectedCourseGroup.campus_id,
      start: (page - 1) * pageSize, // Calculate offset based on page
      limit: pageSize, // Number of records per page
    };

    const res = await loadAdmittedStudents({
      variables: payload,
    });

    if (res.data) {
      dispatch(setTotalAdmittedStds(res.data.admitted_students.total_records));
      dispatch(setAdmittedStds(res?.data?.admitted_students?.students || []));
    }
  };

  useEffect(() => {
    if (applications.length > 0) {
      fetchAdmittedStds(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (pushErr) {
      dispatch(
        showMessage({
          message: pushErr.message,
          variant: "error",
        })
      );
    }

    if (printErr) {
      dispatch(
        showMessage({
          message: printErr.message,
          variant: "error",
        })
      );
    }

    if (globalErr) {
      dispatch(
        showMessage({
          message: globalErr.message,
          variant: "error",
        })
      );
    }

    if (loadFormsErr) {
      dispatch(
        showMessage({
          message: loadFormsErr.message,
          variant: "error",
        })
      );
    }
  }, [printErr, pushErr, globalErr, loadFormsErr]);

  const handleMenuClick = async (e) => {
    if (e.key == "push_std_to_sic") {
      // Push to student information center
      if (selectedRows.size == 0)
        return dispatch(
          showMessage({
            message: "Please select at least one student",
            variant: "info",
          })
        );

      const selectedStds = admittedStudents.filter((obj) =>
        selectedRows.has(obj.std_id)
      );

      const std_ids = selectedStds.map((std) => std.std_id);

      const res = await pushToStdInfoCenter({
        variables: {
          stdIds: std_ids,
          pushedBy: userObj.user.user_id,
        },
      });

      dispatch(
        showMessage({
          message: res.data.push_to_std_info_center.message,
          variant: "success",
        })
      );
    }

    if (e.key == "edit_student_details") {
      if (selectedRows.size > 0) {
        const selectedStds = admittedStudents.filter((obj) =>
          selectedRows.has(obj.std_id)
        );
        let latestStudentSelected = selectedStds[selectedStds.length - 1];

        dispatch(setSelectedAdmittedStudent(latestStudentSelected));
        dispatch(setEditStudentRecordsModalVisible(true));
      } else {
        dispatch(
          showMessage({
            message: "Please select a student!",
            variant: "info",
          })
        );
      }
    }
  };

  const handleFilterMenuClick = async (e) => {
    // message.info("Click on menu item.");
    // console.log("applications", applications);
    if (e.key == "stds_pushed_to_hub") {
      // View pushed students only
      const newArr = applications.filter(
        (application) => application.is_std_verified == true
      );

      setAdmittedStudents(newArr);
    } else if (e.key == "stds_not_in_hub") {
      // View pushed students only
      const newArr = applications.filter(
        (application) => application.is_std_verified == false
      );

      setAdmittedStudents(newArr);
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const filterMenuProps = {
    items: filterItems,
    onClick: handleFilterMenuClick,
  };

  const handleOpenPreview = async () => {
    const selectedStds = admittedStudents.filter((obj) =>
      selectedRows.has(obj.std_id)
    );
    const stds = selectedStds.map((std) => ({
      applicant_id: std.biodata.id,
      form_no: std.form_no,
    }));

    const payload = {
      students: stds,
    };

    // console.log("selected applications", selectedAdmittedStds);
    const res = await printAdmissionLetters({
      variables: payload,
    });

    if (res.data?.print_admission_letters) {
      dispatch(setAdmissionLetters(res.data.print_admission_letters));

      dispatch(setAdmissionLetterModalVisible(true));
    }
  };

  const handleExport = () => {
    if (applications.length == 0) {
      dispatch(
        showMessage({
          message: "Please first load admitted students",
          variant: "info",
        })
      );
    }

    const data = applications.map((application) => ({
      name: `${application.biodata.surname} ${application.biodata.other_names}`,
      student_number: application.student_no,
      regno: application.registration_no,
      email: application.biodata.email,
      gender: application.biodata.gender,
      nationality: application.biodata.nationality.nationality_title,
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "admitted-student.csv");
  };

  const handlePaginationChange = (page) => {
    dispatch(setAdmittedStdsCurrentPage(page));
  };

  const handleReload = async () => {
    try {
      // Set loading state
      dispatch(setLoadingAdmittedStds(true));

      if (admittedSearchActive && admittedSearchValue) {
        // If search was active and we have a search value
        const response = await searchRefetch({
          searchCriteria: selectedCriteria,
          searchValue: admittedSearchValue,
          admissionsId: null,
          admitted: true,
          start: 0,
          limit: pageSize,
        });

        if (response?.data?.global_search_applications) {
          dispatch(
            setTotalAdmittedStds(
              response.data.global_search_applications.total_records
            )
          );
          dispatch(
            setAdmittedStds(
              response.data.global_search_applications.students || []
            )
          );
        }
      } else {
        // If no search or no search value, use regular fetch
        if (!selectedCourseGroup?.admissions_id) {
          dispatch(
            showMessage({
              message: "No course group selected",
              variant: "error",
            })
          );
          return;
        }

        await fetchAdmittedStds(currentPage);
      }
    } catch (error) {
      dispatch(
        showMessage({
          message: error.message || "Failed to reload data",
          variant: "error",
        })
      );
    } finally {
      // Reset loading state
      dispatch(setLoadingAdmittedStds(false));
    }
  };

  return (
    <div
      style={{
        marginLeft: 0,
        marginRight: 0,
        // backgroundColor: "red",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderTop: "1px solid lightgray",
          borderLeft: "1px solid lightgray",
          borderRight: "1px solid lightgray",
          // marginBottom: 1,
        }}
        className="p-5"
        style={{
          paddingLeft: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 15,
          marginBottom: 0,
        }}
      >
        <AntTypography.Text strong>
          {selectedCourseGroup
            ? `${selectedCourseGroup.course_title} - (${selectedCourseGroup.course_code})`
            : null}
        </AntTypography.Text>

        <div>
          <Space>
            <Tooltip title="Reload">
              <Refresh
                // onClick={async () => {
                //   dispatch(setRefetchAdmittedStudents(true));
                // }}
                onClick={handleReload}
                fontSize=""
                color="#000"
                style={{
                  // color: "white",
                  fontSize: 25,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </Space>
        </div>
      </Box>
      <div
        style={{
          // backgroundColor: "#fff",
          // maxHeight: "calc(100vh - 185px)",
          minHeight: "calc(100vh - 179px)",
          display: "flex",
          flexDirection: "column",
          height: "100%", // Ensure it takes full height
          //   height: 600,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: 8,
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid lightgray",
            borderLeft: "1px solid lightgray",
            borderRight: "1px solid lightgray",
            // marginTop: 5,
            marginBottom: 0,
          }}
        >
          <Space size="middle">
            <Select
              showSearch
              placeholder="Select"
              optionFilterProp="label"
              size="small"
              style={{
                width: 140,
              }}
              onChange={onChange}
              // onSearch={onSearch}
              value={selectedCriteria}
              options={[
                {
                  value: "name",
                  label: "Name",
                },
                {
                  value: "program_code",
                  label: "Program Code",
                },
              ]}
            />

            <Search
              placeholder="Global Search"
              onSearch={onSearch}
              value={admittedSearchValue}
              onChange={(e) => dispatch(setAdmittedSearchValue(e.target.value))}
              size="small"
            />

            <Dropdown menu={menuProps}>
              <Button size="small">
                <Space>
                  Actions
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Button size="small" onClick={handleExport}>
              Export to Excel
            </Button>

            <Dropdown menu={filterMenuProps}>
              <Button size="small">
                <Space>
                  Filters
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>

          <Button
            disabled={selectedRows.size == 0 || printingLetters}
            loading={printingLetters}
            onClick={handleOpenPreview}
            size="small"
          >
            Print Admission Letter(s)
          </Button>
        </div>

        <div
          style={{
            flexGrow: 1,
            overflow: "auto",
            backgroundColor: "#fff",
            // borderRight: "1px solid lightgray",
            // borderLeft: "1px solid lightgray",
          }}
        >
          <Spin
            spinning={
              loadingApplications ||
              pushingStds ||
              searchingGlobally ||
              loadingAdmittedStds
            }
          >
            <DataGrid
              className="rdg-light fill-grid"
              // rowHeight={30}
              rowKeyGetter={rowKeyGetter}
              columns={columns2}
              rows={sortedRows}
              onSortColumnsChange={setSortColumns}
              sortColumns={sortColumns}
              style={{
                border: "1px solid #ccc",
                height: "calc(100vh - 257px)",
              }}
              onSelectedRowsChange={setSelectedRows}
              selectedRows={selectedRows}
              defaultColumnOptions={{
                sortable: true,
                resizable: true,
              }}
              onRowsChange={onRowsChange}
              onCellDoubleClick={(args) => {
                // console.log("args", args);
                dispatch(setSelectedAdmittedStudent(args.row));
                dispatch(setEditStudentRecordsModalVisible(true));
              }}
              direction={direction}
              onCellKeyDown={(_, event) => {
                if (event.isDefaultPrevented()) {
                  // skip parent grid keyboard navigation if nested grid handled it
                  event.preventGridDefault();
                }
              }}
              rowHeight={(row) => (row.type === "DETAIL" ? 65 : 30)}
            />
          </Spin>
        </div>

        <div
          style={{
            borderLeft: "1px solid lightgray",
            borderRight: "1px solid lightgray",
            borderBottom: "1px solid lightgray",
            background: "#fff",
            padding: "5px 10px",
            backgroundColor: "#fafafa",
            height: 39,
            // textAlign: "right",
          }}
        >
          {totalRecords > 0 ? (
            <div>
              <Space size="middle">
                <Pagination
                  simple
                  current={currentPage}
                  total={totalRecords}
                  pageSize={pageSize}
                  pageSizeOptions={[50]}
                  onChange={handlePaginationChange}
                />
                <AntTypography.Text>{totalRecords} Records</AntTypography.Text>
              </Space>
            </div>
          ) : null}
        </div>
      </div>

      <AdmissionLetterPreview />
      <EditStudentRecordsModal />
    </div>
  );
}

export default AdmittedStdsDataTable;
