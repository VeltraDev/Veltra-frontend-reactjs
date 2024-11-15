import React from "react";
import { useNavigate } from "react-router-dom";
import { RoleForm } from "@/containers/DashBoardPage/RoleDB/RoleForm";
import { http } from '@/api/http';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function AddRole() {
    const navigate = useNavigate();

    async function handleSubmit(values: { name: string; description: string; permissions: string[] }) {
        try {
            await http.post("/roles", values);
            toast.success("Role added successfully!");
            setTimeout(() => {
                navigate("/dashboard/role");
            }, 2000);
        } catch (error) {
            toast.error("Error adding role!");
        }
    }

    return (
        <>
            <ToastContainer />
            <h1 className="text-2xl font-semibold text-gray-800 pb-4">Thêm vai trò</h1>
            <div className="container mx-auto p-4 bg-gray-50">
                <RoleForm onSubmit={handleSubmit} />
            </div>
        </>

    );
}