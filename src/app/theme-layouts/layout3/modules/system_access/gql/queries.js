import { gql } from "@apollo/client";

const LOAD_ROLES = gql`
  query loadRoles {
    all_roles {
      role_id
      role_name
      description
      permissions
    }
  }
`;

const LOAD_ROLE_MODULES = gql`
  query loadRoleModules($roleId: String!) {
    role_modules(role_id: $roleId) {
      id
      title
      route
      description
      permissions
    }
  }
`;

const LOAD_USERS = gql`
  query loadUsers {
    users {
      id
      biodata {
        id
        salutation
        surname
        other_names
      }
      role {
        role_id
        role_name
      }
      last_logged_in {
        logged_in
        logged_out
      }
      email
    }
  }
`;

const LOAD_USER_ACTION_LOGS = gql`
 query User_action_logs($userId: String!) {
  user_action_logs(user_id: $userId) {
      id
      user_id
      name
      action_type
      user_type
      module
      description
      ip_address
      timestamp
      user_agent
    }
  }
`;

const LOAD_SYSTEM_USERS = gql`
  query system_users {
    system_users {
      user_id
      staff_id
      name
      user_type
      last_activity
    }
  }
`;

export {
  LOAD_ROLES,
  LOAD_ROLE_MODULES,
  LOAD_USERS,
  LOAD_USER_ACTION_LOGS,
  LOAD_SYSTEM_USERS,
};
