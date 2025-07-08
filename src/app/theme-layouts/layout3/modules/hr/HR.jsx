import React, { useMemo } from "react";
import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import Box from "@mui/material/Box";
import { selectActiveTab, setActiveTab } from "./store/hrSlice";
import Employee from "./tabs/employee/Employee";
import Designations from "./tabs/designations/Designations";
import Appraisals from "./tabs/appraisals/Appraisals";
import Dashboard from "./tabs/dashboard/Dashboard";
import Travel from "./tabs/travel/Travel";
import Payroll from "./tabs/payroll/Payroll";
import ComplianceLegal from "./tabs/compliance_legal/ComplianceLegal";
import Leave from "./tabs/leave/Leave";
import HRManagement from "./tabs/management_modules/Management";
import AppNav2 from "../../components/AppNav2";
import { ConfigProvider, theme } from "antd";

function HR() {
  const dispatch = useDispatch();
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const [loading, setLoading] = useState(!appExistsInTaskBar ? true : false);
  const activeApp = useSelector((state) => state.apps.activeApp);
  const activeTab = useSelector(selectActiveTab);

  const tabs = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Employees", value: "employees" },
    { label: "Appraisals", value: "appraisals" },
    // { label: "Travel", value: "travel" },
    // { label: "Payroll", value: "payroll" },
    // { label: "Leave", value: "leave" },
    // { label: "Compliance & Legal", value: "compliance_legal" },
    // { label: "Designations", value: "designations" },
    // { label: "Management", value: "management" },
  ];

  useEffect(() => {
    if (!appExistsInTaskBar) {
      setLoading(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "employees" && <Employee />}{" "}
            {/* Always renders Employee */}
            {activeTab === "appraisals" && <Appraisals />}
            {/* {activeTab === "designations" && <Designations />}
            {activeTab === "travel" && <Travel />}
            {activeTab === "payroll" && <Payroll />}
            {activeTab === "leave" && <Leave />}
            {activeTab === "compliance_legal" && <ComplianceLegal />}
            {activeTab === "management" && <HRManagement />} */}
          </Box>
        </Suspense>
      </ConfigProvider>
    </>
  );
}

export default HR;
