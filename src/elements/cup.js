import React from 'react';

const Cup = ({ isFilled }) => (
  <span role="img" aria-label="edit" className="anticon anticon-edit">
    { isFilled
      ? (
        <svg width="24" height="24" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.59215 13.4583H13.3411C14.7884 13.4566 16.1759 12.881 17.1993 11.8576C18.2227 10.8342 18.7983 9.44669 18.8 7.99941V7.1916H19.975C20.9099 7.1916 21.8065 6.82022 22.4675 6.15915C23.1286 5.49809 23.5 4.60149 23.5 3.6666C23.5 2.73171 23.1286 1.83512 22.4675 1.17405C21.8065 0.512984 20.9099 0.141602 19.975 0.141602H3.1333V7.99941C3.13495 9.44669 3.7106 10.8342 4.73398 11.8576C5.75736 12.881 7.14488 13.4566 8.59215 13.4583ZM18.8 1.70827H19.975C20.4944 1.70827 20.9925 1.91459 21.3597 2.28185C21.727 2.64911 21.9333 3.14722 21.9333 3.6666C21.9333 4.18598 21.727 4.68409 21.3597 5.05135C20.9925 5.41861 20.4944 5.62493 19.975 5.62493H18.8V1.70827ZM4.69997 1.70827H17.2333V7.99941C17.2321 9.03133 16.8217 10.0207 16.092 10.7503C15.3624 11.48 14.373 11.8904 13.3411 11.8916H8.59215C7.56024 11.8904 6.57091 11.48 5.84124 10.7503C5.11156 10.0207 4.70112 9.03133 4.69997 7.99941V1.70827Z" fill="#2979BD" />
          <path d="M4.69997 1.70827H17.2333V7.99941C17.2321 9.03133 16.8217 10.0207 16.092 10.7503C15.3624 11.48 14.373 11.8904 13.3411 11.8916H8.59215C7.56024 11.8904 6.57091 11.48 5.84124 10.7503C5.11156 10.0207 4.70112 9.03133 4.69997 7.99941V1.70827Z" fill="#2979BD" />
          <path d="M0 15.4165H23.5V16.9832H0V15.4165Z" fill="#2979BD" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.59215 13.8167H13.3411C14.7884 13.815 16.1759 13.2394 17.1993 12.216C18.2227 11.1926 18.7983 9.80509 18.8 8.35781V7.55H19.975C20.9099 7.55 21.8065 7.17862 22.4675 6.51755C23.1286 5.85649 23.5 4.95989 23.5 4.025C23.5 3.09011 23.1286 2.19351 22.4675 1.53245C21.8065 0.871383 20.9099 0.5 19.975 0.5H3.1333V8.35781C3.13495 9.80509 3.7106 11.1926 4.73398 12.216C5.75736 13.2394 7.14488 13.815 8.59215 13.8167ZM18.8 2.06667H19.975C20.4944 2.06667 20.9925 2.27299 21.3597 2.64025C21.727 3.00751 21.9333 3.50562 21.9333 4.025C21.9333 4.54438 21.727 5.04249 21.3597 5.40975C20.9925 5.77701 20.4944 5.98333 19.975 5.98333H18.8V2.06667ZM4.69997 2.06667H17.2333V8.35781C17.2321 9.38973 16.8217 10.3791 16.092 11.1087C15.3624 11.8384 14.373 12.2488 13.3411 12.25H8.59215C7.56024 12.2488 6.57091 11.8384 5.84124 11.1087C5.11156 10.3791 4.70112 9.38973 4.69997 8.35781V2.06667Z" fill="#2979BD" />
          <path d="M0 15.7749H23.5V17.3416H0V15.7749Z" fill="#2979BD" />
        </svg>
      )}
  </span>
);

export default Cup;