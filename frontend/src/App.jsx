import { BrowserRouter, Routes, Route } from "react-router-dom";

// components
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Container from "./components/Container";
import Message from "./components/Message";

// pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/User/Profile";
import MyPets from "./pages/Pet/MyPets";
import AddPet from "./pages/Pet/AddPet";
import EditPet from "./pages/Pet/EditPet";
import PetDetails from "./pages/Pet/PetDetails";
import MyAdoptions from "./pages/Pet/MyAdoptions";

// context
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <header>
          <NavBar />
        </header>
        <Container>
          <Message />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/pet/mypets" element={<MyPets />} />
            <Route path="/pet/add" element={<AddPet />} />
            <Route path="/pet/edit/:id" element={<EditPet />} />
            <Route path="/pet/myadoptions" element={<MyAdoptions />} />
            <Route path="/pet/:id" element={<PetDetails />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
        <footer>
          <Footer />
        </footer>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
