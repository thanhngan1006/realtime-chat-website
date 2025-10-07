## Kế hoạch hoàn thiện tính năng và UI

### 1. Đồng bộ trải nghiệm hội thoại

1.1. Khi tải lại trang, tự động chọn cuộc trò chuyện mới nhất của người dùng.

- Kiểm tra luồng khởi tạo state ở Redux và `PrivateRoute`.
- Cập nhật selector để tìm cuộc trò chuyện có thời gian cập nhật mới nhất.
- Dispatch action đặt `activeConversation` ngay sau khi dữ liệu hội thoại được load.

  1.2. Hiển thị tin nhắn gần đây nhất trong danh sách cuộc trò chuyện (sidebar).

- Mở rộng repository/selector trả về `lastMessage` cho mỗi cuộc trò chuyện.
- Render `lastMessage` trong component danh sách kèm fallback khi chưa có tin nhắn.

  1.3. Bổ sung thông tin cuộc trò chuyện khi người dùng mở chi tiết.

- Tạo component header hiển thị tên, mô tả và thông tin liên quan.
- Với nhóm, sử dụng danh sách thành viên để kết hợp tên hiển thị.

  1.4. Thêm hiển thị avatar nhóm.

- Cập nhật schema dữ liệu nhóm để lưu avatar (hoặc tạo avatar mặc định dựa trên tên).
- Render avatar trong danh sách và phần header chi tiết hội thoại.

### 2. Cải thiện thông báo và trạng thái

2.1. Thông báo khi có tin nhắn mới.

- Tận dụng Firestore listener để phát hiện tin nhắn mới.
- Kích hoạt toast/notification hoặc highlight cuộc trò chuyện tương ứng.

  2.2. Sửa lỗi trạng thái online hiển thị trùng ở sidebar.

- Rà soát component hiển thị trạng thái và loại bỏ phần render trùng lặp.
- Viết test UI thủ công để xác nhận chỉ hiển thị một nhãn online/offline.

### 3. Hoàn thiện tính năng gửi nhận nội dung

3.1. Hỗ trợ phát video trực tiếp sau khi gửi.

- Lưu file video với metadata MIME.
- Trong component tin nhắn, dựng video player (`<video>` tag) thay vì link tải.
- Fallback: nếu trình duyệt không phát được, vẫn cho phép tải xuống.

  3.2. Cho phép gửi tin nhắn thoại.

- Tích hợp tính năng ghi âm (MediaRecorder API) trên frontend.
- Lưu file audio vào storage, trả về URL và render player `<audio>`.

### 4. Cải thiện UI/UX chi tiết

4.1. Sửa hiện tượng giật khi hover hiển thị ngày giờ tin nhắn.

- Kiểm tra CSS transition ở tooltip/hover.
- Áp dụng animation ổn định hoặc chuyển sang tooltip cố định.

  4.2. Phân biệt rõ tin nhắn gửi và nhận.

- Cập nhật class Tailwind/SCSS để thay đổi màu nền, căn lề trái/phải.
- Đảm bảo trạng thái read/unread vẫn hiển thị chính xác.

  4.3. Bổ sung nút gửi (Send button).

- Thêm nút trong form nhập, gắn handler gửi.
- Đảm bảo hoạt động song song với phím Enter.

  4.4. Loại bỏ phần story khỏi UI.

- Xác định component story và loại bỏ khỏi layout.
- Dọn dẹp state/selector liên quan để tránh dữ liệu thừa.

### 5. Kiểm thử và hoàn thiện

- Thực hiện kiểm thử thủ công toàn bộ luồng hội thoại sau mỗi mốc lớn.
- Đảm bảo lint/format đạt yêu cầu (`npm run lint`, `npm run format`).
- Cập nhật tài liệu người dùng (README hoặc docs) nếu có thay đổi workflow đáng kể.
- Chuẩn bị checklist regression cho đội QA.
