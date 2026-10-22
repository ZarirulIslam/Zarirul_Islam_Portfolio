import { saveProfile } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/PageHeader";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { getAdmin } from "@/lib/auth";
import { profileFields } from "@/lib/resources";

export default async function ProfilePage() {
  const { supabase } = await getAdmin();
  const { data } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your name, intro, photo, CV and social links. Used in the hero, About and Contact sections."
      />
      <ResourceForm fields={profileFields} values={data ?? { available: true }} action={saveProfile} />
    </>
  );
}
