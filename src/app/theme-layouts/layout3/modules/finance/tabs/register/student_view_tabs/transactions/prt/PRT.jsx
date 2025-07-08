import { Tabs, Collapse, Typography } from "antd";
import GenerateTable from "./GenerateTable";
import PartialPayment from "./PartialPayment";
import Deposit from "./Deposit/Deposit";
import ActiveRefToken from "./ActiveRefToken";

const collapseItems = [
  {
    key: "1",
    label: "GENERATE PRT TO PAY FOR ALL PENDING INVOICES",
    children: (
      <div style={{ padding: "8px" }}>
        <GenerateTable />
      </div>
    ),
  },
  {
    key: "2",
    label: "GENERATE PRT TO MAKE PARTIAL PAYMENT ON PENDING INVOICES",
    children: (
      <div style={{ padding: "8px" }}>
        <PartialPayment />
      </div>
    ),
  },
  {
    key: "3",
    label: "GENERATE PRT TO DEPOSIT TO MY ACCOUNT",
    children: (
      <div style={{ padding: "8px" }}>
        <Deposit />
      </div>
    ),
  },
];

const collapse1 = [
  {
    key: "1",
    label: "ACTIVE PAYMENT REFERENCE TOKENS",
    children: (
      <div style={{ padding: "8px" }}>
        <ActiveRefToken />
      </div>
    ),
  },
];

const Desc = ({ text }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      padding: "8px",
      textAlign: "center",
    }}
  >
    <Typography.Title
      type="secondary"
      level={5}
      style={{
        whiteSpace: "normal",
        fontSize: "clamp(12px, 2vw, 16px)", // Responsive font size
      }}
    >
      {text}
    </Typography.Title>
  </div>
);

const PRT = () => {
  const onChange = (key) => {
    console.log(key);
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <div style={{ fontWeight: "bold", fontSize: "clamp(12px, 2vw, 16px)" }}>
          GENERATE NEW PAYMENT REF. TOKEN
        </div>
      ),
      children: (
        <div style={{ padding: "8px" }}>
          <Collapse
            accordion
            defaultActiveKey={["1"]}
            onChange={onChange}
            style={{ fontSize: "clamp(10px, 2vw, 14px)" }}
          >
            {collapseItems.map((item) => (
              <Collapse.Panel header={item.label} key={item.key}>
                {item.children}
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div style={{ fontWeight: "bold", fontSize: "clamp(12px, 2vw, 16px)" }}>
          MY ACTIVE PAYMENT REF TOKENS
        </div>
      ),
      children: (
        <div style={{ padding: "8px" }}>
          <Collapse
            accordion
            defaultActiveKey={["1"]}
            onChange={onChange}
            style={{ fontSize: "clamp(10px, 2vw, 14px)" }}
          >
            {collapse1.map((item) => (
              <Collapse.Panel header={item.label} key={item.key}>
                {item.children}
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>
      ),
    },
  ];

  return (
    <Tabs
      defaultActiveKey="1"
      items={tabItems}
      onChange={onChange}
      style={{
        padding: "8px",
        fontSize: "clamp(12px, 2vw, 16px)",
      }}
    />
  );
};

export default PRT;
