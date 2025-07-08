import { gql } from "@apollo/client";

const ENROLL_STUDENT = gql`
  mutation enrollStudent(
    $studentId: String!
    $studentNo: String!
    $activeSemId: String!
    $enrollmentStatus: String!
    $enrolledBy: String!
    $studyYr: Int!
  ) {
    enrollStudent(
      student_id: $studentId
      student_no: $studentNo
      active_sem_id: $activeSemId
      enrollment_status: $enrollmentStatus
      enrolled_by: $enrolledBy
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
    $studentNo: String!
    $amount: Int!
    $type: String!
    $generatedBy: String!
    $invoices: String
  ) {
    generatePRT(
      student_no: $studentNo
      amount: $amount
      type: $type
      generated_by: $generatedBy
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

const VOID_INVOICE = gql`
  mutation voidInvoice($invoiceNo: String!, $voidedReason: String) {
    voidInvoice(invoice_no: $invoiceNo, voided_reason: $voidedReason) {
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
  VOID_INVOICE
};
