import { gql } from "@apollo/client";

const STUDENTS_AUTOCOMPLETE = gql`
  query studentAutocomplete($query: String!) {
    student_autocomplete(query: $query) {
      id
      student_no
      name
      registration_no
      course {
        course_code
      }
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

export { STUDENTS_AUTOCOMPLETE, GET_RECENTLY_UPLOADED_IMAGES };
