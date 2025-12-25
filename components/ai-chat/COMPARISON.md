# AiChat 组合式 API 对比

## 🎯 真正的组合式 API 优势

### ❌ 之前的方式（仍然传递大量 props）

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
  {/* 自定义侧边栏内容 */}
  <Chat.SidePanel.Sidebar>
    {/* ... */}
  </Chat.SidePanel.Sidebar>
</Chat>
```

### ✅ 真正的组合式 API（最少配置）

```tsx
<Chat>
  <ChatHeader>
    <ChatHeaderTitle />
    <ChatHeaderActions>
      <ChatHeaderAction
        label="新会话"
        onClick={() => console.log("新建会话")}
        variant="primary"
      />
    </ChatHeaderActions>
  </ChatHeader>

  <ChatMessages>
    <ChatEmpty />
  </ChatMessages>

  <ChatInput>
    <ChatInputLeft />
    <ChatInputRight>
      <ChatInputSend />
    </ChatInputRight>
  </ChatInput>

  <ChatSidePanel>
    <ChatSidebar>
      <div className="text-xs text-slate-500">
        侧边栏内容（仅在 wide 模式显示）
      </div>
    </ChatSidebar>
  </ChatSidePanel>
</Chat>
```

## 📁 文件说明

### 1. `App.tsx` - 原始版本
- 使用原始的 `AiChat` 组件
- 大量的 props 传递
- 复杂的状态管理

### 2. `App-simple.tsx` - 真正的组合式 API
- **最少配置，开箱即用**
- **零 props 传递**
- **内部自动状态管理**
- **组件职责清晰分离**

### 3. `App-new-composable.tsx` - 自定义组合式 API
- **完全自定义每个部分**
- **灵活的事件处理**
- **可扩展的消息渲染**
- **自定义抽屉和侧边栏**

## 🚀 核心优势

### 1. 渐进式复杂度
```tsx
// 最简用法
<Chat />

// 基础定制
<Chat>
  <ChatHeader />
  <ChatMessages />
  <ChatInput />
</Chat>

// 完全定制
<Chat>
  <ChatHeader>
    <ChatHeaderTitle>自定义标题</ChatHeaderTitle>
    <ChatHeaderActions>
      <ChatHeaderAction onClick={...} />
    </ChatHeaderActions>
  </ChatHeader>
  {/* ... */}
</Chat>
```

### 2. 零配置启动
- **无需传递任何 props**
- **内置默认状态管理**
- **自动处理消息、附件、会话**
- **默认样式和交互**

### 3. 组件职责分离
- `ChatHeader` - 只负责头部显示和操作
- `ChatMessages` - 只负责消息列表渲染
- `ChatInput` - 只负责输入和发送
- `ChatSidePanel` - 只负责侧边栏内容

### 4. 可预测的 API
- 每个组件都有明确的职责
- 组件之间通过 Context 通信
- 无需复杂的 props 传递链

## 🎨 使用场景

### 快速原型
```tsx
// 只需要几行代码就能启动一个完整的聊天界面
<Chat>
  <ChatHeader />
  <ChatMessages />
  <ChatInput />
</Chat>
```

### 产品定制
```tsx
// 完全自定义每个部分
<Chat>
  <ChatHeader>
    <ChatHeaderTitle>我的智能助手</ChatHeaderTitle>
    <ChatHeaderActions>
      <ChatHeaderAction label="设置" onClick={openSettings} />
      <ChatHeaderAction label="帮助" onClick={openHelp} />
    </ChatHeaderActions>
  </ChatHeader>
  
  <ChatMessages>
    <ChatEmpty>
      <div className="text-center">
        <h3>欢迎使用智能助手</h3>
        <p>我可以帮助您处理各种任务</p>
      </div>
    </ChatEmpty>
  </ChatMessages>
  
  <ChatInput>
    <ChatInputLeft>
      <ChatInputAttachment />
      <ChatInputAction label="语音" onClick={startVoiceInput} />
    </ChatInputLeft>
    <ChatInputRight>
      <ChatInputSend />
    </ChatInputRight>
  </ChatInput>
</Chat>
```

## 🔧 实现原理

### 1. Context 共享状态
```tsx
const ChatContext = createContext<ChatContextValue | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a Chat component");
  }
  return context;
};
```

### 2. 内置状态管理
```tsx
export const Chat = ({ children, ...props }) => {
  // 内部管理所有状态
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [sessions, setSessions] = useState([]);
  
  // 通过 Context 提供给子组件
  return (
    <ChatContext.Provider value={{ messages, setMessages, ... }}>
      {children}
    </ChatContext.Provider>
  );
};
```

### 3. 组件自动获取状态
```tsx
export const ChatInputSend = () => {
  const { sendMessage, isSending } = useChatContext();
  
  return (
    <button onClick={sendMessage} disabled={isSending}>
      发送
    </button>
  );
};
```

## 📝 总结

真正的组合式 API 应该：

1. **零配置启动** - 不传任何 props 就能工作
2. **渐进式增强** - 需要时才添加自定义
3. **职责分离** - 每个组件只负责自己的功能
4. **Context 通信** - 组件间通过 Context 共享状态
5. **可预测性** - API 简单直观，易于理解

这才是真正的组合式 API 设计！🎉