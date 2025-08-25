# 🧩 ADHD Helper Agent – MVP Plan (Cập nhật)

## 🎯 Mục tiêu

- Xây 1 AI Agent **giúp chính bạn** (và sau này mở rộng cho người khác) vượt qua vòng lặp ADHD: *biết việc cần làm → không làm → thất vọng → tìm dopamine nhanh → càng khó quay lại*.
- Tập trung vào **dopamine-friendly UI**, realtime phản hồi, animation bắt mắt.
- Giảm số lượng công nghệ để tránh “tức đầu” vì setup.

---

## ⚙️ Techstack

### **Frontend (UI)**

- **Next.js** → Framework chính, setup với Bun.
- **shadcn/ui + Tailwind** → UI đẹp, dopamine-friendly, responsive.
- **Anime.js** → Animation mượt, micro-interaction (nút bounce, fire streak 🔥, confetti 🎉).
- **Vercel AI SDK** → Chat với AI, streaming phản hồi.

### **Backend (AI & Logic)**

- **FastAPI** → API xử lý logic, tổng hợp dữ liệu habit (số ngày, streak).
- **Agno** → Quản lý hội thoại, memory (nhớ habit logs, streak, trạng thái); hỗ trợ tool-use, đa phương thức nếu mở rộng.

### **Database**

- **Convex** → DB chính, realtime sync, auth cơ bản.
  - Lưu **habit logs** (ngày, loại habit: ngủ, học, gym, trading, trạng thái).
  - Lưu **progress** (thống kê ngày/tuần, streak).
  - Realtime update → UI nhảy số ngay (dopamine boost).

---

## 🖼️ Flow Kiến Trúc

```
[UI - Next.js + shadcn + Tailwind + Vercel AI SDK]
|
|---> [Anime.js - Animation: bounce, fire streak 🔥, confetti 🎉]
|
v
[Convex DB - habit logs, progress, auth, realtime sync]
^                                              |
|                                              v
[FastAPI - logic, habit aggregation API] <--> [Real-time Updates]
|
v
[Agno - AI memory, stateflow, tool-use]
|
v
[LLM API (Ollama/llama3 for local dev)]
```

---

## 📱 Chức năng cốt lõi (MVP)

1. **Chat với AI (người đồng hành)**

   - AI động viên, nhắc nhở dựa trên habit logs (ví dụ: “Bạn đã ngủ sớm 3/7 ngày!”).
   - Streaming qua Vercel AI SDK, typing animation → cảm giác “trò chuyện thật”.

2. **Habit Tracker**

   - Log thói quen hằng ngày (ngủ, học, gym, trading).
   - Form log đơn giản, nút log → bounce animation ✨ khi thành công.
   - Realtime update → danh sách habit hiển thị ngay.

3. **Progress Dashboard**

   - Hiển thị streak (số ngày liên tiếp), tiến trình (progress bar).
   - Animation “fire streak” 🔥 khi streak tăng.
   - Confetti 🎉 khi đạt milestone (5 logs, 7 logs…).
   - Progress bar fill mượt mà bằng Anime.js transition.

4. **Auth cơ bản**

   - Sử dụng Convex auth, không cần setup phức tạp.
   - Đăng nhập/đăng ký đơn giản để lưu dữ liệu người dùng.
