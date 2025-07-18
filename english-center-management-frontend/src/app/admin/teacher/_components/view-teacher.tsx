'use client';

import React from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  BookOpen,
  Clock,
  FileText,
  Users,
  MapPin,
  Edit,
} from 'lucide-react';
import { TeacherResponse } from '../../../../types/admin';

interface ViewTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherResponse | null;
}

const specializations = [
  { value: 'general-english', label: 'Tiếng Anh tổng quát' },
  { value: 'business-english', label: 'Tiếng Anh thương mại' },
  { value: 'academic-english', label: 'Tiếng Anh học thuật' },
  { value: 'conversation', label: 'Tiếng Anh giao tiếp' },
  { value: 'ielts', label: 'IELTS' },
  { value: 'toeic', label: 'TOEIC' },
  { value: 'toefl', label: 'TOEFL' },
  { value: 'young-learners', label: 'Tiếng Anh trẻ em' },
  { value: 'grammar', label: 'Ngữ pháp' },
  { value: 'pronunciation', label: 'Phát âm' },
];

const qualifications = [
  { value: 'bachelor', label: 'Cử nhân' },
  { value: 'master', label: 'Thạc sĩ' },
  { value: 'phd', label: 'Tiến sĩ' },
  { value: 'tesol', label: 'TESOL' },
  { value: 'tefl', label: 'TEFL' },
  { value: 'celta', label: 'CELTA' },
  { value: 'delta', label: 'DELTA' },
  { value: 'other', label: 'Khác' },
];

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'on-leave':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Hoạt động';
    case 'inactive':
      return 'Không hoạt động';
    case 'on-leave':
      return 'Nghỉ phép';
    default:
      return status;
  }
};

const getSpecializationLabel = (value: string) => {
  const spec = specializations.find((s) => s.value === value);
  return spec ? spec.label : value;
};

const getQualificationLabel = (value: string) => {
  const qual = qualifications.find((q) => q.value === value);
  return qual ? qual.label : value;
};

export default function ViewTeacherModal({
  isOpen,
  onClose,
  teacher,
}: ViewTeacherModalProps) {
  if (!isOpen || !teacher) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
            <User className='w-6 h-6 text-teal-600' />
            Thông tin giáo viên
          </h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* Teacher Header */}
          <div className='flex items-start gap-6 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg'>
            <div className='flex-shrink-0'>
              <img
                className='h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg'
                src={
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                }
                alt={teacher.name}
              />
            </div>
            <div className='flex-1'>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                {teacher.name}
              </h3>
              <p className='text-lg text-gray-600 mb-3'>
                {getSpecializationLabel(teacher.specialization)}
              </p>
              <div className='flex items-center gap-4 text-sm text-gray-600'>
                <span className='flex items-center gap-1'>
                  <Mail className='w-4 h-4' />
                  {teacher.email}
                </span>
                {teacher.phone_number && (
                  <span className='flex items-center gap-1'>
                    <Phone className='w-4 h-4' />
                    {teacher.phone_number}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-white p-6 rounded-lg border border-gray-200'>
              <h4 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
                <User className='w-5 h-5 text-teal-600' />
                Thông tin cá nhân
              </h4>
              <div className='space-y-3'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Họ và tên
                  </label>
                  <p className='text-gray-900'>{teacher.name}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500 flex items-center gap-1'>
                    <Mail className='w-4 h-4' />
                    Email
                  </label>
                  <p className='text-gray-900'>{teacher.email}</p>
                </div>
                {teacher.phone_number && (
                  <div>
                    <label className='text-sm font-medium text-gray-500 flex items-center gap-1'>
                      <Phone className='w-4 h-4' />
                      Số điện thoại
                    </label>
                    <p className='text-gray-900'>{teacher.phone_number}</p>
                  </div>
                )}
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg border border-gray-200'>
              <h4 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
                <BookOpen className='w-5 h-5 text-teal-600' />
                Thông tin chuyên môn
              </h4>
              <div className='space-y-3'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Chuyên môn
                  </label>
                  <p className='text-gray-900'>
                    {getSpecializationLabel(teacher.specialization)}
                  </p>
                </div>
                {teacher.education && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Bằng cấp
                    </label>
                    <p className='text-gray-900'>
                      {getQualificationLabel(teacher.education)}
                    </p>
                  </div>
                )}
                {teacher.experience_years !== undefined && (
                  <div>
                    <label className='text-sm font-medium text-gray-500 flex items-center gap-1'>
                      <Clock className='w-4 h-4' />
                      Kinh nghiệm giảng dạy
                    </label>
                    <p className='text-gray-900'>
                      {teacher.experience_years === 0
                        ? 'Mới tốt nghiệp'
                        : teacher.experience_years === 10
                        ? '10+ năm'
                        : `${teacher.experience_years} năm`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className='bg-white p-6 rounded-lg border border-gray-200'>
            <h4 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <FileText className='w-5 h-5 text-teal-600' />
              Thông tin bổ sung
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Mã giáo viên
                </label>
                <p className='text-gray-900 font-mono'>{teacher.id}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Vai trò
                </label>
                <p className='text-gray-900 capitalize'>Giáo viên</p>
              </div>
            </div>
          </div>

          {/* Assigned Classes */}
          {teacher.taught_classes && teacher.taught_classes.length > 0 && (
            <div className='bg-white p-6 rounded-lg border border-gray-200'>
              <h4 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
                <Users className='w-5 h-5 text-teal-600' />
                Lớp được phân công
              </h4>
              <div className='flex flex-wrap gap-2'>
                {teacher.taught_classes.map((className, index) => (
                  <span
                    key={index}
                    className='inline-flex items-center gap-1 px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium'
                  >
                    <MapPin className='w-4 h-4' />
                    {className.class_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-blue-100 text-sm'>Tổng số lớp</p>
                  <p className='text-2xl font-bold'>
                    {teacher.taught_classes?.length || 0}
                  </p>
                </div>
                <Users className='w-8 h-8 text-blue-200' />
              </div>
            </div>
            <div className='bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-green-100 text-sm'>Kinh nghiệm</p>
                  <p className='text-2xl font-bold'>
                    {teacher.experience_years || 0} năm
                  </p>
                </div>
                <Clock className='w-8 h-8 text-green-200' />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between p-6 border-t border-gray-200'>
          <div className='text-sm text-gray-500'>
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </div>
          <div className='flex items-center gap-3'>
            <button className='px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2'>
              <Edit className='w-4 h-4' />
              Chỉnh sửa
            </button>
            <button
              onClick={onClose}
              className='px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors'
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
