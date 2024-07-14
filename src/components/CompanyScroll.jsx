import { Fade } from "react-awesome-reveal";
import Npay from "../assets/npay_logo.png";
import QuickNPay from "../assets/Quick_n_pay_logo.png";
import SmartBazaar from "../assets/sb_logo.png";
import SoulPay from "../assets/Soul_pay_logo.png";
import Way2Pay from "../assets/Way_2_Pay_logo.png";

const CompanyScroll = () => (
  <Fade triggerOnce>
    <div className="py-10">
      <div className="flex overflow-hidden space-x-16 group [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
        <div className="flex space-x-16 animate-loop-scroll group-hover:paused">
          <img src={Npay} alt="Company 1" className="h-12" />
          <img src={QuickNPay} alt="Company 2" className="h-12" />
          <img src={SoulPay} alt="Company 2" className="h-12" />
          <img src={Way2Pay} alt="Company 2" className="h-12" />
          <img src={SmartBazaar} alt="Company 2" className="h-12" />
        </div>
        <div className="flex space-x-16 animate-loop-scroll group-hover:paused">
          <img src={Npay} alt="Company 1" className="h-12" />
          <img src={QuickNPay} alt="Company 2" className="h-12" />
          <img src={SoulPay} alt="Company 2" className="h-12" />
          <img src={Way2Pay} alt="Company 2" className="h-12" />
          <img src={SmartBazaar} alt="Company 2" className="h-12" />
        </div>
      </div>
    </div>
  </Fade>
);

export default CompanyScroll;
