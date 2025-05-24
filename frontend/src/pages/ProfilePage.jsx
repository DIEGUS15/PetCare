import { useAuth } from "../context/AuthContext";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const { profile, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="info-user">
        <h1>Perfil del usuario</h1>
        <p>Nombre completo: {profile.fullname}</p>
        <p>Telephone: {profile.telephone}</p>
        <p>Dirección: {profile.address}</p>
        <p>Rol: {profile.role}</p>
        <p>Estado: {profile.state}</p>
        <p>Email: {profile.email}</p>
      </div>
      <div className="info-mascota"></div>
    </div>
  );
}

export default ProfilePage;
