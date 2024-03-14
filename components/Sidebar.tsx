import { Sidebar, TextInput } from "flowbite-react";
import { HiOutlineAcademicCap, HiUser } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
const SideBar: React.FC<{}> = ({ }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>();
  const getUser = () => {
    setUser(JSON.parse(localStorage.getItem("USER") as any) || null);
  };
  useEffect(() => {
    getUser();
  }, [router]);

  const pathname = usePathname();

  return (
    <Sidebar className="bg-gray-50 hidden lg:fixed top-0 left-0 z-5 flex-col my-2 flex-shrink-0 pt-[60px] h-full duration-75  lg:flex transition-width  w-64 rounded-none">
      <div className="flex h-full flex-col justify-between py-2 rounded-none">
        <div className="rounded-none">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/manage/courses"
                icon={HiOutlineAcademicCap}
                className={pathname === "/manage/courses" ? "bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-600 hover:to-sky-500" : ""}
              >
                Khóa học
              </Sidebar.Item>
              <Sidebar.Item
                href="/manage/accountDetail"
                icon={HiUser}
                className={pathname === "/manage/accountDetail" ? "bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-600 hover:to-sky-500" : ""}
              >
                Thông tin cá nhân
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
  );
};

export default SideBar;
