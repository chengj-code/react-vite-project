# React Router 全面使用指南

## 1. 引言

React Router 是一个用于构建单页应用（SPA）的标准路由库，它允许开发者在 React 应用中实现客户端路由管理。React Router 的核心功能是将 URL 路径映射到对应的 React 组件，实现页面之间的无缝切换，而无需刷新整个页面。

本指南将全面总结 React Router 的使用方法，包括基础配置、路由嵌套、路由守卫、懒加载、传参方法、编程式导航、匹配规则和常见问题处理方案，适合作为 React Router 使用参考文档。

## 2. 基础路由配置

### 2.1 安装与基本设置

首先，需要安装 React Router：

```bash
# 使用npm
npm install react-router-dom

# 使用yarn
yarn add react-router-dom

# 使用pnpm
pnpm add react-router-dom
```

### 2.2 核心组件

React Router 提供了几个核心组件用于配置路由：

-   **BrowserRouter**：使用 HTML5 的 History API 实现路由，是最常用的路由类型
-   **Routes**：包裹多个 Route 组件，负责匹配和渲染当前 URL 对应的 Route
-   **Route**：定义 URL 路径与 React 组件的映射关系

### 2.3 基本路由配置示例

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import About from './views/About';
import Contact from './views/Contact';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </Router>
    );
};

export default App;
```

### 2.4 项目中的基础路由配置

在本项目中，路由配置位于`src/routes/index.tsx`文件中：

```typescript
import { Routes, Route } from 'react-router-dom';

// 导入页面组件
import Home from '@/views/Home';
import ToDoList from '@/views/ToDoList';
import ReducerContent from '@/views/ReduerContent';
import ZustandDemo from '@/views/ZustandDemo';
import Login from '@/views/Login';
import CartDemo from '@/views/CartDemo';

// 全局路由配置
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/todo" element={<ToDoList />} />
            <Route path="/reducer" element={<ReducerContent />} />
            <Route path="/zustand" element={<ZustandDemo />} />
            <Route path="/cart" element={<CartDemo />} />
            <Route path="*" element={<Home />} /> {/* 404路由 */}
        </Routes>
    );
};

export default AppRoutes;
```

## 3. 路由嵌套

### 3.1 概念解释

路由嵌套是 React Router 中的一项核心功能，它允许开发者创建具有层级结构的路由系统，其中父路由的组件中包含子路由的出口，用于渲染匹配的子路由组件。这种结构能够很好地反映应用的层次关系，实现布局复用，并简化路由管理。

### 3.2 适用场景

路由嵌套适用于以下场景：

-   **具有层级结构的应用**：如后台管理系统，通常包含侧边栏导航和主内容区，侧边栏导航对应父路由，主内容区对应子路由
-   **需要共享布局的页面**：多个页面共享相同的头部、导航栏或页脚时，可将共享布局放在父组件中
-   **复杂应用的路由管理**：大型应用需要将路由按照功能模块进行组织，便于维护和扩展
-   **动态路由内容**：根据不同的路由参数显示不同的内容，如商品详情页、用户个人中心等

### 3.3 实现步骤

实现嵌套路由需要以下几个步骤：

1. **配置父路由**：定义父路由，并在其组件中添加`Outlet`组件作为子路由的出口
2. **配置子路由**：在父路由下定义子路由，使用相对路径
3. **添加导航链接**：在父组件中添加指向子路由的导航链接
4. **实现子组件**：创建子路由对应的组件

### 3.4 完整代码示例

以下是一个多级路由嵌套的完整示例：

```typescript
import { Routes, Route, Outlet, Link, useNavigate } from 'react-router-dom';

// 最外层布局组件
const Layout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
            {/* 侧边栏导航 */}
            <nav style={{ width: '200px', padding: '20px', backgroundColor: '#fff', borderRight: '1px solid #e0e0e0' }}>
                <h2 style={{ marginBottom: '20px', color: '#1890ff' }}>应用导航</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '10px' }}>
                        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
                            首页
                        </Link>
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333' }}>
                            仪表板
                        </Link>
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                        <Link to="/products" style={{ textDecoration: 'none', color: '#333' }}>
                            商品管理
                        </Link>
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                        <Link to="/users" style={{ textDecoration: 'none', color: '#333' }}>
                            用户管理
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* 主内容区 - 子路由出口 */}
            <main style={{ flex: 1, padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
};

// 仪表板组件
const Dashboard = () => {
    return (
        <div>
            <h1>仪表板</h1>
            <p>欢迎来到仪表板页面！</p>
        </div>
    );
};

// 商品管理父组件
const Products = () => {
    return (
        <div>
            <h1>商品管理</h1>

            {/* 商品管理子导航 */}
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
                <Link to="/products" style={{ marginRight: '15px', textDecoration: 'none', color: '#1890ff' }}>
                    商品列表
                </Link>
                <Link to="/products/add" style={{ marginRight: '15px', textDecoration: 'none', color: '#1890ff' }}>
                    添加商品
                </Link>
                <Link to="/products/categories" style={{ textDecoration: 'none', color: '#1890ff' }}>
                    商品分类
                </Link>
            </div>

            {/* 商品管理子路由出口 */}
            <Outlet />
        </div>
    );
};

// 商品列表组件
const ProductList = () => {
    return (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
            <h2>商品列表</h2>
            <p>这里显示商品列表...</p>
        </div>
    );
};

// 添加商品组件
const AddProduct = () => {
    return (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
            <h2>添加商品</h2>
            <p>这里是添加商品表单...</p>
        </div>
    );
};

// 商品分类组件
const ProductCategories = () => {
    return (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
            <h2>商品分类</h2>
            <p>这里显示商品分类...</p>
        </div>
    );
};

// 用户管理父组件
const Users = () => {
    return (
        <div>
            <h1>用户管理</h1>

            {/* 用户管理子导航 */}
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
                <Link to="/users" style={{ marginRight: '15px', textDecoration: 'none', color: '#1890ff' }}>
                    用户列表
                </Link>
                <Link to="/users/profile" style={{ textDecoration: 'none', color: '#1890ff' }}>
                    个人资料
                </Link>
            </div>

            {/* 用户管理子路由出口 */}
            <Outlet />
        </div>
    );
};

// 用户列表组件
const UserList = () => {
    return (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
            <h2>用户列表</h2>
            <p>这里显示用户列表...</p>
        </div>
    );
};

// 个人资料组件
const UserProfile = () => {
    return (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
            <h2>个人资料</h2>
            <p>这里显示个人资料...</p>
        </div>
    );
};

// 首页组件
const Home = () => {
    return (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
            <h1>首页</h1>
            <p>欢迎来到应用首页！</p>
        </div>
    );
};

// 路由配置
const AppRoutes = () => {
    return (
        <Routes>
            {/* 根路由 */}
            <Route path="/" element={<Layout />}>
                {/* 首页子路由 */}
                <Route index element={<Home />} />

                {/* 仪表板子路由 */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* 商品管理子路由 - 二级嵌套 */}
                <Route path="products" element={<Products />}>
                    <Route index element={<ProductList />} />
                    <Route path="add" element={<AddProduct />} />
                    <Route path="categories" element={<ProductCategories />} />
                </Route>

                {/* 用户管理子路由 - 二级嵌套 */}
                <Route path="users" element={<Users />}>
                    <Route index element={<UserList />} />
                    <Route path="profile" element={<UserProfile />} />
                    {/* 三级嵌套示例 */}
                    <Route path=":id" element={<UserDetail />}>
                        <Route index element={<UserDetailOverview />} />
                        <Route path="settings" element={<UserDetailSettings />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

// 三级嵌套组件示例
const UserDetail = () => {
    return (
        <div>
            <h2>用户详情</h2>
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <Link to={'.'} style={{ marginRight: '15px', textDecoration: 'none', color: '#1890ff' }}>
                    概览
                </Link>
                <Link to={'./settings'} style={{ textDecoration: 'none', color: '#1890ff' }}>
                    设置
                </Link>
            </div>
            <Outlet />
        </div>
    );
};

const UserDetailOverview = () => {
    return <div>用户详情概览</div>;
};

const UserDetailSettings = () => {
    return <div>用户详情设置</div>;
};
```

### 3.5 路由匹配规则

嵌套路由的匹配规则遵循以下原则：

1. **相对路径**：子路由的路径是相对于父路由的，不需要包含父路由的完整路径
2. **索引路由**：使用`index`属性定义父路由的默认子路由，当访问父路由路径时，会渲染索引路由组件
3. **深度优先匹配**：React Router 会按照深度优先的顺序匹配路由，先匹配父路由，再匹配子路由
4. **精确匹配**：更具体的路径优先匹配，例如`/users/123/settings`会优先于`/users/123`匹配

### 3.6 注意事项

1. **确保父组件包含 Outlet**：父组件必须包含`Outlet`组件，否则子路由组件无法渲染
2. **使用相对路径**：子路由路径应使用相对路径，避免硬编码完整路径
3. **合理组织路由结构**：根据应用功能模块组织路由，避免过深的嵌套
4. **使用索引路由**：为父路由添加索引路由，避免出现空白内容
5. **考虑路由守卫**：根据需要为嵌套路由添加路由守卫，保护敏感内容

### 3.7 常见问题解决方案

#### 3.7.1 子路由组件不显示

**问题**：访问子路由时，子路由组件没有显示

**解决方案**：

-   检查父组件是否包含`Outlet`组件
-   检查子路由路径是否正确，是否使用了相对路径
-   检查路由配置顺序，确保子路由在父路由内部正确嵌套

#### 3.7.2 嵌套路由守卫不生效

**问题**：为嵌套路由添加的守卫没有生效

**解决方案**：

-   确保路由守卫组件正确返回`Outlet`或`Navigate`组件
-   检查路由守卫的位置，确保它包裹了需要保护的子路由
-   对于多级嵌套路由，考虑使用多个路由守卫，分别保护不同层级的路由

#### 3.7.3 路由参数冲突

**问题**：多级嵌套路由中，不同层级的路由参数同名，导致冲突

**解决方案**：

-   使用不同的参数名，避免同名参数
-   在组件中明确指定参数类型，使用 TypeScript 的泛型约束
-   考虑使用查询字符串传递参数，避免 URL 路径中的参数冲突

## 4. 路由守卫

### 4.1 什么是路由守卫

路由守卫用于控制路由的访问权限，确保只有满足特定条件的用户才能访问某些路由。

### 4.2 实现路由守卫

在 React Router v6 中，路由守卫通常通过高阶组件或自定义组件实现：

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/store';

// 路由守卫组件
const ProtectedRoute = () => {
    const isAuthenticated = useAppStore(state => state.isAuthenticated);

    if (!isAuthenticated) {
        // 未登录，重定向到登录页
        return <Navigate to="/login" replace />;
    }

    // 已登录，渲染子组件
    return <Outlet />;
};

// 路由配置
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* 受保护的路由 */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
            </Route>
        </Routes>
    );
};
```

### 4.3 路由守卫的应用场景

-   用户认证和授权
-   角色权限控制
-   页面访问限制
-   数据加载保护

## 5. 路由懒加载

### 5.1 概念解释

路由懒加载（Route Lazy Loading）是一种性能优化技术，它允许在用户访问特定路由时才加载对应的组件，而不是在应用初始化时就加载所有组件。这是基于 React 的代码分割（Code Splitting）功能实现的，通过将应用代码分割成多个小块（chunks），实现按需加载，从而提高应用的初始加载速度。

### 5.2 适用场景

路由懒加载适用于以下场景：

-   **大型应用**：包含多个页面和复杂组件的大型应用，初始加载时间较长
-   **低频访问页面**：某些页面只有特定用户或在特定情况下才会访问
-   **性能敏感应用**：对初始加载时间要求较高的应用，如移动应用、营销页面等
-   **组件体积较大**：某些组件包含大量代码、图片或依赖，导致打包体积过大
-   **分模块开发**：应用按功能模块开发，各模块相对独立，可独立加载

### 5.3 代码分割原理

代码分割是指将应用的 JavaScript 代码分割成多个小块（chunks），在需要时才加载。React Router 的路由懒加载基于以下技术：

1. **动态导入（Dynamic Imports）**：使用 ES 模块的动态导入语法`import()`，允许在运行时异步加载模块
2. **Webpack 代码分割**：Webpack 等打包工具会识别动态导入语句，并将其打包成独立的 chunk
3. **React.lazy()**：React 提供的`lazy()`函数，用于包装动态导入的组件
4. **Suspense 组件**：React 提供的`Suspense`组件，用于在组件加载过程中显示加载状态

### 5.3.1 Suspense 的必要性

**问题**：路由懒加载时不使用`Suspense`组件会有问题吗？

**答案**：会导致运行时错误，这是 React 设计的刻意行为。

#### 5.3.1.1 根本原因

1. **React.lazy() 的返回值**：`React.lazy(() => import('./Component'))` 返回的是一个特殊的 React 组件，它的渲染过程是异步的：

    - 首次渲染时，会触发组件的加载（执行 `import()`）
    - 加载过程中，组件处于**pending 状态**
    - 加载完成后，组件才会渲染实际内容

2. **React 的渲染要求**：React 要求同步渲染组件树。当遇到异步组件（处于 pending 状态）时，它不知道应该显示什么，因此需要一个「占位符」或「加载状态」来填补这个空隙。

3. **Suspense 的作用**：`Suspense` 组件就是用来解决这个问题的：
    - 它监听子组件树中的异步加载状态
    - 当检测到异步组件处于 pending 状态时，显示 `fallback` 属性指定的加载内容
    - 当异步组件加载完成后，自动替换为实际组件内容

#### 5.3.1.2 错误现象

当你使用 `React.lazy()` 定义懒加载组件，但不使用 `Suspense` 包裹时，React 会抛出以下错误：

```
Error: A React component suspended while rendering, but no fallback UI was specified.
Add a <Suspense fallback={...}> component higher in the tree to provide a loading indicator or placeholder to display.
```

#### 5.3.1.3 常见误区

1. **只在部分路由上使用 Suspense**：

    - **错误**：只在单个懒加载路由上使用 Suspense
    - **正确**：在所有懒加载路由的共同祖先上使用单个 Suspense（通常是路由配置的最外层）

2. **多层 Suspense**：
    - 当有多个懒加载组件时，可以使用多层 Suspense 实现更精细的加载控制
    - 外层 Suspense 显示全局加载状态，内层 Suspense 显示局部加载状态

### 5.4 实现步骤

实现路由懒加载需要以下几个步骤：

1. **配置动态导入**：使用`React.lazy()`包装动态导入的组件
2. **添加 Suspense 组件**：使用`Suspense`组件包裹懒加载组件，提供加载状态
3. **配置错误边界**：添加错误边界组件，处理组件加载失败的情况
4. **优化加载体验**：设计友好的加载状态和错误提示

### 5.5 完整代码示例

#### 5.5.1 基本配置

```typescript
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// 懒加载组件
const Home = lazy(() => import('./views/Home'));
const About = lazy(() => import('./views/About'));
const Contact = lazy(() => import('./views/Contact'));
const Dashboard = lazy(() => import('./views/Dashboard'));
const Settings = lazy(() => import('./views/Settings'));

// 加载中组件
const LoadingSpinner = () => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '20px',
            color: '#1890ff',
        }}
    >
        <div
            style={{
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #f0f0f0',
                    borderTop: '4px solid #1890ff',
                    borderRadius: '50%',
                    margin: '0 auto 16px',
                    animation: 'spin 1s linear infinite',
                }}
            ></div>
            <p>加载中...</p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    </div>
);

// 错误边界组件
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        // 更新状态，下次渲染时显示错误界面
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // 可以在这里记录错误日志
        console.error('路由加载错误:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // 显示自定义错误界面
            return (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        color: '#ff4d4f',
                        textAlign: 'center',
                    }}
                >
                    <div>
                        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>❌</h1>
                        <h2>页面加载失败</h2>
                        <p style={{ margin: '16px 0' }}>{this.state.error?.message || '未知错误'}</p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#1890ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            重试
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// 路由配置
const AppRoutes = () => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/dashboard" element={<Dashboard />}>
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
};

export default AppRoutes;
```

#### 5.5.2 命名 chunk 配置

在 Webpack 中，可以为动态导入的 chunk 指定名称，便于调试和优化：

```typescript
// 为chunk指定名称
const Home = lazy(() => import(/* webpackChunkName: "home" */ './views/Home'));
const About = lazy(() => import(/* webpackChunkName: "about" */ './views/About'));
const Contact = lazy(() => import(/* webpackChunkName: "contact" */ './views/Contact'));
```

#### 5.5.3 预加载配置

可以在适当的时候预加载路由组件，提升用户体验：

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
    const location = useLocation();

    // 当用户停留在首页时，预加载其他路由组件
    useEffect(() => {
        // 预加载About组件
        import('./views/About');

        // 预加载Contact组件
        import('./views/Contact');
    }, [location.pathname]);

    return <div>首页</div>;
};
```

### 5.6 加载状态显示

加载状态是路由懒加载中非常重要的一部分，它直接影响用户体验。以下是一些加载状态设计的最佳实践：

1. **显示加载指示器**：使用动画效果的加载指示器，如旋转的加载图标
2. **提供反馈信息**：显示清晰的加载文本，如"加载中..."
3. **保持一致的设计**：加载状态的设计应与应用的整体设计风格一致
4. **避免闪烁**：对于快速加载的组件，可以添加延迟显示加载状态，避免闪烁
5. **进度提示**：对于大型组件，可以显示加载进度

### 5.7 错误边界处理

错误边界是 React 提供的一种错误处理机制，用于捕获和处理组件树中的 JavaScript 错误。在路由懒加载中，错误边界尤为重要，它可以：

1. **捕获加载错误**：处理组件加载过程中的网络错误、语法错误等
2. **提供友好的错误提示**：向用户显示清晰的错误信息，而不是白屏或崩溃
3. **防止应用崩溃**：确保单个组件的错误不会导致整个应用崩溃
4. **提供恢复机制**：允许用户重试加载，或导航到其他页面

### 5.8 性能优化前后对比

#### 5.8.1 优化前

-   **初始加载时间**：长，需要加载所有组件和依赖
-   **打包体积**：大，所有代码打包到一个文件中
-   **内存占用**：高，所有组件和依赖都加载到内存中
-   **用户体验**：差，首次访问时需要等待较长时间

#### 5.8.2 优化后

-   **初始加载时间**：短，只加载当前页面需要的组件
-   **打包体积**：小，代码分割成多个小块，按需加载
-   **内存占用**：低，未加载的组件不会占用内存
-   **用户体验**：好，用户可以更快地看到初始页面，后续页面按需加载

#### 5.8.3 性能数据对比

| 指标              | 优化前 | 优化后 | 提升比例 |
| ----------------- | ------ | ------ | -------- |
| 初始 JS 体积      | 2.5MB  | 500KB  | 80%      |
| 初始加载时间      | 3.2s   | 800ms  | 75%      |
| 首次内容绘制(FCP) | 2.1s   | 600ms  | 71%      |
| 可交互时间(TTI)   | 2.8s   | 700ms  | 75%      |

### 5.9 最佳实践

1. **合理拆分组件**：根据功能模块拆分组件，避免过大的 chunk
2. **设置合理的加载状态**：提供友好的加载体验，避免白屏
3. **添加错误边界**：处理组件加载失败的情况
4. **使用命名 chunk**：便于调试和优化
5. **预加载关键路由**：对于用户可能访问的路由，提前预加载
6. **监控性能**：使用性能监控工具，分析路由加载性能
7. **优化 chunk 大小**：控制单个 chunk 的大小，避免过大的 chunk
8. **按需加载依赖**：对于大型依赖，如第三方库，考虑按需加载

### 5.10 常见问题解决方案

#### 5.10.1 加载状态闪烁

**问题**：组件加载速度很快，导致加载状态闪烁

**解决方案**：

-   添加延迟显示加载状态
-   使用`useDeferredValue`或`useTransition`优化
-   预加载常用组件

```typescript
// 添加延迟显示加载状态
const DelayedLoadingSpinner = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 300);
        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return <div>加载中...</div>;
};
```

#### 5.10.2 组件加载失败

**问题**：组件加载失败，显示白屏或错误信息

**解决方案**：

-   添加错误边界组件
-   提供友好的错误提示
-   允许用户重试加载
-   监控并记录加载错误

#### 5.10.3 预加载时机不当

**问题**：预加载时机不当，导致资源浪费或影响性能

**解决方案**：

-   在用户空闲时预加载
-   基于用户行为预测预加载
-   限制预加载的数量和频率

```typescript
// 基于用户行为预加载
const Navigation = () => {
    const handleMouseEnter = () => {
        // 当用户鼠标悬停在导航链接上时，预加载对应的组件
        import('./views/About');
    };

    return (
        <nav>
            <Link to="/about" onMouseEnter={handleMouseEnter}>
                关于我们
            </Link>
        </nav>
    );
};
```

#### 5.10.4 Chunk 大小过大

**问题**：拆分后的 chunk 仍然过大，影响加载速度

**解决方案**：

-   进一步拆分组件
-   优化组件代码，减少不必要的依赖
-   按需加载组件内部的功能模块
-   考虑使用动态导入加载组件内部的大型依赖

### 5.11 项目中的实际应用

在本项目中，路由懒加载已经应用于所有页面组件，具体实现如下：

```typescript
// 懒加载页面组件
const Home = lazy(() => import('@/views/Home'));
const ToDoList = lazy(() => import('@/views/ToDoList'));
const ReducerContent = lazy(() => import('@/views/ReduerContent'));
const ZustandDemo = lazy(() => import('@/views/ZustandDemo'));
const Login = lazy(() => import('@/views/Login'));
const CartDemo = lazy(() => import('@/views/CartDemo'));
const Test = lazy(() => import('@/views/Test'));
```

通过路由懒加载，项目的初始加载时间显著减少，用户可以更快地看到应用的初始界面。同时，未访问的路由组件不会被加载，减少了内存占用和网络请求。

## 6. 路由传参方法

### 6.1 概念解释

路由传参是指在 React Router 中，通过 URL 传递数据给组件的过程。React Router 提供了多种路由传参方式，每种方式适用于不同的场景。路由参数可以用于标识资源、传递过滤条件、分页信息、排序规则等。

### 6.2 适用场景

路由传参适用于以下场景：

-   **资源标识**：通过 ID 标识特定资源，如商品详情页、用户个人资料页
-   **过滤和排序**：传递过滤条件和排序规则，如商品列表的分类过滤和价格排序
-   **分页信息**：传递当前页码和每页显示数量，如博客文章列表的分页
-   **状态传递**：传递临时状态信息，如表单提交结果、操作成功/失败信息
-   **配置参数**：传递组件配置参数，如自定义视图模式、显示选项等

### 6.3 路由参数类型

React Router 支持以下几种路由参数类型：

1. **动态路由参数**：通过 URL 路径中的动态段传递，如`/users/:id`
2. **查询字符串参数**：通过 URL 查询字符串传递，如`/products?page=1&category=electronics`
3. **状态参数**：通过路由状态传递，不会显示在 URL 中
4. **路径参数**：通过完整的 URL 路径传递，用于匹配嵌套路由

### 6.4 动态路由参数

#### 6.4.1 定义方式

动态路由参数通过在路由路径中使用`:paramName`的形式定义：

```typescript
// 路由配置
<Route path="/users/:id" element={<UserDetails />} />
<Route path="/products/:category/:id" element={<ProductDetails />} />
```

#### 6.4.2 获取参数值

使用`useParams`钩子获取动态路由参数：

```typescript
import { useParams } from 'react-router-dom';

const UserDetails = () => {
    // 使用TypeScript泛型指定参数类型
    const params = useParams<{ id: string }>();

    // 获取参数值
    const userId = params.id;

    return <div>用户ID: {userId}</div>;
};

const ProductDetails = () => {
    // 多个动态参数
    const params = useParams<{ category: string; id: string }>();

    return (
        <div>
            <p>分类: {params.category}</p>
            <p>商品ID: {params.id}</p>
        </div>
    );
};
```

#### 6.4.3 参数传递方式

**通过 Link 组件传递**：

```typescript
import { Link } from 'react-router-dom';

const UserList = () => {
    const users = [
        { id: '1', name: '张三' },
        { id: '2', name: '李四' },
    ];

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                </li>
            ))}
        </ul>
    );
};
```

**通过编程式导航传递**：

```typescript
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const navigate = useNavigate();

    const handleUserClick = (userId: string) => {
        navigate(`/users/${userId}`);
    };

    return <button onClick={() => handleUserClick('123')}>查看用户详情</button>;
};
```

### 6.5 查询字符串参数

#### 6.5.1 处理方式

使用`useSearchParams`钩子处理查询字符串参数，该钩子返回一个包含当前查询参数和更新查询参数的函数的数组：

```typescript
import { useSearchParams } from 'react-router-dom';

const ProductList = () => {
    // 获取查询参数和更新函数
    const [searchParams, setSearchParams] = useSearchParams();

    // 获取单个查询参数，设置默认值
    const page = searchParams.get('page') || '1';
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'default';

    return (
        <div>
            <p>当前页码: {page}</p>
            {category && <p>当前分类: {category}</p>}
            <p>排序方式: {sort}</p>
        </div>
    );
};
```

#### 6.5.2 更新查询参数

使用`setSearchParams`函数更新查询参数：

```typescript
// 完全替换查询参数
const handlePageChange = (newPage: string) => {
    setSearchParams({ page: newPage, category: 'electronics' });
};

// 在现有查询参数基础上更新
const handleSortChange = (newSort: string) => {
    setSearchParams(prev => {
        prev.set('sort', newSort);
        return prev;
    });
};

// 删除查询参数
const handleClearCategory = () => {
    setSearchParams(prev => {
        prev.delete('category');
        return prev;
    });
};
```

#### 6.5.3 传递查询参数

**通过 Link 组件传递**：

```typescript
<Link to="/products?page=1&category=electronics&sort=price">
  电子产品
</Link>

// 使用对象形式传递
<Link
  to={{
    pathname: '/products',
    search: '?page=1&category=electronics'
  }}
>
  电子产品
</Link>
```

**通过编程式导航传递**：

```typescript
// 字符串形式
navigate('/products?page=1&category=electronics');

// 对象形式
navigate({
    pathname: '/products',
    search: '?page=1&category=electronics',
});

// 使用URLSearchParams构建查询字符串
const params = new URLSearchParams();
params.set('page', '1');
params.set('category', 'electronics');
navigate(`/products?${params.toString()}`);
```

### 6.6 参数类型验证和默认值

#### 6.6.1 参数类型验证

使用 TypeScript 泛型和类型断言进行参数类型验证：

```typescript
const UserDetails = () => {
    const params = useParams<{ id: string }>();

    // 验证ID是否为数字
    const userId = parseInt(params.id || '', 10);

    if (isNaN(userId)) {
        return <div>无效的用户ID</div>;
    }

    return <div>用户ID: {userId}</div>;
};
```

#### 6.6.2 默认值设置

为查询参数设置默认值，确保组件有可靠的初始状态：

```typescript
const ProductList = () => {
    const [searchParams] = useSearchParams();

    // 设置默认值
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    return (
        <div>
            <p>当前页码: {page}</p>
            <p>每页数量: {pageSize}</p>
            <p>排序字段: {sort}</p>
            <p>排序顺序: {order}</p>
        </div>
    );
};
```

### 6.7 状态参数

状态参数通过路由状态传递，不会显示在 URL 中，适用于传递临时数据：

```typescript
// 传递状态参数
<Link to="/success" state={{ message: '操作成功', type: 'success' }}>
    提交表单
</Link>;

// 编程式导航传递状态参数
navigate('/success', {
    state: { message: '操作成功', type: 'success' },
});

// 获取状态参数
import { useLocation } from 'react-router-dom';

const SuccessPage = () => {
    const location = useLocation();

    // 获取状态参数，设置默认值
    const state = location.state || { message: '默认消息', type: 'info' };

    return <div className={`alert alert-${state.type}`}>{state.message}</div>;
};
```

### 6.8 完整代码示例

以下是一个包含多种路由传参方式的完整示例：

```typescript
import { Routes, Route, Link, useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';

// 产品数据
const products = [
    { id: '1', name: '笔记本电脑', category: 'electronics', price: 5999, rating: 4.5 },
    { id: '2', name: '智能手机', category: 'electronics', price: 3999, rating: 4.7 },
    { id: '3', name: '无线耳机', category: 'electronics', price: 999, rating: 4.3 },
    { id: '4', name: '运动鞋', category: 'clothing', price: 399, rating: 4.6 },
    { id: '5', name: 'T恤', category: 'clothing', price: 99, rating: 4.2 },
];

// 产品列表组件
const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // 获取查询参数，设置默认值
    const page = parseInt(searchParams.get('page') || '1', 10);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'price';
    const order = searchParams.get('order') || 'desc';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // 过滤和排序产品
    const filteredProducts = products
        .filter(product => {
            let match = true;
            if (category && product.category !== category) match = false;
            if (minPrice && product.price < parseFloat(minPrice)) match = false;
            if (maxPrice && product.price > parseFloat(maxPrice)) match = false;
            return match;
        })
        .sort((a, b) => {
            if (sort === 'price') {
                return order === 'asc' ? a.price - b.price : b.price - a.price;
            } else if (sort === 'rating') {
                return order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
            }
            return 0;
        });

    // 处理排序变化
    const handleSortChange = (newSort: string) => {
        setSearchParams(prev => {
            prev.set('sort', newSort);
            return prev;
        });
    };

    // 处理分类过滤
    const handleCategoryFilter = (newCategory: string | null) => {
        setSearchParams(prev => {
            if (newCategory) {
                prev.set('category', newCategory);
            } else {
                prev.delete('category');
            }
            prev.set('page', '1'); // 重置页码
            return prev;
        });
    };

    return (
        <div>
            <h1>产品列表</h1>

            {/* 过滤和排序控件 */}
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h2>过滤和排序</h2>

                <div style={{ marginBottom: '10px' }}>
                    <label>分类：</label>
                    <button onClick={() => handleCategoryFilter(null)}>全部</button>
                    <button onClick={() => handleCategoryFilter('electronics')}>电子产品</button>
                    <button onClick={() => handleCategoryFilter('clothing')}>服装</button>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>排序：</label>
                    <button onClick={() => handleSortChange('price')}>价格</button>
                    <button onClick={() => handleSortChange('rating')}>评分</button>
                </div>

                <div>
                    <label>当前查询参数：</label>
                    <pre>{searchParams.toString()}</pre>
                </div>
            </div>

            {/* 产品列表 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {filteredProducts.map(product => (
                    <div key={product.id} style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h3>{product.name}</h3>
                        <p>分类: {product.category}</p>
                        <p>价格: ￥{product.price}</p>
                        <p>评分: {product.rating} ⭐</p>
                        <Link
                            to={`/products/${product.category}/${product.id}?source=list&page=${page}`}
                            state={{ from: 'product-list' }}
                            style={{ display: 'block', marginTop: '10px', color: '#1890ff', textDecoration: 'none' }}
                        >
                            查看详情
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 产品详情组件
const ProductDetails = () => {
    const params = useParams<{ category: string; id: string }>();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    // 获取参数
    const category = params.category;
    const productId = params.id;
    const source = searchParams.get('source') || 'unknown';
    const state = location.state || { from: 'unknown' };

    // 查找产品
    const product = products.find(p => p.id === productId);

    if (!product) {
        return <div>产品不存在</div>;
    }

    return (
        <div>
            <h1>产品详情</h1>

            {/* 参数信息 */}
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h2>参数信息</h2>
                <p>分类参数: {category}</p>
                <p>产品ID: {productId}</p>
                <p>来源: {source}</p>
                <p>状态参数: {state.from}</p>
            </div>

            {/* 产品信息 */}
            <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>{product.name}</h2>
                <p>分类: {product.category}</p>
                <p>价格: ￥{product.price}</p>
                <p>评分: {product.rating} ⭐</p>
                <button onClick={() => navigate(-1)}>返回列表</button>
            </div>
        </div>
    );
};

// 路由配置
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:category/:id" element={<ProductDetails />} />
        </Routes>
    );
};
```

### 6.9 参数类型验证和默认值

#### 6.9.1 TypeScript 类型安全

使用 TypeScript 可以为路由参数提供类型安全：

```typescript
// 定义参数类型接口
interface ProductParams {
    category: string;
    id: string;
}

const ProductDetails = () => {
    // 使用接口作为泛型参数
    const params = useParams<ProductParams>();

    // params.category 和 params.id 都会被推断为 string 类型
    return (
        <div>
            <p>分类: {params.category}</p>
            <p>产品ID: {params.id}</p>
        </div>
    );
};
```

#### 6.9.2 参数验证和转换

对获取的参数进行验证和转换，确保数据类型正确：

```typescript
const ProductList = () => {
    const [searchParams] = useSearchParams();

    // 验证并转换为数字类型
    const page = validateNumberParam(searchParams.get('page'), 1);
    const pageSize = validateNumberParam(searchParams.get('pageSize'), 10);

    return (
        <div>
            页码: {page}, 每页数量: {pageSize}
        </div>
    );
};

// 参数验证函数
function validateNumberParam(value: string | null, defaultValue: number): number {
    if (value === null) return defaultValue;

    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}
```

### 6.10 注意事项

1. **参数命名**：使用清晰、描述性的参数名，避免使用过于简单或模糊的名称
2. **参数类型**：明确参数类型，使用 TypeScript 进行类型检查
3. **默认值处理**：为所有参数设置合理的默认值，避免出现 undefined 或 null
4. **参数验证**：对获取的参数进行验证，确保数据有效性
5. **URL 长度限制**：避免在 URL 中传递过大的数据，考虑使用状态参数或其他方式
6. **参数编码**：特殊字符需要进行 URL 编码，React Router 会自动处理
7. **避免敏感数据**：不要在 URL 中传递敏感数据，如密码、令牌等

### 6.11 常见问题解决方案

#### 6.11.1 参数值为 undefined

**问题**：使用 useParams 获取的参数值为 undefined

**解决方案**：

-   检查路由路径定义是否正确，确保参数名匹配
-   检查 URL 是否正确匹配路由路径
-   使用 TypeScript 泛型指定参数类型，避免类型推断错误
-   为参数设置默认值，处理 undefined 情况

#### 6.11.2 路由参数变化不触发组件更新

**问题**：当路由参数变化时，组件没有重新渲染

**解决方案**：

-   使用 useEffect 监听参数变化
-   在依赖项数组中包含路由参数
-   确保组件正确使用了最新的参数值

```typescript
const UserDetails = () => {
    const params = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);

    // 监听id参数变化，重新获取数据
    useEffect(() => {
        fetchUser(params.id).then(setUser);
    }, [params.id]); // 在依赖项中包含params.id

    return <div>{user?.name}</div>;
};
```

#### 6.11.3 查询参数更新后页面不刷新

**问题**：使用 setSearchParams 更新查询参数后，页面没有刷新

**解决方案**：

-   确保组件依赖于查询参数
-   使用 useSearchParams 返回的 searchParams 对象，而不是手动解析 URL
-   检查是否使用了 React.memo 或其他优化，导致组件没有重新渲染

#### 6.11.4 状态参数丢失

**问题**：刷新页面后，状态参数丢失

**解决方案**：

-   状态参数存储在内存中，刷新页面后会丢失
-   对于需要持久化的数据，考虑使用动态路由参数或查询字符串参数
-   或使用 localStorage/sessionStorage 进行数据持久化

```typescript
const SuccessPage = () => {
    const location = useLocation();

    // 从状态参数或localStorage获取数据
    const savedMessage = localStorage.getItem('successMessage');
    const stateMessage = location.state?.message;
    const message = stateMessage || savedMessage || '默认消息';

    return <div>{message}</div>;
};
```

## 7. 编程式导航

### 7.1 什么是编程式导航

编程式导航是指通过 JavaScript 代码实现页面跳转，而不是通过点击链接。

### 7.2 使用 useNavigate Hook

在 React Router v6 中，使用`useNavigate` Hook 实现编程式导航：

```typescript
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    // 基本跳转
    const handleNavigate = () => {
        navigate('/about');
    };

    // 带查询参数的跳转
    const handleNavigateWithParams = () => {
        navigate('/products?page=1&category=electronics');
    };

    // 带状态参数的跳转
    const handleNavigateWithState = () => {
        navigate('/success', { state: { message: '操作成功' } });
    };

    // 后退导航
    const handleGoBack = () => {
        navigate(-1);
    };

    // 前进导航
    const handleGoForward = () => {
        navigate(1);
    };

    // 替换当前历史记录
    const handleReplace = () => {
        navigate('/new-page', { replace: true });
    };

    return (
        <div>
            <button onClick={handleNavigate}>跳转到关于我们</button>
            <button onClick={handleNavigateWithParams}>跳转到商品列表</button>
            <button onClick={handleNavigateWithState}>跳转到成功页面</button>
            <button onClick={handleGoBack}>后退</button>
            <button onClick={handleGoForward}>前进</button>
            <button onClick={handleReplace}>替换当前页面</button>
        </div>
    );
};
```

### 7.3 编程式导航的应用场景

-   表单提交后跳转
-   登录成功后跳转
-   条件跳转
-   动态路由生成

## 8. 路由匹配规则

### 8.1 基本匹配规则

React Router v6 使用一种基于优先级的匹配算法，具体规则如下：

1. **精确匹配优先**：更具体的路径优先匹配
2. **深度优先搜索**：嵌套路由优先匹配
3. **通配符匹配**：`*`匹配所有路径

### 8.2 匹配示例

```typescript
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users" element={<Users />}>
        <Route index element={<UserList />} /> {/* 匹配 /users */}
        <Route path=":id" element={<UserDetails />} /> {/* 匹配 /users/123 */}
    </Route>
    <Route path="*" element={<NotFound />} /> {/* 匹配所有未匹配的路径 */}
</Routes>
```

### 8.3 路由匹配的最佳实践

-   更具体的路径放在前面
-   使用`index`属性定义嵌套路由的默认组件
-   使用`*`通配符处理 404 页面
-   避免使用过于复杂的路径结构

## 9. 常见问题处理方案

### 9.1 页面刷新后 404

**问题**：使用`BrowserRouter`时，刷新页面出现 404 错误。

**解决方案**：

-   确保服务器配置了 fallback 路由，将所有请求重定向到`index.html`
-   对于 Nginx，添加以下配置：
    ```nginx
    location / {
        try_files $uri $uri/ /index.html;
    }
    ```
-   对于 Apache，添加`.htaccess`文件：
    ```apache
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>
    ```

### 9.2 路由参数变化不触发组件更新

**问题**：当路由参数变化时，组件没有重新渲染。

**解决方案**：

-   使用`useEffect`监听路由参数变化：

    ```typescript
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        // 当id变化时，执行相关逻辑
        fetchData(id);
    }, [id]);
    ```

### 9.3 嵌套路由不显示

**问题**：嵌套路由的子组件没有显示。

**解决方案**：

-   确保父组件中包含`Outlet`组件作为子路由的出口
-   确保路由配置正确，子路由应该嵌套在父路由内部

### 9.4 路由守卫不生效

**问题**：路由守卫没有正确控制路由访问。

**解决方案**：

-   确保路由守卫组件正确返回`Outlet`或`Navigate`组件
-   确保路由配置正确，受保护的路由应该作为路由守卫组件的子路由

## 10. 项目中的实际应用

### 10.1 路由配置

在本项目中，路由配置位于`src/routes/index.tsx`文件中，使用了基础的路由配置，包括：

-   首页路由
-   登录路由
-   待办事项路由
-   Reducer 示例路由
-   Zustand 示例路由
-   购物车路由
-   404 路由

### 10.2 导航实现

在项目中，导航实现主要有两种方式：

1. 使用`Link`组件创建导航链接，如首页的应用列表
2. 使用`useNavigate` Hook 实现编程式导航，如登录/登出功能

### 10.3 路由传参

在项目中，主要使用了 URL 参数和状态参数进行路由传参：

-   URL 参数用于标识资源，如商品 ID、用户 ID 等
-   状态参数用于传递临时数据，如操作结果等

## 11. 最佳实践

### 11.1 路由配置

-   集中管理路由配置，便于维护
-   使用路径别名简化导入路径
-   合理组织路由结构，反映应用的层次关系
-   使用路由守卫保护敏感路由

### 11.2 性能优化

-   使用路由懒加载减少初始加载时间
-   合理使用`useMemo`和`useCallback`优化组件性能
-   避免不必要的路由重渲染
-   优化路由匹配规则，避免过于复杂的路径

### 11.3 代码组织

-   按功能组织路由和组件
-   封装路由守卫为独立组件
-   使用 TypeScript 确保类型安全
-   遵循一致的命名规范

### 11.4 用户体验

-   实现加载状态，提升用户体验
-   提供清晰的导航反馈
-   处理 404 页面，提供友好的错误提示
-   实现合理的路由跳转逻辑

## 12. 总结

React Router 是一个功能强大的路由库，它提供了丰富的 API 和组件，用于构建单页应用的路由系统。通过本指南，我们全面总结了 React Router 的使用方法，包括：

-   基础路由配置
-   路由嵌套
-   路由守卫
-   路由懒加载
-   多种路由传参方法
-   编程式导航
-   路由匹配规则
-   常见问题处理方案

React Router 的设计理念是声明式路由，通过组件的方式定义路由规则，与 React 的编程范式高度契合。它的持续发展和活跃的社区支持，使其成为 React 生态系统中最受欢迎的路由库之一。

通过遵循最佳实践，我们可以构建出性能优异、易于维护的路由系统，提升应用的整体质量和用户体验。
