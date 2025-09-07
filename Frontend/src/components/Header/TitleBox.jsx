import SearchBar from "../Forms/SearchBar";
 
function Titlebox({ pageTitle, customButton, onSearch, placeholder }) {
  return (
    <div className="bg-white p-4 rounded-[var(--br-radius)] flex items-center justify-between">
      <div className="flex items-center flex-grow space-x-4 justify-between">
        <h1 className="text-2xl font-bold text-black">{pageTitle}</h1>
          <div className="flex-grow max-w-md mr-3">
            <SearchBar
              placeholder={placeholder}
              onSearch={onSearch}
            />
          </div>
      </div>
      {customButton && <div>{customButton}</div>}
    </div>
  );
}
 
export default Titlebox;