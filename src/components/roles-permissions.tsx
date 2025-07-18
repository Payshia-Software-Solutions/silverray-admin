
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, XCircle, ShieldCheck, Shield, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PermissionItemProps {
  text: string;
  granted: boolean;
}

const PermissionItem: React.FC<PermissionItemProps> = ({ text, granted }) => (
  <div className="flex items-center text-sm mb-2">
    {granted ? (
      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
    )}
    <span className="text-muted-foreground">{text}</span>
  </div>
);

const RolesPermissions: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Roles & Permissions</h2>
      <p className="text-sm text-muted-foreground mb-4">Manage role-based access controls and permissions for your team</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Super Admin</CardTitle>
                <CardDescription>Full access to all system features</CardDescription>
              </div>
              <ShieldCheck className="w-8 h-8 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <PermissionItem text="User Management" granted />
            <PermissionItem text="Booking Management" granted />
            <PermissionItem text="Restaurant Management" granted />
            <PermissionItem text="Website Content" granted />
            <PermissionItem text="System Settings" granted />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex justify-between items-start">
              <div>
                <CardTitle>Booking Manager</CardTitle>
                <CardDescription>Manages rooms and reservations</CardDescription>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <PermissionItem text="View/Edit Bookings" granted />
            <PermissionItem text="Room Management" granted />
            <PermissionItem text="User Management" granted={false} />
            <PermissionItem text="Restaurant Management" granted={false} />
            <PermissionItem text="System Settings" granted={false} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>Restaurant Manager</CardTitle>
                    <CardDescription>Manages dining and menus</CardDescription>
                </div>
                <ShieldX className="w-8 h-8 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <PermissionItem text="View/Edit Restaurant Reservations" granted />
            <PermissionItem text="Manage Menus & Venues" granted />
            <PermissionItem text="User Management" granted={false} />
            <PermissionItem text="Booking Management" granted={false} />
            <PermissionItem text="System Settings" granted={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RolesPermissions;
