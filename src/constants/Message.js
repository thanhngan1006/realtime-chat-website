export const ERROR = {
  LOGIN_WRONG_ACCOUNT: 'login.wrong_account',
  LOGIN_FAILURE: 'login.failure',
  SIGNUP_FAILURE: 'signup.failure',
  INVALID_PASSWORD: 'validate_field.invalid_password_format',
  INVALID_EMAIL: 'validate_field.invalid_email',
  NOT_FULL_FIELD: 'validate_field.not_fullfield',
  NOT_ENTER_EMAIL: 'validate_field.not_email',
  PASSWORD_NOT_MATCH_CONFIRMED_PASSWORD:
    'validate_field.password_not_match_confirmed_password',
  RESET_FAILURE: 'reset_password.failure',
  EMAIL_ALREADY_EXISTS: 'validate_field.email_already_exist',
  EMAIL_PASSWORD_REQUIRED: 'auth.email_password_required',
  NO_AUTHENTICATED_USER: 'auth.no_authenticated_user',
  CURRENT_NEW_PASSWORD_REQUIRED: 'auth.current_new_password_required',
  EMAIL_ALREADY_VERIFIED: 'auth.email_already_verified',
  EMAIL_REQUIRED: 'auth.email_required',
};

export const SUCCESS = {
  LOGIN_SUCCESS: 'login.success',
  SIGNUP_SUCCESS: 'signup.success',
  RESET_SUCCESS: 'reset_password.success',
  REGISTRATION_SUCCESS: 'auth.registration_success',
  LOGOUT_SUCCESS: 'auth.logout_success',
  PASSWORD_RESET_SENT: 'auth.password_reset_sent',
  PASSWORD_UPDATED: 'auth.password_updated',
  VERIFICATION_EMAIL_SENT: 'auth.verification_email_sent',
};

export const INFO = {
  CHECK_EMAIL_VERIFICATION: 'auth.check_email_verification',
  CHECK_EMAIL_RESET: 'auth.check_email_reset',
};

export const CONVERSATION_MESSAGES = {
  CONVESATION_CREATED: 'conversation.conversation_created_success',
  SENDER_ID_OR_RECEIVER_ID_REQUIRED:
    'conversation.sender_id_and_receiver_id_required',
  CONVERSATION_ALREADY_EXIST: 'conversation.conversation_already_exist',
};
