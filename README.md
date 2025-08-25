# 🧩 ADHD Helper Agent – MVP Plan

## 🎯 Mục tiêu
- Xây 1 AI Agent **giúp chính bạn** (và sau này có thể mở rộng cho người khác) vượt qua vòng lặp ADHD:  
  *biết việc cần làm → không làm → thất vọng → tìm dopamine nhanh → càng khó quay lại*.  
- Tập trung vào **dopamine-friendly UI**, realtime phản hồi, animation bắt mắt.  
- Giảm số lượng công nghệ để tránh “tức đầu” vì setup.  

---

## ⚙️ Techstack

### **Frontend (UI)**
- **Next.js** → framework chính.  
- **shadcn/ui + Tailwind** → UI đẹp, dopamine-friendly.  
- **Vercel AI SDK** → chat với AI (streaming).  
- **Anime.js** → animation mượt, micro-interaction, dopamine boost.  

### **Backend (AI Ruột)**
- **FastAPI** → xử lý logic, API.  
- **Agno** → quản lý hội thoại & memory (nhớ habit, streak, trạng thái); hỗ trợ tool-use, đa phương thức nếu cần mở rộng.  

### **Database**
- **Convex** → DB chính, realtime sync, auth cơ bản, không cần setup nhiều.  
  - Lưu **habit logs** (ngủ, học, trading, gym...).  
  - Lưu **progress** (thống kê ngày/tuần).  
  - Realtime update → UI nhảy số ngay (dopamine boost).  

---

## 🖼️ Flow Kiến Trúc
```
[UI - Next.js + shadcn + Tailwind + Vercel AI SDK]
|
|---> [Anime.js - Animation Dopamine Boost]
|
v
[Convex DB - habit logs, progress, realtime sync]
^                                              |
|                                              v
[FastAPI - logic, bridge AI] <-----------> [Real-time Updates]
|
v
[Agno - AI memory + stateflow]
|
v
[LLM API (OpenAI/Gemini/...)]

```

---

## 📱 Chức năng cốt lõi (MVP)

1. **Chat với AI (người đồng hành)**  
   - AI động viên, nhắc nhở.  
   - Typing animation → cảm giác có người thực sự đang “trò chuyện”.  

2. **Habit Tracker**  
   - Log thói quen hằng ngày (ngủ, học, gym, trading).  
   - Khi log thành công → icon bounce ✨.  

3. **Progress Dashboard**  
   - Hiển thị streak & tiến trình.  
   - Khi streak tăng → animation “fire streak” 🔥.  
   - Khi đạt milestone → confetti 🎉.  
   - Progress bar fill bằng transition mượt.  

---

## 🔑 Nguyên tắc
- **Small first**: chỉ build 1–2 tính năng trước.  
- **Đẹp & realtime** > backend phức tạp.  
- **Dành cho bạn trước tiên** → sau đó mới mở rộng cộng đồng.