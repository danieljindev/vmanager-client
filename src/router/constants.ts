// 路由常量配置信息

export const SETTING = {
  BASE: { name: 'My Profile', path: '/home/setting/base' },

  INNER_MESSAGE: { name: 'Message Center', path: '/home/setting/innerMessage' },

  NOTIFICATION: { name: 'Notification Setting', path: '/home/setting/notification' },

  ACCOUNT: { name: 'Account Setting', path: '/home/setting/account' },
}

export const HOME = {
  LOGIN: { name: 'Login', path: ['/', '/login'] },

  HOME: { name: '', path: '/home' },

  HOME_INDEX: { name: 'Dashboard', path: '/home/index' },

  REMINDER: { name: 'Reminder', path: '/home/reminder' },

  COMPANY: { name: 'Company', path: '/home/company' },

  SETTING_INDEX: { name: 'Setting', path: '/home/setting' },

  TODAY_TASK: { name: 'Tasks', path: '/home/todayTask' },

  MEMORANDUM: { name: 'Note List', path: '/home/memorandum' },
  MEMORANDUM_CREATE: { name: 'Create Note', path: [
    '/home/memorandum/create', '/home/memorandum/update/:id'
  ] },
  MEMORANDUM_DETAIL: { name: '*', path: '/home/memorandum/detail/:id' },

  CAPITAL_FLOW: { name: 'Capital Flow', path: '/home/capitalFlow' },
  CAPITAL_FLOW_TYPE: { name: 'Capital Type', path: '/home/capitalFlow/type' },

  TODO_LIST: { name: 'Activities', path: '/home/todoList' },

  NO_MATCH: { name: '404 Not Found', path: '*' },
}
