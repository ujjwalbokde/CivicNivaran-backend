# 🏛 CivicNivaran – Backend Integration Plan (Express.js + MongoDB)

A backend plan for integrating Express.js with the CivicNivaran Smart Public Grievance Redressal System.

---

## 📁 Project Structure

civicnivaran-backend/
├── controllers/
│ ├── authController.js
│ ├── complaintController.js
│ └── analyticsController.js
├── models/
│ ├── User.js
│ └── Complaint.js
├── routes/
│ ├── authRoutes.js
│ ├── complaintRoutes.js
│ └── analyticsRoutes.js
├── middleware/
│ ├── auth.js
│ └── errorHandler.js
├── uploads/ # For media files
├── config/
│ └── db.js
├── .env
├── server.js
└── package.json


---

## 🔐 Authentication & Authorization

### ✅ JWT Auth Flow
- User registers or logs in → receives JWT.
- JWT stores `userId`, `role` (citizen, officer, fieldworker).
- Used in `Authorization: Bearer <token>` header.

### 🧱 User Schema

```js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String, // hashed
  role: { type: String, enum: ['citizen', 'officer', 'fieldworker'], default: 'citizen' },
  location: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
🌐 API Routes
🔐 Auth (/api/auth)
Method	Route	Desc
POST	/register	Register new user
POST	/login	Login and get JWT
GET	/me	Get profile (protected)

📝 Complaints (/api/complaints)
Method	Route	Desc
POST	/	Create complaint
GET	/user/:id	Get user complaints
GET	/track/:query	Track by ID or phone
GET	/	Officer view all (filters)
PUT	/:id/assign	Assign to worker
PUT	/:id/status	Update status
PUT	/:id/feedback	Add citizen feedback
PUT	/:id/proof	Upload resolution proof

📊 Analytics (/api/analytics)
Method	Route	Desc
GET	/departments	Complaints by department
GET	/trends	Resolution time trend
GET	/heatmap	Area complaint distribution

🧪 Sample Frontend Integration
js
Copy
Edit
const res = await fetch('https://your-api.com/api/complaints', {
  method: 'POST',
  body: formData,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
📦 Tech Stack
Feature	Tech
Server	Node.js + Express.js
DB	MongoDB + Mongoose
Auth	JWT + bcrypt
Upload	Multer (file uploads)
Env	dotenv for config
Host	Railway / Render / Heroku

🚀 Deployment Plan
Set up Express server and MongoDB

Create models: User, Complaint

Implement JWT auth

Develop complaint + analytics APIs

Handle media uploads via Multer

Deploy API on cloud

Connect to frontend hosted on Vercel


| API                            | Citizen | Officer | Fieldworker |
| ------------------------------ | ------- | ------- | ----------- |
| `/api/complaints (POST)`       | ✅       | ❌       | ❌           |
| `/api/complaints` (GET all)    | ❌       | ✅       | ❌           |
| `/api/complaints/:id/assign`   | ❌       | ✅       | ❌           |
| `/api/complaints/:id/status`   | ❌       | ✅       | ✅           |
| `/api/complaints/:id/proof`    | ❌       | ❌       | ✅           |
| `/api/complaints/:id/feedback` | ✅       | ❌       | ❌           |
