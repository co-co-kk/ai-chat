# 🚀 Markdown 自定义组件系统

这个目录包含了所有markdown自定义组件的定义和注册逻辑，实现了组件的模块化管理。

## 📁 目录结构

```
markdown-components/
├── index.ts                 # 统一入口，管理所有组件注册
├── option-list-renderer.tsx # OptionList组件渲染器
├── README.md               # 本文档
└── [新组件].tsx            # 后续添加的新组件
```

## 🎯 如何添加新的自定义组件

### 1. 创建组件渲染器

创建一个新的tsx文件，例如 `chart-renderer.tsx`：

```typescript
import { YourComponent } from "@/components/ui/your-component";
import { ComponentType } from "react";

// 🚀 组件渲染器
export const YourComponentRenderer: ComponentType<{ content: string }> = ({ content }) => {
  try {
    const config = JSON.parse(content);
    return <YourComponent {...config} />;
  } catch (e) {
    console.warn('Failed to parse config:', e);
    return <div>Invalid configuration</div>;
  }
};

// 🎯 组件配置
export const yourComponentMarkdownConfig = {
  name: 'yourcomponent',
  pattern: /\[\[YOURCOMPONENT\]\]([\s\S]*?)\[\/YOURCOMPONENT\]/i,
  component: YourComponentRenderer,
  priority: 25, // 根据需要调整优先级
  type: 'markdown' as const
};
```

### 2. 注册组件

在 `index.ts` 中添加新组件：

```typescript
import { yourComponentMarkdownConfig } from "./chart-renderer";

export const markdownComponentConfigs = [
  optionListMarkdownConfig,
  yourComponentMarkdownConfig, // 添加新组件
];
```

### 3. 使用新组件

在markdown中直接使用：

```markdown
[[YOURCOMPONENT]]
{
  "title": "示例图表",
  "data": [1, 2, 3, 4, 5]
}
[[/YOURCOMPONENT]]
```

## 🎨 优先级说明

- 数值越小，优先级越高（先匹配）
- 建议范围：1-100
- 避免与其他组件冲突

## 📋 现有组件列表

| 组件名 | 语法 | 优先级 | 描述 |
|--------|------|--------|------|
| OptionList | `[[OPTIONLIST]]...[/OPTIONLIST]` | 20 | 选项列表组件 |

## 🔧 调试建议

1. 检查JSON格式是否正确
2. 确认组件props接口匹配
3. 查看浏览器控制台错误信息
4. 使用React DevTools检查组件树