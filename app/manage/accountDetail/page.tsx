"use client";

import { useUser } from "@/app/hooks/useUser";
import apiClient from "@/services/apiClient";
import { em } from "@fullcalendar/core/internal-common";
import {
  Button,
  Label,
  Modal,
  TextInput,
  Datepicker,
  Select,
  Spinner,
  Radio,
} from "flowbite-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { HiPencilAlt } from "react-icons/hi";

export default function AccountDetailPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsLoading(false);
    };
    fetchData();
  }, [refetchTrigger, user]);

  const handleRefetch = () => {
    setRefetchTrigger((prev) => !prev);
  };

  if (isLoading)
    return (
      <div className="flex justify-center content-center min-h-screen">
        <Spinner className="mt-60" />
      </div>
    );

  return (
    <>
      <div className="drop-shadow-2xl">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <img src={user?.avatar} alt="Avatar" className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 object-cover" />
                  <h1 className="text-xl font-bold">{user?.first_name} {user?.last_name}</h1>
                </div>
                <hr className="my-6 border-t border-gray-300" />
                <div className="flex justify-center">
                  <h2 className="text-md font-bold">{user?.role.toUpperCase()}</h2>
                </div>
              </div>
              <div className="flex justify-center">
                <EditModal handleRefetch={handleRefetch} userData={user} />
              </div>
            </div>

            <div className="col-span-4 sm:col-span-9">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Thông tin cá nhân</h2>
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user?.email}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Số điện thoại
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user?.phone}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Ngày sinh
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(user?.date_of_birth!).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Giới tính
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user?.gender ? "Nam" : "Nữ"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface UserUpdateData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone: string;
  gender: boolean;
  avatar: string;
}
const EditModal: React.FC<{
  handleRefetch: () => void;
  userData?: any;
}> = ({ handleRefetch, userData }) => {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState<UserUpdateData>({
    first_name: userData?.first_name,
    last_name: userData?.last_name,
    date_of_birth: userData?.date_of_birth,
    phone: userData?.phone,
    gender: userData?.gender,
    avatar: userData?.avatar
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name == "avatar") {
      let avatarPreview = document.getElementById("avatarPreview") as HTMLImageElement;
      if (avatarPreview) {
        avatarPreview.src = value;
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      Object.values(formData).some(
        (value) =>
          (typeof value === "string" && value.trim() === "") ||
          value === null ||
          value === undefined
      )
    ) {
      toast.error("Hãy điền đầy đủ thông tin !");
      return;
    }
    apiClient
      .patch(`/user`, JSON.stringify(formData))
      .then((response) => {
        var data = response.data;
        userData.first_name = data?.first_name;
        userData.last_name = data?.last_name;
        userData.avatar = data?.avatar;
        userData.date_of_birth = data?.date_of_birth;
        userData.phone = data?.phone;
        userData.gender = data?.gender;
        localStorage.setItem('USER', JSON.stringify(userData));
        handleRefetch();
        setOpen(false);
        toast.success("Cập nhật thông tin thành công");
      })
      .catch((error: any) => {
        if (error.response) {

        }
      });
  };

  return (
    <>
      <Button className="
      bg-gradient-to-r 
      from-cyan-500 to-sky-400 
      hover:from-cyan-700 hover:to-sky-500 
      w-full mt-4" onClick={() => setOpen(!isOpen)}>
        Cập nhật
      </Button>
      <Modal
        onClose={() => {
          setOpen(false);
        }}
        show={isOpen}
      >
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Thay đổi thông tin cá nhân </strong>
        </Modal.Header>
        <form onSubmit={handleSubmit} className="bg-white">
          <Modal.Body>
            <div>
              <Label className="text-md">Họ</Label>
              <TextInput
                name="last_name"
                className="mt-1"
                onChange={handleChange}
                value={formData.last_name}
              />
            </div>
            <div>
              <Label className="text-md">Tên</Label>
              <TextInput
                name="first_name"
                className="mt-1"
                onChange={handleChange}
                value={formData.first_name}
              />
            </div>
            <div className="mt-3">
              <Label className="text-md">Ngày sinh</Label>
              <br />
              <input
                type="date"
                name="date_of_birth"
                onChange={handleChange}
                className="rounded mt-1"
                value={
                  new Date(formData.date_of_birth!.split("T")[0] + "T00:00:00Z")
                    .toISOString()
                    .split("T")[0]
                }
              />
            </div>
            <div className="mt-1">
              <Label className="text-md">Số điện thoại</Label>
              <TextInput
                name="phone"
                className="mt-1"
                onChange={handleChange}
                value={formData.phone}
              />
            </div>
            <div className="mt-3 flex max-w-md flex-col gap-4">
              <Label className="text-md">Giới tính</Label>
              <div className="flex items-center gap-2">
                <Radio
                  id="male"
                  name="gender"
                  value="true"
                  checked={formData.gender == true}
                  onChange={handleChange}
                />
                <Label htmlFor="male">Nam</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  id="female"
                  name="gender"
                  value="false"
                  onChange={handleChange}
                  checked={formData.gender == false}
                />
                <Label htmlFor="female">Nữ</Label>
              </div>
            </div>
            <div className="flex flex-col items-center mt-1">
              <div className="w-full">
                <Label>Link avatar</Label>
                <TextInput
                  name="avatar"
                  className="mt-1"
                  onChange={handleChange}
                  value={formData.avatar}
                />
              </div>
              <div className="p-1 pt-2 h-40 w-64">
                <img id="avatarPreview" alt="Avatar" src={formData.avatar} />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex justify-center">
            <Button
              className="bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-700 hover:to-sky-500"
              type="submit"
              id="Add-button">
              <HiPencilAlt className="mr-2 text-lg" />
              Cập nhật
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
