export default function Register() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Register</h2>
      <form>
        <input type="text" placeholder="Name" /><br />
        <input type="email" placeholder="Email" /><br />
        <input type="password" placeholder="Password" /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
