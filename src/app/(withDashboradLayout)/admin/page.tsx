"use client";

import { useSession } from "next-auth/react";

const AdminDashboard = () => {
    const { data, status } = useSession();
    console.log({ data, status });
    return (
        <div>
            <h1>AdminDashboard</h1>
        </div>
    );
};

export default AdminDashboard;