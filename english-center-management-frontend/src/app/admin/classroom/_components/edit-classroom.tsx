'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Calendar, Users, BookOpen } from 'lucide-react';
import { useCourseApi, useTeacherApi } from '../../_hooks';
import {
  CourseResponse,
  ClassroomUpdate,
  TeacherResponse,
} from '../../../../types/admin';

interface EditClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classroomData: any) => Promise<void>;
  classroom: any;
  loading?: boolean;
}

const EditClassroomModal: React.FC<EditClassroomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  classroom,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ClassroomUpdate>({
    class_name: '',
    course_id: '',
    teacher_id: '',
    start_date: '',
    end_date: '',
  });

  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { getCourses } = useCourseApi();
  const { getTeachers } = useTeacherApi();

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (classroom && isOpen) {
      setFormData({
        class_name: classroom.class_name || '',
        course_id: classroom.course_id || '',
        teacher_id: classroom.teacher_id || '',
        start_date: classroom.start_date
          ? classroom.start_date.split('T')[0]
          : '',
        end_date: classroom.end_date ? classroom.end_date.split('T')[0] : '',
      });
    }
  }, [classroom, isOpen]);

  const fetchData = async () => {
    try {
      const [coursesData, teachersData] = await Promise.all([
        getCourses(),
        getTeachers(),
      ]);
      setCourses(coursesData);
      setTeachers(teachersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.class_name.trim()) {
      newErrors.class_name = 'Tên lớp học là bắt buộc';
    }

    if (!formData.course_id) {
      newErrors.course_id = 'Vui lòng chọn khóa học';
    }

    if (!formData.teacher_id) {
      newErrors.teacher_id = 'Vui lòng chọn giáo viên';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Ngày bắt đầu là bắt buộc';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'Ngày kết thúc là bắt buộc';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (startDate >= endDate) {
        newErrors.end_date = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to update classroom:', error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !classroom) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>
              Chỉnh sửa lớp học
            </h2>
            <p className='text-sm text-gray-600 mt-1'>
              Cập nhật thông tin lớp học: {classroom.class_name}
            </p>
          </div>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Class Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Tên lớp học <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <BookOpen
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={16}
              />
              <input
                type='text'
                name='class_name'
                value={formData.class_name}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.class_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Nhập tên lớp học'
              />
            </div>
            {errors.class_name && (
              <p className='text-red-500 text-sm mt-1'>{errors.class_name}</p>
            )}
          </div>

          {/* Course and Teacher Selection */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Course Selection */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Khóa học <span className='text-red-500'>*</span>
              </label>
              <select
                name='course_id'
                value={formData.course_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.course_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value=''>Chọn khóa học</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_name} - {course.level}
                  </option>
                ))}
              </select>
              {errors.course_id && (
                <p className='text-red-500 text-sm mt-1'>{errors.course_id}</p>
              )}
            </div>

            {/* Teacher Selection */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Giáo viên phụ trách <span className='text-red-500'>*</span>
              </label>
              <select
                name='teacher_id'
                value={formData.teacher_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.teacher_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value=''>Chọn giáo viên</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.specialization}
                  </option>
                ))}
              </select>
              {errors.teacher_id && (
                <p className='text-red-500 text-sm mt-1'>{errors.teacher_id}</p>
              )}
            </div>
          </div>

          {/* Date Range */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Start Date */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Ngày bắt đầu <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <Calendar
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={16}
                />
                <input
                  type='date'
                  name='start_date'
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.start_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.start_date && (
                <p className='text-red-500 text-sm mt-1'>{errors.start_date}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Ngày kết thúc <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <Calendar
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={16}
                />
                <input
                  type='date'
                  name='end_date'
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.end_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.end_date && (
                <p className='text-red-500 text-sm mt-1'>{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Current Students Info */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <Users className='text-blue-600' size={16} />
              <span className='text-sm font-medium text-blue-800'>
                Thông tin học viên hiện tại
              </span>
            </div>
            <p className='text-sm text-blue-700'>
              Số học viên hiện tại:{' '}
              <span className='font-medium'>{classroom.current_students}</span>
              {classroom.max_students && (
                <span> / {classroom.max_students}</span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-end gap-3 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              disabled={loading}
              className='px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={loading}
              className='px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2'
            >
              {loading ? (
                <>
                  <Loader2 className='animate-spin' size={16} />
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật lớp học'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClassroomModal;
