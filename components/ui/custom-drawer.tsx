import { X } from "lucide-react";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

export type DrawerInfo = {
  id: string;
  title: string;
  content: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  renderFn?: () => void;
};

export const CustomDrawer = ({ drawerInfo }: { drawerInfo: DrawerInfo }) => {
  if (!drawerInfo) return null;
  
  return (
    <div
      className={cn(
        "absolute inset-y-0 right-0 z-20 w-72 border-l border-slate-200 bg-white shadow-[-12px_0_24px_rgba(15,23,42,0.08)] transition-transform",
        drawerInfo.open ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
        {drawerInfo.title}
        <button
          type="button"
          onClick={() => drawerInfo.setOpen(false)}
          className="flex size-6 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="h-full overflow-y-auto px-4 py-3">
        {drawerInfo.content}
      </div>
    </div>
  );
};

export const useDrawerController = () => {
  const drawersRef = useRef<Record<string, DrawerInfo>>({});

  const registerDrawer = (id: string, title: string, content: ReactNode) => {
    const drawerInfo: DrawerInfo = {
      id,
      title,
      content,
      open: false,
      setOpen: (open: boolean) => {
        if (drawersRef.current[id]) {
          drawersRef.current[id] = { ...drawersRef.current[id], open };
          // 重新渲染
          if (drawersRef.current[id].renderFn) {
            drawersRef.current[id].renderFn();
          }
        }
      },
      renderFn: null,
    };
    
    drawersRef.current = { ...drawersRef.current, [id]: drawerInfo };
    return drawerInfo;
  };

  const setRenderFn = (id: string, renderFn: () => void) => {
    if (drawersRef.current[id]) {
      drawersRef.current[id].renderFn = renderFn;
    }
  };

  const openDrawer = (id: string) => {
    if (drawersRef.current[id]) {
      drawersRef.current[id].setOpen(true);
    }
  };

  const closeDrawer = (id: string) => {
    if (drawersRef.current[id]) {
      drawersRef.current[id].setOpen(false);
    }
  };

  const getDrawer = (id: string): DrawerInfo | undefined => {
    return drawersRef.current[id];
  };

  const getAllDrawers = (): Record<string, DrawerInfo> => {
    return drawersRef.current;
  };

  return {
    registerDrawer,
    setRenderFn,
    openDrawer,
    closeDrawer,
    getDrawer,
    getAllDrawers,
  };
};