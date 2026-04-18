import { useMemo, useState } from "react";
import { X, Users } from "lucide-react";

type Member = {
  id: number;
  name: string;
  role: string;
};

type AddProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (project: {
    name: string;
    description: string;
    dueDate: string;
    members: Member[];
  }) => void;
};

const mockMembers: Member[] = [
  { id: 1, name: "นวล", role: "Frontend Developer" },
  { id: 2, name: "ปาล์ม", role: "Backend Developer" },
  { id: 3, name: "มีนา", role: "QA Tester" },
  { id: 4, name: "สมชาย", role: "UI/UX Designer" },
  { id: 5, name: "อาร์ม", role: "Project Coordinator" },
];

export default function AddProjectModal({
  open,
  onClose,
  onCreate,
}: AddProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const selectedMembers = useMemo(
    () => mockMembers.filter((m) => selectedIds.includes(m.id)),
    [selectedIds],
  );

  const toggleMember = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const resetForm = () => {
    setProjectName("");
    setDescription("");
    setDueDate("");
    setSelectedIds([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      alert("กรุณากรอกชื่อโปรเจค");
      return;
    }

    onCreate({
      name: projectName,
      description,
      dueDate,
      members: selectedMembers,
    });

    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-3xl max-h-[88vh] overflow-hidden rounded-2xl border-2 border-[#111] bg-white dark:bg-zinc-900 shadow-[6px_6px_0px_#111]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#111] dark:border-zinc-700 px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-[#111] dark:text-white">
              สร้าง Project ใหม่
            </h2>
            <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 mt-0.5">
              ตั้งชื่อโปรเจคและเลือกผู้รับผิดชอบ
            </p>
          </div>

          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#111] bg-[#ffe4e1] text-[#111] shadow-[2px_2px_0px_#111]"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(88vh-72px)] overflow-y-auto px-5 py-4"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-black text-[#111] dark:text-white">
                ชื่อโปรเจค
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="เช่น ระบบเบิกของภายใน"
                className="h-12 w-full rounded-2xl border-2 border-[#111] bg-white px-4 text-sm font-bold text-[#111] outline-none dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-black text-[#111] dark:text-white">
                รายละเอียด
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="อธิบายโปรเจคแบบสั้น ๆ"
                rows={3}
                className="w-full rounded-2xl border-2 border-[#111] bg-white px-4 py-3 text-sm font-bold text-[#111] outline-none resize-none dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-black text-[#111] dark:text-white">
                  กำหนดส่ง
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-12 w-full rounded-2xl border-2 border-[#111] bg-white px-4 text-sm font-bold text-[#111] outline-none dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-black text-[#111] dark:text-white">
                  จำนวนผู้รับผิดชอบ
                </label>
                <div className="flex h-12 items-center gap-2 rounded-2xl border-2 border-[#111] bg-[#fff3cd] px-4">
                  <Users size={17} className="text-[#111]" />
                  <span className="text-sm font-black text-[#111]">
                    {selectedMembers.length} คน
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#111] dark:text-white">
                เลือกลูกน้องเพื่อมอบหมายงาน
              </label>

              <div className="grid grid-cols-2 gap-3">
                {mockMembers.map((member) => {
                  const checked = selectedIds.includes(member.id);

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleMember(member.id)}
                      className={`rounded-2xl border-2 border-[#111] px-4 py-3 text-left transition ${
                        checked ? "bg-[#e8f5bd]" : "bg-white dark:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-[#111] dark:text-white">
                            {member.name}
                          </p>
                          <p className="mt-1 text-xs font-bold text-gray-500 dark:text-zinc-400">
                            {member.role}
                          </p>
                        </div>

                        <div
                          className={`mt-0.5 h-6 w-6 rounded-md border-2 border-[#111] ${
                            checked
                              ? "bg-[#a2cb8b]"
                              : "bg-white dark:bg-zinc-700"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedMembers.length > 0 && (
              <div className="rounded-2xl border-2 border-[#111] bg-[#e0f2fe] px-4 py-3">
                <p className="mb-2 text-sm font-black text-[#111]">
                  ผู้ที่ถูกเลือก
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((member) => (
                    <span
                      key={member.id}
                      className="rounded-full border-2 border-[#111] bg-[#b5deff] px-3 py-1 text-xs font-black text-[#111]"
                    >
                      {member.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border-2 border-[#111] bg-[#ffe4e1] px-4 py-2.5 text-sm font-black text-[#111]"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="rounded-xl border-2 border-[#111] bg-[#a2cb8b] px-4 py-2.5 text-sm font-black text-[#111]"
              >
                สร้างโปรเจค
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
