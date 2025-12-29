# React + Vite 项目实现指南

## 1. 项目初始化与环境配置

### 1.1 开发环境要求

| 工具/技术 | 版本要求 | 安装方式 | 用途 |
|----------|----------|----------|------|
| Node.js | ^18.0.0 或 ^20.0.0 | [Node.js 官网](https://nodejs.org/) | 运行时环境 |
| pnpm | ^8.0.0 或 ^9.0.0 | `npm install -g pnpm` | 包管理器 |
| Git | 最新稳定版 | [Git 官网](https://git-scm.com/) | 版本控制 |
| VS Code | 最新稳定版 | [VS Code 官网](https://code.visualstudio.com/) | 代码编辑器 |

### 1.2 项目初始化

1. **创建项目**
   ```bash
   pnpm create vite@latest react-vite-project -- --template react-ts
   cd react-vite-project
   ```

2. **初始化 Git 仓库**
   ```bash
   git init
   echo "node_modules" > .gitignore
   git add .
   git commit -m "Initial commit"
   ```

3. **配置 pnpm**
   ```bash
   pnpm config set auto-install-peers true
   pnpm config set strict-peer-dependencies false
   ```

### 1.3 环境变量配置

创建 `.env` 和 `.env.production` 文件，配置环境变量：

```env
# .env (开发环境)
VITE_PORT=5173
VITE_API_BASE_URL=http://localhost:3000

# .env.production (生产环境)
VITE_PORT=5173
VITE_API_BASE_URL=https://api.example.com
```

## 2. 依赖包安装清单及版本要求

### 2.1 核心依赖

| 依赖包 | 版本 | 用途 | 安装命令 |
|-------|------|------|----------|
| react | ^19.2.0 | React 核心库 | `pnpm add react` |
| react-dom | ^19.2.0 | React DOM 渲染库 | `pnpm add react-dom` |
| antd | ^6.1.2 | 蚂蚁金服 UI 组件库 | `pnpm add antd` |
| @ant-design/icons | ^6.1.0 | Ant Design 图标库 | `pnpm add @ant-design/icons` |
| react-router-dom | ^7.11.0 | React 路由管理 | `pnpm add react-router-dom` |
| @tanstack/react-query | ^5.90.13 | React 数据请求库 | `pnpm add @tanstack/react-query` |
| zustand | 4.5.0 | React 状态管理库 | `pnpm add zustand` |

### 2.2 开发依赖

| 依赖包 | 版本 | 用途 | 安装命令 |
|-------|------|------|----------|
| typescript | ~5.9.3 | TypeScript 支持 | `pnpm add -D typescript` |
| vite | ^7.2.4 | 构建工具 | `pnpm add -D vite` |
| @vitejs/plugin-react-swc | ^4.2.2 | Vite React 插件 | `pnpm add -D @vitejs/plugin-react-swc` |
| eslint | ^9.39.1 | 代码检查工具 | `pnpm add -D eslint` |
| typescript-eslint | ^8.46.4 | TypeScript ESLint 插件 | `pnpm add -D typescript-eslint` |
| rollup-plugin-visualizer | ^6.0.5 | 构建分析工具 | `pnpm add -D rollup-plugin-visualizer` |
| vite-plugin-compression | ^0.5.1 | 构建压缩插件 | `pnpm add -D vite-plugin-compression` |

### 2.3 安装命令

```bash
# 安装核心依赖
pnpm add react react-dom antd @ant-design/icons react-router-dom @tanstack/react-query zustand

# 安装开发依赖
pnpm add -D typescript vite @vitejs/plugin-react-swc eslint typescript-eslint rollup-plugin-visualizer vite-plugin-compression
```

## 3. 核心功能模块划分

根据项目结构，核心功能模块划分为：

| 模块名称 | 功能描述 | 文件位置 | 技术栈 |
|---------|----------|----------|--------|
| 路由管理 | 页面路由配置与导航 | `src/routes/index.tsx` | react-router-dom |
| 状态管理 | 全局状态管理 | `src/store/index.ts` | zustand |
| API 服务 | 数据请求与处理 | `src/api/todoApi.ts` | fetch API + React Query |
| UI 组件 | 页面组件与布局 | `src/views/` | antd + React Hooks |
| 主题管理 | 主题切换功能 | `src/context/ThemeContext.tsx` | React Context |

## 4. 各功能模块的具体实现步骤

### 4.1 路由管理模块

1. **创建路由配置文件**
   ```bash
   mkdir -p src/routes
   touch src/routes/index.tsx
   ```

2. **配置路由**
   ```typescript
   import { createBrowserRouter } from 'react-router-dom';
   import App from '../App';
   import Home from '../views/Home';
   import ToDoList from '../views/ToDoList';
   import Login from '../views/Login';
   import CartDemo from '../views/CartDemo';
   import ZustandDemo from '../views/ZustandDemo';
   import ReduerContent from '../views/ReduerContent';
   import Test from '../views/Test';

   const router = createBrowserRouter([
     {
       path: '/',
       element: <App />,
       children: [
         { index: true, element: <Home /> },
         { path: 'todo', element: <ToDoList /> },
         { path: 'login', element: <Login /> },
         { path: 'cart', element: <CartDemo /> },
         { path: 'zustand', element: <ZustandDemo /> },
         { path: 'reducer', element: <ReduerContent /> },
         { path: 'test', element: <Test /> },
       ],
     },
   ]);

   export default router;
   ```

3. **修改主入口文件**
   ```typescript
   // src/main.tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import { RouterProvider } from 'react-router-dom';
   import router from './routes';
   import './index.css';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <RouterProvider router={router} />
     </React.StrictMode>
   );
   ```

### 4.2 状态管理模块

1. **创建状态管理文件**
   ```bash
   mkdir -p src/store
   touch src/store/index.ts
   ```

2. **实现状态管理**
   ```typescript
   import { create } from 'zustand';

   interface Todo {
     id: number;
     title: string;
     completed: boolean;
   }

   interface TodoStore {
     todos: Todo[];
     addTodo: (title: string) => void;
     toggleTodo: (id: number) => void;
     removeTodo: (id: number) => void;
   }

   export const useTodoStore = create<TodoStore>((set) => ({
     todos: [],
     addTodo: (title) => set((state) => ({
       todos: [...state.todos, { id: Date.now(), title, completed: false }],
     })),
     toggleTodo: (id) => set((state) => ({
       todos: state.todos.map((todo) =>
         todo.id === id ? { ...todo, completed: !todo.completed } : todo
       ),
     })),
     removeTodo: (id) => set((state) => ({
       todos: state.todos.filter((todo) => todo.id !== id),
     })),
   }));
   ```

### 4.3 API 服务模块

1. **创建 API 配置文件**
   ```bash
   mkdir -p src/api
   touch src/api/todoApi.ts
   ```

2. **实现 API 服务**
   ```typescript
   interface Todo {
     id: number;
     title: string;
     completed: boolean;
   }

   // 获取所有待办事项
   export const fetchTodos = async (): Promise<Todo[]> => {
     const response = await fetch('/api/todos');
     if (!response.ok) {
       throw new Error('Failed to fetch todos');
     }
     return response.json();
   };

   // 创建待办事项
   export const createTodo = async (title: string): Promise<Todo> => {
     const response = await fetch('/api/todos', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ title, completed: false }),
     });
     if (!response.ok) {
       throw new Error('Failed to create todo');
     }
     return response.json();
   };

   // 更新待办事项
   export const updateTodo = async (id: number, completed: boolean): Promise<Todo> => {
     const response = await fetch(`/api/todos/${id}`, {
       method: 'PATCH',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ completed }),
     });
     if (!response.ok) {
       throw new Error('Failed to update todo');
     }
     return response.json();
   };

   // 删除待办事项
   export const deleteTodo = async (id: number): Promise<void> => {
     const response = await fetch(`/api/todos/${id}`, {
       method: 'DELETE',
     });
     if (!response.ok) {
       throw new Error('Failed to delete todo');
     }
   };
   ```

### 4.4 主题管理模块

1. **创建主题上下文**
   ```bash
   mkdir -p src/context
   touch src/context/ThemeContext.tsx
   ```

2. **实现主题管理**
   ```typescript
   import React, { createContext, useContext, useState, ReactNode } from 'react';
   import { ConfigProvider, theme } from 'antd';

   type ThemeMode = 'light' | 'dark';

   interface ThemeContextType {
     mode: ThemeMode;
     toggleTheme: () => void;
   }

   const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

   export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
     const [mode, setMode] = useState<ThemeMode>('light');

     const toggleTheme = () => {
       setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
     };

     return (
       <ThemeContext.Provider value={{ mode, toggleTheme }}>
         <ConfigProvider
           theme={{
             algorithm: mode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
           }}
         >
           {children}
         </ConfigProvider>
       </ThemeContext.Provider>
     );
   };

   export const useTheme = () => {
     const context = useContext(ThemeContext);
     if (context === undefined) {
       throw new Error('useTheme must be used within a ThemeProvider');
     }
     return context;
   };
   ```

### 4.5 页面组件实现

1. **创建页面组件**
   ```bash
   mkdir -p src/views
   touch src/views/Home.tsx src/views/ToDoList.tsx src/views/Login.tsx
   ```

2. **实现首页组件**
   ```typescript
   import React from 'react';
   import { Card, Button, Space } from 'antd';
   import { Link } from 'react-router-dom';

   const Home: React.FC = () => {
     return (
       <div style={{ padding: '20px' }}>
         <h1>React + Vite 项目</h1>
         <p>欢迎使用 React + Vite 构建的现代化前端项目</p>
         
         <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '20px' }}>
           <Card title="项目功能">
             <Space direction="vertical" size="small" style={{ width: '100%' }}>
               <Button type="primary" block as={Link} to="/todo">
                 待办事项列表
               </Button>
               <Button block as={Link} to="/login">
                 登录页面
               </Button>
               <Button block as={Link} to="/zustand">
                 Zustand 状态管理演示
               </Button>
             </Space>
           </Card>
         </Space>
       </div>
     );
   };

   export default Home;
   ```

## 5. 关键代码编写指南

### 5.1 组件编写规范

1. **使用函数式组件**
   ```typescript
   // 推荐
   const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
     return <div>{prop1} {prop2}</div>;
   };
   ```

2. **使用 TypeScript 类型定义**
   ```typescript
   interface User {
     id: number;
     name: string;
     email: string;
   }

   interface UserCardProps {
     user: User;
     onEdit: (id: number) => void;
   }
   ```

3. **使用 React Hooks**
   ```typescript
   import { useState, useEffect } from 'react';

   const MyComponent = () => {
     const [count, setCount] = useState(0);
     
     useEffect(() => {
       document.title = `Count: ${count}`;
     }, [count]);
     
     return (
       <button onClick={() => setCount(count + 1)}>
         Count: {count}
       </button>
     );
   };
   ```

### 5.2 状态管理最佳实践

1. **使用 Zustand 进行状态管理**
   ```typescript
   import { create } from 'zustand';

   interface CounterState {
     count: number;
     increment: () => void;
     decrement: () => void;
   }

   export const useCounterStore = create<CounterState>((set) => ({
     count: 0,
     increment: () => set((state) => ({ count: state.count + 1 })),
     decrement: () => set((state) => ({ count: state.count - 1 })),
   }));
   ```

2. **使用 React Query 处理数据请求**
   ```typescript
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { fetchTodos, createTodo } from '../api/todoApi';

   const TodoList = () => {
     const queryClient = useQueryClient();
     
     const { data: todos, isLoading, error } = useQuery({
       queryKey: ['todos'],
       queryFn: fetchTodos,
     });
     
     const mutation = useMutation({
       mutationFn: createTodo,
       onSuccess: () => {
         // 刷新数据
         queryClient.invalidateQueries({ queryKey: ['todos'] });
       },
     });
     
     // 组件逻辑...
   };
   ```

### 5.3 路由配置最佳实践

1. **使用嵌套路由**
   ```typescript
   const router = createBrowserRouter([
     {
       path: '/',
       element: <App />,
       children: [
         { index: true, element: <Home /> },
         { path: 'about', element: <About /> },
         { path: 'users', element: <Users /> },
         { path: 'users/:id', element: <UserDetail /> },
       ],
     },
   ]);
   ```

2. **使用布局组件**
   ```typescript
   const DashboardLayout = () => {
     return (
       <div>
         <Sidebar />
         <main>
           <Outlet />
         </main>
       </div>
     );
   };
   ```

## 6. 单元测试编写与执行流程

### 6.1 测试框架配置

1. **安装测试依赖**
   ```bash
   pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
   ```

2. **配置 Vitest**
   在 `vite.config.ts` 中添加测试配置：
   ```typescript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react-swc';

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       setupFiles: './src/setupTests.ts',
       globals: true,
     },
   });
   ```

3. **创建测试配置文件**
   ```bash
   touch src/setupTests.ts
   ```

   ```typescript
   // src/setupTests.ts
   import '@testing-library/jest-dom';
   ```

### 6.2 编写单元测试

1. **创建测试文件**
   ```bash
   mkdir -p src/__tests__
   touch src/__tests__/TodoList.test.tsx
   ```

2. **编写测试用例**
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react';
   import { describe, it, expect } from 'vitest';
   import ToDoList from '../views/ToDoList';
   import { ThemeProvider } from '../context/ThemeContext';
   import { BrowserRouter } from 'react-router-dom';

   describe('ToDoList Component', () => {
     it('should render the component', () => {
       render(
         <BrowserRouter>
           <ThemeProvider>
             <ToDoList />
           </ThemeProvider>
         </BrowserRouter>
       );
       
       expect(screen.getByText('待办事项')).toBeInTheDocument();
     });
     
     it('should add a new todo', () => {
       render(
         <BrowserRouter>
           <ThemeProvider>
             <ToDoList />
           </ThemeProvider>
         </BrowserRouter>
       );
       
       const input = screen.getByPlaceholderText('请输入待办事项');
       const button = screen.getByText('添加');
       
       fireEvent.change(input, { target: { value: 'Test todo' } });
       fireEvent.click(button);
       
       expect(screen.getByText('Test todo')).toBeInTheDocument();
     });
   });
   ```

### 6.3 执行测试

1. **运行所有测试**
   ```bash
   pnpm test
   ```

2. **运行特定测试文件**
   ```bash
   pnpm test src/__tests__/TodoList.test.tsx
   ```

3. **运行测试并生成覆盖率报告**
   ```bash
   pnpm test --coverage
   ```

## 7. 项目构建与部署准备

### 7.1 构建配置

1. **配置构建优化**
   在 `vite.config.ts` 中配置构建优化：
   ```typescript
   build: {
     target: 'es2020',
     assetsDir: 'assets',
     assetsInlineLimit: 4096,
     outDir: 'dist',
     emptyOutDir: true,
     minify: 'esbuild',
     rollupOptions: {
       output: {
         assetFileNames: 'assets/[ext]/[name]-[hash:8].[ext]',
         chunkFileNames: 'assets/js/[name]-[hash:8].js',
         entryFileNames: 'assets/js/[name]-[hash:8].js',
         manualChunks: id => {
           if (id.includes('node_modules')) {
             if (id.includes('react') || id.includes('react-dom')) {
               return 'react-vendor';
             } else if (id.includes('antd')) {
               return 'antd-vendor';
             } else if (id.includes('react-router-dom')) {
               return 'router-vendor';
             } else {
               return 'other-vendors';
             }
           }
         },
       },
     },
   },
   ```

2. **配置压缩插件**
   ```typescript
   plugins: [
     react(),
     visualizer({
       open: mode === 'production',
       gzipSize: true,
       brotliSize: true,
       filename: 'bundle-analysis.html',
     }),
     compression({
       verbose: true,
       disable: mode === 'development',
       threshold: 10240,
       algorithm: 'gzip',
       ext: '.gz',
     }),
     compression({
       verbose: true,
       disable: mode === 'development',
       threshold: 10240,
       algorithm: 'brotliCompress',
       ext: '.br',
     }),
   ],
   ```

### 7.2 构建命令

1. **构建开发版本**
   ```bash
   pnpm build
   ```

2. **构建生产版本**
   ```bash
   pnpm run build
   ```

3. **预览构建结果**
   ```bash
   pnpm preview
   ```

### 7.3 部署准备

1. **生成构建文件**
   ```bash
   pnpm build
   ```

2. **部署到静态网站托管服务**
   - **Vercel**: 直接连接 Git 仓库，自动部署
   - **Netlify**: 直接连接 Git 仓库，自动部署
   - **GitHub Pages**: 使用 `gh-pages` 工具部署
     ```bash
     pnpm add -D gh-pages
     pnpm run deploy
     ```

3. **环境变量配置**
   在部署平台上配置环境变量：
   - `VITE_API_BASE_URL`: API 服务地址
   - `VITE_PORT`: 端口号

## 8. 开发工具与技术栈版本

### 8.1 技术栈版本清单

| 技术栈 | 版本 | 用途 |
|--------|------|------|
| React | ^19.2.0 | 前端框架 |
| TypeScript | ~5.9.3 | 类型系统 |
| Vite | ^7.2.4 | 构建工具 |
| React Router | ^7.11.0 | 路由管理 |
| Ant Design | ^6.1.2 | UI 组件库 |
| React Query | ^5.90.13 | 数据请求 |
| Zustand | 4.5.0 | 状态管理 |
| ESLint | ^9.39.1 | 代码检查 |

### 8.2 开发工具推荐

| 工具 | 用途 | 推荐插件 |
|------|------|----------|
| VS Code | 代码编辑器 | ESLint, Prettier, TypeScript Hero, React DevTools |
| Chrome DevTools | 调试工具 | React DevTools, Redux DevTools |
| Git | 版本控制 | SourceTree, GitKraken |
| Postman | API 测试 | - |

## 9. 潜在注意事项

### 9.1 性能优化

1. **组件优化**
   - 使用 `React.memo` 优化组件重渲染
   - 使用 `useMemo` 缓存计算结果
   - 使用 `useCallback` 缓存函数引用

2. **状态管理优化**
   - 避免不必要的全局状态
   - 使用选择器优化状态订阅
   - 合理拆分状态模块

3. **网络请求优化**
   - 使用 React Query 进行请求缓存
   - 实现请求防抖和节流
   - 优化请求数据大小

### 9.2 代码质量

1. **ESLint 配置**
   - 严格的 TypeScript 类型检查
   - 统一的代码风格
   - 避免常见的 React 错误

2. **代码审查**
   - 定期进行代码审查
   - 使用 Pull Request 流程
   - 建立代码审查规范

3. **文档编写**
   - 组件文档
   - API 文档
   - 项目架构文档

### 9.3 安全性

1. **XSS 防护**
   - 使用 React 的自动转义
   - 避免使用 `dangerouslySetInnerHTML`
   - 对用户输入进行验证和 sanitize

2. **CSRF 防护**
   - 使用 CSRF 令牌
   - 验证请求来源
   - 使用 SameSite Cookie

3. **数据安全**
   - 敏感数据加密
   - 避免在客户端存储敏感信息
   - 使用 HTTPS 协议

## 10. 结论

本指南详细介绍了 React + Vite 项目从创建到功能实现的全过程，包括项目初始化、环境配置、依赖安装、功能模块实现、测试编写、构建部署等方面。通过遵循本指南，可以快速构建一个现代化、高性能的 React 应用。

在实际开发过程中，应根据项目需求和团队情况，灵活调整技术栈和实现方案，同时注重代码质量、性能优化和安全性。

希望本指南对您的 React 项目开发有所帮助！