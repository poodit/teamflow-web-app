import type { CSSProperties, ReactNode } from "react";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  GripVertical,
  RectangleHorizontal,
  Columns2,
  Square,
  Rows3,
} from "lucide-react";

type WidgetSpan = "third" | "half" | "full";

type DashboardWidgetProps = {
  title: string;
  children: ReactNode;
  hidden?: boolean;
  onToggle?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onResize?: (next: WidgetSpan) => void;
  onSetHeightPreset?: (nextHeight: number) => void;
  currentSpan?: WidgetSpan;
  className?: string;
  style?: CSSProperties;
  dragHandleProps?: Record<string, unknown>;
  resizeHandleProps?: Record<string, unknown>;
  isDragging?: boolean;
  isResizing?: boolean;
};

export default function DashboardWidget({
  title,
  children,
  hidden = false,
  onToggle,
  onMoveUp,
  onMoveDown,
  onResize,
  onSetHeightPreset,
  currentSpan = "third",
  className = "",
  style,
  dragHandleProps,
  resizeHandleProps,
  isDragging = false,
  isResizing = false,
}: DashboardWidgetProps) {
  const iconButtonClass =
    "w-8 h-8 flex items-center justify-center rounded-md brutal-btn text-[#111]";

  return (
    <div
      style={style}
      className={`relative brutal-box bg-white dark:bg-zinc-800 p-6 rounded-xl flex flex-col transition-all ${
        isDragging ? "opacity-80 rotate-[1deg] scale-[1.01]" : ""
      } ${isResizing ? "select-none" : ""} ${className}`}
    >
      <div className="flex justify-between items-start gap-3 border-b-2 border-[#111] dark:border-zinc-700 pb-3 mb-5">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-md brutal-btn bg-[#f4f4f5] dark:bg-zinc-700 text-[#111] dark:text-white cursor-grab active:cursor-grabbing"
            title="ลากเพื่อย้ายตำแหน่ง"
            {...dragHandleProps}
          >
            <GripVertical size={14} strokeWidth={3} />
          </button>

          <h2 className="text-base font-black text-[#111] dark:text-white truncate">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <button
            type="button"
            onClick={() => onResize?.("third")}
            className={`${iconButtonClass} ${
              currentSpan === "third"
                ? "bg-[#b5deff]"
                : "bg-white dark:bg-zinc-700"
            }`}
            title="ขนาด 1/3"
          >
            <Square size={14} strokeWidth={3} />
          </button>

          <button
            type="button"
            onClick={() => onResize?.("half")}
            className={`${iconButtonClass} ${
              currentSpan === "half"
                ? "bg-[#fff3cd]"
                : "bg-white dark:bg-zinc-700"
            }`}
            title="ขนาด 1/2"
          >
            <Columns2 size={14} strokeWidth={3} />
          </button>

          <button
            type="button"
            onClick={() => onResize?.("full")}
            className={`${iconButtonClass} ${
              currentSpan === "full"
                ? "bg-[#e8f5bd]"
                : "bg-white dark:bg-zinc-700"
            }`}
            title="เต็มแถว"
          >
            <RectangleHorizontal size={14} strokeWidth={3} />
          </button>

          <button
            type="button"
            onClick={() => onSetHeightPreset?.(280)}
            className={`${iconButtonClass} bg-white dark:bg-zinc-700`}
            title="ความสูงเล็ก"
          >
            <Rows3 size={14} strokeWidth={3} />
          </button>

          {/* <button
            type="button"
            onClick={onMoveUp}
            className="w-8 h-8 flex items-center justify-center rounded-md brutal-btn bg-[#e0f2fe] text-[#111]"
            title="เลื่อนขึ้น"
          >
            <ArrowUp size={14} strokeWidth={3} />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            className="w-8 h-8 flex items-center justify-center rounded-md brutal-btn bg-[#fff3cd] text-[#111]"
            title="เลื่อนลง"
          >
            <ArrowDown size={14} strokeWidth={3} />
          </button> */}

          <button
            type="button"
            onClick={onToggle}
            className="w-8 h-8 flex items-center justify-center rounded-md brutal-btn bg-[#ffe4e1] text-[#111]"
            title={hidden ? "แสดงกล่อง" : "ซ่อนกล่อง"}
          >
            {hidden ? (
              <EyeOff size={14} strokeWidth={3} />
            ) : (
              <Eye size={14} strokeWidth={3} />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 pb-8">
        {children}
      </div>

      <button
        type="button"
        className={`absolute right-2 bottom-2 w-5 h-5 rounded-sm border-2 border-[#111] bg-[#f4f4f5] dark:bg-zinc-700 flex items-center justify-center ${
          isResizing ? "cursor-nwse-resize" : "cursor-se-resize"
        }`}
        title="ลากเพื่อขยายกว้างและสูง"
        {...resizeHandleProps}
      >
        <span className="text-[10px] font-black leading-none text-[#111] dark:text-white">
          ↘
        </span>
      </button>
    </div>
  );
}
