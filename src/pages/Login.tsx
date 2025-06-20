export default function Login() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <form>
        <input type="email" placeholder="Email" /><br />
        <input type="password" placeholder="Password" /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
