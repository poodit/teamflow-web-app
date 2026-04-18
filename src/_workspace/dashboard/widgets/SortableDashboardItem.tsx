import { useEffect, useRef, useState, type ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import DashboardWidget from "./DashboardWidget";

type WidgetSpan = "third" | "half" | "full";

type SortableDashboardItemProps = {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  currentSpan: WidgetSpan;
  currentHeight: number;
  onResize?: (next: WidgetSpan) => void;
  onResizeHeight?: (nextHeight: number) => void;
  onSetHeightPreset?: (nextHeight: number) => void;
  onToggle?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

function spanToWidth(span: WidgetSpan) {
  if (span === "full") return 100;
  if (span === "half") return 66;
  return 33;
}

function widthToSpan(widthPercent: number): WidgetSpan {
  if (widthPercent >= 84) return "full";
  if (widthPercent >= 50) return "half";
  return "third";
}

export default function SortableDashboardItem({
  id,
  title,
  children,
  className = "",
  currentSpan,
  currentHeight,
  onResize,
  onResizeHeight,
  onSetHeightPreset,
  onToggle,
  onMoveUp,
  onMoveDown,
}: SortableDashboardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startWidthRef = useRef(spanToWidth(currentSpan));
  const startHeightRef = useRef(currentHeight);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startXRef.current;
      const deltaY = e.clientY - startYRef.current;

      const nextWidth = Math.min(
        100,
        Math.max(33, startWidthRef.current + deltaX / 8),
      );

      const nextHeight = Math.min(
        700,
        Math.max(220, startHeightRef.current + deltaY),
      );

      onResize?.(widthToSpan(nextWidth));
      onResizeHeight?.(Math.round(nextHeight));
    };

    const handleMouseUp = () => {
      if (!isResizing) return;
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, onResize, onResizeHeight]);

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startWidthRef.current = spanToWidth(currentSpan);
    startHeightRef.current = currentHeight;
    document.body.style.cursor = "nwse-resize";
    document.body.style.userSelect = "none";
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    minHeight: `${currentHeight}px`,
    height: `${currentHeight}px`,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DashboardWidget
        title={title}
        className={className}
        style={{ minHeight: "100%", height: "100%" }}
        currentSpan={currentSpan}
        onResize={onResize}
        onSetHeightPreset={onSetHeightPreset}
        onToggle={onToggle}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        dragHandleProps={{ ...attributes, ...listeners }}
        resizeHandleProps={{ onMouseDown: handleResizeMouseDown }}
        isDragging={isDragging}
        isResizing={isResizing}
      >
        {children}
      </DashboardWidget>
    </div>
  );
}
