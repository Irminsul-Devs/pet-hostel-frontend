export default function PetForm() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Book a Stay</h2>
      <form>
        <input type="text" placeholder="Pet Name" /><br />
        <input type="text" placeholder="Type (Dog, Cat...)" /><br />
        <input type="date" placeholder="Start Date" /><br />
        <input type="date" placeholder="End Date" /><br />
        <button type="submit">Book</button>
      </form>
    </div>
  );
}
