import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useChangePasswordMutation } from '../redux/slices/api/userApiSlice';
import { Textbox, Button, Loading } from './';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const res = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }).unwrap();

      toast.success("Password changed successfully");
      reset();
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mx-auto max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
            <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
              <FaLock className="text-lg" />
              Change Password
            </Dialog.Title>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </span>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      placeholder="Enter current password"
                      {...register("currentPassword", {
                        required: "Current password is required"
                      })}
                      className="w-full bg-transparent px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                        placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white 
                        outline-none text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        transition-all duration-200 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 
                        dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.currentPassword.message}
                    </motion.p>
                  )}
                </div>

                <div className="relative">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </span>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Enter new password"
                      {...register("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })}
                      className="w-full bg-transparent px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                        placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white 
                        outline-none text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        transition-all duration-200 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 
                        dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.newPassword.message}
                    </motion.p>
                  )}
                </div>

                <div className="relative">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </span>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password"
                      })}
                      className="w-full bg-transparent px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                        placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white 
                        outline-none text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        transition-all duration-200 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 
                        dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                    hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 
                    hover:from-blue-600 hover:to-blue-700 text-white font-medium 
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
                    disabled:hover:scale-100 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {isLoading ? (
                    <>
                      <Loading />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ChangePasswordModal; 