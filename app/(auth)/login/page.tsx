"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import logo from './../../../public/images/logo.png'
const apiUrl = process.env.API_URL;
export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const LOGIN_API_URL = `http://localhost:3001/auth/login`
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_API_URL,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = response.data;
      if (result.role !== "admin") {
        toast.error("Bạn không có quyền truy cập trang này");
        return;
      }
      localStorage.setItem("USER", JSON.stringify(result));
      toast.success("Đăng nhập thành công");
      router.push("/manage/courses");

    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.message[0].includes("password must"))
          toast.error("Mật khẩu tối thiểu 6 ký tự !");
        else {
          toast.error("Tên đăng nhập phải là email hợp lệ !");
        }
      }
      else if (error.response && error.response.status === 401) {
        if (error.response.data.message === "Invalid credentials") {
          toast.error("Sai mật khẩu")
        }
        else {
          toast.error("Tài khoản không tồn tại")
        }
      }
      else {
        toast.error("Có lỗi xảy ra")
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex 
      flex-col 
      items-center 
      justify-center 
      px-6 py-8 mx-auto md:h-screen lg:py-0 
      bg-center bg-no-repeat bg-cover
      bg-[url('https://www.theschoolrun.com/sites/theschoolrun.com/files/article_images/what_is_a_programming_language.jpg')]
      bg-gray-700 bg-blend-multiply ">
        <div>
          <Link
            href="#"
            className="flex justify-center mb-6 text-2xl font-semibold text-black w-full">
            <Image
              src={logo}
              alt="CodeArt"
              priority={true}
              className="w-[150px] h-[60px] object-contain"
            />
          </Link>
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className=" text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Trang đăng nhập
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Địa chỉ email"
                  required
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Mật khẩu"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start"></div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
