import { gql } from "@apollo/client";

const SAVE_STUDENT_IMAGE = gql`
  mutation SaveStudentImage(
    $stdno: String!
    $saveStudentImageId: ID
    $file: Upload
  ) {
    saveStudentImage(stdno: $stdno, id: $saveStudentImageId, file: $file) {
      message
      success
    }
  }
`;

const SAVE_STAFF_IMAGE = gql`
  mutation saveStaffImage(
    $staffId: String!
    $file: Upload
    $saveStaffImageId: ID
  ) {
    saveStaffImage(staff_id: $staffId, file: $file, id: $saveStaffImageId) {
      message
      success
    }
  }
`;

const DELETE_STUDENT_IMAGE = gql`
  mutation deleteStudentImage($studentNo: String!) {
    deleteStudentImage(student_no: $studentNo) {
      message
      success
    }
  }
`;

const DELETE_STAFF_IMAGE = gql`
  mutation deleteStaffImage($staffId: String!) {
    deleteStaffImage(staff_id: $staffId) {
      message
      success
    }
  }
`;
export {
  SAVE_STUDENT_IMAGE,
  DELETE_STUDENT_IMAGE,
  SAVE_STAFF_IMAGE,
  DELETE_STAFF_IMAGE,
};
