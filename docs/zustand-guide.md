# Zustand 状态管理库详细指南

## 1. 核心作用与设计理念

Zustand 是一个轻量级的状态管理库，用于管理 React 应用中的全局状态。它的设计理念是简单、高效、易于使用，同时提供强大的功能。

### 1.1 核心作用

-   **全局状态管理**：管理应用中需要跨组件共享的状态
-   **状态持久化**：支持将状态持久化到本地存储
-   **中间件支持**：提供丰富的中间件，如 persist、devtools 等
-   **类型安全**：完整的 TypeScript 支持
-   **轻量级**：体积小，性能高，依赖少

### 1.2 设计理念

-   **极简 API**：只有一个核心函数 `create`
-   **无样板代码**：不需要 Provider 包装组件树
-   **直接访问状态**：通过自定义 Hook 直接访问和更新状态
-   **不可变更新**：通过 `set` 函数实现不可变状态更新
-   **中间件架构**：支持通过中间件扩展功能

## 2. 设计原理与实现机制

### 2.1 核心设计原理

Zustand 的设计基于以下核心原理：

1. **基于 Hook 的 API**：使用自定义 Hook 访问状态，符合 React 函数式编程范式
2. **闭包和订阅机制**：通过闭包保存状态，使用订阅机制通知组件更新
3. **不可变状态更新**：使用 `set` 函数创建新状态，避免直接修改原状态
4. **中间件模式**：支持通过中间件扩展功能，如持久化、DevTools 集成等
5. **类型安全**：完整的 TypeScript 支持，提供良好的类型推断

### 2.2 实现机制

Zustand 的内部实现可以简化为以下几个核心部分：

1. **状态存储**：使用闭包存储状态
2. **订阅系统**：使用 Set 存储订阅者（组件）
3. **更新机制**：通过 `set` 函数创建新状态并通知订阅者
4. **Hook 包装**：将状态访问和更新逻辑包装为自定义 Hook
5. **中间件管道**：通过中间件处理状态更新和访问

### 2.3 工作流程

1. **创建 Store**：调用 `create` 函数创建状态存储
2. **注册订阅者**：组件调用自定义 Hook 时注册为订阅者
3. **访问状态**：组件通过 Hook 访问当前状态
4. **更新状态**：调用 `set` 函数创建新状态
5. **通知订阅者**：遍历订阅者列表，通知组件更新
6. **重新渲染**：组件接收到更新通知后重新渲染

## 3. 项目中的具体应用场景

### 3.1 状态定义

在项目中，Zustand 的状态定义位于 `src/store/index.ts` 文件中：

```typescript
// 定义store类型
interface AppStore {
    count: number;
    themeMode: 'light' | 'dark';
    isAuthenticated: boolean;
    user: { username: string } | null;
    products: Product[];
    cart: CartItem[];
    isLoading: boolean;
    // 状态更新方法
    increment: () => void;
    decrement: () => void;
    toggleThemeMode: () => void;
    // 更多方法...
}

// 创建store
export const useAppStore = create<AppStore>()(
    persist(
        set => ({
            // 初始状态
            count: 0,
            themeMode: 'light',
            isAuthenticated: false,
            user: null,
            products: [],
            cart: [],
            isLoading: false,
            // 状态更新方法实现
            increment: () => set(state => ({ count: state.count + 1 })),
            // 更多方法实现...
        }),
        // 持久化配置
        {
            name: 'app-storage',
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
```

### 3.2 状态访问

在组件中，可以通过 `useAppStore` Hook 直接访问状态：

```typescript
// 访问单个状态
const themeMode = useAppStore(state => state.themeMode);

// 访问多个状态
const { count, increment, decrement } = useAppStore(state => ({
    count: state.count,
    increment: state.increment,
    decrement: state.decrement,
}));
```

### 3.3 状态更新

状态更新通过调用 store 中定义的方法实现：

```typescript
// 调用状态更新方法
const increment = useAppStore(state => state.increment);

// 使用方式
<button onClick={increment}>增加计数</button>;

// 直接更新状态（不推荐，除非必要）
useAppStore.setState({ count: 10 });
```

## 4. 项目中的具体使用案例

### 4.1 主题管理

**使用场景**：管理应用的浅色/深色主题

**实现方式**：

```typescript
// 状态定义
interface AppStore {
    themeMode: 'light' | 'dark';
    toggleThemeMode: () => void;
    // 其他状态...
}

// 初始状态和更新方法
const useAppStore = create<AppStore>()(
    persist(
        set => ({
            themeMode: 'light',
            toggleThemeMode: () =>
                set(state => ({
                    themeMode: state.themeMode === 'light' ? 'dark' : 'light',
                })),
            // 其他方法...
        }),
        // 持久化配置
        {
            name: 'app-storage',
            partialize: state => ({ themeMode: state.themeMode }),
        }
    )
);

// 组件中使用
const { themeMode, toggleThemeMode } = useAppStore(state => ({
    themeMode: state.themeMode,
    toggleThemeMode: state.toggleThemeMode,
}));

// 使用方式
<Switch checked={themeMode === 'dark'} onChange={toggleThemeMode} checkedChildren="🌙" unCheckedChildren="☀️" />;
```

### 4.2 购物车管理

**使用场景**：管理用户购物车中的商品

**实现方式**：

```typescript
// 购物车商品类型
interface CartItem {
    product: Product;
    quantity: number;
}

// 状态定义
interface AppStore {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    // 其他状态...
}

// 初始状态和更新方法
const useAppStore = create<AppStore>()(
    persist(
        set => ({
            cart: [],
            addToCart: product =>
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
                }),
            // 其他购物车方法...
        }),
        // 持久化配置
        {
            name: 'app-storage',
            partialize: state => ({ cart: state.cart }),
        }
    )
);

// 组件中使用
const { cart, addToCart, removeFromCart } = useAppStore(state => ({
    cart: state.cart,
    addToCart: state.addToCart,
    removeFromCart: state.removeFromCart,
}));

// 使用方式
<Button onClick={() => addToCart(product)}>添加到购物车</Button>;
```

### 4.3 用户认证

**使用场景**：管理用户的登录状态

**实现方式**：

```typescript
// 状态定义
interface AppStore {
    isAuthenticated: boolean;
    user: { username: string } | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    // 其他状态...
}

// 初始状态和更新方法
const useAppStore = create<AppStore>()(persist(
    set => ({
        isAuthenticated: false,
        user: null,
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
        // 其他方法...
    }),
    // 持久化配置
    {
        name: 'app-storage',
        partialize: state => ({
            isAuthenticated: state.isAuthenticated,
            user: state.user
        })
    }
));

// 组件中使用
const { isAuthenticated, user, login, logout } = useAppStore(state => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    login: state.login,
    logout: state.logout
}));

// 使用方式
if (isAuthenticated) {
    <span>欢迎, {user?.username}</span>
    <Button onClick={logout}>退出登录</Button>
} else {
    <Button onClick={() => login('admin', '123456')}>登录</Button>
}
```

## 5. 与其他状态管理方案的比较

### 5.1 与 Redux 的比较

| 特性           | Zustand                 | Redux                                    |
| -------------- | ----------------------- | ---------------------------------------- |
| **API 复杂度** | 极简，只有一个核心函数  | 复杂，需要 Action、Reducer、Store 等概念 |
| **样板代码**   | 几乎没有                | 大量样板代码                             |
| **Provider**   | 不需要                  | 需要用 Provider 包装组件树               |
| **状态访问**   | 直接通过 Hook 访问      | 需要 useSelector Hook 或 connect HOC     |
| **状态更新**   | 直接调用方法或 setState | 需要 dispatch Action                     |
| **中间件**     | 简单的中间件架构        | 复杂的中间件链                           |
| **类型安全**   | 优秀的 TypeScript 支持  | 需要额外配置类型                         |
| **体积**       | 约 1KB                  | 约 2.5KB（核心）+ 中间件                 |
| **学习曲线**   | 平缓                    | 陡峭                                     |

### 5.2 与 Context API 的比较

| 特性           | Zustand                | Context API                             |
| -------------- | ---------------------- | --------------------------------------- |
| **性能**       | 优秀，只更新订阅的组件 | 较差，Provider 下的所有组件都会重新渲染 |
| **状态持久化** | 内置支持               | 需要手动实现                            |
| **中间件**     | 丰富的中间件支持       | 无中间件支持                            |
| **类型安全**   | 优秀的 TypeScript 支持 | 基本的 TypeScript 支持                  |
| **API 复杂度** | 极简                   | 简单，但需要创建多个 Context            |
| **状态更新**   | 直接调用方法           | 需要 useReducer 或 useState             |
| **调试**       | 支持 Redux DevTools    | 有限的调试能力                          |

### 5.3 与 MobX 的比较

| 特性           | Zustand                | MobX                             |
| -------------- | ---------------------- | -------------------------------- |
| **响应式机制** | 基于订阅的手动更新     | 基于 Proxy 的自动更新            |
| **学习曲线**   | 平缓                   | 中等，需要理解 MobX 的响应式概念 |
| **体积**       | 约 1KB                 | 约 16KB                          |
| **类型安全**   | 优秀的 TypeScript 支持 | 良好的 TypeScript 支持           |
| **不可变性**   | 强制不可变更新         | 允许可变更新                     |
| **中间件**     | 丰富的中间件支持       | 无内置中间件                     |
| **性能**       | 优秀                   | 良好，但 Proxy 有一定性能开销    |

## 6. Zustand 的优势与特点

### 6.1 优势

1. **极简 API**：学习成本低，容易上手
2. **高性能**：只更新订阅的组件，避免不必要的渲染
3. **体积小**：核心库只有约 1KB，几乎不增加应用体积
4. **类型安全**：完整的 TypeScript 支持，提供良好的类型推断
5. **无 Provider**：不需要用 Provider 包装组件树，减少了组件层级
6. **中间件支持**：提供丰富的中间件，如 persist、devtools 等
7. **灵活的状态更新**：支持直接更新状态或通过方法更新
8. **易于集成**：可以与其他库（如 React Router、Redux DevTools 等）轻松集成

### 6.2 特点

1. **函数式编程范式**：符合 React 的函数式编程理念
2. **不可变状态**：通过 `set` 函数实现不可变状态更新
3. **闭包状态管理**：使用闭包存储状态，避免了全局变量的问题
4. **订阅机制**：高效的订阅系统，只通知订阅的组件
5. **中间件架构**：支持通过中间件扩展功能
6. **异步支持**：天然支持异步操作

## 7. 核心 API 详解

### 7.1 create

`create` 是 Zustand 的核心函数，用于创建状态存储：

```typescript
import { create } from 'zustand';

const useStore = create<StoreType>(set => ({
    // 初始状态
    count: 0,
    // 状态更新方法
    increment: () => set(state => ({ count: state.count + 1 })),
}));
```

**参数**：

-   `set`: 用于更新状态的函数，接受一个回调函数或状态对象

**返回值**：

-   一个自定义 Hook，用于在组件中访问和更新状态

### 7.2 set 函数

`set` 函数用于更新状态，有两种使用方式：

```typescript
// 方式 1：传入状态对象
set({ count: 10 });

// 方式 2：传入回调函数（推荐，用于基于当前状态更新）
set(state => ({ count: state.count + 1 }));
```

### 7.3 persist 中间件

`persist` 中间件用于将状态持久化到本地存储：

```typescript
import { persist } from 'zustand/middleware';

const useStore = create<StoreType>()(
    persist(
        set => ({
            // 初始状态和方法
        }),
        {
            name: 'store-name', // 本地存储的键名
            partialize: state => ({
                /* 只持久化需要的状态 */
            }),
            storage: {
                /* 自定义存储方式 */
            },
        }
    )
);
```

### 7.4 访问和更新状态

```typescript
// 访问状态
const count = useStore(state => state.count);

// 访问多个状态
const { count, increment } = useStore(state => ({
    count: state.count,
    increment: state.increment,
}));

// 更新状态
increment();

// 直接更新状态（不推荐）
useStore.setState({ count: 10 });
```

## 8. 最佳实践

### 8.1 状态设计

-   **状态扁平化**：避免嵌套过深的状态结构
-   **职责单一**：每个状态只负责一个功能
-   **合理拆分 store**：对于大型应用，可以拆分为多个 store
-   **使用 TypeScript**：为 store 定义明确的类型

### 8.2 状态访问

-   **只访问需要的状态**：避免访问不需要的状态，减少不必要的重新渲染
-   **使用选择器**：使用选择器函数只获取需要的状态
-   **避免在渲染中创建选择器**：将选择器定义在组件外部或使用 `useCallback` 缓存

### 8.3 状态更新

-   **使用不可变更新**：始终使用 `set` 函数更新状态，不要直接修改原状态
-   **基于当前状态更新**：对于基于当前状态的更新，使用回调函数形式
-   **批量更新**：可以在一个 `set` 调用中更新多个状态

### 8.4 中间件使用

-   **合理使用中间件**：根据需要选择合适的中间件
-   **持久化关键状态**：只持久化必要的状态，避免存储过大的数据
-   **使用 devtools 进行调试**：在开发环境中使用 devtools 中间件

### 8.5 性能优化

-   **使用选择器减少重渲染**：只选择需要的状态
-   **缓存选择器**：使用 `useCallback` 或 `createSelector` 缓存选择器
-   **避免在渲染中创建新对象**：将对象定义在组件外部

## 9. 项目中的实际应用案例

### 9.1 ZustandDemo.tsx

**使用场景**：演示 Zustand 的基本使用

**核心代码**：

```typescript
import { useAppStore } from '@/store';

const ZustandDemo = () => {
    // 访问状态和方法
    const { count, increment, decrement, setCount } = useAppStore(state => ({
        count: state.count,
        increment: state.increment,
        decrement: state.decrement,
        setCount: state.setCount,
    }));

    return (
        <div>
            <h2>Zustand 计数器演示</h2>
            <p>当前计数: {count}</p>
            <button onClick={increment}>增加</button>
            <button onClick={decrement}>减少</button>
            <button onClick={() => setCount(0)}>重置</button>
        </div>
    );
};
```

### 9.2 Home.tsx

**使用场景**：在首页中使用 Zustand 管理登录状态和主题

**核心代码**：

```typescript
import { useAppStore } from '@/store';

const Home = () => {
    // 访问认证状态和用户信息
    const { isAuthenticated, user, logout } = useAppStore(state => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        logout: state.logout,
    }));

    return (
        <div>
            <h1>首页</h1>
            {isAuthenticated ? (
                <div>
                    <p>欢迎, {user?.username}</p>
                    <Button onClick={logout}>退出登录</Button>
                </div>
            ) : (
                <Button onClick={() => navigate('/login')}>登录</Button>
            )}
            {/* 其他内容 */}
        </div>
    );
};
```

### 9.3 CartDemo.tsx

**使用场景**：使用 Zustand 管理购物车状态

**核心代码**：

```typescript
import { useAppStore } from '@/store';

const CartDemo = () => {
    // 访问购物车状态和方法
    const { cart, addToCart, removeFromCart, updateQuantity } = useAppStore(state => ({
        cart: state.cart,
        addToCart: state.addToCart,
        removeFromCart: state.removeFromCart,
        updateQuantity: state.updateQuantity,
    }));

    // 计算购物车总价
    const cartTotal = cart.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);

    return (
        <div>
            <h2>购物车</h2>
            {/* 购物车商品列表 */}
            {cart.map(item => (
                <div key={item.product.id}>
                    <p>{item.product.name}</p>
                    <p>数量: {item.quantity}</p>
                    <p>价格: ￥{item.product.price.toFixed(2)}</p>
                    <Button onClick={() => removeFromCart(item.product.id)}>删除</Button>
                    <InputNumber min={1} value={item.quantity} onChange={value => updateQuantity(item.product.id, value || 1)} />
                </div>
            ))}
            {/* 购物车总价 */}
            <p>总价: ￥{cartTotal.toFixed(2)}</p>
        </div>
    );
};
```

## 10. 内部原理深度解析

### 10.1 Zustand 核心实现

Zustand 的核心实现可以简化为以下伪代码：

```typescript
// 简化的 create 函数实现
function create(initializer) {
    // 存储状态
    let state = {};
    // 存储订阅者
    const subscribers = new Set();

    // 创建 store
    const store = {
        // 获取当前状态
        getState: () => state,
        // 更新状态
        setState: (partial, replace) => {
            // 创建新状态
            const nextState = replace ? (typeof partial === 'function' ? partial(state) : partial) : { ...state, ...(typeof partial === 'function' ? partial(state) : partial) };

            // 如果状态没有变化，不通知订阅者
            if (nextState !== state) {
                state = nextState;
                // 通知所有订阅者
                subscribers.forEach(callback => callback(state));
            }
        },
        // 订阅状态变化
        subscribe: callback => {
            subscribers.add(callback);
            // 返回取消订阅的函数
            return () => subscribers.delete(callback);
        },
    };

    // 初始化状态
    const { setState } = store;
    state = initializer(setState, store.getState);

    // 返回自定义 Hook
    return () => {
        const [, forceUpdate] = useState(0);

        useEffect(() => {
            // 订阅状态变化
            const unsubscribe = store.subscribe(() => {
                // 状态变化时，强制组件重新渲染
                forceUpdate(n => n + 1);
            });

            // 组件卸载时取消订阅
            return unsubscribe;
        }, []);

        // 返回当前状态
        return store.getState();
    };
}
```

### 10.2 中间件机制

Zustand 的中间件机制允许在状态更新前后执行额外的逻辑：

```typescript
// 简化的中间件实现
function middleware(storeInitializer) {
    return (set, get, store) => {
        // 在 store 初始化前执行逻辑

        // 创建增强的 set 函数
        const enhancedSet = (...args) => {
            // 在状态更新前执行逻辑
            set(...args);
            // 在状态更新后执行逻辑
        };

        // 初始化 store
        return storeInitializer(enhancedSet, get, store);
    };
}
```

## 11. 调试与开发工具

### 11.1 Redux DevTools 支持

Zustand 支持 Redux DevTools，可以方便地调试状态变化：

```typescript
import { devtools } from 'zustand/middleware';

const useStore = create<StoreType>()(
    devtools(
        set => ({
            // 初始状态和方法
        }),
        {
            name: 'store-name',
        }
    )
);
```

### 11.2 常见调试技巧

1. **使用 devtools 中间件**：可视化查看状态变化
2. **添加日志中间件**：记录所有状态更新
3. **使用 TypeScript**：利用类型检查发现潜在问题
4. **拆分 store**：将复杂状态拆分为多个小 store，便于调试
5. **使用 partialize**：只持久化必要的状态，减少调试干扰

## 12. 总结

Zustand 是一个优秀的状态管理库，它的设计理念是简单、高效、易于使用。它提供了极简的 API，不需要 Provider 包装组件树，支持状态持久化和中间件，具有优秀的 TypeScript 支持。

在项目中，Zustand 被用于管理全局状态，包括主题、用户认证、购物车等。它的使用方式简单直观，性能优秀，是一个很好的状态管理解决方案。

相比其他状态管理方案，Zustand 具有以下优势：

-   极简的 API，学习曲线平缓
-   几乎没有样板代码
-   不需要 Provider 包装组件树
-   优秀的性能，只更新订阅的组件
-   内置状态持久化支持
-   丰富的中间件生态
-   优秀的 TypeScript 支持
-   轻量级，体积小

Zustand 适合各种规模的 React 应用，从简单的个人项目到复杂的企业应用都可以使用。它的设计理念和 API 设计使其成为 React 状态管理的一个优秀选择。

## 13. 参考资源

-   [Zustand 官方文档](https://zustand-demo.pmnd.rs/)
-   [Zustand GitHub 仓库](https://github.com/pmndrs/zustand)
-   [Zustand 中间件文档](https://docs.pmnd.rs/zustand/middleware/persist)
-   [Zustand 最佳实践](https://docs.pmnd.rs/zustand/guides/best-practices)

---

## 附录：项目中使用的相关文件

### src/store/index.ts

```typescript
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
    // 更多商品...
];

// 模拟API请求
const mockGetProductsAPI = async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockProductsData;
};

const mockLoginAPI = async (username: string, password: string): Promise<{ success: boolean; user?: { username: string } }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (username === 'admin' && password === '123456') {
        return { success: true, user: { username } };
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
                        set({ isAuthenticated: true, user: response.user });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Login error:', error);
                    return false;
                }
            },
            logout: () => set({ isAuthenticated: false, user: null }),
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
            addToCart: product => {
                set(state => {
                    const existingItem = state.cart.find(item => item.product.id === product.id);
                    let newCart;
                    if (existingItem) {
                        newCart = state.cart.map(item => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
                    } else {
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
                        const newCart = state.cart.filter(item => item.product.id !== productId);
                        return { cart: newCart };
                    }
                    const newCart = state.cart.map(item => (item.product.id === productId ? { ...item, quantity } : item));
                    return { cart: newCart };
                });
            },
            clearCart: () => set({ cart: [] }),
            getCartTotal: () => 0,
        }),
        {
            name: 'app-storage',
            partialize: state => ({
                count: state.count,
                themeMode: state.themeMode,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                cart: state.cart,
            }),
        }
    )
);
```
