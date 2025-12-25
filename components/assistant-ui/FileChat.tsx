import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef, useState, useEffect, ReactNode } from "react";

interface FileChatProps {
  imgFile?: any[];
  isSplit?: boolean;
  name?: string;
  children?: ReactNode;
  align?: 'left' | 'right';
  alwaysShowButtons?: boolean;
}

const FileChat = ({ 
  imgFile, 
  isSplit = false, 
  name = "name", 
  children,
  align = 'left',
  alwaysShowButtons = false
}: FileChatProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const formatFileName = (filename: string) => {
    return filename?.split("_").pop() || "未知文件";
  };

  // 检查是否内容溢出
  const checkOverflow = () => {
    const container = scrollRef.current;
    if (!container) return false;
    return container.scrollWidth > container.clientWidth;
  };

  // 检查滚动状态 - 修复边界检测
  const checkScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const clientWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;
    
    // 添加容差，避免浮点数精度问题
    const tolerance = 1;
    
    if (align === 'right') {
      // 右对齐时，逻辑完全相反
      // 初始位置在右侧：scrollLeft = 0 表示在最右侧
      // 向左滚动：scrollLeft 值增加（正方向）
      // 向右滚动：scrollLeft 值减少（负方向）
      
      const isAtRightEnd = Math.abs(scrollLeft) <= tolerance; // 在最右侧（起始位置）
      const isAtLeftEnd = Math.abs(scrollLeft - (scrollWidth - clientWidth)) <= tolerance; // 在最左侧
      
      // console.log('right align - scrollLeft:', scrollLeft, 'isAtRightEnd:', isAtRightEnd, 'isAtLeftEnd:', isAtLeftEnd);
      
      // 右对齐时：
      // - 左按钮：向左滚动（向内容开始方向）→ 检查是否到达最左侧
      // - 右按钮：向右滚动（向内容结束方向）→ 检查是否到达最右侧
      setCanScrollLeft(!isAtLeftEnd);  // 可以向左滚动 = 不在最左侧
      setCanScrollRight(!isAtRightEnd); // 可以向右滚动 = 不在最右侧
    } else {
      // 左对齐正常逻辑
      const isAtLeftEnd = scrollLeft <= tolerance;
      const isAtRightEnd = Math.abs(scrollLeft + clientWidth - scrollWidth) <= tolerance;
      
      // console.log('left align - scrollLeft:', scrollLeft, 'isAtLeftEnd:', isAtLeftEnd, 'isAtRightEnd:', isAtRightEnd);
      
      setCanScrollLeft(!isAtLeftEnd);
      setCanScrollRight(!isAtRightEnd);
    }

    setIsOverflowing(checkOverflow());
  };

  // 初始化滚动位置
  const initScrollPosition = () => {
    const container = scrollRef.current;
    if (!container) return;

    const timer = setTimeout(() => {
      const overflowing = checkOverflow();
      if (align === 'right' && overflowing) {
        // 右对齐：滚动到最右侧（起始位置）
        container.scrollLeft = 0;
        // console.log('初始化到最右侧');
      } else {
        container.scrollLeft = 0;
        // console.log('初始化到最左侧');
      }
      // 延迟检查确保滚动完成
      setTimeout(checkScroll, 200);
    }, 100);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      initScrollPosition();
      
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [imgFile, children, align]);

  // 滚动控制
  const scrollLeft = () => {
    if (scrollRef.current) {
      if (align === 'right') {
        // 右对齐时，左按钮点击：内容向左移动（向开始方向）
        scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
        // console.log('右对齐左按钮：向左滚动');
      } else {
        // 左对齐时，左按钮点击：内容向左移动（向开始方向）
        scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
        // console.log('左对齐左按钮：向左滚动');
      }
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      if (align === 'right') {
        // 右对齐时，右按钮点击：内容向右移动（向结束方向）
        scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
        // console.log('右对齐右按钮：向右滚动');
      } else {
        // 左对齐时，右按钮点击：内容向右移动（向结束方向）
        scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
        // console.log('左对齐右按钮：向右滚动');
      }
    }
  };

  // 判断是否显示按钮
  const shouldShowButtons = alwaysShowButtons || isOverflowing;

  // 判断是否有内容显示
  const hasContent = imgFile && imgFile?.length > 0 || children;

  if (!hasContent) return null;

  // 渲染内容
  const renderContent = () => {
    if (children) {
      return children;
    }
    
    // if (imgFile && imgFile?.length > 0) {
    //   return imgFile?.map((file, index) => (
    //     <div
    //       key={index}
    //       className="flex-shrink-0 border border-solid border-[#E6EAEF] w-[232px] h-[60px] bg-white rounded-xl flex items-center hover:shadow-sm transition-shadow"
    //     >
    //       <div className="flex px-[10px] items-center w-full">
    //         <div className="w-10 h-10 bg-[#F6F7F8] rounded-lg flex items-center justify-center flex-shrink-0">
    //           <Notes theme="outline" size="20" fill="#8D97A3" />
    //         </div>
    //         <div className="pl-[10px] font-medium text-[#092C4D] flex-1 min-w-0">
    //           <TsTooltip
    //             node={{
    //               label: isSplit ? formatFileName(file) : file[name],
    //               fontWig: 400,
    //             }}
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   ));
    // }
    
    return null;
  };

  return (
    <div className="flex items-center space-x-2 pb-2 w-full">
      {/* 左箭头按钮 */}
      {shouldShowButtons && (
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`
            p-2 rounded-full bg-[#8D97A3] shadow-md text-[#fff] transition-all flex-shrink-0
            ${
              canScrollLeft
                ? "hover:bg-[#002FA7] active:scale-95 cursor-pointer opacity-100"
                : "opacity-30 cursor-not-allowed"
            }
          `}
          aria-label="Scroll left"
        >
          <ChevronLeft
            size="24"
          />
        </button>
      )}

      {/* 滚动内容区域 */}
      <div
        ref={scrollRef}
        className={`flex-1 min-w-0 overflow-x-auto scroll-smooth ${
          align === 'right' ? 'flex-row-reverse' : ''
        }`}
        style={{
          display: "flex",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onScroll={checkScroll}
      >
        <div className={`flex space-x-5 py-1 ${align === 'right' ? 'justify-end' : ''}`}>
          {renderContent()}
        </div>
      </div>

      {/* 右箭头按钮 */}
      {shouldShowButtons && (
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`
            p-2 rounded-full bg-[#8D97A3] shadow-md text-[#fff] transition-all flex-shrink-0
            ${
              canScrollRight
                ? "hover:bg-[#002FA7] active:scale-95 cursor-pointer opacity-100"
                : "opacity-30 cursor-not-allowed"
            }
          `}
          aria-label="Scroll right"
        >
          <ChevronRight
            size="24"
          />
        </button>
      )}
    </div>
  );
};

export default FileChat;