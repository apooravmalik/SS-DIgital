import ContactUsImg from "../assets/contact-us.svg";
import { Fade } from "react-awesome-reveal";

const CTASection = () => (
  <section id="contact" className="bg-blue-600 text-white py-8 sm:py-12 md:py-16 px-4">
    <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
      <Fade direction="left" triggerOnce className="w-full lg:w-1/2">
        <div className="text-left mb-8 lg:mb-0 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Ready to get started?</h2>
          <p className="text-base sm:text-lg lg:text-xl">Contact us now for personalized fintech solutions</p>
          <div className="space-y-2 sm:space-y-3 mt-6 sm:mt-8">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold">Sachin Sharma</div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">9891910800</div>
          </div>
        </div>
      </Fade>
      <Fade direction="right" triggerOnce className="hidden lg:block lg:w-1/2">
        <div className="flex justify-center">
          <img src={ContactUsImg} alt="Contact Us" className="w-full max-w-md lg:max-w-lg h-auto rounded-lg" />
        </div>
      </Fade>
    </div>
  </section>
);

export default CTASection;