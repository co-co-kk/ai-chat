# @cocoa/ai-chat

这是一个可重用的 AI 聊天组件库，基于 React 和 TypeScript 构建，支持文件上传、会话管理等功能。

## 安装

```bash
npm install @cocoa/ai-chat
# 或
yarn add @cocoa/ai-chat
# 或
pnpm add @cocoa/ai-chat
```

## 使用

```jsx
import { AiChat } from '@cocoa/ai-chat';
import '@cocoa/ai-chat/dist/style.css';

function App() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <AiChat
        title="AI 助手"
        onSendMessage={async ({ text, attachments }) => {
          // 处理发送消息
          console.log('发送消息:', text, attachments);
        }}
        onAttachmentsSelect={async (files) => {
          // 处理文件上传
          console.log('上传文件:', files);
        }}
      />
    </div>
  );
}

export default App;
```

## API

### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| title | string | 聊天窗口标题 |
| messages | AiChatMessage[] | 消息列表 |
| onMessagesChange | (messages: AiChatMessage[]) => void | 消息列表变化回调 |
| onSendMessage | ({ text: string, attachments: AiChatFile[], message: AiChatMessage }) => void | 发送消息回调 |
| onAttachmentsSelect | (files: File[]) => Promise<AiChatFile[]> | 选择附件回调 |
| onCancelUpload | (file: AiChatFile) => void | 取消上传回调 |
| sessions | AiChatSession[] | 会话列表 |
| onSessionChange | (sessionId: string) => void | 会话切换回调 |
| onSessionCreate | (session: AiChatSession) => void | 创建会话回调 |
| placeholder | string | 输入框占位符 |
| disabled | boolean | 是否禁用 |

### 类型定义

该库导出以下类型定义：

- `AiChatMessage`: 消息类型
- `AiChatFile`: 文件类型
- `AiChatSession`: 会话类型
- `AiChatState`: 组件状态类型
- `AiChatProps`: 组件属性类型
- 等等...

## 开发

```bash
# 安装依赖
npm install

# 构建组件库
npm run build:lib

# 运行开发服务器
npm run dev
```

## 支持的框架

该组件库可在以下框架中使用：
- Next.js
- Vite (React)
- Create React App
- 以及其他支持 React 的框架

> 注意：使用时需要自行配置 Tailwind CSS 样式框架，因为本组件库依赖 Tailwind。