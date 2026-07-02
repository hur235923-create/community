import { Routes, Route } from "react-router-dom"
import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import PostList from "@/pages/PostList"
import PostDetail from "@/pages/PostDetail"
import Write from "@/pages/Write"
import Edit from "@/pages/Edit"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route
          path="/posts/:id/edit"
          element={
            <ProtectedRoute>
              <Edit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/write"
          element={
            <ProtectedRoute>
              <Write />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
    </Routes>
  )
}
