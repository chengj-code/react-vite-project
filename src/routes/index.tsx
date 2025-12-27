import { Routes, Route } from 'react-router-dom';

// 导入页面组件
import Home from '@/views/Home';
import ToDoList from '@/views/test/ToDoList';
import ReducerContent from '@/views/test/ReduerContent';

// 全局路由配置
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todo" element={<ToDoList />} />
            <Route path="/reducer" element={<ReducerContent />} />
            <Route path="*" element={<Home />} />
        </Routes>
    );
};

export default AppRoutes;
