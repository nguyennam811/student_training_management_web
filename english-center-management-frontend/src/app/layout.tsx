import './globals.css';
import type { Metadata } from 'next';
import SessionWrapper from '@/components/SessionWrapper';

export const metadata: Metadata = {
  title: 'Quản lý Trung tâm Tiếng Anh',
  description: 'Ứng dụng quản lý đào tạo học viên',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='vi'>
      <body className='flex'>
        <SessionWrapper>
          <div className='flex-1'>{children}</div>
        </SessionWrapper>
      </body>
    </html>
  );
}
