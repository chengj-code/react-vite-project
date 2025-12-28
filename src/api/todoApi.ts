// 定义Todo类型
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// 模拟Todo数据
let mockTodos: TodoItem[] = [
  {
    id: '1',
    text: '完成React Query集成',
    completed: false,
    createdAt: new Date('2025-12-27T08:00:00Z'),
  },
  {
    id: '2',
    text: '实现Todo添加功能',
    completed: false,
    createdAt: new Date('2025-12-27T09:00:00Z'),
  },
  {
    id: '3',
    text: '添加删除功能',
    completed: false,
    createdAt: new Date('2025-12-27T10:00:00Z'),
  },
  {
    id: '4',
    text: '实现分页功能',
    completed: false,
    createdAt: new Date('2025-12-27T11:00:00Z'),
  },
  {
    id: '5',
    text: '添加乐观更新',
    completed: false,
    createdAt: new Date('2025-12-27T12:00:00Z'),
  },
];

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取Todo列表（支持分页）
export const fetchTodos = async (page: number = 1, limit: number = 5): Promise<{ todos: TodoItem[]; total: number }> => {
  await delay(500); // 模拟网络延迟
  
  const startIndex = (page - 1) * limit;
  const