"use client";

import "@assistant-ui/react-markdown/styles/dot.css";
import customComponents from "./markdown-components/customComponents";  // 导入 customComponents
import {
  type CodeHeaderProps,
  MarkdownTextPrimitive,
  unstable_memoizeMarkdownComponents as memoizeMarkdownComponents,
  useIsMarkdownCodeBlock,
} from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { type FC, memo, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { cn } from "@/lib/utils";
import { ComponentType } from "react";

// 🚀 可扩展的组件注册表 - 支持通过正则表达式匹配自定义组件
class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Map<string, {
    pattern: RegExp;
    component: ComponentType<any>;
    priority: number;
    type: 'url' | 'text' | 'markdown';
  }> = new Map();

  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  // 🎯 注册新的组件匹配规则
  register(
    name: string,
    pattern: RegExp,
    component: ComponentType<any>,
    priority = 0,
    type: 'url' | 'text' | 'markdown' = 'url'
  ) {
    this.components.set(name, { pattern, component, priority, type });
  }

  // 🔍 根据内容匹配对应的组件
  matchContent(content: string, type: 'url' | 'text' | 'markdown'): { component: ComponentType<any>; props: any } | null {
    const sortedComponents = Array.from(this.components.values())
      .filter(c => c.type === type)
      .sort((a, b) => b.priority - a.priority);

    for (const { pattern, component } of sortedComponents) {
      console.log(`Trying to match: ${content} with pattern: ${pattern}`);
      const match = content.match(pattern);
      if (match) {
        console.log(`Matched component: ${component}`);
        return {
          component,
          props: { content, ...this.extractProps(match) }
        };
      }
    }
    return null;
  }

  // 🔧 从正则匹配中提取props
  private extractProps(match: RegExpMatchArray): Record<string, any> {
    const props: Record<string, any> = {};
    if (match.groups) {
      Object.keys(match.groups).forEach(key => {
        props[key] = match.groups![key];
      });
    }
    return props;
  }

  // 📋 获取所有已注册的组件
  getRegisteredComponents() {
    return Array.from(this.components.keys());
  }

  // 🔄 获取所有已注册的组件配置
  getRegisteredConfigs() {
    return Array.from(this.components.entries()).map(([name, config]) => ({
      name,
      pattern: config.pattern.source,
      type: config.type,
      priority: config.priority
    }));
  }
}

// 🎨 默认的内置组件
const YouTubeEmbed = ({ url, videoId }: { url: string; videoId?: string }) => (
  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
    <iframe
      src={url}
      className="absolute top-0 left-0 w-full h-full"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  </div>
);

const VideoEmbed = ({ url }: { url: string }) => (
  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
    <video
      src={url}
      className="w-full h-full"
      controls
      preload="metadata"
    />
  </div>
);

const registry = ComponentRegistry.getInstance();

// 🎯 注册URL类型的组件
registry.register(
  'youtube',
  /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  YouTubeEmbed,
  10,
  'url'
);

registry.register(
  'video',
  /\.(mp4|webm|ogg)$/i,
  VideoEmbed,
  5,
  'url'
);

// 🎯 注册markdown自定义组件（从独立模块导入）

registry.register(
  'plan',
  /\[\[plan\]\](.*?)\[\[\/plan\]\]/is,  // 确保正则表达式匹配正确
  ({ content }: { content: string }) => {
    console.log("Received content for Plan:", content); // 调试输入的 content
    try {
      // 解析传入的 JSON 配置
      debugger
      const config = JSON.parse(content);
      console.log("Parsed Plan config:", config); // 调试解析后的 config
      return <Plan {...config} />;  // 将解析后的配置传递给 Plan 组件
    } catch (e) {
      console.warn('Failed to parse plan config:', e);
      return <div>Invalid plan component configuration</div>;
    }
  },
  15,
  'markdown'
);

// 将 customComponents 转换成组件映射
const dynamicComponents = customComponents.reduce((acc, { name, component }) => {
  acc[name] = component;
  return acc;
}, {});

// 增强的MarkdownText组件，支持HTML渲染和自定义组件
const EnhancedMarkdownTextImpl = () => {
  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className="aui-md"
      components={{
        ...defaultComponents,
        ...dynamicComponents // 使用 ComponentRegistry 来动态匹配和渲染自定义组件
      }}
    />
  );
};

export const Video = ({ src, controls, poster, className, children, ...props }: any) => {
  return (
    <video
      src={src}
      controls={controls !== false}
      poster={poster}
      className={cn(
        "aui-md-video my-4 max-w-full rounded-lg shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </video>
  );
};

export const MarkdownText = memo(EnhancedMarkdownTextImpl);
export const EnhancedMarkdownText = memo(EnhancedMarkdownTextImpl);

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="aui-code-header-root mt-4 flex items-center justify-between gap-4 rounded-t-lg bg-muted-foreground/15 px-4 py-2 text-sm font-semibold text-foreground dark:bg-muted-foreground/20">
      <span className="aui-code-header-language lowercase [&>span]:text-xs">
        {language}
      </span>
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {!isCopied && <CopyIcon />}
        {isCopied && <CheckIcon />}
      </TooltipIconButton>
    </div>
  );
};

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

const defaultComponents = memoizeMarkdownComponents({
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "aui-md-h1 mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "aui-md-h2 mt-8 mb-4 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "aui-md-h3 mt-6 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "aui-md-h4 mt-6 mb-4 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      className={cn(
        "aui-md-h5 my-4 text-lg font-semibold first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn(
        "aui-md-h6 my-4 font-semibold first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "aui-md-p mt-5 mb-5 leading-7 first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "aui-md-a font-medium text-primary underline underline-offset-4",
        className,
      )}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn("aui-md-blockquote border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn("aui-md-ul my-5 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn("aui-md-ol my-5 ml-6 list-decimal [&>li]:mt-2", className)}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("aui-md-hr my-5 border-b", className)} {...props} />
  ),
  table: ({ className, ...props }) => (
    <table
      className={cn(
        "aui-md-table my-5 w-full border-separate border-spacing-0 overflow-y-auto",
        className,
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "aui-md-th bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "aui-md-td border-b border-l px-4 py-2 text-left last:border-r [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  tr: ({ className, ...props }) => (
    <tr
      className={cn(
        "aui-md-tr m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
        className,
      )}
      {...props}
    />
  ),
  sup: ({ className, ...props }) => (
    <sup
      className={cn("aui-md-sup [&>a]:text-xs [&>a]:no-underline", className)}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "aui-md-pre overflow-x-auto !rounded-t-none rounded-b-lg bg-black p-4 text-white",
        className,
      )}
      {...props}
    />
  ),
  code: function Code({ className, ...props }) {
    const isCodeBlock = useIsMarkdownCodeBlock();
    return (
      <code
        className={cn(
          !isCodeBlock &&
            "aui-md-inline-code rounded border bg-muted font-semibold",
          className,
        )}
        {...props}
      />
    );
  },
  CodeHeader,
});
