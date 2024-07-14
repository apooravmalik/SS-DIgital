import PropTypes from "prop-types";
import { Fade } from "react-awesome-reveal";
import { FaExchangeAlt, FaUsers, FaMoneyBillWave } from "react-icons/fa";

const FeaturesSection = () => (
  <section className="py-16 bg-blue-50" id="features">
    <div className="container mx-auto px-4">
      <Fade direction="up" triggerOnce>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Our Features
        </h2>
      </Fade>
      <div className="flex flex-col md:flex-row justify-around space-y-8 md:space-y-0">
        <Fade direction="up" triggerOnce cascade damping={0.3}>
          <FeatureItem
            title="Hassle-free transactions"
            icon={<FaExchangeAlt className="w-8 h-8" />}
          />
          <FeatureItem
            title="Customer priority"
            icon={<FaUsers className="w-8 h-8" />}
          />
          <FeatureItem
            title="Affordable charges"
            icon={<FaMoneyBillWave className="w-8 h-8" />}
          />
        </Fade>
      </div>
    </div>
  </section>
);

const FeatureItem = ({ title, icon }) => (
  <div className="text-center">
    <div className="bg-blue-500 text-white rounded-full p-4 inline-block mb-4">
      {icon}
    </div>
    <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
  </div>
);

FeatureItem.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

export default FeaturesSection;