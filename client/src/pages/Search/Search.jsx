import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import PropertyItem from "../../components/PropertyItem/PropertyItem";

export default function Search() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    location: "",
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
    window.scrollTo(0, 0);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const locationFromUrl = urlParams.get("location");
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
      locationFromUrl ||
      gasFromUrl ||
      electricityFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        location: locationFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        gas: gasFromUrl === "true",
        electricity: electricityFromUrl === "true",
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
    const { id, value, checked } = e.target;

    if (id === "all" || id === "house" || id === "apartment") {
      setSidebardata({ ...sidebardata, type: id });
    } else if (id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: value });
    } else if (id === "location") {
      setSidebardata({ ...sidebardata, location: value });
    } else if (["parking", "electricity", "gas", "furnished"].includes(id)) {
      setSidebardata({
        ...sidebardata,
        [id]: checked,
      });
    } else if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata({ ...sidebardata, sort: sort || "created_at", order: order || "desc" });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("location", sidebardata.location);
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
    <div className="flex flex-col md:flex-row bg-gray-800 text-white">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen border-gray-600">
        <form onSubmit={submitHandler} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">{t('criteria')}</label>
            <input
              type="text"
              id="searchTerm"
              placeholder={t('searchPlaceholder')}
              className="border rounded-lg p-3 w-full bg-gray-900 text-white border-gray-600"
              value={sidebardata.searchTerm}
              onChange={changesHandler}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">{t('location')}</label>
            <input
              type="text"
              id="location"
              placeholder={t('locationPlaceholder')}
              className="border rounded-lg p-3 w-full bg-gray-900 text-white border-gray-600"
              value={sidebardata.location}
              onChange={changesHandler}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">{t('typeLabel')}</label>
            <div className="flex gap-2">
              <input
                type="radio"
                id="all"
                name="type"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.type === "all"}
              />
              <span>{t('houseAndApartment')}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="house"
                name="type"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.type === "house"}
              />
              <span>{t('houses')}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="apartment"
                name="type"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.type === "apartment"}
              />
              <span>{t('apartments')}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">{t('amenities')}</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.furnished}
              />
              <span>{t('furnished')}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="gas"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.gas}
              />
              <span>{t('gas')}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="electricity"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.electricity}
              />
              <span>{t('electricity')}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={changesHandler}
                checked={sidebardata.parking}
              />
              <span>{t('parking')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">{t('sortBy')}</label>
            <select
              onChange={changesHandler}
              defaultValue={"createdAt_desc"}
              className="border rounded-lg p-3 bg-gray-900 text-white border-gray-600"
              id="sort_order"
            >
              <option value="price_desc">{t('priceDesc')}</option>
              <option value="price_asc">{t('priceAsc')}</option>
              <option value="createdAt_desc">{t('newest')}</option>
              <option value="createdAt_asc">{t('oldest')}</option>
            </select>
          </div>
          <button
            className="text-white p-3 rounded-lg uppercase hover:opacity-95"
            style={{ background: "#00B98E" }}
          >
            {t('searchButton')}
          </button>
        </form>
      </div>
      <div className="flex-1 p-7 bg-gray-800">
        <h1
          className="text-3xl font-semibold border-b p-3 mt-5 border-gray-600"
          style={{ color: "#00B98E" }}
        >
          {t('propertyListTitle')}
        </h1>
        <div className="flex flex-wrap gap-4">
          {!loading && properties.length === 0 && (
            <p className="text-xl text-slate-300">{t('noPropertiesFound')}</p>
          )}
          {loading && (
            <p className="text-xl text-slate-300 text-center w-full">
              {t('loading')}
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
              className="text-green-400 hover:underline p-7 text-center w-full"
            >
              {t('showMore')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}