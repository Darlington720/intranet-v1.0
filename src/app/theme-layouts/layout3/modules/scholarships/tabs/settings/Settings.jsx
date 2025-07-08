import React, { useState } from "react";

import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import {
  ChevronLeft,
  ChevronRight,
  RequestPage,
  Reviews,
  Settings,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCircle,
  BarChart3,
  LogOut,
  LayoutTemplate,
} from "lucide-react";
import { selectActiveSettingsTab, setActiveSettingsTab } from "../../store/scholarshipSlice";
import ScholarshipTypes from "./ScholarshipTypes";
import FundingSources from "./FundingSources";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
// const items = [
//   getItem("Performance Reviews", "1", <Reviews />),
//   getItem("Feedback Requests", "3", <PullRequestOutlined />),
//   getItem("Appraisal Templates", "2", <SettingOutlined />),
// ];

const items = [
  {
    key: "scholarship_types",
    icon: <LayoutDashboard size={20} />,
    label: "Scholarship Types",
  },
  {
    key: "funding_sources",
    icon: <ClipboardList size={20} />,
    label: "Funding Sources",
  },
  {
    key: "elligibility_rules",
    icon: <UserCircle size={20} />,
    label: "Elligibility Rules",
  },
];
const ScholarshipSettings = () => {
  const [collapsed, setCollapsed] = useState(false);
  const activeTab = useSelector(selectActiveSettingsTab);

  const dispatch = useDispatch();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout
      style={{
        height: "calc(100vh - 99.2px)",
      }}
    >
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          position: "absolute",
          bottom: 10,
          //   left: 55,
          left: collapsed ? 58 : 180, // Adjust position based on collapsed state
          transition: "left 0.2s", // Smooth transition
          width: 40, // Equal width and height for a perfect circle
          height: 40,
          borderRadius: 20,
          zIndex: 999,
        }}
      >
        {collapsed ? (
          <ChevronRight
            style={{
              fontSize: 25,
            }}
          />
        ) : (
          <ChevronLeft
            style={{
              fontSize: 25,
            }}
          />
        )}
      </Button>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        // className="bg-white"
      >
        {/* <Menu
          // theme="dark"
          selectedKeys={[activeTab]}
          onSelect={({ key }) => dispatch(setActiveAppraisalTab(key))}
          mode="inline"
          items={items}
        /> */}
        <Menu
          mode="inline"
          theme="dark"
          defaultSelectedKeys={`${activeTab}`}
          items={items}
          onClick={({ key }) => dispatch(setActiveSettingsTab(key))}
        />
      </Sider>
      <Layout>
        {activeTab == "scholarship_types" && <ScholarshipTypes />}
        {activeTab == "funding_sources" && <FundingSources />}
      
      </Layout>
    </Layout>
  );
};
export default ScholarshipSettings;
