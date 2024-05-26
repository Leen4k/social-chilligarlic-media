"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { useSession } from "next-auth/react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

type FormData = {
  [key: string]: string;
};

const Page = ({ params }: any) => {
  const session = useSession();
  const { id: user_id } = useParams();

  // Initialize formEntities state with initial values from session
  const [formEntities, setFormEntities] = useState([
    { name: "email", value: session?.data?.user?.email },
    { name: "username", value: session?.data?.user?.name },
  ]);
  const router = useRouter();
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [file, setFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({});

  const { data, isLoading: userProfileLoading } = useQuery({
    queryKey: ["SingleUserProfile"],
    queryFn: async () => await axios.get(`/api/user/${user_id}`),
  });

  const userData = data?.data;
  console.log(userData);

  useEffect(() => {
    const uploadFile = (file, setFileUrl) => {
      const name = new Date().getTime() + file.name;
      console.log(file);
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      toast.loading("uploading image");
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUrl(downloadURL);
            toast.dismiss();
            toast.success("Image uploaded successfully");
          });
        }
      );
    };

    if (file) uploadFile(file, setProfilePic);
    if (coverFile) uploadFile(coverFile, setCoverPic);
  }, [file, coverFile]);

  // Handle input change
  const handleChange = (newValue: string, index: number) => {
    // Create a copy of formEntities
    const updatedFormEntities = [...formEntities];
    // Update the value of the specified index
    updatedFormEntities[index].value = newValue;
    // Set the state with the updated formEntities
    setFormEntities(updatedFormEntities);
  };

  const { mutate, isLoading } = useMutation(
    async (data: any) => await axios.patch(`/api/user/${user_id}`, data),
    {
      onError: (err: any) => {
        toast.error(err.message);
      },
      onSuccess: (data) => {
        console.log(data);
        window.location.reload();
        toast.success("successfully updated user profile");
      },
    }
  );

  const handleSubmit = () => {
    // Create an object to store form data
    let formData = {};

    // Iterate over formEntities
    formEntities.forEach((entity) => {
      // Add each entity's name and value to formData object
      formData[entity.name] = entity.value;
    });

    // Now formData object contains the form data in the required format
    console.log(formData);
    formData = {
      ...formData,
      image: profilePic ? profilePic : userData.image,
      cover: coverPic ? coverPic : userData.cover,
    };
    // Perform further actions such as submitting formData
    mutate(formData);
  };

  console.log(formEntities);
  console.log(profilePic);
  console.log(session);

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-screen relative max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Link
                    href="/profile"
                    className="absolute left-1 top-1 inline-flex justify-center rounded-md border border-transparent px-2 py-2 text-lg font-medium focus:outline-none"
                  >
                    <RxCross2 />
                  </Link>

                  <div className="flex flex-col p-8 relative">
                    <div>
                      <div className="relative z-20">
                        <Image
                          className="rounded-full object-cover border mb-4 aspect-square"
                          src={profilePic ? profilePic : userData?.image}
                          width={110}
                          height={110}
                          alt={"profile pic"}
                        />
                        <input
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="absolute inset-0 opacity-0"
                        />
                      </div>
                    </div>
                    <div className="absolute mt-4 -z-1 inset-0 flex">
                      <Image
                        className="w-full h-full object-cover border mb-4 flex-1"
                        src={coverPic ? coverPic : userData?.cover || ""}
                        width={300}
                        height={120}
                        alt="cover picture"
                      />
                      <input
                        type="file"
                        onChange={(e) => setCoverFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    {formEntities.map((entity, index) => (
                      <Input
                        key={index}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(e.target.value, index)
                        }
                        name={entity.name}
                        value={entity.value}
                      />
                    ))}
                  </div>

                  <div className="mt-4">
                    <Button
                      action={handleSubmit}
                      type="button"
                      disabled={isLoading}
                      text="Save Profile"
                      bgColor="bg-primary"
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Page;
