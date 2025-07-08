import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import Dashboard from "./tabs/dashboard/Dashboard";
import Events from "./tabs/events/Events";
import Jobs from "./tabs/jobs/Jobs";
import Resourses from "./tabs/resources_components/Resourses";
import Messages from "./tabs/messages/Messages";
import Forums from "./tabs/forums/Forums";
import Mentorship from "./tabs/mentorship/Mentorship";
import Donation from "./tabs/fundraising_components/Donation";
import AlumniDirectory from "./tabs/alumni_directory/AlumniDirectory";
import { selectActiveTab, updateActiveTab } from "./store/alumniSlice";
import AppNav from "../../components/AppNav";

const tabs = [
  "Dashboard",
  "Alumni Directory",
  "Events",
  "Jobs",
  "Resources",
  "Messages",
  "Forums",
  "Mentorship",
  "Fundraising",
  "Graduation Clearance",
];

const Setup = React.memo(function Setup() {
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const activeApp = useSelector((state) => state.apps.activeApp);
  const [loading, setLoading] = useState(!appExistsInTaskBar ? true : false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const location = useLocation();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveTab);

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setLeftSidebarOpen(false);
    }
  }, [location, isMobile]);

  function handleTabChange(event, value) {
    dispatch(updateActiveTab(value));
  }

  useEffect(() => {
    if (!appExistsInTaskBar) {
      setLoading(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const tabs = [
    {
      label: "Graduation Clearance",
      value: "graduation_clearance",
    },
  ];

  const firstVisibleTab = tabs.find((tab) => tab.visible !== false)?.value;

  useEffect(() => {
    if (firstVisibleTab) {
      dispatch(setActiveTab(firstVisibleTab));
    }
  }, [firstVisibleTab]);

  useEffect(() => {
    if (!appExistsInTaskBar) {
      setLoading(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  function handleTabChange(event, value) {
    // setSelectedTab(value);
    // console.log("value", value);
    dispatch(setActiveTab(value));
  }

  return loading ? (
    <FuseLoading logo={activeApp?.logo} />
  ) : (
    <>
      {loading ? (
        <FuseLoading logo={activeApp?.logo} />
      ) : (
        <Suspense fallback={<FuseLoading logo={activeApp?.logo} />}>
          <Box sx={{ flexGrow: 1 }}>
            <AppNav
              tabs={tabs}
              activeApp={activeApp}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
            />

            {activeTab === 0 && <Dashboard />}
            {activeTab === 1 && <AlumniDirectory />}
            {activeTab === 2 && <Events />}
            {activeTab === 3 && <Jobs />}
            {activeTab === 4 && <Resourses />}
            {activeTab === 5 && <Messages />}
            {activeTab === 6 && <Forums />}
            {activeTab === 7 && <Mentorship />}
            {activeTab === 8 && <Donation />}
            {activeTab === 9 && <div>Graduation Clearance</div>}
          </Box>
        </Suspense>
      )}
    </>
  );
});

export default Setup;
