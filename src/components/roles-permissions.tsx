import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

interface PermissionItemProps {
  text: string;
  granted: boolean;
}

const PermissionItem: React.FC<PermissionItemProps> = ({ text, granted }) => (
  <div className="flex items-center text-sm mb-1">
    {granted ? (
      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500 mr-2" />
    )}
    {text}
  </div>
);

const RolesPermissions: React.FC = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Roles & Permissions</h2>
      <p className="text-sm text-gray-600 mb-6">Manage role-based access controls and permissions</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Super Admin Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Super Admin
              <span className="text-xs font-normal text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Full Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PermissionItem text="User Management" granted />
            <PermissionItem text="Booking Management" granted />
            <PermissionItem text="Restaurant Management" granted />
            <PermissionItem text="Event Management" granted />
            <PermissionItem text="System Settings" granted />
          </CardContent>
        </Card>

        {/* Booking Manager Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Booking Manager
              <span className="text-xs font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Limited</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PermissionItem text="View/Edit Bookings" granted />
            <PermissionItem text="Room Management" granted />
            <PermissionItem text="User Management" granted={false} />
            <PermissionItem text="Restaurant Management" granted={false} />
            <PermissionItem text="System Settings" granted={false} />
          </CardContent>
        </Card>

        {/* Restaurant Manager Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Restaurant Manager
              <span className="text-xs font-normal text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Limited</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PermissionItem text="View/Edit Restaurant" granted />
            <PermissionItem text="Restaurant Management" granted />
            <PermissionItem text="User Management" granted={false} />
            <PermissionItem text="Restaurant Management" granted={false} />
            <PermissionItem text="System Settings" granted={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RolesPermissions;