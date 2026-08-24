import Skeleton from "./Skeleton"

const TicketSelectorSkeleton = () => {
  return (
    <div className="ts-ticket-list">
      {[1, 2, 3].map((i) => (
        <div className="ts-row-skeleton" key={i}>
          <Skeleton width="56px" height="56px" radius="8px" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            <Skeleton width="60%" height="14px" />
            <Skeleton width="40%" height="12px" />
          </div>
          <Skeleton width="40px" height="14px" />
          <Skeleton width="90px" height="32px" radius="8px" />
        </div>
      ))}
    </div>
  );
};

export default TicketSelectorSkeleton;