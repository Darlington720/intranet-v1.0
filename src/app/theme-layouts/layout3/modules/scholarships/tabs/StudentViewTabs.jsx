import React, { useState } from "react";
import { Card, Spin } from "antd";
// import BioData from "./BioData";
import { useDispatch, useSelector } from "react-redux";
import { setActiveStudentTab, selectActiveStudentTab } from "../store/scholarshipSlice";
// import EnrollmentTrack from "./enrollment_track/EnrollmentTrack";
// import RegistrationTrack from "./registration_track/RegistrationTrack";
// import Invoices from "./invoices/Invoices";
// import CreditNotes from "./credit_notes/CreditNotes";
// import Ledger from "./ledger/Ledger";
// import Transactions from "./transactions/Transactions";
// import FeesStructure from "./fees_structure/FeesStructure";

const tabListNoTitle = [
    {
      key: "bisic_data",
      label: "Basic Data",
    },
  {
    key: "invoices",
    label: "Invoices",
  },
  {
    key: "disbursements",
    label: "Disbursements",
  },
  {
    key: "ledger",
    label: "Ledger",
  },
  {
    key: "transactions",
    label: "Transactions",
  },
  {
    key: "fees_structure",
    label: "Fees Structure",
  },
  {
    key: "enrollment_track",
    label: "Enrollment History",
  },
  {
    key: "registration_track",
    label: "Registration History",
  },
];
const contentListNoTitle = {
//   invoices: <Invoices />,
//   credit_notes: <CreditNotes />,
//   ledger: <Ledger />,
//   transactions: <Transactions />,
//   fees_structure: <FeesStructure />,
//   biodata: <BioData />,
//   enrollment_track: <EnrollmentTrack />,
//   registration_track: <RegistrationTrack />,
};
const StudentViewTabs = () => {
  const dispatch = useDispatch();
  //   const [activeTabKey2, setActiveTabKey2] = useState("biodata");
  const activeTabKey = useSelector(selectActiveStudentTab);

  //   console.log(activeTabKey);

  const onTabChange = (key) => {
    // setActiveTabKey2(key);
    dispatch(setActiveStudentTab(key));
  };

  return (
    <>
      <div
        style={{
          padding: 10,
          // backgroundColor: "red",
        }}
      >
        <Card
          style={{
            width: "100%",
            borderColor: "lightgray",
            height: "calc(100vh - 165px)",
            padding: 0,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          size="small"
          tabList={tabListNoTitle}
          activeTabKey={activeTabKey}
          bordered
          onTabChange={onTabChange}
          tabProps={{
            size: "small",
          }}
        >
          <Spin 
        //   spinning={loadingStudentFile}
          >
            {contentListNoTitle[activeTabKey]}
          </Spin>
        </Card>
      </div>
    </>
  );
};
export default StudentViewTabs;
