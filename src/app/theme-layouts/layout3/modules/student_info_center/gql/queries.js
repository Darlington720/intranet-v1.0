import { gql } from "@apollo/client";

const GET_ALL_PROGRAMMES_CATEGORISED_BY_COLLEGES = gql`
  query getAllProgrammesCategorisedByColleges($campusId: String) {
    colleges {
      id
      code: college_code
      label: college_title
      children: schools {
        id
        code: school_code
        label: school_title
        children: departments {
          id
          label: dpt_title
          code: dpt_code
          children: courses(campus_id: $campusId) {
            id
            code: course_code
            label: course_title
            children: course_versions {
              id
              label: version_title
              course {
                id
                course_code
                course_title
              }
            }
          }
        }
      }
    }
  }
`;

const GET_STUDENTS = gql`
  query Students(
    $campus: String
    $intake: String
    $accYr: String
    $courseVersion: String
    $sic: Boolean
    $searchCreteria: String
    $searchValue: String
  ) {
    students(
      campus: $campus
      intake: $intake
      acc_yr: $accYr
      course_version: $courseVersion
      sic: $sic
      search_creteria: $searchCreteria
      search_value: $searchValue
    ) {
      id
      student_no
      registration_no
      biodata {
        id
        surname
        other_names
        email
        phone_no
        religion
        nationality {
          id
          nationality_title
          nationality_category
        }
        nin
        gender
        marital_status
        district_of_birth
        date_of_birth
      }
      course {
        id
        course_code
        course_title
        level_details {
          level_title
        }
        school {
          id
          school_title
          school_code
          college {
            id
            college_title
          }
        }
      }
      intake_id
      intake_title
      entry_acc_yr
      entry_acc_yr_title
      course_details {
        id
        version_title
      }
      entry_study_yr
      campus_id
      campus_title
      status
      sponsorship
      study_time_id
      study_time_title
      study_yr
      current_sem
    }
  }
`;

const GET_STUDENT_DETAILS = gql`
  query loadStudentDetails($studentNo: String) {
    loadStudentFile(student_no: $studentNo) {
      id
      form_no
      student_no
      registration_no
      graduation_status
      biodata {
        surname
        other_names
        is_verified
        marital_status
        nationality {
          id
          nationality_category
          nationality_title
        }
        email
        gender
        date_of_birth
        district_of_birth
        district_of_origin
        phone_no
        place_of_residence
        religion
        nin
      }
      next_of_kin {
        full_name
        email
        relation
        phone_no
        address
      }
      intake_id
      campus_id
      study_time_id
      intake_title
      campus_title
      study_time_title
      course_details {
        id
        version_title
        course {
          id
          course_code
          course_duration
          course_title
          level_details {
            level_title
          }
          school {
            id
            school_code
            school_title
            college {
              id
              college_code
              college_title
            }
          }
        }
      }
      entry_acc_yr_title
      entry_study_yr
      entry_acc_yr
      enrollment_history {
        id
        enrollment_token
        study_yr
        sem
        acc_yr
        datetime
        enrollment_status {
          id
          title
          color_code
        }
        active
        enrolled_by
        acc_yr_title
        invoiced
        enrolled_by_type
        enrolled_by_user
      }
      registration_history {
        id
        acc_yr_id
        acc_yr_title
        date
        study_yr
        student_no
        sem
        enrollment_token
        registration_token
        reg_comments
        provisional_reason
        provisional_expiry
        provisional
        de_registered_reason
        de_registered
        registered_by_user
      }
      current_info {
        recent_enrollment {
          id
          datetime
          study_yr
          sem
          acc_yr_title
          enrollment_token
        }
        enrollment_status
        current_acc_yr
        account_balance
        true_sem
        true_study_yr
        acc_yr_id
        progress
        active_sem_id
        registration_status
      }
      status
      is_on_sponsorship
      sponsorship
      is_resident
    }
  }
`;

const LOAD_STUDENT_LOGS = gql`
  query student_logs($studentNo: String!) {
  student_logs(student_no: $studentNo) {
    id
    action
    action_by
    action_date
    description
    module
  }
}
`;

export {
  GET_ALL_PROGRAMMES_CATEGORISED_BY_COLLEGES,
  GET_STUDENTS,
  GET_STUDENT_DETAILS,
  LOAD_STUDENT_LOGS
};
