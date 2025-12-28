import React, { useState, useCallback, useMemo } from 'react';
import { Card, Input, Button, Space, Typography, Divider, Badge, Tag, ConfigProvider, theme } from 'antd';
import { MessageOutlined, SettingOutlined, ShareAltOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

const { Title, Paragraph } = Typography;

// ====================== 2. 父组件：演示各种通信方式 ======================
interface ParentComponentProps {
    // 父组件可以接收的props（示例）
    initialMessage?: string;
}

const ParentComponent = ({ initialMessage = 'Hello from Parent' }: ParentComponentProps) => {
    // 父组件状态
    const [parentState, setParentState] = useState<string>(initialMessage);
    const [childMessage, setChildMessage] = useState<string>('');
    const [siblingMessage, setSiblingMessage] = useState<string>('');
    const { count, themeMode } = useAppStore();
    // 父传子：通过props传递数据和回调函数
    const parentToChildData = useMemo(
        () => ({
            title: 'Parent to Child Communication',
            count: count,
            isActive: true,
        }),
        [count]
    );

    // 子传父：父组件定义回调函数，传递给子组件
    const handleChildMessage = useCallback((message: string) => {
        setChildMessage(message);
        setParentState(`Parent updated by Child: ${message}`);
    }, []);

    // 兄弟组件通信：通过父组件作为中介
    const handleSiblingUpdate = useCallback((message: string) => {
        setSiblingMessage(message);
    }, []);

    const handleParentAction = () => {
        setParentState('Parent state updated!');
    };
    const navigate = useNavigate();

    // 使用Ant Design的主题配置
    const themeConfig = useMemo(() => {
        return {
            algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        };
    }, [themeMode]);

    return (
        <ConfigProvider theme={themeConfig}>
            {/* 返回首页按钮 */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Button onClick={() => navigate('/')} type="primary" size="large" icon={<ArrowRightOutlined />}>
                    返回首页
                </Button>
            </div>
            <Card title={<Title level={3}>React组件通信方式演示</Title>} style={{ maxWidth: 800, margin: '0 auto' }}>
                {/* 父组件状态展示 */}
                <div style={{ marginBottom: 24, padding: 16, backgroundColor: themeMode === 'dark' ? '#333' : '#f5f5f5', borderRadius: 8 }}>
                    <Title level={5}>父组件状态</Title>
                    <Paragraph>{parentState}</Paragraph>
                    <Button type="primary" onClick={handleParentAction} icon={<SettingOutlined />}>
                        更新父组件状态
                    </Button>
                </div>

                <Divider>1. 父传子通信 (Props)</Divider>
                {/* 父传子：通过props传递数据 */}
                <ChildComponent data={parentToChildData} onMessage={handleChildMessage} />

                <Divider>2. 子传父通信 (Callback Props)</Divider>
                {/* 子传父：子组件通过回调函数传递数据给父组件 */}
                <div style={{ marginBottom: 24 }}>
                    <Title level={5}>子组件传递的消息：</Title>
                    <Badge status={childMessage ? 'success' : 'default'} text={childMessage || '等待子组件消息'} />
                </div>

                <Divider>3. 兄弟组件通信 (Parent as Mediator)</Divider>
                {/* 兄弟组件通信：通过父组件作为中介 */}
                <Space orientation="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <SiblingComponentA onUpdate={handleSiblingUpdate} />
                        <SiblingComponentB message={siblingMessage} />
                    </div>
                    <div style={{ marginTop: 16, padding: 16, backgroundColor: themeMode === 'dark' ? '#333' : '#f5f5f5', borderRadius: 8 }}>
                        <Title level={5}>兄弟组件通信状态：</Title>
                        <Paragraph>组件A传递给组件B的消息：{siblingMessage || '暂无消息'}</Paragraph>
                    </div>
                </Space>

                <Divider>4. 跨组件通信 (Zustand)</Divider>
                {/* 跨组件通信：使用Zustand */}
                <ContextChildComponent1 />
                <ContextChildComponent2 />
            </Card>
        </ConfigProvider>
    );
};

// ====================== 子组件：父传子通信 ======================
interface ChildComponentProps {
    data: {
        title: string;
        count: number;
        isActive: boolean;
    };
    onMessage: (message: string) => void;
}

const ChildComponent = ({ data, onMessage }: ChildComponentProps) => {
    const [childInput, setChildInput] = useState<string>('');

    const handleSendMessage = useCallback(() => {
        if (childInput.trim()) {
            onMessage(childInput.trim());
            setChildInput('');
        }
    }, [childInput, onMessage]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setChildInput(e.target.value);
    }, []);

    return (
        <Card size="small" title="子组件（接收父组件数据）">
            <div style={{ marginBottom: 16 }}>
                <Paragraph>父组件传递的数据：</Paragraph>
                <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                    <li>标题: {data.title}</li>
                    <li>计数: {data.count}</li>
                    <li>激活状态: {data.isActive ? '是' : '否'}</li>
                </ul>
            </div>

            <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
                <Input placeholder="输入消息发送给父组件" value={childInput} onChange={handleInputChange} onPressEnter={handleSendMessage} allowClear />
                <Button type="primary" onClick={handleSendMessage} icon={<MessageOutlined />} disabled={!childInput.trim()}>
                    发送给父组件
                </Button>
            </Space.Compact>
        </Card>
    );
};

// ====================== 兄弟组件A：发送消息 ======================
interface SiblingComponentAProps {
    onUpdate: (message: string) => void;
}

const SiblingComponentA = ({ onUpdate }: SiblingComponentAProps) => {
    const [siblingInput, setSiblingInput] = useState<string>('');

    const handleSendToSibling = useCallback(() => {
        if (siblingInput.trim()) {
            onUpdate(siblingInput.trim());
            setSiblingInput('');
        }
    }, [siblingInput, onUpdate]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSiblingInput(e.target.value);
    }, []);

    return (
        <Card size="small" title="兄弟组件A（发送方）" style={{ flex: 1 }}>
            <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
                <Input placeholder="输入消息发送给兄弟组件B" value={siblingInput} onChange={handleInputChange} onPressEnter={handleSendToSibling} allowClear />
                <Button type="primary" onClick={handleSendToSibling} icon={<ShareAltOutlined />} disabled={!siblingInput.trim()}>
                    发送给兄弟B
                </Button>
            </Space.Compact>
            <Tag color="blue">通过父组件传递消息</Tag>
        </Card>
    );
};

// ====================== 兄弟组件B：接收消息 ======================
interface SiblingComponentBProps {
    message: string;
}

const SiblingComponentB = ({ message }: SiblingComponentBProps) => {
    // 使用useMemo缓存消息显示
    const displayMessage = useMemo(() => {
        return message || '等待兄弟组件A的消息...';
    }, [message]);

    return (
        <Card size="small" title="兄弟组件B（接收方）" style={{ flex: 1 }}>
            <Paragraph>从兄弟组件A接收的消息：</Paragraph>
            <div
                style={{
                    padding: 16,
                    backgroundColor: '#e6f7ff',
                    borderRadius: 8,
                    minHeight: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    transition: 'all 0.3s ease',
                }}
            >
                {displayMessage}
            </div>
            <Tag color="green" style={{ marginTop: 8 }}>
                通过父组件接收消息
            </Tag>
        </Card>
    );
};

// ====================== 跨组件通信：Zustand子组件1 ======================
const ContextChildComponent1 = () => {
    const { themeMode, toggleThemeMode } = useAppStore();
    const isDark = themeMode === 'dark';
    const theme = themeMode;

    return (
        <Card size="small" title="Zustand子组件1" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
                <Paragraph>当前主题：{theme === 'light' ? '浅色' : '深色'}</Paragraph>
            </div>
            <Space size="middle">
                <Button type={isDark ? 'default' : 'primary'} onClick={toggleThemeMode} icon={isDark ? '☀️' : '🌙'} block>
                    切换至{isDark ? '浅色' : '深色'}主题
                </Button>
                <Tag color="purple">使用Zustand</Tag>
            </Space>
        </Card>
    );
};

// ====================== 跨组件通信：Zustand子组件2 ======================
const ContextChildComponent2 = () => {
    const { themeMode } = useAppStore();
    const isDark = themeMode === 'dark';
    const theme = themeMode;

    return (
        <Card size="small" title="Zustand子组件2">
            <div
                style={{
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: isDark ? '#f5f5f520' : '#f5f520',
                    transition: 'all 0.3s ease',
                }}
            >
                <Paragraph>
                    我是Zustand子组件2，
                    <strong>共享</strong> 了Zustand子组件1切换的主题状态。
                </Paragraph>
                <Paragraph>
                    当前主题：<Tag color={isDark ? 'blue' : 'gold'}>{theme === 'light' ? '浅色主题' : '深色主题'}</Tag>
                </Paragraph>
            </div>
            <Tag color="purple" style={{ marginTop: 8 }}>
                使用Zustand
            </Tag>
        </Card>
    );
};

export default ParentComponent;
