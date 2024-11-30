# Chạy Frontend Veltra
## Dự án Veltra với frontend được phát triển bởi:
1. Lê Trần Hoàng Kiên (phó nhóm)
2. Lê Phạm Thanh Duy
3. Trần Nguyễn Minh Quân
4. Đoàn Vĩnh Khang
5. Nguyễn Anh Đức

## Một số lưu ý về source code frontend Veltra:
+ Hiện tại backend vẫn còn được host trên AWS EC2/S3 và Aiven (MySQL) nên front-end chỉ đơn giản sử dụng URL: https://veltra2.duckdns.org/api/v1 là sử dụng được các APIs của backend.
+ Nếu thầy muốn chạy ở localhost backend thì tìm BASE_URL trong file "http.ts", "PermissionAPI.js", ".env" sửa lại thành localhost với cổng của backend.

## Hướng dẫn chạy frontend Veltra:
1. Dẫn vào thư mục frontend và cài đặt npm: 
    ```bash
    npm i
    ```
2. Chạy frontend trong môi trường development: 
    ```bash
    npm run dev
    ```