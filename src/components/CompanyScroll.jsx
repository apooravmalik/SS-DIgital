import { Fade } from "react-awesome-reveal";
import Npay from "../assets/npay_logo.png";
import QuickNPay from "../assets/Quick_n_pay_logo.png";
import SmartBazaar from "../assets/sb_logo.png";
import SoulPay from "../assets/Soul_pay_logo.png";
import Way2Pay from "../assets/Way_2_Pay_logo.png";

const CompanyScroll = () => (
  <Fade triggerOnce>
    <div className="py-5 sm:py-10">
      <div className="overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_10%,_black_90%,transparent_100%)]">
        <div className="flex space-x-4 sm:space-x-8 animate-loop-scroll group-hover:paused">
          {[Npay, QuickNPay, SoulPay, Way2Pay, SmartBazaar].map((logo, index) => (
            <img key={index} src={logo} alt={`Company ${index + 1}`} className="h-8 sm:h-12 object-contain" />
          ))}
          {[Npay, QuickNPay, SoulPay, Way2Pay, SmartBazaar].map((logo, index) => (
            <img key={index + 5} src={logo} alt={`Company ${index + 1}`} className="h-8 sm:h-12 object-contain" />
          ))}
        </div>
      </div>
    </div>
  </Fade>
);

export default CompanyScroll;