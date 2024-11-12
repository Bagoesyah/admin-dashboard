"use client";

import Link from 'next/link';
import { HomeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Sidebar = () => (
  <div className="w-64 h-screen bg-gray-800 text-white p-4">
    <h2 className="text-2xl font-bold mb-4 border-b-2 pb-4 border-white">Admin Dashboard</h2>
    <ul>
      <li className="mb-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <HomeIcon className="h-5 w-5" />
          <span>Table</span>
        </Link>
      </li>
      <li>
        <Link href="/dashboard/example" className="flex items-center space-x-2">
          <ChartBarIcon className="h-5 w-5" />
          <span>Example</span>
        </Link>
      </li>
    </ul>
  </div>
);

export default Sidebar;
