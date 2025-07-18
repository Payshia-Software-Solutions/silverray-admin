import UserStatsCards from '@/components/user-stats-cards';
import AdminUsersTable from '@/components/admin-users-table';
import RolesPermissions from '@/components/roles-permissions';

const UserManagementPage = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">User Management</h1>
      <p className="text-gray-600">Manage admin accounts and permissions</p>
      <UserStatsCards />
      <AdminUsersTable />
      <RolesPermissions />
    </div>
  );
};

export default UserManagementPage; 