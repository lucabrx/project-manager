'use client';

import { MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '@iconify/react/dist/iconify.js';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  canClose?: boolean;
}

export function Modal({ canClose = true, onClose, children }: ModalProps) {
  const handleClickOutside = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && canClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={handleClickOutside}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="bg-card w-full max-w-xl rounded-md p-6 shadow-xl backdrop-blur-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {canClose && (
            <button onClick={onClose} className="absolute top-4 right-4">
              <Icon icon="majesticons:close-line" className="size-6" />
            </button>
          )}

          <div className="">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
