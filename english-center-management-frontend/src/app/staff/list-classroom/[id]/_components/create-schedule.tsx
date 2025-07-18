'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Check } from 'lucide-react';
import { useStaffStatsApi } from '../../../_hooks';
import {
  ClassroomResponse,
  ScheduleResponse,
  ScheduleCreate,
  Weekday,
} from '../../../../../types/staff';

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: ClassroomResponse | null;
  onScheduleCreated?: (schedule: ScheduleResponse) => void;
}

const dayNames = {
  monday: 'Thứ 2',
  tuesday: 'Thứ 3',
  wednesday: 'Thứ 4',
  thursday: 'Thứ 5',
  friday: 'Thứ 6',
  saturday: 'Thứ 7',
  sunday: 'Chủ nhật',
};

const timeSlots = [
  { id: '1', startTime: '07:00', endTime: '08:30', label: '07:00 - 08:30' },
  { id: '2', startTime: '08:30', endTime: '10:00', label: '08:30 - 10:00' },
  { id: '3', startTime: '10:00', endTime: '11:30', label: '10:00 - 11:30' },
  { id: '4', startTime: '14:00', endTime: '15:30', label: '14:00 - 15:30' },
  { id: '5', startTime: '15:30', endTime: '17:00', label: '15:30 - 17:00' },
  { id: '6', startTime: '17:00', endTime: '18:30', label: '17:00 - 18:30' },
  { id: '7', startTime: '18:30', endTime: '20:00', label: '18:30 - 20:00' },
  { id: '8', startTime: '20:00', endTime: '21:30', label: '20:00 - 21:30' },
];

export default function CreateScheduleModal({
  isOpen,
  onClose,
  classroom,
  onScheduleCreated,
}: CreateScheduleModalProps) {
  const [formData, setFormData] = useState({
    day: 'monday',
    timeSlot: { startTime: '07:00', endTime: '08:30' },
    room: '',
    teacher: classroom?.teacher.name || '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.day &&
      formData.timeSlot &&
      formData.room &&
      formData.teacher
    ) {
      const newSchedule: ScheduleCreate = {
        class_id: classroom?.id,
        weekday: formData.day as Weekday,
        start_time: formData.timeSlot.startTime,
        end_time: formData.timeSlot.endTime,
      };

      onScheduleCreated?.(newSchedule as ScheduleResponse);
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset form data
    setFormData({
      day: 'monday',
      timeSlot: { startTime: '07:00', endTime: '08:30' },
      room: '',
      teacher: classroom?.teacher.name || '',
      notes: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              Tạo lịch học mới
            </h2>
            <p className='text-gray-600 mt-1'>
              Thêm buổi học mới cho lớp {classroom?.class_name}
            </p>
          </div>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Day Selection */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Calendar className='w-4 h-4 inline mr-2' />
                Ngày trong tuần
              </label>
              <select
                value={formData.day}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, day: e.target.value }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                required
              >
                {Object.entries(dayNames).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Clock className='w-4 h-4 inline mr-2' />
                Khung giờ
              </label>
              <select
                value={`${formData.timeSlot.startTime} - ${formData.timeSlot.endTime}`}
                onChange={(e) => {
                  const [startTime, endTime] = e.target.value.split(' - ');
                  setFormData((prev) => ({
                    ...prev,
                    timeSlot: { startTime, endTime },
                  }));
                }}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                required
              >
                {timeSlots.map((slot) => (
                  <option
                    key={slot.id}
                    value={`${slot.startTime} - ${slot.endTime}`}
                  >
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Room */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <MapPin className='w-4 h-4 inline mr-2' />
                Phòng học
              </label>
              <select
                value={formData.room}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, room: e.target.value }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                required
              >
                <option value=''>Chọn phòng học</option>
              </select>
            </div>

            {/* Teacher */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <User className='w-4 h-4 inline mr-2' />
                Giáo viên
              </label>
              <input
                type='text'
                value={formData.teacher}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, teacher: e.target.value }))
                }
                placeholder='Tên giáo viên'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className='mt-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Ghi chú
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder='Ghi chú về buổi học...'
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
            />
          </div>

          {/* Class Info Display */}
          <div className='mt-6 bg-gray-50 rounded-lg p-4'>
            <h4 className='font-medium text-gray-900 mb-3'>
              Thông tin lớp học
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-gray-600'>Tên lớp:</span>
                <span className='ml-2 font-medium text-gray-900'>
                  {classroom?.class_name}
                </span>
              </div>
              <div>
                <span className='text-gray-600'>Khóa học ID:</span>
                <span className='ml-2 font-medium text-gray-900'>
                  {classroom?.course_id || 'Chưa có'}
                </span>
              </div>
              <div>
                <span className='text-gray-600'>Trạng thái:</span>
                <span className='ml-2 font-medium text-gray-900'>
                  {classroom?.status || 'Chưa có'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:bg-gray-400 transition-colors flex items-center space-x-2'
            >
              <Check className='w-4 h-4' />
              <span>Tạo lịch học</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
