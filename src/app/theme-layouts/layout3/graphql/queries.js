import { gql } from "@apollo/client";

const GET_APPLICANT_REQS = gql`
  query GetApplicantReqs {
    acc_yrs {
      id
      acc_yr_name: acc_yr_title
      created_by: added_by
      created_on: added_on
    }
    schemes {
      scheme_category_id
      scheme_name
    }
    intakes {
      id
      intake_name: intake_title
    }
  }
`;

const GET_PROGRAM_CHOICES = gql`
  query GetProgramChoices(
    $accYr: String!
    $intakeId: String
    $schemeCategoryId: String
  ) {
    program_choices(
      acc_yr: $accYr
      intake_id: $intakeId
      scheme_category_id: $schemeCategoryId
    ) {
      id
      applicant_id
      scheme_id
      program {
        id
        course_code
        program
        studentcount
      }
      campus {
        cam_id: id
        campus_name: campus_title
      }
    }
  }
`;

const GET_APPLICANT_FORMS = gql`
  query GetApplicantForms(
    $schemeId: String!
    $programId: String!
    $campusId: String!
  ) {
    applicant_forms(
      scheme_id: $schemeId
      program_id: $programId
      campus_id: $campusId
    ) {
      id
      applicant_id
      surname
      other_names
      email
      phone_no
      scheme_id
      form_no
      salutation
      DOB
      district_of_birth
      religion
      gender
      marital_status
      nationality
      nin_no
      passport_no
      district_of_residence
      form_status
      created_on
      scheme {
        intake {
          id
          intake_name: intake_title
        }
        scheme_category {
          scheme_category_id
          scheme_name
        }
        acc_yr
        start_date
        end_date
      }
      prog_choices {
        id
        program {
          id
          course_code
          program
        }
        campus {
          cam_id: id
          campus_name: campus_title
        }
        study_time {
          id
          study_time_name: study_time_title
        }
        choice
        entry_yr
      }
      other_qualifications {
        institute_name
        award_obtained
        award_duration
        award_body
        award_type
        start_date
        end_date
        attachment
      }
      olevel_info {
        applicant_id
        school_name
        yr_of_sitting
        index_no
        total_credits
        total_distinctions
        total_passes
        olevel_results {
          id
          subject {
            subject_code
            subject_name
          }
          grade
        }
      }
      alevel_info {
        applicant_id
        school_name
        yr_of_sitting
        index_no
        points_obtained
        alevel_results {
          id
          subject {
            subject_code
            subject_name
          }
          grade
        }
      }
      referees {
        id
        ref_name
        ref_email
        ref_address
        ref_phone_no
      }
      medical_history {
        id
        blood_type
        disability
        emergency_contact
      }
      next_of_kin {
        id
        name
        email
        contact
        relation
      }
      payments {
        id
        payment_ref
        amount
        date
      }
      sent_for_marks
      admitted
    }
  }
`;

const GET_STAFF_MEMBERS = gql`
  query GetStaffMembers {
    user_roles {
      id
      role_name
    }
    staff_members {
      id
      staff_id
      title
      staff_name
    }
  }
`;

const GET_ADMISSIBLE_PHD_STDS = gql`
  query GetAdmissiblePHDStds($accYr: String!, $intakeId: String!) {
    admissible_phd_applicants(acc_yr: $accYr, intake_id: $intakeId) {
      id
      surname
      other_names
      created_on
      form_no
      phone_no
      applicant_id
      scheme_id
      prog_choices {
        id
        program {
          id
          course_code
          program
        }
      }
      payments {
        id
        amount
        payment_ref
        date
      }
      email
      application_sent_details {
        completed
        date_sent
        program {
          course_code
          program
        }
      }
      pre_admission_marks {
        id
        pre_entry_exam_marks
        concept_exam_marks
        passed
        add_on
        added_by
      }
      admitted
    }
  }
`;

const GET_LECTURER_COURSE_UNITS = gql`
  query getLecturerCourseunits($lecturerId: ID!) {
    lecturer_course_units(lecturer_id: $lecturerId) {
      active_session_id
      courseunit_name
      session
      timetable_id
    }
  }
`;

const GET_QUESTIONS = gql`
  query Questions {
    questions {
      id
      qn
    }
  }
`;

const GET_MODULES = gql`
  query Modules {
    modules {
      id
      title
      route
      logo
    }
  }
`;

const GET_ROLES = gql`
  query Roles {
    roles {
      id
      role_name
      modules
      permissions
    }
  }
`;

const GET_MY_PROFILE = gql`
  query my_profile {
    my_profile {
      id
      user_id
      email
      has_set_sec_qns
      sys_gen_pwd
      biodata {
        id
        email
        salutation
        staff_id
        surname
        other_names
        telno
      }
      last_logged_in {
        id
        machine_ipaddress
        logged_in
      }
      role {
        id: role_id
        role_name
        # permissions
        _modules {
          id
          title
          route
          logo
        }
      }
    }
  }
`;

export {
  GET_APPLICANT_REQS,
  GET_PROGRAM_CHOICES,
  GET_APPLICANT_FORMS,
  GET_STAFF_MEMBERS,
  GET_ADMISSIBLE_PHD_STDS,
  GET_LECTURER_COURSE_UNITS,
  GET_QUESTIONS,
  GET_MODULES,
  GET_ROLES,
  GET_MY_PROFILE,
};
