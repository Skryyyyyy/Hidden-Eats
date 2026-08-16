'use client';

import React, {
  createContext,
  useContext,
  useState,
  useId,
  useEffect,
  useRef,
} from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { X } from 'lucide-react';

interface DialogContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a Dialog');
  }
  return context;
};

interface DialogProps {
  children: React.ReactNode;
  transition?: Transition;
}

export function Dialog({ children }: DialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <DialogContext.Provider
      value={{ isOpen, setIsOpen, uniqueId, triggerRef }}
    >
      {children}
    </DialogContext.Provider>
  );
}

interface DialogTriggerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function DialogTrigger({
  children,
  className = '',
  style,
}: DialogTriggerProps) {
  const { setIsOpen, uniqueId, triggerRef } = useDialog();

  return (
    <motion.button
      ref={triggerRef}
      layoutId={`dialog-container-${uniqueId}`}
      onClick={() => setIsOpen(true)}
      style={style}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.button>
  );
}

interface DialogContainerProps {
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

export function DialogContainer({
  children,
  className = '',
  overlayClassName = '',
}: DialogContainerProps) {
  const { isOpen, setIsOpen } = useDialog();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className={`fixed inset-0 bg-black/70 backdrop-blur-md ${overlayClassName}`}
          />
          {children}
        </div>
      )}
    </AnimatePresence>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function DialogContent({
  children,
  className = '',
  style,
}: DialogContentProps) {
  const { uniqueId } = useDialog();

  return (
    <motion.div
      layoutId={`dialog-container-${uniqueId}`}
      style={style}
      className={`relative z-50 overflow-hidden shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface DialogImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export function DialogImage({ src, alt = '', className = '' }: DialogImageProps) {
  const { uniqueId } = useDialog();

  return (
    <motion.img
      layoutId={`dialog-img-${uniqueId}`}
      src={src}
      alt={alt}
      className={className}
    />
  );
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  const { uniqueId } = useDialog();

  return (
    <motion.h3 layoutId={`dialog-title-${uniqueId}`} className={className}>
      {children}
    </motion.h3>
  );
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  disableLayoutAnimation?: boolean;
  variants?: {
    initial?: any;
    animate?: any;
    exit?: any;
  };
}

export function DialogDescription({
  children,
  variants,
}: DialogDescriptionProps) {
  return (
    <motion.div
      initial={variants?.initial || { opacity: 0, y: 10 }}
      animate={variants?.animate || { opacity: 1, y: 0 }}
      exit={variants?.exit || { opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

interface DialogCloseProps {
  className?: string;
}

export function DialogClose({ className = '' }: DialogCloseProps) {
  const { setIsOpen } = useDialog();

  return (
    <button
      onClick={() => setIsOpen(false)}
      className={`absolute top-4 right-4 z-50 flex items-center justify-center transition-colors ${className}`}
      aria-label="Close dialog"
    >
      <X className="w-5 h-5 text-white" />
    </button>
  );
}
