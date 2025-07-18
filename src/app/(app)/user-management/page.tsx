
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import UserStatsCards from '@/components/user-stats-cards';
import AdminUsersTable from '@/components/admin-users-table';
import RolesPermissions from '@/components/roles-permissions';

const UserManagementPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end items-center">
        <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Admin
        </Button>
      </div>

      <UserStatsCards />
      <AdminUsersTable />
      <RolesPermissions />
    </div>
  );
};

export default UserManagementPage;
