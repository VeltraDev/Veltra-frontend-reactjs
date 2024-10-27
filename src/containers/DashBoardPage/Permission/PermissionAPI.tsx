import React, { useState, useEffect } from 'react';
import http from "@/utils/http";
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  permissions: { id: string; name: string }[];
}

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZiN2VjOGE2LWQ2YTQtNDUyNy1iODgyLWFiYzYyNzIxOTA2YiIsImVtYWlsIjoidHJhbnF1YW5taWthekBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJUcuG6p24gTmd1eeG7hW4gTWluaCIsImxhc3ROYW1lIjoiUXXDom4iLCJyb2xlIjp7ImlkIjoiNWM1Zjg2YzgtMWQ4ZS00ZTYyLThkOTctOGIyNjE1NGJhM2IxIiwibmFtZSI6IkFETUlOIn0sImlhdCI6MTcyOTg1NjMxMSwiZXhwIjoxNzI5ODU4MTExfQ.U5S0OJ8gSwnZ5tpJ1Crdzu20S6On9w33tk4ijvL4FsY';

Modal.setAppElement('#root');

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);

  useEffect(() => {
    fetchRoles(currentPage);
  }, [currentPage]);

  const fetchRoles = async (page: number) => {
    try {
      const response = await http.get(`/roles?page=${page}&limit=10&sortBy=createdAt&order=ASC`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRoles(response.data.data.results);
      setTotalPages(Math.ceil(response.data.data.total / 10));
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ api:', error);
    }
  };

  useEffect(() => {
    setFilteredRoles(roles);
  }, [roles]);

  return (
    <></>
  )
}