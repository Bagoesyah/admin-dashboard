import Sidebar from './components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100 min-h-screen">{children}</div>
    </div>
  );
}
