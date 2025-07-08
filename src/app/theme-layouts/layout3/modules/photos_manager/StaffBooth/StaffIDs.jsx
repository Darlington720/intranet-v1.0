"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  Typography,
  Table,
  Button,
  message,
  Upload,
  Space,
  Modal,
  Input,
  Form,
  Spin,
  Select,
  Tabs,
  Tag,
  Tooltip,
  Divider,
  Row,
  Col,
  Statistic,
  QRCode,
} from "antd";
import { Box, Paper, styled } from "@mui/material";
import {
  PrinterOutlined,
  UploadOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  SearchOutlined,
  EyeOutlined,
  FilterOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import moment from "moment";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Sample student data
const sampleStudents = [
  {
    id: 1,
    name: "MUSIITWA JOEL",
    studentNo: "2000100121",
    school: "SBA",
    programme: "BCS",
    issueDate: "2-2021",
    expiryDate: "12-2024",
    photo:
      "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
    registrarSignature: "/public/images/sign.png",
    academicYear: "2020/2021",
    semester: "1",
    cardIssued: false,
    issueTimestamp: null,
  },
  {
    id: 2,
    name: "NAKATO SARAH",
    studentNo: "2000100342",
    school: "FASS",
    programme: "BA",
    issueDate: "2-2021",
    expiryDate: "12-2024",
    photo:
      "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100342",
    registrarSignature: "/public/images/sign.png",
    academicYear: "2020/2021",
    semester: "2",
    cardIssued: false,
    issueTimestamp: null,
  },
  {
    id: 3,
    name: "OKELLO DAVID",
    studentNo: "2000100789",
    school: "SCI",
    programme: "BSc",
    issueDate: "2-2021",
    expiryDate: "12-2024",
    photo:
      "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100789",
    registrarSignature: "/public/images/sign.png",
    academicYear: "2021/2022",
    semester: "1",
    cardIssued: false,
    issueTimestamp: null,
  },
  {
    id: 4,
    name: "NAMUKASA JANE",
    studentNo: "2000100456",
    school: "SBA",
    programme: "BBA",
    issueDate: "2-2021",
    expiryDate: "12-2024",
    photo:
      "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100456",
    registrarSignature: "/public/images/sign.png",
    academicYear: "2021/2022",
    semester: "2",
    cardIssued: false,
    issueTimestamp: null,
  },
  {
    id: 5,
    name: "LUBEGA TASHA",
    studentNo: "2000100539",
    school: "SCI",
    programme: "BCS",
    issueDate: "2-2021",
    expiryDate: "12-2024",
    photo:
      "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100539",
    registrarSignature: "/public/images/sign.png",
    academicYear: "2020/2021",
    semester: "1",
    cardIssued: false,
    issueTimestamp: null,
  },
];

// Styled components for the ID card - KEEPING ORIGINAL DESIGN
const IdCard = styled(Paper)(({ theme }) => ({
  width: "500px",
  height: "310px",
  padding: "0",
  borderRadius: "10px",
  //background: "#f5f2e9", //Cream/beige background matching the image
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  position: "relative",
  overflow: "hidden",
  margin: "0 auto",
  fontFamily: "Arial, sans-serif",
}));

const CardHeader = styled(Box)(({ theme }) => ({
  padding: "10px 16px 8px",
  display: "flex",
  alignItems: "center",
}));

const Logo = styled("img")({
  width: "60px",
  height: "60px",
  marginRight: "12px",
});

const Banner = styled(Box)({
  background: "#1a237e", // Dark blue banner
  color: "#FFD700", // Yellow text
  padding: "0px 14px",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "18px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  borderTop: "1px solid #000",
  borderBottom: "1px solid #000",
});

const CardContent = styled(Box)(({ theme }) => ({
  padding: "0px 16px",
}));

const InfoRow = styled(Box)({
  display: "flex",
  marginBottom: "0",
  justifyContent: "space-between",
  width: "75%", // Adjust the width of the border line to 70%
  borderBottom: "1px solid #000",
  paddingBottom: "4px",
  paddingTop: "4px",
});

const InfoLabel = styled(Box)({
  width: "180px",
  fontWeight: "bold",
  color: "#333",
  fontSize: "14px",
});

const InfoValue = styled(Box)({
  flex: 1,
  fontSize: "16px",
  fontWeight: "bold",
});

const PhotoContainer = styled(Box)({
  position: "absolute",
  top: "130px", // Changed from 110px to 90px to move it higher
  right: "16px",
  width: "120px",
  height: "150px",
  overflow: "hidden",
});

const Photo = styled("img")({
  width: "100%",
  height: "50%",
  objectFit: "contain",
});

const Signature = styled("img")({
  maxWidth: "150px",
  height: "30px",
  objectFit: "contain",
});

const Footer = styled(Box)({
  position: "absolute",
  bottom: "0px", // Changed from 8px to 2px to move it to the extreme bottom
  left: "16px",
  fontSize: "10px",
  color: "white",
  fontStyle: "italic",
  zIndex: 10, // Added to ensure it appears above the bottom strip
});

const QRCodeContainer = styled(Box)({
  position: "absolute",
  bottom: "11px", // Position it above the bottom strip
  right: "16px",
  width: "90px",
  height: "90px",
  overflow: "hidden",
});

const BottomStrip = styled(Box)({
  position: "absolute",
  bottom: "0",
  left: "0",
  right: "0",
  height: "34px",
  backgroundColor: "#1a237e", // Dark blue matching the top banner
});

const IssueDateContainer = styled(Box)({
  position: "absolute",
  bottom: "5px",
  left: "220px",
  color: "white",
  fontSize: "14px",
  height: "29px",
  fontWeight: "bold",
});

// Dashboard card styled component
const DashboardCard = styled(Card)({
  height: "100%",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
  borderRadius: "8px",
  "& .ant-card-head": {
    borderBottom: "1px solid #f0f0f0",
    padding: "0 16px",
  },
  "& .ant-card-body": {
    padding: "16px",
  },
});

// Main component
const NkumbaUniversityIDCard = () => {
  const [students, setStudents] = useState(sampleStudents);
  const [filteredStudents, setFilteredStudents] = useState(sampleStudents);
  const [currentStudent, setCurrentStudent] = useState(sampleStudents[0]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: sampleStudents.length,
  });
  const [activeTab, setActiveTab] = useState("1");
  const [registrarSignature, setRegistrarSignature] = useState(null);
  const [filters, setFilters] = useState({
    academicYear: [],
    semester: [],
    cardIssued: null,
  });
  const [filterVisible, setFilterVisible] = useState(false);

  // Add these new state variables for image data URLs
  const [photoDataURL, setPhotoDataURL] = useState(null);
  const [signatureDataURL, setSignatureDataURL] = useState(null);
  const [logoDataURL, setLogoDataURL] = useState(null);

  const cardRef = useRef(null);

  // Add this function to convert remote images to data URLs
  const convertImageToDataURL = (url, callback) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      callback(dataURL);
    };
    img.onerror = () => {
      console.error(`Failed to load image from ${url}`);
      // Create a simple placeholder image
      const canvas = document.createElement("canvas");
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, 150, 150);
      ctx.fillStyle = "#999999";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Image Not Available", 75, 75);
      const dataURL = canvas.toDataURL("image/png");
      callback(dataURL);
    };
    img.src = url;
  };

  // Add this effect to preload and convert images when current student changes
  useEffect(() => {
    if (currentStudent) {
      // Convert student photo to data URL
      if (currentStudent.photo) {
        convertImageToDataURL(currentStudent.photo, (dataURL) => {
          setPhotoDataURL(dataURL);
        });
      } else {
        // Create a placeholder for missing photo
        const canvas = document.createElement("canvas");
        canvas.width = 120;
        canvas.height = 150;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, 120, 150);
        ctx.fillStyle = "#999999";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText("No Photo", 60, 75);
        setPhotoDataURL(canvas.toDataURL("image/png"));
      }

      // Convert signature to data URL
      const signatureUrl = registrarSignature || "/public/images/sign.png";
      convertImageToDataURL(signatureUrl, (dataURL) => {
        setSignatureDataURL(dataURL);
      });

      // Convert logo to data URL
      convertImageToDataURL("/public/images/nkumb.png", (dataURL) => {
        setLogoDataURL(dataURL);
      });
    }
  }, [currentStudent, registrarSignature]);

  useEffect(() => {
    if (students.length > 0 && !currentStudent) {
      setCurrentStudent(students[0]);
    }
  }, [students, currentStudent]);

  useEffect(() => {
    let filtered = [...students];

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchText.toLowerCase()) ||
          student.studentNo.includes(searchText)
      );
    }

    // Apply academic year filter
    if (filters.academicYear.length > 0) {
      filtered = filtered.filter((student) =>
        filters.academicYear.includes(student.academicYear)
      );
    }

    // Apply semester filter
    if (filters.semester.length > 0) {
      filtered = filtered.filter((student) =>
        filters.semester.includes(student.semester)
      );
    }

    // Apply card issued filter
    if (filters.cardIssued !== null) {
      filtered = filtered.filter(
        (student) => student.cardIssued === filters.cardIssued
      );
    }

    setFilteredStudents(filtered);
    setPagination((prev) => ({
      ...prev,
      total: filtered.length,
      current: 1,
    }));
  }, [searchText, students, filters]);

  // Get unique academic years
  const getAcademicYears = () => {
    const years = [...new Set(students.map((student) => student.academicYear))];
    return years.map((year) => ({ text: year, value: year }));
  };

  // Get unique semesters
  const getSemesters = () => {
    const semesters = [...new Set(students.map((student) => student.semester))];
    return semesters.map((semester) => ({
      text: `Semester ${semester}`,
      value: semester,
    }));
  };

  // Generate QR code data
  const getQRCodeData = (student) => {
    if (!student) return "";
    return JSON.stringify({
      name: student.name,
      studentNo: student.studentNo,
      school: student.school,
      programme: student.programme,
    });
  };

  // Handle file upload for student data
  const handleFileUpload = (file) => {
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Transform data to match our structure
        const transformedData = jsonData.map((item, index) => ({
          id: index + 1,
          name: item.name || "",
          studentNo: item.studentNo || item.student_no || item.id || "",
          school: item.school || "",
          programme: item.programme || item.program || "",
          issueDate: item.issueDate || item.issue_date || "2-2021",
          expiryDate: item.expiryDate || item.expiry_date || "12-2024",
          photo: null,
          registrarSignature: item.signature,
          academicYear: item.academicYear || item.academic_year || "2021/2022",
          semester: item.semester || "1",
          cardIssued: item.cardIssued || item.card_issued || false,
          issueTimestamp: item.issueTimestamp || item.issue_timestamp || null,
        }));

        setStudents(transformedData);
        setFilteredStudents(transformedData);
        setPagination((prev) => ({
          ...prev,
          total: transformedData.length,
          current: 1,
        }));

        message.success(
          `Successfully loaded ${transformedData.length} students`
        );
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        message.error("Failed to parse Excel file. Please check the format.");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      message.error("Failed to read file");
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
    return false;
  };

  // Handle registrar signature upload
  const handleSignatureUpload = (info) => {
    if (info.file.status !== "uploading") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRegistrarSignature(e.target.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  // Generate PDF for a single student - FIXED VERSION
  const generatePDF = async (student) => {
    if (!student) {
      message.error("No student selected");
      return;
    }

    setCurrentStudent(student);
    setLoading(true);

    // Wait for the state to update and render
    setTimeout(async () => {
      try {
        if (!cardRef.current) {
          message.error("Card reference not found");
          setLoading(false);
          return;
        }

        // Replace image sources with data URLs before capturing
        const photoElements =
          cardRef.current.querySelectorAll(".student-photo");
        const signatureElements = cardRef.current.querySelectorAll(
          ".registrar-signature"
        );
        const logoElements =
          cardRef.current.querySelectorAll(".university-logo");

        // Store original sources to restore later
        const originalSources = {
          photos: Array.from(photoElements).map((img) => img.src),
          signatures: Array.from(signatureElements).map((img) => img.src),
          logos: Array.from(logoElements).map((img) => img.src),
        };

        // Replace with data URLs
        photoElements.forEach((img) => {
          if (photoDataURL) img.src = photoDataURL;
        });

        signatureElements.forEach((img) => {
          if (signatureDataURL) img.src = signatureDataURL;
        });

        logoElements.forEach((img) => {
          if (logoDataURL) img.src = logoDataURL;
        });

        // Wait a bit for the DOM to update with the data URLs
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Capture the card with improved settings
        const canvas = await html2canvas(cardRef.current, {
          scale: 3, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          logging: true, // Enable logging for debugging
          backgroundColor: "#ffffff", // Ensure white background
        });

        // Restore original sources
        photoElements.forEach((img, i) => {
          if (originalSources.photos[i]) img.src = originalSources.photos[i];
        });

        signatureElements.forEach((img, i) => {
          if (originalSources.signatures[i])
            img.src = originalSources.signatures[i];
        });

        logoElements.forEach((img, i) => {
          if (originalSources.logos[i]) img.src = originalSources.logos[i];
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        // Create PDF with proper dimensions
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [86, 54], // Standard ID card size
        });

        // Add the image to the PDF
        pdf.addImage(imgData, "JPEG", 0, 0, 86, 54);
        pdf.save(`${student.name.replace(/\s+/g, "_")}_ID_Card.pdf`);

        // Update student record to mark card as issued
        const updatedStudents = students.map((s) => {
          if (s.id === student.id) {
            return {
              ...s,
              cardIssued: true,
              issueTimestamp: moment().format("YYYY-MM-DD"),
            };
          }
          return s;
        });

        setStudents(updatedStudents);
        message.success("ID Card PDF generated successfully!");
      } catch (error) {
        console.error("Error generating PDF:", error);
        message.error(`Failed to generate PDF: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }, 1000); // Increased timeout to ensure rendering is complete
  };

  // Generate PDF for all students - FIXED VERSION
  const generateAllPDFs = async () => {
    if (filteredStudents.length === 0) {
      message.error("No students to generate PDFs for");
      return;
    }

    setLoading(true);
    message.info("Starting batch PDF generation. This may take a moment...");

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [86, 54],
      });

      const updatedStudents = [...students];

      // Process one student at a time
      for (let i = 0; i < filteredStudents.length; i++) {
        const student = filteredStudents[i];

        // Update progress message
        message.info(
          `Processing card ${i + 1}/${filteredStudents.length}...`,
          1
        );

        // Set current student and wait for state update
        setCurrentStudent(student);

        // Wait for state update and image loading
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Preload the student's photo
        if (student.photo) {
          await new Promise((resolve) => {
            convertImageToDataURL(student.photo, (dataURL) => {
              setPhotoDataURL(dataURL);
              resolve();
            });
          });
        }

        // Wait for the DOM to update with new student data
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!cardRef.current) {
          console.error("Card reference not found");
          continue;
        }

        try {
          // Create a clone of the card to avoid modifying the original DOM
          const cardClone = cardRef.current.cloneNode(true);
          document.body.appendChild(cardClone);

          // Replace all image sources in the clone with data URLs
          const photoElements = cardClone.querySelectorAll(".student-photo");
          const signatureElements = cardClone.querySelectorAll(
            ".registrar-signature"
          );
          const logoElements = cardClone.querySelectorAll(".university-logo");

          photoElements.forEach((img) => {
            if (photoDataURL) img.src = photoDataURL;
          });

          signatureElements.forEach((img) => {
            if (signatureDataURL) img.src = signatureDataURL;
          });

          logoElements.forEach((img) => {
            if (logoDataURL) img.src = logoDataURL;
          });

          // Wait for the clone's images to load
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Capture the cloned card
          const canvas = await html2canvas(cardClone, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            logging: true,
            onclone: (clonedDoc) => {
              console.log("Cloning document for student:", student.name);
            },
          });

          // Remove the clone from the DOM
          document.body.removeChild(cardClone);

          const imgData = canvas.toDataURL("image/jpeg", 1.0);

          // Add a new page for each card after the first one
          if (i > 0) {
            pdf.addPage([86, 54], "landscape");
          }

          // Add the image to the PDF
          pdf.addImage(imgData, "JPEG", 0, 0, 86, 54);

          // Update student record to mark card as issued
          const index = updatedStudents.findIndex((s) => s.id === student.id);
          if (index !== -1) {
            updatedStudents[index] = {
              ...updatedStudents[index],
              cardIssued: true,
              issueTimestamp: moment().format("YYYY-MM-DD"),
            };
          }
        } catch (error) {
          console.error(`Error processing card for ${student.name}:`, error);
          message.warning(`Skipped card for ${student.name} due to an error`);
        }
      }

      // Update all students with their new issued status
      setStudents(updatedStudents);

      // Save the PDF
      pdf.save("Nkumba_University_ID_Cards.pdf");
      message.success(
        `${filteredStudents.length} ID Cards generated successfully!`
      );
    } catch (error) {
      console.error("Error generating batch PDFs:", error);
      message.error(`Failed to generate batch PDFs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Preview a student's ID card
  const previewStudent = (student) => {
    setCurrentStudent(student);
    setPreviewVisible(true);
  };

  // Mark a student's card as issued/not issued
  const toggleCardIssued = (student) => {
    const updatedStudents = students.map((s) => {
      if (s.id === student.id) {
        return {
          ...s,
          cardIssued: !s.cardIssued,
          issueTimestamp: !s.cardIssued ? moment().format("YYYY-MM-DD") : null,
        };
      }
      return s;
    });

    setStudents(updatedStudents);
    message.success(`Card status updated for ${student.name}`);
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Student No",
      dataIndex: "studentNo",
      key: "studentNo",
      sorter: (a, b) => a.studentNo.localeCompare(b.studentNo),
    },
    {
      title: "School",
      dataIndex: "school",
      key: "school",
      sorter: (a, b) => a.school.localeCompare(b.school),
    },
    {
      title: "Programme",
      dataIndex: "programme",
      key: "programme",
      sorter: (a, b) => a.programme.localeCompare(b.programme),
    },
    {
      title: "Academic Year",
      dataIndex: "academicYear",
      key: "academicYear",
      sorter: (a, b) => a.academicYear.localeCompare(b.academicYear),
      filters: getAcademicYears(),
      onFilter: (value, record) => record.academicYear === value,
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      render: (text) => `Semester ${text}`,
      sorter: (a, b) => a.semester.localeCompare(b.semester),
      filters: getSemesters(),
      onFilter: (value, record) => record.semester === value,
    },
    {
      title: "Card Status",
      dataIndex: "cardIssued",
      key: "cardIssued",
      render: (issued, record) => (
        <Tag
          color={issued ? "success" : "error"}
          style={{ cursor: "pointer" }}
          onClick={() => toggleCardIssued(record)}
        >
          {issued ? "Issued" : "Not Issued"}
        </Tag>
      ),
      filters: [
        { text: "Issued", value: true },
        { text: "Not Issued", value: false },
      ],
      onFilter: (value, record) => record.cardIssued === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Preview ID Card">
            <Button
              icon={<EyeOutlined />}
              onClick={() => previewStudent(record)}
              type="primary"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Generate PDF">
            <Button
              icon={<DownloadOutlined />}
              onClick={() => generatePDF(record)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Download sample Excel template
  const downloadTemplate = () => {
    const template = [
      {
        name: "Student Name",
        studentNo: "Student Number",
        school: "School Code",
        programme: "Programme Code",
        issueDate: "Issue Date (MM-YYYY)",
        expiryDate: "Expiry Date (MM-YYYY)",
        academicYear: "Academic Year (YYYY/YYYY)",
        semester: "Semester (1 or 2)",
        cardIssued: "Card Issued (TRUE/FALSE)",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "student_template.xlsx");
  };

  // Handle pagination change
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      academicYear: [],
      semester: [],
      cardIssued: null,
    });
    setSearchText("");
    setFilterVisible(false);
  };

  // Apply filters
  const applyFilters = (values) => {
    setFilters(values);
    setFilterVisible(false);
  };

  // Get statistics
  const getStatistics = () => {
    const total = students.length;
    const issued = students.filter((s) => s.cardIssued).length;
    const notIssued = total - issued;

    return { total, issued, notIssued };
  };

  const stats = getStatistics();

  // Render the ID card
  const renderIDCard = (student) => {
    if (!student) return null;

    return (
      <IdCard ref={cardRef} id="card-to-export">
        <CardHeader>
          <Logo
            className="university-logo"
            src="/public/images/nkumb.png"
            alt="Nkumba Logo"
            // crossOrigin="anonymous"
          />
          <Box>
            <Typography
              style={{
                color: "#1a237e",
                fontWeight: "bold",
                marginBottom: "0",
                fontSize: "20px",
              }}
            >
              Nkumba University
            </Typography>
            <Typography
              variant="body2"
              style={{ color: "#333", fontSize: "12px" }}
            >
              P.O. Box 237, Entebbe, Uganda • Tel: 0414 374 992
            </Typography>
          </Box>
        </CardHeader>

        <Banner>Student Identification Card</Banner>

        <CardContent>
          <InfoRow>
            <InfoLabel>Name:</InfoLabel>
            <InfoValue>{student.name}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Student No:</InfoLabel>
            <InfoValue>{student.studentNo}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>School:</InfoLabel>
            <InfoValue>{student.school}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Programme:</InfoLabel>
            <InfoValue>{student.programme}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Academic Registrar's Signature:</InfoLabel>
            <InfoValue>
              {registrarSignature ? (
                <Signature
                  className="registrar-signature"
                  src={registrarSignature}
                  alt="Registrar's Signature"
                  // crossOrigin="anonymous"
                />
              ) : (
                <Text italic>{student.signature}</Text>
              )}
            </InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Holder's Signature:</InfoLabel>
            <InfoValue></InfoValue>
          </InfoRow>
        </CardContent>

        <PhotoContainer>
          {student.photo ? (
            <Photo
              className="student-photo"
              src={student.photo}
              alt="Student Photo"
              // crossOrigin="anonymous"
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
              }}
            >
              <Text type="secondary">Photo</Text>
            </Box>
          )}
        </PhotoContainer>

        <QRCodeContainer>
          <QRCode value={getQRCodeData(student)} size={60} bordered={false} />
        </QRCodeContainer>

        <BottomStrip>
          <InfoRow
            style={{ border: "none", paddingTop: "0", paddingBottom: "0" }}
          >
            <InfoLabel style={{ color: "white", paddingLeft: "16px" }}>
              Issue/Expiry Dates:
            </InfoLabel>
            <IssueDateContainer>
              {student.issueDate}/{student.expiryDate}
            </IssueDateContainer>
          </InfoRow>
        </BottomStrip>

        <Footer>If found lost, please return to the above address.</Footer>
      </IdCard>
    );
  };

  // Add this debugging helper function
  const debugImageLoading = (student) => {
    console.log("Debugging image loading for student:", student.name);

    if (student.photo) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => console.log("Student photo loaded successfully");
      img.onerror = (e) => console.error("Failed to load student photo:", e);
      img.src = student.photo;
    }

    const sigImg = new Image();
    sigImg.crossOrigin = "anonymous";
    sigImg.onload = () => console.log("Signature loaded successfully");
    sigImg.onerror = (e) => console.error("Failed to load signature:", e);
    sigImg.src = registrarSignature || "/public/images/sign.png";

    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.onload = () => console.log("Logo loaded successfully");
    logoImg.onerror = (e) => console.error("Failed to load logo:", e);
    logoImg.src = "/public/images/nkumb.png";
  };

  return (
    <Spin spinning={loading} tip="Processing...">
      <Box sx={{ p: 3 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <UserOutlined /> Dashboard
              </span>
            }
            key="1"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <DashboardCard>
                  <Statistic
                    title="Total Students"
                    value={stats.total}
                    prefix={<UserOutlined />}
                  />
                </DashboardCard>
              </Col>
              <Col xs={24} sm={8}>
                <DashboardCard>
                  <Statistic
                    title="Cards Issued"
                    value={stats.issued}
                    valueStyle={{ color: "#52c41a" }}
                    prefix={<CheckCircleOutlined />}
                  />
                </DashboardCard>
              </Col>
              <Col xs={24} sm={8}>
                <DashboardCard>
                  <Statistic
                    title="Cards Pending"
                    value={stats.notIssued}
                    valueStyle={{ color: "#f5222d" }}
                    prefix={<CloseCircleOutlined />}
                  />
                </DashboardCard>
              </Col>
            </Row>

            <Divider />

            <Card
              title={
                <Space>
                  <FilterOutlined />
                  <span>Student Management</span>
                </Space>
              }
              extra={
                <Space>
                  <Button
                    icon={<FileExcelOutlined />}
                    onClick={downloadTemplate}
                  >
                    Download Template
                  </Button>
                  <Upload
                    beforeUpload={handleFileUpload}
                    showUploadList={false}
                    accept=".xlsx,.xls"
                  >
                    <Button icon={<UploadOutlined />}>Import Students</Button>
                  </Upload>
                  <Button
                    type="primary"
                    icon={<PrinterOutlined />}
                    onClick={generateAllPDFs}
                    disabled={filteredStudents.length === 0}
                  >
                    Generate All PDFs
                  </Button>
                </Space>
              }
              style={{ marginTop: "16px" }}
            >
              <Space
                direction="vertical"
                style={{ width: "100%", marginBottom: "16px" }}
              >
                <Row gutter={16} align="middle">
                  <Col xs={24} md={16}>
                    <Input
                      placeholder="Search by name or student number"
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      allowClear
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Space>
                      <Button
                        icon={<FilterOutlined />}
                        onClick={() => setFilterVisible(true)}
                        type={
                          Object.values(filters).some((v) => v && v.length > 0)
                            ? "primary"
                            : "default"
                        }
                      >
                        Filters
                      </Button>
                      <Form.Item
                        label="Registrar's Signature"
                        style={{ marginBottom: 0 }}
                      >
                        <Upload
                          onChange={handleSignatureUpload}
                          showUploadList={false}
                          accept="image/*"
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Form.Item>
                    </Space>
                  </Col>
                </Row>
              </Space>

              <Table
                columns={columns}
                dataSource={filteredStudents}
                rowKey="id"
                pagination={pagination}
                onChange={handleTableChange}
                bordered
                size="small"
                rowClassName={(record) =>
                  record.cardIssued ? "issued-row" : ""
                }
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <EyeOutlined /> ID Card Preview
              </span>
            }
            key="2"
          >
            <Card>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                {currentStudent && renderIDCard(currentStudent)}
              </Box>

              {currentStudent && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => generatePDF(currentStudent)}
                  >
                    Download PDF
                  </Button>
                </Box>
              )}
            </Card>
          </TabPane>
        </Tabs>

        {/* Filter Modal */}
        <Modal
          title="Filter Students"
          open={filterVisible}
          onCancel={() => setFilterVisible(false)}
          footer={[
            <Button key="reset" onClick={resetFilters}>
              Reset Filters
            </Button>,
            <Button
              key="apply"
              type="primary"
              onClick={() => applyFilters(filters)}
            >
              Apply Filters
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Academic Year">
              <Select
                mode="multiple"
                placeholder="Select academic year(s)"
                value={filters.academicYear}
                onChange={(value) =>
                  setFilters({ ...filters, academicYear: value })
                }
                style={{ width: "100%" }}
              >
                {getAcademicYears().map((year) => (
                  <Option key={year.value} value={year.value}>
                    {year.text}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Semester">
              <Select
                mode="multiple"
                placeholder="Select semester(s)"
                value={filters.semester}
                onChange={(value) =>
                  setFilters({ ...filters, semester: value })
                }
                style={{ width: "100%" }}
              >
                {getSemesters().map((semester) => (
                  <Option key={semester.value} value={semester.value}>
                    {semester.text}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Card Status">
              <Select
                placeholder="Select card status"
                value={filters.cardIssued}
                onChange={(value) =>
                  setFilters({ ...filters, cardIssued: value })
                }
                style={{ width: "100%" }}
                allowClear
              >
                <Option value={true}>Issued</Option>
                <Option value={false}>Not Issued</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* ID Card Preview Modal */}
        <Modal
          title="ID Card Preview"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={[
            <Button key="close" onClick={() => setPreviewVisible(false)}>
              Close
            </Button>,
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => {
                generatePDF(currentStudent);
                setPreviewVisible(false);
              }}
            >
              Download PDF
            </Button>,
          ]}
          width={600}
        >
          {currentStudent && renderIDCard(currentStudent)}
        </Modal>
      </Box>
    </Spin>
  );
};

export default NkumbaUniversityIDCard;
