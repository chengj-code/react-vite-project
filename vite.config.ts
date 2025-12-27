import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // 加载环境变量
    const env = loadEnv(mode, process.cwd(), '');

    return {
        // 1. 构建目标配置
        build: {
            // 配置构建目标为现代浏览器
            target: 'es2020',

            // 2. 静态资源处理策略
            assetsDir: 'assets',
            assetsInlineLimit: 4096, // 小于4KB的资源内联到JS/HTML中
            outDir: 'dist',
            emptyOutDir: true,

            // 3. 代码分割规则
            rollupOptions: {
                output: {
                    // 静态资源分类打包
                    assetFileNames: 'assets/[ext]/[name]-[hash:8].[ext]',
                    chunkFileNames: 'assets/js/[name]-[hash:8].js',
                    entryFileNames: 'assets/js/[name]-[hash:8].js',

                    // 合理的代码分割规则
                    manualChunks: id => {
                        // 第三方库分割
                        if (id.includes('node_modules')) {
                            if (id.includes('react') || id.includes('react-dom')) {
                                return 'react-vendor';
                            } else if (id.includes('antd')) {
                                return 'antd-vendor';
                            } else if (id.includes('react-router-dom')) {
                                return 'router-vendor';
                            } else {
                                return 'other-vendors';
                            }
                        }
                    },
                },
                // 启用treeshaking
                treeshake: {
                    moduleSideEffects: 'no-external',
                    propertyReadSideEffects: false,
                },
            },

            // 4. 生产环境压缩
            minify: mode === 'production' ? 'esbuild' : 'esbuild', // 使用esbuild进行压缩，速度更快
            // 优化ESBuild压缩配置
            esbuildOptions: {
                // 配置ESBuild压缩级别
                minifyIdentifiers: true,
                minifySyntax: true,
                minifyWhitespace: true,
                // 移除console和debugger
                drop: mode === 'production' ? ['console', 'debugger'] : [],
                // 配置目标浏览器
                target: 'es2020',
            },

            // 5. 缓存策略
            cacheDir: '.vite', // 自定义缓存目录

            // 6. 优化依赖预构建
            commonjsOptions: {
                transformMixedEsModules: true, // 转换混合ES模块
            },

            // 启用CSS代码分割
            cssCodeSplit: true,

            // 生成构建报告
            reportCompressedSize: true,
            // 生成分析报告
            chunkSizeWarningLimit: 500, // 500KB的chunk大小警告

            // 启用源映射，区分开发/生产环境
            sourcemap: mode === 'development',
        },

        // 7. 优化依赖预构建
        optimizeDeps: {
            include: ['react', 'react-dom', 'antd', 'react-router-dom'], // 强制预构建的依赖
            exclude: [], // 排除预构建的依赖
            cacheDir: '.vite/deps',
        },

        // 8. 开发服务器配置
        server: {
            port: parseInt(env.VITE_PORT || '5173'),
            open: true,
            host: true,
            // 热更新配置
            hmr: {
                overlay: true,
                timeout: 1000,
            },
            // 代理配置
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE_URL || 'http://localhost:3000',
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, ''),
                },
            },
        },

        // 9. 环境变量配置
        define: {
            'import.meta.env.APP_VERSION': JSON.stringify(process.env.npm_package_version),
            'import.meta.env.MODE': JSON.stringify(mode),
            'import.meta.env.PROD': JSON.stringify(mode === 'production'),
            'import.meta.env.DEV': JSON.stringify(mode === 'development'),
        },

        // 10. 插件配置
        plugins: [
            react({
                // React插件优化
                jsxImportSource: 'react',
                tsDecorators: true,
            }),
            // 构建分析插件
            visualizer({
                open: mode === 'production',
                gzipSize: true,
                brotliSize: true,
                filename: 'bundle-analysis.html',
            }),
            // 压缩插件
            compression({
                verbose: true,
                disable: mode === 'development',
                threshold: 10240, // 10KB以上的文件才压缩
                algorithm: 'gzip',
                ext: '.gz',
            }),
            // Brotli压缩
            compression({
                verbose: true,
                disable: mode === 'development',
                threshold: 10240,
                algorithm: 'brotliCompress',
                ext: '.br',
            }),
        ],

        // 11. 路径别名配置
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
            // 优化模块解析
            preserveSymlinks: false,
        },

        // 12. CSS配置
        css: {
            devSourcemap: mode === 'development',
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                },
            },
            modules: {
                generateScopedName: mode === 'production' ? '[hash:base64:5]' : '[name]_[local]_[hash:base64:5]',
            },
        },

        // 13. 日志配置
        logLevel: mode === 'development' ? 'info' : 'warn',
    };
});
