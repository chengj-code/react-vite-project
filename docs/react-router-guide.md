# React Router 详细指南

## 1. 核心概念与设计理念

React Router 是一个用于构建单页应用的路由库，它允许开发者在React应用中实现客户端路由管理。React Router的设计理念是声明式路由，通过组件的方式来定义路由规则。

### 1.1 核心作用

- **客户端路由管理**：在单页应用中实现页面之间的导航
- **URL与组件的映射**：将URL路径映射到对应的React组件
- **路由参数传递**：支持动态路由参数和查询参数
- **嵌套路由**：支持路由的嵌套结构
- **编程式导航**：支持通过代码实现页面跳转
- **路由守卫**：支持路由的权限控制

### 1.2 设计理念

- **声明式路由**：通过组件的方式定义路由规则
- **组件化设计**：将路由功能封装为可复用的组件
- **与React生态集成**：与React组件生命周期无缝结合
- **灵活的配置方式**：支持多种路由配置方式
- **支持多种环境**：支持浏览器、服务器和Native环境

## 2. 核心组件与API

### 2.1 核心组件

#### 2.1.1 BrowserRouter

**功能**：BrowserRouter 是React Router的核心组件，它使用HTML5的History API来同步URL和UI。

**使用场景**：作为应用的根组件，包裹整个应用。

**代码示例**：

```typescript
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
    return (
        <Router>
            {/* 应用内容 */}
        </Router>
    );
};
```

#### 2.1.2 Routes

**功能**：Routes 组件是React Router v6中的新组件，用于包裹多个Route组件，负责匹配和渲染当前URL对应的Route组件。

**使用场景**：用于定义应用的路由配置。

**代码示例**：

```typescript
import { Routes, Route } from 'react-router-dom';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
        </Routes>
    );
};
```

#### 2.1.3 Route

**功能**：Route 组件用于定义URL路径与React组件的映射关系。

**使用场景**：用于定义单个路由规则。

**代码示例**：

```typescript
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/users/:id" element={<UserDetails />} /> {/* 动态路由参数 */}
<Route path="*" element={<NotFound />} /> {/* 404页面 */}
```

#### 2.1.4 Link

**功能**：Link 组件用于创建导航链接，它会渲染为一个 `<a>` 标签，但点击时不会触发页面刷新。

**使用场景**：用于在应用内部创建导航链接。

**代码示例**：

```typescript
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <Link to="/">首页</Link>
            <Link to="/about">关于我们</Link>
            <Link to={`/users/${userId}`}>用户详情</Link> {/* 动态路由 */}
        </nav>
    );
};
```

#### 2.1.5 NavLink

**功能**：NavLink 是Link的增强版，它会根据当前URL自动添加激活样式。

**使用场景**：用于创建导航菜单，自动高亮当前选中的菜单项。

**代码示例**：

```typescript
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                首页
            </NavLink>
            <NavLink to="/about" end className={({ isActive }) => isActive ? 'active' : ''}>
                关于我们
            </NavLink>
        </nav>
    );
};
```

### 2.2 核心Hook

#### 2.2.1 useNavigate

**功能**：useNavigate Hook用于实现编程式导航，可以通过代码跳转页面。

**使用场景**：用于登录成功后跳转、表单提交后跳转等需要通过代码控制导航的场景。

**代码示例**：

```typescript
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // 登录逻辑
        navigate('/dashboard'); // 登录成功后跳转到仪表板
    };

    const handleBack = () => {
        navigate(-1); // 后退一步
    };

    return (
        <div>
            <button onClick={handleLogin}>登录</button>
            <button onClick={handleBack}>返回</button>
        </div>
    );
};
```

#### 2.2.2 useParams

**功能**：useParams Hook用于获取动态路由参数。

**使用场景**：用于获取URL中的动态参数，如用户ID、商品ID等。

**代码示例**：

```typescript
import { useParams } from 'react-router-dom';

const UserDetails = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <h2>用户详情</h2>
            <p>用户ID: {id}</p>
        </div>
    );
};
```

#### 2.2.3 useLocation

**功能**：useLocation Hook用于获取当前URL的位置对象，包含pathname、search、hash等信息。

**使用场景**：用于获取当前URL的信息，如查询参数、hash等。

**代码示例**：

```typescript
import { useLocation } from 'react-router-dom';

const CurrentPage = () => {
    const location = useLocation();

    return (
        <div>
            <h2>当前页面</h2>
            <p>路径: {location.pathname}</p>
            <p>查询参数: {location.search}</p>
            <p>Hash: {location.hash}</p>
        </div>
    );
};
```

#### 2.2.4 useSearchParams

**功能**：useSearchParams Hook用于获取和修改URL的查询参数。

**使用场景**：用于处理URL查询参数，如分页、筛选等。

**代码示例**：

```typescript
import { useSearchParams } from 'react-router-dom';

const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') || '1';
    const category = searchParams.get('category');

    const handlePageChange = (newPage: string) => {
        setSearchParams(prev => {
            prev.set('page', newPage);
            return prev;
        });
    };

    return (
        <div>
            <h2>商品列表</h2>
            <p>当前页码: {page}</p>
            {category && <p>当前分类: {category}</p>}
            <button onClick={() => handlePageChange('2')}>下一页</button>
        </div>
    );
};
```

#### 2.2.5 useRoutes

**功能**：useRoutes Hook用于以编程方式定义路由规则，与Routes组件功能类似。

**使用场景**：用于需要动态生成路由规则的场景。

**代码示例**：

```typescript
import { useRoutes } from 'react-router-dom';

const App = () => {
    const element = useRoutes([
        { path: '/', element: <Home /> },
        { path: '/about', element: <About /> },
        { path: '*', element: <NotFound /> },
    ]);

    return element;
};
```

## 3. 项目中的实际应用

### 3.1 路由配置

在项目中，React Router的路由配置位于 `src/routes/index.tsx` 文件中：

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
            <Route path="*" element={<Home />} />
        </Routes>
    );
};

export default AppRoutes;
```

### 3.2 应用入口配置

在 `src/App.tsx` 文件中，使用 `BrowserRouter` 包裹整个应用：

```typescript
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';

const App = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;
```

### 3.3 导航链接

在 `src/views/Home.tsx` 文件中，使用 `Link` 组件创建导航链接：

```typescript
import { Link } from 'react-router-dom';

const AppCard = ({ title, description, icon, iconBgColor, to, buttonText }: AppCardProps) => {
    return (
        <Card>
            {/* 卡片内容 */}
            <Link to={to} style={{ textDecoration: 'none' }}>
                <Button type="primary" size="large" icon={<ArrowRightOutlined />} style={{ borderRadius: 6, width: '100%' }}>
                    {buttonText}
                </Button>
            </Link>
        </Card>
    );
};
```

### 3.4 编程式导航

在 `src/views/Home.tsx` 文件中，使用 `useNavigate` Hook实现编程式导航：

```typescript
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    // 处理登出
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // 处理登录
    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div>
            {/* 登录/登出按钮 */}
            {isAuthenticated ? (
                <Button onClick={handleLogout}>登出</Button>
            ) : (
                <Button onClick={handleLogin}>登录</Button>
            )}
        </div>
    );
};
```

## 4. 高级功能

### 4.1 嵌套路由

嵌套路由是指路由之间存在父子关系，父路由的组件中包含子路由的出口。

**代码示例**：

```typescript
import { Routes, Route, Outlet } from 'react-router-dom';

// 父组件
const Dashboard = () => {
    return (
        <div>
            <h1>仪表板</h1>
            <nav>
                <Link to="profile">个人资料</Link>
                <Link to="settings">设置</Link>
            </nav>
            {/* 子路由出口 */}
            <Outlet />
        </div>
    );
};

// 子组件
const Profile = () => <h2>个人资料</h2>;
const Settings = () => <h2>设置</h2>;

// 路由配置
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />}>
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
};
```

### 4.2 路由参数

路由参数允许在URL中传递动态值，通过`:paramName`的形式定义。

**代码示例**：

```typescript
import { Routes, Route, useParams } from 'react-router-dom';

// 组件
const UserDetails = () => {
    const { id } = useParams<{ id: string }>();
    return <h2>用户ID: {id}</h2>;
};

// 路由配置
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
    );
};
```

### 4.3 路由守卫

路由守卫用于控制路由的访问权限，通常通过高阶组件或自定义组件实现。

**代码示例**：

```typescript
import { Navigate, Outlet } from 'react-router-dom';

// 路由守卫组件
const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    if (!isAuthenticated) {
        // 未登录，重定向到登录页
        return <Navigate to="/login" replace />;
    }
    // 已登录，渲染子组件
    return <Outlet />;
};

// 路由配置
const AppRoutes = () => {
    const isAuthenticated = useAppStore(state => state.isAuthenticated);
    
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* 受保护的路由 */}
            <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
            </Route>
        </Routes>
    );
};
```

### 4.4 404页面

404页面用于处理未匹配到任何路由的情况，通过`*`路径匹配。

**代码示例**：

```typescript
import { Routes, Route } from 'react-router-dom';

// 404组件
const NotFound = () => {
    return (
        <div>
            <h1>404</h1>
            <p>页面未找到</p>
            <Link to="/">返回首页</Link>
        </div>
    );
};

// 路由配置
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* 404页面 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
```

## 5. 工作原理剖析

### 5.1 URL变化监听机制

React Router使用两种方式监听URL变化：

1. **History API**：对于浏览器环境，使用HTML5的History API（pushState、replaceState、popstate事件）来监听URL变化。
2. **Hash API**：对于不支持History API的环境，使用URL的hash部分（hashchange事件）来监听URL变化。

当URL发生变化时，React Router会触发路由重新匹配和组件重新渲染。

### 5.2 路由匹配算法

React Router的路由匹配算法采用深度优先搜索（DFS）策略：

1. 从Routes组件开始，遍历所有子Route组件
2. 对于每个Route组件，检查其path属性是否与当前URL匹配
3. 如果匹配，渲染对应的element组件
4. 如果是嵌套路由，继续遍历子Route组件
5. 如果没有匹配的Route组件，渲染path为`*`的Route组件（如果存在）

### 5.3 组件渲染逻辑

React Router的组件渲染逻辑如下：

1. 当URL变化时，Routes组件重新计算匹配的Route组件
2. 如果匹配的Route组件发生变化，React Router会卸载旧的组件，渲染新的组件
3. 对于嵌套路由，使用Outlet组件作为子路由的出口
4. 组件的生命周期方法会正常触发（componentDidMount、componentDidUpdate、componentWillUnmount等）

### 5.4 与React组件生命周期的交互

React Router与React组件生命周期的交互方式如下：

1. **挂载阶段**：当路由匹配时，组件会被挂载，componentDidMount或useEffect会被调用
2. **更新阶段**：当路由参数变化时，组件会被更新，componentDidUpdate或useEffect会被调用
3. **卸载阶段**：当路由不匹配时，组件会被卸载，componentWillUnmount或useEffect的清理函数会被调用
4. **状态管理**：React Router的状态变化会触发组件的重新渲染

### 5.5 内部工作流程

React Router的内部工作流程可以简化为以下几个步骤：

1. **初始化**：创建BrowserRouter组件，监听URL变化
2. **路由配置**：解析Routes和Route组件，构建路由树
3. **URL变化**：监听URL变化，获取当前location对象
4. **路由匹配**：使用路由匹配算法，找到匹配的Route组件
5. **组件渲染**：渲染匹配的Route组件及其子组件
6. **更新通知**：当URL变化或路由配置变化时，重新执行上述流程

## 6. 最佳实践

### 6.1 路由配置

- **集中式配置**：将路由配置集中在一个文件中，便于管理
- **使用路径别名**：使用路径别名（如@/routes）简化导入路径
- **动态路由**：对于需要动态生成的路由，使用useRoutes Hook
- **嵌套路由**：对于有层次结构的页面，使用嵌套路由

### 6.2 性能优化

- **懒加载组件**：使用React.lazy和Suspense实现组件懒加载
- **减少不必要的重渲染**：使用React.memo或useMemo优化组件性能
- **避免过度使用useLocation**：useLocation的变化会触发组件重新渲染
- **合理使用useParams**：只在需要的组件中使用useParams

### 6.3 代码组织

- **按功能组织**：将相关的路由和组件放在一起
- **路由守卫**：将路由守卫逻辑封装为独立的组件
- **类型安全**：使用TypeScript确保路由参数的类型安全
- **命名规范**：使用一致的命名规范，如PascalCase命名组件，kebab-case命名路由路径

### 6.4 权限管理

- **集中式权限控制**：将权限控制逻辑集中管理
- **细粒度权限**：根据需要实现细粒度的权限控制
- **友好的错误提示**：对于未授权的访问，提供友好的错误提示
- **重定向策略**：合理设计重定向策略，提升用户体验

## 7. 与其他路由库的比较

### 7.1 与React Router v5的比较

| 特性 | React Router v6 | React Router v5 |
|------|----------------|----------------|
| **API设计** | 声明式API，更简洁 | 命令式API，较复杂 |
| **组件结构** | 使用Routes替代Switch | 使用Switch组件 |
| **嵌套路由** | 使用Outlet组件 | 使用render或children属性 |
| **路由匹配** | 更严格的匹配规则 | 较宽松的匹配规则 |
| **类型支持** | 更好的TypeScript支持 | 一般的TypeScript支持 |
| **性能** | 更好的性能 | 一般的性能 |
| **体积** | 更小的体积 | 较大的体积 |

### 7.2 与其他路由库的比较

| 特性 | React Router | Next.js Router | React Location |
|------|--------------|----------------|----------------|
| **适用场景** | 通用React应用 | Next.js应用 | 通用React应用 |
| **API设计** | 声明式组件API | 声明式API + 约定式路由 | 声明式API + 配置式路由 |
| **性能** | 良好 | 优秀 | 优秀 |
| **体积** | 中等 | 集成在Next.js中 | 较小 |
| **功能丰富度** | 非常丰富 | 丰富 | 丰富 |
| **学习曲线** | 平缓 | 平缓 | 中等 |
| **社区支持** | 非常活跃 | 活跃 | 增长中 |

## 8. 项目中的完整配置示例

### 8.1 完整的路由配置

```typescript
// src/routes/index.tsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// 导入页面组件
import Home from '@/views/Home';
import ToDoList from '@/views/ToDoList';
import ReducerContent from '@/views/ReduerContent';
import ZustandDemo from '@/views/ZustandDemo';
import Login from '@/views/Login';
import CartDemo from '@/views/CartDemo';
import NotFound from '@/views/NotFound';
import { useAppStore } from '@/store';

// 路由守卫组件
const ProtectedRoute = () => {
    const isAuthenticated = useAppStore(state => state.isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

// 全局路由配置
const AppRoutes = () => {
    return (
        <Routes>
            {/* 公共路由 */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/todo" element={<ToDoList />} />
            <Route path="/reducer" element={<ReducerContent />} />
            <Route path="/zustand" element={<ZustandDemo />} />
            <Route path="/cart" element={<CartDemo />} />
            
            {/* 受保护的路由 */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
            </Route>
            
            {/* 404页面 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
```

### 8.2 应用入口配置

```typescript
// src/App.tsx
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';

const App = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;
```

### 8.3 导航组件

```typescript
// src/components/Navbar.tsx
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#f0f0f0' }}>
            <NavLink 
                to="/" 
                style={({ isActive }) => ({ 
                    textDecoration: isActive ? 'none' : 'underline',
                    color: isActive ? '#1890ff' : '#333'
                })}
                end
            >
                首页
            </NavLink>
            <NavLink 
                to="/todo" 
                style={({ isActive }) => ({ 
                    textDecoration: isActive ? 'none' : 'underline',
                    color: isActive ? '#1890ff' : '#333'
                })}
            >
                待办事项
            </NavLink>
            <NavLink 
                to="/cart" 
                style={({ isActive }) => ({ 
                    textDecoration: isActive ? 'none' : 'underline',
                    color: isActive ? '#1890ff' : '#333'
                })}
            >
                购物车
            </NavLink>
            <NavLink 
                to="/login" 
                style={({ isActive }) => ({ 
                    textDecoration: isActive ? 'none' : 'underline',
                    color: isActive ? '#1890ff' : '#333'
                })}
            >
                登录
            </NavLink>
        </nav>
    );
};

export default Navbar;
```

## 9. 调试技巧

### 9.1 使用React DevTools

React DevTools可以帮助开发者调试React Router的组件结构和状态：

- 查看Routes和Route组件的结构
- 检查当前匹配的Route组件
- 查看location和match对象

### 9.2 使用console.log

在组件中使用console.log输出路由相关信息：

```typescript
const MyComponent = () => {
    const location = useLocation();
    const params = useParams();
    
    console.log('当前location:', location);
    console.log('当前params:', params);
    
    return <div>My Component</div>;
};
```

### 9.3 使用路由事件

监听路由事件，输出路由变化信息：

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const App = () => {
    const location = useLocation();
    
    useEffect(() => {
        console.log('路由变化:', location.pathname);
    }, [location]);
    
    return <AppRoutes />;
};
```

## 10. 常见问题与解决方案

### 10.1 页面刷新后404

**问题**：使用BrowserRouter时，刷新页面出现404错误。

**解决方案**：
- 确保服务器配置了 fallback路由，将所有请求重定向到index.html
- 对于Nginx，添加以下配置：
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```
- 对于Apache，添加.htaccess文件：
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

### 10.2 路由参数变化不触发组件更新

**问题**：当路由参数变化时，组件没有重新渲染。

**解决方案**：
- 使用useEffect监听路由参数变化：
  ```typescript
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
      // 当id变化时，执行相关逻辑
      fetchData(id);
  }, [id]);
  ```
- 确保组件正确处理props变化

### 10.3 嵌套路由不显示

**问题**：嵌套路由的子组件没有显示。

**解决方案**：
- 确保父组件中包含Outlet组件：
  ```typescript
  const ParentComponent = () => {
      return (
          <div>
              {/* 父组件内容 */}
              <Outlet /> {/* 子组件出口 */}
          </div>
      );
  };
  ```
- 确保路由配置正确：
  ```typescript
  <Route path="/parent" element={<ParentComponent />}>
      <Route path="child" element={<ChildComponent />} />
  </Route>
  ```

### 10.4 路由守卫不生效

**问题**：路由守卫没有正确控制路由访问。

**解决方案**：
- 确保路由守卫组件正确返回Outlet或Navigate组件：
  ```typescript
  const ProtectedRoute = () => {
      if (!isAuthenticated) {
          return <Navigate to="/login" replace />;
      }
      return <Outlet />;
  };
  ```
- 确保路由配置正确：
  ```typescript
  <Route element={<ProtectedRoute />}>
      <Route path="/protected" element={<ProtectedComponent />} />
  </Route>
  ```

## 11. 总结

React Router是一个功能强大的路由库，它提供了丰富的组件和API，用于构建单页应用的路由系统。通过声明式的API设计，React Router使得路由配置变得简单直观，同时支持嵌套路由、路由参数、路由守卫等高级功能。

React Router的工作原理基于HTML5的History API，通过监听URL变化，使用路由匹配算法找到匹配的组件，并渲染到页面上。它与React组件生命周期无缝结合，提供了良好的开发体验。

在实际项目中，React Router被广泛应用于构建各种规模的单页应用，从简单的博客到复杂的企业应用。通过遵循最佳实践，可以构建出性能优异、易于维护的路由系统。

React Router的设计理念和API设计使其成为React生态系统中最受欢迎的路由库之一，它的持续发展和活跃的社区支持，使其能够适应不断变化的Web开发需求。

## 12. 参考资源

- [React Router官方文档](https://reactrouter.com/)
- [React Router GitHub仓库](https://github.com/remix-run/react-router)
- [React Router v6迁移指南](https://reactrouter.com/docs/en/v6/upgrading/v5)
- [React Router最佳实践](https://reactrouter.com/docs/en/v6/guides/scroll-restoration)

---

## 附录：项目中使用的相关文件

### src/routes/index.tsx

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
            <Route path="*" element={<Home />} />
        </Routes>
    );
};

export default AppRoutes;
```

### src/App.tsx

```typescript
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';

const App = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;
```

### src/views/Home.tsx

```typescript
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    // 处理登出
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            {/* 登录/登出按钮 */}
            {isAuthenticated ? (
                <Button onClick={handleLogout}>登出</Button>
            ) : (
                <Button onClick={() => navigate('/login')}>登录</Button>
            )}

            {/* 应用列表 */}
            <Row gutter={[24, 24]}>
                {apps.map((app, index) => (
                    <Col key={index} xs={24} sm={12} lg={8}>
                        <AppCard title={app.title} description={app.description} icon={app.icon} iconBgColor={app.iconBgColor} to={app.to} buttonText={app.buttonText} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};
```
