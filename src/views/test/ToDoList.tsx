import { useState, useMemo, useCallback } from 'react';
import { Input, Button, Checkbox, Card, Space, Typography, Switch, Empty } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useTheme } from '@/context/ThemeContext';
import { getThemeColors } from '@/styles/theme';
import type { ThemeColors } from '@/styles/theme';

const { Title } = Typography;

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

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
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');

    const { theme, toggleTheme } = useTheme();

    // 分离已完成和未完成的任务（使用 useMemo 优化性能）
    const { pendingTodos, completedTodos, stats } = useMemo(() => {
        const pending = todos.filter(todo => !todo.completed);
        const completed = todos.filter(todo => todo.completed);
        return {
            pendingTodos: pending,
            completedTodos: completed,
            stats: {
                total: todos.length,
                completed: completed.length,
                pending: pending.length,
            },
        };
    }, [todos]);

    // 主题颜色变量
    const themeColors = useMemo(() => {
        return getThemeColors(theme);
    }, [theme]);

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

    // 事件处理函数 - 使用 useCallback 优化，减少不必要的重渲染
    const addTodo = useCallback(() => {
        if (inputValue.trim()) {
            const newTodo: TodoItem = {
                id: crypto.randomUUID(),
                text: inputValue.trim(),
                completed: false,
            };
            setTodos(prev => [...prev, newTodo]);
            setInputValue('');
        }
    }, [inputValue]);

    const toggleTodo = useCallback((id: string) => {
        setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
    }, []);

    const deleteTodo = useCallback(
        (id: string) => {
            setTodos(prev => prev.filter(todo => todo.id !== id));
            if (editingId === id) {
                setEditingId(null);
                setEditingText('');
            }
        },
        [editingId]
    );

    const editTodo = useCallback((id: string, text: string) => {
        setEditingId(id);
        setEditingText(text);
    }, []);

    const saveTodo = useCallback(() => {
        if (editingId && editingText.trim()) {
            setTodos(prev => prev.map(todo => (todo.id === editingId ? { ...todo, text: editingText.trim() } : todo)));
            setEditingId(null);
            setEditingText('');
        }
    }, [editingId, editingText]);

    const cancelEdit = useCallback(() => {
        setEditingId(null);
        setEditingText('');
    }, []);

    return (
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
                        <span style={{ fontSize: 14, color: themeStyles.text.color }}>{theme === 'light' ? '浅色' : '深色'}主题</span>
                        <Switch checked={theme === 'dark'} onChange={toggleTheme} checkedChildren="🌙" unCheckedChildren="☀️" />
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
                <Input placeholder="添加待办事项..." value={inputValue} onChange={e => setInputValue(e.target.value)} onPressEnter={addTodo} style={themeStyles.input} allowClear />
                <Button type="primary" icon={<PlusOutlined />} onClick={addTodo} size="large" style={{ minWidth: 80 }}>
                    添加
                </Button>
            </Space.Compact>

            {/* 任务列表区域 */}
            <TaskList
                tasks={pendingTodos}
                title="未完成任务"
                themeColors={themeColors}
                onToggle={toggleTodo}
                onEdit={editTodo}
                onSave={saveTodo}
                onCancel={cancelEdit}
                onDelete={deleteTodo}
                editingId={editingId}
                editingText={editingText}
            />

            <TaskList
                tasks={completedTodos}
                title="已完成任务"
                themeColors={themeColors}
                onToggle={toggleTodo}
                onEdit={editTodo}
                onSave={saveTodo}
                onCancel={cancelEdit}
                onDelete={deleteTodo}
                editingId={editingId}
                editingText={editingText}
            />

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
    );
};

export default ToDoList;
