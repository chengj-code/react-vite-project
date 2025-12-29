import { useParams, useSearchParams } from 'react-router-dom';

const Test = () => {
    // 使用useParams获取URL动态参数
    const params = useParams<{ id?: string; status?: string }>();
    console.log(params);

    // 使用useSearchParams获取查询参数
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') || '1';
    const sort = searchParams.get('sort') || 'default';

    // 处理查询参数更新
    const handleSortChange = (newSort: string) => {
        setSearchParams(prev => {
            prev.set('sort', newSort);
            return prev;
        });
    };

    return (
        <div style={{ margin: '20px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <h1>Test 嵌套路由组件</h1>

            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>动态参数 (useParams)</h2>
                <p>
                    当前ID参数: <strong>{params.id || '无'}</strong>
                </p>
                <p>
                    当前状态参数: <strong>{params.status || '无'}</strong>
                </p>
            </div>

            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>查询参数 (useSearchParams)</h2>
                <p>
                    当前页码: <strong>{page}</strong>
                </p>
                <p>
                    当前排序方式: <strong>{sort}</strong>
                </p>

                <div style={{ marginTop: '10px' }}>
                    <button onClick={() => handleSortChange('asc')} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>
                        升序排列
                    </button>
                    <button onClick={() => handleSortChange('desc')} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>
                        降序排列
                    </button>
                    <button onClick={() => handleSortChange('default')} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                        默认排序
                    </button>
                </div>
            </div>

            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>路由示例链接</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li style={{ margin: '10px 0' }}>
                        <a href="/todo/test" style={{ textDecoration: 'none', color: '#1890ff' }}>
                            /todo/test (无动态参数)
                        </a>
                    </li>
                    <li style={{ margin: '10px 0' }}>
                        <a href="/todo/test/123" style={{ textDecoration: 'none', color: '#1890ff' }}>
                            /todo/test/123 (ID: 123)
                        </a>
                    </li>
                    <li style={{ margin: '10px 0' }}>
                        <a href="/todo/test/456/active" style={{ textDecoration: 'none', color: '#1890ff' }}>
                            /todo/test/456/active (ID: 456, 状态: active)
                        </a>
                    </li>
                    <li style={{ margin: '10px 0' }}>
                        <a href="/todo/test?page=2&sort=asc" style={{ textDecoration: 'none', color: '#1890ff' }}>
                            /todo/test?page=2&sort=asc (查询参数)
                        </a>
                    </li>
                    <li style={{ margin: '10px 0' }}>
                        <a href="/todo/test/789/completed?page=3&sort=desc" style={{ textDecoration: 'none', color: '#1890ff' }}>
                            /todo/test/789/completed?page=3&sort=desc (动态参数 + 查询参数)
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Test;
