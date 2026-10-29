export default function FormField({ label, name, type = 'text', value, onChange, error, ...props }) {
  return (
    <label>
      <span>{label}</span>
      <input type={type} name={name} value={value} onChange={onChange} {...props} />
      {error && <small>{error}</small>}
    </label>
  )
}
