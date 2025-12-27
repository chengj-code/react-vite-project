// 主题颜色配置
export interface ThemeColors {
  background: string;
  text: string;
  border: string;
  shadow: string;
  inputBg: string;
  inputText: string;
  inputBorder: string;
  placeholder: string;
  stats: string;
  // 统计信息区域
  statsBg: string;
  statsBorder: string;
  // 按钮颜色
  buttonPrimary: string;
  buttonSuccess: string;
  buttonDanger: string;
  buttonEdit: string;
}

// 浅色主题
export const lightTheme: ThemeColors = {
  background: '#ffffff',
  text: '#000000',
  border: '#d9d9d9',
  shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  inputBg: '#ffffff',
  inputText: '#000000',
  inputBorder: '#d9d9d9',
  placeholder: '#d9d9d9',
  stats: '#666666',
  // 统计信息区域
  statsBg: '#f5f5f5',
  statsBorder: '#e8e8e8',
  // 按钮颜色
  buttonPrimary: '#1890ff',
  buttonSuccess: '#52c41a',
  buttonDanger: '#ff4d4f',
  buttonEdit: '#1890ff',
};

// 深色主题
export const darkTheme: ThemeColors = {
  background: '#1f1f1f',
  text: '#ffffff',
  border: '#333333',
  shadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
  inputBg: '#333333',
  inputText: '#ffffff',
  inputBorder: '#555555',
  placeholder: '#999999',
  stats: '#cccccc',
  // 统计信息区域
  statsBg: '#2c2c2c',
  statsBorder: '#333333',
  // 按钮颜色
  buttonPrimary: '#1890ff',
  buttonSuccess: '#52c41a',
  buttonDanger: '#ff4d4f',
  buttonEdit: '#1890ff',
};

// 获取当前主题颜色
export const getThemeColors = (theme: 'light' | 'dark'): ThemeColors => {
  return theme === 'dark' ? darkTheme : lightTheme;
};
