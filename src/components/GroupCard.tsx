import { Group } from "@/domain/group";
import GroupsIcon from "@mui/icons-material/Groups";
import ModeEditIcon from '@mui/icons-material/ModeEdit';

interface Props {
  group: Group;
  onEdit: () => void;
}

export default function GroupCard({ group, onEdit }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-neutral03 overflow-hidden">
      <div className="bg-primary03 text-white px-6 py-3 font-semibold flex justify-between">
        <span><GroupsIcon className="mr-1" /> Group</span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold mb-0.5 text-xl">{group.name}</p>
          <button onClick={onEdit} className="text-primary03 hover:text-primary04 transition">
            <ModeEditIcon fontSize="medium" />
          </button>
        </div>
        <div className="flex -space-x-2">
          {group.members.map((m) => (
            <img
              key={m.id}
              src={m.student.user.imageUrl}
              className="w-10 h-10 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
