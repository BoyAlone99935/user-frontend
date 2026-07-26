import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import Navbar from "../components/Navbar";
// lowest ticket price for an event, used by the price sort
const getMinPrice = (event) => {
  if (!event.ticketTypes || event.ticketTypes.length === 0) return null;
  return Math.min(...event.ticketTypes.map((t) => t.price));
};



const isThisWeekend = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();

  const day = now.getDay(); // 0 = Sun, 6 = Sat
  const daysUntilSat = (6 - day + 7) % 7;
  const saturday = new Date(now);
  saturday.setHours(0, 0, 0, 0);
  saturday.setDate(now.getDate() + daysUntilSat);

  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  sunday.setHours(23, 59, 59, 999);

  return date >= saturday && date <= sunday;
};

const isThisMonth = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear() &&
    date >= now
  );
};

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M18 18l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const EventList = () => {
  const { slug } = useParams();
  const navigate = useNavigate()
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [sortBy, setSortBy] = useState("soonest");
  const [dateRange, setDateRange] = useState("all");
  const [hideSoldOut, setHideSoldOut] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const celebrityRes = await fetch(
          `https://fan-platform-backend.onrender.com/api/celebrities/slug/${slug}`
        );

        const celebrityData = await celebrityRes.json();

        const eventsRes = await fetch(
          `https://fan-platform-backend.onrender.com/api/v1/events/getEvents/${celebrityData.celebrity._id}`
        );

        const eventsData = await eventsRes.json();

        setEvents(eventsData.events);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchEvents();
  }, [slug]);

  // debounce search so we're not re-filtering on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(timeout);
  }, [search]);

  // Unique locations for the dropdown
  const locations = useMemo(() => {
    return [
      "all",
      ...new Set(events.map((event) => event.location.city)),
    ];
  }, [events]);

  const hasActiveFilters =
    debouncedSearch !== "" ||
    location !== "all" ||
    dateRange !== "all" ||
    hideSoldOut ||
    sortBy !== "soonest";

  const clearFilters = () => {
    setSearch("");
    setLocation("all");
    setDateRange("all");
    setHideSoldOut(false);
    setSortBy("soonest");
  };

  // Filter + Sort
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    if (debouncedSearch) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (location !== "all") {
      filtered = filtered.filter(
        (event) => event.location.city === location
      );
    }

    if (dateRange === "weekend") {
      filtered = filtered.filter((event) => isThisWeekend(event.eventDate));
    }

    if (dateRange === "month") {
      filtered = filtered.filter((event) => isThisMonth(event.eventDate));
    }

    if (hideSoldOut) {
      filtered = filtered.filter((event) => !event.isSoldOut);
    }

    if (sortBy === "soonest") {
      filtered.sort(
        (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
      );
    }

    if (sortBy === "latest") {
      filtered.sort(
        (a, b) => new Date(b.eventDate) - new Date(a.eventDate)
      );
    }

    if (sortBy === "price-low") {
      filtered.sort((a, b) => {
        const priceA = getMinPrice(a) ?? Infinity;
        const priceB = getMinPrice(b) ?? Infinity;
        return priceA - priceB;
      });
    }

    if (sortBy === "price-high") {
      filtered.sort((a, b) => {
        const priceA = getMinPrice(a) ?? -Infinity;
        const priceB = getMinPrice(b) ?? -Infinity;
        return priceB - priceA;
      });
    }

    return filtered;
  }, [events, debouncedSearch, location, sortBy, dateRange, hideSoldOut]);

  if (loading) {
    return (
      <div className="events-loading">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <section className="event-list">

      <div className="event-header">
        <div>
          <h1 style={{fontSize:'1.5rem'}}>All Events</h1>
          <p>{filteredEvents.length} Events Available</p>
        </div>
      </div>

      <div className="event-toolbar">

        <div className="search-field">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pair">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {locations.map((city) => (
              <option key={city} value={city}>
                {city === "all" ? "All Locations" : city}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">Any Date</option>
            <option value="weekend">This Weekend</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="filter-pair">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="soonest">Soonest First</option>
            <option value="latest">Latest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <button
            type="button"
            className="clear-filters-btn"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            Clear filters
          </button>
        </div>

        <label className="sold-out-switch">
          <input
            type="checkbox"
            checked={hideSoldOut}
            onChange={(e) => setHideSoldOut(e.target.checked)}
          />
          <span className="switch-track">
            <span className="switch-thumb" />
          </span>
          Hide sold out shows
        </label>

      </div>

      <div className="events-grid">

        {filteredEvents.length === 0 ? (
          <div className="empty-events">
            <h2>No matching events</h2>
            <p>
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "Check back soon for upcoming shows."}
            </p>
            {hasActiveFilters && (
              <button type="button" className="clear-filters-btn" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
            />
          ))
        )}

      </div>

    </section>
    </>
  );
};

export default EventList;