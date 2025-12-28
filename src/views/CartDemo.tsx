import { Card, Button, Typography, Row, Col, Space, InputNumber, Tag, Divider, Empty, message, Popconfirm, type PopconfirmProps, Spin } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined, MinusOutlined, ArrowRightOutlined, ShoppingOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Product, CartItem as CartItemType } from '@/store';

const { Title, Paragraph } = Typography;

// 购物车商品项组件
interface CartItemProps {
    item: CartItemType;
    onRemove: (productId: number) => void;
    onQuantityChange: (productId: number, quantity: number) => void;
}

const CartItem = ({ item, onRemove, onQuantityChange }: CartItemProps) => {
    const { product, quantity } = item;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: 12,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                opacity: 1,
                transform: 'translateY(0)',
            }}
        >
            <img
                src={product.image}
                alt={product.name}
                style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 4,
                    marginRight: 12,
                }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Paragraph strong ellipsis style={{ margin: 0 }}>
                        {product.name}
                    </Paragraph>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onRemove(product.id)} size="small" style={{ padding: 0 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <Paragraph strong style={{ margin: 0, color: '#ff4d4f', fontSize: 16 }}>
                        ￥{product.price.toFixed(2)}
                    </Paragraph>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Button
                            type="text"
                            icon={<MinusOutlined />}
                            onClick={() => onQuantityChange(product.id, quantity - 1)}
                            size="small"
                            style={{ padding: 0, width: 32, height: 32, borderRadius: 4 }}
                        />
                        <InputNumber min={1} max={99} value={quantity} onChange={value => onQuantityChange(product.id, value || 1)} size="small" style={{ width: 60 }} />
                        <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={() => onQuantityChange(product.id, quantity + 1)}
                            size="small"
                            style={{ padding: 0, width: 32, height: 32, borderRadius: 4 }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                    <Paragraph style={{ margin: 0, fontSize: 12, color: '#666' }}>小计: ￥{(product.price * quantity).toFixed(2)}</Paragraph>
                </div>
            </div>
        </div>
    );
};

const CartDemo = () => {
    const navigate = useNavigate();
    const { products, cart, isLoading, fetchProducts, addToCart, removeFromCart, updateQuantity, clearCart } = useAppStore();

    // 在组件挂载时调用fetchProducts获取商品数据
    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
    }, [products.length, fetchProducts]);

    // 计算购物车总价
    const cartTotal = cart.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);

    // 计算购物车商品总数
    const cartItemCount = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    // 处理添加到购物车
    const handleAddToCart = (product: Product) => {
        addToCart(product);
        message.success(`${product.name}已添加到购物车`);
    };

    // 处理移除商品
    const handleRemoveItem = (productId: number) => {
        removeFromCart(productId);
        message.success('商品已从购物车移除');
    };

    // 处理数量变化
    const handleQuantityChange = (productId: number, quantity: number) => {
        updateQuantity(productId, quantity);
    };

    // 处理清空购物车
    const handleClearCart = () => {
        clearCart();
        message.success('购物车已清空');
    };
    const [messageApi] = message.useMessage();

    const confirm: PopconfirmProps['onConfirm'] = () => {
        handleClearCart();
        messageApi.success('Click on Yes');
    };

    const cancel: PopconfirmProps['onCancel'] = () => {
        messageApi.error('Click on No');
    };
    return (
        <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
            {/* 返回首页按钮 */}
            <div style={{ textAlign: 'left', marginBottom: 24 }}>
                <Button onClick={() => navigate('/')} type="primary" size="large" icon={<ArrowRightOutlined />}>
                    返回首页
                </Button>
            </div>

            {/* 页面标题 */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Title level={2} style={{ color: '#1890ff', margin: '0 0 8px 0' }}>
                    <ShoppingCartOutlined style={{ marginRight: 8 }} /> 购物车功能演示
                </Title>
                <Paragraph style={{ fontSize: 16, color: '#666' }}>演示商品添加、购物车管理、数量修改、总价计算等功能</Paragraph>
            </div>

            <Row gutter={[24, 24]}>
                {/* 商品列表 */}
                <Col xs={24} lg={16}>
                    <Card
                        title={
                            <Title level={3} style={{ margin: 0 }}>
                                商品列表
                            </Title>
                        }
                        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
                    >
                        <Spin spinning={isLoading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="加载商品中...">
                            <Row gutter={[16, 16]}>
                                {products.map(product => (
                                    <Col key={product.id} xs={24} sm={12} md={8}>
                                        <Card
                                            hoverable
                                            cover={<img alt={product.name} src={product.image} style={{ height: 150, objectFit: 'cover' }} />}
                                            style={{
                                                borderRadius: 8,
                                                height: '100%',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                            styles={{
                                                body: { display: 'flex', flexDirection: 'column', flex: 1 },
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <Card.Meta
                                                    title={product.name}
                                                    description={
                                                        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: '8px 0' }}>
                                                            {product.description}
                                                        </Paragraph>
                                                    }
                                                />
                                                <div style={{ marginTop: 'auto', padding: '8px 0' }}>
                                                    <Paragraph strong style={{ color: '#ff4d4f', fontSize: 18, margin: 0 }}>
                                                        ￥{product.price.toFixed(2)}
                                                    </Paragraph>
                                                </div>
                                            </div>
                                            <div>
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleAddToCart(product)}
                                                    icon={<ShoppingCartOutlined />}
                                                    block
                                                    size="large"
                                                    style={{ borderRadius: 6, transition: 'all 0.3s ease' }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.transform = 'scale(1.02)';
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    添加到购物车
                                                </Button>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Spin>
                    </Card>
                </Col>

                {/* 购物车 */}
                <Col xs={24} lg={8}>
                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Title level={3} style={{ margin: 0 }}>
                                    购物车
                                </Title>
                                {cartItemCount > 0 && (
                                    <Tag color="red" style={{ fontSize: 14 }}>
                                        {cartItemCount} 件商品
                                    </Tag>
                                )}
                            </div>
                        }
                        style={{
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            height: '100%',
                            position: 'sticky',
                            top: 24,
                        }}
                    >
                        {cart.length === 0 ? (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="购物车为空" style={{ margin: '40px 0' }}>
                                <Button type="default" onClick={() => navigate('/')} icon={<ShoppingOutlined />}>
                                    去购物
                                </Button>
                            </Empty>
                        ) : (
                            <>
                                {/* 购物车商品列表 */}
                                <Space orientation="vertical" style={{ width: '100%' }} size="middle">
                                    {cart.map(item => (
                                        <CartItem key={item.product.id} item={item} onRemove={handleRemoveItem} onQuantityChange={handleQuantityChange} />
                                    ))}
                                </Space>

                                <Divider />

                                {/* 购物车总结 */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Paragraph strong style={{ margin: 0, fontSize: 16 }}>
                                        商品总价:
                                    </Paragraph>
                                    <Paragraph strong style={{ margin: 0, fontSize: 20, color: '#ff4d4f' }}>
                                        ￥{cartTotal.toFixed(2)}
                                    </Paragraph>
                                </div>

                                {/* 购物车操作按钮 */}
                                <Space orientation="vertical" style={{ width: '100%' }} size="middle">
                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        style={{ borderRadius: 6, height: 48, fontSize: 16 }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        去结算
                                    </Button>
                                    <Popconfirm title="提示" description="您确定要清空购物车?" onConfirm={confirm} onCancel={cancel} okText="确定" cancelText="取消">
                                        <Button type="default" size="large" block style={{ borderRadius: 6, height: 48 }}>
                                            清空购物车
                                        </Button>
                                    </Popconfirm>
                                </Space>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CartDemo;
