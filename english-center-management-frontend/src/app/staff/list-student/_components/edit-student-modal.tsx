'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  BookOpen,
  Users,
  MapPin,
  Save,
} from 'lucide-react';
import { StudentResponse, StudentUpdate } from '../../../../types/staff';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStudent: (
    studentId: string,
    studentData: StudentUpdate
  ) => Promise<void> | void;
  student: StudentResponse | null;
}

const levels = [
  { value: 'beginner', label: 'Sơ cấp' },
  { value: 'elementary', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'advanced', label: 'Nâng cao' },
];

const relationships = [
  { value: 'Father', label: 'Cha' },
  { value: 'Mother', label: 'Mẹ' },
  { value: 'Sibling', label: 'Anh/Chị/Em' },
  { value: 'Spouse', label: 'Vợ/Chồng' },
  { value: 'Friend', label: 'Bạn bè' },
  { value: 'Other', label: 'Khác' },
];

export default function EditStudentModal({
  isOpen,
  onClose,
  onUpdateStudent,
  student,
}: EditStudentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<StudentUpdate>({
    name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    input_level: 'beginner',
    bio: '',
    parent_name: '',
    parent_phone: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<
    Partial<
      Record<
        keyof StudentUpdate | 'emergencyContactName' | 'emergencyContactPhone',
        string
      >
    >
  >({});

  // Populate form data when student prop changes
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone_number: student.phone_number || '',
        date_of_birth: student.date_of_birth || '',
        input_level: student.input_level || 'beginner',
        bio: student.bio || '',
        parent_name: student.parent_name || '',
        parent_phone: student.parent_phone || '',
        status: student.status || 'active',
      });
      setErrors({});
    }
  }, [student]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Họ tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Số điện thoại là bắt buộc';
    } else if (
      !/^[0-9]{10,11}$/.test(formData.phone_number.replace(/\s/g, ''))
    ) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Ngày sinh là bắt buộc';
    }

    if (!formData.parent_name.trim()) {
      newErrors.parent_name = 'Tên người liên hệ khẩn cấp là bắt buộc';
    }

    if (!formData.parent_phone.trim()) {
      newErrors.parent_phone =
        'Số điện thoại người liên hệ khẩn cấp là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!student) return;

    if (validateForm()) {
      setIsLoading(true);
      try {
        await onUpdateStudent(student.id, formData);
        handleClose();
      } catch (error) {
        console.error('Error updating student:', error);
        // You could show an error message here
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof StudentUpdate, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Chỉnh sửa thông tin học viên
          </h2>
          <button
            onClick={handleClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Personal Information */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <User className='w-5 h-5 text-teal-600' />
              Thông tin cá nhân
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Họ và tên <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Nhập họ và tên'
                />
                {errors.name && (
                  <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Ngày sinh <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    handleInputChange('date_of_birth', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date_of_birth && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.date_of_birth}
                  </p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <Mail className='w-4 h-4' />
                  Email <span className='text-red-500'>*</span>
                </label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='example@email.com'
                />
                {errors.email && (
                  <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <Phone className='w-4 h-4' />
                  Số điện thoại <span className='text-red-500'>*</span>
                </label>
                <input
                  type='tel'
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange('phone_number', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.phone_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='0123456789'
                />
                {errors.phone_number && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.phone_number}
                  </p>
                )}
              </div>

              <div className='md:col-span-2'>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <MapPin className='w-4 h-4' />
                  Địa chỉ
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                  rows={2}
                  placeholder='Nhập địa chỉ'
                />
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <BookOpen className='w-4 h-4' />
                  Trình độ
                </label>
                <select
                  value={formData.input_level}
                  onChange={(e) =>
                    handleInputChange('input_level', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                >
                  {levels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <Users className='w-5 h-5 text-teal-600' />
              Thông tin liên hệ khẩn cấp
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Họ tên <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.parent_name}
                  onChange={(e) =>
                    handleInputChange('parent_name', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.parent_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Tên người liên hệ'
                />
                {errors.parent_name && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.parent_name}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Số điện thoại <span className='text-red-500'>*</span>
                </label>
                <input
                  type='tel'
                  value={formData.parent_phone}
                  onChange={(e) =>
                    handleInputChange('parent_phone', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.parent_phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='0123456789'
                />
                {errors.parent_phone && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.parent_phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex items-center justify-end space-x-3 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Save className='w-4 h-4' />
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật học viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
