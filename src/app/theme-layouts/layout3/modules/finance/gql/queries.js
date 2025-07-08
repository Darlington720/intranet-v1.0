import { gql } from "@apollo/client";

const LOAD_STUDENT_FILE_WITH_VOID = gql`
  query loadStudentFileWithVoid($studentNo: String!) {
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
        enrolled_by
        acc_yr_title
        invoiced
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
      }
      status
      is_on_sponsorship
      is_resident
    }
    voided_invoices(student_no: $studentNo) {
    invoice_no
    invoice_date
    currency_code
    total_amount
    voided_on
    voided_by
    voided_by_name
    voided_reason
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

export { LOAD_STUDENT_FILE_WITH_VOID, LOAD_ENROLLMENT_STATUSES };
