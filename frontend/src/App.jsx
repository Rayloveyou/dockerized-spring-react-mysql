import { useState, useEffect } from "react";

// Địa chỉ backend, có thể truy cập bằng bất kỳ IP của node nào
const BACKEND_HOST = "http://192.168.145.115:32000"; // Hoặc sử dụng import.meta.env.VITE_BACKEND_HOST nếu có

// Hàm lấy danh sách người dùng từ backend
const fetchUsers = async () => {
  try {
    const res = await fetch(`${BACKEND_HOST}/api/user`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return [];
  }
};

// Hàm lưu người dùng mới vào backend
const saveUser = async (user) => {
  try {
    await fetch(`${BACKEND_HOST}/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
  } catch (error) {
    console.error("Lỗi khi lưu người dùng:", error);
  }
};

// Khởi tạo người dùng ban đầu
const initialUser = {
  name: "",
  email: "",
};

function App() {
  // Khai báo state cho danh sách người dùng và người dùng mới
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(initialUser);

  // Hàm xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Hàm lấy danh sách người dùng và cập nhật state
  const getUsers = async () => {
    setUsers(await fetchUsers());
  };

  // Hàm xử lý khi gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveUser(user);
    getUsers();
    setUser(initialUser);
  };

  // useEffect để lấy danh sách người dùng khi component mount
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <main>
      <h1>Người dùng</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Tên</label>
        <input
          type="text"
          placeholder="Tên"
          name="name"
          id="name"
          required
          onChange={handleChange}
          value={user.name}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          name="email"
          id="email"
          onChange={handleChange}
          value={user.email}
        />
        <button type="submit">Thêm</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {users.map(({ name, email }, index) => (
            <tr key={index}>
              <td>{name}</td>
              <td>{email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
