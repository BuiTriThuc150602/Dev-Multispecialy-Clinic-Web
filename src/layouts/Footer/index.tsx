import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdLocationPin } from "react-icons/md";

export const Footer = () => {
  const Contact = (props: {
    title: string;
    value: string;
    icon: JSX.Element;
  }) => (
    <div className="flex items-center my-1">
      <div className="bg-slate-50 flex items-center justify-center rounded-full size-7 mr-1">
        {props.icon}
      </div>
      <p className="text-white font-medium ml-2">{props.value}</p>
    </div>
  );
  return (
    <div className="flex flex-col items-center md:grid md:grid-cols-2 bg-gradient-to-r from-primary-200 to-primary-500 mt-10">
      <div className="col-start-2 flex flex-col md:flex-row-reverse justify-center md:justify-evenly">
        <Contact
          title="Hotline"
          value="1900 1234"
          icon={<FaPhoneAlt className="text-blue1" />}
        />
        <Contact
          title="Email"
          value="dmc@dmc.clinic.com"
          icon={<MdEmail className="text-blue1" />}
        />
        <Contact
          title="Địa chỉ"
          value="12 Lê Đức Thọ, Gò Vấp, TP.HCM"
          icon={<MdLocationPin className="text-blue1" />}
        />
      </div>
    </div>
  );
};
