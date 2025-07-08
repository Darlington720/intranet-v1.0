import { useRef, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale/en_US";
const waitTimePromise = async (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const waitTime = async (time = 100) => {
  await waitTimePromise(time);
};

const columns = [
  {
    dataIndex: "index",
    valueType: "indexBorder",
    width: 48,
  },
  {
    title: "Tred Pay Reference",
    dataIndex: "tredPayReference",
    width: 200,
    copyable: true,
    ellipsis: true,
    tooltip: "The reference for the Tred Pay transaction.",
  },
  {
    title: "Entity Name",
    dataIndex: "entityName",
    copyable: true,
    ellipsis: true,
    width: 250,
    tooltip: "The name of the entity involved in the transaction.",
  },
  {
    title: "Entity ID",
    dataIndex: "entityId",
    copyable: true,
    ellipsis: true,
    tooltip: "The unique identifier for the entity.",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    // copyable: true,
    ellipsis: true,
    tooltip: "The amount involved in the transaction.",
  },
  {
    title: "Service Code",
    dataIndex: "serviceCode",
    // copyable: true,
    ellipsis: true,
    tooltip: "The code representing the service provided.",
  },
  {
    title: "Time Stamp",
    dataIndex: "timeStamp",
    // copyable: true,
    ellipsis: true,
    tooltip: "The timestamp of the transaction.",
  },
  {
    title: "Bank",
    dataIndex: "bank",
    // copyable: true,
    ellipsis: true,
    tooltip: "The bank involved in the transaction.",
  },
  {
    title: "Branch",
    dataIndex: "branch",
    // copyable: true,
    ellipsis: true,
    tooltip: "The branch of the bank involved in the transaction.",
  },
];

const initialData = [
  {
    id: 1,
    tredPayReference: "TRE5677364387",
    entityName: "MUSIITWA JOEL",
    entityId: "2000100121",
    amount: "UGX 10,000",
    serviceCode: "TUITION",
    timeStamp: "2024-01-01T12:00:00Z",
    bank: "DFCU",
    branch: "Kampala",
  },
  {
    id: 2,
    tredPayReference: "TRE7565274764",
    entityName: "MUTEESI MARTHA",
    entityId: "2000100543",
    amount: "UGX 5,000",
    serviceCode: "FUNCTIONAL",
    timeStamp: "2024-01-02T12:00:00Z",
    bank: "CENTENARY",
    branch: "Jinja",
  },
  {
    id: 3,
    tredPayReference: "TRE7565274765",
    entityName: "KABUYE JOHN",
    entityId: "2000100544",
    amount: "UGX 15,000",
    serviceCode: "LIBRARY",
    timeStamp: "2024-01-03T12:00:00Z",
    bank: "STANBIC",
    branch: "Entebbe",
  },
  {
    id: 4,
    tredPayReference: "TRE7565274766",
    entityName: "NABIRYE SUSAN",
    entityId: "2000100545",
    amount: "UGX 7,500",
    serviceCode: "HEALTH",
    timeStamp: "2024-01-04T12:00:00Z",
    bank: "DFCU",
    branch: "Mukono",
  },
  {
    id: 5,
    tredPayReference: "TRE7565274767",
    entityName: "SSENTONGO ROBERT",
    entityId: "2000100546",
    amount: "UGX 8,000",
    serviceCode: "ICT",
    timeStamp: "2024-01-05T12:00:00Z",
    bank: "ABSA",
    branch: "Wakiso",
  },
  {
    id: 6,
    tredPayReference: "TRE7565274768",
    entityName: "NANKYA MARY",
    entityId: "2000100547",
    amount: "UGX 10,000",
    serviceCode: "DEVELOPMENT",
    timeStamp: "2024-01-06T12:00:00Z",
    bank: "STANBIC",
    branch: "Kampala",
  },
  {
    id: 7,
    tredPayReference: "TRE7565274769",
    entityName: "KATUMBA DAVID",
    entityId: "2000100548",
    amount: "UGX 12,000",
    serviceCode: "TRANSPORT",
    timeStamp: "2024-01-07T12:00:00Z",
    bank: "EQUITY",
    branch: "Mbarara",
  },
  {
    id: 8,
    tredPayReference: "TRE7565274770",
    entityName: "NAMUTEBI JULIET",
    entityId: "2000100549",
    amount: "UGX 6,000",
    serviceCode: "EXAM",
    timeStamp: "2024-01-08T12:00:00Z",
    bank: "CENTENARY",
    branch: "Gulu",
  },
  {
    id: 9,
    tredPayReference: "TRE7565274771",
    entityName: "MUGISHA HENRY",
    entityId: "2000100550",
    amount: "UGX 9,000",
    serviceCode: "ACTIVITY",
    timeStamp: "2024-01-09T12:00:00Z",
    bank: "STANBIC",
    branch: "Jinja",
  },
  {
    id: 10,
    tredPayReference: "TRE7565274772",
    entityName: "NABUKEERA ANNE",
    entityId: "2000100551",
    amount: "UGX 11,000",
    serviceCode: "GRADUATION",
    timeStamp: "2024-01-10T12:00:00Z",
    bank: "DFCU",
    branch: "Masaka",
  },
  {
    id: 11,
    tredPayReference: "TRE7565274773",
    entityName: "KAZIBWE SAMUEL",
    entityId: "2000100552",
    amount: "UGX 14,000",
    serviceCode: "MEDICAL",
    timeStamp: "2024-01-11T12:00:00Z",
    bank: "ABSA",
    branch: "Lira",
  },
  {
    id: 12,
    tredPayReference: "TRE7565274774",
    entityName: "NAMANDE RITA",
    entityId: "2000100553",
    amount: "UGX 13,000",
    serviceCode: "SPORTS",
    timeStamp: "2024-01-12T12:00:00Z",
    bank: "EQUITY",
    branch: "Mbale",
  },
];

const RevenueTableComponent = () => {
  const actionRef = useRef();
  const [data, setData] = useState(initialData);

  return (
    <ConfigProvider locale={enUS}>
      <ProTable
        // size="small"
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          await waitTime(2000);

          // Directly return your initialData without fetching from an API
          return {
            data: initialData,
            success: true,
          };
        }}
        editable={{
          type: "multiple",
        }}
        columnsState={{
          persistenceKey: "pro-table-singe-demos",
          persistenceType: "localStorage",
          defaultValue: {
            option: { fixed: "right", disable: true },
          },
          onChange(value) {
            console.log("value: ", value);
          },
        }}
        rowKey="id"
        search={false} // Disable the top form
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          syncToUrl: (values, type) => {
            if (type === "get") {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 8,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle={
          <span>
            All Transactions for{" "}
            <strong style={{ color: "darkblue" }}>Nkumba University</strong>{" "}
            from&nbsp;
            <strong style={{ color: "red" }}>
              2022-01-01 to 2022-01-31
            </strong>{" "}
            amounting to{" "}
            <strong style={{ color: "green" }}>UGX 102,000,000</strong>
          </span>
        }
        dataSource={data} // Provide the initial data source here
      />
    </ConfigProvider>
  );
};

export default RevenueTableComponent;
