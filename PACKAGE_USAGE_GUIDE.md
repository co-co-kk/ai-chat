# 将 AiChat 组件打包为独立库的完整指南

## 项目结构分析

您的 AiChat 组件目前是 Next.js 项目的一部分，位于 `components/ai-chat/` 目录。要将其打包为可在其他项目中使用的独立组件库，需要进行以下步骤：

## 1. 修改 package.json 配置

```json
{
  "name": "@cocoa/ai-chat",  // 组件库名称
  "version": "0.1.0",       // 版本号
  "private": false,         // 设为 false 以允许发布
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build-lib": "tsup components/ai-chat/index.ts --format esm,cjs --dts --external react --external react-dom --external next",
    "build:lib": "npm run build-lib"
  },
  "main": "./dist/index.js",        // CommonJS 入口
  "module": "./dist/index.esm.js",  // ESModule 入口
  "types": "./dist/index.d.ts",     // 类型定义文件
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist",
    "README.md",
    "package.json"
  ],
  "dependencies": {
    // ... 您的依赖
  },
  "devDependencies": {
    "tsup": "^8.3.5",  // 用于构建
    // ... 其他 dev 依赖
  }
}
```

## 2. 创建构建配置

创建 `tsup.config.ts` 文件：

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['components/ai-chat/index.ts'],
  format: ['esm', 'cjs'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  external: [
    'react',
    'react-dom',
    'next',
    '@assistant-ui/react',
    '@assistant-ui/react-ai-sdk',
    '@assistant-ui/react-markdown',
    '@ai-sdk/openai',
    'ai',
    'zustand',
    'framer-motion',
    'lucide-react',
    '@radix-ui/react-*',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'tw-animate-css',
    'rehype-raw',
    'remark-gfm',
  ],
});
```

## 3. 路径调整

将组件中使用 Next.js 特定路径（如 `@/app/mockData`）改为相对路径或构建时替换：

- `@/app/mockData/chat-sessions` → `../../app/mockData/chat-sessions`
- `@/lib/utils` → 相应的相对路径或提取到组件内部

## 4. 构建命令

```bash
npm run build-lib
```

构建后的文件将位于 `dist/` 目录中。

## 5. 产物说明

构建后会在 `dist/` 目录生成：

- `index.js` - CommonJS 格式
- `index.esm.js` - ESModule 格式
- `index.d.ts` - 类型定义文件

## 6. 在其他项目中使用

### 在 Vite 项目中使用

1. 安装组件库：

```bash
npm install @cocoa/ai-chat
```

2. 使用组件：

```jsx
import { AiChat } from '@cocoa/ai-chat';

function App() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <AiChat
        title="AI 助手"
        onSendMessage={async ({ text, attachments }) => {
          console.log('发送消息:', text, attachments);
        }}
        onAttachmentsSelect={async (files) => {
          console.log('上传文件:', files);
        }}
      />
    </div>
  );
}

export default App;
```

### 样式配置

由于组件使用了 Tailwind CSS，您需要在使用项目的入口文件中引入样式：

```js
import 'tailwindcss/tailwind.css';
```

或者配置 Tailwind CSS 的 [content](file:///Users/cqweaver/Desktop/xw/cocoa/ai-chat/next.config.ts#L1-L3) 路径以包含组件库样式。

## 7. 注意事项

1. **依赖处理**：组件库的依赖项（如 React、@assistant-ui/react 等）应该作为 peerDependencies，避免重复打包
2. **样式处理**：如果组件使用了 Tailwind，确保使用项目正确配置了 Tailwind
3. **路径依赖**：确保所有 Next.js 特定路径（如 `@/`）在构建前被转换为标准路径
4. **mock 数据**：考虑在生产构建中移除 mock 数据或提供配置选项

## 8. 发布到 npm

```bash
npm login
npm publish
```

## 9. 在 Vite 项目中使用的配置示例

`vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 如果需要处理样式
  css: {
    modules: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "path/to/your/styles";`
      }
    }
  }
})
```

`package.json` 中的依赖：

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@cocoa/ai-chat": "^0.1.0",
    "tailwindcss": "^3.0.0"
  }
}
```

这样，您的 AiChat 组件就可以作为一个独立的库在各种 React 项目中使用了。