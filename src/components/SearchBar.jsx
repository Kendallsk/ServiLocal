const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div style={{ margin: '60px 0 40px', textAlign: 'center' }}>
      <input
        type="text"
        placeholder="Buscar por oficio o servicio..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '40%',
          maxWidth: '600px',
          padding: '9px',
          fontSize: '20px',
          border: '2px solid #00bcd4',
          borderRadius: '50px'
        }}
      />
    </div>
  );
};

export default SearchBar;
