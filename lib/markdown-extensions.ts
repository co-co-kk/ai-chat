import { ComponentType } from 'react';

// 🚀 扩展组件类型定义
export interface ExtensionComponent {
  name: string;
  pattern: RegExp;
  component: ComponentType<any>;
  priority: number;
  description?: string;
  props?: Record<string, any>;
}

// 🎯 扩展注册管理器
export class MarkdownExtensionRegistry {
  private static instance: MarkdownExtensionRegistry;
  private extensions: Map<string, ExtensionComponent> = new Map();
  private customPatterns: Map<string, RegExp> = new Map();

  public static getInstance(): MarkdownExtensionRegistry {
    if (!MarkdownExtensionRegistry.instance) {
      MarkdownExtensionRegistry.instance = new MarkdownExtensionRegistry();
    }
    return MarkdownExtensionRegistry.instance;
  }

  // 🎯 注册新的扩展组件
  registerExtension(extension: ExtensionComponent): void {
    this.extensions.set(extension.name, extension);
    console.log(`✅ 已注册扩展: ${extension.name}`);
  }

  // 🔍 根据内容匹配对应的扩展组件
  matchExtension(content: string): { component: ComponentType<any>; props: any } | null {
    const sortedExtensions = Array.from(this.extensions.values())
      .sort((a, b) => b.priority - a.priority);

    for (const extension of sortedExtensions) {
      const match = content.match(extension.pattern);
      if (match) {
        return {
          component: extension.component,
          props: {
            ...extension.props,
            ...this.extractProps(match),
            content,
            match
          }
        };
      }
    }
    return null;
  }

  // 🔧 注册自定义正则模式
  registerCustomPattern(name: string, pattern: RegExp): void {
    this.customPatterns.set(name, pattern);
  }

  // 📋 获取所有已注册的扩展
  getRegisteredExtensions(): ExtensionComponent[] {
    return Array.from(this.extensions.values());
  }

  // 🗑️ 移除扩展
  unregisterExtension(name: string): boolean {
    return this.extensions.delete(name);
  }

  // 🔧 从正则匹配中提取props
  private extractProps(match: RegExpMatchArray): Record<string, any> {
    const props: Record<string, any> = {};
    if (match.groups) {
      Object.keys(match.groups).forEach(key => {
        props[key] = match.groups![key];
      });
    }
    // 也包含完整的匹配结果
    props.match = match[0];
    props.matches = match;
    return props;
  }

  // 📊 获取扩展统计信息
  getStats(): {
    totalExtensions: number;
    extensionNames: string[];
    customPatterns: string[];
  } {
    return {
      totalExtensions: this.extensions.size,
      extensionNames: Array.from(this.extensions.keys()),
      customPatterns: Array.from(this.customPatterns.keys())
    };
  }
}

// 🎨 内置扩展组件示例

// 📋 OptionList 扩展组件
export const OptionListExtension: ComponentType<any> = (props) => {
  const { options, selectionMode = "single", maxSelections, responseActions, className } = props;
  
  // 🚀 安全解析JSON数据
  const parseJsonData = (data: any, defaultValue: any = []) => {
    if (!data) return defaultValue;
    if (typeof data === 'object') return data;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data.replace(/&quot;/g, '"').replace(/&#x27;/g, "'"));
      } catch (e) {
        console.warn('JSON解析失败:', e);
        return defaultValue;
      }
    }
    return defaultValue;
  };

  return (
    <div className={className}>
      {/* 这里可以集成实际的OptionList组件 */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold mb-2">选择列表</h3>
        <pre className="text-sm">
          {JSON.stringify({
            options: parseJsonData(options),
            selectionMode,
            maxSelections,
            responseActions: parseJsonData(responseActions)
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// 🎥 视频扩展组件
export const VideoExtension: ComponentType<any> = ({ url, title, autoplay = false, controls = true }) => (
  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
    <video
      src={url}
      title={title}
      autoPlay={autoplay}
      controls={controls}
      className="absolute top-0 left-0 w-full h-full"
    />
  </div>
);

// 🔗 链接卡片扩展组件
export const LinkCardExtension: ComponentType<any> = ({ url, title, description, image }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="block p-4 border rounded-lg hover:shadow-md transition-shadow no-underline"
  >
    {image && (
      <img 
        src={image} 
        alt={title} 
        className="w-full h-32 object-cover rounded mb-2"
      />
    )}
    <h4 className="font-semibold text-lg mb-1">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
    <span className="text-xs text-blue-500 mt-2 block">{url}</span>
  </a>
);

// 🎨 图表扩展组件（占位符）
export const ChartExtension: ComponentType<any> = ({ type = 'bar', data, options }) => (
  <div className="p-4 border rounded-lg">
    <h4 className="font-semibold mb-2">图表: {type}</h4>
    <div className="bg-gray-100 h-64 flex items-center justify-center rounded">
      <span className="text-gray-500">图表组件待实现</span>
    </div>
  </div>
);

// 🚀 创建全局扩展注册器实例
export const extensionRegistry = MarkdownExtensionRegistry.getInstance();

// 🎯 初始化默认扩展
export const initializeDefaultExtensions = () => {
  const registry = MarkdownExtensionRegistry.getInstance();

  // 🎯 OptionList 扩展
  registry.registerExtension({
    name: 'option-list',
    pattern: /<OptionList[^>]*options=['"]([^'"]*)['"][^>]*>/i,
    component: OptionListExtension,
    priority: 20,
    description: '渲染选择列表组件'
  });

  // 🎥 视频扩展
  registry.registerExtension({
    name: 'video',
    pattern: /<Video[^>]*src=['"]([^'"]*)['"][^>]*>/i,
    component: VideoExtension,
    priority: 15,
    description: '渲染视频播放器'
  });

  // 🔗 链接卡片扩展
  registry.registerExtension({
    name: 'link-card',
    pattern: /<LinkCard[^>]*url=['"]([^'"]*)['"][^>]*>/i,
    component: LinkCardExtension,
    priority: 10,
    description: '渲染链接卡片'
  });

  // 📊 图表扩展
  registry.registerExtension({
    name: 'chart',
    pattern: /<Chart[^>]*type=['"]([^'"]*)['"][^>]*>/i,
    component: ChartExtension,
    priority: 5,
    description: '渲染图表组件'
  });

  console.log('✅ 默认扩展初始化完成');
};

// 🛠️ 工具函数：注册新扩展
export const registerMarkdownExtension = (extension: ExtensionComponent) => {
  extensionRegistry.registerExtension(extension);
};

// 🛠️ 工具函数：获取扩展信息
export const getExtensionStats = () => extensionRegistry.getStats();