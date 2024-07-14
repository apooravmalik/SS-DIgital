import HeroImg from "../assets/hero-img.svg";
import Typewriter from 'typewriter-effect';
import { Fade } from 'react-awesome-reveal';

const HeroSection = () => (
  <section className="p-6 md:p-10 bg-blue-50">
    <div className="container mx-auto flex flex-col md:flex-row items-center">
      <div className="w-full md:w-1/2 mb-8 md:mb-0">
        <Fade triggerOnce>
          <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-relaxed">
            Reliable{' '}
            <span className="block mb-2 text-blue-600 underline underline-offset-8 decoration-blue-500">
              <Typewriter
                options={{
                  strings: ['fintech solutions', 'digital banking', 'payment systems'],
                  autoStart: true,
                  loop: true,
                  cursor: '',
                  delay: 50,
                  deleteSpeed: 50
                }}
              />
            </span>{' '}
            <span className="block mt-4">for a brighter tomorrow</span>
          </h1>
        </Fade>
        <Fade triggerOnce>
          <p className="text-2xl mt-8 mb-10">
            We at SS digital, believe in making our clients satisfied. Our innovative fintech solutions are designed to streamline your financial processes and drive growth.
          </p>
        </Fade>
        <Fade triggerOnce>
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500 transition duration-300">Contact us</button>
            <button className="w-full md:w-auto bg-white text-blue-600 px-6 py-2 rounded border border-blue-600 hover:bg-blue-50 transition duration-300 mt-4 md:mt-0">Check us out</button>
          </div>
        </Fade>
      </div>
      <div className="w-full md:w-1/2">
        <Fade triggerOnce>
        <img
          src={HeroImg}
          alt="Hero Image"
          className="w-full h-auto rounded-lg"></img>
        </Fade>
      </div>
    </div>
  </section>
);

export default HeroSection;
