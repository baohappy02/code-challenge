import "./index.scss";

import { memo } from "react";
import { BeatLoader } from "react-spinners";

const AppLoadingContainer = () => {
  return (
    <div className="c__loading__container">
      <div className="c__loading__container-main">
        <BeatLoader />
      </div>
    </div>
  );
};

export default memo(AppLoadingContainer);
