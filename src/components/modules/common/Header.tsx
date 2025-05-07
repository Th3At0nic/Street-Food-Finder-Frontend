import { TRole } from "@/types";
import { AdminHeader } from "../admin/AdminHeader";
import { UserHeader } from "../user/UserHeader";

interface HeaderProps {
    role: TRole
}

const Header = ({ role }: HeaderProps) => {
    if (role === 'ADMIN') {
        return <AdminHeader />
    } else {
        return <UserHeader />
    }
};

export default Header;