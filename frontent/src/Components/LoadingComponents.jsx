import { motion } from "framer-motion";

const LoadingComponents = () => {
  const logoVariants = {
    hidden: {
      opacity: 0,
      scale: 0.7,
    },
    visible: {
      opacity: 1,
      scale: [0.9, 1.05, 1],
      transition: {
        duration: 1.4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Logo animation */}
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center"
      >
        <img
          src="/logo3.png"
          alt="Loading"
          className="w-28 md:w-36 drop-shadow-[0_0_25px_rgba(255,0,0,0.55)]"
        />

        {/* Optional loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="mt-6 text-sm md:text-base text-gray-300 tracking-widest uppercase"
        >
          Please wait...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingComponents;
