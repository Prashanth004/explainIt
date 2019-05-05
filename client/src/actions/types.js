export const FETCH_ISSUE = 'FETCH_ISSUE'
export const FETCH_PROJ_BY_ISSUE = 'FETCH_PROJ_BY_ISSUE'
export const SET_ISUUE_ID = "SET_ISUUE_ID"
export const CREATE_ISSUE_PROJECT = "CREATE_ISSUE_PROJECT"  
export const SIGN_IN_WITH_GOOGLE = "SIGN_IN_WITH_GOOGLE"
export const AUTH_FAIL = 'AUTH_FAIL'
export const CHECK_TOKEN_VALIDIDTY = 'CHECK_TOKEN_VALIDIDTY'
export const SIGN_IN_WITH_TWITTER = "SIGN_IN_WITH_TWITTER"
export const SIGN_IN_WITH_GIT = "SIGN_IN_WITH_GIT";
export const SIGN_OUT  = "SIGN_OUT";
export const FETCH_STARTED = "FETCH_STARTED"
export const UPDATE_ANSWER_WITH_IMAGE = "UPDATE_ANSWER_WITH_IMAGE"
export const CLEAR_ANSWER = "CLEAR_ANSWER";
export const CREATE_ISSUE_PROJECT_FAILED ="CREATE_ISSUE_PROJECT_FAILED"
export const CANCEL_PROJ_CREATION_ERROR = "CANCEL_PROJ_CREATION_ERROR"
export const CANCEL_PROJ_CREATION_SUCCESS = "CANCEL_PROJ_CREATION_SUCCESS"
export const FETCH_DETAILS_OF_EXPLAINED = "FETCH_DETAILS_OF_EXPLAINED"
export const CANCEL_SUCCESS ="CANCEL_SUCCESS"
export const  DELETE_SUCCESSFULL = "DELETE_SUCCESSFULL"
export const DELETE_FAILED = "DELETE_FAILED"
export const SET_ISSUE_ID_TO_NULL = "SET_ISSUE_ID_TO_NULL"
export const FILE_SIZE_TOO_LARGE = "FILE_SIZE_TOO_LARGE"



//Tool related

export const DISPLAY_SCREEN_RECORD = "DISPLAY_SCREEN_RECORD"
export const DISPLAY_SCREEN_SHARE ="DISPLAY_SCREEN_SHARE"
export const DISPLAY_FULL_SHARE ="DISPLAY_FULL_SHARE";
export const DISPLAY_FULL_SCREEN_RECORD = "DISPLAY_FULL_SCREEN_RECORD"

export const SCREEN_SHARE = "screenShare"
export const START_SHARING = "START_SHARING";
export const STOP_SHARING ="STOP_SHARING";

export const SCREEN_RECORD ="screenRecord";
export const START_RECORDING = "START_RECORDING";
export const STOP_RECORDING = "STOP_RECORDING"

export const SET_VIDEO_BLOB = "SET_VIDEO_BLOB"
export const DISCARD_RECORD_CHANGES ="DISCARD_RECORD_CHANGES"

export const FULL_SCREEN_SHARE ="fullScreenSharing";
export const FULL_START_SHARING = "FULL_START_SHARING";
export const FULL_STOP_SHARING ="FULL_STOP_SHARING";

export const FULL_SCREEN_RECORD ="fullScreenRecording";
export const FULL_START_RECORD = "FULL_START_RECORD";
export const FULL_STOP_RECORD ="FULL_STOP_RECORD";

export const RESET_TOOL_STATES = "RESET_TOOL_STATES";
export const  OPEN_EDIT_TEXT_MODAL = "OPEN_EDIT_TEXT_MODAL";
export const CLOSE_EDIT_TEXT_MODAL ="CLOSE_EDIT_TEXT_MODAL";
export const UPDATE_TEXT_EXPLAIN ="UPDATE_TEXT_EXPLAIN";


//Profile action

export const GET_PROFILE_DETAILS = "GET_PROFILE_DETAILS"
export const GET_PROFILE_DETAILS_FAIL ="GET_PROFILE_DETAILS_FAIL"
export const UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE";
export const UPDATE_USER_PROFILE_FAILED ="UPDATE_USER_PROFILE_FAILED";
export const  OPEN_EDIT_PROFILE = "OPEN_EDIT_PROFILE";
export const CLOSE_EDIT_PROFILE = "CLOSE_EDIT_PROFILE";
export const  CHANGE_ONLINE_STATUS = "CHANGE_ONLINE_STATUS";
export const CHANGE_ONLINE_STATUS_FAILED ="CHANGE_ONLINE_STATUS_FAILED";


//Extension Action
export const SAVE_EXTENSION_DETAILS="SAVE_EXTENSION_DETAILS"
export const GET_SOURCE_ID = "SAVE_SOURCE_ID"

//visitProfile Action

export const GET_PROFILE_BY_TWITTER_HANDLE = "GET_PROFILE_BY_TWITTER_HANDLE"
export const GOT_NULL_BY_TWITTWRHANDLE = "GOT_NULL_BY_TWITTWRHANDLE"
//callAction

export const CALL_DETAILS_ACCEPT = "CALL_DETAILS_ACCEPT"
export const ANSWER_CALL = "ANSWER_CALL" 
export const SET_NUMBER_MINUTES = "SET_NUMBER_MINUTES"

//message Action

export const SEND_MESSAGE = "SEND_MESSAGE"
export const SEND_FAILED ="SEND_FAILED"
export const FETCH_MESSAGES = "FETCH_MESSAGES"
export const FETCH_FAILED ="FETCH_FAILED"
export const MISS_CALL = "MISS_CALL";
export const FAILURE_IN_CHNAGE_READ_STATE = "FAILURE_IN_CHNAGE_READ_STATE"
export const CANCEL_MESSAGE_STATE= "CANCEL_MESSAGE_STATE"
export const HIDE_TEXT_BOX_AFTER_RECORDONG = "HIDE_TEXT_BOX_AFTER_RECORDONG"
export const SHOW_TEXT_BOX_AFTER_RECORDONG = "SHOW_TEXT_BOX_AFTER_RECORDONG";
export const FROM_SHARE_TO_RECORD = "FROM_SHARE_TO_RECORD"
export const GET_TOTAL_UNREAD = "GET_TOTAL_UNREAD"
export const SUCCESS_IN_CHNAGE_READ_STATE ="SUCCESS_IN_CHNAGE_READ_STATE";
export const EXPLAIN_ISSUE ="EXPLAIN_ISSUE"
export const AUTH_FAIL_TWITTER = "AUTH_FAIL_TWITTER";
export const JUST_RECORD ="JUST_RECORD"




//Nav action

export const OPEN_HOME = "OPEN_HOME"
export const OPEN_CREATED = "OPEN_CREATED"
export const OPEN_PARTICIPATED = "OPEN_PARTICIPATED"
export const OPEN_INBOX ="OPEN_INBOX"


export const CANCEL_CREATION = "CANCEL_CREATION"

// tweet realted actions

export const GET_PROFILE_ID = "GET_PROFILE_ID";
export const GOT_NO_PROFILE ="GOT_NO_PROFILE"

export const SET_STREAM = "SET_STREAM"
export const SET_STREAM_TO_NULL = "SET_STREAM_TO_NULL";

export const RESET_TWITTER_API_VALUES = "RESET_TWITTER_API_VALUES"

export const SHOW_CANVAS = "SHOW_CANVAS"
export const HIDE_CANVAS ="HIDE_CANVAS"

export const SEND_TWEETS = "SEND_TWEETS"
export const SEND_TWEET_FAILED ="SEND_TWEET_FAILED"

export const GET_TWITTER_HANDLE = "GET_TWITTER_HANDLE"
export const GET_TWITTER_HANDLE_FAILED ="GET_TWITTER_HANDLE_FAILED"

export const GET_PROFILE_DETAILS_FAIL_ON_HOVER = "GET_PROFILE_DETAILS_FAIL_ON_HOVER"
export const GET_PROFILE_DETAILS_ON_HOVER = "GET_PROFILE_DETAILS_ON_HOVER"
export const SECOND_SHARE_START = "SECOND_SHARE_START"
export const SECOND_SHARE_END ="SECOND_SHARE_END"
export const SAVE_RECIEVER_DATA ="SAVE_RECIEVER_DATA"


//email actions
export const SEND_OTP = "SEND_OTP";
export const SEND_OTP_FAILED ="SEND_OTP_FAILED"
export const VARIFY_ACTIVATED ="VARIFY_ACTIVATED"
export const VARIFY_ACTIVATED_FAILED ="VARIFY_ACTIVATED_FAILED"
export const ACTIVATED_PROFILE ="ACTIVATED_PROFILE";
export const RE_SEND_OTP_FAILED = "RE_SEND_OTP_FAILED";
export const RE_SEND_OTP = "RE_SEND_OTP";
export const REPLY_EMAIL_SENT = "REPLY_EMAIL_SENT";
export const SAVE_REPLY_EMAIL_OPTION="SAVE_REPLY_EMAIL_OPTION";
export const CANCEL_EMAIL_OPTION = "CANCEL_EMAIL_OPTION";
