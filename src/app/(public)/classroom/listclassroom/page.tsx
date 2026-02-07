import ListClassroom from "./listClassroom";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      {/* mock role ไปก่อน เดี๋ยวค่อยดึงจาก user profile */}
      <ListClassroom apiBase="" role="student" />
    </div>
  );
}
