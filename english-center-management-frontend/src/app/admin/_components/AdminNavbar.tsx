'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
  Bell,
  Search,
  Home,
  ArrowRight,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { usePersonalInfo } from '../../../components/PersonalInfoContext';
import { useUserInfo } from '../../../components/UserInfoContext';

interface AdminNavbarProps {
  onToggleSidebar?: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar }) => {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { openModal } = usePersonalInfo();
  const { userInfo, loading } = useUserInfo();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    if (paths.length === 1 && paths[0] === 'admin') {
      return [
        {
          name: 'Tổng quan',
          href: '/admin',
          icon: <Home className='w-4 h-4' />,
        },
      ];
    }

    breadcrumbs.push({
      name: 'Tổng quan',
      href: '/admin',
      icon: <Home className='w-4 h-4' />,
    });

    if (paths.length > 1) {
      const pageName = paths[1];
      const pageNames: { [key: string]: string } = {
        student: 'Học viên',
        teacher: 'Giáo viên',
        course: 'Khóa học',
        classroom: 'Lớp học',
        category: 'Danh mục',
        role: 'Vai trò & Quyền',
      };

      breadcrumbs.push({
        name:
          pageNames[pageName] ||
          pageName.charAt(0).toUpperCase() + pageName.slice(1),
        href: `/admin/${pageName}`,
        icon: null,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const notifications = [
    {
      id: 1,
      title: 'Học viên mới đăng ký',
      message: 'John Doe đã đăng ký khóa tiếng Anh trung cấp',
      time: '2 phút trước',
      unread: true,
      type: 'enrollment',
    },
    {
      id: 2,
      title: 'Cập nhật lịch học',
      message: 'Lớp Writing nâng cao thay đổi giờ học thành 2:00 PM',
      time: '1 giờ trước',
      unread: true,
      type: 'schedule',
    },
    {
      id: 3,
      title: 'Thanh toán nhận được',
      message: 'Học phí hàng tháng từ Sarah Wilson',
      time: '3 giờ trước',
      unread: false,
      type: 'payment',
    },
    {
      id: 4,
      title: 'Báo cáo tháng mới',
      message: 'Báo cáo thống kê tháng 12 đã sẵn sàng',
      time: '1 ngày trước',
      unread: false,
      type: 'report',
    },
  ];

  // Get user display info
  const getUserDisplayInfo = () => {
    if (loading) {
      return {
        name: 'Đang tải...',
        email: '',
        role: 'Quản trị viên',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      };
    }

    if (!userInfo) {
      return {
        name: 'Quản trị viên',
        email: '',
        role: 'Quản trị viên',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      };
    }

    return {
      name: userInfo.name || 'Quản trị viên',
      email: userInfo.email || '',
      role:
        userInfo.role_name === 'admin' ? 'Quản trị viên' : userInfo.role_name,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    };
  };

  const userDisplay = getUserDisplayInfo();
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className='h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-20 shadow-sm'>
      <div className='h-full flex items-center justify-between px-6'>
        {/* Left side - Breadcrumbs */}
        <div className='flex items-center gap-4'>
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <Menu className='w-5 h-5 text-gray-600' />
          </button>

          {/* Breadcrumbs */}
          <nav className='flex items-center space-x-2 text-sm'>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className='flex items-center'>
                {index > 0 && (
                  <ArrowRight className='w-4 h-4 text-gray-400 mx-2' />
                )}
                <div className='flex items-center gap-2'>
                  {crumb.icon && (
                    <span className='text-gray-400'>{crumb.icon}</span>
                  )}
                  <span
                    className={`
                      ${
                        index === breadcrumbs.length - 1
                          ? 'text-gray-900 font-semibold'
                          : 'text-gray-500 hover:text-gray-700 cursor-pointer transition-colors'
                      }
                    `}
                  >
                    {crumb.name}
                  </span>
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Right side - Search, Notifications, Profile */}
        <div className='flex items-center gap-4'>
          {/* Search */}
          <div className='relative hidden md:block'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search className='h-4 w-4 text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Tìm kiếm...'
              className='block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          {/* Notifications */}
          <div className='relative'>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className='relative p-2 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <Bell className='w-5 h-5 text-gray-600' />
              {unreadCount > 0 && (
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold'>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className='absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50'>
                <div className='p-4 border-b border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Thông báo
                    </h3>
                    <button className='text-blue-600 text-sm font-medium hover:text-blue-700'>
                      Đánh dấu đã đọc
                    </button>
                  </div>
                </div>
                <div className='max-h-96 overflow-y-auto'>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className='flex items-start gap-3'>
                        <div className='w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0'></div>
                        <div className='flex-1'>
                          <p className='font-medium text-gray-900'>
                            {notification.title}
                          </p>
                          <p className='text-sm text-gray-600 mt-1'>
                            {notification.message}
                          </p>
                          <p className='text-xs text-gray-400 mt-2'>
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className='w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2'></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className='p-4 border-t border-gray-200'>
                  <button className='w-full text-center text-blue-600 text-sm font-medium hover:text-blue-700'>
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className='relative'>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <div className='relative'>
                <img
                  src={userDisplay.avatar}
                  alt='Admin'
                  className='w-8 h-8 rounded-full object-cover ring-2 ring-gray-100'
                />
                <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
              </div>
              <div className='hidden md:block text-left'>
                <p className='text-sm font-semibold text-gray-900'>
                  {userDisplay.name}
                </p>
                <p className='text-xs text-gray-500'>{userDisplay.role}</p>
              </div>
              <ChevronDown className='w-4 h-4 text-gray-500' />
            </button>

            {/* User menu dropdown */}
            {showUserMenu && (
              <div className='absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50'>
                <div className='p-4 border-b border-gray-200'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={userDisplay.avatar}
                      alt='Admin'
                      className='w-12 h-12 rounded-full object-cover ring-2 ring-gray-100'
                    />
                    <div>
                      <p className='text-sm font-semibold text-gray-900'>
                        {userDisplay.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {userDisplay.email}
                      </p>
                      <p className='text-xs text-blue-600 font-medium mt-1'>
                        {userDisplay.role}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='py-2'>
                  <button
                    onClick={() => {
                      openModal('admin');
                      setShowUserMenu(false);
                    }}
                    className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    <User className='w-4 h-4' />
                    Hồ sơ cá nhân
                  </button>
                  <button className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors'>
                    <Settings className='w-4 h-4' />
                    Cài đặt hệ thống
                  </button>
                  <hr className='my-2 border-gray-200' />
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/auth/login' });
                      setShowUserMenu(false);
                    }}
                    className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors'
                  >
                    <LogOut className='w-4 h-4' />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
