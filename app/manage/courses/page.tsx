"use client";
import { useRouter } from "next/navigation";
import apiClient from "@/services/apiClient";
import {
  Button,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
  Datepicker,
  Checkbox,
  Spinner,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import {
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
  HiPlus,
} from "react-icons/hi";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import toast from "react-hot-toast";
import { title } from "process";

const apiUrl = process.env.API_URL;
interface CourseCreator {
  _id?: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}
interface CourseAPIData {
  _id?: string;
  title: string;
  description?: string;
  price: number;
  discount: number;
  image?: string;
  creator: CourseCreator;
}

interface CourseApiResponse {
  count: number;
  countPage: number;
  courses: CourseAPIData[];
}

interface CourseFormData {
  _id?: string;
  title: string;
  description?: string;
  price: number;
  discount: number;
  image?: string;
}

interface PaginationComponentProps {
  courseApiResponse: CourseApiResponse | undefined;
  currentSearched: string;
  setCourseApiResponse: React.Dispatch<
    React.SetStateAction<CourseApiResponse | undefined>
  >;
}

export default function CoursesPage() {
  const [courseApiResponse, setCourseApiResponse] = useState<CourseApiResponse>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearched, setCurrentSearched] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await apiClient.get<CourseApiResponse | undefined>(
        `/course`
      );
      setCourseApiResponse(response.data);
      setIsLoading(false);
      setCurrentSearched("");
      setSearchTerm("");
    };
    fetchData();
  }, [refetchTrigger]);

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefetch = () => {
    setRefetchTrigger((prev) => !prev);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchHandle()
    }
  }

  const searchHandle = async () => {
    try {
      setCurrentSearched(searchTerm);
      const response = await apiClient.get<CourseApiResponse | undefined>(
        `/course?keyword=${searchTerm}`
      );
      setCourseApiResponse(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Có lỗi xảy ra !");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center content-center min-h-screen">
        <Spinner className="mt-60" />
      </div>
    );



  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Khóa học
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <div className="mb-4 sm:mb-0 sm:pr-3 ">
              <Label htmlFor="search" className="sr-only">
                Tìm kiếm
              </Label>
              <div className="relative mt-1 flex gap-x-3">
                <TextInput
                  className="w-[600px]"
                  id="search"
                  name="search"
                  placeholder="Tìm kiếm theo tên "
                  value={searchTerm}
                  onChange={changeHandle}
                  onKeyDown={handleKeyDown}
                />
                <Button className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-700 hover:to-sky-700 w-[100px]" onClick={searchHandle}>
                  Tìm kiếm
                </Button>
              </div>
            </div>

            <div className="flex w-full items-center sm:justify-end">
              <AddCourseModal
                handleRefetch={handleRefetch}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <Pagination
              courseApiResponse={courseApiResponse}
              currentSearched={currentSearched}
              setCourseApiResponse={setCourseApiResponse}
            />
            <div className="overflow-hidden shadow">
              <CourseTable
                courseApiResponse={courseApiResponse}
                handleRefetch={handleRefetch}
              />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        courseApiResponse={courseApiResponse}
        currentSearched={currentSearched}
        setCourseApiResponse={setCourseApiResponse}
      />
    </>
  );
}

const AddCourseModal: React.FC<{
  handleRefetch: () => void;
}> = ({ handleRefetch }) => {
  const initialValue = {
    title: "",
    description: "",
    price: 0,
    discount: 0,
    image: "",
  };
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>(initialValue);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name == "image") {
      let coursePreview = document.getElementById("addCoursePreview") as HTMLImageElement;
      if (coursePreview) {
        coursePreview.src = value;
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(formData.title.trim())) {
      toast.error("Không được để trống tên !")
      return;
    }
    if (formData.price < 0) {
      toast.error("Giá không hợp lệ !")
      return;
    }
    if (!(formData.description) || !(formData.description.trim())) {
      toast.error("Không được để trống mô tả !")
      return;
    }
    if (formData.discount < 0 || formData.discount > 100) {
      toast.error("Chiết khấu không hợp lệ !")
      return;
    }
    apiClient.post(`/course`, JSON.stringify(formData))
      .then((response) => {
        handleRefetch();
        setFormData({
          title: "",
          description: "",
          price: 0,
          discount: 0,
          image: "",
        });
        setOpen(false);
        toast.success("Thêm khóa học mới thành công !")
      })
      .catch((error: any) => {
        if (error.response) {
          toast.error("Thêm khóa học thất bại !");
        }
        else {
          toast.error("Có lỗi xảy ra !");
        }
      })
  };

  return (
    <>
      <Button className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-700 hover:to-sky-700" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Thêm mới
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Điền thông tin khóa học</strong>
        </Modal.Header>
        <form onSubmit={handleSubmit} className="bg-white">
          <Modal.Body>
            <div>
              <div>
                <Label>Tên khóa học</Label>
                <TextInput
                  name="title"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Giá (đơn vị VNĐ)</Label>
                <TextInput
                  type="number"
                  name="price"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Chiết khấu (đơn vị %)</Label>
                <TextInput
                  type="number"
                  name="discount"
                  className="mt-1"
                  onChange={handleChange}
                />
              </div>

              <div className="lg:col-span-2">
                <Label>Mô tả</Label>
                <Textarea
                  name="description"
                  rows={6}
                  className="mt-1 whitespace-pre-line"
                  onChange={handleChange}
                  placeholder=""
                />
              </div>

              <div className="flex flex-col items-center  ">
                <div className="w-full">
                  <Label>Link hình ảnh</Label>
                  <TextInput
                    name="image"
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.image}
                  />
                </div>
                <div className="p-1 pt-2 h-40 w-64">
                  <img id="addCoursePreview" alt="Course Preview Image" src={formData.image} />
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="flex justify-center">
            <Button className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-800 hover:to-sky-600" type="submit">
              <HiPlus className="mr-2 text-lg" /> Thêm mới
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

const EditCourseModal: React.FC<{
  courseId: string | undefined;
  handleRefetch: () => void;
}> = ({ courseId, handleRefetch }) => {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    price: 0,
    discount: 0,
    image: ""
  });

  const fetchData = async () => {
    const response = await apiClient.get(`/course/${courseId}`);
    const data = await response.data;

    setFormData({
      title: data[0].title,
      description: data[0].description,
      price: data[0].price,
      discount: data[0].discount,
      image: data[0].image,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name == "image") {
      let coursePreview = document.getElementById("coursePreview") as HTMLImageElement;
      if (coursePreview)
        coursePreview.src = value;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(formData.title.trim())) {
      toast.error("Không được để trống tên !")
      return;
    }
    if (formData.price < 0) {
      toast.error("Giá không hợp lệ !")
      return;
    }
    if (!(formData.description) || !(formData.description.trim())) {
      toast.error("Không được để trống mô tả !")
      return;
    }
    if (formData.discount < 0 || formData.discount > 100) {
      toast.error("Chiết khấu không hợp lệ !")
      return;
    }

    apiClient.patch(`course/${courseId}`, JSON.stringify(formData))
      .then((response) => {
        setOpen(false);
        handleRefetch();
        toast.success("Cập nhật khóa học thành công !")
      })
      .catch((error) => {
        if (error.response) {
          toast.error("Thêm khóa học thất bại !");
        }
        else {
          toast.error("Có lỗi xảy ra !");
        }
      })
  };

  return (
    <>
      <Button
        className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-700 hover:to-sky-700"
        onClick={() => {
          setOpen(!isOpen);
          fetchData();
        }}
      >
        <HiPencilAlt className="mr-2 text-lg " />
        Cập nhật
      </Button>
      <Modal
        onClose={() => {
          setOpen(false);
        }}
        show={isOpen}
      >
        <Modal.Header className="border-b border-gray-200 !p-6 ">
          <strong>Thay đổi thông tin khóa học</strong>
        </Modal.Header>
        {formData.title && (
          <form onSubmit={handleSubmit} className="bg-white">
            <Modal.Body>
              <div>
                <div>
                  <Label>Tên khóa học</Label>
                  <TextInput
                    name="title"
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.title}
                  />
                </div>
                <div>
                  <Label>Giá(đơn vị VNĐ)</Label>
                  <TextInput
                    type="number"
                    name="price"
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.price}
                  />
                </div>
                <div>
                  <Label>Chiết khấu(đơn vị %)</Label>
                  <TextInput
                    type="number"
                    name="discount"
                    className="mt-1"
                    onChange={handleChange}
                    value={formData.discount}
                  />
                </div>

                <div className="lg:col-span-2">
                  <Label>Mô tả </Label>
                  <Textarea
                    name="description"
                    rows={6}
                    className="mt-1 whitespace-pre-line"
                    onChange={handleChange}
                    value={formData.description}
                  />
                </div>

                <div className="flex flex-col items-center  ">
                  <div className="w-full">
                    <Label>Link hình ảnh</Label>
                    <TextInput
                      name="image"
                      className="mt-1"
                      onChange={handleChange}
                      value={formData.image}
                    />
                  </div>
                  <div className="p-1 pt-2 h-40 w-64">
                    <img id="coursePreview" alt="Course Preview Image" src={formData.image} />
                  </div>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="flex justify-center">
              <Button className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-700 hover:to-sky-700" type="submit">
                <HiPencilAlt className="mr-2 text-lg" />Cập nhật
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Modal>
    </>
  );
};

const DeleteCourseModal: React.FC<{
  courseId: string | undefined;
  handleRefetch: () => void;
}> = ({ courseId, handleRefetch }) => {
  const [isOpen, setOpen] = useState(false);
  const deleteHandle = () => {
    setOpen(false);
    apiClient
      .delete(`/course/${courseId}`)
      .then(() => {
        handleRefetch();
        toast.success("Xóa khóa học thành công");
      })
      .catch((error) => {
        if (error.response) {
          toast.error("Thêm khóa học thất bại !");
        }
        else {
          toast.error("Có lỗi xảy ra !");
        }
      });
  };

  return (
    <>
      <Button className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-red-500 hover:to-orange-400" onClick={() => setOpen(!isOpen)}>
        <HiTrash className="mr-2 text-lg" />
        Xóa
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-3 pt-3 pb-0 text-center">
          <span>Xóa khóa học</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-600" />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Bạn có muốn xóa khóa học này không ?
            </p>
            <div className="flex items-center gap-x-3">
              <Button className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-800 hover:to-orange-500" onClick={deleteHandle}>
                Có
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                Không
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const CourseTable: React.FC<{
  courseApiResponse: CourseApiResponse | undefined;
  handleRefetch: () => void;
}> = ({ courseApiResponse, handleRefetch }) => {
  let startIndex = (parseInt(new URLSearchParams(window.location.search).get("page") || "1") - 1) * 10 + 1;
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700 text-sm">
        <Table.HeadCell>STT</Table.HeadCell>
        <Table.HeadCell>Tên khóa học</Table.HeadCell>
        <Table.HeadCell>Ảnh</Table.HeadCell>
        <Table.HeadCell>Giá(VNĐ)</Table.HeadCell>
        <Table.HeadCell>Chiết khấu(%)</Table.HeadCell>
        <Table.HeadCell>Người tạo</Table.HeadCell>
        <Table.HeadCell>Các thao tác</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {courseApiResponse?.courses &&
          courseApiResponse.courses.map((data) => (
            <CourseRow
              data={data}
              key={data._id}
              handleRefetch={handleRefetch}
              index={startIndex++}
            />
          ))}
      </Table.Body>
    </Table>
  );
};

const CourseRow: React.FC<{
  data: CourseAPIData | undefined;
  handleRefetch: () => void;
  index: number;
}> = ({ data, handleRefetch, index }) => {
  return (
    <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {index}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400 ">
        <div className="text-base font-semibold text-gray-900 w-96 max-w-md truncate ">
          {data?.title}
        </div>
      </Table.Cell>
      <Table.Cell className=" whitespace-nowrap p-4 text-base font-medium text-gray-900 max-w-sm">
        <img src={data?.image} />
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.price.toLocaleString('en-US', { style: 'currency', currency: 'VND', })}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.discount.toFixed(1)}
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 ">
        {data?.creator.first_name} {data?.creator.last_name}
      </Table.Cell>
      <Table.Cell className="space-x-2 whitespace-nowrap p-4">
        <div className="flex items-center gap-x-3">
          <EditCourseModal
            courseId={data?._id}
            handleRefetch={handleRefetch}
          />
          <DeleteCourseModal courseId={data?._id} handleRefetch={handleRefetch} />
        </div>
      </Table.Cell>
    </Table.Row>
  );
};


const Pagination: React.FC<PaginationComponentProps> = ({
  courseApiResponse,
  currentSearched,
  setCourseApiResponse,
}) => {
  const currentPage = parseInt(new URLSearchParams(window.location.search).get("page") || "1");
  const NextPageHandle = async () => {
    try {
      if (!courseApiResponse) return;

      const response = await apiClient.get<CourseApiResponse | undefined>(
        `/course?keyword=${currentSearched}&page=${currentPage + 1}`
      );
      setCourseApiResponse(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Có lỗi xảy ra !");
    }
  };

  const PreviousPageHandle = async () => {
    try {
      if (!courseApiResponse) return;
      const response = await apiClient.get(
        `/course?keyword=${currentSearched}&page=${currentPage - 1}`
      );
      setCourseApiResponse(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Có lỗi xảy ra !");
    }
  };

  return (
    <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4  sm:flex sm:justify-between">
      <button
        disabled={currentPage == 1}
        onClick={PreviousPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${currentPage > 1
          ? "cursor-pointer hover:bg-gray-100 hover:text-gray-900"
          : "cursor-default disabled"
          } `}
      >
        <HiChevronLeft className="text-2xl" />
        <span>Trang trước </span>
      </button>

      <div>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Trang&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {currentPage}
          </span>
          &nbsp;trên&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {courseApiResponse?.countPage}
          </span>
        </span>
      </div>

      <button
        disabled={currentPage == courseApiResponse?.countPage}
        onClick={NextPageHandle}
        className={`inline-flex  justify-center rounded p-1 text-gray-500 ${courseApiResponse?.countPage
          && courseApiResponse.countPage > currentPage
          ? "cursor-pointer hover:bg-gray-100 hover:text-gray-900"
          : "cursor-default"
          } `}
      >
        <span>Trang sau</span>
        <HiChevronRight className="text-2xl" />
      </button>
    </div>
  );
};
