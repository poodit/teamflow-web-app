import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  CalendarDays,
  FileText,
  Settings,
  Bell,
  Plus,
  Check,
  LogOut,
  Sun,
  Moon,
  SlidersHorizontal,
  RotateCcw,
  PanelTop,
} from "lucide-react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import AddProjectModal from "./modal/addProject";
import SortableDashboardItem from "./widgets/SortableDashboardItem";

type Member = {
  id: number;
  name: string;
  role: string;
};

type Project = {
  name: string;
  description?: string;
  dueDate?: string;
  members?: Member[];
  prog: string;
  status: string;
  bg: string;
  bar: string;
};

type WidgetId =
  | "projects-running"
  | "my-tasks"
  | "activity"
  | "task-status"
  | "team-workload";

type DashboardWidgetConfig = {
  id: WidgetId;
  title: string;
  visible: boolean;
  order: number;
  span: "half" | "third" | "full";
  height: number;
};

const DEFAULT_WIDGETS: DashboardWidgetConfig[] = [
  {
    id: "projects-running",
    title: "Projects ที่กำลังดำเนินการ",
    visible: true,
    order: 1,
    span: "half",
    height: 360,
  },
  {
    id: "my-tasks",
    title: "Tasks ของฉันวันนี้",
    visible: true,
    order: 2,
    span: "half",
    height: 360,
  },
  {
    id: "activity",
    title: "Activity ล่าสุด",
    visible: true,
    order: 3,
    span: "third",
    height: 300,
  },
  {
    id: "task-status",
    title: "สถานะ Tasks ทั้งหมด",
    visible: true,
    order: 4,
    span: "third",
    height: 300,
  },
  {
    id: "team-workload",
    title: "Workload ทีม",
    visible: true,
    order: 5,
    span: "third",
    height: 360,
  },
];

const WIDGET_STORAGE_KEY = "teamflow_dashboard_widgets";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    email: string;
    role: string;
    name: string;
  } | null>(null);

  const [isDark, setIsDark] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isWidgetMenuOpen, setIsWidgetMenuOpen] = useState(false);

  const [projects, setProjects] = useState<Project[]>([
    {
      name: "Website Redesign v2",
      prog: "78%",
      status: "Active",
      bg: "bg-[#e8f5bd]",
      bar: "bg-[#3c52d0]",
    },
    {
      name: "Mobile App iOS",
      prog: "45%",
      status: "Active",
      bg: "bg-[#e8f5bd]",
      bar: "bg-[#a2cb8b]",
    },
    {
      name: "API Integration",
      prog: "30%",
      status: "Hold",
      bg: "bg-[#fdfd96]",
      bar: "bg-[#fdfd96]",
    },
    {
      name: "Data Dashboard",
      prog: "92%",
      status: "Late",
      bg: "bg-[#ffb5b5]",
      bar: "bg-[#ffb5b5]",
    },
    {
      name: "CRM Module",
      prog: "60%",
      status: "Active",
      bg: "bg-[#e8f5bd]",
      bar: "bg-[#3c52d0]",
    },
  ]);

  const [widgets, setWidgets] =
    useState<DashboardWidgetConfig[]>(DEFAULT_WIDGETS);

  useEffect(() => {
    const userStr = sessionStorage.getItem("demo_user");
    if (!userStr) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userStr));
    }

    setIsDark(document.documentElement.classList.contains("dark"));

    const savedWidgets = localStorage.getItem(WIDGET_STORAGE_KEY);
    if (savedWidgets) {
      try {
        const parsed = JSON.parse(savedWidgets) as DashboardWidgetConfig[];
        setWidgets(parsed);
      } catch {
        setWidgets(DEFAULT_WIDGETS);
      }
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  const handleCreateProject = (newProject: {
    name: string;
    description: string;
    dueDate: string;
    members: Member[];
  }) => {
    const createdProject: Project = {
      name: newProject.name,
      description: newProject.description,
      dueDate: newProject.dueDate,
      members: newProject.members,
      prog: "0%",
      status: "New",
      bg: "bg-[#b5deff]",
      bar: "bg-[#3c52d0]",
    };

    setProjects((prev) => [createdProject, ...prev]);
  };

  const toggleWidgetVisibility = (id: WidgetId) => {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === id ? { ...widget, visible: !widget.visible } : widget,
      ),
    );
  };

  const moveWidget = (id: WidgetId, direction: "up" | "down") => {
    const sorted = [...widgets].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((widget) => widget.id === id);

    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const current = sorted[index];
    const target = sorted[targetIndex];

    const updated = sorted.map((widget) => {
      if (widget.id === current.id) {
        return { ...widget, order: target.order };
      }
      if (widget.id === target.id) {
        return { ...widget, order: current.order };
      }
      return widget;
    });

    setWidgets(updated);
  };

  const resizeWidget = (id: WidgetId, nextSpan: "third" | "half" | "full") => {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === id ? { ...widget, span: nextSpan } : widget,
      ),
    );
  };

  const resizeWidgetHeight = (id: WidgetId, nextHeight: number) => {
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === id
          ? { ...widget, height: Math.min(700, Math.max(220, nextHeight)) }
          : widget,
      ),
    );
  };

  const setAllWidgetsEqualHeight = (height: number = 360) => {
    setWidgets((prev) =>
      prev.map((widget) => ({
        ...widget,
        height,
      })),
    );
  };

  const resetLayout = () => {
    setWidgets(DEFAULT_WIDGETS);
    localStorage.removeItem(WIDGET_STORAGE_KEY);
  };

  const sortedVisibleWidgets = useMemo(
    () =>
      [...widgets]
        .filter((widget) => widget.visible)
        .sort((a, b) => a.order - b.order),
    [widgets],
  );

  const hiddenWidgets = useMemo(
    () =>
      widgets
        .filter((widget) => !widget.visible)
        .sort((a, b) => a.order - b.order),
    [widgets],
  );

  const visibleWidgetIds = useMemo(
    () => sortedVisibleWidgets.map((widget) => widget.id),
    [sortedVisibleWidgets],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sortedVisibleWidgets.findIndex(
      (widget) => widget.id === active.id,
    );
    const newIndex = sortedVisibleWidgets.findIndex(
      (widget) => widget.id === over.id,
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const movedVisibleWidgets = arrayMove(
      sortedVisibleWidgets,
      oldIndex,
      newIndex,
    );

    const reorderedVisibleWidgets = movedVisibleWidgets.map(
      (widget, index) => ({
        ...widget,
        order: index + 1,
      }),
    );

    const hiddenPart = widgets
      .filter((widget) => !widget.visible)
      .sort((a, b) => a.order - b.order)
      .map((widget, index) => ({
        ...widget,
        order: reorderedVisibleWidgets.length + index + 1,
      }));

    setWidgets([...reorderedVisibleWidgets, ...hiddenPart]);
  };

  const getSpanClass = (span: DashboardWidgetConfig["span"]) => {
    if (span === "full") return "col-span-1 md:col-span-2 lg:col-span-12";
    if (span === "half") return "col-span-1 md:col-span-2 lg:col-span-6";
    return "col-span-1 md:col-span-1 lg:col-span-4";
  };

  const renderWidgetContent = (id: WidgetId) => {
    switch (id) {
      case "projects-running":
        return (
          <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1.5 gap-3">
                  <div className="min-w-0">
                    <span className="text-sm font-black text-[#111] dark:text-white block truncate">
                      {proj.name}
                    </span>

                    {proj.members && proj.members.length > 0 && (
                      <span className="text-[0.65rem] font-bold text-gray-500 dark:text-zinc-400">
                        ผู้รับผิดชอบ:{" "}
                        {proj.members.map((m) => m.name).join(", ")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-black text-[#111] dark:text-white">
                      {proj.prog}
                    </span>
                    <span
                      className={`text-[0.6rem] font-black border-2 border-[#111] px-2 py-0.5 rounded-full shadow-[1px_1px_0px_#111] text-[#111] ${proj.bg}`}
                    >
                      {proj.status}
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-white dark:bg-zinc-700 border-2 border-[#111] rounded-full overflow-hidden">
                  <div
                    className={`h-full border-r-2 border-[#111] ${proj.bar}`}
                    style={{ width: proj.prog }}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case "my-tasks":
        return (
          <div className="flex flex-col gap-2 h-full overflow-y-auto pr-1">
            <div className="flex items-start gap-3 p-2 rounded-lg">
              <div className="w-4 h-4 bg-[#111] dark:bg-zinc-200 text-white dark:text-[#111] flex items-center justify-center rounded border-2 border-[#111] mt-0.5 shadow-[1px_1px_0px_#111] shrink-0">
                <Check size={12} strokeWidth={4} />
              </div>
              <div>
                <p className="text-sm font-black text-gray-400 dark:text-zinc-500 line-through">
                  Review UI mockup หน้า Login
                </p>
                <p className="text-[0.65rem] font-bold text-gray-500 dark:text-zinc-400 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full border border-[#111] bg-[#ffb5b5] mr-1"></span>
                  High • Website Redesign v2
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2 rounded-lg">
              <div className="w-4 h-4 bg-white dark:bg-zinc-800 border-2 border-[#111] rounded mt-0.5 shadow-[1px_1px_0px_#111] shrink-0"></div>
              <div>
                <p className="text-sm font-black text-[#111] dark:text-white">
                  เขียน API spec สำหรับ user auth
                </p>
                <p className="text-[0.65rem] font-bold text-gray-500 dark:text-zinc-400 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full border border-[#111] bg-[#ffb5b5] mr-1"></span>
                  High • API Integration
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2 rounded-lg">
              <div className="w-4 h-4 bg-white dark:bg-zinc-800 border-2 border-[#111] rounded mt-0.5 shadow-[1px_1px_0px_#111] shrink-0"></div>
              <div>
                <p className="text-sm font-black text-[#111] dark:text-white">
                  ทดสอบ regression test sprint 4
                </p>
                <p className="text-[0.65rem] font-bold text-gray-500 dark:text-zinc-400 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full border border-[#111] bg-[#fdfd96] mr-1"></span>
                  Medium • Mobile App iOS
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2 rounded-lg">
              <div className="w-4 h-4 bg-white dark:bg-zinc-800 border-2 border-[#111] rounded mt-0.5 shadow-[1px_1px_0px_#111] shrink-0"></div>
              <div>
                <p className="text-sm font-black text-[#111] dark:text-white">
                  อัปเดต documentation
                </p>
                <p className="text-[0.65rem] font-bold text-gray-500 dark:text-zinc-400 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full border border-[#111] bg-[#a2cb8b] mr-1"></span>
                  Low • CRM Module
                </p>
              </div>
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
            {[
              {
                n: "นว",
                bg: "bg-[#b5deff]",
                desc: 'นวล เสร็จ task "Setup DB schema"',
                t: "2 นาทีที่แล้ว",
              },
              {
                n: "ปา",
                bg: "bg-[#ffb5b5]",
                desc: "ปาล์ม อัปโหลด design files",
                t: "15 นาทีที่แล้ว",
              },
              {
                n: "SK",
                bg: "bg-[#e0c3fc]",
                desc: "สมชาย assign task ให้มีนา",
                t: "1 ชั่วโมงที่แล้ว",
              },
              {
                n: "มี",
                bg: "bg-[#a2cb8b]",
                desc: "มีนา comment ใน bug #204",
                t: "2 ชั่วโมงที่แล้ว",
              },
            ].map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 ${act.bg} border-2 border-[#111] rounded-md flex items-center justify-center text-[0.65rem] font-black text-[#111] shadow-[1px_1px_0px_#111]`}
                >
                  {act.n}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#111] dark:text-white">
                    {act.desc}
                  </p>
                  <p className="text-[0.65rem] font-semibold text-gray-500 dark:text-zinc-400 mt-0.5">
                    {act.t}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case "task-status":
        return (
          <div className="flex items-center justify-center gap-6 flex-1">
            <div
              className="w-44 h-44 rounded-full border-2 border-[#111] shadow-[6px_6px_0px_#111] flex items-center justify-center relative shrink-0"
              style={{
                background:
                  "conic-gradient(#3c52d0 0% 40%, #a2cb8b 40% 61%, #fdfd96 61% 76%, #ffb5b5 76% 100%)",
              }}
            >
              <div className="w-28 h-28 bg-white dark:bg-zinc-800 rounded-full border-2 border-[#111] flex items-center justify-center text-sm font-black text-center dark:text-white">
                63%
                <br />
                DONE
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[0.65rem] font-black text-[#111] dark:text-white">
                <span className="w-2 h-2 rounded-full border border-[#111] bg-[#3c52d0]"></span>
                เสร็จ (40)
              </div>
              <div className="flex items-center gap-2 text-[0.65rem] font-black text-[#111] dark:text-white">
                <span className="w-2 h-2 rounded-full border border-[#111] bg-[#a2cb8b]"></span>
                กำลังทำ (21)
              </div>
              <div className="flex items-center gap-2 text-[0.65rem] font-black text-[#111] dark:text-white">
                <span className="w-2 h-2 rounded-full border border-[#111] bg-[#fdfd96]"></span>
                รอดำเนินการ (15)
              </div>
              <div className="flex items-center gap-2 text-[0.65rem] font-black text-[#111] dark:text-white">
                <span className="w-2 h-2 rounded-full border border-[#111] bg-[#ffb5b5]"></span>
                เกิน deadline (7)
              </div>
            </div>
          </div>
        );

      case "team-workload":
        return (
          <div className="flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto pr-2 pb-8">
            {[
              {
                name: "นายสมชาย แสนดีรักงานมาก",
                w: "60%",
                bg: "bg-[#3c52d0]",
                t: "4",
              },
              {
                name: "นางสาวนวลนาง นั่งทำงานทั้งวัน",
                w: "90%",
                bg: "bg-[#ffb5b5]",
                t: "8",
              },
              {
                name: "นายปาล์ม มงคลยิ่งนัก",
                w: "75%",
                bg: "bg-[#fdfd96]",
                t: "6",
              },
              {
                name: "นางสาวมีนา มานะอดทน",
                w: "50%",
                bg: "bg-[#a2cb8b]",
                t: "5",
              },
            ].map((wl, i) => (
              <div key={i} className="flex flex-col gap-2 shrink-0">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black dark:text-white truncate max-w-[220px]">
                    {wl.name}
                  </span>
                  <span className="text-[0.75rem] font-black text-gray-500 leading-none">
                    {wl.t} tasks
                  </span>
                </div>
                <div className="w-full h-4 bg-white dark:bg-zinc-700 border-2 border-[#111] rounded-full overflow-hidden shadow-[2px_2px_0px_#111]">
                  <div
                    className={`h-full ${wl.bg} border-r-2 border-[#111]`}
                    style={{ width: wl.w }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="flex h-screen overflow-hidden font-sans bg-[#c5cbb7] dark:bg-[#18181b] transition-colors duration-300">
        <aside className="w-[250px] bg-[#d2d1d1] dark:bg-zinc-900 border-r-2 border-[#111] dark:border-black flex flex-col p-6 z-10 transition-colors">
          <div className="flex items-center gap-3 font-black text-lg text-[#111] dark:text-white mb-8">
            <div className="w-8 h-8 bg-[#a2cb8b] border-2 border-[#111] rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#111]">
              TF
            </div>
            TeamFlow
          </div>

          <div className="text-[0.7rem] font-black text-gray-500 mb-3 px-2">
            OVERVIEW
          </div>
          <nav className="flex flex-col gap-1 mb-8">
            <button className="flex items-center gap-3 px-3 py-2.5 bg-[#e8f5bd] text-[#111] border-2 border-[#111] shadow-[2px_2px_0px_#111] rounded-lg font-black text-sm">
              <LayoutDashboard size={18} strokeWidth={2.5} /> Dashboard
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 text-[#111] dark:text-zinc-300 hover:bg-[#e0e0e0] dark:hover:bg-zinc-800 rounded-lg font-bold text-sm transition-colors border-2 border-transparent">
              <FolderKanban size={18} strokeWidth={2.5} /> All Projects
              <span className="ml-auto bg-[#111] text-white text-[0.65rem] px-2 py-0.5 rounded-full font-black">
                {projects.length}
              </span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 text-[#111] dark:text-zinc-300 hover:bg-[#e0e0e0] dark:hover:bg-zinc-800 rounded-lg font-bold text-sm transition-colors border-2 border-transparent">
              <CheckSquare size={18} strokeWidth={2.5} /> My Tasks
              <span className="ml-auto bg-[#555] text-white text-[0.65rem] px-2 py-0.5 rounded-full font-black">
                5
              </span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 text-[#111] dark:text-zinc-300 hover:bg-[#e0e0e0] dark:hover:bg-zinc-800 rounded-lg font-bold text-sm transition-colors border-2 border-transparent">
              <CalendarDays size={18} strokeWidth={2.5} /> Kanban
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 text-[#111] dark:text-zinc-300 hover:bg-[#e0e0e0] dark:hover:bg-zinc-800 rounded-lg font-bold text-sm transition-colors border-2 border-transparent">
              <FileText size={18} strokeWidth={2.5} /> Gantt Chart
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 text-[#111] dark:text-zinc-300 hover:bg-[#e0e0e0] dark:hover:bg-zinc-800 rounded-lg font-bold text-sm transition-colors border-2 border-transparent">
              <FileText size={18} strokeWidth={2.5} /> Reports
            </button>
          </nav>

          <div className="text-[0.7rem] font-black text-gray-500 mb-3 px-2">
            SETTINGS
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <button className="flex items-center gap-3 px-3 py-2.5 text-[#111] dark:text-zinc-300 hover:bg-[#e0e0e0] dark:hover:bg-zinc-800 rounded-lg font-bold text-sm transition-colors border-2 border-transparent">
              <Settings size={18} strokeWidth={2.5} /> Settings
            </button>
          </nav>

          <div className="mt-auto pt-4 border-t-2 border-dashed border-[#111] dark:border-zinc-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#ffb5b5] text-[#111] font-black text-sm brutal-btn rounded-lg"
            >
              <LogOut size={16} strokeWidth={2.5} /> ออกจากระบบ
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-10 relative">
          <header className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-[2rem] font-black text-[#111] dark:text-white tracking-tight leading-none">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={resetLayout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl brutal-btn bg-[#ffe4e1] text-[#111] font-black text-sm"
                >
                  <RotateCcw size={15} strokeWidth={3} />
                  รีเซ็ต layout
                </button>

                <button
                  onClick={() => setAllWidgetsEqualHeight(360)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl brutal-btn bg-[#fff3cd] text-[#111] font-black text-sm"
                >
                  <PanelTop size={15} strokeWidth={3} />
                  ทำกล่องสูงเท่ากัน
                </button>
              </div>

              {user.role === "admin" && (
                <button
                  onClick={() => setIsAddProjectOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#a2cb8b] text-[#111] font-black text-sm brutal-btn rounded-xl"
                >
                  <Plus size={16} strokeWidth={3} /> สร้าง Project
                </button>
              )}

              <div className="relative">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWidgetMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl brutal-btn bg-[#b5deff] text-[#111] font-black text-sm"
                  >
                    <SlidersHorizontal size={15} strokeWidth={3} />
                    จัดการกล่อง
                  </button>

                  {/* {hiddenWidgets.length > 0 && (
                    <span className="text-xs font-black text-gray-600 dark:text-zinc-400">
                      ซ่อนอยู่ {hiddenWidgets.length} กล่อง
                    </span>
                  )} */}
                </div>

                {isWidgetMenuOpen && (
                  <div className="absolute top-full right-0 mt-3 z-30 w-[360px] brutal-box bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-[6px_6px_0px_#111]">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-[#111] dark:border-zinc-700">
                      <div>
                        <h3 className="text-sm font-black text-[#111] dark:text-white">
                          เปิด / ปิดการแสดงกล่อง
                        </h3>
                        <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 mt-1">
                          เลือกกล่องที่ต้องการแสดงบน dashboard
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsWidgetMenuOpen(false)}
                        className="px-2.5 py-1.5 rounded-lg brutal-btn bg-[#ffe4e1] text-[#111] text-xs font-black"
                      >
                        ปิด
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1">
                      {widgets
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((widget) => (
                          <button
                            key={widget.id}
                            type="button"
                            onClick={() => toggleWidgetVisibility(widget.id)}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl border-2 border-[#111] text-left shadow-[2px_2px_0px_#111] ${
                              widget.visible
                                ? "bg-[#e8f5bd] text-[#111]"
                                : "bg-[#f4f4f5] dark:bg-zinc-800 text-[#111] dark:text-white"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-black truncate">
                                {widget.title}
                              </p>
                              <p className="text-[0.7rem] font-bold text-gray-500 dark:text-zinc-400 mt-0.5">
                                {widget.visible ? "กำลังแสดง" : "ถูกซ่อนอยู่"}
                              </p>
                            </div>

                            <div
                              className={`shrink-0 px-2 py-1 rounded-full border-2 border-[#111] text-[0.65rem] font-black ${
                                widget.visible ? "bg-[#a2cb8b]" : "bg-[#ffe4e1]"
                              }`}
                            >
                              {widget.visible ? "ON" : "OFF"}
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 bg-white dark:bg-zinc-800 rounded-md flex items-center justify-center brutal-btn text-[#111] dark:text-white"
              >
                {isDark ? (
                  <Sun size={16} strokeWidth={2.5} />
                ) : (
                  <Moon size={16} strokeWidth={2.5} />
                )}
              </button>

              <button className="relative">
                <Bell
                  size={20}
                  strokeWidth={2.5}
                  className="text-[#111] dark:text-white"
                />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ffb5b5] border-[1.5px] border-[#111] rounded-full"></span>
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <div className="brutal-box bg-[#e0f2fe] p-5 rounded-xl flex flex-col gap-1.5">
              <span className="text-[0.7rem] font-black text-[#111] uppercase">
                PROJECTS ทั้งหมด
              </span>
              <span className="text-[2rem] font-black text-[#111] leading-none">
                {projects.length}
              </span>
              <span className="text-[0.65rem] font-black bg-[#b5deff] text-[#111] px-2 py-0.5 rounded border-2 border-[#111] w-fit shadow-[1px_1px_0px_#111] mt-1">
                +3 เดือนนี้
              </span>
            </div>

            <div className="brutal-box bg-[#fff3cd] p-5 rounded-xl flex flex-col gap-1.5">
              <span className="text-[0.7rem] font-black text-[#111] uppercase">
                กำลังดำเนินการ
              </span>
              <span className="text-[2rem] font-black text-[#111] leading-none">
                8
              </span>
              <span className="text-[0.65rem] font-black bg-[#fdfd96] text-[#111] px-2 py-0.5 rounded border-2 border-[#111] w-fit shadow-[1px_1px_0px_#111] mt-1">
                2 ใกล้ deadline
              </span>
            </div>

            <div className="brutal-box bg-[#e8f5bd] p-5 rounded-xl flex flex-col gap-1.5">
              <span className="text-[0.7rem] font-black text-[#111] uppercase">
                TASKS วันนี้
              </span>
              <span className="text-[2rem] font-black text-[#111] leading-none">
                17
              </span>
              <span className="text-[0.65rem] font-black bg-[#a2cb8b] text-[#111] px-2 py-0.5 rounded border-2 border-[#111] w-fit shadow-[1px_1px_0px_#111] mt-1">
                11 เสร็จแล้ว
              </span>
            </div>

            <div className="brutal-box bg-[#ffe4e1] p-5 rounded-xl flex flex-col gap-1.5">
              <span className="text-[0.7rem] font-black text-[#111] uppercase">
                เสร็จแล้วเดือนนี้
              </span>
              <span className="text-[2rem] font-black text-[#111] leading-none">
                63%
              </span>
              <span className="text-[0.65rem] font-black bg-[#ffb5b5] text-[#111] px-2 py-0.5 rounded border-2 border-[#111] w-fit shadow-[1px_1px_0px_#111] mt-1">
                -5% จากเดือนก่อน
              </span>
            </div>
          </section>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleWidgetIds}
              strategy={rectSortingStrategy}
            >
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {sortedVisibleWidgets.map((widget) => (
                  <div key={widget.id} className={getSpanClass(widget.span)}>
                    <SortableDashboardItem
                      id={widget.id}
                      title={widget.title}
                      currentSpan={widget.span}
                      currentHeight={widget.height}
                      onResize={(next) => resizeWidget(widget.id, next)}
                      onResizeHeight={(nextHeight) =>
                        resizeWidgetHeight(widget.id, nextHeight)
                      }
                      onSetHeightPreset={(nextHeight) =>
                        resizeWidgetHeight(widget.id, nextHeight)
                      }
                      className=""
                      onToggle={() => toggleWidgetVisibility(widget.id)}
                      onMoveUp={() => moveWidget(widget.id, "up")}
                      onMoveDown={() => moveWidget(widget.id, "down")}
                    >
                      {renderWidgetContent(widget.id)}
                    </SortableDashboardItem>
                  </div>
                ))}
              </section>
            </SortableContext>
          </DndContext>
        </main>
      </div>

      <AddProjectModal
        open={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onCreate={handleCreateProject}
      />
    </>
  );
}
