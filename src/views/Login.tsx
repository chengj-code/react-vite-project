import { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Space, Spin } from 'antd';
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone, ScanOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

const { Title } = Typography;

const Login = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAppStore();

    // 如果已经登录，重定向到首页
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // 处理登录提交
    const handleLogin = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            const success = await login(values.username, values.password);
            if (success) {
                message.success('登录成功！');
                navigate('/');
            } else {
                message.error('用户名或密码错误');
            }
        } catch (error) {
            message.error('登录失败，请稍后重试');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    // 处理忘记密码
    const handleForgotPassword = () => {
        message.info('忘记密码功能开发中');
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0078d4',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* 登录卡片 */}
            <div
                style={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 0,
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                    padding: '32px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* 登录加载遮罩 */}
                {loading && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            borderRadius: 0,
                        }}
                    >
                        <Spin size="large" tip="登录中..." style={{ color: '#fff' }} />
                    </div>
                )}

                {/* 二维码图标 */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 40,
                        height: 40,
                        backgroundColor: '#0078d4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 20,
                    }}
                >
                    <ScanOutlined />
                </div>

                {/* 表单 */}
                <Form
                    form={form}
                    onFinish={handleLogin}
                    layout="vertical"
                    initialValues={{
                        username: '',
                        password: '',
                    }}
                >
                    {/* 标题 */}
                    <div style={{ marginBottom: 24 }}>
                        <Title level={3} style={{ margin: 0, color: '#fff', fontSize: 20, fontWeight: 500 }}>
                            系统登录
                        </Title>
                    </div>

                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: '请输入用户名' },
                            { min: 3, max: 20, message: '用户名长度必须在3到20个字符之间' },
                        ]}
                        style={{ marginBottom: 16 }}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#999', marginRight: 8 }} />}
                            placeholder="请输入用户名"
                            size="large"
                            style={{
                                height: 40,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: 0,
                                color: '#fff',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: '请输入密码' },
                            { min: 6, max: 32, message: '密码长度必须在6到32个字符之间' },
                        ]}
                        style={{ marginBottom: 16 }}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#999', marginRight: 8 }} />}
                            placeholder="请输入密码"
                            size="large"
                            style={{
                                height: 40,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: 0,
                                color: '#fff',
                            }}
                            iconRender={visible => (visible ? <EyeTwoTone style={{ color: '#999' }} /> : <EyeInvisibleOutlined style={{ color: '#999' }} />)}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 24 }}>
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Button type="text" onClick={handleForgotPassword} style={{ padding: 0, color: '#0078d4', border: 0 }}>
                                忘记密码？
                            </Button>
                        </Space>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            style={{
                                width: '100%',
                                height: 40,
                                backgroundColor: '#0078d4',
                                border: 0,
                                borderRadius: 0,
                                color: '#fff',
                                fontSize: 14,
                                fontWeight: 500,
                            }}
                        >
                            登录
                        </Button>
                    </Form.Item>

                    {/* 底部链接 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button type="text" onClick={() => message.info('注册功能开发中')} style={{ padding: 0, color: '#0078d4', border: 0, fontSize: 12 }}>
                            注册账号
                        </Button>
                        <Button type="text" onClick={handleForgotPassword} style={{ padding: 0, color: '#0078d4', border: 0, fontSize: 12 }}>
                            忘记密码
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;
