import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoleForm } from "../../containers/DashBoardPage/RoleDB/RoleForm";
import http from "@/utils/http";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZiN2VjOGE2LWQ2YTQtNDUyNy1iODgyLWFiYzYyNzIxOTA2YiIsImVtYWlsIjoidHJhbnF1YW5taWthekBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJUcuG6p24gTmd1eeG7hW4gTWluaCIsImxhc3ROYW1lIjoiUXXDom4iLCJyb2xlIjp7ImlkIjoiNWM1Zjg2YzgtMWQ4ZS00ZTYyLThkOTctOGIyNjE1NGJhM2IxIiwibmFtZSI6IkFETUlOIn0sImlhdCI6MTcyOTg1NjMxMSwiZXhwIjoxNzI5ODU4MTExfQ.U5S0OJ8gSwnZ5tpJ1Crdzu20S6On9w33tk4ijvL4FsY';

export function AddRole() {
    const navigate = useNavigate();

    async function handleSubmit(values: { name: string; description: string; permissions: string[] }) {
        try {
            const response = await http.post("/roles", values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Role added successfully!");
            console.log("Role added successfully:", response.data);
            setTimeout(() => {
                navigate("/dashboard/role");
            }, 1500); //Về lại trang role sau 1.5s
        } catch (error) {
            toast.error("Error adding role!");
            console.error("Error adding role:", error);
        }
    }

    return (
        <div className="container mx-auto p-4 bg-gray-50">
            <RoleForm onSubmit={handleSubmit} />
        </div>
    );
}