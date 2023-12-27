import React from "react";

interface PropTypes {}

const IndicativeRateEmptyComponent: React.FC<PropTypes> = () => {
  return <div className="indicative-spinner-container">No Indicative Rate</div>;
};

export default IndicativeRateEmptyComponent;
