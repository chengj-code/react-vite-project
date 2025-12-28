import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义商品类型
export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
}

// 定义购物车商品类型
export interface CartItem {
    product: Product;
    quantity: number;
}

// 定义store类型
interface AppStore {
    count: number;
    themeMode: 'light' | 'dark';
    isAuthenticated: boolean;
    user: { username: string } | null;
    products: Product[];
    cart: CartItem[];
    isLoading: boolean;
    increment: () => void;
    decrement: () => void;
    toggleThemeMode: () => void;
    setCount: (count: number) => void;
    setThemeMode: (themeMode: 'light' | 'dark') => void;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    fetchProducts: () => Promise<void>;
}

// 模拟商品数据
const mockProductsData: Product[] = [
    {
        id: 1,
        name: '笔记本电脑',
        price: 0.1,
        image: 'https://via.placeholder.com/200x200?text=笔记本电脑',
        description: '高性能笔记本电脑，适合办公和游戏',
    },
    {
        id: 2,
        name: '智能手机',
        price: 0.2,
        image: 'https://via.placeholder.com/200x200?text=智能手机',
        description: '最新款智能手机，拍照性能出色',
    },
    {
        id: 3,
        name: '无线耳机',
        price: 999,
        image: 'https://via.placeholder.com/200x200?text=无线耳机',
        description: '降噪无线耳机，音质优秀，非常好用',
    },
    {
        id: 4,
        name: '智能手表',
        price: 1999,
        image: 'https://via.placeholder.com/200x200?text=智能手表',
        description: '多功能智能手表，健康监测功能齐全',
    },
    {
        id: 5,
        name: '平板电脑',
        price: 3999,
        image: 'https://via.placeholder.com/200x200?text=平板电脑',
        description: '轻薄便携平板电脑，适合娱乐和学习',
    },
    {
        id: 6,
        name: '游戏手柄',
        price: 499,
        image: 'https://via.placeholder.com/200x200?text=游戏手柄',
        description: '专业游戏手柄，提供沉浸式游戏体验',
    },
];

// 模拟获取商品列表API
const mockGetProductsAPI = async (): Promise<Product[]> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockProductsData;
};

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

// 创建store
export const useAppStore = create<AppStore>()(
    persist(
        set => ({
            count: 0,
            themeMode: 'light',
            isAuthenticated: false,
            user: null,
            products: [],
            cart: [],
            isLoading: false,
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
                set({
                    isAuthenticated: false,
                    user: null,
                });
            },
            // 获取商品列表
            fetchProducts: async () => {
                set({ isLoading: true });
                try {
                    const products = await mockGetProductsAPI();
                    set({ products, isLoading: false });
                } catch (error) {
                    console.error('Failed to fetch products:', error);
                    set({ isLoading: false });
                }
            },
            // 购物车方法
            addToCart: product => {
                set(state => {
                    // 检查商品是否已在购物车中
                    const existingItem = state.cart.find(item => item.product.id === product.id);
                    let newCart;

                    if (existingItem) {
                        // 如果已存在，数量+1
                        newCart = state.cart.map(item => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
                    } else {
                        // 如果不存在，添加到购物车
                        newCart = [...state.cart, { product, quantity: 1 }];
                    }

                    return { cart: newCart };
                });
            },
            removeFromCart: productId => {
                set(state => {
                    const newCart = state.cart.filter(item => item.product.id !== productId);
                    return { cart: newCart };
                });
            },
            updateQuantity: (productId, quantity) => {
                set(state => {
                    if (quantity <= 0) {
                        // 如果数量为0，移除商品
                        const newCart = state.cart.filter(item => item.product.id !== productId);
                        return { cart: newCart };
                    }

                    const newCart = state.cart.map(item => (item.product.id === productId ? { ...item, quantity } : item));
                    return { cart: newCart };
                });
            },
            clearCart: () => {
                set({ cart: [] });
            },
            getCartTotal: () => {
                // 在组件中使用useAppStore(state => state.cart.reduce(...))来计算总价
                return 0;
            },
        }),
        {
            name: 'app-storage', // 本地存储的键名
            partialize: state => ({
                // 只持久化需要的数据
                count: state.count,
                themeMode: state.themeMode,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                cart: state.cart,
            }),
        }
    )
);
