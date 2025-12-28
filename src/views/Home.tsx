import { Card, Button, Typography, Row, Col, Avatar, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { CheckSquareOutlined, AppstoreOutlined, CodeOutlined, ArrowRightOutlined, LogoutOutlined, LoginOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store';

const { Title, Paragraph } = Typography;

// 应用卡片组件属性接口
interface AppCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    iconBgColor: string;
    to: string;
    buttonText: string;
}

// 应用卡片组件
const AppCard = ({ title, description, icon, iconBgColor, to, buttonText }: AppCardProps) => {
    return (
        <Card
            hoverable
            style={{
                height: '100%',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <Avatar size={48} icon={icon} style={{ backgroundColor: iconBgColor, marginRight: 16 }} />
                <Title level={4} style={{ margin: 0 }}>
                    {title}
                </Title>
            </div>
            <Paragraph style={{ color: '#666', marginBottom: 24 }}>{description}</Paragraph>
            <Link to={to} style={{ textDecoration: 'none' }}>
                <Button type="primary" size="large" icon={<ArrowRightOutlined />} style={{ borderRadius: 6, width: '100%' }}>
                    {buttonText}
                </Button>
            </Link>
        </Card>
    );
};

// 应用数据
const apps = [
    {
        title: '待办事项列表',
        description: '一个功能完整的待办事项管理应用，支持添加、编辑、删除和标记完成任务，以及主题切换功能。',
        icon: <CheckSquareOutlined />,
        iconBgColor: '#52c41a',
        to: '/todo',
        buttonText: '进入应用',
    },
    {
        title: '组件通信演示',
        description: '演示React组件间的多种通信方式，包括父子组件通信、兄弟组件通信和跨组件通信。',
        icon: <AppstoreOutlined />,
        iconBgColor: '#1890ff',
        to: '/reducer',
        buttonText: '进入应用',
    },
    {
        title: 'Zustand 状态管理演示',
        description: '演示Zustand状态管理库的基本用法，包括状态定义、状态更新和状态订阅。',
        icon: <CodeOutlined />,
        iconBgColor: '#722ed1',
        to: '/zustand',
        buttonText: '进入演示',
    },
    {
        title: '购物车功能演示',
        description: '演示完整的购物车功能，包括商品添加、数量修改、移除商品、总价计算和本地存储。',
        icon: <ShoppingCartOutlined />,
        iconBgColor: '#ff4d4f',
        to: '/cart',
        buttonText: '进入演示',
    },
];

const Home = () => {
    const { isAuthenticated, user, logout } = useAppStore();
    const navigate = useNavigate();

    // 处理登出
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // 处理登录
    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
            {/* 右上角登录/登出按钮 */}
            <div style={{ textAlign: 'right', marginBottom: 24 }}>
                <Space size="middle">
                    {isAuthenticated && user && (
                        <Paragraph style={{ margin: 0, fontWeight: 'bold' }}>
                            欢迎，{user.username}！
                        </Paragraph>
                    )}
                    {isAuthenticated ? (
                        <Button
                            type="primary"
                            danger
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            登出
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            icon={<LoginOutlined />}
                            onClick={handleLogin}
                        >
                            登录
                        </Button>
                    )}
                </Space>
            </div>

            {/* 页面标题 */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Avatar size={80} icon={<CodeOutlined style={{ fontSize: 40 }} />} style={{ backgroundColor: '#1890ff', marginBottom: 16 }} />
                <Title level={2} style={{ color: '#1890ff', margin: '0 0 8px 0' }}>
                    React 应用演示
                </Title>
                <Paragraph style={{ fontSize: 16, color: '#666' }}>一个包含多种React特性的演示应用</Paragraph>
            </div>

            {/* 应用列表 */}
            <Row gutter={[24, 24]}>
                {apps.map((app, index) => (
                    <Col key={index} xs={24} sm={12} lg={8}>
                        <AppCard title={app.title} description={app.description} icon={app.icon} iconBgColor={app.iconBgColor} to={app.to} buttonText={app.buttonText} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Home;
