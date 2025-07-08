import React, { useRef, useEffect } from "react";
import { SmileOutlined } from "@ant-design/icons";
import {
  Timeline,
  Badge,
  Card,
  Radio,
  Descriptions,
  Row,
  Col,
  Button,
} from "antd";
import PerfectScrollbar from "perfect-scrollbar";

const RegistrationTrack = () => {
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
      });
    }

    return () => {
      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, []);
  return (
    <>
      <div
        style={{
          marginBottom: 10,
        }}
      >
        <Radio.Group
        //    value={activeBioDataTab}
        //    onChange={handleTabChange}
        >
          <Radio.Button value="academic_info">
            Add Missed Registration
          </Radio.Button>
          <Radio.Button value="personal_info">Move Back A Year</Radio.Button>
        </Radio.Group>
      </div>
      <div
        ref={scrollContainerRef}
        style={{
          position: "relative",
          height: "calc(100vh - 260px)", // Adjust this height as needed
          // marginTop: 10,
          // backgroundColor: "red",
          padding: 20,
          overflow: "hidden", // Hide default scrollbars
        }}
      >
        <Timeline
          // style={{
          //   paddingTop: 10,
          // }}
          items={[
            {
              color: "blue",
              children: (
                <Badge.Ribbon text="Fully Registered" color="blue">
                  <Card
                    title="Year 1, Semester 1 (2023/2024)"
                    size="small"
                    type="inner"
                  >
                    <Row gutter={16}>
                      <Col
                        xs={{
                          flex: "100%",
                        }}
                        sm={{
                          flex: "50%",
                        }}
                        md={{
                          flex: "40%",
                        }}
                        lg={{
                          flex: "20%",
                        }}
                        xl={{
                          flex: "75%",
                        }}
                      >
                        <Descriptions
                          className="custom-descriptions"
                          bordered
                          //   title="Custom Size"
                          size="small"
                          // extra={<Button type="primary">Edit</Button>}
                          items={[
                            {
                              key: "1",
                              label: "Registered By",
                              children: "SELF",
                              span: 2,
                            },
                            {
                              key: "3",
                              label: "Registration Date",
                              children: `MON 10 AUGUST 2024, 01:45 AM`,
                              span: 2,
                            },
                            {
                              key: "6",
                              label: "Provisional Expiry",
                              children: "",
                              span: 2,
                            },
                          ]}
                          style={
                            {
                              //   borderColor: "red",
                              //   backgroundColor: "yellow",
                            }
                          }
                          labelStyle={{
                            // fontWeight: "bold",
                            //   backgroundColor: "red",
                            width: 200,
                          }}
                          contentStyle={{
                            borderBottomColor: "red",
                            //   backgroundColor: "red",
                            textAlign: "left",
                          }}
                          column={2}
                        />
                      </Col>

                      <Col
                        xs={{
                          flex: "100%",
                        }}
                        sm={{
                          flex: "50%",
                        }}
                        md={{
                          flex: "40%",
                        }}
                        lg={{
                          flex: "20%",
                        }}
                        xl={{
                          flex: "25%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: 10,
                            marginBottom: 10,
                          }}
                        >
                          <Button
                            type="primary"
                            style={{
                              marginBottom: 10,
                              backgroundColor: "dodgerblue",
                            }}
                          >
                            Exam Permit
                          </Button>
                          <Button
                            type="primary"
                            style={{
                              marginBottom: 10,
                              backgroundColor: "dodgerblue",
                            }}

                            //   onClick={() => handleOpenPreview(application)}
                          >
                            View Registered Modules
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Badge.Ribbon>
              ),
            },
            {
              color: "red",
              children: (
                <Badge.Ribbon text="Not Registered" color="red">
                  <Card
                    title="Year 1, Semester 1 (2023/2024)"
                    size="small"
                    type="inner"
                  >
                    <Row gutter={16}>
                      <Col
                        xs={{
                          flex: "100%",
                        }}
                        sm={{
                          flex: "50%",
                        }}
                        md={{
                          flex: "40%",
                        }}
                        lg={{
                          flex: "20%",
                        }}
                        xl={{
                          flex: "75%",
                        }}
                      >
                        <Descriptions
                          className="custom-descriptions"
                          bordered
                          //   title="Custom Size"
                          size="small"
                          // extra={<Button type="primary">Edit</Button>}
                          items={[
                            {
                              key: "1",
                              label: "Registered By",
                              children: "SELF",
                              span: 2,
                            },
                            {
                              key: "3",
                              label: "Registration Date",
                              children: `MON 10 AUGUST 2024, 01:45 AM`,
                              span: 2,
                            },
                            {
                              key: "6",
                              label: "Provisional Expiry",
                              children: "",
                              span: 2,
                            },
                          ]}
                          style={
                            {
                              //   borderColor: "red",
                              //   backgroundColor: "yellow",
                            }
                          }
                          labelStyle={{
                            // fontWeight: "bold",
                            //   backgroundColor: "red",
                            width: 200,
                          }}
                          contentStyle={{
                            borderBottomColor: "red",
                            //   backgroundColor: "red",
                            textAlign: "left",
                          }}
                          column={2}
                        />
                      </Col>

                      <Col
                        xs={{
                          flex: "100%",
                        }}
                        sm={{
                          flex: "50%",
                        }}
                        md={{
                          flex: "40%",
                        }}
                        lg={{
                          flex: "20%",
                        }}
                        xl={{
                          flex: "25%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: 10,
                            marginBottom: 10,
                          }}
                        >
                          <Button
                            type="primary"
                            style={{
                              marginBottom: 10,
                              backgroundColor: "dodgerblue",
                            }}
                          >
                            Exam Permit
                          </Button>
                          <Button
                            type="primary"
                            style={{
                              marginBottom: 10,
                              backgroundColor: "dodgerblue",
                            }}

                            //   onClick={() => handleOpenPreview(application)}
                          >
                            View Registered Modules
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Badge.Ribbon>
              ),
            },
            {
              color: "green",
              children: (
                <Badge.Ribbon text="Provisionally Registered" color="green">
                  <Card
                    title="Year 1, Semester 1 (2023/2024)"
                    size="small"
                    type="inner"
                  >
                    <Row gutter={16}>
                      <Col
                        xs={{
                          flex: "100%",
                        }}
                        sm={{
                          flex: "50%",
                        }}
                        md={{
                          flex: "40%",
                        }}
                        lg={{
                          flex: "20%",
                        }}
                        xl={{
                          flex: "75%",
                        }}
                      >
                        <Descriptions
                          className="custom-descriptions"
                          bordered
                          //   title="Custom Size"
                          size="small"
                          // extra={<Button type="primary">Edit</Button>}
                          items={[
                            {
                              key: "1",
                              label: "Registered By",
                              children: "SELF",
                              span: 2,
                            },
                            {
                              key: "3",
                              label: "Registration Date",
                              children: `MON 10 AUGUST 2024, 01:45 AM`,
                              span: 2,
                            },
                            {
                              key: "6",
                              label: "Provisional Expiry",
                              children: "",
                              span: 2,
                            },
                          ]}
                          style={
                            {
                              //   borderColor: "red",
                              //   backgroundColor: "yellow",
                            }
                          }
                          labelStyle={{
                            // fontWeight: "bold",
                            //   backgroundColor: "red",
                            width: 200,
                          }}
                          contentStyle={{
                            borderBottomColor: "red",
                            //   backgroundColor: "red",
                            textAlign: "left",
                          }}
                          column={2}
                        />
                      </Col>

                      <Col
                        xs={{
                          flex: "100%",
                        }}
                        sm={{
                          flex: "50%",
                        }}
                        md={{
                          flex: "40%",
                        }}
                        lg={{
                          flex: "20%",
                        }}
                        xl={{
                          flex: "25%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: 10,
                            marginBottom: 10,
                          }}
                        >
                          <Button
                            type="primary"
                            style={{
                              marginBottom: 10,
                              backgroundColor: "dodgerblue",
                            }}
                          >
                            Exam Permit
                          </Button>
                          <Button
                            type="primary"
                            style={{
                              marginBottom: 10,
                              backgroundColor: "dodgerblue",
                            }}

                            //   onClick={() => handleOpenPreview(application)}
                          >
                            View Registered Modules
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Badge.Ribbon>
              ),
            },

            {
              color: "#00CCFF",
              dot: <SmileOutlined />,
              children: (
                <Badge.Ribbon text="Fully Registered" color="blue">
                  <Card
                    title="Year 1, Semester 1 (2023/2024)"
                    size="small"
                    type="inner"
                  >
                    <Row gutter={16}>
                      <Col
                        xs={{
                          flex: "100%",
                        }}
                        sm={{
                          flex: "50%",
                        }}
                        md={{
                          flex: "40%",
                        }}
                        lg={{
                          flex: "20%",
                        }}
                        xl={{
                          flex: "75%",
                        }}
                      >
                        <Descriptions
                          className="custom-descriptions"
                          bordered
                          //   title="Custom Size"
                          size="small"
                          // extra={<Button type="primary">Edit</Button>}
                          items={[
                            {
                              key: "1",
                              label: "Registered By",
                              children: "SELF",
                              span: 2,
                            },
                            {
                              key: "3",
                              label: "Registration Date",
                              children: `MON 10 AUGUST 2024, 01:45 AM`,
                              span: 2,
                            },
                            {
                              key: "6",
                              label: "Provisional Expiry",
                              children: "",
                              span: 2,
                            },
                          ]}
                          style={
                            {
                              //   borderColor: "red",
                              //   backgroundColor: "yellow",
                            }
                          }
                          labelStyle={{
                            // fontWeight: "bold",
                            //   backgroundColor: "red",
                            width: 200,
                          }}
                          contentStyle={{
                            borderBottomColor: "red",
                            //   backgroundColor: "red",
                            textAlign: "left",
                          }}
                          column={2}
                        />
                      </Col>

                      <Col
                        xs={{
                          flex: "100%",
                        }}
                        sm={{
                          flex: "50%",
                        }}
                        md={{
                          flex: "40%",
                        }}
                        lg={{
                          flex: "20%",
                        }}
                        xl={{
                          flex: "25%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: 10,
                            marginBottom: 10,
                          }}
                        >
                          <Button
                            type="primary"
                            style={{
                              marginBottom: 10,
                              backgroundColor: "dodgerblue",
                            }}
                          >
                            Exam Permit
                          </Button>
                          <Button
                            type="primary"
                            style={{
                              marginBottom: 10,
                              backgroundColor: "dodgerblue",
                            }}

                            //   onClick={() => handleOpenPreview(application)}
                          >
                            View Registered Modules
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Badge.Ribbon>
              ),
            },
          ]}
        />
      </div>
    </>
  );
};

export default RegistrationTrack;
