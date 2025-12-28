// 定义Todo类型
export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    createdAt: Date;
}

// 定义Todo列表返回类型
export interface TodosResponse {
    todos: TodoItem[];
    total: number;
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
export const fetchTodos = async (page: number = 1, limit: number = 5): Promise<TodosResponse> => {
    await delay(500); // 模拟网络延迟

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTodos = mockTodos.slice(startIndex, endIndex);

    return {
        todos: paginatedTodos,
        total: mockTodos.length,
    };
};

// 添加Todo
export const addTodo = async (text: string): Promise<TodoItem> => {
    await delay(300); // 模拟网络延迟

    const newTodo: TodoItem = {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date(),
    };

    mockTodos = [newTodo, ...mockTodos];
    return newTodo;
};

// 更新Todo
export const updateTodo = async (id: string, updates: Partial<TodoItem>): Promise<TodoItem> => {
    await delay(300); // 模拟网络延迟

    const index = mockTodos.findIndex(todo => todo.id === id);
    if (index === -1) {
        throw new Error('Todo not found');
    }

    mockTodos[index] = {
        ...mockTodos[index],
        ...updates,
    };

    return mockTodos[index];
};

// 删除Todo
export const deleteTodo = async (id: string): Promise<void> => {
    await delay(300); // 模拟网络延迟

    mockTodos = mockTodos.filter(todo => todo.id !== id);
};

// 切换Todo完成状态
export const toggleTodo = async (id: string): Promise<TodoItem> => {
    await delay(200); // 模拟网络延迟

    const index = mockTodos.findIndex(todo => todo.id === id);
    if (index === -1) {
        throw new Error('Todo not found');
    }

    mockTodos[index] = {
        ...mockTodos[index],
        completed: !mockTodos[index].completed,
    };

    return mockTodos[index];
};

// 获取单个Todo
export const fetchTodo = async (id: string): Promise<TodoItem | null> => {
    await delay(400); // 模拟网络延迟

    return mockTodos.find(todo => todo.id === id) || null;
};
