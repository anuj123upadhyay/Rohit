


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './appwrite/auth';
// import { useAuth } from './appwrite/auth';
import Layout from './pages/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Books from './pages/Books';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Pictures from './pages/Pictures';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';
import NewBlog from './pages/admin/NewBlog';
import EditBlog from './pages/admin/EditBlog';
import UploadPicture from './pages/admin/UploadPicture';
import NewBook from './pages/admin/NewBook';
// import { useEffect } from 'react';
// import requestPermission from "./requestPermission";
// import { account } from './appwrite/appwriteConfig';
// import handleMessages from './firebase/handleMessage';

function App() {
  // useEffect(() => {
  //   const initNotifications = async () => {
  //     const currentUser = await account.get();
  //     if (currentUser?.$id) {
  //       try {
  //         await requestPermission(currentUser.$id);
  //       } catch (error) {
  //         console.error('Failed to initialize notifications:', error);
  //       }
  //     }
  //   };

  //   initNotifications();
  // }, []);

  // useEffect(() => {
  //   requestPermission();
  // }, []); 
  return (
    <Router>
      <AuthProvider>
        <div className="font-sans min-h-screen bg-ivory">
          <Routes>
            {/* Public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Public routes */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/books" element={<Books />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pictures" element={<Pictures />} />

              {/* Protected blog routes */}
              {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              {/* </Route> */}

              {/* Admin-only blog actions */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminRoute />}>
                  <Route path="/blog/new" element={<NewBlog />} />
                  <Route path="/blog/edit/:id" element={<EditBlog />} />
                  <Route path="/pictures/upload" element={<UploadPicture />} />
                  <Route path="/books/new" element={<NewBook />} />
                </Route>
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;