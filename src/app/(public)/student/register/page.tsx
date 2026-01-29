import StudentRegisterForm from "./studentRegisterForm";


export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      <StudentRegisterForm apiBase=""/>
    </div>
  );
}
