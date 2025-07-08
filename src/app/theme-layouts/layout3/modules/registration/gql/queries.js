import { gql } from "@apollo/client";

const LOAD_STUDENT_FILE = gql`
  query loadStudentFile($studentNo: String!) {
    loadStudentFile(student_no: $studentNo) {
      id
      form_no
      student_no
      registration_no
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
      }
      intake_id
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
        registered_user {
          title
          staff_name
          id
        }
      }
      invoices {
        id
        student_id
        student_no
        invoice_no
        line_items {
          line_item_id
          student_no
          item_name
          item_code
          invoice_no
          date
          item_comments
          item_description
          quantity
          unit_amount
        }

        currency_code
        amount_paid
        amount_due
        academic_year
        due_date
        study_year
        total_amount
        total_credit
        semester
        status
        paid
        reference
        narration
        invoice_type
        invoice_date
        invoice_category
        total_dps
        total_ppas
        voided
        voided_by
        voided_on
        voided_reason
        txns {
          tredumo_txn_id
          invoice_no
          student_no
          prt
          amount
          allocation_date
          acc_yr
          is_dp
          is_pp_allocation
          posted_by
        }
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
        enrollment_types {
          id
          title
        }
      }
      status
      is_on_sponsorship
      is_resident
    }
  }
`;

const LOAD_ENROLLMENT_STATUSES = gql`
  query getEnrollmentStatuses {
    enrollment_types {
      id
      title
      description
    }
  }
`;

const GET_STUDENT_REGISTERED_COURSEUNITS = gql`
  query getStudentRegisteredCourseunits(
    $studentNo: String!
    $studyYear: Int!
    $sem: Int!
  ) {
    student_registered_courseunits(
      student_no: $studentNo
      study_year: $studyYear
      sem: $sem
    ) {
      id
      student_no
      study_year
      semester
      status
      paid
      retake_count
      invoice_no
      course_unit {
        course_unit_code
        course_unit_level
        course_unit_title
        credit_units
      }
    }
  }
`;

const LOAD_STD_REGISTRATION_REPORT = gql`
  query studentRegistrationReport($payload: RegReportInput!) {
    student_registration_report(payload: $payload) {
      totals {
        total_enrolled
        total_provisional
        total_registered
      }
      report_summary {
        course_id
        school_code
        course_code
        course_title
        school_id
        school_title
        study_yr
        total_enrolled
        total_provisional
        total_registered
      }
    }
  }
`;

const LOAD_REG_STUDENTS = gql`
  query getStudents($payload: RegReportInput!) {
    get_students(payload: $payload) {
      # id
      surname
      other_names
      student_no
      registration_no
      enrollment_token
      enrollment_status
      entry_acc_yr
      registration_token
      provisional
      acc_yr
      nationality
      study_yr
      sem
      study_time
      course_code
      course_title
      gender
    }
  }
`;

const DOWNLOAD_STDS_REG_REPORT = gql`
  query downloadStdsRegReport($payload: RegReportInput!) {
    download_report(payload: $payload)
  }
`;

export {
  LOAD_STUDENT_FILE,
  LOAD_ENROLLMENT_STATUSES,
  GET_STUDENT_REGISTERED_COURSEUNITS,
  LOAD_STD_REGISTRATION_REPORT,
  LOAD_REG_STUDENTS,
  DOWNLOAD_STDS_REG_REPORT,
};
