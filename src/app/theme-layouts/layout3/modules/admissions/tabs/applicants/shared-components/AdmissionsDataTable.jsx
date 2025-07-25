import { Box, Tooltip } from "@mui/material";
import {
  AddCircleSharp,
  GetAppSharp,
  PublishSharp,
  Refresh,
} from "@mui/icons-material";
import {
  Form,
  Select,
  Input,
  Row,
  Col,
  Space,
  Dropdown,
  Button,
  Modal,
  Typography,
  FloatButton,
  Pagination,
  Spin,
} from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdmitStdsModalVisible,
  selectApplicantsAdmissionList,
  selectApplicantsCurrentPage,
  selectApplicantSearchValue,
  selectApplicationPreviewModalOpen,
  selectApplications,
  selectLoadingApplications,
  selectSearchActive,
  selectSelectedApplicantSummary,
  selectSelectedApplications,
  selectSelectedRowKeys,
  selectTotalApplicants,
  setAdmitStdsModalVisible,
  setApplicanntsAdmissionListModal,
  setApplicantsCurrentPage,
  setApplicantSearchValue,
  setApplicationForm,
  setApplicationPreviewModalOpen,
  setApplications,
  setImportApplicantsModalVisible,
  setLoadingApplications,
  setSearchActive,
  setSelectedApplications,
  setSelectedRowKeys,
  setTotalApplicants,
} from "../../../admissionsSlice";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GLOBAL_SEARCH,
  LOAD_APPLICATIONS,
  LOAD_APPLICATION_DETAILS,
} from "../../../graphql/queries";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";
import { useEffect, useMemo, useState } from "react";
import Add from "@mui/icons-material/Add";
import AdmitStudentsModal from "./AdmitStudentsModal";
import { ADMIT_STDS } from "../../../graphql/mutations";
import { selectUser } from "app/store/userSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import CheckIcon from "@mui/icons-material/Check";
import FormPreview from "./FormPreview";
import AddStdToAdmissionModal from "./AddStdToAdmissionModal";
import ApplicantAdmissionList from "../ApplicantsAdmissionList";
import ImportApplicants from "../ImportApplicants";
import DataGrid, { SelectColumn, Row as GridRow } from "react-data-grid";
import { useDirection } from "../../admitted/shared-components/DirectionContext";
import { CellExpanderFormatter } from "../../admitted/shared-components/CellExpanderFormatter";

const { Search } = Input;

const renderRow = (record, text) => {
  const color = record.is_admitted
    ? "blue"
    : parseInt(record.is_paid)
      ? "green"
      : "red"; // Conditional color based on `paid` field

  return <span style={{ color }}>{text}</span>;
};

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}

const handleButtonClick = (e) => {
  // message.info("Click on left button.");
  console.log("click left button", e);
};

const items = [
  {
    label: "Add Application",
    key: "1",
    icon: (
      <AddCircleSharp
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
  // {
  //   label: "Edit Application",
  //   key: "2",
  //   icon: (
  //     <EditNoteSharp
  //       style={{
  //         fontSize: 18,
  //       }}
  //     />
  //   ),
  // },
  // {
  //   label: "Edit Campus",
  //   key: "3",
  //   icon: (
  //     <HouseSidingSharp
  //       style={{
  //         fontSize: 18,
  //       }}
  //     />
  //   ),
  //   // danger: true,
  // },
  // {
  //   label: "Edit Study Time",
  //   key: "4",
  //   icon: (
  //     <AccessTimeFilledSharp
  //       style={{
  //         fontSize: 18,
  //       }}
  //     />
  //   ),
  // },
  {
    label: "Import Applicants",
    key: "import_applicants",
    icon: (
      <PublishSharp
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
  {
    label: "Export Applicants",
    key: "6",
    icon: (
      <GetAppSharp
        style={{
          fontSize: 18,
        }}
      />
    ),
  },
  // {
  //   label: "Administratively Admit",
  //   key: "7",
  //   icon: (
  //     <DownloadDone
  //       style={{
  //         fontSize: 18,
  //       }}
  //     />
  //   ),
  // },
];

const defaultExpandable = {
  expandedRowRender: (record) => <p>{record.address}</p>,
};

function AdmissionsDataTable() {
  const direction = useDirection();
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(50);
  const [current, setCurrent] = useState(1);
  const [selectedCriteria, setSelectedCriteria] = useState("name");
  const userObj = useSelector(selectUser);
  const selectedCourseGroup = useSelector(selectSelectedApplicantSummary);
  const loadingApplications = useSelector(selectLoadingApplications);
  const applications = useSelector(selectApplications);
  const selectedApplications = useSelector(selectSelectedApplications);
  const applicantsAdmissionList = useSelector(selectApplicantsAdmissionList);
  const admitStdsModalVisible = useSelector(selectAdmitStdsModalVisible);
  const selectedRowKeys = useSelector(selectSelectedRowKeys);
  const [searchResults, setSearchResults] = useState([]);
  const totalRecords = useSelector(selectTotalApplicants);
  const currentPage = useSelector(selectApplicantsCurrentPage);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortColumns, setSortColumns] = useState([]);
  const searchActive = useSelector(selectSearchActive);
  const applicantSearchValue = useSelector(selectApplicantSearchValue);

  const [
    loadApplications,
    { error: loadFormsErr, loading: loadingForms, refetch: refetchForms },
  ] = useLazyQuery(LOAD_APPLICATIONS, {
    notifyOnNetworkStatusChange: true, // Essential for accurate loading state
    fetchPolicy: "no-cache",
  });

  const [
    globalSearchApplications,
    { error: globalErr, loading: searchingGlobally, refetch: searchRefetch },
  ] = useLazyQuery(GLOBAL_SEARCH, {
    fetchPolicy: "network-only",
  });

  const onChange = (value) => {
    // console.log(`selected ${value}`);
    setSelectedCriteria(value);
  };

  const columns2 = useMemo(() => {
    return [
      {
        ...SelectColumn,
        cellClass(row) {
          return row.type === "DETAIL" ? "hidden-select" : "";
        },
      },
      // {
      //   key: "expander",
      //   name: "",
      //   width: 40,
      //   // frozen: true,
      //   colSpan(args) {
      //     return args.type === "ROW" && args.row.type === "DETAIL"
      //       ? 13
      //       : undefined;
      //   },
      //   renderCell: ({ row, onRowChange, tabIndex }) => {
      //     // console.log("row", row);
      //     if (row.type === "DETAIL") {
      //       return (
      //         <Row
      //           gutter={24}
      //           style={{
      //             padding: 5,
      //           }}
      //         >
      //           <Col>
      //             <div
      //               style={{
      //                 display: "flex",
      //                 flexDirection: "column",
      //               }}
      //             >
      //               <Space
      //                 style={{
      //                   padding: "5px 0px",
      //                 }}
      //               >
      //                 <AntTypography.Text strong>
      //                   ADMITTED BY:
      //                 </AntTypography.Text>
      //                 <AntTypography.Text>
      //                   {row.admitted_by_user}
      //                 </AntTypography.Text>
      //               </Space>

      //               <Space>
      //                 <AntTypography.Text strong>
      //                   ADMITTED ON:
      //                 </AntTypography.Text>
      //                 <AntTypography.Text>
      //                   {formatDateString(parseInt(row.admitted_on))}
      //                 </AntTypography.Text>
      //               </Space>
      //             </div>
      //           </Col>

      //           <Col>
      //             <div
      //               style={{
      //                 display: "flex",
      //                 flexDirection: "column",
      //               }}
      //             >
      //               <Space
      //                 style={{
      //                   padding: "5px 0px",
      //                 }}
      //               >
      //                 <AntTypography.Text strong>
      //                   REGISTRATION NO:
      //                 </AntTypography.Text>
      //                 <AntTypography.Text>
      //                   {row.registration_no}
      //                 </AntTypography.Text>
      //               </Space>
      //             </div>
      //           </Col>
      //         </Row>
      //       );
      //     }
      //     return (
      //       <CellExpanderFormatter
      //         expanded={row.expanded}
      //         tabIndex={tabIndex}
      //         onCellExpand={() => {
      //           onRowChange({ ...row, expanded: !row.expanded });
      //         }}
      //       />
      //     );
      //   },
      // },
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
        key: "creation_date",
        ellipsis: true,
        renderCell({ row, rowIdx }) {
          return renderRow(row, formatDateString(parseInt(row.creation_date)));
        },

        width: 180,
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
        name: "Name",
        width: 210,
        key: "full_name",
        sortable: true,
        ellipsis: true,
        sorter: (a, b) => {
          const nameA = a.applicant
            ? `${a.applicant.surname || ""} ${a.applicant.other_names || ""}`
            : "";
          const nameB = b.applicant
            ? `${b.applicant.surname || ""} ${b.applicant.other_names || ""}`
            : "";
          return nameA.localeCompare(nameB);
        },
        renderCell({ row, rowIdx }) {
          return renderRow(
            row,
            row.applicant
              ? `${row.applicant.surname} ${row.applicant.other_names}`
              : ""
          );
        },
      },
      {
        name: "Sex",
        key: "gender",
        width: 50,
        renderCell({ row, rowIdx }) {
          return renderRow(row, row.applicant.gender);
        },
      },
      {
        name: "Email",
        key: "email",
        width: 180,
        ellipsis: true,
        // render: (text, record, index) => <span>{`${record.applicant.email}`}</span>,
        renderCell({ row, rowIdx }) {
          return renderRow(row, row.applicant.email);
        },
      },
      {
        name: "Paid",
        key: "is_paid",
        ellipsis: true,
        width: 50,
        renderCell({ row, rowIdx }) {
          if (Boolean(parseInt(row.is_paid))) {
            return (
              <CheckIcon
                style={{
                  color: row.is_admitted
                    ? "blue"
                    : parseInt(row.is_paid)
                      ? "green"
                      : "red",
                }}
              />
            );
          } else {
            return renderRow(row, "...");
          }
        },
      },
      {
        name: "Admitted",
        key: "admitted",
        ellipsis: true,
        renderCell({ row, rowIdx }) {
          if (row.is_admitted) {
            return (
              <CheckIcon
                style={{
                  color: "blue",
                }}
              />
            );
          } else {
            return renderRow(row, "...");
          }
        },
        width: 80,
      },
      {
        name: "1st Choice",
        children: [
          {
            name: "Progcode",
            key: "code",
            ellipsis: true,
            renderCell({ row, rowIdx }) {
              return renderRow(row, row.program_choices[0].course.course_code);
            },
            width: 100,
          },
          {
            name: "Alias",
            key: "alias",
            renderCell({ row, rowIdx }) {
              return renderRow(row, row.program_choices[0].course.course_code);
            },
            width: 100,
          },
        ],
      },
    ];
  }, [direction]);

  const handlePaginationChange = (page) => {
    dispatch(setApplicantsCurrentPage(page));
  };

  const fetchApplications = async (page) => {
    const payload = {
      admissionsId: selectedCourseGroup.admissions_id,
      courseId: selectedCourseGroup.course_id,
      campusId: selectedCourseGroup.campus_id,
      start: (page - 1) * pageSize, // Calculate offset based on page
      limit: pageSize, // Number of records per page
    };

    dispatch(setSearchActive(false));

    const res = await loadApplications({
      variables: payload,
    });

    if (res.data) {
      dispatch(setTotalApplicants(res.data.applications.total_records));
      dispatch(setApplications(res.data.applications.applications));
    }
  };

  const onSearch = async (value) => {
    if (!value) {
      return;
    }

    dispatch(setSearchActive(true));
    dispatch(setApplicantSearchValue(value));

    dispatch(setApplicantsCurrentPage(1));

    const payload = {
      searchCriteria: selectedCriteria,
      searchValue: value,
      admissionsId: null,
      admitted: false,
      start: 0,
      limit: pageSize,
    };

    const response = await globalSearchApplications({
      variables: payload,
    });

    if (response.data) {
      dispatch(setTotalApplicants(response.data.global_search.total_records));
      dispatch(
        setApplications(response?.data?.global_search?.applications || [])
      );
    }
  };

  const [admitStudents, { error, loading, data }] = useMutation(ADMIT_STDS, {
    refetchQueries: ["loadApplications"],
  });

  const completedApplications = applications.filter(
    (form) => form.is_completed
  );
  const inCompletedApplications = applications.filter(
    (form) => !form.is_completed
  );

  const [
    loadApplicationDetails,
    {
      error: loadErr,
      data: applicationRes,
      loading: loadingApplicationDetails,
    },
  ] = useLazyQuery(LOAD_APPLICATION_DETAILS);

  useEffect(() => {
    if (loadErr) {
      dispatch({
        message: loadErr.message,
        variant: "error",
      });
    }

    if (error) {
      dispatch({
        message: error.message,
        variant: "error",
      });
    }

    if (loadFormsErr) {
      dispatch({
        message: loadFormsErr.message,
        variant: "error",
      });
    }

    if (globalErr) {
      dispatch({
        message: globalErr.message,
        variant: "error",
      });
    }
  }, [loadFormsErr, loadErr, error, globalErr]);

  useEffect(() => {
    if (applications.length > 0) {
      fetchApplications(currentPage);
    }
  }, [currentPage]);

  const handleMenuClick = (e) => {
    // message.info("Click on menu item.");
    console.log("click", e);
    if (e.key == "7") {
      // admiministrative admit
      dispatch(setAdmitStdsModalVisible(true));
    }

    if (e.key == "import_applicants") {
      dispatch(setImportApplicantsModalVisible(true));
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys, selectedRows);
    // setSelectedRowKeys(newSelectedRowKeys);
    dispatch(setSelectedRowKeys(newSelectedRowKeys));
    dispatch(setSelectedApplications(selectedRows));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleAdmit = async () => {
    // console.log("selected applications", selectedApplications);

    const _applications = selectedApplications.map((application) => ({
      application_id: application.id,
      prog_choice_id: application.program_choices[0].id,
      std_id: application.std_id,
    }));

    const data = {
      applicants: _applications,
      admittedBy: userObj.user.user_id,
    };

    // console.log("data", data);

    const res = await admitStudents({
      variables: data,
    });

    dispatch(
      showMessage({
        message: res.data.admit_students.message,
        variant: "success",
      })
    );

    dispatch(setAdmitStdsModalVisible(false));
    dispatch(setSelectedApplications([]));
  };

  const handleOpenPreview = async () => {
    const selectedApplicants = applications.filter((obj) =>
      selectedRows.has(obj.id)
    );
    if (selectedApplicants.length > 0) {
      let latestAppSelected = selectedApplicants[selectedApplicants.length - 1];
      // console.log("application", latestAppSelected);
      const payload = {
        admissionsId: latestAppSelected.running_admissions.id,
        applicantId: latestAppSelected.applicant.id,
        formNo: latestAppSelected.form_no,
        admissionLevelId:
          latestAppSelected.running_admissions.admission_level.id,
      };

      // console.log("application", payload);
      const res = await loadApplicationDetails({
        variables: payload,
      });

      // console.log("response", res.data);
      dispatch(setApplicationForm(res.data));
      dispatch(setApplicationPreviewModalOpen(true));
    }
  };

  useEffect(() => {
    selectedRows.clear();
  }, [applications]);

  const handleReload = async () => {
    try {
      // Set loading state
      dispatch(setLoadingApplications(true));

      let response;

      if (searchActive && applicantSearchValue) {
        // If search was active and we have a search value
        response = await searchRefetch({
          searchCriteria: selectedCriteria,
          searchValue: applicantSearchValue,
          admissionsId: null,
          admitted: false,
          start: (currentPage - 1) * pageSize,
          limit: pageSize,
        });

        if (response?.data?.global_search) {
          dispatch(
            setTotalApplicants(response.data.global_search.total_records)
          );
          dispatch(
            setApplications(response.data.global_search.applications || [])
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

        await fetchApplications(currentPage);
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
      dispatch(setLoadingApplications(false));
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
          backgroundColor: "#2f405d",
          borderTop: "1px solid lightgray",
          borderLeft: "1px solid lightgray",
          borderRight: "1px solid lightgray",
        }}
        className="p-5"
        style={{
          paddingLeft: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 15,
        }}
      >
        <Typography.Text
          strong
          style={{
            color: "#fff",
          }}
        >
          {selectedCourseGroup
            ? `${selectedCourseGroup.course_title} - (${selectedCourseGroup.course_code})`
            : null}
        </Typography.Text>

        <div>
          <Space>
            <Tooltip title="Reload">
              <Refresh
                onClick={handleReload}
                fontSize=""
                color="white"
                style={{
                  color: "white",
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
          maxHeight: "calc(100vh - 188px)",
          minHeight: "calc(100vh - 188px)",
          //   height: 600,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: 8,
            display: "flex",
            justifyContent: "space-between",
            // borderColor: "lightgray",
            borderTop: "1px solid lightgray",
            borderLeft: "1px solid lightgray",
            borderRight: "1px solid lightgray",
            // borderWidth: 1,
            marginBottom: 0,
          }}
        >
          <Space size="large">
            <Select
              showSearch
              placeholder="Select Criteria"
              optionFilterProp="label"
              size="small"
              style={{
                width: 200,
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
              value={applicantSearchValue}
              onChange={(e) =>
                dispatch(setApplicantSearchValue(e.target.value))
              }
              size="small"
              style={{
                width: 200,
              }}
            />

            <Dropdown menu={menuProps} trigger={["click"]}>
              <Button size="small">
                <Space>
                  Actions
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Button size="small">Download All Applicants</Button>
            <Button size="small" disabled={inCompletedApplications.length == 0}>
              View Incomplete Forms
            </Button>
          </Space>

          <Button
            disabled={selectedRows.size == 0 || loadingApplicationDetails}
            loading={loadingApplicationDetails}
            onClick={handleOpenPreview}
            size="small"
          >
            View Form
          </Button>
        </div>
        <div
          style={{
            // backgroundColor: "#fff",
            // maxHeight: "calc(100vh - 185px)",
            minHeight: "calc(100vh - 225px)",
            display: "flex",
            flexDirection: "column",
            height: "100%", // Ensure it takes full height
            //   height: 600,
          }}
        >
          <div
            style={{
              flexGrow: 1,
              overflow: "auto",
              backgroundColor: "#fff",
            }}
          >
            <Spin
              spinning={
                loadingApplications || loadingForms || searchingGlobally
              }
            >
              <DataGrid
                className="rdg-light fill-grid"
                // rowHeight={30}
                rowKeyGetter={(row) => row.id}
                columns={columns2}
                rows={
                  searchResults.length > 0
                    ? searchResults
                    : completedApplications
                }
                onSortColumnsChange={setSortColumns}
                sortColumns={sortColumns}
                style={{
                  border: "1px solid #ccc",
                  height: "calc(100vh - 265px)",
                }}
                onSelectedRowsChange={setSelectedRows}
                selectedRows={selectedRows}
                defaultColumnOptions={{
                  sortable: true,
                  resizable: true,
                }}
                // onRowsChange={onRowsChange}
                // onCellDoubleClick={(args) => {
                //   // console.log("args", args);
                //   dispatch(setSelectedAdmittedStudent(args.row));
                //   dispatch(setEditStudentRecordsModalVisible(true));
                // }}
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
              height: 40,
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
                  <Typography.Text>{totalRecords} Records</Typography.Text>
                </Space>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <FormPreview />
      <AddStdToAdmissionModal />
      <ApplicantAdmissionList />
      <ImportApplicants />
      <Modal
        title="ADMIT STUDENTS"
        // centered
        open={admitStdsModalVisible}
        // style={{
        //   top: 0,
        //   //   overflow: "auto",
        // }}
        onOk={() => handleAdmit()}
        onCancel={() => dispatch(setAdmitStdsModalVisible(false))}
        okButtonProps={{
          danger: true,
          loading: loading,
          disabled: loading || selectedApplications == 0,
        }}
        okType="primary"
        width={1000}
        zIndex={10000}
        okText="Admit Students"
      >
        {/* <ApplicationPreview form_details={selectedApplication} /> */}
        <AdmitStudentsModal />
      </Modal>

      <FloatButton.Group
        shape="circle"
        style={{
          insetInlineEnd: 30,
          insetBlockEnd: 66,
        }}
      >
        <FloatButton
          // href="https://ant.design/index-cn"
          tooltip={<div>Applicant Admission List</div>}
          shape="square"
          type="primary"
          badge={{
            count: applicantsAdmissionList.length,
            overflowCount: 999,
          }}
          onClick={() => dispatch(setApplicanntsAdmissionListModal(true))}
        />
      </FloatButton.Group>
    </div>
  );
}

export default AdmissionsDataTable;
