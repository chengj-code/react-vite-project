import { useState } from 'react';
import { Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface AddTaskProps {
  onAddTask: (text: string) => void;
}

export default function AddTask({ onAddTask }: AddTaskProps) {
  const [text, setText] = useState('');

  return (
    <div style={{ marginBottom: 16 }}>
      <Input
        placeholder="Add a new task"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onPressEnter={() => {
          if (text.trim()) {
            onAddTask(text);
            setText('');
          }
        }}
        style={{ marginRight: 8 }}
      />
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => {
          if (text.trim()) {
            onAddTask(text);
            setText('');
          }
        }}
      >
        Add
      </Button>
    </div>
  );
}
