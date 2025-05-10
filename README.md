# Collaborative-learning-Platform

# 📚 Collaborative Learning Platform

A full-stack web application designed to help users form study groups, share resources, and collaborate in real-time via chat and video conferencing. Ideal for students and professionals looking to learn new skills together.

---

## 🚀 Features

- 👤 **User Registration & Profile Creation**
- 👥 **Study Group Creation & Management**
- 📂 **Resource Sharing (Documents, Links, Videos)**
- 💬 **Real-time Group Chat (Socket.io)**
- 🎥 **Video Conferencing (WebRTC)**

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS (or Bootstrap)
- Axios
- Socket.io-client
- WebRTC API

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.io
- JWT for Authentication
- Multer (for file uploads)

---

## 📁 Folder Structure

```bash
collab-learning-platform/
│
├── client/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── utils/
│       └── App.js
│
├── server/               # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── README.md
└── package.json
