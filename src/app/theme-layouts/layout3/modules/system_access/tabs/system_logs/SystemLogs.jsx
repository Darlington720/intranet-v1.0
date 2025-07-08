import React, { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import {
  Layout,
  Typography,
  Input,
  Select,
  Badge,
  List,
  Avatar,
  Tooltip,
  Space,
  Table,
  Button,
  Radio,
  ConfigProvider,
  theme,
  Spin,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useLazyQuery, useQuery } from "@apollo/client";
import { LOAD_SYSTEM_USERS, LOAD_USER_ACTION_LOGS } from "../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { url2 } from "app/configs/apiConfig";
import {
  selectSelectedSystemUser,
  selectUserActionLogs,
  setSelectedSystemUser,
  setUserActionLogs,
} from "../../store/systemAccessSlice";

const { Search } = Input;
const { Sider, Content } = Layout;
const { Text } = Typography;
dayjs.extend(relativeTime);

// Mock data for system logs
const mockLogs = [
  {
    id: 1,
    userId: "user123",
    username: "John Doe",
    action: "LOGIN",
    module: "Admissions",
    details: "Successful login to admissions portal",
    timestamp: new Date("2024-01-10T08:30:00"),
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: 2,
    userId: "user456",
    username: "Jane Smith",
    action: "UPDATE_RECORD",
    module: "Photo Booth",
    details: "Updated student photo ID",
    timestamp: new Date("2024-01-10T09:15:00"),
    ipAddress: "192.168.1.101",
    status: "success",
  },
  {
    id: 3,
    userId: "user789",
    username: "Bob Wilson",
    action: "CREATE_RECORD",
    module: "Registration",
    details: "Created new student registration",
    timestamp: new Date("2024-01-10T10:00:00"),
    ipAddress: "192.168.1.102",
    status: "success",
  },
  {
    id: 4,
    userId: "user123",
    username: "John Doe",
    action: "DELETE_RECORD",
    module: "Admissions",
    details: "Deleted duplicate application",
    timestamp: new Date("2024-01-10T11:30:00"),
    ipAddress: "192.168.1.100",
    status: "error",
  },
];

function SystemLogs() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const selectedUser = useSelector(selectSelectedSystemUser);
  const [viewMode, setViewMode] = useState("list");
  const logs = useSelector(selectUserActionLogs);
  const { loading, error, data } = useQuery(LOAD_SYSTEM_USERS);
  const [loadUserActionLogs, { error: loadErr, loading: loadingActionLogs }] =
    useLazyQuery(LOAD_USER_ACTION_LOGS, {
      fetchPolicy: "no-cache",
    });

  useEffect(() => {
    if (error) {
      dispatch({
        message: error.message,
        variant: "error",
      });
    }

    if (loadErr) {
      dispatch({
        message: loadErr.message,
        variant: "error",
      });
    }
  }, [error, loadErr]);

  // Group logs by user
  const userLogs = useMemo(() => {
    return mockLogs.reduce((acc, log) => {
      if (!acc[log.userId]) {
        acc[log.userId] = {
          userId: log.userId,
          username: log.username,
          logs: [],
          successCount: 0,
          errorCount: 0,
        };
      }
      acc[log.userId].logs.push(log);
      if (log.status === "success") acc[log.userId].successCount++;
      else acc[log.userId].errorCount++;
      return acc;
    }, {});
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction =
        actionFilter === "ALL" || log.action === actionFilter;
      const matchesStatus =
        statusFilter === "ALL" || log.status === statusFilter;
      const matchesModule =
        moduleFilter === "ALL" || log.module === moduleFilter;

      return matchesAction && matchesStatus && matchesModule;
    });
  }, [logs, searchTerm, actionFilter, statusFilter, selectedUser]);

  //   console.log("data", data)
  //   console.log("Object.values(userLogs)", Object.values(userLogs))

  return (
    <Layout style={{ minHeight: "100%", background: "#fff" }}>
      <Sider
        width={300}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          padding: "16px",
        }}
      >
        <Typography.Title level={4} style={{ marginBottom: "16px" }}>
          Users
        </Typography.Title>
        <Search
          placeholder="Search users"
          style={{ marginBottom: "16px" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Spin spinning={loading} tip="Loading System Users...">
          <List
            dataSource={data?.system_users || []}
            renderItem={(user) => {
              const isSelected = user.user_id === selectedUser?.user_id;
              const formattedTime = dayjs(user.lastActive).format(
                "ddd, MMM D • hh:mm A"
              ); // e.g., "Thu, Aug 8 • 10:00 PM"
              const relative = dayjs(user.last_activity).fromNow(); // e.g., "2 hours ago"

              return (
                <List.Item
                  onClick={async () => {
                    console.log("user", user);
                    dispatch(setSelectedSystemUser(user));
                    // setSelectedUser(isSelected ? null : user.user_id)
                    const res = await loadUserActionLogs({
                      variables: {
                        userId: user.user_id,
                      },
                    });

                    // console.log("res", res.data);
                    dispatch(setUserActionLogs(res.data.user_action_logs));
                    //
                  }}
                  style={{
                    cursor: "pointer",
                    background: isSelected ? "#f0f0f0" : "transparent",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        // className="flex-0 w-60 h-60"
                        src={`${url2}/staff_photo/${user?.staff_id}`}
                        icon={<UserOutlined />}
                        style={{
                          width: 45,
                          height: 45,
                        }}
                      />
                    }
                    title={
                      <Space direction="vertical" size={0}>
                        <Typography.Text strong>{user.name}</Typography.Text>
                        <Typography.Text
                          type="secondary"
                          style={{ fontSize: 12 }}
                        >
                          Last active: {relative}
                        </Typography.Text>
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Spin>
      </Sider>

      <Content style={{ padding: "24px", minHeight: 280 }}>
        <Space
          style={{
            marginBottom: "16px",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Space size="middle">
            <Typography.Title level={4} style={{ margin: 0 }}>
              {selectedUser ? selectedUser.name + "'s" : "All"} Activity Logs
            </Typography.Title>

            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <Radio.Button value="list">
                <BarsOutlined /> List
              </Radio.Button>
              <Radio.Button value="table">
                <AppstoreOutlined /> Table
              </Radio.Button>
            </Radio.Group>
          </Space>

          <Space>
            <Select
              style={{ width: 120 }}
              value={moduleFilter}
              onChange={setModuleFilter}
              placeholder="Module"
            >
              <Select.Option value="ALL">All Modules</Select.Option>
              <Select.Option value="Admissions">Admissions</Select.Option>
              <Select.Option value="Photo Booth">Photo Booth</Select.Option>
              <Select.Option value="Registration">Registration</Select.Option>
            </Select>

            <Select
              style={{ width: 120 }}
              value={actionFilter}
              onChange={setActionFilter}
              placeholder="Action"
            >
              <Select.Option value="ALL">All Actions</Select.Option>
              <Select.Option value="LOGIN">Login</Select.Option>
              <Select.Option value="CREATE_RECORD">Create</Select.Option>
              <Select.Option value="UPDATE_RECORD">Update</Select.Option>
              <Select.Option value="DELETE_RECORD">Delete</Select.Option>
            </Select>

            <Select
              style={{ width: 120 }}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Status"
            >
              <Select.Option value="ALL">All Status</Select.Option>
              <Select.Option value="success">Success</Select.Option>
              <Select.Option value="error">Error</Select.Option>
            </Select>
          </Space>
        </Space>

        <div
          style={{
            height: "calc(100vh - 200px)",
            overflow: "auto",
          }}
        >
          <Spin spinning={loadingActionLogs} tip="Loading user logs...">
            {viewMode === "list" ? (
              <List
                dataSource={filteredLogs}
                renderItem={(log) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Badge
                          status={
                            log.status === "success" ? "success" : "error"
                          }
                          offset={[0, 0]}
                        >
                          {/* <Avatar icon={<UserOutlined />} /> */}
                          <Avatar
                            // className="flex-0 w-60 h-60"
                            src={`${url2}/staff_photo/${selectedUser?.staff_id}`}
                            icon={<UserOutlined />}
                            style={{
                              width: 45,
                              height: 45,
                            }}
                          />
                        </Badge>
                      }
                      title={
                        <Space>
                          <Text strong>{log.action_type}</Text>
                          <Badge color="blue" text={log.module} />
                          <Text type="secondary">
                            {format(log.timestamp, "PPpp")}
                          </Text>
                        </Space>
                      }
                      description={
                        <Space direction="vertical">
                          <Text>{log.description}</Text>
                          <Space>
                            <Tooltip title="IP Address">
                              <Space>
                                <GlobalOutlined />
                                <Text type="secondary">{log.ip_address}</Text>
                              </Space>
                            </Tooltip>
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <ConfigProvider
                theme={{
                  components: {
                    Table: {
                      // headerBg: "rgba(0, 0, 0, 0.04)",
                      borderColor: "lightgray",
                      borderRadius: 0,
                      headerBorderRadius: 0,
                    },
                  },
                }}
              >
                <Table
                  dataSource={filteredLogs}
                  columns={[
                    {
                      title: "User",
                      dataIndex: "name",
                      key: "name",
                      ellipsis: true,
                    },
                    {
                      title: "Module",
                      dataIndex: "module",
                      key: "module",
                      ellipsis: true,
                      render: (text) => <Badge color="blue" text={text} />,
                    },
                    {
                      title: "Action",
                      dataIndex: "action_type",
                      key: "action_type",
                      ellipsis: true,
                    },
                    {
                      title: "Details",
                      dataIndex: "description",
                      key: "description",
                      ellipsis: true,
                    },
                    {
                      title: "Status",
                      dataIndex: "status",
                      key: "status",
                      render: (status) => (
                        <Badge
                          status={status === "success" ? "success" : "error"}
                          text={"success"}
                        />
                      ),
                    },
                    {
                      title: "Timestamp",
                      dataIndex: "timestamp",
                      key: "timestamp",
                      render: (date) => format(date, "PPpp"),
                      ellipsis: true,
                    },
                    {
                      title: "IP Address",
                      dataIndex: "ip_address",
                      key: "ip_address",
                    },
                  ]}
                  pagination={{ pageSize: 10 }}
                  size="small"
                />
              </ConfigProvider>
            )}
          </Spin>
        </div>
      </Content>
    </Layout>
  );
}

export default SystemLogs;
