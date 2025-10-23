# 💬 Real Time Chat App

A full-stack messaging application where users can send and receive text and images securely. Built with the MERN stack and a clean, modern architecture for scalability and efficiency.

---

## ✅ Features

- Real time messaging with socket.io
- Secure authentication with **JWT & HTTP-only cookies**
- **Send and receive messages** with images
- **Cloudinary image upload support**
- **User profiles** with avatar support
- Modern **React + TailwindCSS UI**
- **Zustand** for state management
- **MongoDB + Mongoose** backend
- **Protected routes & middleware**
- Organized **MVC backend architecture**
- **Error handling & validation**
- **Environment variable support**
- **Clean, reusable UI component structure**

---

## 🚀 Tech Stack

| Layer              | Technologies                                   |
|--------------------|------------------------------------------------|
| Frontend           | React, Vite, Axios, React Router, Zustand      |
| Backend            | Node.js, Express                               |
| Database           | MongoDB, Mongoose                              |
| Authentication     | JSON Web Token (JWT), bcrypt                   |
| Styling            | TailwindCSS                                    |
| File Upload        | Cloudinary                                     |
| Notifications      | react-hot-toast                                |
| Icons              | lucide-react                                   |
| Coming Soon        | Socket.io (real-time support)                  |

---

## 📦 Project Structure

```
RealTime-Chat-App/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── utils/
│   ├── index.html
│   └── package.json
```

---

## ⚙️ Installation & Setup

### 1. Clone repository
```bash
git clone https://github.com/rytime13579/Existing.git
cd Existing
```

### 2. Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `/backend` with the following:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_URL=http://localhost:5173
```

---

## 🧪 Running the App

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

Visit frontend at: **http://localhost:5173**

---

## 🔌 API Documentation

### **Auth Routes**
| Method | Endpoint                         | Description                |
|--------|----------------------------------|----------------------------|
| POST   | `/api/auth/signup`               | Register new user          |
| POST   | `/api/auth/login`                | Login user                 |
| POST   | `/api/auth/logout`               | Logout user                |
| GET    | `/api/auth/check`                | Check current user session |
| PUT    | `/api/auth/check/update-profile` | Update user profile image  |

---

### **Message Routes**
| Method | Endpoint                | Description                          |
|--------|-------------------------|--------------------------------------|
| GET    | `/api/messages/:userId` | Get messages by user ID              |
| POST   | `/api/messages/send/:id`| Send a text or image message         |
| GET    | `/api/messages/contacts`| Get all users in the database        |
| GET    | `/api/messages/chats`   | Get all chats between two users      |


---

## ✅ Roadmap

- [ ] Message read receipts
- [ ] More UI themes
- [ ] Emoji/message reactions
- [ ] Contact search capability
- [ ] New color scheme
- [ ] Groupchat functionality
- [ ] Self hosted mongoDb & Image server

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 👨‍💻 Author

**Ryan Martin**  
GitHub: [@rytime13579](https://github.com/rytime13579)  
Email: rytime13579@gmail.com  

---

## 📄 License

This project is licensed under the MIT License.

---

If you like this project, consider giving it a ⭐ on GitHub to support development!
