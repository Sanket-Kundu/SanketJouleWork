export interface I18nStrings {
  // Input component
  INPUT_CLEAR: string;
  INPUT_SUGGESTIONS_AVAILABLE: string;
  INPUT_SUGGESTIONS_ONE: string;
  INPUT_SUGGESTIONS_NONE: string;
  INPUT_SHOW_PASSWORD: string;
  INPUT_HIDE_PASSWORD: string;

  // Value states
  VALUE_STATE_ERROR: string;
  VALUE_STATE_WARNING: string;
  VALUE_STATE_SUCCESS: string;
  VALUE_STATE_INFORMATION: string;

  // RadioButton value state descriptions
  RADIOBUTTON_VALUE_STATE_ERROR: string;
  RADIOBUTTON_VALUE_STATE_WARNING: string;
  RADIOBUTTON_VALUE_STATE_SUCCESS: string;
  RADIOBUTTON_VALUE_STATE_INFORMATION: string;

  // Common
  REQUIRED_FIELD: string;
  LOADING: string;
  NO_DATA: string;

  // Table component
  TABLE_NO_DATA: string;
  TABLE_ROW: string;
  TABLE_ROW_INDEX: string;
  TABLE_ROW_SELECTED: string;
  TABLE_ROW_ACTIVE: string;
  TABLE_ROW_NAVIGABLE: string;
  TABLE_ROW_NAVIGATED: string;
  TABLE_ROW_SELECTOR: string;
  TABLE_ROW_SINGLE_ACTION: string;
  TABLE_ROW_MULTIPLE_ACTIONS: string;
  TABLE_ROW_POPIN: string;
  TABLE_ROW_ACTIONS: string;
  TABLE_COLUMN_HEADER_ROW: string;
  TABLE_SELECTION: string;
  TABLE_ROW_SELECTION: string;
  TABLE_SELECT_ALL_ROWS: string;
  TABLE_DESELECT_ALL_ROWS: string;
  TABLE_SELECT_ALL_NOT_CHECKED: string;
  TABLE_SELECT_ALL_CHECKED: string;
  TABLE_MORE: string;
  TABLE_MORE_DESCRIPTION: string;
  TABLE_MULTI_SELECTABLE: string;
  TABLE_SINGLE_SELECTABLE: string;
  TABLE_NAVIGATION: string;
  TABLE_SORT_ASCENDING: string;
  TABLE_SORT_DESCENDING: string;
  TABLE_SORT_NONE: string;
  TABLE_AI_SORT_PLACEHOLDER: string;
  TABLE_AI_FILTER_PLACEHOLDER: string;
  TABLE_AI_CHAT_PLACEHOLDER: string;
  TABLE_AI_INSIGHT_ANOMALY: string;
  TABLE_AI_INSIGHT_TREND: string;
  TABLE_AI_INSIGHT_PATTERN: string;
  TABLE_AI_INSIGHT_DISMISS: string;
  TABLE_AI_GENERATED: string;
  TABLE_LOADING_MORE: string;
  TABLE_TOOLBAR: string;
  TABLE_TOOLBAR_ROLEDESCRIPTION: string;
  TABLE_SINGLE_ROW_SELECTED: string;
  TABLE_ROWS_SELECTED: string;

  // Token / Tokenizer
  TOKEN_ARIA_LABEL: string;
  TOKEN_ARIA_DELETABLE: string;
  TOKEN_DELETE: string;
  TOKENIZER_ARIA_LABEL: string;
  TOKENIZER_SHOW_MORE: string;
  TOKENIZER_POPOVER_HEADER: string;
  TOKENIZER_CLEAR_ALL: string;
  TOKENIZER_TOKEN_COUNT: string;
  TOKENIZER_TOKENS_SELECTED: string;

  // ComboBox / Select
  COMBOBOX_RESULTS_AVAILABLE: string;
  COMBOBOX_ONE_RESULT: string;
  COMBOBOX_NO_RESULTS: string;
  COMBOBOX_VALUE_STATE_LINK_SHORTCUT: string;
  COMBOBOX_VALUE_STATE_LINKS_SHORTCUT: string;
  SELECT_ROLE_DESCRIPTION: string;
  SELECT_OPTION_SELECTED: string;

  // MultiComboBox
  MULTICOMBOBOX_SELECT_ALL: string;
  MULTICOMBOBOX_ITEMS_SELECTED: string;

  // Menu
  MENU_POPOVER_ACCESSIBLE_NAME: string;

  // DatePicker
  DATEPICKER_DATE_DESCRIPTION: string;
  DATERANGE_DESCRIPTION: string;
  DATEPICKER_OPEN_ICON_TITLE: string;
  DATEPICKER_OPEN_ICON_TITLE_OPENED: string;
  DATEPICKER_POPOVER_ACCESSIBLE_NAME: string;
  DATERANGEPICKER_POPOVER_ACCESSIBLE_NAME: string;
  INPUT_CLEAR_ICON_ACC_NAME: string;

  // SegmentedButton
  SEGMENTEDBUTTON_ARIA_DESCRIPTION: string;
  SEGMENTEDBUTTONITEM_ARIA_DESCRIPTION: string;

  // MessageStrip
  MESSAGE_STRIP_INFORMATION: string;
  MESSAGE_STRIP_SUCCESS: string;
  MESSAGE_STRIP_ERROR: string;
  MESSAGE_STRIP_WARNING: string;
  MESSAGE_STRIP_CLOSABLE: string;
  MESSAGE_STRIP_CLOSE_BUTTON_INFORMATION: string;
  MESSAGE_STRIP_CLOSE_BUTTON_POSITIVE: string;
  MESSAGE_STRIP_CLOSE_BUTTON_NEGATIVE: string;
  MESSAGE_STRIP_CLOSE_BUTTON_CRITICAL: string;
  MESSAGE_STRIP_REFRESH: string;

  // FileUploader
  FILEUPLOADER_PLACEHOLDER: string;
  FILEUPLOADER_PLACEHOLDER_MULTIPLE: string;
  FILEUPLOADER_BROWSE_TOOLTIP: string;
  FILEUPLOADER_CLEAR_TOOLTIP: string;
  FILEUPLOADER_ROLE_DESCRIPTION: string;
  FILEUPLOADER_SELECTED_FILES: string;

  // SearchField
  SEARCHFIELD_SEARCH: string;
  SEARCHFIELD_CLEAR: string;
  SEARCHFIELD_ARIA_DESCRIPTION: string;
  SEARCHFIELD_ROLE_DESCRIPTION: string;

  // Navigation
  NAVIGATION_EXPAND: string;
  NAVIGATION_COLLAPSE: string;

  // User Menu
  SIGN_OUT: string;

  // FxLayout
  FX_START_PANE: string;
  FX_END_PANE: string;
  FX_RESIZE_START_CENTER: string;
  FX_RESIZE_CENTER_END: string;
  FX_NOTIFICATIONS: string;

  // FxPaneHeader
  FX_OPEN_NAVIGATION: string;
  FX_BACK_TO_LIST: string;
  FX_BACK: string;
  FX_RELATED: string;
  FX_MORE_ACTIONS: string;
  FX_CLOSE: string;

  // FxPromptInput
  FX_ADD: string;
  FX_SEND: string;
  FX_DICTATE: string;
  FX_VOICE: string;

  // FxRenameTitle
  FX_DOUBLE_CLICK_TO_RENAME: string;
  FX_CANCEL: string;
  FX_ACCEPT: string;

  // FxSideNavigation
  FX_MAIN_NAVIGATION: string;
  FX_USER_ACTIONS: string;

  // FxUserMenuContent
  FX_CURRENT_ACCOUNT: string;
  FX_EDIT_ACCOUNTS: string;

  // Link
  LINK_SUBTLE: string;
  LINK_EMPHASIZED: string;

  // SplitButton
  SPLIT_BUTTON_DESCRIPTION: string;
  SPLIT_BUTTON_KEYBOARD_HINT: string;
  SPLIT_BUTTON_ARROW_BUTTON_TOOLTIP: string;

  // Tab / Tabbar
  TAB_SHOW_SUBTABS: string;
  TAB_MORE: string;
  TAB_MORE_TABS: string;
  TAB_MORE_TABS_START: string;
  TABBAR_MORE: string;
  TABBAR_MORE_TABS: string;
  CANCEL: string;

  // SideNavigation
  SIDENAV_ARIA_LABEL: string;
  SIDENAV_ADD_NEW: string;

  // Calendar
  CALENDAR_NAVIGATION: string;
  CALENDAR_CURRENT_DATE: string;
  CALENDAR_SELECT_MONTH: string;
  CALENDAR_SELECT_YEAR: string;
  CALENDAR_DAYS: string;
  CALENDAR_LEGEND: string;
  CALENDAR_PREVIOUS: string;
  CALENDAR_NEXT: string;
  CALENDAR_PREVIOUS_MONTH: string;
  CALENDAR_NEXT_MONTH: string;
  CALENDAR_PREVIOUS_YEAR: string;
  CALENDAR_NEXT_YEAR: string;
  CALENDAR_PREVIOUS_YEAR_RANGE: string;
  CALENDAR_NEXT_YEAR_RANGE: string;
  CALENDAR_YEAR: string;
  CALENDAR_MONTH_YEAR: string;
  CALENDAR_LEGEND_TODAY: string;
  CALENDAR_LEGEND_SELECTED: string;
  CALENDAR_LEGEND_WORKING: string;
  CALENDAR_LEGEND_NONWORKING: string;

  // Card
  CARD_CONTENT: string;

  // List
  LIST_LOADING: string;
  LIST_MORE: string;
  LIST_DELETE: string;
  LIST_DELETE_ITEM: string;
  LIST_DETAILS: string;
  LIST_SHOW_DETAILS: string;

  // BusyIndicator
  BUSYINDICATOR_PLEASE_WAIT: string;

  // ComboBox loading
  COMBOBOX_LOADING: string;

  // Select
  SELECT_PLACEHOLDER: string;

  // MultiComboBox
  MULTICOMBOBOX_DESELECT_ALL: string;
  MULTICOMBOBOX_CLEAR_ALL: string;

  // TagExploration
  TAG_REMOVE: string;

  // TimePicker
  TIMEPICKER_LABEL: string;
  TIMEPICKER_HOURS: string;
  TIMEPICKER_MINUTES: string;
  TIMEPICKER_SECONDS: string;

  // Toolbar
  TOOLBAR_MORE_ACTIONS: string;

  // Notification
  NOTIFICATION_READ: string;
  NOTIFICATION_UNREAD: string;
  NOTIFICATION_MORE_ACTIONS: string;
  NOTIFICATION_CLOSE: string;
  NOTIFICATION_MORE: string;
  NOTIFICATION_LESS: string;

  // FxPaneHeader toggles
  FX_HIDE_LIST: string;
  FX_SHOW_LIST: string;
  FX_HIDE_CHAT: string;
  FX_SHOW_CHAT: string;
  FX_RELATED_SPACES: string;
  FX_RELATED_JOBS: string;
  FX_RELATED_CONVERSATIONS: string;
  FX_ACTIONS: string;
  FX_PROFILE: string;
  FX_TYPE_A_MESSAGE: string;

  // Table loading
  TABLE_LOADING: string;

  // Slider
  SLIDER_ARIA_DESCRIPTION: string;
}

export const RTL_LOCALES = new Set([
  "ar",
  "ar-SA",
  "ar-EG",
  "ar-AE",
  "he",
  "he-IL",
  "fa",
  "fa-IR",
  "ur",
  "ur-PK",
]);

export function isRTLLocale(locale: string): boolean {
  return RTL_LOCALES.has(locale) || RTL_LOCALES.has(locale.split("-")[0]);
}
