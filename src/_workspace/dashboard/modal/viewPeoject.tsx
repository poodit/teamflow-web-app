import { X, CalendarDays, Users, FileText } from "lucide-react";

type Member = {
  id: number;
  name: string;
  role: string;
};

type Project = {
  name: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  members?: Member[];
  prog: string;
  status: string;
  bg: string;
  bar: string;
};

type ViewProjectModalProps = {
  open: boolean;
  project: Project | null;
  onClose: () => void;
};

export default function ViewProjectModal({
  open,
  project,
  onClose,
}: ViewProjectModalProps) {
  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[88vh] overflow-hidden rounded-2xl border-2 border-[#111] bg-white dark:bg-zinc-900 shadow-[6px_6px_0px_#111]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#111] dark:border-zinc-700 px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-[#111] dark:text-white">
              รายละเอียดโปรเจค
            </h2>
            <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 mt-0.5">
              ดูข้อมูลของโปรเจคที่เลือก
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#111] bg-[#ffe4e1] text-[#111] shadow-[2px_2px_0px_#111]"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[calc(88vh-72px)] overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border-2 border-[#111] bg-[#e0f2fe] px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-[#111] dark:text-white">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-gray-600 dark:text-zinc-400">
                    {project.description || "ยังไม่มีรายละเอียด"}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border-2 border-[#111] px-3 py-1 text-[0.7rem] font-black text-[#111] shadow-[1px_1px_0px_#111] ${project.bg}`}
                >
                  {project.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border-2 border-[#111] bg-white dark:bg-zinc-800 px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays
                    size={16}
                    className="text-[#111] dark:text-white"
                  />
                  <p className="text-sm font-black text-[#111] dark:text-white">
                    Start Date
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-600 dark:text-zinc-400">
                  {project.startDate || "-"}
                </p>
              </div>

              <div className="rounded-2xl border-2 border-[#111] bg-white dark:bg-zinc-800 px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays
                    size={16}
                    className="text-[#111] dark:text-white"
                  />
                  <p className="text-sm font-black text-[#111] dark:text-white">
                    Due Date
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-600 dark:text-zinc-400">
                  {project.dueDate || "-"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-[#111] bg-white dark:bg-zinc-800 px-4 py-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-[#111] dark:text-white" />
                <p className="text-sm font-black text-[#111] dark:text-white">
                  ความคืบหน้า
                </p>
              </div>

              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-600 dark:text-zinc-400">
                  Progress
                </span>
                <span className="text-sm font-black text-[#111] dark:text-white">
                  {project.prog}
                </span>
              </div>

              <div className="w-full h-3 bg-white dark:bg-zinc-700 border-2 border-[#111] rounded-full overflow-hidden">
                <div
                  className={`h-full border-r-2 border-[#111] ${project.bar}`}
                  style={{ width: project.prog }}
                />
              </div>
            </div>

            <div className="rounded-2xl border-2 border-[#111] bg-white dark:bg-zinc-800 px-4 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-[#111] dark:text-white" />
                <p className="text-sm font-black text-[#111] dark:text-white">
                  ผู้รับผิดชอบ
                </p>
              </div>

              {project.members && project.members.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.members.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-xl border-2 border-[#111] bg-[#e8f5bd] px-3 py-2 shadow-[1px_1px_0px_#111]"
                    >
                      <p className="text-xs font-black text-[#111]">
                        {member.name}
                      </p>
                      <p className="text-[0.7rem] font-bold text-gray-600">
                        {member.role}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-gray-500 dark:text-zinc-400">
                  ยังไม่มีผู้รับผิดชอบ
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
