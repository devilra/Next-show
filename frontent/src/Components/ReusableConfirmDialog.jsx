import { AnimatePresence, motion } from "framer-motion";

const ReusableConfirmDialog = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "orange",
  loading = false,
  disableOutsideClose = false,
  onClose,
  onConfirm,
}) => {
  // ======================================================
  // ✅ OUTSIDE CLICK
  // ======================================================

  const handleBackdropClick = () => {
    if (disableOutsideClose || loading) return;

    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ====================================================== */}
          {/* ✅ BACKDROP */}
          {/* ====================================================== */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="
              fixed inset-0

              z-[999999]

              bg-black/60

              backdrop-blur-md

              flex items-center justify-center

              px-4
            "
          >
            {/* ====================================================== */}
            {/* ✅ DIALOG */}
            {/* ====================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
              }}
              onClick={(e) => e.stopPropagation()}
              className="
                relative

                w-full
                max-w-[420px]

                overflow-hidden

                rounded-3xl

                border border-white/10

                bg-gradient-to-br
                from-zinc-900/95
                via-neutral-900/92
                to-slate-950/95

                p-6

                shadow-[0_20px_80px_rgba(0,0,0,0.6)]
              "
            >
              {/* TOP LIGHT */}

              <div
                className="
                  absolute
                  top-0 left-1/2
                  -translate-x-1/2

                  w-[60%]
                  h-px

                  bg-gradient-to-r
                  from-transparent
                  via-white/20
                  to-transparent
                "
              />

              {/* ====================================================== */}
              {/* ✅ CONTENT */}
              {/* ====================================================== */}

              <div className="relative z-10">
                {/* TITLE */}

                <h2
                  className="
                    text-white

                    text-[22px]

                    font-semibold

                    tracking-tight
                  "
                >
                  {title}
                </h2>

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-3

                    text-[14px]

                    leading-relaxed

                    text-white/50
                  "
                >
                  {description}
                </p>

                {/* ====================================================== */}
                {/* ✅ ACTIONS */}
                {/* ====================================================== */}

                <div className="mt-7 flex items-center justify-end gap-3">
                  {/* CANCEL */}

                  <button
                    disabled={loading}
                    onClick={onClose}
                    className="
                      h-[46px]
                      text-[14px]
                      px-5

                      rounded-2xl

                      border border-white/10

                      bg-white/[0.03]

                      text-white/70

                      hover:bg-white/[0.06]
                      hover:text-white

                      transition-all duration-300
                    "
                  >
                    {cancelText}
                  </button>

                  {/* CONFIRM */}

                  <button
                    disabled={loading}
                    onClick={onConfirm}
                    className={`
                      h-[46px]

                      min-w-[120px]

                      px-5
                      text-[14px]
                      rounded-2xl

                      text-white

                      font-medium

                      transition-all duration-300

                      ${
                        confirmColor === "red"
                          ? `
                            bg-red-500
                            hover:bg-red-600
                            shadow-[0_0_20px_rgba(239,68,68,0.35)]
                          `
                          : `
                            bg-orange-500
                            hover:bg-orange-600
                            shadow-[0_0_20px_rgba(249,115,22,0.35)]
                          `
                      }
                    `}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="
                            w-4 h-4

                            rounded-full

                            border-2 border-white/20
                            border-t-white

                            animate-spin
                          "
                        />

                        <span>Processing</span>
                      </div>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReusableConfirmDialog;
