import { Button, Menu, MenuProps } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "@/assets/img/logoDMC3.png";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { userValue } from "@/stores/user";
import { FaRegUserCircle } from "react-icons/fa";
import { IoLogOutOutline, IoMenu } from "react-icons/io5";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { SlCalender } from "react-icons/sl";
import { LuPenLine } from "react-icons/lu";
import { useMediaQuery } from "react-responsive";
import { HiOutlineClipboardList } from "react-icons/hi";
import { isScreenAuthenValue } from "@/components/Authentication/stores";

type MenuItem = Required<MenuProps>["items"][number];

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useRecoilValue(userValue);
  const isScreenAuth = location.pathname.includes("/auth");
  const { setAccessToken } = useAuthContext();
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const clearIsScreenAuth = useResetRecoilState(isScreenAuthenValue);

  const handleLogout = () => {
    setAccessToken(null);
    navigate("/");
    toast.success("Đăng xuất thành công");
  };

  const menuClass = "flex items-center gap-2 px-3 w-full cursor-pointer";

  const items: MenuItem[] = [
    {
      label: (
        <div className="flex items-center">
          <IoMenu className="text-3xl text-primary-500" />
        </div>
      ),
      key: "subMenu",
      children: [
        {
          key: "appoinemt",
          label: (
            <div className={menuClass} onClick={() => navigate("/booking")}>
              <SlCalender className="text-xl" />
              <span className="">Đặt lịch hẹn</span>
            </div>
          ),
        },
        {
          key: "record",
          label: (
            <div
              className={menuClass}
              onClick={() => navigate("/patient-record")}
            >
              <FaRegUserCircle className="text-2xl" />
              <span className="">Tra cứu hồ sơ bệnh án</span>
            </div>
          ),
        },
        {
          key: "appoinemts",
          label: (
            <div
              className={menuClass}
              onClick={() => navigate("/appointments")}
            >
              <HiOutlineClipboardList className="text-xl" />
              <span className="">Tra cứu lịch hẹn</span>
            </div>
          ),
        },
        {
          key: "info",
          label: (
            <div className={menuClass} onClick={() => navigate("patient-info")}>
              <LuPenLine className="text-2xl" />
              <span className="">Chỉnh sửa thông tin</span>
            </div>
          ),
        },
        {
          key: "logout",
          label: (
            <div className={menuClass} onClick={handleLogout}>
              <IoLogOutOutline className="text-2xl" />
              <span className="">Đăng xuất</span>
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <div className="bg-white fixed top-0 left-0 z-50 w-full">
      <div className="w-full flex items-center justify-between pl-12 md:pl-20 pr-8 md:pr-10 space-x-4 ">
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="logo"
            className="size-20 md:size-24 object-cover mx-3"
          />
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <Menu
              selectedKeys={["subMenu"]}
              mode={isDesktop ? "horizontal" : "vertical"}
              items={items}
              className=""
            />
          ) : (
            <>
              {!isScreenAuth && (
                <Button
                  type="primary"
                  className="px-6 py-[10px] rounded-2xl"
                  onClick={() => {
                    clearIsScreenAuth();
                    navigate("/auth");
                  }}
                >
                  Đăng nhập / Đăng ký
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
