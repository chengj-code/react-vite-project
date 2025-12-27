// import { useState } from 'react';
import './App.css';
import { Tabs } from 'antd';
// import MyButton from '@/views/test/MyButton';
import TodoList from '@/views/test/ToDoList';
import TaskApp from './views/test/ReduerContent';
const items = [
    {
        label: `Tab1`,
        key: '1',
        children: <TodoList />,
    },
    {
        label: `Tab 2`,
        key: '2',
        children: <TaskApp />,
    },
    {
        label: `Tab 3`,
        key: '3',
        children: '',
    },
];
const App = () => {
    // const [count, setCount] = useState(0);
    return (
        <>
            <Tabs defaultActiveKey="2" centered items={items} />
            {/* <h1>欢迎来到我的应用</h1>
            <MyButton title="我是一个按钮" />
            <MyButton disabled title="我是一个禁用的按钮" />
            <button onClick={() => setCount(count => count + 1)}>count is {count}</button> */}
        </>
    );
};
export default App;
