import { Card, Button, Typography, Row, Col, Space, Tag, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, SunOutlined, MoonOutlined, PlusOutlined, MinusOutlined, SyncOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store';

const { Title, Paragraph } = Typography;

const ZustandDemo = () => {
    // 使用Zustand状态管理
    const { count, themeMode, increment, decrement, toggleThemeMode, setCount } = useAppStore();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
            {/* 返回首页 */}
            <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Button onClick={() => navigate('/')} type="primary" size="large" icon={<ArrowRightOutlined />}>
                    返回首页
                </Button>
            </div>

            {/* 页面标题 */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Title level={2} style={{ color: '#1890ff', margin: '0 0 8px 0' }}>
                    Zustand 状态管理演示
                </Title>
                <Paragraph style={{ fontSize: 16, color: '#666' }}>一个轻量级、高性能的状态管理库演示</Paragraph>
            </div>

            {/* 状态展示卡片 */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <Card
                        title="当前状态"
                        variant="outlined"
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        }}
                    >
                        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Paragraph strong>计数状态:</Paragraph>
                                <Tag color="green" style={{ fontSize: 24, padding: '8px 16px' }}>
                                    {count}
                                </Tag>
                            </div>
                            <div>
                                <Paragraph strong>主题模式:</Paragraph>
                                <Tag color={themeMode === 'dark' ? 'blue' : 'gold'} style={{ fontSize: 24, padding: '8px 16px' }}>
                                    {themeMode === 'dark' ? '暗色模式' : '亮色模式'}
                                </Tag>
                            </div>
                        </Space>
                    </Card>
                </Col>

                {/* 计数器控制 */}
                <Col xs={24} lg={8}>
                    <Card
                        title="计数器控制"
                        variant="outlined"
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        }}
                    >
                        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                            <div style={{ textAlign: 'center' }}>
                                <Space size="large">
                                    <Button type="primary" size="large" icon={<MinusOutlined />} onClick={decrement} style={{ width: 80 }}>
                                        减
                                    </Button>
                                    <Tag color="green" style={{ fontSize: 32, padding: '8px 24px' }}>
                                        {count}
                                    </Tag>
                                    <Button type="primary" size="large" icon={<PlusOutlined />} onClick={increment} style={{ width: 80 }}>
                                        加
                                    </Button>
                                </Space>
                            </div>
                            <div>
                                <Button type="default" size="large" icon={<SyncOutlined />} onClick={() => setCount(0)} style={{ width: '100%' }}>
                                    重置计数
                                </Button>
                            </div>
                        </Space>
                    </Card>
                </Col>

                {/* 主题切换 */}
                <Col xs={24} lg={8}>
                    <Card
                        title="主题切换"
                        variant="outlined"
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        }}
                    >
                        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                            <div style={{ textAlign: 'center' }}>
                                <Button
                                    type={themeMode === 'dark' ? 'default' : 'primary'}
                                    size="large"
                                    icon={themeMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                                    onClick={toggleThemeMode}
                                    style={{ width: '100%', fontSize: 18, padding: '12px' }}
                                >
                                    {themeMode === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
                                </Button>
                            </div>
                            <div>
                                <Paragraph>
                                    当前模式: <strong>{themeMode === 'dark' ? '暗色' : '亮色'}</strong>
                                </Paragraph>
                                <Paragraph>这个主题状态可以在整个应用中共享和使用。</Paragraph>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Divider />

            {/* Zustand 介绍 */}
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Card
                        title="Zustand 简介"
                        variant="outlined"
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        }}
                    >
                        <Space orientation="vertical" size="middle" style={{ width: '100%', textAlign: 'left' }}>
                            <Paragraph>Zustand 是一个轻量级、高性能的状态管理库，具有以下特点：</Paragraph>
                            <ul>
                                <li>
                                    <strong>简洁 API</strong>：使用 hooks 风格，易于学习和使用
                                </li>
                                <li>
                                    <strong>高性能</strong>：基于订阅机制，只更新需要的组件
                                </li>
                                <li>
                                    <strong>TypeScript 支持</strong>：完整的类型安全
                                </li>
                                <li>
                                    <strong>无需 Provider</strong>：不需要在应用顶部包裹 Provider
                                </li>
                                <li>
                                    <strong>中间件支持</strong>：支持持久化、devtools 等中间件
                                </li>
                                <li>
                                    <strong>体积小</strong>：核心库只有约 1KB
                                </li>
                            </ul>
                            <Paragraph>Zustand 适合各种规模的应用，从简单的个人项目到复杂的企业应用。</Paragraph>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24}>
                    <Card
                        title="使用示例"
                        variant="outlined"
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        }}
                    >
                        <Space orientation="vertical" size="middle" style={{ width: '100%', textAlign: 'left' }}>
                            <Paragraph strong>1. 定义 Store</Paragraph>
                            <pre style={{ backgroundColor: '#f6f8fa', padding: 16, borderRadius: 8 }}>
                                {`import { create } from 'zustand';

interface AppStore {
  count: number;
  themeMode: 'light' | 'dark';
  increment: () => void;
  decrement: () => void;
  toggleThemeMode: () => void;
  setCount: (count: number) => void;
  setThemeMode: (themeMode: 'light' | 'dark') => void;
}

export const useAppStore = create<AppStore>((set) => ({
  count: 0,
  themeMode: 'light',
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  toggleThemeMode: () => set((state) => ({
    themeMode: state.themeMode === 'light' ? 'dark' : 'light'
  })),
  setCount: (count) => set({ count }),
  setThemeMode: (themeMode) => set({ themeMode }),
}));`}
                            </pre>

                            <Paragraph strong>2. 在组件中使用</Paragraph>
                            <pre style={{ backgroundColor: '#f6f8fa', padding: 16, borderRadius: 8 }}>
                                {`import { useAppStore } from '@/store';

const MyComponent = () => {
  const { count, increment, decrement } = useAppStore();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};`}
                            </pre>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* 页脚信息 */}
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 40,
                    padding: '20px 0',
                    color: '#999',
                    fontSize: 14,
                }}
            ></div>
        </div>
    );
};

export default ZustandDemo;
