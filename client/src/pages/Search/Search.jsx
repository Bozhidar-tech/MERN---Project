import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyItem from "../../components/PropertyItem/PropertyItem";

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    gas: false,
    electricity: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const gasFromUrl = urlParams.get("gas");
    const electricityFromUrl = urlParams.get("electricity");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      gasFromUrl ||
      electricityFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        gas: gasFromUrl === "true" ? true : false,
        electricity: electricityFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchProperties = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/property/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setProperties(data);
      setLoading(false);
    };

    fetchProperties();
  }, [location.search]);

  const changesHandler = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "house" ||
      e.target.id === "apartment"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "electricity" ||
      e.target.id === "gas" ||
      e.target.id === "furnished"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("gas", sidebardata.gas);
    urlParams.set("electricity", sidebardata.electricity);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfProperties = properties.length;
    const startIndex = numberOfProperties;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/property/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setProperties([...properties, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={submitHandler} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={changesHandler}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Вид:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.type === "all"}
              />
              <span>Къщи & Апаратаменти</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="house"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.type === "house"}
              />
              <span>Къщи</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="apartment"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.type === "apartment"}
              />
              <span>Апартаменти</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Удобства:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.furnished}
              />
              <span>Обзавеждане</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="gas"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.gas}
              />
              <span>Газ</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="electricity"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.electricity}
              />
              <span>Електричество</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.parking}
              />
              <span>Паркомясто</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Сортиране по:</label>
            <select
              onChange={changesHandler}
              defaultValue={"created_at_desc"}
              className="border rounded-lg p-3"
              id="sort_order"
            >
              <option value="regularPrice_desc">Низходяща цена</option>
              <option value="regularPrice_asc">Възходяща цена</option>
              <option value="createdAt_desc">Най-нови</option>
              <option value="createdAt_asc">Най-стари</option>
            </select>
          </div>
          <button
            className="text-white p-3 rounded-lg uppercase hover:opacity-95"
            style={{ background: "#00B98E" }}
          >
            Търси
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1
          className="text-3xl font-semibold border-b p-3 mt-5"
          style={{ color: "#00B98E" }}
        >
          Списък с имотите:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && properties.length === 0 && (
            <p className="text-xl text-slate-700">Няма намерени имоти!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Зареждане...
            </p>
          )}

          {!loading &&
            properties &&
            properties.map((property) => (
              <PropertyItem key={property._id} property={property} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Покажи повече
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
