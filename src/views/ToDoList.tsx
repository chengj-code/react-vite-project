import { useState, useMemo, useCallback } from 'react';
import { Input, Button, Checkbox, Card, Space, Typography, Switch, Empty, Pagination, Spin, message } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store';
import { getThemeColors } from '@/styles/theme';
import type { ThemeColors } from '@/styles/theme';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTodos, addTodo, updateTodo, deleteTodo, toggleTodo as toggleTodoApi } from '@/api/todoApi';
import type { TodoItem, TodosResponse } from '@/api/todoApi';

const { Title } = Typography;

// 任务项组件
interface TaskItemProps {
    task: TodoItem;
    isEditing: boolean;
    editingText: string;
    onEdit: (id: string, text: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    themeColors: ThemeColors;
}

const TaskItem = ({ task, isEditing, editingText, onEdit, onSave, onCancel, onToggle, onDelete, themeColors }: TaskItemProps) => {
    // 主题样式
    const textStyle = useMemo(
        () => ({
            color: themeColors.text,
            textDecoration: task.completed ? 'line-through' : 'none',
            opacity: task.completed ? 0.6 : 1,
        }),
        [themeColors, task.completed]
    );

    // 使用 useMemo 优化样式，避免不必要的重渲染
    const itemStyle = useMemo(
        () => ({
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: themeColors.background,
            borderBottom: `1px solid ${themeColors.border}`,
            transition: 'all 0.3s ease',
        }),
        [themeColors]
    );

    const contentStyle = useMemo(
        () => ({
            flex: 1,
            marginLeft: 12,
            maxWidth: 'calc(100% - 200px)', // 限制内容区域最大宽度，防止编辑时列表变宽
        }),
        []
    );

    const actionsStyle = useMemo(
        () => ({
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end',
            minWidth: 180,
        }),
        []
    );

    return (
        <div style={itemStyle}>
            {/* 复选框 */}
            <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} style={{ cursor: 'pointer' }} />

            {/* 任务内容 */}
            <div style={contentStyle}>
                {isEditing ? (
                    <Input
                        value={editingText}
                        onChange={e => onEdit(task.id, e.target.value)}
                        onPressEnter={onSave}
                        autoFocus
                        style={{
                            width: 300,
                            backgroundColor: themeColors.inputBg,
                            color: themeColors.inputText,
                            border: `1px solid ${themeColors.inputBorder}`,
                            // 修复 placeholder 颜色问题
                            WebkitTextFillColor: themeColors.inputText,
                        }}
                        placeholder="请输入任务内容"
                    />
                ) : (
                    <span style={textStyle}>{task.text}</span>
                )}
            </div>

            {/* 操作按钮 */}
            <div style={actionsStyle}>
                {isEditing ? (
                    <>
                        <Button type="text" icon={<CheckOutlined />} onClick={onSave} style={{ color: themeColors.buttonSuccess }}>
                            保存
                        </Button>
                        <Button type="text" icon={<CloseOutlined />} onClick={onCancel} style={{ color: themeColors.buttonDanger }}>
                            取消
                        </Button>
                    </>
                ) : (
                    <>
                        <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(task.id, task.text)} style={{ color: themeColors.buttonEdit }}>
                            编辑
                        </Button>
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(task.id)}>
                            删除
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

// 任务列表组件
interface TaskListProps {
    tasks: TodoItem[];
    title: string;
    themeColors: ThemeColors;
    onToggle: (id: string) => void;
    onEdit: (id: string, text: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
    editingId: string | null;
    editingText: string;
}

const TaskList = ({ tasks, title, themeColors, onToggle, onEdit, onSave, onCancel, onDelete, editingId, editingText }: TaskListProps) => {
    // 主题样式
    const containerStyle = useMemo(
        () => ({
            marginBottom: 24,
        }),
        []
    );

    const titleStyle = useMemo(
        () => ({
            marginBottom: 12,
            color: themeColors.text,
            fontSize: '16px',
            fontWeight: 600,
        }),
        [themeColors]
    );

    const listStyle = useMemo(
        () => ({
            backgroundColor: themeColors.background,
            border: `1px solid ${themeColors.border}`,
            borderRadius: 4,
            overflow: 'hidden',
            minHeight: 40,
        }),
        [themeColors]
    );

    const emptyStyle = useMemo(
        () => ({
            padding: '20px',
            textAlign: 'center' as const,
            color: themeColors.stats,
        }),
        [themeColors]
    );
    const emptyDescriptionStyle = useMemo(
        () => ({
            description: {
                color: themeColors.stats,
            },
        }),
        [themeColors]
    );
    return (
        <div style={containerStyle}>
            <h4 style={titleStyle}>
                {title} ({tasks.length})
            </h4>
            <div style={listStyle}>
                {tasks.length === 0 ? (
                    <div style={emptyStyle}>
                        <Empty styles={emptyDescriptionStyle} description={<span>暂无{title === '未完成任务' ? '未完成' : '已完成'}任务</span>} />
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            isEditing={editingId === task.id}
                            editingText={editingText}
                            onEdit={onEdit}
                            onSave={onSave}
                            onCancel={onCancel}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            themeColors={themeColors}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const ToDoList = () => {
    // 状态管理
    const [inputValue, setInputValue] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const { themeMode, toggleThemeMode } = useAppStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 主题颜色变量
    const themeColors = useMemo(() => {
        return getThemeColors(themeMode);
    }, [themeMode]);

    // 主题样式对象
    const themeStyles = useMemo(
        () => ({
            card: {
                maxWidth: 600,
                margin: '0 auto',
                backgroundColor: themeColors.background,
                color: themeColors.text,
                border: `1px solid ${themeColors.border}`,
                borderRadius: 8,
                boxShadow: themeColors.shadow,
                transition: 'all 0.3s ease',
            },
            input: {
                backgroundColor: themeColors.inputBg,
                color: themeColors.inputText,
                border: `1px solid ${themeColors.inputBorder}`,
                transition: 'all 0.3s ease',
            },
            text: {
                color: themeColors.text,
            },
            stats: {
                color: themeColors.stats,
                fontSize: '14px',
            },
        }),
        [themeColors]
    );

    // 查询Todo列表
    const {
        data: todosData,
        isLoading,
        error,
    } = useQuery<TodosResponse>({
        queryKey: ['todos', currentPage, pageSize],
        queryFn: () => fetchTodos(currentPage, pageSize),
        staleTime: 2 * 60 * 1000, // 2分钟后数据过期
    });

    // 分离已完成和未完成的任务
    const { pendingTodos, completedTodos, stats } = useMemo(() => {
        const allTodos = todosData?.todos || [];
        const pending = allTodos.filter((todo: TodoItem) => !todo.completed);
        const completed = allTodos.filter((todo: TodoItem) => todo.completed);
        return {
            pendingTodos: pending,
            completedTodos: completed,
            stats: {
                total: todosData?.total || 0,
                completed: completed.length,
                pending: pending.length,
            },
        };
    }, [todosData]);

    // 预取下一页数据
    const prefetchNextPage = useCallback(() => {
        if (todosData && todosData.todos.length === pageSize) {
            queryClient.prefetchQuery({
                queryKey: ['todos', currentPage + 1, pageSize],
                queryFn: () => fetchTodos(currentPage + 1, pageSize),
            });
        }
    }, [queryClient, currentPage, pageSize, todosData]);

    // 添加Todo的Mutation
    const addTodoMutation = useMutation({
        mutationFn: (text: string) => addTodo(text),
        onSuccess: newTodo => {
            // 乐观更新：立即将新Todo添加到缓存
            queryClient.setQueryData(['todos', 1, pageSize], (oldData: TodosResponse | undefined) => {
                if (oldData) {
                    return {
                        ...oldData,
                        todos: [newTodo, ...oldData.todos.slice(0, pageSize - 1)],
                        total: oldData.total + 1,
                    };
                }
                return oldData;
            });
            // 重新获取最新数据
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            message.success('添加成功');
        },
        onError: () => {
            message.error('添加失败');
        },
    });

    // 更新Todo的Mutation
    const updateTodoMutation = useMutation({
        mutationFn: ({ id, text }: { id: string; text: string }) => updateTodo(id, { text }),
        onSuccess: updatedTodo => {
            // 乐观更新：立即更新缓存中的Todo
            queryClient.setQueryData(['todos', currentPage, pageSize], (oldData: TodosResponse | undefined) => {
                if (oldData) {
                    return {
                        ...oldData,
                        todos: oldData.todos.map((todo: TodoItem) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
                    };
                }
                return oldData;
            });
            message.success('更新成功');
        },
        onError: () => {
            message.error('更新失败');
        },
    });

    // 删除Todo的Mutation
    const deleteTodoMutation = useMutation({
        mutationFn: (id: string) => deleteTodo(id),
        onSuccess: (_, variables) => {
            // 乐观更新：立即从缓存中移除Todo
            queryClient.setQueryData(['todos', currentPage, pageSize], (oldData: any) => {
                if (oldData) {
                    return {
                        ...oldData,
                        todos: oldData.todos.filter((todo: TodoItem) => todo.id !== variables),
                        total: oldData.total - 1,
                    };
                }
                return oldData;
            });
            // 重新获取最新数据
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            message.success('删除成功');
        },
        onError: () => {
            message.error('删除失败');
        },
    });

    // 切换Todo完成状态的Mutation
    const toggleTodoMutation = useMutation({
        mutationFn: (id: string) => toggleTodoApi(id),
        onSuccess: updatedTodo => {
            // 乐观更新：立即更新缓存中的Todo完成状态
            queryClient.setQueryData(['todos', currentPage, pageSize], (oldData: any) => {
                if (oldData) {
                    return {
                        ...oldData,
                        todos: oldData.todos.map((todo: TodoItem) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
                    };
                }
                return oldData;
            });
            message.success('状态更新成功');
        },
        onError: () => {
            message.error('状态更新失败');
        },
    });

    // 事件处理函数
    const handleAddTodo = useCallback(() => {
        if (inputValue.trim()) {
            addTodoMutation.mutate(inputValue.trim());
            setInputValue('');
        }
    }, [inputValue, addTodoMutation]);

    const handleToggleTodo = useCallback(
        (id: string) => {
            toggleTodoMutation.mutate(id);
        },
        [toggleTodoMutation]
    );

    const handleDeleteTodo = useCallback(
        (id: string) => {
            deleteTodoMutation.mutate(id);
            if (editingId === id) {
                setEditingId(null);
                setEditingText('');
            }
        },
        [editingId, deleteTodoMutation]
    );

    const handleEditTodo = useCallback((id: string, text: string) => {
        setEditingId(id);
        setEditingText(text);
    }, []);

    const handleSaveTodo = useCallback(() => {
        if (editingId && editingText.trim()) {
            updateTodoMutation.mutate({ id: editingId, text: editingText.trim() });
            setEditingId(null);
            setEditingText('');
        }
    }, [editingId, editingText, updateTodoMutation]);

    const handleCancelEdit = useCallback(() => {
        setEditingId(null);
        setEditingText('');
    }, []);

    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page);
            // 当切换到新页面时，预取下一页
            prefetchNextPage();
        },
        [prefetchNextPage]
    );

    // 组件挂载时预取第一页数据
    useQuery({
        queryKey: ['todos', 1, pageSize],
        queryFn: () => fetchTodos(1, pageSize),
        staleTime: 2 * 60 * 1000,
        enabled: currentPage === 1,
    });

    return (
        <>
            {/* 返回首页按钮 */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Button onClick={() => navigate('/')} type="primary" size="large" icon={<ArrowRightOutlined />}>
                    返回首页
                </Button>
            </div>
            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title
                            level={3}
                            style={{
                                margin: 0,
                                color: themeStyles.text.color,
                                fontSize: '18px',
                            }}
                        >
                            待办事项列表
                        </Title>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 14, color: themeStyles.text.color }}>{themeMode === 'light' ? '浅色' : '深色'}主题</span>
                            <Switch checked={themeMode === 'dark'} onChange={toggleThemeMode} checkedChildren="🌙" unCheckedChildren="☀️" />
                        </div>
                    </div>
                }
                style={themeStyles.card}
                styles={{
                    body: {
                        backgroundColor: themeColors.background,
                        padding: '20px',
                        width: 600,
                    },
                }}
            >
                {/* 添加任务区域 */}
                <Space.Compact
                    style={{
                        width: '100%',
                        marginBottom: 24,
                        display: 'flex',
                    }}
                >
                    <Input placeholder="添加待办事项..." value={inputValue} onChange={e => setInputValue(e.target.value)} onPressEnter={handleAddTodo} style={themeStyles.input} allowClear />
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTodo} size="large" style={{ minWidth: 80 }}>
                        添加
                    </Button>
                </Space.Compact>

                {/* 加载状态 */}
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Spin size="large" />
                        <p style={{ marginTop: 16, color: themeStyles.text.color }}>加载中...</p>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: themeColors.buttonDanger }}>
                        <p>加载失败，请刷新页面重试</p>
                    </div>
                ) : (
                    <>
                        {/* 任务列表区域 */}
                        <TaskList
                            tasks={pendingTodos}
                            title="未完成任务"
                            themeColors={themeColors}
                            onToggle={handleToggleTodo}
                            onEdit={handleEditTodo}
                            onSave={handleSaveTodo}
                            onCancel={handleCancelEdit}
                            onDelete={handleDeleteTodo}
                            editingId={editingId}
                            editingText={editingText}
                        />

                        <TaskList
                            tasks={completedTodos}
                            title="已完成任务"
                            themeColors={themeColors}
                            onToggle={handleToggleTodo}
                            onEdit={handleEditTodo}
                            onSave={handleSaveTodo}
                            onCancel={handleCancelEdit}
                            onDelete={handleDeleteTodo}
                            editingId={editingId}
                            editingText={editingText}
                        />

                        {/* 分页组件 */}
                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                            <Pagination current={currentPage} pageSize={pageSize} total={stats.total} onChange={handlePageChange} showSizeChanger={false} style={{ color: themeStyles.text.color }} />
                        </div>
                    </>
                )}

                {/* 统计信息 */}
                <div
                    style={{
                        marginTop: 16,
                        textAlign: 'center',
                        padding: '12px',
                        backgroundColor: themeColors.statsBg,
                        borderRadius: 4,
                        border: `1px solid ${themeColors.statsBorder}`,
                    }}
                >
                    <span style={themeStyles.stats}>
                        总计: {stats.total} | 已完成: {stats.completed} | 未完成: {stats.pending}
                    </span>
                </div>
            </Card>
        </>
    );
};

export default ToDoList;
