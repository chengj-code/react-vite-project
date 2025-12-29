import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// 懒加载页面组件
const Home = lazy(() => import('@/views/Home'));
const ToDoList = lazy(() => import('@/views/ToDoList'));
const ReducerContent = lazy(() => import('@/views/ReduerContent'));
const ZustandDemo = lazy(() => import('@/views/ZustandDemo'));
const Login = lazy(() => import('@/views/Login'));
const CartDemo = lazy(() => import('@/views/CartDemo'));
const Test = lazy(() => import('@/views/Test'));

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

// 全局路由配置
const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/todo" element={<ToDoList />}>
                    {/* 基本嵌套路由 */}
                    <Route path="test" element={<Test />} />
                    {/* 带有单个动态参数的嵌套路由 */}
                    <Route path="test/:id" element={<Test />} />
                    {/* 带有多个动态参数的嵌套路由 */}
                    <Route path="test/:id/:status" element={<Test />} />
                </Route>
                <Route path="/reducer" element={<ReducerContent />} />
                <Route path="/zustand" element={<ZustandDemo />} />
                <Route path="/cart" element={<CartDemo />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
