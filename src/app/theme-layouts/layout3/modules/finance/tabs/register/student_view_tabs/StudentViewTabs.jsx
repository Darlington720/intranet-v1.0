import React, { useState } from "react";
import { Card, Spin } from "antd";
import BioData from "./BioData";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveRegisterTab,
  selectDeletingEnrollment,
  selectLoadingStudentData,
  setActiveRegisterTab,
} from "../../../store/financeSlice";
import EnrollmentTrack from "./enrollment_track/EnrollmentTrack";
import RegistrationTrack from "./registration_track/RegistrationTrack";
import Invoices from "./invoices/Invoices";
import CreditNotes from "./credit_notes/CreditNotes";
import Ledger from "./ledger/Ledger";
import Transactions from "./transactions/Transactions";
import FeesStructure from "./fees_structure/FeesStructure";

const tabListNoTitle = [
  {
    key: "invoices",
    label: "Invoices",
  },
  {
    key: "credit_notes",
    label: "Credit Notes",
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
    key: "biodata",
    label: "Bio Data",
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
  invoices: <Invoices />,
  credit_notes: <CreditNotes />,
  ledger: <Ledger />,
  transactions: <Transactions />,
  fees_structure: <FeesStructure />,
  biodata: <BioData />,
  enrollment_track: <EnrollmentTrack />,
  registration_track: <RegistrationTrack />,
};
const StudentViewTabs = () => {
  const dispatch = useDispatch();
  const loadingStudentFile = useSelector(selectLoadingStudentData);
  const deletingEnrollment = useSelector(selectDeletingEnrollment);
  //   const [activeTabKey2, setActiveTabKey2] = useState("biodata");
  const activeTabKey = useSelector(selectActiveRegisterTab);

  //   console.log(activeTabKey);

  const onTabChange = (key) => {
    // setActiveTabKey2(key);
    dispatch(setActiveRegisterTab(key));
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
          <Spin spinning={loadingStudentFile || deletingEnrollment}>
            {contentListNoTitle[activeTabKey]}
          </Spin>
        </Card>
      </div>
    </>
  );
};
export default StudentViewTabs;
