import { create } from 'zustand';

// 定义store类型
interface AppStore {
    count: number;
    themeMode: 'light' | 'dark';
    isAuthenticated: boolean;
    user: { username: string } | null;
    increment: () => void;
    decrement: () => void;
    toggleThemeMode: () => void;
    setCount: (count: number) => void;
    setThemeMode: (themeMode: 'light' | 'dark') => void;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

// 模拟登录API请求
const mockLoginAPI = async (username: string, password: string): Promise<{ success: boolean; user?: { username: string } }> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 演示账号
    if (username === 'admin' && password === '123456') {
        return {
            success: true,
            user: { username },
        };
    }

    return { success: false };
};

// 获取本地存储的用户信息
const getStoredUser = (): { username: string } | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// 创建store
export const useAppStore = create<AppStore>(set => ({
    count: 0,
    themeMode: 'light',
    isAuthenticated: !!getStoredUser(),
    user: getStoredUser(),
    increment: () => set(state => ({ count: state.count + 1 })),
    decrement: () => set(state => ({ count: state.count - 1 })),
    toggleThemeMode: () =>
        set(state => ({
            themeMode: state.themeMode === 'light' ? 'dark' : 'light',
        })),
    setCount: count => set({ count }),
    setThemeMode: themeMode => set({ themeMode }),
    login: async (username, password) => {
        try {
            const response = await mockLoginAPI(username, password);
            if (response.success && response.user) {
                // 存储到localStorage
                localStorage.setItem('user', JSON.stringify(response.user));
                set({
                    isAuthenticated: true,
                    user: response.user,
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },
    logout: () => {
        // 清除localStorage
        localStorage.removeItem('user');
        set({
            isAuthenticated: false,
            user: null,
        });
    },
}));
