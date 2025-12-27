import { useState } from 'react';
import { List, Checkbox, Button, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useTasks, useTasksDispatch } from './TasksContext';
import type { Task } from './TasksContext';

interface TaskProps {
  task: Task;
}

export default function TaskList() {
    const tasks = useTasks();
    
    return (
        <List
            dataSource={tasks}
            renderItem={(task) => <TaskItem key={task.id} task={task} />}
            locale={{ emptyText: '暂无任务' }}
        />
    );
}

function TaskItem({ task }: TaskProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const dispatch = useTasksDispatch();
    
    const handleSave = () => {
        if (editText.trim()) {
            dispatch({
                type: 'changed',
                task: {
                    ...task,
                    text: editText,
                },
            });
            setIsEditing(false);
        }
    };
    
    return (
        <List.Item
            actions={[
                isEditing ? (
                    <Button 
                        type="text" 
                        icon={<SaveOutlined />} 
                        onClick={handleSave}
                        size="small"
                    >
                        Save
                    </Button>
                ) : (
                    <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => {
                            setEditText(task.text);
                            setIsEditing(true);
                        }}
                        size="small"
                    >
                        Edit
                    </Button>
                ),
                <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => {
                        dispatch({
                            type: 'deleted',
                            id: task.id,
                        });
                    }}
                    size="small"
                >
                    Delete
                </Button>
            ]}
        >
            <List.Item.Meta
                avatar={
                    <Checkbox
                        checked={task.done}
                        onChange={(e) => {
                            dispatch({
                                type: 'changed',
                                task: {
                                    ...task,
                                    done: e.target.checked,
                                },
                            });
                        }}
                    />
                }
                title={
                    isEditing ? (
                        <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onPressEnter={handleSave}
                            size="small"
                            style={{ width: 200 }}
                        />
                    ) : (
                        <span style={{
                            textDecoration: task.done ? 'line-through' : 'none',
                            opacity: task.done ? 0.6 : 1,
                        }}>
                            {task.text}
                        </span>
                    )
                }
            />
        </List.Item>
    );
}
