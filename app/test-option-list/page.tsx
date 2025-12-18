// 测试页面：验证OptionList组件在Markdown中的渲染
'use client';

import { useState } from 'react';
import { AssistantMessage } from '@/components/assistant-ui/assistant-message';
import { UserMessage } from '@/components/assistant-ui/user-message';
import { Thread } from '@/components/assistant-ui/thread';

export default function TestOptionListPage() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'user' as const,
      content: '请帮我选择你喜欢的水果'
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: `我来为你展示一个选项列表：

<OptionList 
  options='[
    {"id": "1", "label": "苹果", "description": "红彤彤的大苹果"},
    {"id": "2", "label": "香蕉", "description": "黄色的弯弯香蕉"},
    {"id": "3", "label": "橙子", "description": "多汁的甜橙子"},
    {"id": "4", "label": "草莓", "description": "新鲜的红草莓"}
  ]'
  selectionMode="multiple"
  maxSelections="2"
  responseActions='[
    {"id": "confirm", "label": "确认选择", "style": "primary"},
    {"id": "cancel", "label": "取消", "style": "secondary"}
  ]'
/>`
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">OptionList 组件测试页面</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">测试说明</h2>
          <p className="text-gray-600 mb-4">
            这个页面测试OptionList组件在Markdown内容中的渲染效果。
            组件应该能够正确显示选项列表，并支持多选功能。
          </p>
          
          <div className="border rounded-lg p-4">
            <Thread>
              {messages.map((message) => (
                message.role === 'user' ? (
                  <UserMessage key={message.id}>{message.content}</UserMessage>
                ) : (
                  <AssistantMessage key={message.id}>{message.content}</AssistantMessage>
                )
              ))}
            </Thread>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>在Markdown中使用&lt;OptionList&gt;标签来嵌入选项列表</li>
            <li>支持JSON格式的options数组</li>
            <li>支持单选和多选模式（selectionMode）</li>
            <li>支持最大选择数量限制（maxSelections）</li>
            <li>支持自定义响应动作（responseActions）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}