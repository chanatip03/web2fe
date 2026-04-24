"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Breadcrumbs, Avatar } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import PersonIcon from "@mui/icons-material/Person";
import ResetPasswordModal from "@/components/modal/resetPasswordModal";
import { ANONYMOUS_AVATAR_URL } from "@/constants";

const schema = z.object({
  first_name: z.string().min(1, "Please enter first name"),
  last_name: z.string().min(1, "Please enter last name"),
  email: z.string().min(1, "Please enter email").email("Invalid email format"),
  academy: z.string().min(1, "Please enter academy"),
  imageUrl: z.instanceof(File).nullable().optional(),
});

type FormData = z.infer<typeof schema>;

import { userService } from "@/services/controller";
import { Teacher } from "@/domain/teacher";

export default function TeacherProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [initialPreviewImage, setInitialPreviewImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<Teacher | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      academy: "",
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = (await userService.getCurrentUser()) as Teacher;
        setCurrentUserData(data);

        const profileData = {
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          email: data.user.email,
          academy: data.user.academy,
        };

        reset(profileData);
        setPreviewImage(data.user.image_url || "");
        setInitialPreviewImage(data.user.image_url || "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    if (!currentUserData) return;
    try {
      setSaving(true);
      await userService.updateTeacher(
        currentUserData.user.id,
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          academy: data.academy,
        },
        data.imageUrl as File,
      );

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChooseImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;

    const file = event.target.files?.[0] ?? null;

    setValue("imageUrl", file, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleResetEdit = () => {
    if (!currentUserData) return;
    reset({
      first_name: currentUserData.user.first_name,
      last_name: currentUserData.user.last_name,
      email: currentUserData.user.email,
      academy: currentUserData.user.academy,
      imageUrl: null,
    });

    setPreviewImage(initialPreviewImage);
    setIsEditing(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return <div className="px-8 py-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen px-6 py-5">
      <div className="mx-auto max-w-[850px]">
        <Breadcrumbs>
          <Link href="/classroom">Home</Link>
          <span className="font-medium text-black">Profile</span>
        </Breadcrumbs>

        <form className="pt-4" onSubmit={(e) => e.preventDefault()}>
          <div className="relative mb-8 h-[180px]">
            <div className="flex h-full items-center justify-center">
              <div className="relative">
                {previewImage ? (
                  <div className="h-[148px] w-[148px] overflow-hidden rounded-full bg-neutral-400">
                    <Image
                      src={previewImage}
                      alt="Profile"
                      width={140}
                      height={140}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <Avatar
                    src={ANONYMOUS_AVATAR_URL}
                    sx={{
                      width: 148,
                      height: 148,
                    }}
                  />
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className="absolute bottom-1 right-1 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#1f78d1] text-white shadow"
                >
                  <PhotoCameraIcon style={{ fontSize: 18 }} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleChooseImage}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-4">
            <RHFTextField
              control={control}
              name="first_name"
              label="First Name"
              disabled={!isEditing}
            />
            <RHFTextField
              control={control}
              name="last_name"
              label="Last Name"
              disabled={!isEditing}
            />
            <RHFTextField
              control={control}
              name="email"
              label="Email"
              disabled={!isEditing}
            />
            <RHFTextField
              control={control}
              name="academy"
              label="Academy"
              disabled={!isEditing}
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            {!isEditing ? (
              <>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => setOpenResetPassword(true)}
                >
                  Reset Password
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outlined"
                  color="error"
                  onClick={handleResetEdit}
                >
                  Reset
                </Button>

                <Button
                  type="button"
                  variant="contained"
                  disabled={!isValid || saving}
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </form>
        <ResetPasswordModal
          open={openResetPassword}
          email={currentUserData?.user.email || ""}
          onClose={() => setOpenResetPassword(false)}
          onConfirm={(data) => {
            console.log("reset password:", data);
          }}
          onResend={() => {
            console.log("resend code");
          }}
        />
      </div>
    </div>
  );
}
