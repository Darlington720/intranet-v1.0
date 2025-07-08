import { gql } from "@apollo/client";

const STUDENTS_AUTOCOMPLETE = gql`
  query studentAutocomplete($query: String!) {
    student_autocomplete(query: $query) {
      student_no
      name
      registration_no
      has_photo
    }
  }
`;

const STAFF_AUTOCOMPLETE = gql`
  query staff_autocomplete($query: String!) {
    staff_autocomplete(query: $query) {
      staff_id
      name
      has_photo
    }
  }
`;

const GET_RECENTLY_UPLOADED_IMAGES = gql`
  query GetRecentlyUploadedImages {
    getRecentlyUploadedImages {
      id
      stdno
      student_name
      image
      modified_by_name
      last_modified_on
    }
  }
`;

const GET_RECENTLY_UPLOADED_STAFF_IMAGES = gql`
  query GetRecentlyUploadedStaffImages {
    getRecentlyUploadedStaffImages {
      id
      staff_id
      staff_name
      image
      modified_by_name
      last_modified_on
    }
  }
`;

export {
  STUDENTS_AUTOCOMPLETE,
  GET_RECENTLY_UPLOADED_IMAGES,
  GET_RECENTLY_UPLOADED_STAFF_IMAGES,
  STAFF_AUTOCOMPLETE
};
