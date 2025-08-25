# 🗓️ Lộ trình 4 Tuần – ADHD Helper Agent (MVP)

## 🎯 Mục tiêu cuối
Có 1 app chạy được:
- UI đẹp, dopamine-friendly, có animation boost.  
- Chat AI đồng hành (Agno + FastAPI).  
- Habit Tracker (log + xem tiến trình).  
- Progress dashboard (streak, progress bar, confetti).  

---

## ✅ Tuần 1: Khởi động & UI cơ bản
- [x] Setup project Next.js + shadcn/ui + Tailwind với Bun:
  ```bash
  bun create next-app adhd-helper --typescript --tailwind --eslint
  cd adhd-helper
  bun add @shadcn/ui
  bunx @shadcn/ui@latest init
  bunx @shadcn/ui@latest add button input
  ```
- [x] Cài Anime.js, thêm animation nhỏ (nút bounce):
  ```bash
  bun add animejs @types/animejs
  ```
  ```tsx
  import * as anime from "animejs";
  useEffect(() => {
    anime({
      targets: ".bounce-btn",
      scale: [1, 1.2, 1],
      duration: 1000,
      easing: "easeInOutQuad",
      loop: true,
    });
  }, []);
  ```
- [x] Tạo giao diện Chat đơn giản (khung chat + input) với shadcn/ui.
- [x] Kết nối Vercel AI SDK, tích hợp Ollama (gemma3) cho AI chat streaming:
  ```bash
  bun add @vercel/ai-sdk
  ```
  ```tsx
  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    body: JSON.stringify({
      model: "gemma3",
      messages: [{ role: "user", content: message }],
      stream: true,
    }),
  });
  ```
- 🎯 **Kết quả**: Chat với AI qua UI, typing animation, nút bounce.

---

## ✅ Tuần 2: Habit Tracker (Log thói quen)
- [ ] Setup Convex (DB + auth cơ bản):
  ```bash
  bun add convex
  bunx convex init
  ```
- [ ] Tạo schema Convex cho Habit Logs:
  ```ts
  export const habits = defineTable({
    date: v.string(),
    type: v.string(), // ngủ, học, gym, trading
    status: v.string(), // completed, skipped
    userId: v.string(),
  });
  ```
- [ ] Tạo UI form log habit + nút log (bounce animation khi thành công).
- [ ] Realtime update: danh sách habit hiển thị ngay khi log.
- [ ] Setup auth cơ bản với Convex (đăng nhập/đăng ký đơn giản).
- 🎯 **Kết quả**: Log thói quen, xem realtime, auth hoạt động.

---

## ✅ Tuần 3: Progress Dashboard
- [ ] Tạo API FastAPI tổng hợp dữ liệu habit (số ngày, streak):
  ```python
  from fastapi import FastAPI
  from convex import ConvexClient

  app = FastAPI()
  client = ConvexClient("YOUR_CONVEX_URL")

  @app.get("/habits/summary/{user_id}")
  async def get_habit_summary(user_id: str):
      habits = await client.query("habits:getByUser", {"userId": user_id})
      streak = calculate_streak(habits)
      total_days = len(habits)
      return {"streak": streak, "total_days": total_days}
  ```
- [ ] Tạo UI dashboard: progress bar, streak counter.
- [ ] Thêm animation “fire streak” 🔥 khi streak tăng:
  ```tsx
  anime({
    targets: ".streak-icon",
    scale: [1, 1.5, 1],
    rotate: "1turn",
    duration: 800,
    easing: "easeInOutSine",
  });
  ```
- [ ] Thêm confetti khi đạt milestone (5 logs, 7 logs…):
  ```tsx
  import confetti from "canvas-confetti";
  confetti({ particleCount: 100, spread: 70 });
  ```
- 🎯 **Kết quả**: Dashboard trực quan, fire streak, confetti, progress bar mượt.

---

## ✅ Tuần 4: Tích hợp Agno & Tinh chỉnh
- [ ] Setup Agno cho AI memory:
  ```bash
  pip install agno
  ```
  ```python
  from agno import Agent

  agent = Agent(model="llama3", memory=True)
  agent.add_tool("get_habit_summary", lambda user_id: client.query("habits:getByUser", {"userId": user_id}))
  ```
- [ ] Tích hợp Agno vào FastAPI, AI phản hồi ngữ cảnh từ Convex:
  ```python
  @app.post("/chat")
  async def chat_with_agent(user_id: str, message: str):
      response = await agent.process(message, user_id=user_id)
      return {"response": response}
  ```
- [ ] Tinh chỉnh UI: theme màu vui mắt, animation mượt hơn.
- [ ] Viết doc ngắn: cách chạy app, flow kiến trúc.
- 🎯 **Kết quả**: MVP hoàn chỉnh, AI nhớ habit (ví dụ: “Bạn ngủ sớm 3/7 ngày!”), UI dopamine-friendly.

---

## 🔑 Nguyên tắc triển khai
- Build **theo tuần**, không nhảy trước.  
- Ưu tiên **UI dopamine-friendly** hơn backend cầu kỳ.  
- Mỗi tuần phải có **demo chạy được** để tạo động lực.