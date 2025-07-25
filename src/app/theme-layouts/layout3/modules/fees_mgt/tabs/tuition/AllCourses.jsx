import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Tree,
  Input,
  Spin,
  Space,
  Select,
  Row,
  Col,
  Form,
  Button,
  ConfigProvider,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { gql, NetworkStatus, useLazyQuery, useQuery } from "@apollo/client";
import "./myStyles.css";
import extractIds from "../../../prog_and_courses/utilities/extractIDs";
import {
  selectAllStudentCourses,
  selectStdInfoExpandedItems,
  selectStdInfoReqs,
  selectUserFilteredCourses,
  setAllInfoReqs,
  setStdInfoExpandedItems,
  setStdInfoReqs,
  setUserFilteredCourses,
} from "../../../student_info_center/store/infoCenterSlice";
import { GET_STUDENTS } from "../../../student_info_center/gql/queries";
import {
  GET_ALL_PROGRAMMES_FOR_FEES,
  LOAD_TUITION_FEES,
} from "../../gql/queries";
// import mapDataToTree from "app/theme-layouts/layout3/utils/mapDataToTree";
import {
  selectAllCourses,
  selectExpandedKeysTuition,
  selectFormState,
  selectNationalityCategories,
  selectSelectedTreeItem,
  setAllCourses,
  setExpandedKeysTuition,
  setFormState,
  setLoadingTuitionFees,
  setNationalityCategories,
  setSelectedTreeItem,
  setTuitionFeesItems,
} from "../../store/feesMgtSlice";
import { ExpandMore } from "@mui/icons-material";
const { DirectoryTree } = Tree;
const { Search } = Input;

const LOAD_REQS = gql`
  query Query {
    campuses {
      id
      campus_title
    }
    intakes {
      id
      intake_title
    }
    acc_yrs {
      id
      acc_yr_title
    }
  }
`;

const mapDataToTree = (schools, nationalityCategories) => {
  return schools.map((school) => ({
    key: school.id,
    title: (
      <span
        style={{
          color: "maroon",
        }}
      >{`(${school.school_code}) ${school.school_title}`}</span>
    ),
    level: 1,
    children: school.courses.map((course) => ({
      key: course.id,
      title: (
        <span
          style={{
            color: "purple",
          }}
        >{`${course.course_code} - ${course.course_title}`}</span>
      ),
      level: 2,
      children: Array.from({ length: course.course_duration }, (_, i) => ({
        key: `${course.id}-year-${i + 1}`,
        title: (
          <span
            style={{
              color: "darkgreen",
            }}
          >{`Year ${i + 1}`}</span>
        ),
        level: 3,
        children: nationalityCategories.map((category) => ({
          key: `${course.id}-year-${i + 1}-category-${category.id}`,
          title: (
            <span
              style={{
                color: "darkblue",
              }}
            >
              {category.category_title}
            </span>
          ),
          level: 4,
          // Don't mark it as isLeaf if there are children (study times)
          children: course.course_study_times.map((studyTime) => ({
            key: `course-${course.id}-year-${i + 1}-category-${category.id}-studyTime-${studyTime.id}-school-${school.id}`,
            title: (
              <span
                style={{
                  color: "blueviolet",
                }}
              >
                {studyTime.study_time_title}
              </span>
            ),
            details: {
              study_time_id: studyTime.id,
              study_time_title: studyTime.study_time_title,
              nationality_id: category.id,
              nationality_title: category.category_title,
              study_yr: i + 1,
              course_id: course.id,
              course_code: course.course_code,
              school_id: school.id,
              school_title: school.school_title,
            },
            // Set isLeaf to true for the last level (study times)
            isLeaf: true,
            level: 5,
          })),
        })),
      })),
    })),
  }));
};

const containsSearchTerm = (str, searchTerm) =>
  str.toLowerCase().includes(searchTerm.toLowerCase());

// Main search function
function searchHierarchy(data, searchTerm) {
  function search(items) {
    return items.reduce((acc, item) => {
      let match = false;

      // Check if the current item matches
      if (
        containsSearchTerm(item.label, searchTerm) ||
        containsSearchTerm(item.code ? item.code : "", searchTerm)
      ) {
        match = true;
      }

      // Recursively search children
      const matchingChildren = item.children ? search(item.children) : [];

      // If there's a match in the current item or its children
      if (match || matchingChildren.length > 0) {
        // Create a new object with matching items, preserving the original structure
        const newItem = { ...item };

        // If there are matching children, add them to the new item
        if (matchingChildren.length > 0) {
          newItem.children = matchingChildren;
        }

        // Add the matching item to the accumulator
        acc.push(newItem);
      }

      return acc;
    }, []);
  }

  return search(data);
}

const DirectoryOpenIcon = React.memo(() => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="octicon octicon-file-directory-open-fill"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="#54aeff"
    style={{
      display: "inline-block",
      userSelect: "none",
      verticalAlign: "text-bottom",
      overflow: "visible",
    }}
  >
    <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H13a1 1 0 0 1 1 1v.5H2.75a.75.75 0 0 0 0 1.5h11.978a1 1 0 0 1 .994 1.117L15 13.25A1.75 1.75 0 0 1 13.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.91.513-1.237Z" />
  </svg>
));

const DirectoryClosedIcon = React.memo(() => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="octicon octicon-file-directory-fill"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="#54aeff"
    style={{
      display: "inline-block",
      userSelect: "none",
      verticalAlign: "text-bottom",
      overflow: "visible",
    }}
  >
    <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z" />
  </svg>
));

const FileIcon = React.memo(() => (
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    className="octicon octicon-file"
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="#636c76"
    style={{
      display: "inline-block",
      userSelect: "none",
      verticalAlign: "text-bottom",
      overflow: "visible",
    }}
  >
    <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" />
  </svg>
));

const titleRender = (nodeData, panelWidth) => {
  return (
    <div
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: `${panelWidth * 10.4}px`,
        // display: "flex",
      }}
    >
      <span
        style={{
          fontWeight: "500",
        }}
      >
        {nodeData.title}
      </span>
    </div>
  );
};

const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

const style = {
  //   background: "#0092ff",
  padding: "8px 0",
};

const AllCourses = ({ panelWidth }) => {
  const [dynamicHeight, setDynamicHeight] = useState(window.innerHeight - 290);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const stdInfoReqs = useSelector(selectStdInfoReqs);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  // const { allProgrammes, reloadCourses, addVersionModalOpen } =
  //   useSelector((state) => state.progAndCourses);
  // const [filteredProgrammes, setFilteredProgrammes] = useState(allProgrammes);
  const userFilteredCourses = useSelector(selectUserFilteredCourses);
  const expandedItems = useSelector(selectExpandedKeysTuition);
  const allCourses = useSelector(selectAllCourses);
  const nationalityCategories = useSelector(selectNationalityCategories);
  const formState = useSelector(selectFormState);

  const [
    getAllProgrammesCategorisedByCollege,
    { error, loading, data, refetch, networkStatus },
  ] = useLazyQuery(GET_ALL_PROGRAMMES_FOR_FEES, {
    notifyOnNetworkStatusChange: true,
    variables: {
      campusId: null,
    },
    fetchPolicy: "network-only",
  });

  const [
    loadTuitionFees,
    { error: loadErr, loading: loadingTuitionFees, data: loadRes },
  ] = useLazyQuery(LOAD_TUITION_FEES, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const {
    error: reqsErr,
    loading: loadingReqs2,
    data: reqsRes,
  } = useQuery(LOAD_REQS);

  const transformData = useCallback((nodes) => {
    return nodes.map((node) => ({
      key: node.id,
      title: node.code ? `(${node.code}) ${node.label}` : node.label,
      // isLeaf: !node.children || node.children.length === 0,
      isLeaf: node.__typename == "CourseVerion",
      children: node.children ? transformData(node.children) : [],
      typename: node.__typename,
      item: node,
      level: node.children ? 1 : 2,
    }));
  }, []);

  useEffect(() => {
    if (reqsErr) {
      // alert("error getting forms!");
      dispatch(
        showMessage({
          message: reqsErr.message,
          variant: "error",
        })
      );
    }

    if (loadErr) {
      // alert("error getting forms!");
      dispatch(
        showMessage({
          message: loadErr.message,
          variant: "error",
        })
      );
    }

    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [reqsErr, loadErr, error]);

  useEffect(() => {
    dispatch(setLoadingTuitionFees(loadingTuitionFees));
  }, [loadingTuitionFees]);

  useEffect(() => {
    if (reqsRes && !stdInfoReqs.campus) {
      // console.log(reqsRes);
      const payload = {
        campus: reqsRes.campuses[0].id,
        intake: reqsRes.intakes[0].id,
        acc_yr: reqsRes.acc_yrs[0].id,
      };

      dispatch(setStdInfoReqs(payload));
    }
    if (reqsRes) {
      dispatch(setAllInfoReqs(reqsRes));
    }
  }, [reqsRes]);

  // console.log("dynamic height", dynamicHeight);

  const updateHeight = () => {
    const newHeight = window.innerHeight - 258; // Subtracting 100px for any padding/header/etc.
    setDynamicHeight(newHeight);
  };

  useEffect(() => {
    // Update the height initially
    updateHeight();

    // Listen for screen resize events
    window.addEventListener("resize", updateHeight);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    if (loadRes) {
      dispatch(setTuitionFeesItems(loadRes.tuition_fees));
    }
    // console.log("response", loadRes.tuition_fees);
  }, [loadRes]);

  const onSelect = async (keys, info) => {
    // console.log("Trigger Select", info.selectedNodes[0]);
    if (info.selectedNodes[0].isLeaf) {
      dispatch(
        setSelectedTreeItem({
          key: info.selectedNodes[0].key,
          isLeaf: info.selectedNodes[0].isLeaf,
          details: info.selectedNodes[0].details,
          level: info.selectedNodes[0].level,
        })
      );

      const payload = {
        accYrId: formState.acc_yr,
        campusId: formState.campus,
        intakeId: formState.intake,
        schoolId: info.selectedNodes[0]?.details.school_id,
        courseId: info.selectedNodes[0]?.details.course_id,
        studyYr: `${info.selectedNodes[0]?.details.study_yr}`,
        nationalityCategoryId: info.selectedNodes[0]?.details.nationality_id,
        studyTimeId: info.selectedNodes[0]?.details.study_time_id,
      };

      const res = await loadTuitionFees({
        variables: payload,
      });

      dispatch(setTuitionFeesItems(res.data.tuition_fees));
    }
  };

  // const onExpand = (keys, info) => {
  //   // console.log("Trigger Expand", keys, info);
  //   // setExpandedKeys(keys);
  //   dispatch(updateExpandedItems(keys));
  // };

  // Memoized transformed tree data
  const memoizedTreeData = useMemo(
    () => mapDataToTree(allCourses || [], nationalityCategories || []),
    [allCourses]
  );

  // console.log(memoizedTreeData);

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Perform the search on the original allProgrammes data
    // const searchResult = searchHierarchy(allStudentCourses, value);

    // // Instead of updating the original data, update filtered data
    // // dispatch(updateFilteredProgrammes(searchResult));
    // dispatch(setUserFilteredCourses(searchResult));
    // console.log("result", searchResult);
  };

  // console.log("allcourses", allProgrammes);

  // // Filtered tree data based on search
  // const filteredTreeData = useMemo(() => {
  //   return searchValue
  //     ? filterTreeData(memoizedTreeData, searchValue, 2) // 2 is the bottom-most level
  //     : memoizedTreeData;
  // }, [searchValue, memoizedTreeData]);

  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
    dispatch(setExpandedKeysTuition(newExpandedKeys));
  };

  const onFinish = async (values) => {
    // console.log("Received values of form: ", values);

    dispatch(setFormState(values));
    const payload = {
      campusId: values.campus,
    };

    const res = await getAllProgrammesCategorisedByCollege({
      variables: payload,
    });

    // console.log("response", res.data);

    dispatch(setAllCourses(res.data.schools));
    dispatch(setNationalityCategories(res.data.nationality_categories));

    // const _data = mapDataToTree(res.data.colleges);

    // console.log("data", _data);
  };

  useEffect(() => {
    if (formState) {
      form.setFieldsValue({
        acc_yr: formState.acc_yr,
        campus: formState.campus,
        intake: formState.intake,
      });
    }
  }, [formState]);

  // console.log(formState);

  return (
    <div
      style={{
        padding: 10,
        backgroundColor: "#fff",
        borderTopColor: "lightgray",
        borderTopWidth: 1,
        // height: "calc(100vh - 155px)",
      }}
    >
      <Spin
        tip="Loading Courses..."
        spinning={loading}
        style={{
          height: "calc(100vh)",
          // backgroundColor: "red",
        }}
      >
        <Form
          // initialValues={_applicantFillForm}
          form={form}
          name="basic_form"
          // style={formStyle}
          onFinish={onFinish}
        >
          <Row
            gutter={16}
            style={{
              marginBottom: 10,
            }}
          >
            <Col className="gutter-row" span={7}>
              <Form.Item
                name={`acc_yr`}
                // label={`Academic Year`}
                rules={[
                  {
                    required: true,
                    message: "Field is Required",
                  },
                ]}
                style={{
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
              >
                <Select loading={loadingReqs2} placeholder="Accademic Year">
                  {reqsRes?.acc_yrs.map((acc_yr) => (
                    <Option value={acc_yr.id}>{acc_yr.acc_yr_title}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={7}>
              <Form.Item
                name={`campus`}
                // label={`Academic Year`}
                rules={[
                  {
                    required: true,
                    message: "Field is Required",
                  },
                ]}
                style={{
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
              >
                <Select loading={loadingReqs2} placeholder="Campus">
                  {reqsRes?.campuses.map((campus) => (
                    <Option value={campus.id}>{campus.campus_title}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={7}>
              <Form.Item
                name={`intake`}
                // label={`Academic Year`}
                rules={[
                  {
                    required: true,
                    message: "Field is Required",
                  },
                ]}
                style={{
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
              >
                <Select loading={loadingReqs2} placeholder="Intake">
                  {reqsRes?.intakes.map((intake) => (
                    <Option value={intake.id}>{intake.intake_title}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={3}>
              <div
                style={{
                  // paddingBottom: 8,
                  // backgroundColor: "red",
                  paddingTop: 3,
                  // display: "flex",
                  // alignItems: "center",
                }}
              >
                <Button
                  danger
                  type="primary"
                  size="small"
                  htmlType="submit"
                  style={{
                    backgroundColor: "dodgerblue",
                    padding: 11,
                  }}
                >
                  LOAD
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
        <Search
          style={{ marginBottom: 8 }}
          placeholder="Search"
          onChange={onSearchChange}
        />
        <div>
          <ConfigProvider
            theme={{
              components: {
                Tree: {
                  directoryNodeSelectedBg: "rgb(30,144,255, 0.2)",
                },
              },
            }}
          >
            <DirectoryTree
              //   multiple
              // defaultExpandAll
              showLine={true}
              height={dynamicHeight}
              onSelect={onSelect}
              onExpand={onExpand}
              expandedKeys={expandedItems}
              switcherIcon={
                <CaretDownOutlined
                  color="black"
                  style={{
                    color: "gray",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                />
              }
              // treeData={memoizedTreeData ? memoizedTreeData : []}
              autoExpandParent={autoExpandParent}
              treeData={memoizedTreeData}
              showIcon={true}
              icon={(item) =>
                item.data.isLeaf ? (
                  <FileIcon />
                ) : item.expanded ? (
                  <DirectoryOpenIcon />
                ) : (
                  <DirectoryClosedIcon />
                )
              }
              titleRender={(item) => titleRender(item, panelWidth)}
            />
          </ConfigProvider>
        </div>
      </Spin>
    </div>
  );
};
export default AllCourses;
