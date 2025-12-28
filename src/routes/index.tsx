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
