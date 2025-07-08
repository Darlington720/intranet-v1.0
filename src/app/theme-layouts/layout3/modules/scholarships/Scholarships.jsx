import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gql, useQuery } from "@apollo/client";
import FuseLoading from "@fuse/core/FuseLoading";
import Box from "@mui/material/Box";
import { ConfigProvider, theme } from "antd";
import AppNav2 from "../../components/AppNav2";
import { updateAccYrs } from "../setup/store/setUpSlice";
import { selectActiveTab, setActiveTab } from "./store/scholarshipSlice";
import StudentView from "./tabs/StudentView";
import ScholarshipSettings from "./tabs/settings/Settings";

function Scholarships() {
  const dispatch = useDispatch();
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const [loading, setLoading] = useState(!appExistsInTaskBar ? true : false);
  const activeApp = useSelector((state) => state.apps.activeApp);
  const activeTab = useSelector(selectActiveTab);

  const tabs = [
    { label: "Student View", value: "student_view" },
    { label: "Batch Actions", value: "batch_actions" },
    // { label: "Eligibility Rules", value: "eligibility_rules" },
    // { label: "Funding Sources", value: "funding_sources" },
    // { label: "Scholarship Limits", value: "limits" },
    { label: "Approvals", value: "approvals" },
    { label: "Disbursement History", value: "disbursement_history" },
    { label: "Reports", value: "reports" },
    { label: "Audit Trail", value: "logs" },
    { label: "Settings", value: "settings" },
  ];
  

  useEffect(() => {
    if (!appExistsInTaskBar) {
      setLoading(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [appExistsInTaskBar]);

  function handleTabChange(event, value) {
    dispatch(setActiveTab(value));
  }

  return loading ? (
    <FuseLoading logo={activeApp?.logo} />
  ) : (
    <>
      <ConfigProvider
        theme={{
          algorithm: [theme.compactAlgorithm],
          token: {
            colorPrimary: "#4f46e6", // Match the purple color from original
          },
        }}
      >
        <Suspense fallback={<FuseLoading logo={activeApp?.logo} />}>
          <Box sx={{ flexGrow: 1 }}>
            <AppNav2
              tabs={tabs}
              activeApp={activeApp}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
            />
            {activeTab === "student_view" && <StudentView />}
            {activeTab === "settings" && <ScholarshipSettings />}
            {/* {activeTab === "reports" && <FinanceReports />}
            {activeTab === "graduation_clearance" && <GraduationClearance />} */}
          </Box>
        </Suspense>
      </ConfigProvider>
    </>
  );
}

export default Scholarships;
