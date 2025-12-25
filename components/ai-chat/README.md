# AiChat 组合式 API 重构

## 概述

这次重构将原本基于大量 props 的 AiChat 组件重构为更加灵活和可扩展的组合式 API，灵感来自 assistant-ui 的设计模式。

## 对比

### ❌ 旧的方式（反面教材）

```tsx
<AiChat
  title="标题文案"
  mode="standard"
  open={openChat}
  onOpenChange={setOpenChat}
  sessions={sessions}
  onSessionsChange={setSessions}
  sessionMessages={sessionMessages}
  initialSessionId={activeSessionId}
  onSessionChange={handleSessionChange}
  onSessionCreate={(session) => {
    setSessions((prev) => [session, ...prev]);
    setSessionMessages((prev) => ({ ...prev, [session.id]: [] }));
    setActiveSessionId(session.id);
    setMessages([]);
  }}
  messages={messages}
  onMessagesChange={handleMessagesChange}
  attachments={attachments}
  onAttachmentsChange={setAttachments}
  onSendMessage={createSendHandler(setMessages, activeSessionId)}
  onAttachmentsSelect={createUploadHandler(setAttachments)}
  onCancelUpload={(file) => {
    chatService.cancelUpload(file.id).then(setAttachments);
  }}
  inputLeftSlot={({ currentInput, openCustomDrawer, toggleCustomDrawer }) => (
    <div className="flex items-center gap-2">
      <button 
        className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
        onClick={() => toggleCustomDrawer('knowledge-base')}
      >
        能力
        <ChevronDown className="size-3" />
      </button>
    </div>
  )}
  customRenderers={renderers}
  customDrawers={customDrawers}
/>
```

### ✅ 新的组合式 API

```tsx
<Chat
  title="标题文案"
  mode="standard"
  open={openChat}
  onOpenChange={setOpenChat}
  sessions={sessions}
  onSessionsChange={setSessions}
  sessionMessages={sessionMessages}
  initialSessionId={activeSessionId}
  onSessionChange={handleSessionChange}
  onSessionCreate={(session) => {
    setSessions((prev) => [session, ...prev]);
    setSessionMessages((prev) => ({ ...prev, [session.id]: [] }));
    setActiveSessionId(session.id);
    setMessages([]);
  }}
  messages={messages}
  onMessagesChange={handleMessagesChange}
  attachments={attachments}
  onAttachmentsChange={setAttachments}
  onSendMessage={createSendHandler(setMessages, activeSessionId)}
  onAttachmentsSelect={createUploadHandler(setAttachments)}
  onCancelUpload={(file) => {
    chatService.cancelUpload(file.id).then(setAttachments);
  }}
  customRenderers={renderers}
  customDrawers={customDrawers}
>
  {/* 自定义侧边栏内容 - 只在 wide 模式下显示 */}
  <Chat.SidePanel.Sidebar>
    <div className="space-y-3 text-xs text-slate-500">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        扩展侧边栏
        <RefreshCw className="size-3" />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        在这里挂载知识库、推荐问题或统计信息。
      </div>
    </div>
  </Chat.SidePanel.Sidebar>
</Chat>
```

## 新的组件结构

### 核心组件

- `Chat` - 主容器组件，包含所有状态管理
- `Chat.Header` - 头部区域
- `Chat.Messages` - 消息列表区域
- `Chat.Input` - 输入框区域
- `Chat.SidePanel` - 侧边栏（仅在 wide 模式显示）
- `Chat.Drawers` - 抽屉组件容器

### 子组件

#### Chat.Header
- `Chat.Header.Title` - 标题
- `Chat.Header.Actions` - 头部操作按钮容器
- `Chat.Header.Action` - 单个头部操作按钮

#### Chat.Messages
- `Chat.Messages.Message` - 单个消息组件
- `Chat.Messages.Empty` - 空状态组件

#### Chat.Input
- `Chat.Input.Field` - 输入框
- `Chat.Input.Left` - 输入框左侧区域
- `Chat.Input.Right` - 输入框右侧区域
- `Chat.Input.Attachment` - 附件上传按钮
- `Chat.Input.Action` - 输入框操作按钮
- `Chat.Input.Send` - 发送按钮

#### Chat.SidePanel
- `Chat.SidePanel.Sidebar` - 侧边栏内容

#### Chat.Drawers
- `Chat.Drawers.Drawer` - 单个抽屉组件

## 扩展机制

### 1. 头部按钮扩展

```tsx
<Chat.Header>
  <Chat.Header.Title>自定义标题</Chat.Header.Title>
  <Chat.Header.Actions>
    <Chat.Header.Action
      label="新会话"
      onClick={handleCreateSession}
      variant="primary"
      icon={<Plus className="size-4" />}
    />
    <Chat.Header.Action
      label="历史"
      onClick={() => setHistoryOpen(!historyOpen)}
      variant="secondary"
      icon={<History className="size-4" />}
    />
  </Chat.Header.Actions>
</Chat.Header>
```

### 2. 输入框按钮扩展

```tsx
<Chat.Input>
  <Chat.Input.Left>
    <Chat.Input.Attachment onFileSelect={handleFileSelect} />
    <Chat.Input.Action
      label="能力"
      onClick={() => toggleCustomDrawer('knowledge-base')}
      icon={<ChevronDown className="size-3" />}
    />
  </Chat.Input.Left>
  <Chat.Input.Right>
    <Chat.Input.Send />
  </Chat.Input.Right>
</Chat.Input>
```

### 3. 消息渲染扩展

通过 `customRenderers` 属性支持自定义消息类型渲染：

```tsx
const renderers = {
  "analysis-card": (message) => <RendererCard message={message} />,
  "custom-tool": (message) => <CustomToolCard message={message} />,
};

<Chat customRenderers={renderers}>
  {/* ... */}
</Chat>
```

### 4. 抽屉组件扩展

```tsx
const customDrawers = [
  {
    id: 'knowledge-base',
    title: '知识库',
    content: <KnowledgeBaseContent />,
  },
  {
    id: 'tools-panel',
    title: '工具面板',
    content: <ToolsPanelContent />,
  }
];

<Chat customDrawers={customDrawers}>
  {/* ... */}
</Chat>
```

## 优势

1. **更清晰的组件结构** - 每个部分都有明确的职责
2. **更好的可扩展性** - 用户可以轻松替换或扩展任何部分
3. **更少的 props 传递** - 通过组合替代配置
4. **更好的类型安全** - 每个组件都有明确的 props 类型
5. **更符合 React 最佳实践** - 组合优于继承
6. **更易于维护** - 代码结构更清晰，职责分离

## 文件结构

```
components/ai-chat/
├── index.tsx              # 主入口文件，包含完整的 Chat 组件
├── chat.tsx              # 基础 Chat 组件和 Context
├── chat-header.tsx        # 头部相关组件
├── chat-messages.tsx      # 消息相关组件
├── chat-input.tsx         # 输入框相关组件
├── chat-sidepanel.tsx     # 侧边栏相关组件
├── chat-drawers.tsx       # 抽屉相关组件
└── ai-chat.tsx           # 原始的 AiChat 组件（保留兼容性）
```

## 使用示例

详细的使用示例请参考 `app/App-new.tsx` 文件。

## 向后兼容性

原始的 `AiChat` 组件仍然保留在 `ai-chat.tsx` 中，确保现有代码不会破坏。新的组合式 API 通过 `index.tsx` 导出。