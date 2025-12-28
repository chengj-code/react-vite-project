# React Query 库详细指南

## 1. 核心作用与功能

React Query 是一个用于管理 React 应用中服务器状态的库，它提供了一套强大的工具来处理数据获取、缓存、同步和更新。

### 1.1 主要功能

#### 1.1.1 数据缓存
- **自动缓存**：查询结果会自动缓存，避免重复请求
- **缓存失效策略**：可配置的失效时间（staleTime）
- **垃圾回收**：自动清理过期缓存（gcTime）

#### 1.1.2 自动请求管理
- **自动重新请求**：数据过期时自动重新请求
- **窗口聚焦重新验证**：窗口重新聚焦时自动刷新数据
- **网络恢复重新请求**：网络恢复时自动重新请求

#### 1.1.3 状态管理
- **加载状态**：自动跟踪请求状态
- **错误处理**：统一的错误处理机制
- **成功状态**：提供清晰的数据访问方式

#### 1.1.4 突变管理
- **乐观更新**：提供即时反馈
- **自动缓存更新**：突变后自动更新相关缓存
- **回滚机制**：失败时自动回滚

## 2. 内部工作原理

### 2.1 查询键机制

查询键是 React Query 中最重要的概念之一，它用于唯一标识一个查询。

```typescript
// 基本查询键
useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

// 带参数的查询键
useQuery({ queryKey: ['todos', currentPage, pageSize], queryFn: () => fetchTodos(currentPage, pageSize) });
```

查询键的特点：
- 必须是数组类型
- 数组中的每个元素都会被序列化
- 相同的查询键会返回相同的缓存数据

### 2.2 缓存策略

React Query 使用分层缓存策略：

1. **活跃查询缓存**：当前正在使用的查询
2. **非活跃查询缓存**：最近使用过但当前未使用的查询
3. **垃圾回收**：超过 gcTime 后自动清理

### 2.3 失效与重新验证流程

1. **初始请求**：组件挂载时发起请求
2. **数据缓存**：将结果存储到缓存中
3. **数据过期**：staleTime 后数据变为 "过期"
4. **重新验证**：在特定条件下重新发起请求
5. **缓存更新**：使用新数据更新缓存

## 3. 与传统方式对比

### 3.1 传统方式（useState + useEffect）

```typescript
const [todos, setTodos] = useState<TodoItem[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, []);
```

### 3.2 React Query 方式

```typescript
const { data: todos, isLoading, error } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos
});
```

### 3.3 对比优势

| 特性 | 传统方式 | React Query |
|------|----------|-------------|
| 代码量 | 多（需要手动管理状态） | 少（自动管理状态） |
| 缓存机制 | 无（需要手动实现） | 有（自动缓存） |
| 自动重新请求 | 无（需要手动实现） | 有（多种触发条件） |
| 错误处理 | 手动 try-catch | 自动处理 |
| 乐观更新 | 复杂（需要手动实现） | 简单（内置支持） |
| 类型安全 | 需要手动管理 | 自动推断 |

## 4. 核心 API 示例与最佳实践

### 4.1 useQuery

`useQuery` 是 React Query 中最核心的 API，用于获取数据。

#### 4.1.1 基本用法

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchTodos } from '@/api/todoApi';

const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['todos'], // 唯一查询标识符
  queryFn: fetchTodos, // 数据获取函数
  staleTime: 5 * 60 * 1000, // 5分钟后数据过期
  gcTime: 10 * 60 * 1000, // 10分钟后清理缓存
  retry: 1, // 失败后重试1次
});
```

#### 4.1.2 参数说明

| 参数 | 类型 | 描述 |
|------|------|------|
| `queryKey` | `Array<unknown>` | 唯一标识查询的数组 |
| `queryFn` | `() => Promise<TData>` | 异步数据获取函数 |
| `staleTime` | `number` | 数据变为过期前的时间（毫秒） |
| `gcTime` | `number` | 缓存被清理前的时间（毫秒） |
| `retry` | `number | boolean` | 失败后重试次数 |
| `enabled` | `boolean` | 是否启用查询 |

#### 4.1.3 返回值

| 返回值 | 类型 | 描述 |
|--------|------|------|
| `data` | `TData | undefined` | 查询结果数据 |
| `isLoading` | `boolean` | 是否正在加载 |
| `error` | `Error | null` | 错误信息 |
| `refetch` | `() => Promise<QueryObserverResult>` | 手动重新请求函数 |
| `isRefetching` | `boolean` | 是否正在重新请求 |
| `isSuccess` | `boolean` | 查询是否成功 |
| `isError` | `boolean` | 查询是否失败 |

### 4.2 useMutation

`useMutation` 用于处理数据修改操作（如创建、更新、删除）。

#### 4.2.1 基本用法

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTodo } from '@/api/todoApi';

const queryClient = useQueryClient();

const addTodoMutation = useMutation({
  mutationFn: (text: string) => addTodo(text),
  onSuccess: (newTodo) => {
    // 乐观更新：立即将新数据添加到缓存
    queryClient.setQueryData(['todos'], (oldData: any) => {
      if (oldData) {
        return {
          ...oldData,
          todos: [newTodo, ...oldData.todos],
          total: oldData.total + 1
        };
      }
      return oldData;
    });
    // 重新获取最新数据
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  }
});

// 使用方式
const handleAddTodo = () => {
  addTodoMutation.mutate('新的待办事项');
};
```

#### 4.2.2 参数说明

| 参数 | 类型 | 描述 |
|------|------|------|
| `mutationFn` | `(variables: TVariables) => Promise<TData>` | 异步突变函数 |
| `onSuccess` | `(data: TData, variables: TVariables) => void` | 成功回调 |
| `onError` | `(error: TError, variables: TVariables) => void` | 错误回调 |
| `onSettled` | `(data: TData | undefined, error: TError | null) => void` | 完成回调 |

#### 4.2.3 返回值

| 返回值 | 类型 | 描述 |
|--------|------|------|
| `mutate` | `(variables: TVariables) => void` | 触发突变的函数 |
| `mutateAsync` | `(variables: TVariables) => Promise<TData>` | 返回 Promise 的突变函数 |
| `isPending` | `boolean` | 是否正在突变 |
| `isSuccess` | `boolean` | 突变是否成功 |
| `isError` | `boolean` | 突变是否失败 |
| `error` | `TError | null` | 错误信息 |
| `data` | `TData | undefined` | 突变结果 |

### 4.3 useQueryClient

`useQueryClient` 用于访问 QueryClient 实例，用于手动管理缓存。

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// 使查询失效，触发重新请求
queryClient.invalidateQueries({ queryKey: ['todos'] });

// 预取数据
queryClient.prefetchQuery({
  queryKey: ['todos', 2],
  queryFn: () => fetchTodos(2)
});

// 手动设置缓存数据
queryClient.setQueryData(['todos'], data);

// 获取缓存数据
const todos = queryClient.getQueryData(['todos']);
```

## 5. 项目中的实际应用

### 5.1 配置 QueryClient

```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

### 5.2 获取分页数据

```typescript
// src/views/ToDoList.tsx
const { data: todosData, isLoading, error } = useQuery<TodosResponse>({
  queryKey: ['todos', currentPage, pageSize],
  queryFn: () => fetchTodos(currentPage, pageSize),
  staleTime: 2 * 60 * 1000,
});
```

### 5.3 乐观更新示例

```typescript
// src/views/ToDoList.tsx
const deleteTodoMutation = useMutation({
  mutationFn: (id: string) => deleteTodo(id),
  onSuccess: (_, variables) => {
    // 乐观更新：立即从缓存中移除数据
    queryClient.setQueryData(['todos', currentPage, pageSize], (oldData: TodosResponse | undefined) => {
      if (oldData) {
        return {
          ...oldData,
          todos: oldData.todos.filter(todo => todo.id !== variables),
          total: oldData.total - 1
        };
      }
      return oldData;
    });
    // 重新获取最新数据
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  }
});
```

## 6. 最佳实践

### 6.1 查询键设计

- **使用有意义的键名**：如 `['todos', id]` 而非 `[id]`
- **包含所有相关参数**：确保查询键包含所有影响查询结果的参数
- **使用一致的格式**：保持查询键格式的一致性

### 6.2 缓存策略

- **根据数据特性设置 staleTime**：
  - 频繁变化的数据：较短的 staleTime（如 1 分钟）
  - 不常变化的数据：较长的 staleTime（如 30 分钟）
  - 静态数据：可以设置为 `Infinity`

### 6.3 错误处理

- **使用 `isError` 和 `error` 属性**：统一处理错误状态
- **提供友好的错误提示**：向用户显示清晰的错误信息
- **实现重试机制**：对临时错误进行重试

### 6.4 性能优化

- **使用 `enabled` 参数**：只在需要时发起请求
- **预取数据**：提前获取用户可能需要的数据
- **使用 `select` 参数**：只缓存和返回需要的数据
- **避免不必要的重新渲染**：使用 `useMemo` 或 `useCallback` 优化

### 6.5 乐观更新

- **适用于快速操作**：如添加、删除、更新等
- **提供即时反馈**：提升用户体验
- **确保可以回滚**：失败时自动恢复

## 7. 常见问题与解决方案

### 7.1 数据不更新

**问题**：修改数据后，界面不更新

**解决方案**：
1. 确保使用了正确的查询键
2. 使用 `queryClient.invalidateQueries` 或 `queryClient.setQueryData` 更新缓存
3. 检查 `staleTime` 是否设置过长

### 7.2 重复请求

**问题**：相同的请求被重复发送

**解决方案**：
1. 确保使用了相同的查询键
2. 检查 `staleTime` 设置
3. 确保组件没有被多次渲染

### 7.3 缓存数据过期

**问题**：缓存数据过早过期

**解决方案**：
1. 调整 `staleTime` 和 `gcTime` 参数
2. 使用 `cacheTime` （旧版本）或 `gcTime` 控制缓存生命周期

## 8. 总结

React Query 是一个功能强大的数据管理库，它提供了一套完整的解决方案来处理 React 应用中的服务器状态。通过自动缓存、自动重新请求、乐观更新等特性，React Query 可以显著减少数据获取和管理的代码量，提升应用性能和用户体验。

在实际项目中，React Query 已经证明了它的价值，特别是在处理复杂的数据获取场景时。通过遵循最佳实践，可以充分发挥 React Query 的优势，构建出高效、可维护的 React 应用。

## 9. 参考资源

- [React Query 官方文档](https://tanstack.com/query/latest)
- [React Query GitHub 仓库](https://github.com/tanstack/query)
- [React Query 最佳实践](https://tanstack.com/query/latest/docs/react/guides/best-practices)

---

## 附录：项目中使用的相关文件

### src/api/todoApi.ts

```typescript
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

// 模拟获取商品列表API
export const fetchTodos = async (page: number = 1, limit: number = 5): Promise<TodosResponse> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
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
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
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
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
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
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  mockTodos = mockTodos.filter(todo => todo.id !== id);
};

// 切换Todo完成状态
export const toggleTodo = async (id: string): Promise<TodoItem> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  
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
```

### src/views/ToDoList.tsx（核心部分）

```typescript
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

// 添加Todo的Mutation
const addTodoMutation = useMutation({
    mutationFn: (text: string) => addTodo(text),
    onSuccess: (newTodo) => {
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
    },
});

// 删除Todo的Mutation
const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: (_, variables) => {
        // 乐观更新：立即从缓存中移除Todo
        queryClient.setQueryData(['todos', currentPage, pageSize], (oldData: TodosResponse | undefined) => {
            if (oldData) {
                return {
                    ...oldData,
                    todos: oldData.todos.filter(todo => todo.id !== variables),
                    total: oldData.total - 1,
                };
            }
            return oldData;
        });
        // 重新获取最新数据
        queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
});
```