"use client";
import { useState, useEffect } from "react";
import { Dropdown, Navbar, Avatar } from "flowbite-react";
import Image from "next/image";
import logo from './../public/images/logo.png'
import { useRouter } from "next/navigation";
import apiClient from "@/services/apiClient";
import toast from 'react-hot-toast'

export default function NavBar() {
  const [user, setUser] = useState<any>();
  const router = useRouter();
  const getUser = () => {
    setUser(JSON.parse(localStorage.getItem("USER") as any) || null);
  };
  useEffect(() => {
    getUser();
  }, [router]);

  const logoutHandler = () => {
    apiClient.post(`/auth/logout`)
      .then(() => {
        localStorage.removeItem("USER");
        toast.success("Đăng xuất thành công")
      });
    router.push("/login");
  };
  return (
    <Navbar
      fluid
      rounded
      className="sticky top-0 z-10 rounded-none bg-gradient-to-r from-cyan-500 to-sky-500"
    >
      <Navbar.Brand href="/">
        <Image
          src={logo}
          alt="CodeArt"
          priority={true}
          className="w-[150px] h-[60px] ms-6 object-contain"
        />
      </Navbar.Brand>
      <div className="flex md:order-2 text-white">
        <Dropdown
          inline
          label={<h1>Xin chào, {user?.first_name}</h1>}
          className="bg-gradient-to-l from-cyan-500 to-sky-400 border-transparent"
        >
          <Dropdown.Header>
            <span className="block text-sm text-white">{user?.email}</span>
            <span className="block truncate text-sm font-medium text-white">
              Vị trí: {user?.role}
            </span>
          </Dropdown.Header>
          <Dropdown.Item className="text-white hover:text-black" onClick={logoutHandler}>
            Đăng xuất
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse></Navbar.Collapse>
    </Navbar>
  );
}
