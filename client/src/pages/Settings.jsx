import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaLock, FaBell, FaPalette, FaLanguage } from 'react-icons/fa';
import { toast } from 'sonner';
import ChangePasswordModal from '../components/ChangePasswordModal';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('light');

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
    toast.success(`Theme changed to ${theme}`);
  };

  const settingsSections = [
    {
      title: 'Profile Settings',
      icon: <FaUser className="w-5 h-5" />,
      items: [
        { 
          label: 'Edit Profile', 
          description: 'Update your personal information',
          onClick: () => toast.info('Profile editing coming soon!')
        },
        { 
          label: 'Account Security', 
          description: 'Manage your account security settings',
          onClick: () => toast.info('Account security settings coming soon!')
        }
      ]
    },
    {
      title: 'Security',
      icon: <FaLock className="w-5 h-5" />,
      items: [
        { 
          label: 'Change Password', 
          description: 'Update your password',
          onClick: () => setIsPasswordModalOpen(true)
        },
        { 
          label: 'Two-Factor Authentication', 
          description: 'Add an extra layer of security',
          onClick: () => toast.info('Two-factor authentication coming soon!')
        }
      ]
    },
    {
      title: 'Notifications',
      icon: <FaBell className="w-5 h-5" />,
      items: [
        { 
          label: 'Email Notifications', 
          description: 'Manage your email notification preferences',
          onClick: () => toast.info('Email notification settings coming soon!')
        },
        { 
          label: 'Push Notifications', 
          description: 'Configure push notification settings',
          onClick: () => toast.info('Push notification settings coming soon!')
        }
      ]
    },
    {
      title: 'Appearance',
      icon: <FaPalette className="w-5 h-5" />,
      items: [
        { 
          label: 'Theme', 
          description: 'Choose between light and dark mode',
          onClick: () => handleThemeChange(selectedTheme === 'light' ? 'dark' : 'light')
        },
        { 
          label: 'Layout', 
          description: 'Customize your dashboard layout',
          onClick: () => toast.info('Layout customization coming soon!')
        }
      ]
    },
    {
      title: 'Language',
      icon: <FaLanguage className="w-5 h-5" />,
      items: [
        { 
          label: 'Interface Language', 
          description: 'Select your preferred language',
          onClick: () => toast.info('Language selection coming soon!')
        },
        { 
          label: 'Date & Time Format', 
          description: 'Customize date and time display',
          onClick: () => toast.info('Date and time format settings coming soon!')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {settingsSections.map((section, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    {section.icon}
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      onClick={item.onClick}
                      className="p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                    >
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User Info */}
        <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {user?.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {user?.role} • {user?.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default Settings; 