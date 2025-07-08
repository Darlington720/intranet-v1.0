import { gql } from "@apollo/client";

const ENROLL_STUDENT = gql`
  mutation enrollStudent(
    $studentId: String!
    $studentNo: String!
    $semester: Int!
    $enrollmentStatus: String!
    $studyYr: Int!
  ) {
    enrollStudent(
      student_id: $studentId
      student_no: $studentNo
      semester: $semester
      enrollment_status: $enrollmentStatus
      study_yr: $studyYr
    ) {
      message
      success
    }
  }
`;

const SAVE_PAST_ENROLLMENT = gql`
  mutation savePastEnrollment(
    $studentId: String!
    $studentNo: String!
    $accYr: String!
    $studyYr: Int!
    $semester: Int!
    $intake: String!
    $enrollmentStatus: String!
    $enrolledBy: String!
  ) {
    savePastEnrollment(
      student_id: $studentId
      student_no: $studentNo
      acc_yr: $accYr
      study_yr: $studyYr
      semester: $semester
      intake: $intake
      enrollment_status: $enrollmentStatus
      enrolled_by: $enrolledBy
    ) {
      message
      success
    }
  }
`;

const DELETE_ENROLLMENT = gql`
  mutation deleteEnrollment($enrollmentId: String!) {
    deleteEnrollment(enrollment_id: $enrollmentId) {
      message
      success
    }
  }
`;

const EDIT_ENROLLMENT = gql`
  mutation editEnrollment(
    $enrollmentId: ID!
    $accYr: String!
    $studyYr: Int!
    $semester: Int!
    $enrollmentStatus: String!
    $invoice: Int!
    $enrolledBy: String!
  ) {
    editEnrollment(
      enrollment_id: $enrollmentId
      acc_yr: $accYr
      study_yr: $studyYr
      semester: $semester
      enrollment_status: $enrollmentStatus
      invoice: $invoice
      enrolled_by: $enrolledBy
    ) {
      message
      success
    }
  }
`;

const GENERATE_PRT = gql`
  mutation generatePRT(
    $studentNo: String
    $amount: Int!
    $type: String!
    $invoices: String
  ) {
    generatePRT(
      student_no: $studentNo
      amount: $amount
      type: $type
      invoices: $invoices
    ) {
      student_no
      prt
      amount
      allocations
      prt_expiry
    }
  }
`;

const REGISTER_MODULE = gql`
  mutation Register_module($payload: RegisterModuleInput!) {
    register_module(payload: $payload) {
      message
      success
    }
  }
`;

const REMOVE_MODULE = gql`
  mutation removeModule($moduleId: String!) {
    remove_module(module_id: $moduleId) {
      message
      success
    }
  }
`;

const REGISTER_STUDENT = gql`
  mutation registerStudent($payload: RegInput) {
    registerStudent(payload: $payload) {
      message
      success
    }
  }
`;

const DE_REGISTER = gql`
  mutation deRegister($registrationId: String!) {
    deRegister(registration_id: $registrationId) {
      message
      success
    }
  }
`;

const ACTIVATE_SEMESTER = gql`
  mutation activateSemester($activateSemesterId: ID!) {
    activateSemester(id: $activateSemesterId) {
      message
      success
    }
  }
`;

export {
  ENROLL_STUDENT,
  SAVE_PAST_ENROLLMENT,
  DELETE_ENROLLMENT,
  EDIT_ENROLLMENT,
  GENERATE_PRT,
  REGISTER_MODULE,
  REMOVE_MODULE,
  REGISTER_STUDENT,
  DE_REGISTER,
  ACTIVATE_SEMESTER,
};
