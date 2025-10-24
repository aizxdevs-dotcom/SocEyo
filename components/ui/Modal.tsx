"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const sizeClasses =
    size === "sm"
      ? "max-w-sm"
      : size === "lg"
      ? "max-w-3xl"
      : "max-w-lg";

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Enhanced Backdrop with blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90 -translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-90 -translate-y-4"
            >
              <Dialog.Panel
                className={`w-full ${sizeClasses} transform rounded-2xl glass dark:glass-dark p-6 sm:p-8 shadow-glow-lg transition-all border border-primary-200/30 dark:border-primary-800/30`}
              >
                {title && (
                  <Dialog.Title className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 pb-4 border-b border-primary-200/50 dark:border-primary-800/50 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full" />
                    {title}
                  </Dialog.Title>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}