
### **Authy - Authentication & Dynamic SEO Metadata**
📌 **A Next.js project focused on authentication and dynamic SEO metadata generation.**

---

## 📖 **Table of Contents**
- [🌟 Features](#-features)
- [🚀 Getting Started](#-getting-started)
- [📦 Installation](#-installation)
- [⚙️ Environment Variables](#️-environment-variables)
- [📌 API Routes](#-api-routes)
- [🎨 SEO Metadata](#-seo-metadata)
- [🔒 Authentication Flow](#-authentication-flow)
- [📜 License](#-license)

---

## 🌟 **Features**
✅ Secure authentication (Signup, Login, Logout)  
✅ JWT-based session management  
✅ Middleware for protected API routes  
✅ Role-based access control (RBAC)  
✅ Dynamic SEO metadata generation for pages  
✅ Server-side and client-side SEO optimization  
✅ Image-based SEO (Open Graph, Twitter Cards)  
✅ Fully typed with TypeScript  

---

## 🚀 **Getting Started**
To set up and run **Authy**, follow these steps:

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/awakeneddev/Authy.git
cd Authy
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the root directory and configure:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
JWT_SECRET=your_secret_key
MONGODB_URI=your_mongodb_uri
```

> ⚠️ **Never expose `JWT_SECRET` in client-side code!**

---

## 📦 **Installation**
Make sure you have:
- Node.js **v18+**
- MongoDB (Local or Atlas)
- A `.env` or `.env.local` file with required keys

To start the project:
```sh
npm run dev
```

For production:
```sh
npm run build && npm start
```

---

## 📌 **API Routes**
### 🔑 **Authentication**
| Method | Endpoint          | Description             |
|--------|------------------|-------------------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login`  | Authenticate user |
| `POST` | `/api/auth/logout` | Clear user session |

### 🛡 **Protected Routes**
| Method | Endpoint        | Authentication |
|--------|----------------|----------------|
| `GET`  | `/api/hero`  | No Token required |
| `POST`  | `/api/hero`  | ✅ Token required |
| `PUT`  | `/api/hero`  | ✅ Token required |
| `DELETE`  | `/api/hero`  | ✅ Token required |

> **Note:** Requests must include a valid JWT token in cookies.

---

## 🎨 **SEO Metadata**
Authy dynamically generates **SEO metadata** for each page, optimizing performance and search visibility.

✅ **Server-Side SEO (SSR)**  
✅ **Meta tags for Open Graph & Twitter**  
✅ **Dynamic Keywords per page**  

#### **Example Metadata (`app/seo.ts`)**
```ts
export default function getSeoMeta(title: string, description: string, keywords: string[]) {
  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://authy.app",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}
```

### **Usage in Page Components**
```tsx
import { Metadata } from "next";
import getSeoMeta from "@/seo";

export const metadata: Metadata = getSeoMeta(
  "Authy - Secure Login System",
  "A full-featured authentication system with dynamic SEO.",
  ["auth", "login", "signup", "seo"]
);
```

---

## 🔒 **Authentication Flow**
1️⃣ **User Signup** → Create an account  
2️⃣ **User Login** → Receive JWT token  
3️⃣ **Protected Routes** → Access secured data  
4️⃣ **Middleware Enforcement** → Blocks unauthorized access  
5️⃣ **Logout** → Clears session cookie  

---

## 📜 **License**
Authy is **open-source** under the **MIT License**.

📌 **Contributions are welcome!** Feel free to submit PRs or suggest features. 🚀  

---

### 🚀 **Let's Build Secure & SEO-Optimized Apps!**
🐙 **GitHub:** [github.com/awakeneddev](https://github.com/aawakeneddev)    

🔥 _Star the repo if you found this useful!_ ⭐

---

Let me know if you want me to modify any section! 🚀